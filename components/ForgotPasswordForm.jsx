'use client'
import React, { useState } from 'react'
import { Label } from './ui/label';
import { Button } from './ui/button';
import  Link  from 'next/link';
import { Input } from './ui/input';
import handleForgotPassword from '@/helper/handleForgotPassword';
import { toast } from 'sonner';

const ForgotPasswordForm=()=>{
  
   const [isSubmit,setSubmit]=useState(false);
    
    const forgotPassword=async(formData)=>{
          setSubmit(true);
          const toastID=toast.loading("Processing request...");
      try{
         const result=await handleForgotPassword(formData);
         if(result.success)
         {
          toast.success("Reset link sent", {
            id: toastID,
            description: result.message,
          });
        }
          else
          {
            toast.error("Request failed", {
              id: toastID,
              description: result.message,
            });
          }
      }
      catch(err){
          toast.error("Failure",{id:toastID,description:err.message})
      }
      finally{
        setTimeout(()=>{
          toast.dismiss(toastID);
        },500)
      }
      setSubmit(false);
    }
    
  return (
    <div className='flex flex-col gap-6'>
        
        <div className='flex flex-col  items-center text-center gap-2 mb-4'>
            <h1 className='text-2xl font-bold text-orange-400'>Forgot Password</h1>
            <p className='text-muted-foreground text-sm text-balance'>Enter your email address and we 'll send you a password reset link</p>
        </div>
        
        <form action={forgotPassword} className='grid gap-6'>
           <div className='grid gap-3'>
             <Label htmlFor="email">Email</Label>
             <Input name="email" type="email" placeholder="vasu@example.com" />
           </div>
           
           <Button type="submit" className="w-full bg-amber-500" disabled={isSubmit}>{isSubmit?"Sending...":"Send Reset Link"}</Button>
           
           <div className='text-center text-sm'>
            <Link href='/login' className='underline underline-offset-4'>Back to login</Link>
           </div>
        </form>

    </div>
  )
}

export default ForgotPasswordForm;