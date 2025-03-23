'use client'
import React, { useState } from 'react';
import { Settings, Home, LayoutDashboard, LogIn, UserPlus, LogOut } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { handleSignout } from '@/helper/formcontrols/handleSignout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Navbar = ({session}) => {
    const [activeTab, setActiveTab] = useState('home');
    const router=useRouter();
    console.log("Session from Navbar",session);

    const signout=async()=>{
      const toastID=toast.loading("Logging out...");
      try{
            await handleSignout();
            toast.success("User Logged out successfully",{id:toastID});
            setTimeout(()=>{
            toast.dismiss(toastID);
            },1000)
            router.refresh();
      }
      catch(e)
      {
           console.log(e);
      }
    }

    const tabs = [
        { id: '', label: 'Home', icon: Home },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="bg-black border-b border-purple-900/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.svg" alt="Auth Logo" width={40} height={40} className="animate-pulse" />
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                                Auth Backend
                            </span>
                        </div>
                        <div className="hidden md:block ml-10">
                            <div className="flex space-x-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                      <Link href={`/auth-backend/${tab.id}`} key={tab.id}>
                                        <button
                                           
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`${
                                                activeTab === tab.id
                                                    ? 'bg-purple-900/50 text-white'
                                                    : 'text-gray-300 hover:bg-purple-800/30 hover:text-white'
                                            } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors cursor-pointer`}
                                        >
                                            <Icon size={18} />
                                           <span>{tab.label}</span>
                                        </button>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {(session?.user)?(
                          <button
                            onClick={signout}
                                className="flex text-white items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                <LogOut size={18}/>
                                <span>Signout</span>
                            </button>
                        ) : (
                            <>
                            <Link href="/login">
                                <button
                                    className="flex cursor-pointer text-white items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </button>
                            </Link>
                            <Link href="/signup">
                                <button className="flex cursor-pointer text-white items-center space-x-2 bg-black border border-purple-600/60 hover:bg-purple-900/30 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    <UserPlus size={18} />
                                    <span>Sign Up</span>
                                </button>
                              </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar