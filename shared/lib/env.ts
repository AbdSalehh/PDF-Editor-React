/**
 * Get environment variable value
 * @param key - Environment variable key
 * @param defaultValue - Default value if key not found
 * @returns Environment variable value or default value
 */
export const getEnv = (key: string, defaultValue: string = ""): string => {
  return import.meta.env[key] || defaultValue;
};

/**
 * Get environment variable as boolean
 * @param key - Environment variable key
 * @param defaultValue - Default value if key not found
 * @returns Boolean value
 */
export const getEnvBoolean = (
  key: string,
  defaultValue: boolean = false
): boolean => {
  const value = import.meta.env[key];

  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value.toLowerCase() === "true";
};

/**
 * Get environment variable as number
 * @param key - Environment variable key
 * @param defaultValue - Default value if key not found
 * @returns Number value
 */
export const getEnvNumber = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];

  if (value === undefined || value === null) {
    return defaultValue;
  }

  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
