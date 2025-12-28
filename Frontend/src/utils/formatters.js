// Frontend/src/utils/formatters.js
import { formatDistance, format } from 'date-fns';

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (data) => {
     if (!data) return "";
     return formatDistance(new Date(data), new Date(), { addSuffix: true });
};

// Format date to specific format (e.g., "MM/dd/yyyy") (e.g., "Jan 1, 2024")

export const formatDate = (date, pattern = "MMM d, yyyy") => {
     if (!date) return '';
     return format(new Date(date), pattern);
}

// Format date to full date and time (e.g., "Jan 1, 2024, 10:00 AM")
export const formatDateTime = (date) => {
     if (!date) return '';
     return format(new Date(date), 'MMM d, yyyy, HH:mm');
};

// Truncate text to specified length with ellipsis 

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Format number to abbreviated form (e.g., 1.2k, 1.5M)
export const formatCompactNumber = (num) => {
     if (num === undefined || num === null) return '0';
     if (num < 1000) return num.toString();
     if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
     if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
     if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
     return num.toString();
};

// File size formatter (e.g., 1.5 MB, 200 KB)
export const formatFileSize = (bytes) => {
     if (bytes === 0) return '0 Bytes';
     const k = 1024;
     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get initials from name (for avatar placeholders) 
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Estimate read time in minutes based on words per minute (defaults to 200 wpm)
export const estimateReadTime = (text, wordsPerMinute = 200) => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Format seconds into MM:SS (e.g., 125 -> "02:05")
export const formatTimeMMSS = (totalSeconds = 0) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
};

//Slugify text for URLs (e.g., "Hello World!" -> "hello-world")
export const Slugify = (text) => {
     if (!text) return '';
     return text
     .toString() 
     .toLowerCase()
     .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};


