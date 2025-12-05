import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogApi } from '../../api/blogApi';
import toast from 'react-hot-toast';


const initialState = {
     blogs: [],
     currentBlog: null,
     pagination: null,
     loading: false,
     error: null,
     filters: {
          page: 1, 
          limit: 10,
          category: '',
          tag: '',
          sortBy: 'data',
          sortOrder: 'desc',
     },
};

export const fetchBlogs = createAsyncThunk(
     'blog/fetchBlogs',
     async (params, { rejectWithValue }) =>{
          try {
               const data = await blogApi.getAllBlogs(params);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);


export const fetchBlogId = createAsyncThunk(
     'blog/fetchBlogId',
     async (params, { rejectWithValue }) =>{
          try {
               const data = await blogApi.getBlogById(id);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);


export const fetchUserBlogs = createAsyncThunk(
     'blog/fetchUserBlogs',
     async (params, { rejectWithValue }) =>{
          try {
               const data = await blogApi.getAllBlogs(params);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);