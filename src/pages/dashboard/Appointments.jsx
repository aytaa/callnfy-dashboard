import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import Card from '../../components/Card';

export default function Appointments() {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 14)); // Dec 14, 2025
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      phone: '(555) 123-4567',
      service: 'Consultation',
      date: 'Dec 15, 2025',
      time: '2:00 PM',
      status: 'confirmed',
      notes: 'First-time customer',
    },
    {
      id: 2,
      customer: 'David Martinez',
      phone: '(555) 234-5678',
      service: 'Follow-up',
      date: 'Dec 16, 2025',
      time: '10:30 AM',
      status: 'confirmed',
      notes: 'Regular customer',
    },
    {
      id: 3,
      customer: 'Jennifer Lee',
      phone: '(555) 345-6789',
      service: 'Initial Assessment',
      date: 'Dec 17, 2025',
      time: '3:30 PM',
      status: 'pending',
      notes: 'New inquiry',
    },
    {
      id: 4,
      customer: 'Michael Brown',
      phone: '(555) 456-7890',
      service: 'Consultation',
      date: 'Dec 18, 2025',
      time: '11:00 AM',
      status: 'confirmed',
      notes: '',
    },
    {
      id: 5,
      customer: 'Emma Wilson',
      phone: '(555) 567-8901',
      service: 'Check-up',
      date: 'Dec 19, 2025',
      time: '1:00 PM',
      status: 'pending',
      notes: 'Rescheduled from last week',
    },
    {
      id: 6,
      customer: 'James Taylor',
      phone: '(555) 678-9012',
      service: 'Follow-up',
      date: 'Dec 20, 2025',
      time: '9:00 AM',
      status: 'cancelled',
      notes: 'Customer cancelled',
    },
  ];

  const serviceOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'assessment', label: 'Initial Assessment' },
    { value: 'check-up', label: 'Check-up' },
  ];

  const columns = [
    { header: 'Customer', accessor: 'customer' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Service', accessor: 'service' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded">
          {row.status}
        </span>
      ),
    },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const hasAppointment = (day) => {
    if (!day) return false;
    const dateStr = `Dec ${day}, 2025`;
    return appointments.some(apt => apt.date === dateStr && apt.status !== 'cancelled');
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('New appointment:', formData);
    setIsModalOpen(false);
    setFormData({ customer: '', service: '', date: '', time: '', notes: '' });
  };

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Appointments</h1>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-[#262626] rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  view === 'calendar'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  view === 'list'
                    ? 'bg-[#2a2a2a] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Appointment
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {view === 'calendar' && (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square p-2 border rounded-lg ${
                    day ? 'border-[#303030] bg-[#212121] hover:bg-[#262626] cursor-pointer' : 'border-transparent'
                  } ${day === 14 ? 'border-white' : ''}`}
                >
                  {day && (
                    <>
                      <div className="text-sm text-white mb-1">{day}</div>
                      {hasAppointment(day) && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* List View */}
        {view === 'list' && (
          <DataTable
            columns={columns}
            data={appointments.filter(apt => apt.status !== 'cancelled')}
          />
        )}

        {/* Add Appointment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Appointment"
          footer={
            <>
              <button
                onClick={() => setIsModalOpen(false)}
                className="border border-[#303030] text-white px-3 py-1.5 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Create Appointment
              </button>
            </>
          }
        >
          <div className="space-y-3">
            <Input
              label="Customer Name"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              placeholder="Enter customer name"
            />
            <Select
              label="Service"
              name="service"
              options={serviceOptions}
              value={formData.service}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
            <Textarea
              label="Notes (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
              rows={2}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}
