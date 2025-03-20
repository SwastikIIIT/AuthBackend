'use client'
import React, { useState } from 'react'
import { Label } from './ui/label';
import { Button } from './ui/button';
import Link from 'next/link';
import { Input } from './ui/input';
import handleForgotPassword from '@/helper/formcontrols/handleForgotPassword';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordForm = () => {
  
  const [isSubmit, setSubmit] = useState(false);
    
  const forgotPassword = async(formData) => {
    setSubmit(true);
    const toastID = toast.loading("Processing request...", {
      description: "Sending password reset instructions"
    });
    try {
      const result = await handleForgotPassword(formData);
      if (result.success) {
        toast.success("Reset link sent", {
          id: toastID,
          description: result.message,
        });
      } else {
        toast.error("Request failed", {
          id: toastID,
          description: result.message,
        });
      }
    }
    catch(err) {
      toast.error("Failure", {id: toastID, description: err.message})
    }
    finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 500)
      setSubmit(false);
    }
  }
    
  return (
    <div className='flex flex-col gap-6'>
        
      <div className='flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent'>
          Forgot Password
        </h1>
        <p className='text-gray-400 text-sm max-w-xs'>
          Enter your email address and we'll send you a password reset link
        </p>
      </div>
        
      <form action={forgotPassword} className='grid gap-6'>
        <div className='grid gap-3'>
          <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
            <Mail size={16} className="text-purple-400" />
            Email
          </Label>
          <div className="relative">
            <Input 
              name="email" 
              type="email" 
              placeholder="vasu@example.com"
              className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
            />
          </div>
        </div>
           
        <Button 
          type="submit" 
          className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300" 
          disabled={isSubmit}
        >
          <span>{isSubmit ? "Sending..." : "Send Reset Link"}</span>
          <Send size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
           
        <div className='text-center text-gray-400 text-sm mt-2'>
          <Link 
            href='/login' 
            className='text-purple-400 hover:text-purple-300 transition-colors font-medium flex items-center gap-1 justify-center'
          >
            <ArrowLeft size={14} />
            <span>Back to login</span>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordForm;