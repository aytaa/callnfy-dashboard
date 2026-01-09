import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {logout, setCredentials} from './authSlice';
import toast from 'react-hot-toast';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.callnfy.com/v1',
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

// Rate limit tracking
let consecutive429Count = 0;
const RATE_LIMIT_THRESHOLD = 3;
let rateLimitToastId = null;

// Reset 429 counter on successful request
const resetRateLimitCounter = () => {
    consecutive429Count = 0;
};

// Handle 429 rate limit error
const handleRateLimitError = (api) => {
    consecutive429Count++;

    // Dismiss previous toast to avoid stacking
    if (rateLimitToastId) {
        toast.dismiss(rateLimitToastId);
    }

    if (consecutive429Count >= RATE_LIMIT_THRESHOLD) {
        // Threshold reached - logout user
        toast.error('Session expired due to too many requests. Please login again.', {
            duration: 5000,
            id: 'rate-limit-logout',
        });
        api.dispatch(logout());
        // Redirect to login
        window.location.href = '/auth/login';
        return true; // Signal that we've logged out
    } else {
        // Show rate limit warning
        rateLimitToastId = toast.error(
            `Too many requests. Please wait a moment and try again. (${consecutive429Count}/${RATE_LIMIT_THRESHOLD})`,
            {
                duration: 4000,
                id: 'rate-limit-warning',
            }
        );
        return false;
    }
};

export const customBaseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Handle 429 Rate Limit - don't retry
    if (result?.error?.status === 429) {
        const loggedOut = handleRateLimitError(api);
        if (loggedOut) {
            // Return error without retrying
            return {
                error: {
                    status: 429,
                    data: {message: 'Too many requests. You have been logged out.'},
                },
            };
        }
        // Return the error without retrying
        return result;
    }

    // Reset counter on successful request or non-429 error
    if (!result?.error || result?.error?.status !== 429) {
        resetRateLimitCounter();
    }

    // Handle 401 Unauthorized - attempt token refresh
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

            // Check if refresh itself got rate limited
            if (refreshResult?.error?.status === 429) {
                handleRateLimitError(api);
                return {
                    error: {
                        status: 429,
                        data: {message: 'Too many requests. Please try again later.'},
                    },
                };
            }

            if (refreshResult?.data?.data) {
                api.dispatch(
                    setCredentials({
                        user: refreshResult.data.data.user,
                        accessToken: refreshResult.data.data.accessToken,
                        refreshToken: refreshResult.data.data.refreshToken || refreshToken,
                    })
                );

                result = await baseQuery(args, api, extraOptions);

                // Check if retry got rate limited
                if (result?.error?.status === 429) {
                    handleRateLimitError(api);
                    return result;
                }
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

// Custom retry condition for RTK Query - don't retry on 429
export const shouldRetry = (error) => {
    // Never retry on 429 (rate limit) or 401 (auth errors)
    if (error?.status === 429 || error?.status === 401) {
        return false;
    }
    // Retry on network errors or 5xx server errors
    return error?.status >= 500 || error?.status === 'FETCH_ERROR';
};
