import { auth } from "@/auth";
import { Hero } from "@/components/hero";
import SignoutButton from "@/components/Signout";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { StarBorder } from "@/components/ui/star-border";
import { handleSession } from "@/helper/formcontrols/handleCookieSession";
import Link from "next/link";


export default async function Home() {
   
        const sessionUser=await auth();
   
  return (
    <div className="min-h-screen bg-black">
       <SplashCursor/>
       <BackgroundPaths  title="Authentication & Authorisation system"></BackgroundPaths>
    </div>
   );
}


    /* <Hero
      title="Welcome to My Website"
      subtitle="This is an authentication and authorisation system built by me"
      actions={[
        { label: "Get Started", href: "/start", variant: "primary",type:"starBorder" },
        { label: sessionUser?.user ? "Sign Out" : "Login", href: "/login" },
      ]}
    /> 
       {/* {(sessionUser?.user)? 
       (<SignoutButton/>)
       :(<> <Link href="/login"><Button className="cursor-pointer">Log In</Button></Link></>)} */
