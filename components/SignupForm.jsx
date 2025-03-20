"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { handleAuth } from "@/helper/formcontrols/handleAuth";
import { toast } from "sonner";
import { handleSignup } from "@/helper/formcontrols/handleSignup";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const SignupForm = () => {
  const signup = async (formData) => {
    const toastID = toast.loading("Signing up...");
    try {
      const result = await handleSignup(formData);

      if (result.ok === "success")
        toast.success(result.message, {
          id: toastID,
          description: "Your account has been successfully created. Welcome!",
          cancel: {
            label: "Later",
            onClick: () => toast.dismiss(),
          },
        });
    } catch (err) {
      if (err.message !== "NEXT_REDIRECT")
        toast.error(err.message, { id: toastID });
    } finally {
      setTimeout(() => {
        toast.dismiss(toastID);
      }, 500);
    }
  };

  const handleAuthLogin = async () => {
    try {
      await handleAuth();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form action={signup}>
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm max-w-xs">
            Join us and start your journey today
          </p>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
              <User size={16} className="text-purple-400" />
              Username
            </Label>
            <div className="relative">
              <Input 
                name="username" 
                type="text" 
                placeholder="Vasu Dixit" 
                className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
              <Mail size={16} className="text-purple-400" />
              Email
            </Label>
            <div className="relative">
              <Input 
                name="email" 
                type="email" 
                placeholder="vasu@example.com" 
                className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                <Lock size={16} className="text-purple-400" />
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
                type="password"
                placeholder="••••••"
                required
                className="pl-3 pr-3 py-2 bg-black/40 border-purple-900/40 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium py-2 flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>Create Account</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-purple-900/40"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-purple-900/40"></div>
          </div>
        </div>
      </form>

      <form action={handleAuthLogin}>
        <Button
          variant="outline"
          className="w-full border-purple-900/60 hover:border-purple-500 text-black hover:bg-purple-900/20 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 py-2"
        >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 hover:text-white"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor" // Use currentColor to inherit the text color
              />
            </svg>
          <span>Login with Google</span>
        </Button>
      </form>

      <div className="text-center text-gray-400 text-sm mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;