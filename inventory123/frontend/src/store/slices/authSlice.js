import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, apiUtils } from '../../services/api';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      return response.data;
    } catch (error) {
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        throw new Error('No refresh token available');
      }
      const response = await authAPI.refreshToken(refresh);
      localStorage.setItem('access', response.data.access);
      return response.data;
    } catch (error) {
      apiUtils.clearAuth();
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('No access token available');
      }
      await authAPI.verifyToken(token);
      return { valid: true };
    } catch (error) {
      apiUtils.clearAuth();
      return rejectWithValue(apiUtils.handleError(error));
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem('access'),
  access: localStorage.getItem('access'),
  refresh: localStorage.getItem('refresh'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      apiUtils.clearAuth();
      state.isAuthenticated = false;
      state.access = null;
      state.refresh = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.access = action.payload.access;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.access = null;
        state.refresh = null;
        state.error = action.payload;
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.access = null;
        state.refresh = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 