'use client'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import handleResetPassword from '@/helper/handleResetPassword'

const ResetPasswordForm = ({token}) => {

     const [isSubmit,setSubmit]=useState(false);
     const router=useRouter();

     const resetPassword=async(formData)=>{
          setSubmit(true);
          const toastID=toast.loading("Resetting Password...");
          formData.append("token",token);
          try{
                const result=await handleResetPassword(formData);
                if(result.success)
                {
                     toast.success("Password reset successful",{
                         id:toastID,
                         description:result.message
                     })
                     setTimeout(()=>{
                          router.push("/login");
                       },1000);
                }
                else
                {
                    toast.error("Reset Failed",{
                         id:toastID,
                         description:result.message
                    })
                }
          }
          catch(err)
          {
              toast.error(err.message,{id:toastID});
          }
          finally{
              setTimeout(()=>{
                toast.dismiss(toastID);
              },2000)
              setSubmit(false);
          }
     }


  return (
       <div className='flex flex-col gap-6'>
       
            <div className='flex flex-col items-center gap-2 text-center mb-4'>
                <h1 className='text-2xl text-orange-400 font-bold'>Reset Password</h1>
                <p className='text-muted-foreground text-sm text-balance'>Enter your new password below</p>
            </div>

            <form action={resetPassword} className='grid gap-6'>
                 <div className='grid gap-3'>
                    <Label htmlFor="password">New Password</Label>
                    <Input type="password" name="password" placeholder="Enter new password"/>
                 </div>

                 <div className='grid gap-3'>
                    <Label htmlFor="confirmpassword">Confirm Password</Label>
                    <Input type="password" name="confirmpassword" placeholder="Confirm password"/>
                 </div>

                 <Button type="submit" className="w-full bg-amber-500">{isSubmit?"Resetting...":"Reset Password"}</Button>
            </form>
       </div>
  )
}

export default ResetPasswordForm