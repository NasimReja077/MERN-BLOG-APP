import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
     baseURL: API_BASE_URL,
     withCredentials: true, // Sends HTTP-only cookies automatically
     timeout: 10000, // 10 seconds
     // headers: {
     //      'Content-Type' : 'application/json',
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


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limited - Too many requests');
    }
    if (error.response?.status === 401) {
      console.info('Unauthorized request - normal for guests'); // Not an error!
    }
    return Promise.reject(error);
  }
);



export default axiosInstance;