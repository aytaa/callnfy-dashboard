import React, { useState } from 'react';
import { Search, Phone, Mail, Calendar } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock customers data
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.j@email.com',
      totalCalls: 8,
      lastContact: 'Dec 14, 2025',
      status: 'active',
      joinDate: 'Nov 1, 2025',
      callHistory: [
        { date: 'Dec 14, 2025', duration: '3:45', outcome: 'Appointment Booked' },
        { date: 'Dec 10, 2025', duration: '2:15', outcome: 'Info Provided' },
        { date: 'Dec 5, 2025', duration: '4:20', outcome: 'Question Answered' },
      ],
      appointments: [
        { date: 'Dec 15, 2025', time: '2:00 PM', service: 'Consultation', status: 'confirmed' },
        { date: 'Nov 28, 2025', time: '10:30 AM', service: 'Follow-up', status: 'completed' },
      ],
    },
    {
      id: 2,
      name: 'Mike Chen',
      phone: '(555) 234-5678',
      email: 'mike.chen@email.com',
      totalCalls: 12,
      lastContact: 'Dec 14, 2025',
      status: 'active',
      joinDate: 'Oct 15, 2025',
      callHistory: [
        { date: 'Dec 14, 2025', duration: '2:15', outcome: 'Info Provided' },
        { date: 'Dec 12, 2025', duration: '1:30', outcome: 'Follow-up' },
      ],
      appointments: [
        { date: 'Dec 20, 2025', time: '11:00 AM', service: 'Check-up', status: 'confirmed' },
      ],
    },
    {
      id: 3,
      name: 'Emily Davis',
      phone: '(555) 345-6789',
      email: 'emily.d@email.com',
      totalCalls: 3,
      lastContact: 'Dec 14, 2025',
      status: 'new',
      joinDate: 'Dec 10, 2025',
      callHistory: [
        { date: 'Dec 14, 2025', duration: '0:00', outcome: 'Missed Call' },
        { date: 'Dec 13, 2025', duration: '5:10', outcome: 'Inquiry' },
      ],
      appointments: [],
    },
    {
      id: 4,
      name: 'Robert Wilson',
      phone: '(555) 456-7890',
      email: 'r.wilson@email.com',
      totalCalls: 15,
      lastContact: 'Dec 14, 2025',
      status: 'active',
      joinDate: 'Sep 20, 2025',
      callHistory: [
        { date: 'Dec 14, 2025', duration: '1:30', outcome: 'Left Message' },
        { date: 'Dec 8, 2025', duration: '3:00', outcome: 'Consultation' },
      ],
      appointments: [
        { date: 'Dec 22, 2025', time: '3:00 PM', service: 'Follow-up', status: 'pending' },
      ],
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      phone: '(555) 567-8901',
      email: 'lisa.anderson@email.com',
      totalCalls: 6,
      lastContact: 'Dec 14, 2025',
      status: 'active',
      joinDate: 'Nov 5, 2025',
      callHistory: [
        { date: 'Dec 14, 2025', duration: '4:20', outcome: 'Question Answered' },
        { date: 'Dec 7, 2025', duration: '2:45', outcome: 'Info Request' },
      ],
      appointments: [],
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    { header: 'Total Calls', accessor: 'totalCalls' },
    { header: 'Last Contact', accessor: 'lastContact' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-400 text-xs font-medium rounded">
          {row.status}
        </span>
      ),
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
        <button className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customers Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        onRowClick={handleRowClick}
        emptyMessage="No customers found"
      />

      {/* Customer Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Customer Details - ${selectedCustomer?.name}`}
        size="lg"
        footer={
          <>
            <button
              onClick={closeModal}
              className="border border-gray-300 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 px-3 py-1.5 text-sm rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              Close
            </button>
          </>
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="bg-gray-800/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="text-white font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-400 text-xs font-medium rounded">
                    {selectedCustomer.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="text-white">{selectedCustomer.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Calls</p>
                  <p className="text-white font-semibold">{selectedCustomer.totalCalls}</p>
                </div>
              </div>
            </Card>

            {/* Call History */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call History
              </h3>
              <div className="space-y-2">
                {selectedCustomer.callHistory.length > 0 ? (
                  selectedCustomer.callHistory.map((call, index) => (
                    <Card key={index} className="bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{call.outcome}</p>
                          <p className="text-sm text-gray-400">{call.date}</p>
                        </div>
                        <Badge variant="default">{call.duration}</Badge>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No call history</p>
                )}
              </div>
            </div>

            {/* Appointment History */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointments
              </h3>
              <div className="space-y-2">
                {selectedCustomer.appointments.length > 0 ? (
                  selectedCustomer.appointments.map((appointment, index) => (
                    <Card key={index} className="bg-gray-800/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{appointment.service}</p>
                          <p className="text-sm text-gray-400">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-400 text-xs font-medium rounded">
                          {appointment.status}
                        </span>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
