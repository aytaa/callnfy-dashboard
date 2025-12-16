import { apiSlice } from '../apiSlice';

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscription: builder.query({
      query: () => '/subscriptions',
      providesTags: [{ type: 'Subscription', id: 'CURRENT' }],
    }),
    createCheckout: builder.mutation({
      query: (checkoutData) => ({
        url: '/subscriptions/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: [{ type: 'Subscription', id: 'CURRENT' }],
    }),
    getPortalUrl: builder.mutation({
      query: () => ({
        url: '/subscriptions/portal',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useCreateCheckoutMutation,
  useGetPortalUrlMutation,
} = subscriptionApiSlice;
