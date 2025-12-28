import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse JSON from localStorage
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;

      // CRITICAL: Only update values that are provided (not undefined)
      // This prevents overwriting existing values with undefined

      if (user !== undefined) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }

      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Set authenticated if we have an access token
      if (accessToken) {
        state.isAuthenticated = true;
      }
    },
    token: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, token, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
