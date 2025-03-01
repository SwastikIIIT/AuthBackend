import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm"
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function LoginPage() {

  const userSessionData=await auth();
  if(userSessionData?.user)
  redirect("/");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        <div className="flex justify-center gap-2 md:justify-start">
        <Image
          src="/blog.png"
          width={40}
          height={40}
          alt="Logo"
        />
          <Link href="/" className="font-semibold text-transparent text-3xl sm:text-2xl xl:text-3xl bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-400 to-yellow-700 bg-transparent h-full">Post Pilot</Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>

      </div>

      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/login.jpg"
          alt="Image"
          width={500}
          height={800}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
    );
}
