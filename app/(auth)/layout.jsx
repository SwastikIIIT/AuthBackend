import React from 'react';
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Column with Content */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-black relative overflow-hidden">
        {/* Purple Glow Effects */}
        <div className="absolute top-0 isolate z-0 flex w-full flex-1 items-start justify-center">
          {/* Top blur effect */}
          <div className="absolute top-0 z-50 h- 30w-full bg-transparent opacity-10 backdrop-blur-md" />
          
          {/* Main glow */}
          <div className="absolute inset-auto z-40 h-36 w-[28rem] -translate-y-[-30%] rounded-full bg-purple-600/60 opacity-80 blur-3xl" />
          
          {/* Lamp effect */}
          <div className="absolute top-0 z-30 h-30 -translate-y-[20%] rounded-full bg-purple-600/60 blur-2xl w-40" />
          
          {/* Top line */}
          <div className="absolute inset-auto z-50 h-0.5 -translate-y-[-10%] bg-purple-600/60 w-96" />
          
          {/* Left gradient cone */}
          <div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-45 overflow-visible w-[30rem] bg-gradient-conic from-purple-600/60 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-full left-0 bg-black h-30 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-30 h-full left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </div>
          
          {/* Right gradient cone */}
          <div
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-45 w-[30rem] bg-gradient-conic from-transparent via-transparent to-purple-600/60 [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-30 h-full right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-full right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </div>
        </div>
        
        {/* Logo and Title */}
        <div className="relative z-10 flex justify-center gap-2 md:justify-start">
          <Image
            src="/logo.svg"
            width={40}
            height={40}
            alt="Logo"
          />
          <Link href="/auth-backend" className="relative group">
             <span className="font-bold text-2xl lg:text-2xl xl:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100">
                Auth Backend
              </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
          <div className="w-full max-w-md bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-purple-900/40 shadow-lg shadow-purple-600/20">
            {children}
          </div>
        </div>
      </div>
      
      {/* Right Column with Image */}
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        <Image
          src="/layout2.svg" 
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;