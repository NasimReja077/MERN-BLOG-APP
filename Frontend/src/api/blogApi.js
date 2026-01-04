import axiosInstance from './axios';

export const blogApi = {
  
  getAllBlogs: async (params = {}) => {
    const response = await axiosInstance.get('/blogs', { params });
    return response.data;
  },

  getBlogById: async (id, params = {}) => {
    const response = await axiosInstance.get(`/blogs/${id}`, { params });
    return response.data;
  },

  getBlogsByUser: async (userId, params = {}) => {
    const response = await axiosInstance.get(`/blogs/user/${userId}`, { params });
    return response.data;
  },

  createBlog: async (formData) => {
    const response = await axiosInstance.post('/blogs', formData);
    return response.data;
  },

  updateBlog: async (id, formData) => {
    const response = await axiosInstance.put(`/blogs/${id}`, formData);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  },

  likeBlog: async (id) => {
    const response = await axiosInstance.post(`/blogs/${id}/like`);
    return response.data;
  },

  trackView: async (id, userId) => {
    const response = await axiosInstance.post(`/blogs/${id}/view`, { userId });
    return response.data;
  },

  trackShare: async (id, platform) => {
    const response = await axiosInstance.post(`/blogs/${id}/share`, { platform });
    return response.data;
  },

  uploadThumbnail: async (id, file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await axiosInstance.post(`/blogs/${id}/thumbnail`, formData);
    return response.data;
  },

  uploadContentImages: async (id, files) => { 
    const formData = new FormData();
    files.forEach((file) => formData.append('contentImages', file));
    const response = await axiosInstance.post(`/blogs/${id}/content-images`, formData);
    return response.data;
  },
};
