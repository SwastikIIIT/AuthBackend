'use server';

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { connectToMongo } from "@/utils/databse";
import User from "@/models/User";

export const handleSignup=async(formData)=>{

      const username=formData.get("username");
      const email=formData.get("email");
      const password=formData.get("password");

      console.log("Form data:", [username,email,password]);
     
      if(!username || !email)
        throw Error("Missing credentials");

     //connect with database
       await connectToMongo();
      
     const user=await User.findOne({email:email});
     console.log("User found:", user);

      if(user)
        throw Error("User already exists");
     
      else
      {
        const hashedPassword=await hash(password,10);
        await User.create({
          username:username,
          email:email,
          password:hashedPassword
        });
        return {ok:"success",message:"Account created successfully :)"};
        redirect("/login");
      }
  }