import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      // Refresh token is in httpOnly cookie - sent automatically
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (response) => response?.data || null,
      keepUnusedDataFor: 0,  // Don't cache
      refetchOnMountOrArgChange: true,  // Refetch every time component mounts
      providesTags: ['User'],
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),
    resendVerification: builder.mutation({
      query: (email) => ({
        url: '/auth/resend-verify',
        method: 'POST',
        body: { email },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
    updateUserOnboarding: builder.mutation({
      query: ({ step, completed }) => ({
        url: '/users/onboarding',
        method: 'PATCH',
        body: { step, completed },
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserOnboardingMutation,
  useUpdateProfileMutation,
} = authApiSlice;
