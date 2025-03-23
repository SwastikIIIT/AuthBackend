import { auth } from "@/auth";
import User from "@/models/User";
import { connectToMongo } from "@/utils/databse";

export async function POST(req,res)
{
       try{
            
                const session=await auth();
                if(!session)
                   return Response.json({success:false,message:"User not authenticated",status:400});
                
                await connectToMongo();
                await User.findOneAndUpdate(
                    {email:session?.user?.email},
                {$set:{
                    twoFactorEnabled:false,
                    twoFactorSecret:null
                }});

                return Response.json({success:true,message:"Two factor authentication disabled successfully",status:200});
       }
       catch(err)
       {
          return Response.json({success:false,message:"Failed to disable two factor authentication",status:500});
       }
}