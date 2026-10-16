import { encryptValue, decryptValue } from "./encryption";

/**
 * Storage options interface
 */
export interface StorageOptions {
  encrypt?: boolean;
  storageType?: "local" | "session";
}

/**
 * Get storage instance
 * @param type - Storage type
 * @returns Storage instance
 */
const getStorageInstance = (type: "local" | "session"): Storage => {
  return type === "local" ? localStorage : sessionStorage;
};

/**
 * Set item to storage
 * @param key - Storage key
 * @param value - Value to store
 * @param options - Storage options
 */
export const setStorage = <T>(
  key: string,
  value: T,
  options: StorageOptions = {}
): void => {
  const { encrypt = false, storageType = "local" } = options;

  try {
    const storage = getStorageInstance(storageType);
    let stringValue = JSON.stringify(value);

    if (encrypt) {
      stringValue = encryptValue(stringValue);
    }

    storage.setItem(key, stringValue);
  } catch (error) {
    console.error("Storage set error:", error);
    throw new Error(`Failed to set storage item: ${key}`);
  }
};

/**
 * Get item from storage
 * @param key - Storage key
 * @param options - Storage options
 * @returns Stored value or null
 */
export const getStorage = <T>(
  key: string,
  options: StorageOptions = {}
): T | null => {
  const { encrypt = false, storageType = "local" } = options;

  try {
    const storage = getStorageInstance(storageType);
    const item = storage.getItem(key);

    if (!item) {
      return null;
    }

    let stringValue = item;

    if (encrypt) {
      stringValue = decryptValue(item);
    }

    return JSON.parse(stringValue) as T;
  } catch (error) {
    console.error("Storage get error:", error);
    return null;
  }
};

/**
 * Remove item from storage
 * @param key - Storage key
 * @param storageType - Storage type
 */
export const removeStorage = (
  key: string,
  storageType: "local" | "session" = "local"
): void => {
  try {
    const storage = getStorageInstance(storageType);
    storage.removeItem(key);
  } catch (error) {
    console.error("Storage remove error:", error);
  }
};

/**
 * Clear all items from storage
 * @param storageType - Storage type
 */
export const clearStorage = (
  storageType: "local" | "session" = "local"
): void => {
  try {
    const storage = getStorageInstance(storageType);
    storage.clear();
  } catch (error) {
    console.error("Storage clear error:", error);
  }
};

/**
 * Check if item exists in storage
 * @param key - Storage key
 * @param storageType - Storage type
 * @returns True if item exists
 */
export const hasStorage = (
  key: string,
  storageType: "local" | "session" = "local"
): boolean => {
  try {
    const storage = getStorageInstance(storageType);
    return storage.getItem(key) !== null;
  } catch (error) {
    console.error("Storage has error:", error);
    return false;
  }
};
