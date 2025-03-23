// app/api/user/update-avatar/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { auth } from "@/auth";
import { connectToMongo } from "@/utils/databse";
import User from "@/models/User";

export async function POST(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // With Next.js App Router, we need to handle file uploads differently
    const formData = await request.formData();
    const file = formData.get('avatar');
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: "No image file provided" 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${session.user.id}_${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, newFileName);

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Create URL for the image
    const imageUrl = `/uploads/${newFileName}`;

    // Connect to MongoDB and update user's avatar
    await connectToMongo();
    
    await User.updateOne(
      { _id: session.user.id },
      { $set: { image: imageUrl } }
    );

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error handling avatar upload:", error);
    return NextResponse.json({
      success: false,
      message: `Failed to update avatar: ${error.message}`
    }, { status: 500 });
  }
}