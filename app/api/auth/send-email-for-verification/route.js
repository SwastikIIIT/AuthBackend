import { auth } from "@/auth";
import VerifyEmail from "@/models/VerifyEmail";
import { ObjectId } from 'mongodb';
import nodemailer from "nodemailer";

export async function GET(req)
{

    try
    {
        const session=await auth();
        if(!session)
            return Response.json({success:false,message:"User is not authenticated",status:400});

         //6 digit code
         const verificationCode=Math.floor(100000 + Math.random() * 900000).toString();

         //store the 6digit code in db
         await VerifyEmail.create({
            email:session?.user?.email,
            userID:new ObjectId(session?.id),
            token:verificationCode
         })

         const transporter=nodemailer.createTransport({
            service:"gmail",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
                }
          });

          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: session?.user?.email,
            subject: "Email Verification",
            html: `
              <h1>Email Verification</h1>
              <p>Please verify your email address to secure your account.</p>
              <p>Your verification code is: <strong>${verificationCode}</strong></p>
              <p>This code will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `,
          })

          return Response.json({success:true,message:"Verification code sent to your email",status:200})
        }
        catch(err)
        {
            return Response.json({success:false,message:"Failed to send verification code",status:500})
        }
}