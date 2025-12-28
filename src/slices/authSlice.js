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
      console.log('=== SET CREDENTIALS CALLED ===');
      console.log('Payload:', action.payload);

      const { user, accessToken, refreshToken } = action.payload;

      console.log('User:', user?.email || user?.name || 'No user');
      console.log('Access token exists:', !!accessToken);
      console.log('Refresh token exists:', !!refreshToken);

      // CRITICAL: Only update values that are provided (not undefined)
      // This prevents overwriting existing values with undefined

      if (user !== undefined) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('User updated');
      }

      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        console.log('Access token updated');
      }

      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Refresh token updated');
      }

      // Set authenticated if we have an access token
      if (accessToken) {
        state.isAuthenticated = true;
      }

      console.log('Tokens saved to localStorage');
      console.log('localStorage accessToken:', localStorage.getItem('accessToken')?.substring(0, 20) + '...');
      console.log('localStorage refreshToken:', localStorage.getItem('refreshToken')?.substring(0, 20) + '...');
    },
    token: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    logout: (state) => {
      console.log('=== LOGOUT CALLED ===');
      console.log('Current user:', state.user?.email || state.user?.name || 'No user');
      console.log('Clearing all auth data...');

      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      console.log('User logged out successfully');
    },
  },
});

export const { setCredentials, token, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
