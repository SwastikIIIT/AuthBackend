import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware running for path:", req.nextUrl.pathname);
  
  const authCookie = req.cookies.get('authjs.session-token');
  
  console.log("Auth cookie found:", !!authCookie);
  
  if (!authCookie) {
    const loginURL = new URL("/auth-backend", req.url);
    loginURL.searchParams.set("auth", "required");
    console.log("Redirecting to:", loginURL.toString());
    return NextResponse.redirect(loginURL);
  }

  console.log("User appears to be logged in, proceeding");
  return NextResponse.next();
}

export const config = {
  matcher: ["/auth-backend/dashboard/:path*", "/auth-backend/settings/:path*"]
};