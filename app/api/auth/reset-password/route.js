import PasswordReset from "@/models/PasswordResets";
import User from "@/models/User";
import { connectToMongo } from "@/utils/databse";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(req) {
     const {token,password}=await req.json();
     console.log({"token":token,
      "password":password
     })


     try{
          try
          {
             var decodedToken=jwt.verify(token,process.env.JWT_SECRET);
          }
          catch(e)
          {
            return Response.json({success:false,message:"Invalid token or expired token verification"},{status:"400"});
          }

          await connectToMongo();

          const tokenDoc=await PasswordReset.findOne({token});
          if(!tokenDoc)
            return Response.json({success:false,message:"Invalid or expired token not in doc"},{status:"400"});

          const hashedPassword=await hash(password,10);
          await User.updateOne(
            {_id:new ObjectId(decodedToken.id)},
            {$set:{password:hashedPassword}}
          )

          await PasswordReset.deleteOne({_id:tokenDoc._id});

          const user=await User.findOneAndUpdate(
            {email:decodedToken.email},
            {$set:{passwordLastChanged:new Date()}}
          );

        return Response.json({success:true,message:"Password reset successfully"}); 
     }
     catch(err)
     {
        console.log(err);
        return Response.json({success: false, message:"Failed to reset password"},{
        status: 500});
     }
}
