import axiosInstance from './axios';

export const authApi ={
     register: async (formData) => {
          const response = await axiosInstance.post('/auth/register', formData, {
               headers: {'Content-Type': 'multipart/form-data'},
          });
          return response.data;
     },
     verifyOTP: async (code) => {
          const response = await axiosInstance.post('/auth/otp-verify', { code });
          return response.data;
     },
     login: async (credentials) => {
          const response = await axiosInstance.post('/auth/login', credentials);
          return response.data;
     },
     logout: async () => {
          const response = await axiosInstance.post('/auth/logout');
          return response.data;
     },
     getProfile: async () => {
          const response = await axiosInstance.get('/auth/profile');
          return response.data;
     },
     updateProfile: async (formData) => {
          const response = await axiosInstance.put('/auth/profile', formData,{
               headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data;
     },
     uploadAvatar: async (file) =>{
          const formData = new FormData();
          formData.append('avatar', file);
          const response = await axiosInstance.post('/auth/upload/avatar', formData,{
               headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data;
     },
     uploadCover: async (file) =>{
          const formData = new FormData();
          formData.append('avatar', file);
          const response = await axiosInstance.post('/auth/upload/cover', formData,{
               headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data;
     },
     forgotPassword: async (email) => {
          const response = await axiosInstance.post('/auth/forgot-password', {email});
          return response.data;
     },
     resetPassword: async (token, newPassword) =>{
          const response = await axiosInstance.post('/auth/reset-password', {token, newPassword });
          return response.data;
     },
};