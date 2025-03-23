import { auth } from "@/auth";
import User from "@/models/User";
import { connectToMongo } from "@/utils/databse";

export async function GET(req,res) {
    
    try
    {
        const session=await auth();
        if(!session)
            return Response.json({success:false,message:"User is not authenticated",status:400});

        await connectToMongo();
        
        const user=await User.findOne({email:session?.user?.email});

        if(!user)
            return Response.json({success:false,message:"User not found",status:400});
        
        return  Response.json({success:true,user:user,message:"Successful user fetching",status:200})
    }
    catch(err)
    {
         return Response.json({success:false,message:"Failed to fetch user data from database",status:500});
    }
}