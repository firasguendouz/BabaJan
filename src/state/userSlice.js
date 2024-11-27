import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { registerUser } from '../api/userApi';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: null, // For tracking async action status
  error: null, // For storing any errors
};

// Async action to register a new user
export const register = createAsyncThunk(
  'user/register',
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      // Sending the request to register a new user
      const response = await registerUser({ name, email, phone, password });
      return response.data; // The response should include user details or a success message
    } catch (error) {
      // Handle errors from the API and return a user-friendly message
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message); // Use backend-provided error message
      }
      return rejectWithValue('Registration failed. Please try again later.');
    }
  }
);

// Async action to log in a user
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      return response.data; // API response should return user and token
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Async action to fetch the current user (if token exists)
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user;
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // API response should return user details
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle registration
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      // Handle login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      // Handle fetching current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
