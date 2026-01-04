import axios from 'axios';
import { API_TIMEOUT, HTTP_STATUS } from '../components/constants/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
     baseURL: API_BASE_URL,
     withCredentials: true, // Sends HTTP-only cookies automatically
     timeout: API_TIMEOUT,
    //  headers: {
    //   'Content-Type': 'application/json',
    // },
});

// Request interceptor
// axiosInstance.interceptors.request.use( // use accepts two functions: the onFulfilled (runs before request) and the onRejected (runs if there’s an error creating the request).
//      (config) => {
//           // const token = localStorage.getItem('token');
//           // if(token){
//           //      config.headers.Authorization = `Bearer ${token}`;
//           // }
//           return config;
//      },
//      (error) => Promise.reject(error)
// );

// Response interceptor

// axiosInstance.interceptors.response.use(
//      (response) => response,
//      (error) => {
//           if (error.response?.status === 401){
//                // localStorage.removeItem('token');
//                // window.location.href = '/login';
//                // Let React handle logout & redirect
//                // console.warn("Unauthorized – redirect handled by auth flow");
//                // Cookie expired or invalid - redirect to login
//                window.location.href = '/login';
//           }
//           return Promise.reject(error);
//      }
// );


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login';
//     }
//     if (error.response?.status === 429) {
//       console.warn("Rate limited:", error.response.data);
//     }
//     return Promise.reject(error);
//   }
// )

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Let axios automatically set Content-Type for FormData
    // Only set application/json for non-FormData requests

    if (config.data && !(config.data instanceof FormData)){
      config.headers['Content-Type'] = 'application/json';
    }

    // If it's FormData, axios will automatically set:
    // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

    return config;
  }, (error) => Promise.reject(error)
);
// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle rate limiting
    if(error.response?.status === HTTP_STATUS.TOO_MANY_REQUESTS){
      console.warn('Rate limited - Too many requests');
    }
    // 401 is normal for guests accessing public resources
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED){
      console.info('Unauthorized request - normal for guests'); // Not an error!
    }

    // Log server errors for debugging
    if (error.response?.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR){
      console.error('Server error:', error.response?.data?.message || error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;