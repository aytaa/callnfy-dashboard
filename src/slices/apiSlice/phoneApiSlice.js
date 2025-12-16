import { apiSlice } from '../apiSlice';

export const phoneApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhoneNumbers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/phone-numbers',
        params: {
          page: Number(page),
          limit: Number(limit),
        },
      }),
      providesTags: (result) =>
        result?.phoneNumbers
          ? [
              ...result.phoneNumbers.map(({ id }) => ({ type: 'PhoneNumber', id })),
              { type: 'PhoneNumber', id: 'LIST' },
            ]
          : [{ type: 'PhoneNumber', id: 'LIST' }],
    }),
    purchasePhoneNumber: builder.mutation({
      query: (phoneNumberData) => ({
        url: '/phone-numbers',
        method: 'POST',
        body: phoneNumberData,
      }),
      invalidatesTags: [{ type: 'PhoneNumber', id: 'LIST' }],
    }),
    assignPhoneNumber: builder.mutation({
      query: ({ id, businessId }) => ({
        url: `/phone-numbers/${id}/assign`,
        method: 'POST',
        body: { businessId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PhoneNumber', id },
        { type: 'PhoneNumber', id: 'LIST' },
      ],
    }),
    releasePhoneNumber: builder.mutation({
      query: (id) => ({
        url: `/phone-numbers/${id}/release`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PhoneNumber', id },
        { type: 'PhoneNumber', id: 'LIST' },
      ],
    }),
    deletePhoneNumber: builder.mutation({
      query: (id) => ({
        url: `/phone-numbers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PhoneNumber', id },
        { type: 'PhoneNumber', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPhoneNumbersQuery,
  usePurchasePhoneNumberMutation,
  useAssignPhoneNumberMutation,
  useReleasePhoneNumberMutation,
  useDeletePhoneNumberMutation,
} = phoneApiSlice;
