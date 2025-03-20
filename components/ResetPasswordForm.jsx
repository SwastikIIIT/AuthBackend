'use client'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import handleResetPassword from '@/helper/formcontrols/handleResetPassword'
import { Lock, KeyRound, ArrowRight } from 'lucide-react'

const ResetPasswordForm = ({token}) => {

  const [isSubmit, setSubmit] = useState(false);
  const router = useRouter();

  const resetPassword = async(formData) => {
    setSubmit(true);
    const toastID = toast.loading("Resetting Password...", {
      description: "Updating your credentials"
    });
    formData.append("token", token);
    try {
      const result = await handleResetPassword(formData);
      if (result.success) {
        toast.success("Password reset successful", {
          id: toastID,
          description: result.message
        })
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        toast.error("Reset Failed", {
          id: toastID,
          description: result.message
        })
      }
    }
    catch(err) {
      toast.error(err.message, {id: toastID});
    }
    finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 2000)
      setSubmit(false);
    }
  }

  return (
    <div className='flex flex-col gap-6'>
       
      <div className='flex flex-col items-center gap-2 text-center mb-6'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent'>
          Reset Password
        </h1>
        <p className='text-gray-400 text-sm max-w-xs'>
          Enter your new password below to secure your account
        </p>
      </div>

      <form action={resetPassword} className='grid gap-6'>
        <div className='grid gap-3'>
          <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
            <KeyRound size={16} className="text-purple-400" />
            New Password
          </Label>
          <div className="relative">
            <Input 
              type="password" 
              name="password" 
              placeholder="Enter new password"
              className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className='grid gap-3'>
          <Label htmlFor="confirmpassword" className="text-gray-300 flex items-center gap-2">
            <Lock size={16} className="text-purple-400" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input 
              type="password" 
              name="confirmpassword" 
              placeholder="Confirm password"
              className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
        >
          <span>{isSubmit ? "Resetting..." : "Reset Password"}</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordForm