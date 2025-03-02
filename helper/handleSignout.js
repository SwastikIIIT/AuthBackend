'use server';
import { signOut } from "@/auth";
import { toast } from "sonner";


export const handleSignout=async()=>{
    
    try{
        await signOut();
       
    }
    catch(Err)
    {
        console.log(Err);
    }
}