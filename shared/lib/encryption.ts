import CryptoJS from "crypto-js";
import { getEnv } from "./env";

/**
 * Get encryption secret key from environment
 * @returns Secret key
 */
const getSecretKey = (): string => {
  const key = getEnv("VITE_ENCRYPTION_SECRET_KEY");

  if (!key) {
    console.warn(
      "VITE_ENCRYPTION_SECRET_KEY is not set. Using default key (not recommended for production)"
    );
    return "default-secret-key-change-me";
  }

  return key;
};

/**
 * Encrypt value using AES encryption
 * @param value - Value to encrypt
 * @returns Encrypted string
 */
export const encryptValue = (value: string): string => {
  try {
    const secretKey = getSecretKey();
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt value");
  }
};

/**
 * Decrypt value using AES decryption
 * @param encryptedValue - Encrypted value
 * @returns Decrypted string
 */
export const decryptValue = (encryptedValue: string): string => {
  try {
    const secretKey = getSecretKey();
    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption resulted in empty string");
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt value");
  }
};

/**
 * Hash value using SHA256
 * @param value - Value to hash
 * @returns Hashed string
 */
export const hashValue = (value: string): string => {
  return CryptoJS.SHA256(value).toString();
};

/**
 * Generate random string
 * @param length - Length of random string
 * @returns Random string
 */
export const generateRandomString = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

/**
 * Encode to Base64
 * @param value - Value to encode
 * @returns Base64 encoded string
 */
export const encodeBase64 = (value: string): string => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
};

/**
 * Decode from Base64
 * @param value - Base64 encoded value
 * @returns Decoded string
 */
export const decodeBase64 = (value: string): string => {
  return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
};
