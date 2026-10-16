/**
 * Parse time string to milliseconds
 * Supports formats: 15m, 1h, 1d, 7d, etc.
 * @param timeString - Time string (e.g., '15m', '1h', '1d')
 * @returns Milliseconds
 */
export const parseTimeToMs = (timeString: string): number => {
  const regex = /^(\d+)([smhd])$/;
  const match = timeString.match(regex);

  if (!match) {
    throw new Error(
      `Invalid time format: ${timeString}. Use format like '15m', '1h', '1d'`,
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000, // seconds
    m: 60 * 1000, // minutes
    h: 60 * 60 * 1000, // hours
    d: 24 * 60 * 60 * 1000, // days
  };

  return value * multipliers[unit];
};

/**
 * Parse time string to seconds
 * @param timeString - Time string (e.g., '15m', '1h', '1d')
 * @returns Seconds
 */
export const parseTimeToSeconds = (timeString: string): number => {
  return parseTimeToMs(timeString) / 1000;
};

/**
 * Check if date is expired
 * @param expiryDate - Expiry date
 * @returns True if expired
 */
export const isExpired = (expiryDate: Date | number): boolean => {
  const now = Date.now();
  const expiry = expiryDate instanceof Date ? expiryDate.getTime() : expiryDate;
  return now >= expiry;
};

/**
 * Get expiry date from now
 * @param timeString - Time string (e.g., '15m', '1h', '1d')
 * @returns Expiry date
 */
export const getExpiryDate = (timeString: string): Date => {
  const ms = parseTimeToMs(timeString);
  return new Date(Date.now() + ms);
};

/**
 * Format date to ISO string
 * @param date - Date to format
 * @returns ISO string
 */
export const formatDateISO = (date: Date = new Date()): string => {
  return date.toISOString();
};

/**
 * Format date to locale string
 * @param date - Date to format
 * @param locale - Locale string
 * @returns Formatted date string
 */
export const formatDateLocale = (
  date: Date = new Date(),
  locale: string = "id-ID",
): string => {
  return date.toLocaleString(locale);
};

/**
 * Format date to local date string
 * @param isoString - ISO string
 * @param locale - Locale string
 * @returns Formatted date string
 */
export const formatStringToLocalDate = (
  isoString: string,
  locale = "id-ID",
): string => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/**
 * Format date to time ago string
 * @param dateString - Date string
 * @returns Formatted time ago string
 */
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diff / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
