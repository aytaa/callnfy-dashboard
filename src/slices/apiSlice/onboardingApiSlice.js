import { apiSlice } from '../apiSlice';

export const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get onboarding status - checks actual data to determine progress
    getOnboardingStatus: builder.query({
      query: () => '/onboarding/status',
      transformResponse: (response) => response?.data || response,
      providesTags: ['Onboarding'],
    }),

    // Skip calendar step
    skipCalendarStep: builder.mutation({
      query: () => ({
        url: '/onboarding/skip-calendar',
        method: 'POST',
      }),
      invalidatesTags: ['Onboarding', 'User'],
    }),

    // Complete onboarding
    completeOnboarding: builder.mutation({
      query: () => ({
        url: '/onboarding/complete',
        method: 'POST',
      }),
      invalidatesTags: ['Onboarding', 'User'],
    }),
  }),
});

export const {
  useGetOnboardingStatusQuery,
  useSkipCalendarStepMutation,
  useCompleteOnboardingMutation,
} = onboardingApiSlice;
