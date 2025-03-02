'use server';

import { signIn } from "@/auth";

;
export const handleLogin=async(formData)=>{

    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Form data:", [email, password]);

    if(!email || !password)
    {
      throw Error("Please provide all fields");
    }
        try
        {
          
          const result=await signIn("credentials", {
          email: email,
          password: password,
          redirect: false
          })
          return {success:true,message:"Logged in successfully"};
       }
       catch(err)
       {
          return err.cause;
       }
      
        
}