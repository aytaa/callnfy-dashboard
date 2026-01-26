import { apiSlice } from '../apiSlice';

export const onboardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get onboarding status - checks actual data to determine progress
    getOnboardingStatus: builder.query({
      query: () => '/onboarding/status',
      transformResponse: (response) => response?.data || response,
      providesTags: ['Onboarding'],
    }),

    // Save business info (Step 1)
    saveOnboardingBusiness: builder.mutation({
      query: (data) => ({
        url: '/businesses',
        method: 'POST',
        body: {
          name: data.businessName, // Map businessName to name
          industry: data.industry,
          country: data.country,
        },
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['Onboarding', 'Business'],
    }),

    // Create subscription with Stripe Checkout (Step 2)
    createOnboardingSubscription: builder.mutation({
      query: (data) => ({
        url: '/billing/subscribe',
        method: 'POST',
        body: data, // { businessId, plan, billingPeriod }
      }),
      transformResponse: (response) => response?.data || response,
    }),

    // Get assigned phone number after subscription (Step 3)
    getAssignedPhoneNumber: builder.query({
      query: () => '/billing/phone-info',
      transformResponse: (response) => response?.data || response,
      providesTags: ['PhoneNumber', 'Onboarding'],
    }),

    // Save assistant configuration (Step 4) - CREATE new assistant
    saveOnboardingAssistant: builder.mutation({
      query: (data) => ({
        url: '/assistants',
        method: 'POST',
        body: data, // { businessId, name, voiceId, voiceProvider, greeting, services, workingHours }
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['Onboarding', 'Assistant'],
    }),

    // Update existing assistant (Step 4) - UPDATE existing assistant
    updateOnboardingAssistant: builder.mutation({
      query: ({ assistantId, ...data }) => ({
        url: `/assistants/${assistantId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['Onboarding', 'Assistant'],
    }),

    // Initiate test call (Step 6)
    initiateOnboardingTestCall: builder.mutation({
      query: (data) => ({
        url: '/calls/test',
        method: 'POST',
        body: data, // { businessId, phoneNumber }
      }),
      transformResponse: (response) => response?.data || response,
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

    // Get available plans
    getPlans: builder.query({
      query: () => '/billing/plans',
      transformResponse: (response) => response?.data || response,
    }),

    // Get usage data (minutes used/limit)
    getUsage: builder.query({
      query: () => '/billing/usage',
      transformResponse: (response) => response?.data || response,
      providesTags: ['Usage'],
    }),
  }),
});

export const {
  useGetOnboardingStatusQuery,
  useSaveOnboardingBusinessMutation,
  useCreateOnboardingSubscriptionMutation,
  useGetAssignedPhoneNumberQuery,
  useSaveOnboardingAssistantMutation,
  useUpdateOnboardingAssistantMutation,
  useInitiateOnboardingTestCallMutation,
  useSkipCalendarStepMutation,
  useCompleteOnboardingMutation,
  useGetPlansQuery,
  useGetUsageQuery,
} = onboardingApiSlice;
