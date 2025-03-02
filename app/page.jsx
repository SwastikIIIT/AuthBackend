// 'use client'
import { auth } from "@/auth";
import SignoutButton from "@/components/Signout";
import { Button } from "@/components/ui/button";
// import {handleSession } from "@/helper/handleCookieSession";
import Link from "next/link";


export default async function Home() {
   
   const sessionUser=await auth();
   console.log(sessionUser);
   
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="font-bold">Hello friends!</h1>   
      {(sessionUser?.user)? 
      (<SignoutButton/>)
      :(<> <Link href="/login"><Button className="cursor-pointer">Log In</Button></Link></>)}

     
    </div>
  );
}
