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
  // With httpOnly cookies, we can't check tokens directly
  // isAuthenticated is set based on user presence or successful /auth/me call
  isAuthenticated: !!getStoredUser(),
  // Track if we've checked auth status on app load
  isAuthChecked: false,
  // Track if a forced logout was triggered (auth error, rate limit, etc.)
  // This prevents re-authentication race conditions
  forceLogout: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;

      // Don't set credentials if forceLogout is true (prevents race conditions)
      if (state.forceLogout) {
        return;
      }

      if (user !== undefined) {
        state.user = user;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          state.isAuthenticated = true;
        }
      }
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setForceLogout: (state, action) => {
      state.forceLogout = action.payload;
    },
    clearForceLogout: (state) => {
      state.forceLogout = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setAuthChecked, setForceLogout, clearForceLogout, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;
export const selectForceLogout = (state) => state.auth.forceLogout;
