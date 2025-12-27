import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentApi } from '../../api/commentApi';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../../components/constants/index';


const initialState = {
  comments: [],
  loading: false,
  error: null,
  pagination: null,
};


// FETCH COMMENTS

export const fetchComments = createAsyncThunk(
  'comment/fetchComments',
  async ({ blogId, params }, { rejectWithValue }) => {
    try {
      const data = await commentApi.getBlogComments(blogId, params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ADD COMMENT

export const addComment = createAsyncThunk(
  'comment/addComment',
  async (commentData,{ rejectWithValue }) =>{
     try {
      const data = await commentApi.addComment(commentData);
      return data;
     } catch (error) {
          return rejectWithValue(error.response?.data || error.message);
     }
  }
)

// ADD REPLY
export const addReply = createAsyncThunk(
     'comment/addReply',
  async ({ commentId, content }, { rejectWithValue}) =>{
     try {
          const data = await commentApi.addReply(commentId, content);
          return { commentId, reply: data.reply };
     } catch (error) {
          return rejectWithValue(error.response?.data || error.message);
     }
  }
)

// UPDATE COMMENT

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const data = await commentApi.updateComment(id, content);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// DELETE COMMENT
export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (id, { rejectWithValue }) =>{
    try {
      await commentApi.deleteComment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); 
    }
  }
);

// LIKE COMMENT
export const likeComment = createAsyncThunk(
  'comment/likeComment',
  async (id, { rejectWithValue }) =>{
    try {
      const data = await commentApi.likeComment(id);
      return  { id, likeComment: data.likeComment };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// SLICE

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.pagination = null;
    },
  },


  extraReducers: (builder) =>{
    builder

      // FETCH COMMENTS

      .addCase(fetchComments.pending, (state) =>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchComments.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
      })

      // ADD COMMENT
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload.comment);
        toast.success(TOAST_MESSAGES.COMMENT_ADDED);
      })
      .addCase(addComment.rejected, (state, action) =>{
        toast.error(action.payload?.message || TOAST_MESSAGES.COMMENT_ADD_FAILED);
      })

      // ADD REPLY
      .addCase(addReply.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c._id === action.payload.commentId);
        if (comment){
          if (!comment.replies) comment.replies = [];
          comment.replies.push(action.payload.reply);
        }
        toast.success(TOAST_MESSAGES.REPLY_ADDED);
      })

      // UPDATE COMMENT
      .addCase(updateComment.fulfilled,(state, action) =>{
        const updated = action.payload.comment;
        const index = state.comments.findIndex((c) => c._id === updated._id);

        if (index !== -1){
          state.comments[index] = updated;
        }
        toast.success(TOAST_MESSAGES.COMMENT_UPDATED);
      })

      //  DELETE COMMENT
      .addCase(deleteComment.fulfilled, (state, action) =>{
        const index = state.comments.findIndex((c) => c._id === action.payload);
        if(index !== -1){
          state.comments[index].comment = '[Comment deleted]';
          state.comments[index].isDeleted = true;
        }
        toast.success(TOAST_MESSAGES.COMMENT_DELETED);
      })

      // LIKE COMMENT
      .addCase(likeComment.fulfilled, (state, action) =>{
         const { id, likeCount } = action.payload;
        const comment = state.comments.find((c) => c._id === id);
        if (comment){
          comment.likes.count = likeCount;
        }
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;