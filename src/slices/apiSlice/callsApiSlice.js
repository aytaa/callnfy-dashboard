import { apiSlice } from '../apiSlice';

export const callsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalls: builder.query({
      query: (page = 1) => `/calls?page=${page}`,
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
      query: () => '/calls/stats',
      providesTags: [{ type: 'Call', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetCallsQuery,
  useGetCallDetailQuery,
  useGetCallStatsQuery,
} = callsApiSlice;
