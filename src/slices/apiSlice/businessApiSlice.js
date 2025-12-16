import { apiSlice } from '../apiSlice';

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusiness: builder.query({
      query: () => '/businesses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Business', id })),
              { type: 'Business', id: 'LIST' },
            ]
          : [{ type: 'Business', id: 'LIST' }],
    }),
    getBusinessDetail: builder.query({
      query: (id) => `/businesses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Business', id }],
    }),
    createBusiness: builder.mutation({
      query: (business) => ({
        url: '/businesses',
        method: 'POST',
        body: business,
      }),
      invalidatesTags: [{ type: 'Business', id: 'LIST' }],
    }),
    updateBusiness: builder.mutation({
      query: ({ id, ...business }) => ({
        url: `/businesses/${id}`,
        method: 'PUT',
        body: business,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Business', id },
        { type: 'Business', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useGetBusinessDetailQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
} = businessApiSlice;
