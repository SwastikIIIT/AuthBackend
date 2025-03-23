import { auth } from "@/auth";
import qrcode from 'qrcode';
import speakeasy from "speakeasy";

export async function GET(req,res)
{
       try
       {
            const session=await auth();
            if(!session)
            return Response.json({success:false,message:"User not authenticated",status:"400"});

        //secret generation
        const secret=speakeasy.generateSecret({
            length:16,
            name:`AuthBackend:${session?.user?.email}`
        });

        //generate qrcode
            const QRCode=await qrcode.toDataURL(secret.otpauth_url)

        return Response.json({success:true,secret:secret.base32,qr:QRCode});
      }
      catch(err)
      {
         return Response.json({success:false,message:"Failed to setup two factor authentication",status:500});
      }
}
