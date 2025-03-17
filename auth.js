import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import User from "./models/User";
import { compare } from "bcryptjs";
import { connectToMongo } from "./utils/databse";


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
        password: {  label: "Password", type: "password" }
      },

      async authorize(credentials) {
            
        const email = credentials?.email;
        const password = credentials?.password;

        console.log("Credentials received:",[email,password]);

        if(!email || !password)
            throw new CredentialsSignin({cause:"Missing credentials"});

          //connect to database
        await connectToMongo();

        const user=await User.findOne({email: email}).select('+password');
        console.log("User found:", user);
        if(!user)
            throw new CredentialsSignin({cause:"aisa user database me nahi hai"});
         
        const isMatch=await compare(password,user.password);
        console.log("Password match:", isMatch);
        
        if(!isMatch)
           throw new CredentialsSignin({cause:"password galat hai"});

        return user;
      } 
  })],
  pages: {
    signIn:'/login',
    signOut:'/'
  },
  // callbacks: {
  //   async signIn(user, account, profile) {
  //     if(account?.providers==='google')
  //     {
  //           try
  //           {
  //                 await connectToMongo();
  //                  const {email,name,image,id}=user;
  //                   const userExists=await User.findOne({email: email});
  //                   // if(userExists)
  //                   // throw new AuthError("User already exists");
  //                   // else
  //                   // await User.create({
  //                   //   email: email,
  //                   //   username: name,
  //                   //   image: image,
  //                   //   googleId: id
  //                   // });
  //                   return true;
  //           }
  //           catch(err)
  //           {
  //             throw new AuthError("Error signing in with Google");
  //           }
  //     }
  //     if(account?.provider==='credentials')
  //     return true;
  //     return false;
  //   },
    // session({ session, user }) {
    //   session.user.id = session.user.id
    //   return session
    // },
  }
)
