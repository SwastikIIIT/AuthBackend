"use client";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const search = useSearchParams();
  const token = search.get("token");
  const router = useRouter();

  useEffect(() => {
    if(!token)
      {
        // toast.error("Invalid request",{
        //   description:"No reset token",
        // }); //nhi  aa rha hai ye fix karna hai
       
        setTimeout(() => {
        router.push("/forgot-password");
       },1000); 
    }
  },[token]);

  if(!token){
    return null;
  }
  return(
  <ResetPasswordForm token={token}/>
  );
};

export default ResetPasswordPage;
