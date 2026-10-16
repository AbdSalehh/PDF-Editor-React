/**
 * Cookie options interface
 */
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set cookie
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    if (options.expires instanceof Date) {
      // Use both expires and max-age for better compatibility
      cookieString += `; expires=${options.expires.toUTCString()}`;
      const maxAge = Math.floor(
        (options.expires.getTime() - Date.now()) / 1000,
      );
      if (maxAge > 0) {
        cookieString += `; max-age=${maxAge}`;
      }
    } else {
      // expires is in seconds
      const expires = new Date(Date.now() + options.expires * 1000);
      cookieString += `; expires=${expires.toUTCString()}`;
      cookieString += `; max-age=${options.expires}`;
    }
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  } else {
    cookieString += "; path=/";
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += "; secure";
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get cookie value
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Remove cookie
 * @param name - Cookie name
 * @param options - Cookie options (path and domain should match the original cookie)
 */
export const removeCookie = (
  name: string,
  options: Omit<CookieOptions, "expires"> = {},
): void => {
  setCookie(name, "", {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Remove all cookies
 * @param options - Cookie options (path and domain should match the original cookies)
 */
export const removeCookieAll = (
  options: Omit<CookieOptions, "expires"> = {},
): void => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    removeCookie(name, options);
  }
};

/**
 * Check if cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists, false otherwise
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as object
 * @returns Object with all cookies
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    const eqPos = cookie.indexOf("=");

    if (eqPos > -1) {
      const name = decodeURIComponent(cookie.substring(0, eqPos));
      const value = decodeURIComponent(cookie.substring(eqPos + 1));
      cookies[name] = value;
    }
  }

  return cookies;
};
