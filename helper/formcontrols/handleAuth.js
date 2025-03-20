'use server';

import { signIn } from "@/auth";

export const handleAuth=async()=>{
     await signIn('google',{
          redirect:true,
          redirectTo:"/"
     });  
} 