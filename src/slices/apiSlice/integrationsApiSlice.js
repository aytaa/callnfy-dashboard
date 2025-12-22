import { apiSlice } from '../apiSlice';

export const integrationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all integration statuses
    getIntegrationStatus: builder.query({
      query: () => '/integrations/status',
      transformResponse: (response) => response?.data || response,
      providesTags: ['Integration'],
    }),

    // Google Calendar Integration
    connectGoogleCalendar: builder.mutation({
      query: () => ({
        url: '/integrations/google/connect',
        method: 'POST',
      }),
      invalidatesTags: ['Integration'],
    }),

    disconnectGoogleCalendar: builder.mutation({
      query: () => ({
        url: '/integrations/google/disconnect',
        method: 'DELETE',
      }),
      invalidatesTags: ['Integration'],
    }),

    updateGoogleCalendarSettings: builder.mutation({
      query: (settings) => ({
        url: '/integrations/google/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Integration'],
    }),

    // Zapier Integration
    generateZapierKey: builder.mutation({
      query: () => ({
        url: '/integrations/zapier/generate-key',
        method: 'POST',
      }),
      invalidatesTags: ['Integration'],
    }),

    revokeZapierKey: builder.mutation({
      query: () => ({
        url: '/integrations/zapier/revoke-key',
        method: 'DELETE',
      }),
      invalidatesTags: ['Integration'],
    }),
  }),
});

export const {
  useGetIntegrationStatusQuery,
  useConnectGoogleCalendarMutation,
  useDisconnectGoogleCalendarMutation,
  useUpdateGoogleCalendarSettingsMutation,
  useGenerateZapierKeyMutation,
  useRevokeZapierKeyMutation,
} = integrationsApiSlice;
