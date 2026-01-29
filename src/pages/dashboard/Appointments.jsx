import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, List, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';
import { useGetBookingsQuery, useCreateBookingMutation } from '../../slices/apiSlice/bookingsApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import { useGetCustomersQuery } from '../../slices/apiSlice/customersApiSlice';

const INITIAL_FORM_DATA = {
  customer: '',
  customerPhone: '',
  customerEmail: '',
  service: '',
  date: '',
  time: '',
  notes: '',
};

export default function Appointments() {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState('');

  // Customer autocomplete state
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customerInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch business first to get businessId
  const { data: businessData } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const businessId = businessData?.[0]?.id;

  // Fetch appointments from API with businessId
  const { data: bookingsData, isLoading, error: queryError } = useGetBookingsQuery(
    {
      businessId,
      page: Number(page),
      limit: 100
    },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  // Fetch customers for autocomplete
  const { data: customersData } = useGetCustomersQuery(
    { businessId, search: customerSearch, limit: 10 },
    { skip: !businessId || !customerSearch || customerSearch.length < 2 }
  );
  const customers = customersData?.customers || [];

  // Extract appointments from API response
  const appointments = bookingsData?.bookings || [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        customerInputRef.current && !customerInputRef.current.contains(e.target)
      ) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const serviceOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'assessment', label: 'Initial Assessment' },
    { value: 'check-up', label: 'Check-up' },
  ];

  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value, row) => row.customerName || 'N/A'
    },
    {
      key: 'customerPhone',
      label: 'Phone',
      render: (value, row) => row.customerPhone || 'N/A'
    },
    {
      key: 'service',
      label: 'Service',
      sortable: true,
      render: (value, row) => row.service || 'N/A'
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value, row) => row.date ? new Date(row.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'N/A'
    },
    {
      key: 'time',
      label: 'Time',
      render: (value, row) => row.time || 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => {
        const status = row.status || 'pending';
        const statusColors = {
          pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
          confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
          completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
          cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
        };
        return (
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${statusColors[status] || 'bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white'}`}>
            {status}
          </span>
        );
      },
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

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => {
      if (!apt.date || apt.status === 'cancelled') return false;
      // Compare date strings directly — apt.date is "yyyy-MM-dd"
      // Avoid new Date() parsing which shifts dates across timezones
      const aptDate = apt.date.slice(0, 10);
      return aptDate === dateStr;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      completed: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
      cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-[#262626] text-gray-700 dark:text-gray-300';
  };

  const isToday = (day) => {
    if (!day) return false;
    const now = new Date();
    return (
      day === now.getDate() &&
      currentDate.getMonth() === now.getMonth() &&
      currentDate.getFullYear() === now.getFullYear()
    );
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    setFormData(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
    }));
    setIsModalOpen(true);
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

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedCustomer(null);
    setCustomerSearch('');
    setShowCustomerDropdown(false);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer.name,
      customerPhone: customer.phone || '',
      customerEmail: customer.email || '',
    }));
    setSelectedCustomer(customer);
    setShowCustomerDropdown(false);
  };

  const handleCustomerInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, customer: value }));
    setCustomerSearch(value);
    setShowCustomerDropdown(true);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Map industry to booking type, default to 'appointment'
      const industryTypeMap = {
        hair_salon: 'appointment',
        beauty_salon: 'appointment',
        clinic: 'appointment',
        plumber: 'job_request',
        electrician: 'job_request',
        hotel: 'reservation',
      };
      const industry = businessData?.[0]?.industry;
      const type = industryTypeMap[industry] || 'appointment';

      const bookingData = {
        businessId,
        type,
        customerName: formData.customer,
        service: formData.service,
        date: formData.date,
        time: formData.time,
      };

      if (formData.customerPhone) bookingData.customerPhone = formData.customerPhone;
      if (formData.customerEmail) bookingData.customerEmail = formData.customerEmail;
      if (selectedCustomer?.id) bookingData.customerId = selectedCustomer.id;
      if (formData.notes && formData.notes.trim()) bookingData.notes = formData.notes.trim();

      await createBooking(bookingData).unwrap();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to create appointment');
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center h-full bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="px-8 py-6 bg-gray-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Appointments</h1>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {queryError?.data?.error?.message || queryError?.data?.message || 'Failed to load appointments'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Error display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-gray-100 dark:bg-[#262626] rounded-lg p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  view === 'calendar'
                    ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  view === 'list'
                    ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-[#303030]">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayAppointments = getAppointmentsForDay(day);
                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[140px] p-1.5 border-b border-r border-gray-200 dark:border-[#303030] transition-colors ${
                      day
                        ? 'hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer'
                        : 'bg-gray-50/50 dark:bg-[#0f0f11]'
                    } ${isToday(day) ? 'bg-violet-50/50 dark:bg-violet-500/5' : ''} ${
                      index % 7 === 0 ? 'border-l' : ''
                    }`}
                  >
                    {day && (
                      <>
                        <div className="mb-1">
                          {isToday(day) ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-semibold">
                              {day}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-700 dark:text-gray-300 pl-0.5">{day}</span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1 min-w-0">
                          {dayAppointments.slice(0, 3).map((apt) => {
                            const displayTime = (apt.time || '').slice(0, 5);
                            const displayName = (apt.customerName || apt.customer?.name || '').trim();
                            return (
                              <div
                                key={apt.id}
                                onClick={(e) => e.stopPropagation()}
                                className={`block text-xs px-2 py-1 rounded truncate ${getStatusColor(apt.status)}`}
                                title={`${displayTime}${displayName ? ' — ' + displayName : ''}${apt.service ? ' — ' + apt.service : ''}`}
                              >
                                {displayTime && <span className="font-semibold">{displayTime}</span>}
                                {displayTime && displayName && ' '}
                                {displayName}
                              </div>
                            );
                          })}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                              +{dayAppointments.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* List View */}
        {view === 'list' && (
          <DataTable
            columns={columns}
            data={appointments.filter(apt => apt.status !== 'cancelled')}
            loading={isLoading}
            emptyState={
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No appointments yet</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  Get started by scheduling your first appointment
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Appointment
                </button>
              </div>
            }
          />
        )}

        {/* Add Appointment Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Add New Appointment"
          footer={
            <>
              <button
                onClick={closeModal}
                className="border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white px-3 py-1.5 text-sm rounded-lg hover:border-gray-300 dark:hover:border-[#3a3a3a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating}
                className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Appointment'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            <div className="space-y-3">
              {/* Customer autocomplete */}
              <div className="relative">
                <label className="block text-xs text-gray-500 mb-1">
                  Customer
                </label>
                <input
                  ref={customerInputRef}
                  type="text"
                  value={formData.customer}
                  onChange={handleCustomerInputChange}
                  onFocus={() => { if (customerSearch.length >= 2) setShowCustomerDropdown(true); }}
                  placeholder="Search or enter new customer name"
                  className="w-full px-3 py-2 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-300 dark:focus:border-[#404040] transition-all duration-200"
                  required
                />

                {showCustomerDropdown && customerSearch.length >= 2 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                        >
                          <div className="text-sm text-gray-900 dark:text-white">{customer.name}</div>
                          {customer.phone && (
                            <div className="text-xs text-gray-500">{customer.phone}</div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No existing customers found
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setShowCustomerDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left border-t border-gray-200 dark:border-[#303030] hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
                    >
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        + Add &ldquo;{customerSearch}&rdquo; as new customer
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone"
                  name="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  disabled={!!(selectedCustomer?.phone)}
                />
                <Input
                  label="Email"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="customer@email.com"
                  disabled={!!(selectedCustomer?.email)}
                />
              </div>

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
          </form>
        </Modal>
      </div>
    </div>
  );
}
