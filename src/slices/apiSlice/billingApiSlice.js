import {apiSlice} from '../apiSlice';

export const billingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscription: builder.query({
            query: () => '/billing/subscription',
            transformResponse: (response) => response?.data || response,
            providesTags: ['Billing'],
        }),

        // Get payment method
        getPaymentMethod: builder.query({
            query: () => '/billing/payment-method',
            transformResponse: (response) => response?.data || response,
            providesTags: ['Billing'],
        }),

        // Get invoices/billing history
        getInvoices: builder.query({
            query: () => '/billing/invoices',
            transformResponse: (response) => response?.data || response,
            providesTags: ['Billing'],
        }),

        // Get Stripe Customer Portal URL
        getPortalUrl: builder.mutation({
            query: () => ({
                url: '/billing/portal',
                method: 'POST',
            }),
            transformResponse: (response) => response?.data || response,
        }),

        // Cancel subscription
        cancelSubscription: builder.mutation({
            query: () => ({
                url: '/billing/cancel',
                method: 'POST',
            }),
            invalidatesTags: ['Billing'],
        }),
    }),
});

export const {
    useGetSubscriptionQuery,
    useGetPaymentMethodQuery,
    useGetInvoicesQuery,
    useGetPortalUrlMutation,
    useCancelSubscriptionMutation,
} = billingApiSlice;
