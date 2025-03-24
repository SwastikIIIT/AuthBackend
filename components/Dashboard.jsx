"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Activity, Clock, UserCircle, Calendar, Mail, Key, Shield, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import fetchUserInfo from "@/helper/eventHandler/fetchUserInfo";

const DashboardPage = () => {
  const {data:session} = useSession();
  const [userInfo, setUserInfo] = useState(null);
  

  useEffect(()=>{
    const fetchUser=async()=>{
      const toastID = toast.loading("Processing request...");
        try {
          const result = await fetchUserInfo();
            if(result.success)
            {
              toast.success("Loading successful", {id: toastID, description: result.message})
              setUserInfo(result.userData);
            } 
            else
            {
              toast.error("Loading unsuccessful", {id: toastID, description: result.message});
            }
        }
        catch(err)
        {
          console.log(err);
          toast.error("Loading unsuccessful", {id: toastID, description: "Failed to load user data"})
        }
        finally{
          setTimeout(() => {
            toast.dismiss(toastID);
          },2000)
        }
    }
    fetchUser();
  }, [session]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const calculateAccountAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now-created);
    const diffDays = Math.ceil(diffTime/(1000*60*60*24));
    return diffDays;
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    
    return Math.floor(seconds) + " second" + (Math.floor(seconds) === 1 ? "" : "s") + " ago";
  };

   console.log("User Info:",userInfo);
   
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
           Dashboard
        </h1>

       
        {/* UserCard */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="relative bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className=" overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/30 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/20 rounded-full translate-x-6 translate-y-6 blur-xl" />
                
                <div className="relative z-10 p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                            <div className="w-30 h-30 rounded-full bg-purple-900/20 border-2 border-purple-600/60 flex items-center justify-center overflow-hidden">
                            {userInfo?.image ? (
                                  <img 
                                    src={userInfo?.image} 
                                    alt={`${userInfo.username || 'User'}'s profile`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserCircle size={80} className="text-purple-500" />
                            )}
                          </div>
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-3 text-center md:text-left">
                        {userInfo?.username || "N/A"}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <Mail size={16} className="text-purple-500" />
                        <p className="text-gray-400">
                          {userInfo?.email || "N/A"}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-10 mt-4">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Calendar size={16} className="text-purple-500 flex-shrink-0" />
                          <span className="text-gray-300">Member since:</span>
                          <span className="text-white">{formatDate(userInfo?.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <Key size={16} className="text-purple-500 flex-shrink-0" />
                          <span className="text-gray-300">2FA Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${userInfo?.twoFactorEnabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {userInfo?.twoFactorEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Account Stats Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full">
              <CardHeader className="border-b border-purple-900/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock size={22} className="text-purple-500" />
                  <CardTitle className="mb-1 text-white">Account Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                    <h3 className="text-gray-400 text-sm mb-1">Account Age</h3>
                    <p className="text-2xl font-bold text-white">
                      {calculateAccountAge(userInfo?.createdAt)} days
                    </p>
                  </div>
                  
                  <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                    <h3 className="text-gray-400 text-sm mb-1">Last Login</h3>
                    <p className="text-md font-bold text-white">
                      {timeAgo(userInfo?.lastLogin)}  
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Email Verified</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${userInfo?.isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {userInfo?.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Two-Factor Authentication</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${userInfo?.twoFactorEnabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {userInfo?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Password Changed</span>
                    <span className="text-gray-400 text-sm">
                      {timeAgo(userInfo?.passwordLastChanged)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all h-full">
              <CardHeader className="border-b border-purple-900/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Activity size={22} className="text-purple-500" />
                  <div>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                      Your latest account activities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {userInfo?.lastLogin && (
                    <div className="flex items-start bg-purple-900/10 p-3 rounded border border-purple-900/30">
                      <div className="mt-1 rounded-full p-1 bg-green-500/20 mr-3">
                        <Key size={14} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Successful login</p>
                        <p className="text-gray-400 text-xs">{formatDateTime(userInfo?.lastLogin)}</p>
                      </div>
                    </div>
                  )}
                  
                  {userInfo?.passwordLastChanged && (
                    <div className="flex items-start bg-purple-900/10 p-3 rounded border border-purple-900/30">
                      <div className="mt-1 rounded-full p-1 bg-blue-500/20 mr-3">
                        <Shield size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Password updated</p>
                        <p className="text-gray-400 text-xs">{formatDateTime(userInfo?.passwordLastChanged)}</p>
                      </div>
                    </div>
                  )}
                  
                  {!userInfo?.loginHistory? (
                    <div className="text-center py-6">
                      <p className="text-gray-400">No recent activity to display</p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Login History */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader className="border-b border-purple-900/30">
              <div className="flex items-center space-x-3 mb-4">
                <Shield size={22} className="text-purple-500" />
                <div>
                  <CardTitle className="text-white">Login History</CardTitle>
                  <CardDescription className="text-gray-400">
                    Recent account access attempts
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {(!userInfo?.loginHistory)?(
                <div className="text-center py-8">
                  <p className="text-gray-400">No login history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-purple-900/30">
                      <tr>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">Date & Time</th>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">IP Address</th>
                        <th className="text-left pb-3 text-gray-400 text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userInfo?.loginHistory?.slice(0,5).map((item,key)=>(
                        <tr key={key} className="border-b border-purple-900/10">
                          <td className="py-3 text-gray-300 text-sm">{formatDateTime(item.timestamp)}</td>
                          <td className="py-3 text-gray-300 text-sm">
                            <div className="flex items-center">
                              <MapPin size={14} className="text-purple-500 mr-1" />
                              {item.ipAddress || "Unknown"}
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.success? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                              {item.success ? "Success" : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Alerts */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-black border border-purple-900/40 shadow-lg hover:shadow-purple-900/20 transition-all">
            <CardHeader className="border-b border-purple-900/30">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle size={22} className="text-purple-500" />
                <div>
                  <CardTitle className="text-white">Security Insights</CardTitle>
                  <CardDescription className="text-gray-400">
                    Security status of your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Failed Login Attempts */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Failed Login Attempts</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      userInfo?.loginHistory?.filter(login=>!login.success).length>0 
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {(userInfo?.loginHistory?.filter(item=>!item.success))?.length || 0} attempts
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {(userInfo?.loginHistory?.filter(item=>!item.success))?.length > 0 
                      ? "There have been unsuccessful login attempts. Monitor your account closely." 
                      : "No failed login attempts detected. Your account is secure."}
                  </p>
                </div>
                
                {/* Last Password Change */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Password Age</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      calculateAccountAge(userInfo?.passwordLastChanged) > 20
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {calculateAccountAge(userInfo?.passwordLastChanged) || 0} days
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {calculateAccountAge(userInfo?.passwordLastChanged)>20
                      ? "Your password was last changed over 20 days ago. Consider updating it." 
                      : "Your password was updated recently."}
                  </p>
                </div>
                
                {/* Email Verification */}
                <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Email Verification</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      userInfo?.isVerified
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {userInfo?.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {userInfo?.isVerified
                      ? "Your email has been successfully verified." 
                      : "Please verify your email for additional security."}
                  </p>
                </div>

               {/* Password Strength */}
                {/* <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Password Strength</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      userInfo?.passwordStrength === 'strong'
                        ? "bg-green-500/20 text-green-400" 
                        : userInfo?.passwordStrength === 'moderate'
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}>
                      {userInfo?.passwordStrength ? userInfo.passwordStrength.charAt(0).toUpperCase() + userInfo.passwordStrength.slice(1) : "Weak"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {userInfo?.passwordStrength === 'strong'
                      ? "Your password is strong and secure." 
                      : userInfo?.passwordStrength === 'moderate'
                        ? "Your password has moderate security. Consider strengthening it."
                        : "Your password is weak. Update it to improve security."}
                  </p>
                </div> */}
                
                {/* Device Information */}
                {/* <div className="bg-purple-900/10 rounded-lg p-4 border border-purple-900/30">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">Active Devices</h3>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                      {new Set(userInfo?.loginHistory?.map(login => login.userAgent)
                        .filter(ua => ua)
                        .filter((ua, i, arr) => arr.indexOf(ua) === i)).size || 1}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Detected login from {userInfo?.loginHistory?.[0]?.userAgent?.split(' ')[0] || 'Unknown'} device.
                  </p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;