import { Timestamp } from 'firebase/firestore';

/**
 * Convert Firebase Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp: Timestamp | any): Date => {
  if (!timestamp) return new Date();
  
  // Handle Firebase Timestamp
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // Handle plain Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // Handle timestamp with seconds and nanoseconds
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  }
  
  // Fallback to current date
  return new Date();
};

/**
 * Convert JavaScript Date to Firebase Timestamp
 */
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * Get current timestamp for Firebase
 */
export const getCurrentTimestamp = (): Timestamp => {
  return Timestamp.now();
};

/**
 * Format date for display (e.g., "Sept 26, 2025")
 */
export const formatDate = (
  timestamp: Timestamp | any,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = timestampToDate(timestamp);
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format date with time (e.g., "Sept 26, 2025 at 7:07 AM")
 */
export const formatDateTime = (
  timestamp: Timestamp | any,
  options?: {
    dateOptions?: Intl.DateTimeFormatOptions;
    timeOptions?: Intl.DateTimeFormatOptions;
  }
): string => {
  const date = timestampToDate(timestamp);
  
  const defaultDateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const defaultTimeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const dateStr = date.toLocaleDateString('en-US', {
    ...defaultDateOptions,
    ...options?.dateOptions,
  });
  
  const timeStr = date.toLocaleTimeString('en-US', {
    ...defaultTimeOptions,
    ...options?.timeOptions,
  });
  
  return `${dateStr} at ${timeStr}`;
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (timestamp: Timestamp | any): string => {
  const date = timestampToDate(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count > 0) {
      return count === 1 
        ? `1 ${interval.label} ago`
        : `${count} ${interval.label}s ago`;
    }
  }
  
  return 'just now';
};

/**
 * Get time ago with more human-friendly format
 */
export const getTimeAgo = (timestamp: Timestamp | any): string => {
  const date = timestampToDate(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  // If less than 24 hours ago, show relative time
  if (diffInHours < 24) {
    return getRelativeTime(timestamp);
  }
  
  // If less than 7 days ago, show day of week
  if (diffInHours < 168) { // 7 days * 24 hours
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  // If same year, show month and day
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Show full date for older items
  return formatDate(timestamp);
};

/**
 * Format date for API or database operations (ISO string)
 */
export const formatDateISO = (timestamp: Timestamp | any): string => {
  const date = timestampToDate(timestamp);
  return date.toISOString();
};

/**
 * Check if two timestamps are on the same day
 */
export const isSameDay = (
  timestamp1: Timestamp | any,
  timestamp2: Timestamp | any
): boolean => {
  const date1 = timestampToDate(timestamp1);
  const date2 = timestampToDate(timestamp2);
  
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

/**
 * Get start and end of day for a timestamp (useful for queries)
 */
export const getDayBounds = (timestamp: Timestamp | any): {
  startOfDay: Timestamp;
  endOfDay: Timestamp;
} => {
  const date = timestampToDate(timestamp);
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return {
    startOfDay: dateToTimestamp(startOfDay),
    endOfDay: dateToTimestamp(endOfDay),
  };
};

/**
 * Sort timestamps in descending order (newest first)
 */
export const sortByTimestampDesc = <T extends { createdAt: Timestamp | any }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = timestampToDate(a.createdAt);
    const dateB = timestampToDate(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Sort timestamps in ascending order (oldest first)
 */
export const sortByTimestampAsc = <T extends { createdAt: Timestamp | any }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = timestampToDate(a.createdAt);
    const dateB = timestampToDate(b.createdAt);
    return dateA.getTime() - dateB.getTime();
  });
};

/**
 * Group items by date (useful for grouping resources by day/month)
 */
export const groupByDate = <T extends { createdAt: Timestamp | any }>(
  items: T[],
  groupBy: 'day' | 'month' | 'year' = 'day'
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = timestampToDate(item.createdAt);
    let key: string;
    
    switch (groupBy) {
      case 'day':
        key = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        break;
      case 'month':
        key = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        });
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = formatDate(item.createdAt);
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Validate if a timestamp is valid
 */
export const isValidTimestamp = (timestamp: any): boolean => {
  if (!timestamp) return false;
  
  try {
    const date = timestampToDate(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

// Type definitions for better TypeScript support
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export interface ResourceWithTimestamp {
  id: string;
  createdAt: Timestamp | FirebaseTimestamp | Date;
  updatedAt?: Timestamp | FirebaseTimestamp | Date;
  [key: string]: any;
}