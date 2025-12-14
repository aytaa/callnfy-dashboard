import React from 'react';
import { Phone, TrendingUp } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Card from '../../components/Card';

export default function Overview() {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{" email":"aytac@callnfy.com","name":"Aytac"}');
  const userName = user.name || 'User';
  const userEmail = user.email || 'aytac@callnfy.com';

  // Mock data for recent calls
  const recentCalls = [
    {
      id: 1,
      caller: 'Sarah Johnson',
      phone: '(555) 123-4567',
      duration: '3:45',
      status: 'completed',
      outcome: 'Appointment Booked',
      time: '10:30 AM',
    },
    {
      id: 2,
      caller: 'Mike Chen',
      phone: '(555) 234-5678',
      duration: '2:15',
      status: 'completed',
      outcome: 'Info Provided',
      time: '11:15 AM',
    },
    {
      id: 3,
      caller: 'Emily Davis',
      phone: '(555) 345-6789',
      duration: '0:00',
      status: 'missed',
      outcome: 'No Answer',
      time: '1:45 PM',
    },
    {
      id: 4,
      caller: 'Robert Wilson',
      phone: '(555) 456-7890',
      duration: '1:30',
      status: 'voicemail',
      outcome: 'Left Message',
      time: '2:30 PM',
    },
    {
      id: 5,
      caller: 'Lisa Anderson',
      phone: '(555) 567-8901',
      duration: '4:20',
      status: 'completed',
      outcome: 'Question Answered',
      time: '3:15 PM',
    },
  ];

  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Consultation',
      date: 'Dec 15, 2025',
      time: '2:00 PM',
      status: 'confirmed',
    },
    {
      id: 2,
      customer: 'David Martinez',
      service: 'Follow-up',
      date: 'Dec 16, 2025',
      time: '10:30 AM',
      status: 'confirmed',
    },
    {
      id: 3,
      customer: 'Jennifer Lee',
      service: 'Initial Assessment',
      date: 'Dec 17, 2025',
      time: '3:30 PM',
      status: 'pending',
    },
  ];

  const callsColumns = [
    { header: 'Caller', accessor: 'caller' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Duration', accessor: 'duration' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs font-medium rounded">
          {row.status}
        </span>
      ),
    },
    { header: 'Outcome', accessor: 'outcome' },
    { header: 'Time', accessor: 'time' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <p className="text-gray-500 text-sm mb-1">{userEmail}'s Org</p>
          <h1 className="text-3xl font-bold text-white">Welcome {userName}</h1>
        </div>

        {/* Metrics Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Metrics</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded-lg text-gray-400 hover:border-[#3a3a3a] hover:text-gray-300 transition-colors">
                All Assistants
              </button>
              <button className="px-3 py-1.5 text-sm border border-[#2a2a2a] rounded-lg text-gray-400 hover:border-[#3a3a3a] hover:text-gray-300 transition-colors">
                Last Month
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today's Calls */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Today's Calls</p>
              <p className="text-2xl font-bold text-white mb-1">0</p>
              <p className="text-sm text-gray-600">— 0.0%</p>
            </div>

            {/* Card 2: Minutes Used */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Minutes Used</p>
              <p className="text-2xl font-bold text-white mb-1">0:00</p>
              <p className="text-sm text-gray-600">— 0.0%</p>
            </div>

            {/* Card 3: Appointments */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">Appointments</p>
              <p className="text-2xl font-bold text-white mb-1">0</p>
              <p className="text-sm text-gray-600">— 0.0%</p>
            </div>

            {/* Card 4: New Customers */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">New Customers</p>
              <p className="text-2xl font-bold text-white mb-1">0</p>
              <p className="text-sm text-gray-600">— 0.0%</p>
            </div>
          </div>
        </div>

        {/* Call Success Section */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Call Success</h3>
            <span className="text-2xl font-bold text-white">--</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
            </div>
            <p className="text-white font-semibold mb-1">Oops...</p>
            <p className="text-sm text-gray-500">You don't have any calls yet</p>
          </div>
        </div>

        {/* Recent Calls Table */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Calls</h2>
          <DataTable
            columns={callsColumns}
            data={recentCalls}
          />
        </div>

        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h2>
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{appointment.customer}</h3>
                      <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs font-medium rounded">
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-400">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{appointment.date}</p>
                    <p className="text-gray-400 text-sm">{appointment.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Chart Placeholder */}
        <Card>
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400">Call Success Chart - Coming Soon</h3>
            <p className="text-gray-500 mt-2">Advanced analytics and visualizations will be available here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
