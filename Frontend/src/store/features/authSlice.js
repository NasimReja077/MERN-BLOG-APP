import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import toast from "react-hot-toast";
import { TOAST_MESSAGES } from "../../components/constants/index";

// INITIAL STATE
const initialState = {
  user: null,
  // token: localStorage.getItem('token') || null,
  // isAuthenticated: !!localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// REGISTER USER

export const register = createAsyncThunk(
  // call API asynchronously
  "auth/register", // action type name. // createAsyncThunk name = prefix for async actions
  async (formData, { rejectWithValue }) => {
    // API call // rejectWithValue -return custom error
    try {
      const data = await authApi.register(formData); // Call API
      return data; // Returns --> action.payload
      // return await authApi.register(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Returns custom error
    }
  }
);

// VERIFY OTP

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (code, { rejectWithValue }) => {
    try {
      const data = await authApi.verifyOTP(code);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// LOGIN USER

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// LOGOUT USER

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// GET PROFILE

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getProfile();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// UPDATE PROFILE

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await authApi.updateProfile(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (emailInput, { rejectWithValue }) => {
    try {
      const email =
        typeof emailInput == "string" ? emailInput : emailInput?.email;
      if (!email) throw new Error("Email is requrd");

      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send reset link" }
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authApi.resetPassword(token, newPassword);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Password reset failed" }
      );
    }
  }
);

// ================
// AUTH SLICE
// ================

const authSlice = createSlice({
  name: "auth", // This gives a prefix to synchronous actions. // Slice name = prefix for reducers actions
  initialState,

  // SYNC REDUCERS (normal Actions)
  reducers: {
    clearError: (state) => {
      // Reducer Functions inside slice. // update the Redux state.
      state.error = null; // Reset error message
    },

    setCredentials: (state, action) => {
      state.user = action.payload.user; // Storing returned user
      // state.token = action.payload.token;     // Store token
      state.isAuthenticated = true; // Set login status
      // localStorage.setItem('token', action.payload.token);
    },

    clearCredentials: (state) => {
      state.user = null;
      // state.token = null;
      state.isAuthenticated = false;
      // localStorage.removeItem('token'); // Clear token
    },
  },

  // ASYNC REDUCERS for thunk

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.isAuthenticated = true;
        // localStorage.setItem('token', action.payload.token);
        toast.success(TOAST_MESSAGES.REGISTRATION_SUCCESS);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(
          action.payload?.message || TOAST_MESSAGES.REGISTRATION_FAILED
        );
      })

      // VERIFY OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        toast.success(TOAST_MESSAGES.EMAIL_VERIFIED);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(
          action.payload?.message || TOAST_MESSAGES.VERIFICATION_FAILED
        );
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.isAuthenticated = true;
        // localStorage.setItem('token', action.payload.token);
        toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || TOAST_MESSAGES.LOGIN_FAILED);
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        // state.token = null;
        state.isAuthenticated = false;
        // localStorage.removeItem('token');
        toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
      })

      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        // state.token = null;
        // localStorage.removeItem('token');
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        toast.success(TOAST_MESSAGES.PROFILE_UPDATED);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || TOAST_MESSAGES.UPDATE_FAILED);
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        // state.error = null;
      })

      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        toast.success(TOAST_MESSAGES.PASSWORD_RESET_SUCCESS);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || TOAST_MESSAGES.PASSWORD_RESET_FAILED);
      });

  },
});

export const { clearError, setCredentials, clearCredentials } = authSlice.actions; // Export synchronous action creators
export default authSlice.reducer; // Export reducer to store
