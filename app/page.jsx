import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {decode,encode} from "next-auth/jwt";
import { cookies } from "next/headers";
export default async function   Home() {

  const userSessionData=await auth();
  console.log(userSessionData);

  const cook=(await cookies()).get("authjs.session-token");
  console.log("Cookie:",cook?.name);
  console.log("Cookie:",cook?.value);
  try {
    const decodedToken = await decode({
      token: cook?.value,
      salt:cook?.name,
      secret: process.env.AUTH_SECRET,
    });
    console.log("Decoded Token:", decodedToken);
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="font-bold">Hello friends!</h1>   
      
      <Link href="/login"><Button className="cursor-pointer">Log In</Button></Link>
    </div>
  );
}
