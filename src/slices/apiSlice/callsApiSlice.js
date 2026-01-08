import { apiSlice } from '../apiSlice';

export const callsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalls: builder.query({
      query: ({ businessId, page = 1, limit = 10, dateRange, status } = {}) => ({
        url: '/calls',
        params: {
          businessId,
          page: Number(page),
          limit: Number(limit),
          ...(dateRange && { dateRange }),
          ...(status && { status }),
        },
      }),
      providesTags: (result) =>
        result?.calls
          ? [
              ...result.calls.map(({ id }) => ({ type: 'Call', id })),
              { type: 'Call', id: 'LIST' },
            ]
          : [{ type: 'Call', id: 'LIST' }],
    }),
    getCallDetail: builder.query({
      query: (id) => `/calls/${id}`,
      providesTags: (result, error, id) => [{ type: 'Call', id }],
    }),
    getCallStats: builder.query({
      query: ({ businessId, dateRange } = {}) => ({
        url: '/calls/stats',
        params: {
          businessId,
          ...(dateRange && { dateRange }),
        },
      }),
      providesTags: [{ type: 'Call', id: 'STATS' }],
    }),
    testCall: builder.mutation({
      query: ({ businessId, phoneNumber }) => ({
        url: '/calls/test',
        method: 'POST',
        body: { businessId, phoneNumber },
      }),
    }),
    syncVapiCalls: builder.mutation({
      query: (businessId) => ({
        url: '/calls/sync-vapi',
        method: 'POST',
        body: { businessId },
      }),
      invalidatesTags: [{ type: 'Call', id: 'LIST' }, { type: 'Call', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetCallsQuery,
  useGetCallDetailQuery,
  useGetCallStatsQuery,
  useTestCallMutation,
  useSyncVapiCallsMutation,
} = callsApiSlice;
