'use server';
import { auth } from "@/auth";
import {decode,encode} from "next-auth/jwt";
import { cookies } from "next/headers";

export const handleSession=async()=>{
  try{
    const session=await auth();
    console.log(session?.user);
    return session?.user;
  }
  catch(e)
  {
    console.log('Error in fetchin user session');
  }
}

export const handleCookie=async()=>{
 

    const cook=(await cookies()).get("authjs.session-token");
    console.log("Cookie:",cook?.name);
    console.log("Cookie:",cook?.value);
    try {
      const decodedToken = await decode({
        token: cook?.value,
        salt:cook?.name,
        secret: process.env.AUTH_SECRET,
      });
      console.log("Decoded Token:", decodedToken);
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
}