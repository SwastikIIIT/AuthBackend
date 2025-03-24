'use server';

import { hash } from "bcryptjs";
import { connectToMongo } from "@/utils/databse";
import User from "@/models/User";

export const handleSignup=async(formData)=>{

      const username=formData.get("username");
      const email=formData.get("email");
      const password=formData.get("password");
      const strength=await passwordStrength(password);


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
          passwordStrength:strength,
          password:hashedPassword
        });
        return {ok:"success",message:"Account created successfully :)"};
        // redirect("/login");
      }
  }

export const passwordStrength=async(password)=>{

     let c=0;
     if(password.length>=6)c++;
     if(password.length>=10)c++;
     if (/[A-Z]/.test(password))c++;
     if (/[a-z]/.test(password)) c++; 
     if (/[0-9]/.test(password)) c++;
     if (/[^A-Za-z0-9]/.test(password)) c++;

     const weakPatterns = [
      'password', '123456', 'qwerty', 'abc123', 'letmein',
      'admin', 'welcome', 'monkey', 'sunshine', 'password1'
    ];

     const flag=weakPatterns.some((item)=>{
         return password.toLowerCase().includes(item);
     })
      if(flag)
      c++;

      if(c==7)
      return "Strong";
      else if(c>=3)
      return "Moderate";
      else
      return "Weak";
}