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
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;

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
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, setAuthChecked, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthChecked = (state) => state.auth.isAuthChecked;
