import { apiSlice } from '../apiSlice';

export const customersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ businessId, page = 1, limit = 10, search } = {}) => ({
        url: '/customers',
        params: {
          businessId,
          page: Number(page),
          limit: Number(limit),
          ...(search && { search }),
        },
      }),
      providesTags: (result) =>
        result?.customers
          ? [
              ...result.customers.map(({ id }) => ({ type: 'Customer', id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    getCustomerDetail: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    createCustomer: builder.mutation({
      query: (customer) => ({
        url: '/customers',
        method: 'POST',
        body: customer,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...customer }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: customer,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerDetailQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApiSlice;
