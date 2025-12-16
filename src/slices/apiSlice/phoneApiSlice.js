import { apiSlice } from '../apiSlice';

export const phoneApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhoneNumbers: builder.query({
      query: () => '/phone-numbers',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PhoneNumber', id })),
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
    releasePhoneNumber: builder.mutation({
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
  useReleasePhoneNumberMutation,
} = phoneApiSlice;
