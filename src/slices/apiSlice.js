import {createApi} from '@reduxjs/toolkit/query/react';
import {customBaseQuery} from './customBaseQuery';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    tagTypes: [
        'User',
        'Business',
        'Call',
        'Appointment',
        'Customer',
        'Subscription',
        'Assistant',
        'PhoneNumber',
    ],
    endpoints: (builder) => ({}),
});
