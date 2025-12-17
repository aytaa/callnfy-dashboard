import React from 'react';
import { Phone, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import { useGetCallsQuery } from '../../slices/apiSlice/callsApiSlice';
import { useGetAppointmentsQuery } from '../../slices/apiSlice/appointmentsApiSlice';
import DataTable from '../../components/DataTable';
import Card from '../../components/Card';

export default function Overview() {
  const user = useSelector(selectCurrentUser);
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery();
  const { data: callsData, isLoading: callsLoading } = useGetCallsQuery({ page: 1, limit: 5 });
  const { data: appointmentsData, isLoading: appointmentsLoading } = useGetAppointmentsQuery(1);

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const business = businesses?.[0];
  const calls = callsData?.calls || [];
  const appointments = appointmentsData?.appointments || [];

  // Calculate stats
  const todaysCalls = calls.filter(call => {
    const callDate = new Date(call.createdAt);
    const today = new Date();
    return callDate.toDateString() === today.toDateString();
  }).length;

  const totalMinutes = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
  const minutesFormatted = `${Math.floor(totalMinutes / 60)}:${String(totalMinutes % 60).padStart(2, '0')}`;

  const todaysAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  }).length;

  const callsColumns = [
    { header: 'Caller', accessor: 'caller' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (row) => {
        const mins = Math.floor(row.duration / 60);
        const secs = row.duration % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded capitalize">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Time',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
  ];

  if (businessesLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-8">
            <Phone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Callnfy!</h2>
            <p className="text-gray-400 mb-6">
              Create your business to start receiving calls and managing appointments.
            </p>
            <Link
              to="/settings?tab=business"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Business
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <p className="text-gray-500 text-sm mb-1">{business.name}</p>
          <h1 className="text-3xl font-bold text-white">Welcome {userName}</h1>
        </div>

        {/* Metrics Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Metrics</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-[#303030] rounded-lg text-gray-400 hover:border-[#3a3a3a] hover:text-gray-300 transition-colors">
                Last Month
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today's Calls */}
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Today's Calls</p>
              <p className="text-2xl font-bold text-white mb-1">{todaysCalls}</p>
              <p className="text-sm text-gray-600">Total calls received today</p>
            </div>

            {/* Card 2: Minutes Used */}
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Minutes Used</p>
              <p className="text-2xl font-bold text-white mb-1">{minutesFormatted}</p>
              <p className="text-sm text-gray-600">Total call duration</p>
            </div>

            {/* Card 3: Today's Appointments */}
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Today's Appointments</p>
              <p className="text-2xl font-bold text-white mb-1">{todaysAppointments}</p>
              <p className="text-sm text-gray-600">Scheduled for today</p>
            </div>

            {/* Card 4: Total Calls */}
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Total Calls</p>
              <p className="text-2xl font-bold text-white mb-1">{calls.length}</p>
              <p className="text-sm text-gray-600">All time</p>
            </div>
          </div>
        </div>

        {/* Recent Calls Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Calls</h2>
            <Link
              to="/dashboard/calls"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          {callsLoading ? (
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          ) : calls.length > 0 ? (
            <DataTable columns={callsColumns} data={calls} />
          ) : (
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="text-white font-semibold mb-1">No calls yet</p>
                <p className="text-sm text-gray-500">Your recent calls will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Upcoming Appointments</h2>
            <Link
              to="/dashboard/appointments"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
          {appointmentsLoading ? (
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid gap-4">
              {appointments.slice(0, 3).map((appointment) => (
                <Card key={appointment.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {appointment.customerName || 'Unknown'}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded capitalize">
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-white opacity-60">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-white opacity-60 text-sm">{appointment.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-[#171717] border border-[#303030] rounded-xl p-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                </div>
                <p className="text-white font-semibold mb-1">No appointments scheduled</p>
                <p className="text-sm text-gray-500">Upcoming appointments will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
