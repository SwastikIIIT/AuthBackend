import PasswordReset from "@/models/PasswordResets";
import User from "@/models/User";
import { connectToMongo } from "@/utils/databse";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req,res) {
    const {email}=await req.json();
    console.log(email);
    try
    {
        await connectToMongo();

        const user=await User.findOne({email});
        console.log("User Found:",user);
        if(!user)
        {
            return Response.json({success:false,message:"User does'nt exist in the database"},{status:404});
        }
    
        //created jsonwebtoken
        const token=jwt.sign({
            email:user?.email,
            id:user._id.toString(),
        },process.env.JWT_SECRET,{expiresIn:'1h'});
    
        await PasswordReset.create({
            email:email,
            token:token,
            userID:user._id
        })

        //resetLink with token to be sent via email
        const resetLink=`${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        
        const transporter=nodemailer.createTransport({
            service:"gmail",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
               }
        });

        await transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to:email,
            subject:"Password Reset Request",
            html: `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
        })
        return Response.json({success:true,message:"Link sent successfully"});
    }
    catch(err)
    {
        console.log(err);
        return Response.json({success:false, message: "Failed to send reset link" },
            { status: 500 });
    }
}
