import { apiSlice } from '../apiSlice';

export const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Legacy endpoint - use billingApiSlice for new billing features
    createCheckout: builder.mutation({
      query: (checkoutData) => ({
        url: '/billing/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
} = subscriptionApiSlice;
