import {createApi} from '@reduxjs/toolkit/query/react';
import {customBaseQuery} from './customBaseQuery';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    refetchOnMountOrArgChange: true,
    tagTypes: [
        'User',
        'Business',
        'Call',
        'Appointment',
        'Customer',
        'Subscription',
        'Assistant',
        'PhoneNumber',
        'Integration',
        'Billing',
    ],
    endpoints: (builder) => ({}),
});
