import { split, combine } from 'shamir-secret-sharing';
import { hashMessage } from "viem";
import Encryption from "./encryption";

/**
 * KeyManager handles the 2-of-3 Shamir Secret Sharing logic
 * and the deterministic KEK generation for Share 3 backup.
 */
class KeyManager {

  /**
   * Generates a new AES key and splits it into 3 shares (2-of-3 threshold).
   * @param {Buffer} key - The AES key to split .
   * @returns {{ 
   *            aesKeyHex: string,
   *            shares: string[] 
   *          }}
   */
  static async generateAndSplitKey(aesKey) {
    const secret = new TextEncoder().encode(aesKey.toString("hex"));
    const sharesArray = await split(secret, 3, 2);
    
    // convert Uint8Array shares to hex strings
    const shares = sharesArray.map(share => Buffer.from(share).toString("hex"));

    return {
      aesKeyHex: aesKey.toString("hex"),
      shares: shares,
    };
  }

  /**
   * Reconstructs the AES key from any 2 valid shares.
   * @param {string[]} shares - Array of at least 2 shares.
   * @returns {string} The reconstructed AES key (Hex string).
   */
  static async reconstructKey(shares) {
    const validShareBuffers = [];
    
    for (const share of shares) {
      if (typeof share !== 'string') continue;
      const cleanShare = share.trim();
      if (!cleanShare) continue;
      
      // Attempt to parse as hex
      const buf = Buffer.from(cleanShare, "hex");
      
      // shamir-secret-sharing requires at least 2 bytes per share
      if (buf.length >= 2) {
        validShareBuffers.push(new Uint8Array(buf));
      } else {
        console.warn("Invalid share length after hex parsing:", buf.length);
      }
    }
    
    if (validShareBuffers.length < 2) 
      throw new Error(`At least 2 valid shares are required to reconstruct the key. Found ${validShareBuffers.length} valid share(s). This usually means the shares are corrupted or you are trying to decrypt an older file.`);
    
    const reconstructedKeyBuffer = await combine(validShareBuffers);
    return new TextDecoder().decode(reconstructedKeyBuffer);
  }

  /**
   * Derives a KEK (Key Encryption Key) from a Web3 wallet signature.
   * This is used exclusively to encrypt/decrypt Share 3 for decentralized recovery.
   * 
   * @param {object} walletClient - The viem wallet client.
   * @param {string} account - The user's wallet address.
   * @returns {Promise<Buffer>} The 32-byte KEK Buffer.
   */
  static async deriveRecoveryKEK(walletClient, account) {
    const message = "Chronicle Vault Recovery Key || Sign this message to encrypt/decrypt your decentralized backup share";
    
    const signature = await walletClient.signMessage({
      account,
      message,
    });

    const hashedSignature = hashMessage(signature);
    return Buffer.from(hashedSignature.slice(2), "hex");
  }

  /**
   * Encrypts Share 3 using the derived KEK.
   * @param {string} share3 - The plaintext Share 3 
   * @param {Buffer} kekBuffer - The KEK buffer derived from the wallet signature.
   * @returns {object} { iv, encryptedData, authTag }
   */
  static encryptRecoveryShare(share3, kekBuffer) {
    const shareBuffer = Buffer.from(share3, "utf-8");
    return Encryption.encryptWithAES(shareBuffer, kekBuffer);
  }

  /**
   * Decrypts the encrypted Share 3 using the derived KEK.
   * @param {Buffer} encryptedShareBuffer - The encrypted Share 3 data.
   * @param {string} ivHex - The IV used during encryption.
   * @param {string} authTagHex - The Auth Tag used during encryption.
   * @param {Buffer} kekBuffer - The KEK buffer derived from the wallet signature.
   * @returns {Promise<string>} The plaintext Share 3.
   */
  static async decryptRecoveryShare(encryptedShareBuffer,ivHex,authTagHex,kekBuffer) {
    const decryptedBuffer = await Encryption.decryptWithAES(
      encryptedShareBuffer,
      ivHex,
      authTagHex,
      kekBuffer.toString("hex")
    );
    return decryptedBuffer.toString("utf-8");
  }
}

export default KeyManager;
