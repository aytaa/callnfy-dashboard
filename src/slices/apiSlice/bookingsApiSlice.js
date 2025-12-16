import { apiSlice } from '../apiSlice';

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: ({ page = 1, limit = 10, status, startDate, endDate } = {}) => ({
        url: '/bookings',
        params: {
          page: Number(page),
          limit: Number(limit),
          ...(status && { status }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
      }),
      providesTags: (result) =>
        result?.bookings
          ? [
              ...result.bookings.map(({ id }) => ({ type: 'Booking', id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),
    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    getAvailability: builder.query({
      query: ({ date, serviceId } = {}) => ({
        url: '/bookings/availability',
        params: {
          ...(date && { date }),
          ...(serviceId && { serviceId }),
        },
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: '/bookings',
        method: 'POST',
        body: booking,
      }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    updateBooking: builder.mutation({
      query: ({ id, ...booking }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        body: booking,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useGetAvailabilityQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingsApiSlice;
