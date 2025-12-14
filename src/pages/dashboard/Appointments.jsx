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
        <Badge
          variant={
            row.status === 'confirmed'
              ? 'green'
              : row.status === 'pending'
              ? 'yellow'
              : 'red'
          }
        >
          {row.status}
        </Badge>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-gray-400 mt-1">Manage your scheduled appointments</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Appointment
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
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
                className={`aspect-square p-2 border border-gray-800 rounded-lg ${
                  day ? 'bg-gray-800/30 hover:bg-gray-800 cursor-pointer' : ''
                } ${day === 14 ? 'border-blue-500' : ''}`}
              >
                {day && (
                  <>
                    <div className="text-sm text-white mb-1">{day}</div>
                    {hasAppointment(day) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto" />
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
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
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
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
