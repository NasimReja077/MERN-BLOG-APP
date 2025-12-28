// Frontend/src/utils/helpers.js
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../components/constants/index';

export const validateImageFile = (file, maxSize = MAX_FILE_SIZE.BLOG_THUMBNAIL) => {
     const errors = [];

     if (!file){
          errors.push('No File Selected');
          return { isValid: false, errors };     
     }

     if (!ALLOWED_IMAGE_TYPES.includes(file.type)){
          errors.push('Invalid file type. Please upload JPEG, PNG, or WebP images.');
     }

     if (file.size > maxSize){
          const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
          errors.push(`File size exceeds ${maxSizeMB} MB.`);
     }

     return { 
          isValid: errors.length === 0, 
          errors,
     };
};

// Handle API errors and extract error messages

export const extractErrorMessages = (error) => {
     if (error?.response?.data?.message){
          return error.response.data.message;
     }
     if (error?.message){
          return error.message;
     }
     return 'An unexpected error occurred';
};

// Check if user is owner of resource 

export const isOwner = (resourceOwnerId, currentUserId) => {
     if (!resourceOwnerId || !currentUserId) return false;
     return resourceOwnerId.toString() === currentUserId.toString();
};

// Safely parse JSON

export const safeJSONParse = (str, fallback = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Create query string from object 

export const createQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filteredParams).toString();
};

// Debounce function

export const debounce = (func, delay = 300) => {
     let timeoutId;
     return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func(...args), delay);
     };
}

// Deep clone object

export const deepClone = (obj) => {
     if (obj === null || typeof obj !== 'object') return obj;
     return JSON.parse(JSON.stringify(obj));
};

// Check if value is empty (null, undefined, empty string, empty array, empty object)

export const isEmpty = (value) => {
     if (value === null || value === undefined) return true;
     if (typeof value === 'string') return value.trim() === '';
     if (Array.isArray(value)) return value.length === 0;
     if (typeof value === 'object') return Object.keys(value).length === 0;
     return false;
}

// Scroll to top of page

export const scrollToTop = (smooth = true) => {
     window.scrollTo({
          top: 0,
          behavior: smooth ? 'smooth' : 'auto',
     });
};

// Copy text to clipboard

export const copyToClipboard = async (text) => {
     try {
          await navigator.clipboard.writeText(text);
          return true;
     } catch (error) {
          console.error('Failed to copy to clipboard:', error);
          return false;
     }
};

// Generate random ID
export const generateId = () =>{
     return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
