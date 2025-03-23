import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    // Log the request details for debugging
    console.log("Middleware running for path:", req.nextUrl.pathname);
    
    try {
        const loginToken = await getToken({
            req, 
            secret: process.env.AUTH_SECRET
        });
        
        console.log("Token details:", JSON.stringify(loginToken, null, 2));
        
        if (!loginToken) {
            // Create a relative URL based on current host
            const loginURL = new URL("/auth-backend", req.url);
            loginURL.searchParams.set("auth", "required");
            console.log("Redirecting to:", loginURL.toString());
            return NextResponse.redirect(loginURL);
        }
        
        console.log("User is authenticated, proceeding");
        return NextResponse.next();
    } catch (error) {
        console.error("Error in middleware:", error);
        // Create a relative URL based on current host
        const loginURL = new URL("/auth-backend", req.url);
        return NextResponse.redirect(loginURL);
    }
}
   
export const config={
    matcher:["/auth-backend/dashboard/:path*","/auth-backend/settings/:path*"]
}

// export { auth as middleware } from "@/auth"

//koi bhi user jo authenticated ya logged in hai vhi aa payega /dashboard vale kisi bhi routes pe non registered vale redirected to /login