import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {logout, setCredentials} from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.DEV
        ? 'https://api.callnfy.com/v1'
        : 'http://srv-captain--backend/v1',
    credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = getState().auth.accessToken;

        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
    paramsSerializer: (params) => {
        const serializedParams = {...params};
        if (serializedParams.page !== undefined) {
            serializedParams.page = Number(serializedParams.page);
        }
        if (serializedParams.limit !== undefined) {
            serializedParams.limit = Number(serializedParams.limit);
        }
        return new URLSearchParams(serializedParams).toString();
    },
});

let refreshPromise = null;

export const customBaseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        const refreshToken = api.getState().auth.refreshToken;

        if (refreshToken) {
            if (!refreshPromise) {
                refreshPromise = baseQuery(
                    {
                        url: '/auth/refresh',
                        method: 'POST',
                        body: {refreshToken},
                    },
                    api,
                    extraOptions
                ).finally(() => {
                    refreshPromise = null;
                });
            }

            const refreshResult = await refreshPromise;

            if (refreshResult?.data?.data) {
                api.dispatch(
                    setCredentials({
                        user: refreshResult.data.data.user,
                        accessToken: refreshResult.data.data.accessToken,
                        refreshToken: refreshResult.data.data.refreshToken || refreshToken,
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
