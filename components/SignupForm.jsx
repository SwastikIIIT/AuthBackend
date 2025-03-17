'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleSignup } from "@/helper/handleSignup";
import { handleAuth } from "@/helper/handleAuth";
import { toast } from "sonner";


const SignupForm=()=>{

   const signup=async(formData)=>{
    const toastID=toast.loading("Signing up...");
      try{
             const result=await handleSignup(formData);
             if(result.ok==="success")
              toast.success(result.message,{id:toastID});
      }
      catch(err)
      {
        if(err.message!=="NEXT_REDIRECT")
        toast.error(err.message,{id:toastID});
      }
      finally{
        setTimeout(()=>{
        toast.dismiss(toastID);
        },500)
      }
  }


  const handleAuthLogin=async()=>{
    try{
        await handleAuth();
    }
    catch(err)
    {
      toast.error(err.message);
    }
  }
  
    return (
    <div className="flex flex-col gap-6">
    <form action={signup}>
      <div className="flex flex-col items-center gap-2 text-center mb-4">
        <h1 className="text-2xl font-bold text-orange-400">Signup your account</h1>
        {/* <p className="text-muted-foreground text-sm text-balance">
          Enter the details below to signup to your account
        </p> */}
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input name="username" type="text" placeholder="Vasu Dixit"  />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="vasu@example.com"  />
        </div>


        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a> */}
          </div>
          <Input name="password" type="password" required/>
        </div>

        <Button type="submit" className="w-full bg-amber-500">
          Create Account
        </Button>
        
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
      </div>
    </form>

      <form action={handleAuthLogin}>
        <Button variant="outline" className="w-full text-orange-400 border-orange-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Signup with Google
        </Button>
        </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">Login</Link>
      </div>
    </div>
  );
}

export default SignupForm;
