import { apiSlice } from '../apiSlice';

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        return `/bookings?${queryParams.toString()}`;
      },
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
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.date) queryParams.append('date', params.date);
        if (params?.serviceId) queryParams.append('serviceId', params.serviceId);
        return `/bookings/availability?${queryParams.toString()}`;
      },
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
