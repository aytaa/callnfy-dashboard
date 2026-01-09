import { apiSlice } from '../apiSlice';

export const appointmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: ({ businessId, page = 1, limit = 10, status, startDate, endDate } = {}) => ({
        url: '/appointments',
        params: {
          businessId,
          page: Number(page),
          limit: Number(limit),
          ...(status && { status }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      transformResponse: (response) => response?.data || { appointments: [], pagination: {} },
      providesTags: (result) =>
        result?.appointments
          ? [
              ...result.appointments.map(({ id }) => ({ type: 'Appointment', id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }],
    }),
    getAppointmentDetail: builder.query({
      query: (id) => `/appointments/${id}`,
      transformResponse: (response) => response?.data || null,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),
    createAppointment: builder.mutation({
      query: (appointment) => ({
        url: '/appointments',
        method: 'POST',
        body: appointment,
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...appointment }) => ({
        url: `/appointments/${id}`,
        method: 'PUT',
        body: appointment,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentDetailQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
} = appointmentsApiSlice;
