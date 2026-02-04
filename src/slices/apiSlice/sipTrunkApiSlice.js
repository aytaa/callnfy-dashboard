import { apiSlice } from '../apiSlice';

export const sipTrunkApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSipTrunks: builder.query({
      query: (businessId) => `/sip-trunks?businessId=${businessId}`,
      transformResponse: (response) => response?.data?.sipTrunks || response?.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'SipTrunk', id })),
              { type: 'SipTrunk', id: 'LIST' },
            ]
          : [{ type: 'SipTrunk', id: 'LIST' }],
    }),

    getSipTrunk: builder.query({
      query: (id) => `/sip-trunks/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (result, error, id) => [{ type: 'SipTrunk', id }],
    }),

    createSipTrunk: builder.mutation({
      query: (data) => ({
        url: '/sip-trunks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'SipTrunk', id: 'LIST' }],
    }),

    updateSipTrunk: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sip-trunks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SipTrunk', id },
        { type: 'SipTrunk', id: 'LIST' },
      ],
    }),

    deleteSipTrunk: builder.mutation({
      query: (id) => ({
        url: `/sip-trunks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'SipTrunk', id },
        { type: 'SipTrunk', id: 'LIST' },
      ],
    }),

    testSipTrunk: builder.mutation({
      query: (id) => ({
        url: `/sip-trunks/${id}/test`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'SipTrunk', id },
        { type: 'SipTrunk', id: 'LIST' },
      ],
    }),

    testSipTrunkCredentials: builder.mutation({
      query: (data) => ({
        url: '/sip-trunks/test-credentials',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSipTrunksQuery,
  useGetSipTrunkQuery,
  useCreateSipTrunkMutation,
  useUpdateSipTrunkMutation,
  useDeleteSipTrunkMutation,
  useTestSipTrunkMutation,
  useTestSipTrunkCredentialsMutation,
} = sipTrunkApiSlice;
