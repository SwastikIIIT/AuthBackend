'use client';
import React from 'react'
import { handleSignout } from '@/helper/handleSignout'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const SignoutButton = () => {
 const router=useRouter();
  return (
  <form action={async()=>{
    const toastID=toast.loading("Loggin out...");
        try{
              await handleSignout();
              toast.success("User Logged out successfully",{id:toastID});
              setTimeout(()=>{
              toast.dismiss(toastID);
              },1000)
              router.refresh();
        }
        catch(e)
        {
             console.log(e);
        }
  }}>
    <Button className="cursor-pointer">Sign out</Button>
    </form>
  )
}

export default SignoutButton