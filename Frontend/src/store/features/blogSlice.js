import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogApi } from '../../api/blogApi';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../../components/constants/index';

// INITIAL STATE
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


// Fetch All Blogs

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

// Fetch Blog by ID

export const fetchBlogById = createAsyncThunk(
     'blog/fetchBlogById',
     async (id, { rejectWithValue }) =>{
          try {
               const data = await blogApi.getBlogById(id);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

// Fetch User Blogs
export const fetchUserBlogs = createAsyncThunk(
     'blog/fetchUserBlogs',
     async ({ userId, params }, { rejectWithValue }) =>{
          try {
               const data = await blogApi.getBlogsByUser(userId, params);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

// Create Blog

export const createBlog = createAsyncThunk(
     'blog/createBlog',
     async (formData, { rejectWithValue }) =>{
          try {
               const data = await blogApi.createBlog(formData);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

// Update Blog

export const updateBlog = createAsyncThunk(
     'blog/updateBlog',
     async ({ id, formData }, { rejectWithValue }) =>{
          try {
               const data = await blogApi.updateBlog(id, formData);
               return data;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

// Delete Blog
export const deleteBlog = createAsyncThunk(
     'blog/deleteBlog',
     async (id, { rejectWithValue }) =>{
          try {
               await blogApi.deleteBlog(id);
               return id;
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

// Like Blog

export const likeBlog = createAsyncThunk(
     'blog/likeBlog',
     async ( id, { rejectWithValue }) =>{
          try {
               const data = await blogApi.likeBlog(id);
               return { id, likeCount: data.likeCount };
          } catch (error) {
               return rejectWithValue(error.response?.data || error.message);
          }
     }
);

const blogSlice = createSlice({
     name: 'blog',
     initialState,
     reducers: {
          setFilters: (state, action) =>{
               state.filters = { ...state.filters, ...action.payload };
          },
          clearCurrentBlog: (state) =>{
               state.currentBlog = null;
          },
          clearError: (state) =>{
               state.error = null;
          },
     },
     extraReducers: (builder) =>{
          builder
               // Fetch Blogs
               .addCase(fetchBlogs.pending, (state) =>{
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchBlogs.fulfilled, (state, action) =>{
                    state.loading = false;
                    state.blogs = action.payload.blogs;
                    state.pagination = action.payload.pagination;
               })
               .addCase(fetchBlogs.rejected, (state, action) =>{
                    state.loading = false;
                    // state.error = action.payload;
                     // Only show error if it's not 401 (unauthorized = guest = normal)
                    if (action.payload?.status !== 401) {
                         state.error = action.payload?.message || TOAST_MESSAGES.BLOG_LOAD_FAILED;
                    }
               })


               // Fetch Blogs by ID
               .addCase(fetchBlogById.pending, (state) =>{
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchBlogById.fulfilled, (state, action) =>{
                    state.loading = false;
                    state.currentBlog = action.payload.blog;
               })
               .addCase(fetchBlogById.rejected, (state, action) =>{
                    state.loading = false;
                    state.error = action.payload;
               })

               // Fetch User Blogs
               .addCase(fetchUserBlogs.pending, (state) =>{
                    state.loading = true;
               })
               .addCase(fetchUserBlogs.fulfilled, (state, action) =>{
                    state.loading = false;
                    state.blogs = action.payload.blogs;
                    state.pagination = action.payload.pagination;
               })
               .addCase(fetchUserBlogs.rejected, (state, action) =>{
                    state.loading = false;
                    state.error = action.payload;
               })

               // Create Blog
               .addCase(createBlog.pending, (state) =>{
                    state.loading = true;
               })
               .addCase(createBlog.fulfilled, (state, action) =>{
                    state.loading = false;
                    state.blogs.unshift(action.payload.blog);
                    toast.success = (TOAST_MESSAGES.BLOG_CREATED);
               })
               .addCase(createBlog.rejected, (state, action) =>{
                    state.loading = false;
                    state.error = action.payload;
                    toast.error(action.payload?.message || TOAST_MESSAGES.BLOG_CREATE_FAILED);
               })


               // Update Blog
               .addCase(updateBlog.pending, (state) =>{
                    state.loading = true;
               })
               .addCase(updateBlog.fulfilled, (state, action) =>{
                    state.loading = false;
                    const updated = action.payload.blog;
                    const index = state.blogs.findIndex((b) => b._id === updated._id);
                    if (index !== -1){
                         state.blogs[index] = updated;
                    }
                    state.currentBlog = updated;
                    toast.success(TOAST_MESSAGES.BLOG_UPDATED);
               })
               
               .addCase(updateBlog.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                    toast.error(action.payload?.message || TOAST_MESSAGES.BLOG_UPDATE_FAILED);
               })

               // Delete Blog
               .addCase(deleteBlog.fulfilled, (state, action) => {
                    state.blogs = state.blogs.filter((b) => b._id !== action.payload);
                    toast.success(TOAST_MESSAGES.BLOG_DELETED);
               })
               .addCase(deleteBlog.rejected, (state, action) => {
                    toast.error(action.payload?.message || TOAST_MESSAGES.BLOG_DELETE_FAILED);
               })

               // Like Blog
               .addCase(likeBlog.fulfilled, (state, action) =>{
                    const { id, likeCount } = action.payload;
                    const blog = state.blogs.find((b) => b._id === id);
                    if (blog) blog.like.count = likeCount;
                    if(state.currentBlog?._id === id){
                         state.currentBlog.like.count = likeCount;
                    }
               });
     },
});

export const { setFilters, clearCurrentBlog, clearError } = blogSlice.actions;

export default blogSlice.reducer;