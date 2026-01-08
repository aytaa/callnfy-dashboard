import React, { useState } from 'react';
import { Phone, MoreVertical, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useGetCallsQuery, useGetCallStatsQuery, useSyncVapiCallsMutation } from '../../slices/apiSlice/callsApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import DataTable from '../../components/ui/DataTable';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export default function Calls() {
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCall, setSelectedCall] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch business first to get businessId
  const { data: businessData } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const businessId = businessData?.[0]?.id;

  const { data: callsData, isLoading: callsLoading } = useGetCallsQuery(
    {
      businessId,
      page,
      dateRange: dateFilter,
      status: statusFilter !== 'all' ? statusFilter : undefined
    },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );
  const { data: stats, isLoading: statsLoading } = useGetCallStatsQuery(
    { businessId, dateRange: dateFilter },
    { skip: !businessId, refetchOnMountOrArgChange: true }
  );

  const [syncVapiCalls, { isLoading: isSyncing }] = useSyncVapiCallsMutation();

  const handleSync = async () => {
    if (!businessId) return;
    try {
      const result = await syncVapiCalls(businessId).unwrap();
      toast.success(`Synced ${result.syncedCount || 0} calls`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to sync calls');
    }
  };

  const calls = callsData?.calls || [];
  const pagination = callsData?.pagination || {};

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'missed', label: 'Missed' },
    { value: 'voicemail', label: 'Voicemail' },
  ];

  const columns = [
    { header: 'Customer', accessor: 'caller' },
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
        <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded capitalize">
          {row.status}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick(row);
          }}
        >
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

  if (callsLoading && page === 1) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing || !businessId}
              loading={isSyncing}
            >
              {!isSyncing && <RefreshCw className="w-4 h-4 mr-2" />}
              {isSyncing ? 'Syncing...' : 'Sync Calls'}
            </Button>
          </div>
          <div className="flex gap-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={dateOptions}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-[#262626] rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-[#262626] rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Calls */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.totalCalls || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.percentChange > 0 ? '+' : ''}{stats?.percentChange || 0}%
              </p>
            </div>

            {/* Avg Duration */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.avgDuration ? `${Math.floor(stats.avgDuration / 60)}:${String(stats.avgDuration % 60).padStart(2, '0')}` : '0:00'}
              </p>
              <p className="text-xs text-gray-500">Average call time</p>
            </div>

            {/* Completed */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.completedCalls || 0}</p>
              <p className="text-xs text-gray-500">Successful calls</p>
            </div>

            {/* Missed */}
            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Missed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.missedCalls || 0}</p>
              <p className="text-xs text-gray-500">Missed calls</p>
            </div>
          </div>
        )}

        {/* Calls Table */}
        {callsLoading ? (
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          </div>
        ) : calls.length > 0 ? (
          <>
            <DataTable
              columns={columns}
              data={calls}
              onRowClick={handleRowClick}
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
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
              </div>
              <p className="text-gray-900 dark:text-white font-medium text-sm mb-1">No calls found</p>
              <p className="text-xs text-gray-500">Try adjusting your filters</p>
            </div>
          </div>
        )}

        {/* Call Details Modal */}
        {selectedCall && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            title={`Call Details - ${selectedCall?.caller || 'Unknown'}`}
            size="lg"
            footer={
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedCall.caller || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {Math.floor(selectedCall.duration / 60)}:{String(selectedCall.duration % 60).padStart(2, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded capitalize">
                    {selectedCall.status}
                  </span>
                </div>
              </div>

              {selectedCall.transcript && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Transcript</p>
                  <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                    <p className="text-gray-900 dark:text-white text-sm">{selectedCall.transcript}</p>
                  </div>
                </div>
              )}

              {selectedCall.summary && (
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Summary</p>
                  <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                    <p className="text-gray-900 dark:text-white text-sm">{selectedCall.summary}</p>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
