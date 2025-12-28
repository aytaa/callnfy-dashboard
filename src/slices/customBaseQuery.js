import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.callnfy.com/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    console.log('[prepareHeaders] Access token from state:', token ? `${token.substring(0, 20)}...` : 'none');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      console.log('[prepareHeaders] Authorization header set');
    } else {
      console.log('[prepareHeaders] No token - Authorization header NOT set');
    }
    return headers;
  },
  paramsSerializer: (params) => {
    // Convert page and limit to numbers
    const serializedParams = { ...params };
    if (serializedParams.page !== undefined) {
      serializedParams.page = Number(serializedParams.page);
    }
    if (serializedParams.limit !== undefined) {
      serializedParams.limit = Number(serializedParams.limit);
    }
    return new URLSearchParams(serializedParams).toString();
  },
});

// Mutex to prevent multiple simultaneous refresh attempts
let refreshPromise = null;

export const customBaseQuery = async (args, api, extraOptions) => {
  console.log('=== API REQUEST ===');
  console.log('URL:', args.url || args);
  console.log('Method:', args.method || 'GET');

  // Get current token from state before request
  const currentToken = api.getState().auth.accessToken;
  console.log('Current access token exists:', !!currentToken);
  console.log('Access token preview:', currentToken ? `${currentToken.substring(0, 20)}...` : 'none');

  let result = await baseQuery(args, api, extraOptions);

  console.log('Response status:', result.error?.status || result.meta?.response?.status || 'OK');
  console.log('Response data:', result.data ? 'Data received' : 'No data');
  console.log('Response error:', result.error || 'No error');

  if (result?.error?.status === 401) {
    console.log('\n=== 401 DETECTED - ATTEMPTING REFRESH ===');

    const refreshToken = api.getState().auth.refreshToken;
    console.log('Refresh token exists:', !!refreshToken);
    console.log('Refresh token preview:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'none');

    if (refreshToken) {
      // If a refresh is already in progress, wait for it
      if (!refreshPromise) {
        console.log('Creating new refresh request...');
        refreshPromise = baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        ).finally(() => {
          console.log('Refresh request completed (finally block)');
          // Clear the promise when done (success or failure)
          refreshPromise = null;
        });
      } else {
        console.log('Refresh already in progress, waiting for existing promise...');
      }

      const refreshResult = await refreshPromise;

      console.log('\n=== REFRESH RESULT ===');
      console.log('Refresh success:', !!refreshResult?.data);
      console.log('Refresh error:', refreshResult?.error);
      console.log('Full refresh result:', refreshResult);

      if (refreshResult?.data?.data) {
        console.log('\n=== SAVING NEW TOKENS ===');
        console.log('New access token exists:', !!refreshResult.data.data.accessToken);
        console.log('New refresh token exists:', !!refreshResult.data.data.refreshToken);
        console.log('New access token preview:', refreshResult.data.data.accessToken ?
          `${refreshResult.data.data.accessToken.substring(0, 20)}...` : 'none');

        // CRITICAL: Keep existing refreshToken if backend doesn't return a new one
        const currentRefreshToken = refreshToken; // Already retrieved earlier

        console.log('Backend returned new refreshToken:', !!refreshResult.data.data.refreshToken);
        console.log('Using refreshToken:', refreshResult.data.data.refreshToken ? 'new from backend' : 'existing from state');

        api.dispatch(
          setCredentials({
            user: refreshResult.data.data.user,
            accessToken: refreshResult.data.data.accessToken,
            // Keep existing refreshToken if backend doesn't return a new one
            refreshToken: refreshResult.data.data.refreshToken || currentRefreshToken,
          })
        );

        console.log('Tokens saved to Redux state');

        // Verify tokens were saved correctly
        const newAccessToken = api.getState().auth.accessToken;
        const newRefreshToken = api.getState().auth.refreshToken;
        console.log('Verified new access token in state:', !!newAccessToken);
        console.log('Verified access token preview:', newAccessToken ? `${newAccessToken.substring(0, 20)}...` : 'none');
        console.log('✅ CRITICAL: Verified refresh token still exists:', !!newRefreshToken);
        console.log('Verified refresh token preview:', newRefreshToken ? `${newRefreshToken.substring(0, 20)}...` : 'none');

        // Double-check localStorage
        const lsAccessToken = localStorage.getItem('accessToken');
        const lsRefreshToken = localStorage.getItem('refreshToken');
        console.log('✅ localStorage access token exists:', !!lsAccessToken);
        console.log('✅ localStorage refresh token exists:', !!lsRefreshToken);
        console.log('⚠️ localStorage refresh token is "undefined" string:', lsRefreshToken === 'undefined');

        console.log('\n=== RETRYING ORIGINAL REQUEST ===');
        console.log('Retrying URL:', args.url || args);

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);

        console.log('Retry response status:', result.error?.status || 'OK');
        console.log('Retry success:', !result.error);
        console.log('Retry result:', result);
      } else {
        console.log('\n=== REFRESH FAILED - LOGGING OUT ===');
        console.log('Reason: No data in refresh response');
        console.log('Refresh error details:', refreshResult?.error);
        api.dispatch(logout());
      }
    } else {
      console.log('\n=== NO REFRESH TOKEN - LOGGING OUT ===');
      api.dispatch(logout());
    }
  }

  console.log('=== REQUEST COMPLETE ===\n');
  return result;
};
