import { apiSlice } from '../apiSlice';

export const assistantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssistant: builder.query({
      query: () => '/assistants',
      transformResponse: (response) => response?.data?.assistants || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Assistant', id })),
              { type: 'Assistant', id: 'LIST' },
            ]
          : [{ type: 'Assistant', id: 'LIST' }],
    }),
    getAssistantByBusiness: builder.query({
      query: (businessId) => `/assistants?businessId=${businessId}`,
      transformResponse: (response) => response?.data?.assistants?.[0] || null,
      providesTags: ['Assistant'],
    }),
    getAssistantDetail: builder.query({
      query: (id) => `/assistants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assistant', id }],
    }),
    createAssistant: builder.mutation({
      query: (assistant) => ({
        url: '/assistants',
        method: 'POST',
        body: assistant,
      }),
      invalidatesTags: [{ type: 'Assistant', id: 'LIST' }],
    }),
    updateAssistant: builder.mutation({
      query: ({ id, ...assistant }) => ({
        url: `/assistants/${id}`,
        method: 'PUT',
        body: assistant,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Assistant', id },
        { type: 'Assistant', id: 'LIST' },
      ],
    }),
    patchAssistant: builder.mutation({
      query: ({ id, ...assistant }) => ({
        url: `/assistants/${id}`,
        method: 'PATCH',
        body: assistant,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Assistant', id },
        { type: 'Assistant', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAssistantQuery,
  useGetAssistantByBusinessQuery,
  useGetAssistantDetailQuery,
  useCreateAssistantMutation,
  useUpdateAssistantMutation,
  usePatchAssistantMutation,
} = assistantApiSlice;
