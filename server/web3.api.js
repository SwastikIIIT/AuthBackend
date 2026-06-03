"use server";
import KeyManager from "@/services/KeyManager";
import { getCookies } from "./api";
import Encryption from "@/services/encryption";
import { auth } from "@/auth";

 /**
 * Flow:
 * 1. Generate AES key
 * 2. Encrypt file using symmetric encryption via (AES)
 * 3. Upload encrypted file to IPFS
 * 4. Encrypt AES key via Lit Protocol (Decentralized key management - Threshold Cryptography)
 *
 * @param {string} address - User's wallet address
 * @param {string} chainId - Chain Id like sepolia 
 * @param {File} file - File to be encrypted and uploaded
 *
 * @returns {Promise<{
 *   success: boolean;
 *   message?: string;
 *   metaInfo: {
 *     type:string,
 *     name:string,
 *     size:string,
 *     fileDBId:string
 *     authTag:string,
 *     iv:string
 *   };
 *   cid:string,
 *   cipher:string
 *   digest:string
 * }>}
 */
export const uploadToIPFS=async (file) => {
  try {
    const cookie = await getCookies();
    //1. Key Generation
    const key=Encryption.generateAES();
    console.log("Key:",key);

    //2. File Encryption (Symmetric)
    const fileBuffer=Buffer.from(await file.arrayBuffer());
    const { encryptedData,iv,authTag }=Encryption.encryptWithAES(fileBuffer, key);
    const encryptedFile=new File([encryptedData], file.name, {type: "application/octet-stream"});
    
    //3.1 Split AES key into 3 shares
    const { shares } = await KeyManager.generateAndSplitKey(key);
    const [share1, share2, share3] = shares;

    //3.2 Share1 directly to IPFS
    const share1Blob=new Blob([share1],{type:"text/plain"});
    const share1FormData=new FormData();
    share1FormData.append('file',share1Blob,"share1.txt");
    share1FormData.append("network", "public");


    const pinataRes = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, 
      },
      body: share1FormData,
    });

    const pinataResData = await pinataRes.json();
    console.log("Pinata Response:",pinataResData);
    if(!pinataRes.ok) throw new Error(pinataResData.error);
    const share1CID=pinataResData.data.cid;
  
    const formData = new FormData();
    formData.append("doc", encryptedFile);
    formData.append("iv", iv);
    formData.append("authTag", authTag);
    formData.append("share2", share2);
    formData.append("share1", share1CID);

    //3.2 Upload encryptedFile to IPFS
    const result = await fetch(`${process.env.BACKEND_URL}/api/web3/ipfs`, {
      method: "POST",
      headers: {
        Cookie: `backend_token=${cookie}`,
      },
      body: formData,
    });

    const data = await result.json();
    if (!result.ok) throw new Error(result.error);

    const cid=result.headers.get("IPFS-CID");
    console.log("Shares:",{share1,share2,share3});

    return {
      success:true,
      message: data?.message,
      metaInfo: {
        ...data.uploadedFile,
        share2
      },
      cid,
      share1,
      share3
    };
  } catch (err) {
    console.error("Error while uploading file:", err);
    throw new Error(err?.message || "Failed to upload the file");
  }
};

/**
 * Store file metadata information in DB
 * @returns {Promise<{
 *          type:string,
 *          name:string,
 *          size:string,
 *          fileDBId:string
 *          authTag:string
 *          iv:string
 *         }[]>} - Array of fileData - File Metadata
 */
export const uploadedFileInfo = async()=>{
  try{
      const cookie=await getCookies();
      const result = await fetch(`${process.env.BACKEND_URL}/api/web3/file-info`, {
        headers: {Cookie: `backend_token=${cookie}`}
      });
      if(result.status===204) return [];
      const data=await result.json();
      return data.metaDatas;
  }
  catch(err)
  {
     console.error("Error while getting file info:", err);
     throw new Error(err?.message || "Failed to get file info");
  }
} 

/**
 * Delete File MetaData from DB and IPFS
 * @param {{
 *          type:string,
 *          name:string,
 *          size:string,
 *          fileDBId:string
 *         }} metaData - File meta information
 * @returns {Promise<void>}
 */
export const deleteFileData=async(metaData)=>{
  try{
      const cookie=await getCookies();
      const result = await fetch(`${process.env.BACKEND_URL}/api/web3/delete-file`, {
        method:'DELETE',
        headers: {
          "Content-Type": "application/json",
          Cookie: `backend_token=${cookie}`
        },
        body:JSON.stringify(metaData)
      });
      const data=await result.json();
      if(!result.ok) throw new Error(data.error);

      return{
        success:true,
        message:data.message
      }
  }
  catch(err)
  {
    console.log(err);
     throw new Error(err?.message || "Failed to delete file info");
  }
}

 /**
 * Get encrypted file from IPFS
 * @param {string} cid  - Content Identifier 
 * @returns {Promise<Buffer<ArrayBufferLike>>} - Encrypted file buffer
 */
export const getFileIPFS=async(cid)=>{
  try{
      const cookie=await getCookies();
      const result=await fetch(`${process.env.BACKEND_URL}/api/web3/get-file`, {
        method:'POST',
        headers: {
          "Content-Type": "application/json",
          Cookie: `backend_token=${cookie}`
        },
        body:JSON.stringify({ cid:cid })
      });

      if(!result.ok){
        const errorText=await result.text();
        throw new Error(errorText);
      }
      const arrayBuffer=await result.arrayBuffer();
  
      return arrayBuffer;
  }
  catch(err){
      console.log(err);
      throw new Error(err?.message || "Failed to get file from IPFS.");
  }
}