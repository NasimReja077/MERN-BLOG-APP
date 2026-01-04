// Frontend/src/store/features/thumbnailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogApi } from '../../api/blogApi';
import toast from 'react-hot-toast';

const initialState = {
  uploading: false,
  error: null,
  uploadProgress: 0,
};


// Upload thumbnail for existing blog
export const uploadThumbnail = createAsyncThunk(
  'thumbnail/upload',
  async ({ blogId, file }, { rejectWithValue }) => {
    try {
      const data = await blogApi.uploadThumbnail(blogId, file);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const thumbnailSlice = createSlice({
  name: 'thumbnail',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUpload: (state) => {
      state.uploading = false;
      state.error = null;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload Thumbnail
      .addCase(uploadThumbnail.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadThumbnail.fulfilled, (state) => {
        state.uploading = false;
        state.uploadProgress = 100;
        toast.success('Thumbnail uploaded successfully');
      })
      .addCase(uploadThumbnail.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
        toast.error(action.payload?.message || 'Failed to upload thumbnail');
      });
  },
});

export const { clearError, resetUpload } = thumbnailSlice.actions;
export default thumbnailSlice.reducer;