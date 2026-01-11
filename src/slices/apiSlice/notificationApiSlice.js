import { apiSlice } from '../apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get notification settings (new API)
    // Response: { success: true, data: { settings: {...} } }
    getNotificationSettings: builder.query({
      query: () => '/notifications/settings',
      transformResponse: (response) => response?.data?.settings || response?.settings || response,
      providesTags: ['NotificationSettings'],
    }),

    // Update notification settings (new API)
    // Response: { success: true, data: { settings: {...}, message: '...' } }
    updateNotificationSettings: builder.mutation({
      query: (settings) => ({
        url: '/notifications/settings',
        method: 'PUT',
        body: settings,
      }),
      transformResponse: (response) => response?.data?.settings || response?.settings || response,
      invalidatesTags: ['NotificationSettings'],
    }),

    // Reset notification settings to defaults
    // Response: { success: true, data: { settings: {...}, message: '...' } }
    resetNotificationSettings: builder.mutation({
      query: () => ({
        url: '/notifications/settings/reset',
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.settings || response?.settings || response,
      invalidatesTags: ['NotificationSettings'],
    }),

    // Get notifications list with pagination
    getNotifications: builder.query({
      query: ({ limit = 20, offset = 0, unreadOnly = false } = {}) => ({
        url: '/notifications',
        params: { limit, offset, unreadOnly },
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result) =>
        result?.notifications
          ? [
              ...result.notifications.map(({ id }) => ({ type: 'Notification', id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    // Get unread count for badge
    getUnreadCount: builder.query({
      query: () => '/notifications/unread-count',
      transformResponse: (response) => response?.data?.count || response?.count || 0,
      providesTags: [{ type: 'Notification', id: 'COUNT' }],
    }),

    // Get notification preferences
    getNotificationPreferences: builder.query({
      query: () => '/notifications/preferences',
      transformResponse: (response) => response?.data || response,
      providesTags: ['NotificationPreferences'],
    }),

    // Update notification preferences
    updateNotificationPreferences: builder.mutation({
      query: (preferences) => ({
        url: '/notifications/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['NotificationPreferences'],
    }),

    // Mark single notification as read
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
        { type: 'Notification', id: 'COUNT' },
      ],
    }),

    // Phone/SMS Notification Settings
    // Get current phone settings
    getPhoneSettings: builder.query({
      query: () => '/notifications/phone',
      transformResponse: (response) => response?.data || response,
      providesTags: ['PhoneSettings'],
    }),

    // Send SMS verification code to phone number
    sendPhoneCode: builder.mutation({
      query: (phoneNumber) => ({
        url: '/notifications/phone/send-code',
        method: 'POST',
        body: { phoneNumber },
      }),
      transformResponse: (response) => response?.data || response,
    }),

    // Verify phone code
    verifyPhoneCode: builder.mutation({
      query: (code) => ({
        url: '/notifications/phone/verify',
        method: 'POST',
        body: { code },
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['PhoneSettings'],
    }),

    // Enable phone notifications
    enablePhoneNotifications: builder.mutation({
      query: () => ({
        url: '/notifications/phone/enable',
        method: 'POST',
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['PhoneSettings'],
    }),

    // Disable phone notifications
    disablePhoneNotifications: builder.mutation({
      query: () => ({
        url: '/notifications/phone/disable',
        method: 'POST',
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['PhoneSettings'],
    }),

    // Remove phone number
    removePhoneNumber: builder.mutation({
      query: () => ({
        url: '/notifications/phone',
        method: 'DELETE',
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: ['PhoneSettings'],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useResetNotificationSettingsMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  // Phone/SMS
  useGetPhoneSettingsQuery,
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
  useEnablePhoneNotificationsMutation,
  useDisablePhoneNotificationsMutation,
  useRemovePhoneNumberMutation,
} = notificationApiSlice;
