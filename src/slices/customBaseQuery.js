import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {logout, setCredentials} from './authSlice';
import toast from 'react-hot-toast';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'https://api.callnfy.com/v1',
    credentials: 'include', // Send httpOnly cookies with every request
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

// Global flag to indicate refresh is in progress - exported for other components to check
export let isRefreshing = false;

// Small delay to ensure browser processes Set-Cookie header before retry
const waitForCookies = () => new Promise(resolve => setTimeout(resolve, 100));

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

    // Handle 401 Unauthorized or 403 Forbidden - attempt token refresh
    // Skip for auth endpoints (login, register, etc.) - these should return errors to the caller
    const requestUrl = typeof args === 'string' ? args : args?.url;
    const isAuthEndpoint = requestUrl?.startsWith('/auth/') && !requestUrl?.includes('/auth/refresh');

    if ((result?.error?.status === 401 || result?.error?.status === 403) && !isAuthEndpoint) {
        // Only attempt refresh if user is authenticated (has user in state)
        const isAuthenticated = api.getState().auth.isAuthenticated;

        if (isAuthenticated) {
            if (!refreshPromise) {
                // Set global flag so other components know refresh is in progress
                isRefreshing = true;

                // Refresh token is in httpOnly cookie - sent automatically
                refreshPromise = baseQuery(
                    {
                        url: '/auth/refresh',
                        method: 'POST',
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
                isRefreshing = false;
                handleRateLimitError(api);
                return {
                    error: {
                        status: 429,
                        data: {message: 'Too many requests. Please try again later.'},
                    },
                };
            }

            // Check if refresh itself failed with 401/403
            if (refreshResult?.error?.status === 401 || refreshResult?.error?.status === 403) {
                isRefreshing = false;
                api.dispatch(logout());
                window.location.href = '/auth/login';
                return result;
            }

            // Refresh succeeded - new tokens are set as cookies automatically
            // Check success by absence of error (not by presence of data)
            if (!refreshResult?.error) {
                // Update user info if returned
                if (refreshResult?.data?.data?.user) {
                    api.dispatch(setCredentials({ user: refreshResult.data.data.user }));
                }

                // Wait for browser to process the new Set-Cookie header
                await waitForCookies();

                // Retry the original request with new cookie
                result = await baseQuery(args, api, extraOptions);

                // Clear refreshing flag after retry completes
                isRefreshing = false;

                // Check if retry got rate limited
                if (result?.error?.status === 429) {
                    handleRateLimitError(api);
                    return result;
                }

                // If retry still returns 401 or 403, logout and redirect to login
                if (result?.error?.status === 401 || result?.error?.status === 403) {
                    api.dispatch(logout());
                    window.location.href = '/auth/login';
                    return result;
                }
            } else {
                // Refresh failed - logout and redirect
                isRefreshing = false;
                api.dispatch(logout());
                window.location.href = '/auth/login';
            }
        } else {
            // Not authenticated - redirect to login
            window.location.href = '/auth/login';
        }
    }

    return result;
};

// Custom retry condition for RTK Query - don't retry on auth/rate limit errors
export const shouldRetry = (error) => {
    // Never retry on 429 (rate limit), 401 (unauthorized), or 403 (forbidden)
    if (error?.status === 429 || error?.status === 401 || error?.status === 403) {
        return false;
    }
    // Retry on network errors or 5xx server errors
    return error?.status >= 500 || error?.status === 'FETCH_ERROR';
};
