import { apiSlice } from '../apiSlice';

export const assistantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssistant: builder.query({
      query: () => '/assistants',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Assistant', id })),
              { type: 'Assistant', id: 'LIST' },
            ]
          : [{ type: 'Assistant', id: 'LIST' }],
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
  }),
});

export const {
  useGetAssistantQuery,
  useGetAssistantDetailQuery,
  useCreateAssistantMutation,
  useUpdateAssistantMutation,
} = assistantApiSlice;
