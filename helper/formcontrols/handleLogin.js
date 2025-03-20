'use server';

import { signIn } from "@/auth";

;
export const handleLogin=async(formData,show2faField)=>{

    const email = formData.get("email");
    const password = formData.get("password");
    const twoFactorCode=formData.get("2fa");

    console.log("Form data:", [email, password]);

    if(!email || !password)
    {
      throw Error("Please provide all fields");
    }
        try
        {
          await signIn("credentials", {
          email: email,
          password: password,
          twoFactorToken:show2faField?twoFactorCode:"",
          redirect: false
          })

          return {success:true,message:"Logged in successfully"};
       }
       catch(err)
       {
          console.error("Login error:", err.cause.err.message)
          if(err.cause.err.message==="2FA_REQUIRED")
            return {twoFactorField:true,success:false,message:"Please enter your two-factor authentication code"};
          return {success:false,message:err.cause.err.message};
       }   
}