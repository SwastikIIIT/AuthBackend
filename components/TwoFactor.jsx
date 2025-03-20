'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';
import { Input } from './ui/input';
import { Label } from './ui/label';
import startSetup from '@/helper/eventHandler/startSetup';
import disable2FA from '@/helper/eventHandler/disable2FA';
import { toast } from 'sonner';
import handleVerify2FA from '@/helper/formcontrols/handleVerify2FA';
import { Shield, QrCode, Key, AlertCircle, CheckCircle, ArrowRight, PencilLine } from 'lucide-react';

const TwoFactorComponent = () => {
    
    const {data:session}=useSession();
    const [step,setStep]=useState('initial');
    const [secret,setSecret]=useState('');
    const [qrcode,setQrcode]=useState('');
    const [hasTwoFactor, setHasTwoFactor] = useState(false);


    useEffect(()=>{
         if(session?.user?.twoFactorEnabled)
          setHasTwoFactor(true);
    },[session])


    const handleVerify=async(formData)=>{
           const toastID=toast.loading("Processing request...", {
               description: "Verifying your authentication code"
           });
           formData.append("secret",secret);
           try
           {
               const result=await handleVerify2FA(formData);
               if(result.success)
               {
                     toast.success("Verification successful", {
                        id: toastID,
                        description: result.message
                     });
                     setHasTwoFactor(true);
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
           catch(err){
                   toast.error("Verification failed", {
                      id: toastID,
                      description: err.message
                   });
           } 
           finally
           {
               setTimeout(()=>{
                   toast.dismiss(toastID);
               },5000)
           }
    }

    const disable_2FA=async()=>{
          const toastID=toast.loading("Processing request...", {
              description: "Disabling two-factor authentication"
          });
           try
           {
                  const result=await disable2FA();
                  if(result.success)
                  {
                     toast.success("Two Factor Disabled", {
                        id: toastID,
                        description: result.message
                     });
                     setHasTwoFactor(false);
                  }
                  else
                  {
                      toast.error(result.message, {id: toastID});
                  }
           }
           catch(err){
               toast.error("Failed to disable 2FA", {
                  id: toastID,
                  description: err.message
               })
           }
           finally{
              setTimeout(()=>{
                  toast.dismiss(toastID);
              },5000)
           }
    }

    const setup2FA=async()=>{
         const toastID=toast.loading("Processing request...", {
             description: "Setting up two-factor authentication"
         });
         try
         {
               const result=await startSetup();
               if(result.success)
               {
                    setQrcode(result.qr);
                    setSecret(result.secret);
                    setStep("setup");
                    toast.success("Setup initiated", {
                        id: toastID,
                        description: "Scan the QR code with your authenticator app"
                    });
               }
               else
               {
                  toast.error("Setup Failed", {
                      id: toastID,
                      description: result?.message
                  });
               }
         }
         catch(err)
         {
           console.log(err);
           toast.error("Setup Failed", {id: toastID});
         }
         finally{
           setTimeout(()=>{
               toast.dismiss(toastID);
           },5000)
         }
    }
    
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
       
        <div className="flex flex-col items-center gap-2 text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Two-Factor Authentication
            </h1>
          
          <p className="text-gray-400 text-sm max-w-xs text-balance">
            Add an extra layer of security to your account
          </p>
        </div>

        {step === 'initial' && (
          <div className="grid gap-6">
              <div className="bg-black/40 p-4 rounded-lg border border-purple-900/40">
                  <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Shield size={16} className="text-purple-400" />
                    Why enable 2FA?
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Two-factor authentication adds an extra security layer to your account. 
                    Even if someone knows your password, they won't be able to access your account 
                    without the verification code from your authenticator app.
                  </p>
             </div>
          {hasTwoFactor ? (
             <>
                <div className="flex items-center gap-2 justify-center bg-black/30 p-3 rounded-lg border border-purple-900/30">
                  <CheckCircle size={18} className="text-green-400" />
                  <p className="text-gray-300 font-medium">Two-factor authentication is enabled</p>
                </div>
                <Button 
                  onClick={disable_2FA}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
                  <span>Disable Two-Factor Authentication</span>
                  <AlertCircle size={16} />
                </Button>
             </>
          ) : (
             <>
                <Button 
                  onClick={setup2FA}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
                  <span>Set Up Two-Factor Authentication</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
             </>
          )}
          </div>
        )}

        {step === "setup" && (
          <div className="grid gap-6 animate-fadeIn">
            
            <div className="bg-black/40 p-5 rounded-lg border border-purple-900/40">
              <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                <QrCode size={16} className="text-purple-400" />
                Step 1: Scan QR Code
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Scan this QR code with your authenticator app 
              </p>
              
              <div className="flex justify-center mb-4 bg-white p-3 rounded-lg">
                {qrcode && (
                   <Image
                      src={qrcode}
                      alt='QR code for 2FA'
                      height={200}
                      width={200}
                      className="rounded"
                   />
                )}
              </div>
              
              <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                <PencilLine size={16} className="text-purple-400" />
                No QR scanner?
              </h3>
              <p className="text-gray-400 text-sm">
                You can manually enter this secret key in your authenticator app:
              </p>
              <div className="bg-black/60 p-3 rounded-md border border-purple-900/40 mt-2 font-mono text-sm text-center break-all text-gray-300">
                {secret}
              </div>
            </div>
            
            <form action={handleVerify} className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="verificationCode" className="text-gray-300 flex items-center gap-2">
                  <Key size={16} className="text-purple-400" />
                  Verification Code
                </Label>
                <div className="relative">
                  <Input
                    name="token"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              
              <Button
                 type="submit" 
                 className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300">
                <span>Verify and Enable</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </form>
          </div>
      )}

      {step === "success" && (
        <div className="grid gap-6 animate-fadeIn">
          <div className="bg-black/40 p-5 rounded-lg border border-green-900/40">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-400" />
              </div>
            </div>
            <h3 className="font-medium text-gray-300 mb-2 text-center text-lg">Success!</h3>
            <p className="text-gray-400 text-sm text-center">
              Two-factor authentication has been successfully enabled on your account.
              From now on, you'll need to provide a verification code from your
              authenticator app when logging in.
            </p>
          </div>
          
          <div className="bg-black/40 p-5 rounded-lg border border-purple-900/40">
            <h3 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-purple-400" />
              Important
            </h3>
            <p className="text-gray-400 text-sm">
              If you lose access to your authenticator app, you'll need to use the 
              recovery options (like backup codes or email recovery) to regain access 
              to your account.
            </p>
          </div>
          
          <Button 
            onClick={() => window.location.href = "/auth-backend/settings"} 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>Return to Account</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      )}

    </div>
  )
}

export default TwoFactorComponent