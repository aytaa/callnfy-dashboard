import React, { useState } from 'react';
import { Search, Phone, Mail, Calendar, Loader2 } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from '../../slices/apiSlice/customersApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [error, setError] = useState('');

  // Fetch business first to get businessId
  const { data: businessData } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const businessId = businessData?.[0]?.id;

  const { data: customersData, isLoading } = useGetCustomersQuery(
    {
      businessId,
      page: Number(page),
      limit: 10,
      search: searchQuery,
    },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const customers = customersData?.customers || [];
  const pagination = customersData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      render: (value) => value || 0
    },
    {
      key: 'lastContact',
      label: 'Last Contact',
      render: (value) => value ? new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) : 'N/A'
    },
  ];

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name?.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.phone?.trim()) {
      setError('Phone number is required');
      return;
    }

    // Validate businessId is available
    if (!businessId) {
      setError('Business not loaded. Please refresh and try again.');
      return;
    }

    try {
      await createCustomer({
        ...formData,
        phone: formData.phone.trim(),
        businessId,
      }).unwrap();
      setIsAddModalOpen(false);
      setFormData({ name: '', phone: '', email: '' });
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to create customer');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(id).unwrap();
      setIsModalOpen(false);
      setSelectedCustomer(null);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to delete customer');
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Add Customer
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        {isLoading ? (
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          </div>
        ) : customers.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={customers}
              onRowClick={handleRowClick}
              emptyMessage="No customers found"
            />
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-gray-900 dark:text-white">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No customers yet</h3>
              <p className="text-xs text-gray-500 mb-4">
                Get started by adding your first customer
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-xs font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Customer Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Customer Details - ${selectedCustomer?.name}`}
          size="lg"
          footer={
            <>
              <button
                onClick={() => handleDeleteCustomer(selectedCustomer?.id)}
                disabled={isDeleting}
                className="border border-red-500 dark:border-red-600 text-red-500 dark:text-red-600 px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={closeModal}
                className="border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white px-3 py-1.5 text-sm rounded-lg hover:border-gray-300 dark:hover:border-[#3a3a3a] transition-colors"
              >
                Close
              </button>
            </>
          }
        >
          {selectedCustomer && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#1a1a1d] text-gray-900 dark:text-white text-xs font-medium rounded">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Join Date</p>
                    <p className="text-gray-900 dark:text-white text-sm">{selectedCustomer.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Calls</p>
                    <p className="text-gray-900 dark:text-white text-sm font-medium">{selectedCustomer.totalCalls}</p>
                  </div>
                </div>
              </div>

              {/* Call History */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Call History
                </h3>
                <div className="space-y-2">
                  {selectedCustomer?.callHistory?.length > 0 ? (
                    selectedCustomer.callHistory.map((call, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-900 dark:text-white text-sm">{call.outcome}</p>
                            <p className="text-xs text-gray-500">{call.date}</p>
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#111114] text-gray-900 dark:text-white text-xs font-medium rounded">
                            {call.duration}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs text-center py-3">No call history</p>
                  )}
                </div>
              </div>

              {/* Appointment History */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Appointments
                </h3>
                <div className="space-y-2">
                  {selectedCustomer?.appointments?.length > 0 ? (
                    selectedCustomer.appointments.map((appointment, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-gray-900 dark:text-white text-sm">{appointment.service}</p>
                            <p className="text-xs text-gray-500">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#111114] text-gray-900 dark:text-white text-xs font-medium rounded">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs text-center py-3">No appointments scheduled</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Add Customer Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormData({ name: '', phone: '', email: '' });
            setError('');
          }}
          title="Add New Customer"
          size="sm"
          footer={
            <>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: '', phone: '', email: '' });
                  setError('');
                }}
                className="border border-gray-200 dark:border-[#303030] text-gray-900 dark:text-white px-3 py-1.5 text-sm rounded-lg hover:border-gray-300 dark:hover:border-[#3a3a3a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={isCreating}
                className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Add Customer'}
              </button>
            </>
          }
        >
          <form onSubmit={handleAddCustomer} className="space-y-4">
            {error && (
              <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                placeholder="Customer name"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Email <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                placeholder="customer@email.com"
              />
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
