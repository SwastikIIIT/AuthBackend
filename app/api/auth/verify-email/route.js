import { auth } from "@/auth";
import User from "@/models/User";
import VerifyEmail from "@/models/VerifyEmail";

import { connectToMongo } from "@/utils/databse";

export async function POST(req,res) {
    
    try
    {
        const session=await auth();
        if(!session)
            return Response.json({success:false,message:"User is not authenticated",status:400});
        
        const {code}=await req.json();
        if(!code)
            return Response.json({success:false,message:"Verification code is required",status:400});

        await connectToMongo();
       
       const user=await VerifyEmail.findOne({email:session?.user?.email});
       if(!user)
        return Response.json({success:false,message:"No verification code found. Please request a new one.",status:404});

       if (user?.token!==code)
        return Response.json({success:false,message:"Invalid verification code. Please try again.",status: 400});
    
       await User.findOneAndUpdate(
        {email:session?.user?.email},
        {$set:{isVerified:true}});

        await VerifyEmail.deleteOne({email:session?.user?.email})

        return Response.json({success:true,message:"Email successfully verified!",status:200});
    }
    catch(err)
    {
        return Response.json({success:false,message:"Email verification failed",status:500})
    }
}