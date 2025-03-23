"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react"; 
import Link from "next/link";
import { Shield, Lock, User, Mail, UserCircle, Image as ImageIcon, Key } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import fetchUserInfo from "@/helper/eventHandler/fetchUserInfo";
import { toast } from "sonner";
import uploadImage from "@/helper/eventHandler/uploadImage";

const SettingPage = () => {
    const {data:session} = useSession();
    const [userData,setUserData]=useState('');
    
    useEffect(()=>{
        const fetchUser=async()=>{
            const toastID=toast.loading("Processing request...");
            try
            {
                const result=await fetchUserInfo();
                if(result.success)
                {
                    toast.success("Loading successful",{id:toastID,description:result.message});
                    setUserData(result.userData);
                }
                else{
                    toast.error("Loading unsuccessful",{id:toastID,description:result.message});
                }
            }
            catch(err)
            {
                console.log(err);
                toast.error("Loadin unsuccessful",{id:toastID,description:result.message})
            }
            finally{
                setTimeout(()=>{
                    toast.dismiss(toastID);
                },4000)
            }
        }
        fetchUser();
    },[session])


    return (
        <div className="min-h-screen bg-black pb-16">
            <div className="relative z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 h-36 w-96 rounded-full bg-purple-600/40 opacity-70 blur-3xl" />
            </div>

            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto pt-12 px-4 relative z-10"
            >
                <h1 className="text-3xl md:text-4xl text-white font-bold mb-8 border-b border-purple-900/40 pb-4">
                    Account Settings
                </h1>
                
                {/* Profile Settings Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <Card className="mb-8 bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
                        
                        <CardHeader className="border-b border-purple-900/30">
                            <div className="flex items-center space-x-3">
                                <User size={22} className="text-purple-500 mb-3"/>
                                <div>
                                    <CardTitle className="text-white text-xl">Profile Information</CardTitle>
                                    <CardDescription className="text-gray-400 pb-4">Your personal information</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="py-4">
                           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    
                                <div className="flex flex-col items-center w-full md:w-auto">
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-purple-900/20 border-2 border-purple-600/60 flex items-center justify-center overflow-hidden">
                                    {userData?.image ? (
                                            <img 
                                                src={session?.user?.image} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserCircle size={80} className="text-purple-500" />
                                        )}
                                    </div>

                                <div className="mt-4 flex gap-2">
                                    <Button 
                                        variant="outline"
                                       className="text-xs md:text-sm text-black cursor-pointer border-purple-600/60 hover:bg-purple-900/30 hover:text-white flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-2"
                                        onClick={()=>{}}
                                    >
                                        <ImageIcon size={16} />
                                        <span>Change Avatar</span>
                                    </Button>
                                </div>
                                </div>

                                {/* User Information Section */}
                                <div className="flex-1 space-y-6 w-full">
                                    <div className="bg-purple-900/10 rounded-md border border-purple-900/20 p-3 md:p-5 space-y-4">
                                        <div className="flex flex-col space-y-1">
                                            <Label className="text-gray-400 text-sm">User ID</Label>
                                            <div className="flex items-center gap-2 text-white bg-purple-900/20 p-2 rounded overflow-hidden">
                                                <code className="text-xs md:text-sm font-mono truncate">
                                                    {userData?._id || "N/A"}
                                                </code>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-gray-400 text-sm">Name</Label>
                                                <div className="flex items-center gap-2 text-white bg-purple-900/20 p-3 rounded">
                                                    <User size={16} className="text-purple-500" />
                                                    <span className="text-sm md:text-base truncate">{userData?.username || "N/A"}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-gray-400 text-sm">Email</Label>
                                                <div className="flex items-center gap-2 text-white bg-purple-900/20 p-3 rounded">
                                                    <Mail size={16} className="text-purple-500" />
                                                    <span className="text-sm md:text-base truncate">{userData?.email || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Security Settings Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Card className="mb-8 bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
                        <CardHeader className="border-b border-purple-900/30">
                            <div className="flex items-center space-x-3">
                                <Shield size={22} className="text-purple-500 mb-3"/>
                                <div>
                                    <CardTitle className="text-white text-xl">Security Settings</CardTitle>
                                    <CardDescription className="text-gray-400 pb-4">Manage your account security options</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="pt-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 px-3 rounded-md hover:bg-purple-900/20 transition-colors">
                                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                                   <Key size={18} className="text-purple-500"/>
                                   <div>
                                        <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                                        <p className="text-gray-400">
                                            {userData?.twoFactorEnabled 
                                                ? "Two-factor authentication is currently enabled"
                                                : "Add an extra layer of security to your account"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Link href="/2FA">
                                    <Button className={`cursor-pointer ${userData?.twoFactorEnabled 
                                        ? "bg-red-600 hover:bg-red-700" 
                                        : "bg-purple-600 hover:bg-purple-700"} text-white transition-colors`}>
                                        {userData?.twoFactorEnabledcls  ? "Disable 2FA" : "Enable 2FA"}
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* Add password change option here */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 px-3 mt-4 border-t border-purple-900/20 rounded-md hover:bg-purple-900/10 transition-colors">
                                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                                    <Lock size={18} className="text-purple-500" />
                                    <div>
                                      <h3 className="text-lg font-medium text-white flex items-center">Change Password</h3>
                                      <p className="text-gray-400">Update your password</p>
                                    </div>
                                </div>
                                <Link href='/forgot-password'>
                                    <Button variant="outline" className="cursor-pointer border-purple-600/60 text-black hover:bg-purple-900/30 hover:text-white transition-colors">
                                        Change Password
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SettingPage;