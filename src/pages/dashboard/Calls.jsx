import React, {useState} from 'react';
import {
    Phone,
    MoreVertical,
    Loader2,
    RefreshCw,
    MessageSquare,
    AlertTriangle,
    PhoneForwarded,
    Check
} from 'lucide-react';
import {toast} from 'sonner';
import {
    useGetCallsQuery,
    useGetCallStatsQuery,
    useSyncVapiCallsMutation,
    useMarkCallbackCompleteMutation
} from '../../slices/apiSlice/callsApiSlice';
import {useGetBusinessesQuery} from '../../slices/apiSlice/businessApiSlice';
import DataTable from '../../components/ui/DataTable';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import {Button} from '../../components/ui/Button';


export default function Calls() {

    const [page, setPage] = useState(1);
    const [dateFilter, setDateFilter] = useState('today');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCall, setSelectedCall] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch business first to get businessId
    const {data: businessData} = useGetBusinessesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const businessId = businessData?.[0]?.id;

    const {data: callsData, isLoading: callsLoading} = useGetCallsQuery(
        {
            businessId,
            page,
            dateRange: dateFilter,
            status: statusFilter !== 'all' ? statusFilter : undefined
        },
        {skip: !businessId, refetchOnMountOrArgChange: true}
    );
    const {data: stats, isLoading: statsLoading} = useGetCallStatsQuery(
        {businessId, dateRange: dateFilter},
        {skip: !businessId, refetchOnMountOrArgChange: true}
    );

    const [syncVapiCalls, {isLoading: isSyncing}] = useSyncVapiCallsMutation();
    const [markCallbackComplete, {isLoading: isMarkingCallback}] = useMarkCallbackCompleteMutation();

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
        {value: 'today', label: 'Today'},
        {value: 'yesterday', label: 'Yesterday'},
        {value: 'week', label: 'Last 7 Days'},
        {value: 'month', label: 'Last 30 Days'},
        {value: 'all', label: 'All Time'},
    ];

    const statusOptions = [
        {value: 'all', label: 'All Status'},
        {value: 'completed', label: 'Completed'},
        {value: 'missed', label: 'Missed'},
        {value: 'has_message', label: 'Has Message'},
        {value: 'callback_needed', label: 'Callback Needed'},
    ];

    // Helper to calculate duration from timestamps if duration is 0/null
    const calculateDuration = (call) => {
        if (call.duration && call.duration > 0) return call.duration;
        if (call.startedAt && call.endedAt) {
            return Math.floor((new Date(call.endedAt) - new Date(call.startedAt)) / 1000);
        }
        return 0;
    };

    // Helper to format duration as mm:ss
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    // Format ended reason - "customer-ended-call" -> "Customer Ended Call"
    const formatEndedReason = (reason) => {
        if (!reason) return '-';
        return reason.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Format cost - string "0.0315" -> "$0.03"
    const formatCost = (cost) => {
        if (!cost) return '$0.00';
        return `$${parseFloat(cost).toFixed(2)}`;
    };

    // Status styling map
    const getStatusStyle = (status) => {
        const styles = {
            completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            ended: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
            failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            missed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
            'no-answer': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
            voicemail: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
            'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        };
        return styles[status] || 'bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white';
    };

    const columns = [
        {
            key: 'customer',
            label: 'Customer',
            render: (_, row) => row.customer?.name || 'Unknown Caller'
        },
        {
            key: 'callerPhone',
            label: 'Phone',
            render: (_, row) => row.callerPhone || 'Web Call'
        },
        {
            key: 'duration',
            label: 'Duration',
            render: (_, row) => formatDuration(calculateDuration(row))
        },
        {
            key: 'status',
            label: 'Status',
            render: (_, row) => (
                <div className="flex items-center gap-1.5">
          <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${getStatusStyle(row.status)}`}>
            {row.status?.replace(/-/g, ' ') || 'Unknown'}
          </span>
                    {row.hasMessage && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium rounded ${
                            row.isUrgent
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}>
              {row.isUrgent ? <AlertTriangle className="w-3 h-3"/> : <MessageSquare className="w-3 h-3"/>}
                            {row.isUrgent ? 'Urgent' : 'Msg'}
            </span>
                    )}
                    {row.callbackRequested && !row.callbackCompleted && (
                        <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
              <PhoneForwarded className="w-3 h-3"/>
              Callback
            </span>
                    )}
                </div>
            ),
        },
        {
            key: 'endedReason',
            label: 'Ended Reason',
            render: (_, row) => formatEndedReason(row.endedReason)
        },
        {
            key: 'cost',
            label: 'Cost',
            render: (_, row) => formatCost(row.cost)
        },
        {
            key: 'startedAt',
            label: 'Date',
            render: (_, row) => {
                const date = row.startedAt || row.createdAt;
                return date ? new Date(date).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }) : '-';
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(row);
                    }}
                >
                    <MoreVertical className="w-5 h-5"/>
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

    const handleMarkCallbackComplete = async () => {
        if (!selectedCall?.id) return;
        try {
            await markCallbackComplete(selectedCall.id).unwrap();
            toast.success('Callback marked as complete');
            setSelectedCall(prev => ({
                ...prev,
                callbackCompleted: true,
                callbackCompletedAt: new Date().toISOString()
            }));
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to mark callback complete');
        }
    };

    if (callsLoading && page === 1) {
        return (
            <div className="px-8 py-6 flex items-center justify-center h-full bg-gray-50 dark:bg-transparent">
                <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin"/>
            </div>
        );
    }

    return (
        <div className="px-8 py-6 bg-gray-50 dark:bg-transparent">
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
                            {!isSyncing && <RefreshCw className="w-4 h-4 mr-2"/>}
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
                            <div key={i}
                                 className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4 animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-[#262626] rounded w-20 mb-2"></div>
                                <div className="h-8 bg-gray-200 dark:bg-[#262626] rounded w-12"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Total Calls */}
                        <div
                            className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">Total Calls</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.totalCalls || 0}</p>
                            <p className="text-xs text-gray-500">
                                {stats?.percentChange > 0 ? '+' : ''}{stats?.percentChange || 0}%
                            </p>
                        </div>

                        {/* Avg Duration */}
                        <div
                            className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">Avg Duration</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stats?.avgDuration ? `${Math.floor(stats.avgDuration / 60)}:${String(stats.avgDuration % 60).padStart(2, '0')}` : '0:00'}
                            </p>
                            <p className="text-xs text-gray-500">Average call time</p>
                        </div>

                        {/* Completed */}
                        <div
                            className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.completedCalls || 0}</p>
                            <p className="text-xs text-gray-500">Successful calls</p>
                        </div>

                        {/* Missed */}
                        <div
                            className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">Missed</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats?.missedCalls || 0}</p>
                            <p className="text-xs text-gray-500">Missed calls</p>
                        </div>
                    </div>
                )}

                {/* Calls Table */}
                {callsLoading ? (
                    <div
                        className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
                        <div
                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
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
                    <div
                        className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
                        <div className="flex flex-col items-center justify-center">
                            <div
                                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                                <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5}/>
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
                        title={`Call Details - ${selectedCall?.customer?.name || 'Unknown Caller'}`}
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
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {selectedCall.customer?.name || 'Unknown Caller'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {selectedCall.callerPhone || 'Web Call'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {formatDuration(calculateDuration(selectedCall))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <span
                                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded capitalize ${getStatusStyle(selectedCall.status)}`}>
                    {selectedCall.status?.replace(/-/g, ' ') || 'Unknown'}
                  </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {selectedCall.startedAt ? new Date(selectedCall.startedAt).toLocaleString() : '-'}
                                    </p>
                                </div>
                                {selectedCall.endedReason && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ended Reason</p>
                                        <p className="text-gray-900 dark:text-white font-medium capitalize">
                                            {selectedCall.endedReason.replace(/-/g, ' ')}
                                        </p>
                                    </div>
                                )}
                                {selectedCall.cost && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Cost</p>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {formatCost(selectedCall.cost)}
                                        </p>
                                    </div>
                                )}
                                {selectedCall.business?.name && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Business</p>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {selectedCall.business.name}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Message Section */}
                            {selectedCall.hasMessage && (
                                <div className={`p-3 rounded-md border ${
                                    selectedCall.isUrgent
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                        : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {selectedCall.isUrgent ? (
                                                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400"/>
                                            ) : (
                                                <MessageSquare
                                                    className="w-4 h-4 text-purple-600 dark:text-purple-400"/>
                                            )}
                                            <span className={`text-sm font-medium ${
                                                selectedCall.isUrgent ? 'text-red-700 dark:text-red-400' : 'text-purple-700 dark:text-purple-400'
                                            }`}>
                        {selectedCall.isUrgent ? 'Urgent Message' : 'Message'}
                      </span>
                                        </div>
                                        {selectedCall.callbackRequested && (
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${
                                                    selectedCall.callbackCompleted
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                }`}>
                        {selectedCall.callbackCompleted ? (
                            <>
                                <Check className="w-3 h-3"/>
                                Called Back
                            </>
                        ) : (
                            <>
                                <PhoneForwarded className="w-3 h-3"/>
                                Callback Requested
                            </>
                        )}
                      </span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">From: </span>
                                                <span
                                                    className="text-gray-900 dark:text-white">{selectedCall.messageFrom || 'Unknown'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">Phone: </span>
                                                <span
                                                    className="text-gray-900 dark:text-white">{selectedCall.messagePhone || selectedCall.callerPhone || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-900 dark:text-white">{selectedCall.messageText}</p>
                                        {selectedCall.callbackRequested && !selectedCall.callbackCompleted && (
                                            <button
                                                onClick={handleMarkCallbackComplete}
                                                disabled={isMarkingCallback}
                                                className="mt-2 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                                            >
                                                {isMarkingCallback ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin"/>
                                                ) : (
                                                    <Check className="w-3.5 h-3.5"/>
                                                )}
                                                Mark Callback Complete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedCall.transcriptText && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1.5">Transcript</p>
                                    <div
                                        className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3 max-h-48 overflow-y-auto">
                                        <p className="text-gray-900 dark:text-white text-sm whitespace-pre-wrap">{selectedCall.transcriptText}</p>
                                    </div>
                                </div>
                            )}

                            {selectedCall.summary && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1.5">Summary</p>
                                    <div
                                        className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                                        <p className="text-gray-900 dark:text-white text-sm">{selectedCall.summary}</p>
                                    </div>
                                </div>
                            )}

                            {selectedCall.recordingUrl && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1.5">Recording</p>
                                    <audio controls className="w-full">
                                        <source src={selectedCall.recordingUrl} type="audio/mpeg"/>
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}
