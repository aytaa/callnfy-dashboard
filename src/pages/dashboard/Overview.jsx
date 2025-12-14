import React from 'react';
import { Phone, Clock, Calendar, Users, TrendingUp } from 'lucide-react';
import StatCard from '../../components/StatCard';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';

export default function Overview() {
  const userName = 'John';

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
        <Badge variant={row.status === 'completed' ? 'green' : row.status === 'missed' ? 'red' : 'yellow'}>
          {row.status}
        </Badge>
      ),
    },
    { header: 'Outcome', accessor: 'outcome' },
    { header: 'Time', accessor: 'time' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {userName}!</h1>
        <p className="text-gray-400 mt-2">Here's what's happening with your calls today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Calls"
          value="45"
          change="+12%"
          trend="up"
          icon={Phone}
        />
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400">Minutes Used</p>
              <p className="text-2xl font-bold text-white mt-1">125/150</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <ProgressBar current={125} max={150} showPercentage={false} />
        </Card>
        <StatCard
          title="Appointments"
          value="8"
          icon={Calendar}
        />
        <StatCard
          title="New Customers"
          value="12"
          change="+8%"
          trend="up"
          icon={Users}
        />
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
                    <Badge variant={appointment.status === 'confirmed' ? 'green' : 'yellow'}>
                      {appointment.status}
                    </Badge>
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
  );
}
