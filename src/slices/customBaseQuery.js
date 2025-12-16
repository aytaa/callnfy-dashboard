import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.callnfy.com/v1',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
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

export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = api.getState().auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data?.data) {
        api.dispatch(
          setCredentials({
            user: refreshResult.data.data.user,
            accessToken: refreshResult.data.data.accessToken,
            refreshToken: refreshResult.data.data.refreshToken,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
