import { ethers, formatEther } from "ethers";
import { VaultABI } from "./VaultABI";

class Blockchain {
   provider = null;
   signer = null;
   network = null;
   account = null;

   constructor() {}

/**
 * Connects to the blockchain (private/local or public testnet).
 * @returns {Promise<{
 *   success: boolean;
 *   account: string;
 *   balance: string;
 *   networkName: string;
 *   chainId: string;
 *   history: any[];
 * }|{
 *   success:boolean;
 *   reason:string;
 * }>}
 */
  async connectToWeb3(){
      // Normal error -> Proper User Interface
      if(typeof window.ethereum==='undefined' || !window.ethereum){
         return {success:false,reason:'not-found'};
      }

      try {
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
          this.network = await this.provider.getNetwork();
        
          // const accounts = await this.web3instance.request({ method: "eth_requestAccounts"});
          const accounts = await this.provider.send("eth_requestAccounts", []);
          this.account = accounts[0];

          let balance = "0";
          try {
            const balanceWei = await this.provider.getBalance(this.account);
            balance = formatEther(balanceWei);
          } catch (balError) {
            console.warn("Balance fetch failed, using 0", balError);
          }

          const history = await this.getHistory(this.account);
          console.log("History:",history);
          return {
            success: true,
            account: this.account,
            balance: parseFloat(balance).toFixed(4),
            networkName: this.network.name === "unknown" ? "Localhost/Private" : this.network.name,
            chainId: this.network.chainId.toString(),
            history,
          };
      } catch (error) {
        console.log(error);
        if(error.code === -32002) throw new Error("Connection request already pending. Please check MetaMask and approve the connection.");
        if (error.reason==='rejected' || error.code === 4001) return {success:false,reason:'rejected'};
        throw new Error(error?.message || "Failed to connect to web3");
      }
  } 

 /**
 * Get account information.
 * @param {string} account - Ethereum account address.
 * @returns {Promise<Array<{
 *   from: string;
 *   to: string;
 *   transactionHash: string;
 *   blockNumber: number;
 *   blocksAhead:string;
 *   blockHash: string;
 *   nonce: string;
 *   gasUsed: string;
 *   gasPrice: bigint;
 *   fee: string;
 *   type: string;
 *   status: string;
 * }>>}
 */
  async getHistory (account){
      if(!this.provider || !this.network) return [];
      try {
          const chainId=this.network.chainId.toString();
          const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

          let baseUrl = "https://api.etherscan.io/v2/api";

          if (chainId !== "1" && chainId !== "11155111") {
            console.warn("History fetch not supported for this network");
            return [];
          }

          const apiUrl =
            `${baseUrl}` +
            `?chainid=${chainId}` +
            `&module=account` +
            `&action=txlist` +
            `&address=${account}` +
            `&startblock=0` +
            `&endblock=99999999` +
            `&sort=desc` +
            `&apikey=${apiKey}`;

          const res=await fetch(apiUrl);
          const data=await res.json();
          console.log("Data:",data);
          console.log(data.result);
          if(data.status==='1')
          {
            return data.result.map(tx=>({
              from:tx.from,
              to:tx.to,
              transactionHash:tx.hash,
              blockNumber:tx.blockNumber,
              blocksAhead:tx.confirmations,
              blockHash:tx.blockHash,
              nonce:tx.nonce,
              gasUsed:tx.gasUsed,
              gasPrice:ethers.formatUnits(tx.gasPrice,'gwei'),
              fee:ethers.formatEther(BigInt(tx.gasPrice)*BigInt(tx.gasUsed)),
              type: tx.from.toLowerCase() === account.toLowerCase() ? "Sent" : "Received",
              status: tx.isError === "0" ? "Success" : "Failed",
            }))
          }
          return [];
      } catch (err) {
          console.error("Ganache Fetch Error:", err);
          throw new Error(err?.message || "Failed to fetch Ganache history");
      }
  };

  /**
   * Saving data on blockchain via smartContract
   * @param {string} cid 
   * @param {string} share3Data 
   * @param {string} iv 
   * @param {string} authTag 
   * @param {string} fileDBId 
   * @returns {Promise<Boolean>}
   */
  async saveToBlockchain(cid, share3Data, iv, authTag, fileDBId){
      try{
          if(!this.signer) await this.connectToWeb3();
          const vaultContract=new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,VaultABI.abi,this.signer);
          const tx=await vaultContract.addFile(cid, share3Data, iv, authTag, fileDBId);
          const receipt=await tx.wait();
          console.log("Transaction Hash:",receipt.hash);
          return true;
      }
      catch(err){
        console.log("Error addFile:",err);
        return false;
      }
  };
  
  /**
   * Deleting file from blockchain
   * @param {string} fileDBId 
   * @returns {Promise<Boolean>}
   */
  async deleteFromBlockchain(fileDBId){
    try{
      if(!this.signer) await this.connectToWeb3();
      const vaultContract=new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,VaultABI.abi,this.signer);
      const tx=await vaultContract.deleteFile(fileDBId); 
      const receipt=await tx.wait();
      console.log("Tx Hash:",receipt.hash);
      return true;
    }
    catch(err){
      console.log("Error in deleteFile:",err);
      return false;
    }

  }

   /**
   * Getting a SINGLE file's CID and Key
   * @param {string} fileDBId 
   */
  async getFileFromBlockchain(fileDBId) {
    try {
       if(!this.signer) await this.connectToWeb3();
       if (!fileDBId) throw new Error("fileDBId is missing!");

       const vaultContract=new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, VaultABI.abi, this.signer);
       const [cid, share3Data, iv, authTag]=await vaultContract.getFile(fileDBId);
  
       return {cid, share3Data, iv, authTag};
    }
    catch (err) {
      console.log('Error getting single file:', err);
      return false;
    }
  }

   /**
   * Getting all files
   */
  async getFilesFromBlockchain() {
    try {
       const vaultContract=new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, VaultABI.abi, this.provider);
       const files=await vaultContract.getFiles(this.account);
  
       return files;
    }
    catch (err) {
      console.log('Error getting single file:', err);
    }
  }
}

const blockchain=new Blockchain();
export default blockchain; 