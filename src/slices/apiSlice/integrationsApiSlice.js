import { apiSlice } from '../apiSlice';

export const integrationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all integration statuses
    getIntegrationStatus: builder.query({
      query: (businessId) => `/integrations/${businessId}/status`,
      transformResponse: (response) => {
        const data = response?.data || response;
        // Convert snake_case to camelCase for frontend
        return {
          googleCalendar: data?.google_calendar || {},
          zapier: data?.zapier || {},
        };
      },
      providesTags: ['Integration'],
    }),

    // Google Calendar Integration
    connectGoogleCalendar: builder.mutation({
      query: ({ businessId, source }) => ({
        url: `/integrations/${businessId}/google/connect${source ? `?source=${source}` : ''}`,
        method: 'POST',
      }),
      transformResponse: (response) => response,
      invalidatesTags: ['Integration'],
    }),

    disconnectGoogleCalendar: builder.mutation({
      query: (businessId) => ({
        url: `/integrations/${businessId}/google/disconnect`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Integration'],
    }),

    updateGoogleCalendarSettings: builder.mutation({
      query: ({ businessId, settings }) => ({
        url: `/integrations/${businessId}/google/settings`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Integration'],
    }),

    getGoogleCalendars: builder.query({
      query: (businessId) => `/integrations/${businessId}/google/calendars`,
      transformResponse: (response) => response?.data || response,
      providesTags: ['Integration'],
    }),

    // Zapier Integration
    generateZapierKey: builder.mutation({
      query: (businessId) => ({
        url: `/integrations/${businessId}/zapier/generate-key`,
        method: 'POST',
      }),
      invalidatesTags: ['Integration'],
    }),

    updateZapierWebhook: builder.mutation({
      query: ({ businessId, webhookUrl }) => ({
        url: `/integrations/${businessId}/zapier/webhook`,
        method: 'PUT',
        body: { webhookUrl },
      }),
      invalidatesTags: ['Integration'],
    }),

    revokeZapierKey: builder.mutation({
      query: (businessId) => ({
        url: `/integrations/${businessId}/zapier/revoke-key`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Integration'],
    }),

    testZapierIntegration: builder.mutation({
      query: (businessId) => ({
        url: `/integrations/${businessId}/zapier/test`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetIntegrationStatusQuery,
  useConnectGoogleCalendarMutation,
  useDisconnectGoogleCalendarMutation,
  useUpdateGoogleCalendarSettingsMutation,
  useGetGoogleCalendarsQuery,
  useGenerateZapierKeyMutation,
  useUpdateZapierWebhookMutation,
  useRevokeZapierKeyMutation,
  useTestZapierIntegrationMutation,
} = integrationsApiSlice;
