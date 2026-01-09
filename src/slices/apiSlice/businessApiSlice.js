import { apiSlice } from '../apiSlice';

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinesses: builder.query({
      query: () => '/businesses',
      transformResponse: (response) => {
        // Handle nested response: {"success":true,"data":{"businesses":[]}}
        return response?.data?.businesses || response?.businesses || response?.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Business', id })),
              { type: 'Business', id: 'LIST' },
            ]
          : [{ type: 'Business', id: 'LIST' }],
    }),
    getBusiness: builder.query({
      query: (id) => `/businesses/${id}`,
      transformResponse: (response) => response?.data || null,
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
    deleteBusiness: builder.mutation({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Business', id },
        { type: 'Business', id: 'LIST' },
      ],
    }),
    updateOnboarding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/businesses/${id}/onboarding`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }],
    }),
    updateServices: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/businesses/${id}/services`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }],
    }),
    updateWorkingHours: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/businesses/${id}/working-hours`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }],
    }),
    updateAiSettings: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/businesses/${id}/ai-settings`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }],
    }),
    setupAi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/businesses/${id}/setup-ai`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Business', id }],
    }),
  }),
});

export const {
  useGetBusinessesQuery,
  useGetBusinessQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useUpdateOnboardingMutation,
  useUpdateServicesMutation,
  useUpdateWorkingHoursMutation,
  useUpdateAiSettingsMutation,
  useSetupAiMutation,
} = businessApiSlice;
