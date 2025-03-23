import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){

    const loginToken=await getToken({req,secret:process.env.AUTH_SECRET});
    if(!loginToken)
        {
            const loginURL=new URL("/auth-backend",req.url);  //req.url==base url  
            loginURL.searchParams.set("auth","required");
            return  NextResponse.redirect(loginURL);
        }
        console.log(`Login Token at ${req.url} and ${loginURL}`,loginToken);
    return NextResponse.next();
}
   
export const config={
    matcher:["/auth-backend/dashboard/:path*","/auth-backend/settings/:path*"]
}

// export { auth as middleware } from "@/auth"

//koi bhi user jo authenticated ya logged in hai vhi aa payega /dashboard vale kisi bhi routes pe non registered vale redirected to /login