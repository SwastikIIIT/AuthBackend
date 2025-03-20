import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import User from "./models/User";
import { compare } from "bcryptjs";
import { connectToMongo } from "./utils/databse";
import speakeasy from 'speakeasy';


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label:"Email", type: "text" },
        password: {  label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Code", type: "text" }
      },

      async authorize(credentials) {
            
        const email = credentials?.email;
        const password = credentials?.password;
        const twoFAcode=credentials?.twoFactorToken;

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
        
        if(!isMatch)
           throw new Error("Invalid Password");


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


           if(!verified)
            throw new Error("Invalid Two Factor Code");
        }

        return {
          id: user?._id.toString(),
          email: user?.email,
          name: user?.username,
          hasTwoFactor: user?.twoFactorEnabled
        };
      } 
  })],
  pages: {
    signIn:'/login',
    signOut:'/'
  },
  session:{
    strategy:"jwt"
  },
  callbacks: {
    async signIn({user, account, profile})
    {
      console.log("User in signIn callback:", user);
      console.log("Account in signIn callback:", account);
      console.log("Profile in signIn callback:", profile);
      if(account?.provider==='google')
      {
            try
            {   
                   await connectToMongo();
                   console.log("Mongo connected");
                   const {email,name,picture,sub}=profile;
                   console.log("profile:",{email,name,picture,sub});
                    const userExists=await User.findOne({email: email});
                   
                    if(!userExists)
                    {
                     const user= await User.create({
                        email: email,
                        username: name,
                        image: picture,
                        googleId: sub
                      });
                      console.log("New user created:", user);
                    }
                    return true;
            }
            catch(err)
            {
              throw new Error("Error signing in with Google",err);
            }
      }
      if(account?.provider === 'credentials') {
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
