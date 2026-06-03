"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  ShieldCheck,
  HardDrive,
  Plus
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { X } from "lucide-react";
import { calcSize, cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import Table from "./web3/Table";
import blockchain from "@/services/blockchain";
import { deleteFileData, uploadedFileInfo, uploadToIPFS } from "@/server/web3.api";
import FileLayout from "./web3/FileLayout";
import KeyManager from "@/services/KeyManager";
import { createWalletClient, custom } from "viem";
import PromptScreen from "./web3/PromptScreen";
import { Button } from "./ui/button";


const Info = [
  {
    label: "Balance",
    formatter: (info) => `${info.balance} ETH`,
    icon: <ShieldCheck className="text-green-500" size={16} />,
  },
  {
    label: "Network",
    formatter: (info) => info.networkName,
    icon: <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />,
  },
  {
    label: "Chain ID",
    formatter: (info) => info.chainId,
    icon: <span className="text-[10px] font-bold text-purple-400">#</span>,
  },
  {
    label: "Status",
    formatter: (info) => info.networkName==='Localhost/Private'?'Private Blockchain':'Public Blockchain',
    icon: <ShieldCheck className="text-blue-500" size={16} />,
  },
];

const Vault = () => {
  const [file, setFile] = useState(null);
  const [web3Info, setWeb3Info] = useState({});
  const [fileMetadata, setFileMetaData] = useState([]);
  const [history, setHistory] = useState([]);
  const [providerStatus,setProviderStatus]=useState('checking');

  const [step,setStep]=useState('IDLE');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const setupWeb3 = async () => {
      setIsLoading(true);
      try {
        const result = await blockchain.connectToWeb3();
        console.log("Result:",result);
        const fileMetadata=await uploadedFileInfo();
        console.log("File Metadata:",fileMetadata);
        if (result.success) {
          setWeb3Info(result);
          setHistory(result.history);
          setFileMetaData(fileMetadata);
          setProviderStatus('connected');
          toast.success("Wallet Linked", {
            description: `Connected to ${result.account.slice(0, 7)}...${result.account.slice(-5)}`,
          });
          
          window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length > 0) {
            setupWeb3();
            toast.info("Account Switched");
          } else {
            setWeb3Info({});
            setProviderStatus('connected');
            toast.error("Wallet Disconnected");
          }
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        }
        else{
          setProviderStatus(result.reason);
        }
      } catch (err) {
        console.log("Error while setting up web3:", err);
        toast.error("Error", { description: err.message });
      } finally {
        setIsLoading(false);
      }
    };
    setupWeb3();
  }, []);

  // console.log(providerStatus);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("Uploaded File:", file);
    if (file) setFile(file);
    e.target.files=null;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    console.log("Dropped File:", droppedFile);
    if (droppedFile) setFile(droppedFile);
    e.dataTransfer.files=null;
  };

  const handleSubmit = async () => {
    if (!file || isLoading) return;
  
    setIsLoading(true);
    try {
      // setStep('UPLOAD_BLOCKCHAIN');
      const result = await uploadToIPFS(file);
      console.log("Result from IPFS upload:", result);
      
      // Encrypt Share 3 with Wallet Signature before pushing to blockchain
      const walletClient = createWalletClient({ transport: custom(window.ethereum) });
      const kekBuffer = await KeyManager.deriveRecoveryKEK(walletClient, web3Info.account);
      const encryptedShare3Obj = KeyManager.encryptRecoveryShare(result.share3, kekBuffer);

      await blockchain.saveToBlockchain(
          result.cid, 
          encryptedShare3Obj.encryptedData.toString("hex"),
          encryptedShare3Obj.iv, 
          encryptedShare3Obj.authTag, 
          result.metaInfo.fileDBId
      );
      

      toast.success("Success", { description: result?.message });
      setFile(null);
      setFileMetaData((prev)=>[...prev,result.metaInfo]);
      setIsLoading(false);
    } catch (error) {
      console.log("Error in handleSubmit:", error);
      toast.error("Upload failed", { description: error?.message || "Upload to IPFS failed",});
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete=async(metaData)=>{
      setIsLoading(true);
      try{
          const result=await deleteFileData(metaData);
          setFileMetaData((prev)=>{
            const filtered=prev.filter((item)=>item.fileDBId!=metaData.fileDBId)
            return filtered;
          })
          await blockchain.deleteFromBlockchain(metaData.fileDBId);
          if(result.success) toast.success("Success",{description:result.message})
      }
      catch(err)
      {
          console.log("Delete me error:",err);
          toast.error("Error",{description:err.message || "Delete me koi error hai"})
      }
      finally{
        setIsLoading(false);
      }
  }

  if (isLoading || providerStatus==='checking') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center z-50">
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-purple-900/30 border-t-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-purple-500/80 font-mono text-sm animate-pulse"> 
          {isLoading && "Loading..."}
          {providerStatus==='rejected' && 'Connection cancelled. Reloading...'}
          {/* {isLoading && step==="UPLOAD_IPFS" && "Uploading to IPFS..."}
          {isLoading && step==='SAVE_BLOCKCHAIN' && "Saving on blockchain..."}
          {isLoading && step==='DELETE_IPFS_AND_DB' && "Deleting records from IPFS and DB..."} */}
        </p>
      </div>
    );
  }

  if(providerStatus==='rejected'){
    return<>
       <div className="flex h-screen items-center justify-center bg-black overflow-hidden">
      <div className="absolute h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />
      
      <div className="relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tighter"
        >
          Connection Cancelled.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-purple-500 font-mono text-sm tracking-[0.3em] uppercase mt-2"
        >
          You declined the Metamask response.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={()=>window.location.reload()} 
            className="cursor-pointer text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-widest border-b border-zinc-800 pb-1"
          >
            Retry to connect wallet
          </Button>
        </motion.div>
      </div>
    </div>
    </>
  }

  if(providerStatus==='not-found'){
    return(
      <PromptScreen/>
    );
  }

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-purple-900/30 pb-6 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl text-white font-bold">
              Decentralized <span className="text-purple-500">Vault</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Secure, encrypted, and permanent file storage.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full px-4 py-2 bg-purple-950/30 text-purple-400 rounded-lg border border-purple-500/20 flex items-center gap-3 w-fit">
              <div
                className={cn(
                  "h-2 w-2 rounded-full animate-pulse",
                  web3Info?.account ? "bg-green-500" : "bg-red-500",
                )}
              />
              <span className="font-mono text-xs">
                {" "}
                {web3Info?.account ? web3Info?.account : "Not Connected"}
              </span>
            </div>
            <div className="self-end  px-4 py-2 bg-purple-950/30 text-purple-400 rounded-lg border border-purple-500/20 flex items-center gap-3 w-fit">
              <HardDrive size={18} className="animate-pulse" />
              <span className="font-mono text-sm">{calcSize(fileMetadata)}</span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        {web3Info?.account && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {Info.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 bg-zinc-900/40 border border-purple-900/20 p-3 rounded-xl backdrop-blur-md"
              >
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <div className="text-white font-mono text-sm font-semibold pl-1">
                  {stat.formatter(web3Info)}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Transaction History Section - BlockExplorer jaisa */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-8"
          >
            <Card className="bg-zinc-950/50 border-purple-900/40 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-purple-900/30">
               <div className='flex gap-2 items-center mb-3'>
                  <Activity size={22} className="text-purple-500" />
                  <div className='flex flex-col'>
                    <CardTitle className="text-white mb-1">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-500">Overview of your transactions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
               <Table history={history} chainId={web3Info.chainId}/>
              </CardContent>
            </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Upload Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-zinc-950/50 border-purple-900/40 backdrop-blur-sm shadow-xl h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Upload size={22} className="text-purple-500" />
                  <div>
                    <CardTitle className="text-white mb-1">
                      Store New Asset
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Files are fragmented and encrypted via AES-256
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!file ? (
                  <>
                    <label
                      onDrop={handleDrop}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ease-out",
                        isDragging
                          ? "border-purple-500 bg-purple-500/10 scale-[1.03] shadow-[0_0_40px_rgba(168,85,247,0.35)]"
                          : "border-zinc-800 bg-transparent scale-100 shadow-none",
                        "hover:border-purple-500/50 hover:bg-purple-500/5",
                      )}
                    >
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="p-4 bg-purple-500/10 rounded-full group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                          <Plus size={32} className="text-purple-500" />
                        </div>
                        <p className="mt-4 text-sm text-zinc-300">
                          <span className="font-semibold text-purple-400">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-zinc-500 mt-2">
                          Max file size: 4.5MB per transaction (Pdfs,images,excel documents)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpeg,.jpg,.webp,.xlsx,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-full h-72 border border-purple-500/30 rounded-2xl bg-purple-950/20 flex flex-col justify-center items-center relative overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setFile(null);
                          setIsUploading(false);
                        }}
                        className="cursor-pointer absolute top-3 right-3 p-2 rounded-full font-bold hover:bg-purple-500/20 text-white  transition"
                      >
                        <X size={16} />
                      </button>
                      <div className="p-4 bg-purple-500/10 rounded-xl mb-4">
                        <FileText size={36} className="text-purple-400" />
                      </div>

                      <p className="text-sm text-white font-medium">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </motion.div>
                  </>
                )}
                <button
                  className="cursor-pointer w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
                  onClick={handleSubmit}
                >
                  Upload to Blockchain
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: File List */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FileLayout 
                fileMetadata={fileMetadata} 
                handleDelete={handleDelete}
                chainId={web3Info.chainId}
                account={web3Info.account}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Vault;
