import React, { useState } from 'react';
import { Search, Phone, Mail, Calendar } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Card from '../../components/Card';
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
  const { data: businessData } = useGetBusinessesQuery();
  const businessId = businessData?.[0]?.id;

  const { data: customersData, isLoading } = useGetCustomersQuery(
    {
      businessId,
      page: Number(page),
      limit: 10,
      search: searchQuery,
    },
    { skip: !businessId }
  );

  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const customers = customersData?.customers || [];
  const pagination = customersData?.pagination || {};

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Total Calls',
      accessor: 'totalCalls',
      render: (row) => row.totalCalls || 0
    },
    {
      header: 'Last Contact',
      accessor: 'lastContact',
      render: (row) => row.lastContact ? new Date(row.lastContact).toLocaleDateString('en-US', {
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

    try {
      await createCustomer(formData).unwrap();
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
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
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
                <span className="flex items-center px-4 text-white">
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
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No customers yet</h3>
              <p className="text-sm text-white opacity-60 mb-6">
                Get started by adding your first customer
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
                className="border border-red-600 text-red-600 px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={closeModal}
                className="border border-[#303030] text-white px-3 py-1.5 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors"
              >
                Close
              </button>
            </>
          }
        >
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-[#212121] border border-[#303030] rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white opacity-60 mb-1">Name</p>
                    <p className="text-white font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-60 mb-1">Status</p>
                    <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white opacity-60" />
                    <div>
                      <p className="text-sm text-white opacity-60">Phone</p>
                      <p className="text-white">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white opacity-60" />
                    <div>
                      <p className="text-sm text-white opacity-60">Email</p>
                      <p className="text-white">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-60">Join Date</p>
                    <p className="text-white">{selectedCustomer.joinDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-60">Total Calls</p>
                    <p className="text-white font-semibold">{selectedCustomer.totalCalls}</p>
                  </div>
                </div>
              </div>

              {/* Call History */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call History
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.callHistory.length > 0 ? (
                    selectedCustomer.callHistory.map((call, index) => (
                      <div key={index} className="bg-[#171717] border border-[#303030] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{call.outcome}</p>
                            <p className="text-sm text-white opacity-60">{call.date}</p>
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded">
                            {call.duration}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No call history</p>
                  )}
                </div>
              </div>

              {/* Appointment History */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Appointments
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.appointments.length > 0 ? (
                    selectedCustomer.appointments.map((appointment, index) => (
                      <div key={index} className="bg-[#171717] border border-[#303030] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white font-medium">{appointment.service}</p>
                            <p className="text-sm text-white opacity-60">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                          <span className="inline-block px-2 py-0.5 bg-[#262626] text-white text-xs font-medium rounded">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
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
          footer={
            <>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: '', phone: '', email: '' });
                  setError('');
                }}
                className="border border-[#303030] text-white px-3 py-1.5 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={isCreating}
                className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Add Customer'}
              </button>
            </>
          }
        >
          <form onSubmit={handleAddCustomer} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm text-white opacity-60 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
                placeholder="Customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white opacity-60 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white opacity-60 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
                placeholder="customer@email.com"
                required
              />
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
