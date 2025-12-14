import React, { useState } from 'react';
import { Phone, Clock, TrendingUp, MoreVertical, Play } from 'lucide-react';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function Calls() {
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedCall, setSelectedCall] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  // Mock data for calls
  const calls = [
    {
      id: 1,
      caller: 'Sarah Johnson',
      phone: '(555) 123-4567',
      duration: '3:45',
      status: 'completed',
      outcome: 'Appointment Booked',
      datetime: 'Dec 14, 2025 10:30 AM',
      transcript: 'Customer called to schedule a consultation appointment. Discussed available time slots and confirmed booking for December 15th at 2:00 PM.',
      summary: 'Successfully booked consultation appointment. Customer expressed interest in our premium services.',
    },
    {
      id: 2,
      caller: 'Mike Chen',
      phone: '(555) 234-5678',
      duration: '2:15',
      status: 'completed',
      outcome: 'Info Provided',
      datetime: 'Dec 14, 2025 11:15 AM',
      transcript: 'Customer inquired about pricing and service packages. Provided detailed information about our starter and professional plans.',
      summary: 'Information request about pricing. Customer is considering professional plan upgrade.',
    },
    {
      id: 3,
      caller: 'Emily Davis',
      phone: '(555) 345-6789',
      duration: '0:00',
      status: 'missed',
      outcome: 'No Answer',
      datetime: 'Dec 14, 2025 1:45 PM',
      transcript: 'Call was not answered. No voicemail left.',
      summary: 'Missed call - no action taken.',
    },
    {
      id: 4,
      caller: 'Robert Wilson',
      phone: '(555) 456-7890',
      duration: '1:30',
      status: 'voicemail',
      outcome: 'Left Message',
      datetime: 'Dec 14, 2025 2:30 PM',
      transcript: 'Customer left a message requesting callback about rescheduling their appointment.',
      summary: 'Callback requested for appointment rescheduling.',
    },
    {
      id: 5,
      caller: 'Lisa Anderson',
      phone: '(555) 567-8901',
      duration: '4:20',
      status: 'completed',
      outcome: 'Question Answered',
      datetime: 'Dec 14, 2025 3:15 PM',
      transcript: 'Customer had questions about our refund policy and service guarantees. All questions were answered satisfactorily.',
      summary: 'Policy inquiry resolved. Customer satisfied with explanations provided.',
    },
    {
      id: 6,
      caller: 'David Martinez',
      phone: '(555) 678-9012',
      duration: '5:10',
      status: 'completed',
      outcome: 'Appointment Booked',
      datetime: 'Dec 14, 2025 4:00 PM',
      transcript: 'New customer calling for initial consultation. Discussed services, pricing, and scheduled first appointment.',
      summary: 'New customer onboarded. Initial consultation scheduled for December 16th.',
    },
    {
      id: 7,
      caller: 'Jennifer Lee',
      phone: '(555) 789-0123',
      duration: '2:45',
      status: 'completed',
      outcome: 'Follow-up Scheduled',
      datetime: 'Dec 14, 2025 4:45 PM',
      transcript: 'Follow-up call after previous service. Customer satisfied, scheduled next appointment.',
      summary: 'Successful follow-up. Customer retention confirmed.',
    },
  ];

  const columns = [
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
    { header: 'Date/Time', accessor: 'datetime' },
    {
      header: 'Actions',
      render: (row) => (
        <button className="text-gray-400 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      ),
    },
  ];

  const handleRowClick = (call) => {
    setSelectedCall(call);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCall(null);
  };

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header with Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Calls</h1>
          </div>
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Calls */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">Total Calls</p>
            <p className="text-2xl font-bold text-white mb-1">15</p>
            <p className="text-sm text-gray-600">+12%</p>
          </div>

          {/* Avg Duration */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">Avg Duration</p>
            <p className="text-2xl font-bold text-white mb-1">3:24</p>
            <p className="text-sm text-gray-600">+5%</p>
          </div>

          {/* Success Rate */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-2">Success Rate</p>
            <p className="text-2xl font-bold text-white mb-1">94%</p>
            <p className="text-sm text-gray-600">+3%</p>
          </div>
        </div>

        {/* Calls Table */}
        <DataTable
          columns={columns}
          data={calls}
          onRowClick={handleRowClick}
        />

        {/* Call Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Call Details - ${selectedCall?.caller}`}
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </>
          }
        >
          {selectedCall && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="text-white font-medium">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-white font-medium">{selectedCall.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date & Time</p>
                  <p className="text-white font-medium">{selectedCall.datetime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs font-medium rounded">
                    {selectedCall.status}
                  </span>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">AI Summary</h3>
                <p className="text-gray-300">{selectedCall.summary}</p>
              </div>

              {/* Transcript */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Transcript</h3>
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedCall.transcript}</p>
                </div>
              </div>

              {/* Audio Player Placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Recording</h3>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-lg p-4 flex items-center justify-center gap-3">
                  <Play className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full">
                    <div className="w-1/3 h-full bg-white rounded-full" />
                  </div>
                  <span className="text-sm text-gray-400">{selectedCall.duration}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
