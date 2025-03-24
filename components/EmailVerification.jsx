'use client'
import { AlertCircle, ArrowRight, CheckCircle, Mail, Send } from 'lucide-react';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner';
import sendEmail from '@/helper/eventHandler/sendEmail';
import handleCodeCheck from '@/helper/formcontrols/handleCodeCheck';
import fetchUserInfo from '@/helper/eventHandler/fetchUserInfo';

const EmailVerification = () => {

     const {data:session}=useSession();
     const [step,setStep]=useState('initial');
     const [userData,setUserData]=useState('');

     useEffect(()=>{
        const fetchUser=async()=>{
            const toastID = toast.loading("Processing request...");
              try {
                const result = await fetchUserInfo();
                  if(result.success)
                  {
                    toast.success("Loading successful",{id:toastID,description:result.message})
                    setUserData(result.userData);
                  } 
                  else
                  {
                    toast.error("Loading unsuccessful",{id:toastID,description:result.message});
                  }
              }
              catch(err)
              {
                console.log(err);
                toast.error("Loading unsuccessful", {id: toastID, description: "Failed to load user data"})
              }
              finally{
                setTimeout(() => {
                  toast.dismiss(toastID);
                },2000)
              }
          }
          fetchUser();
     },[session])

     const checkCode=async(formData)=>{
            const toastID = toast.loading("Processing request...", {
                description: "Verifying your code"
            });
          try{
                const result=await handleCodeCheck(formData);
                if(result.success)
                {
                    toast.success("Verification successful", {
                        id: toastID,
                        description: result.message
                    });
                    setStep("success");
                }
                else
                {
                    toast.error("Verification failed", {
                        id: toastID,
                        description: result.message
                    });
                }
          }
          catch(err)
          {
            toast.error("Verification failed", {
                id: toastID,
                description: err.message
            });
          }
          finally{
            setTimeout(() => {
                toast.dismiss(toastID);
            },3000);
          }
     }

     const verification=async()=>{
        const toastID=toast.loading("Processing request...");
        try{
             const response=await sendEmail();
             if(response.success)
             {
                 toast.success(response.message,{id:toastID})
                 setStep("verification");
             }
             else
             {
                  toast.error(response.message,{id:toastID});
             }
        }
        catch(err)
        {
            toast.error(err.message,{id: toastID,});
        }
        finally{
            setTimeout(()=>{
               toast.dismiss(toastID);
            },3000)
        }
     }

  return (
      <div className='flex flex-col gap-6 w-full max-w-md mx-auto'>
          <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Email Verification</h1>
                <p className="text-gray-400 text-sm max-w-xs text-balance">Verify your email address to secure your account</p>
            </div>

            {step==='initial' && (
              <div className='grid gap-6'>
                      <div className="bg-black/40 p-4 rounded-lg border border-purple-900/40">
                            <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Mail size={16} className="text-purple-400" />
                                Why verify your email?
                            </h3>
                            <p className="text-gray-400 text-sm">
                            Verifying your email address helps secure your account and allows you 
                            to recover your account if you forget your password.
                           </p>
                      </div>
                   

                   {userData?.isVerified ? (
                      <>
                           <div className="flex items-center gap-2 justify-center bg-black/30 p-3 rounded-lg border border-purple-900/30">
                                    <CheckCircle size={18} className="text-green-400" />
                                    <p className="text-gray-300 font-medium">Email address is verified</p>
                           </div>

                                <Link href="/auth-backend/settings">
                                    <Button 
                                        className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
                                    >
                                        <span>Return to Account Settings</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                                    </Button>
                                </Link>
                      </>
                   ):(
                    <>
                        <div className="flex items-center gap-2 justify-center bg-black/30 p-3 rounded-lg border border-red-900/30">
                                <AlertCircle size={18} className="text-red-400" />
                                <p className="text-gray-300 font-medium">Email address not verified</p>
                        </div>

                            <div className="bg-black/40 p-4 rounded-lg border border-purple-900/40">
                                <h3 className="font-medium text-gray-300 mb-2">Your Email</h3>
                                <p className="text-gray-300 bg-black/60 p-3 rounded-md border border-purple-900/40 break-all">
                                    {userData?.email}
                                </p>
                            </div>

                            <Button 
                                onClick={verification}
                                className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
                            >
                                        <span>Send Verification Code</span>
                                        <Send size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </>
                   )}
                </div>
            )}

            {step==="verification" && (
                <div className="grid gap-6 animate-fadeIn">
                    <div className="bg-black/40 p-5 rounded-lg border border-purple-900/40">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-full flex items-center justify-center">
                                <Mail size={32} className="text-purple-400" />
                            </div>
                        </div>
                        <h3 className="font-medium text-gray-300 mb-2 text-center text-lg">Verification Email Sent</h3>
                        <p className="text-gray-400 text-sm text-center">
                            We've sent a verification email to <span className="text-purple-400">{userData?.email}</span>. 
                            Please check your inbox and follow the link to verify your email address.
                        </p>
                    </div>
                    
                    <form action={checkCode} className="space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="verificationCode" className="text-gray-300 flex items-center gap-2">
                                <Mail size={16} className="text-purple-400" />
                                Verification Code
                            </Label>
                            <div className="relative">
                                <Input
                                    name="code"
                                    type="text"
                                    placeholder="Enter verification code"
                                    className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
                                />
                            </div>
                        </div>
                        
                        <Button
                            type="submit" 
                            className="cursor-pointer w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
                            <span>Verify Code</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </form>
                    </div>
            )}

            {step==='success' && (
                <div className="grid gap-6 animate-fadeIn">
                    <div className="bg-black/40 p-5 rounded-lg border border-green-900/40">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center">
                                <CheckCircle size={32} className="text-green-400" />
                            </div>
                        </div>
                        <h3 className="font-medium text-gray-300 mb-2 text-center text-lg">Success!</h3>
                        <p className="text-gray-400 text-sm text-center">
                            Your email address has been successfully verified.
                            You now have full access to all account features and recovery options.
                        </p>
                    </div>
                    
                    <Link href="/auth-backend/settings">
                        <Button  
                            className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
                        >
                            <span>Return to Account</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </Link>
                </div>
            )}
      </div>

  )
}

export default EmailVerification