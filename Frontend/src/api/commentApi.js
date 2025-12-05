import axiosInstance from './axios';

export const commentApi = {
  getBlogComments: async (blogId, params = {}) => {
    const response = await axiosInstance.get(`/comments/blog/${blogId}`, { params });
    return response.data;
  },

  addComment: async (data) => {
    const response = await axiosInstance.post('/comments', data);
    return response.data;
  },

  addReply: async (commentId, content) => {
    const response = await axiosInstance.post(`/comments/${commentId}/reply`, { content });
    return response.data;
  },

  updateComment: async (id, content) => {
    const response = await axiosInstance.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await axiosInstance.delete(`/comments/${id}`);
    return response.data;
  },

  likeComment: async (id) => {
    const response = await axiosInstance.post(`/comments/${id}/like`);
    return response.data;
  },

  getCommentReplies: async (commentId, params = {}) => {
    const response = await axiosInstance.get(`/comments/${commentId}/replies`, { params });
    return response.data;
  },
};