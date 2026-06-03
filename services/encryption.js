import crypto from "crypto";

// Elliptic Curve cryptography

class Encryption {
  static CONFIG = {
    iv_length: 12,
    algorithm: "aes-256-gcm",
    auth_tag_length: 16,
    asym_version: "x25519-xsalsa20-poly1305",
  };

  constructor() {}

   /**
   * Key Generation
   * @returns {Buffer} */
  static generateAES() {
    return crypto.randomBytes(32); // 256 bits or 32 bytes key
  }

   /**
   * Symmetric encryption using AES-256-GCM
   * @param {Buffer} buffer - The file data
   * @param {Buffer} aesKey - key generated from generateAES function
   * */
  static encryptWithAES(buffer, aesKey) {
    try {
      // 1. IV generation
      const iv = crypto.randomBytes(Encryption.CONFIG.iv_length);
      // 2. Cipher creation
      const cipherText = crypto.createCipheriv(
        Encryption.CONFIG.algorithm,
        aesKey,
        iv,
        { authTagLength: Encryption.CONFIG.auth_tag_length },
      );
      // 3. Data encryption
      const encrypted = Buffer.concat([
        cipherText.update(buffer),
        cipherText.final(),
      ]);
      // 4. Get authentication tag
      const authTag = cipherText.getAuthTag();

      return {
        iv: iv.toString("hex"),
        encryptedData: encrypted,
        authTag: authTag.toString("hex"),
      };
    } catch (err) {
      console.log("Encryption error:", err);
      throw new Error(err?.message || "Failed to encrypt file");
    }
  }

   /**
   * Symmetric decryption using AES-256-GCM
   * @param {Buffer|ArrayBuffer} encryptedBuffer - The encrypted data buffer
   * @param {string} ivHex - The IV (Hex)
   * @param {string} authTagHex - The Auth Tag (Hex)
   * @param {string} aesKeyHex - The AES Key (Hex)
   * */
  static async decryptWithAES(encryptedBuffer, ivHex, authTagHex, aesKeyHex) {
    try {
      //1. Get key buffer ,iv buffer,and authTag buffer
      const key = Buffer.from(aesKeyHex, "hex");
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");

      const payloadBuffer = Buffer.isBuffer(encryptedBuffer)?encryptedBuffer:Buffer.from(encryptedBuffer);
      //2. Create cipher
      const decipher = crypto.createDecipheriv(
        Encryption.CONFIG.algorithm,
        key,
        iv,
        { authTagLength: Encryption.CONFIG.auth_tag_length },
      );
      decipher.setAuthTag(authTag);
      //3. Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(payloadBuffer),
        decipher.final(),
      ]);

      return decrypted;
    } catch (err) {
      console.log("Decryption error:", err);
      throw new Error(err?.message || "Failed to decrypt");
    }
  }

   static async test(){
    console.log("Testing...");
   }
}

export default Encryption;
