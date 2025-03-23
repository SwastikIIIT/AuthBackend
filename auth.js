import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import User from "./models/User";
import { compare } from "bcryptjs";
import { connectToMongo } from "./utils/databse";
import speakeasy from 'speakeasy';
import recordLoginHistory from "./helper/eventHandler/recordLoginHistory";
import crypto from "crypto"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label:"Email", type: "text" },
        password: {  label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Code", type: "text" }
      },

      async authorize(credentials,req) {
            
        const email = credentials?.email;
        const password = credentials?.password;
        const twoFAcode=credentials?.twoFactorToken;

        const response = await fetch('https://api.ipify.org?format=json');
        const ipAddress=await response.json();
        
        // console.log(ipAddress?.ip);
       
        console.log("Credentials received:",[email,password,twoFAcode]);

        if(!email || !password)
            throw new Error("Missing credentials");

        //connect to database
        await connectToMongo();

        const user=await User.findOne({email: email}).select('+password');
        console.log("User found:", user);
        if(!user)
            throw new Error("User not found in database");
         
        const isMatch=await compare(password,user.password);
        console.log("Password match:", isMatch);
        
        //representing failed login for that email
        if(!isMatch)
        {
           await recordLoginHistory(user,ipAddress?.ip,false);
           await user.save();
           throw new Error("Invalid Password");
        }

        if(user.twoFactorEnabled)
        {
          console.log("2FA is enabled for the user");
          console.log("Two Factor Code received:", twoFAcode);
          if(!twoFAcode)
            {
              console.log("Two Factor Code is required cccscascascc");
              throw new Error("2FA_REQUIRED");
           }
          //  verify 2FA CODE
          const verified=speakeasy.totp.verify({
            secret:user?.twoFactorSecret,
            encoding:"base32",
            token:twoFAcode,
            window:1
          });

          //representing failed login via 2fa code
           if(!verified)
           {
              await recordLoginHistory(user,ipAddress?.ip,false);
              await user.save();
              throw new Error("Invalid Two Factor Code");
           }
        }


        //successful login
        await recordLoginHistory(user,ipAddress?.ip,true);
        user.lastLogin=new Date();
        await user.save();
       
        console.log("User after updation",user);
        return {
          id: user?._id.toString(),
          email: user?.email,
          name: user?.username,
          lastLogin:user?.lastLogin,
          image:user?.image,
          passwordLastChanged:user?.passwordLastChanged,
          hasTwoFactor: user?.twoFactorEnabled
        };
      } 
  })],
  pages: {
    signIn:'/login',
  },
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: process.env.NODE_ENV === 'production'
  //     }
  //   }
  // },
  session:{
    strategy:"jwt"
  },
  callbacks: {
    async signIn({user,account,profile})
    {
      console.log("User in signIn callback:", user);
      console.log("Account in signIn callback:", account);
      console.log("Profile in signIn callback:", profile);

      
      if(account?.provider==='google')
      {
            try
            {   
                   await connectToMongo();
                   const {email,name,picture,sub}=profile;
                   console.log("Mongo connected");
                   console.log("profile:",{email,name,picture,sub});
                    const userExists=await User.findOne({email: email});
                   
                    if(!userExists)
                    {
                        const response = await fetch('https://api.ipify.org?format=json');
                        const ipAddress=await response.json();
                        const user= await User.create({
                          email: email,
                          username: name,
                          password:crypto.randomBytes(16).toString('hex').slice(0,16),
                          image: picture,
                          googleId: sub,
                          lastLogin:new Date(),
                        });
 
                        await recordLoginHistory(user,ipAddress?.ip,true);
                        // await user.save();
                        console.log("New user created:", user);
                      }
                      else
                      {
                        userExists.lastLogin=new Date();
                        await userExists.save();
                      }
                    return true;
            }
            catch(err)
            {
               console.log("Error signing in with Google",err);
            }
         return true;
      }
      if(account?.provider==='credentials') {
        return true;
      }
      return false;
    },
    async jwt({token,user})
    {
        if(user)
        {
           token.id=user?.id;
           token.hasTwoFactor=user?.hasTwoFactor;
           token.email = user?.email;  
           token.name = user?.name;
           token.image = user?.image;
           token.lastLogin=user?.lastLogin;
           token.passwordLastChanged=user?.passwordLastChanged;
        }
        return token;
    },
    async session({ session, user ,token}) {
      if(token)
      {
        session.user.id = token?.id;
        session.user.hasTwoFactor=token?.hasTwoFactor;
        session.user.email=token?.email;
        session.user.name=token?.name;
        session.user.image=token?.image;
        session.user.lastLogin=token?.lastLogin;
        session.user.passwordLastChanged=token?.passwordLastChanged;
      }
      // if(user)
      // {
      //    session.user.id=user?.id;
      //    session.user.email=user?.email;
      //    session.user.name=user?.name;
      // }
      return session
    },
  },
})
