import {apiSlice} from '../apiSlice';

export const phoneApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPhoneNumbers: builder.query({
            query: ({page = 1, limit = 10} = {}) => ({
                url: '/phone-numbers',
                params: {
                    page: Number(page),
                    limit: Number(limit),
                },
            }),
            transformResponse: (response) => response?.data || {phoneNumbers: [], pagination: {}},
            providesTags: (result) =>
                result?.phoneNumbers
                    ? [
                        ...result.phoneNumbers.map(({id}) => ({type: 'PhoneNumber', id})),
                        {type: 'PhoneNumber', id: 'LIST'},
                    ]
                    : [{type: 'PhoneNumber', id: 'LIST'}],
        }),
        listAvailableNumbers: builder.query({
            query: ({provider, businessId, areaCode, country}) => ({
                url: '/phone-numbers/available',
                params: {
                    provider,
                    businessId,
                    areaCode,
                    country,
                },
            }),
            transformResponse: (response) => response?.data || [],
        }),
        purchasePhoneNumber: builder.mutation({
            query: (phoneNumberData) => ({
                url: '/phone-numbers',
                method: 'POST',
                body: phoneNumberData,
            }),
            invalidatesTags: [{type: 'PhoneNumber', id: 'LIST'}],
        }),
        syncPhoneNumbers: builder.mutation({
            query: (data) => ({
                url: '/phone-numbers/sync',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'PhoneNumber', id: 'LIST'}],
        }),
        assignPhoneNumber: builder.mutation({
            query: ({id, businessId}) => ({
                url: `/phone-numbers/${id}/assign`,
                method: 'POST',
                body: {businessId},
            }),
            invalidatesTags: (result, error, {id}) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        releasePhoneNumber: builder.mutation({
            query: (id) => ({
                url: `/phone-numbers/${id}/release`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        deletePhoneNumber: builder.mutation({
            query: (id) => ({
                url: `/phone-numbers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        getPhoneNumber: builder.query({
            query: (id) => `/phone-numbers/${id}`,
            transformResponse: (response) => response?.data || null,
            providesTags: (result, error, id) => [{type: 'PhoneNumber', id}],
        }),
        updatePhoneNumber: builder.mutation({
            query: ({id, ...data}) => ({
                url: `/phone-numbers/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, {id}) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        assignAssistant: builder.mutation({
            query: ({id, assistantId}) => ({
                url: `/phone-numbers/${id}/assign-assistant`,
                method: 'PATCH',
                body: {assistantId},
            }),
            invalidatesTags: (result, error, {id}) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        resyncPhoneNumber: builder.mutation({
            query: (id) => ({
                url: `/phone-numbers/${id}/resync`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                {type: 'PhoneNumber', id},
                {type: 'PhoneNumber', id: 'LIST'},
            ],
        }),
        // Twilio-specific endpoints
        searchTwilioNumbers: builder.mutation({
            query: ({businessId, country = 'US', type = 'local', areaCode, contains}) => ({
                url: '/twilio/numbers/search',
                method: 'POST',
                body: {
                    businessId,
                    country,
                    type,
                    ...(areaCode && {areaCode}),
                    ...(contains && {contains}),
                },
            }),
        }),
        buyTwilioNumber: builder.mutation({
            query: ({phoneNumber, businessId, friendlyName}) => ({
                url: '/twilio/numbers/buy',
                method: 'POST',
                body: {phoneNumber, businessId, friendlyName},
            }),
            invalidatesTags: [{type: 'PhoneNumber', id: 'LIST'}],
        }),
        releaseTwilioNumber: builder.mutation({
            query: (sid) => ({
                url: `/twilio/numbers/${sid}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'PhoneNumber', id: 'LIST'}],
        }),
        getTwilioNumberDetails: builder.query({
            query: (sid) => `/twilio/numbers/${sid}`,
            transformResponse: (response) => response?.data || null,
            providesTags: (result, error, sid) => [{type: 'PhoneNumber', id: sid}],
        }),
    }),
});

export const {
    useGetPhoneNumbersQuery,
    useGetPhoneNumberQuery,
    useListAvailableNumbersQuery,
    useLazyListAvailableNumbersQuery,
    usePurchasePhoneNumberMutation,
    useUpdatePhoneNumberMutation,
    useSyncPhoneNumbersMutation,
    useAssignPhoneNumberMutation,
    useReleasePhoneNumberMutation,
    useDeletePhoneNumberMutation,
    useAssignAssistantMutation,
    useResyncPhoneNumberMutation,
    // Twilio-specific hooks
    useSearchTwilioNumbersMutation,
    useBuyTwilioNumberMutation,
    useReleaseTwilioNumberMutation,
    useGetTwilioNumberDetailsQuery,
} = phoneApiSlice;
