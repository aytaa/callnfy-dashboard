import React from 'react';
import { Phone, TrendingUp, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import { useGetCallsQuery } from '../../slices/apiSlice/callsApiSlice';
import { useGetBookingsQuery } from '../../slices/apiSlice/bookingsApiSlice';
import DataTable from '../../components/ui/DataTable';

export default function Overview() {
  const user = useSelector(selectCurrentUser);
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const business = businesses?.[0];
  const businessId = business?.id;

  const { data: callsData, isLoading: callsLoading } = useGetCallsQuery(
    { businessId, page: 1, limit: 5 },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );
  const { data: bookingsData, isLoading: bookingsLoading } = useGetBookingsQuery(
    { businessId, page: 1, limit: 10 },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const calls = callsData?.calls || [];
  const appointments = bookingsData?.bookings || [];

  // Helper to calculate duration from timestamps if duration is 0/null
  const calculateDuration = (call) => {
    if (call?.duration && call.duration > 0) return call.duration;
    if (call?.startedAt && call?.endedAt) {
      return Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000);
    }
    return 0;
  };

  // Helper to format duration as mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  // Format ended reason - "customer-ended-call" -> "Customer Ended Call"
  const formatEndedReason = (reason) => {
    if (!reason) return '-';
    return reason.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format cost - string "0.0315" -> "$0.03"
  const formatCost = (cost) => {
    if (!cost) return '$0.00';
    return `$${parseFloat(cost).toFixed(2)}`;
  };

  // Status styling map
  const getStatusStyle = (status) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      ended: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      missed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'no-answer': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      voicemail: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return styles[status] || 'bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white';
  };

  // Calculate stats
  const todaysCalls = calls.filter(call => {
    const callDate = new Date(call.createdAt);
    const today = new Date();
    return callDate.toDateString() === today.toDateString();
  }).length;

  const totalSeconds = calls.reduce((sum, call) => sum + calculateDuration(call), 0);
  const minutesFormatted = formatDuration(totalSeconds);

  const todaysAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  }).length;

  const callsColumns = [
    {
      key: 'startedAt',
      label: 'Date/Time',
      render: (_, row) => {
        const date = row?.startedAt || row?.createdAt;
        return date ? new Date(date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }) : '-';
      }
    },
    {
      key: 'callerPhone',
      label: 'Caller',
      render: (_, row) => row?.callerPhone || 'Unknown'
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => formatDuration(calculateDuration(row))
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${getStatusStyle(row?.status)}`}>
          {row?.status?.replace(/-/g, ' ') || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'endedReason',
      label: 'Ended Reason',
      render: (_, row) => formatEndedReason(row?.endedReason)
    },
    {
      key: 'cost',
      label: 'Cost',
      render: (_, row) => formatCost(row?.cost)
    },
  ];

  if (businessesLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
            <Phone className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Callnfy!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Create your business to start receiving calls and managing appointments.
            </p>
            <Link
              to="/settings?tab=business"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Business
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {userName}! Here's your {business.name} dashboard.</p>
        </div>

        {/* Metrics Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Metrics</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-[#303030] rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#3a3a3a] hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Last Month
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today's Calls */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Today's Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{todaysCalls}</p>
              <p className="text-xs text-gray-500">Total calls received today</p>
            </div>

            {/* Card 2: Minutes Used */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Minutes Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{minutesFormatted}</p>
              <p className="text-xs text-gray-500">Total call duration</p>
            </div>

            {/* Card 3: Today's Appointments */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{todaysAppointments}</p>
              <p className="text-xs text-gray-500">Scheduled for today</p>
            </div>

            {/* Card 4: Total Calls */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{calls.length}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </div>

        {/* Recent Calls Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Calls</h2>
            <Link
              to="/calls"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          {callsLoading ? (
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            </div>
          ) : calls.length > 0 ? (
            <DataTable columns={callsColumns} data={calls} />
          ) : (
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm mb-1">No calls yet</p>
                <p className="text-xs text-gray-500">Your recent calls will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h2>
            <Link
              to="/appointments"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          {bookingsLoading ? (
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid gap-3">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {appointment.customerName || 'Unknown'}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#111114] text-gray-900 dark:text-white text-xs font-medium rounded capitalize">
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-white/60 text-xs">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 dark:text-white text-sm">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-500 dark:text-white/60 text-xs">{appointment.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="text-gray-900 dark:text-white font-medium text-sm mb-1">No appointments scheduled</p>
                <p className="text-xs text-gray-500">Upcoming appointments will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
