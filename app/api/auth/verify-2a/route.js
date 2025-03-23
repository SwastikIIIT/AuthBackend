import { auth } from "@/auth";
import User from "@/models/User";
import { connectToMongo } from "@/utils/databse";
import speakeasy from "speakeasy";

export async function POST(req,res)
{
      const {token,secret}=await req.json();

      try{
             const session=await auth();
             if(!session)
                return Response.json({success:false,message:"User not authenticated",status:400});

             //verify 6digitcode and secret
             const verificationStatus=speakeasy.totp.verify({
                secret:secret,
                encoding:"base32",
                token:token,
                window:1
             })

             if(!verificationStatus)
                return Response.json({success:false,message:"Invalid Verification Code",status:400});
              
             await connectToMongo();
             const user=await User.findOneAndUpdate(
                {email:session?.user?.email},
                {$set:{
                    twoFactorEnabled:true,
                    twoFactorSecret:secret
                }}
            );
        return Response.json({success:true,message:"Two Factor Authentication enabled",status:200});
      }
      catch(err)
      {
          return Response.json({success:false,message:"Failed to verify two factor authentication",status:500});
      }
}