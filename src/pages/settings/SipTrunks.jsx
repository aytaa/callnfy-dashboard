import { useState } from 'react';
import { Plus, Wifi, WifiOff, Phone, Trash2, Pencil, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import {
  useGetSipTrunksQuery,
  useDeleteSipTrunkMutation,
  useTestSipTrunkMutation,
} from '../../slices/apiSlice/sipTrunkApiSlice';
import AddSipTrunkModal from '../../components/AddSipTrunkModal';

const STATUS_STYLES = {
  active: {
    dot: 'bg-green-500',
    badge: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700/50',
    label: 'Active',
  },
  pending: {
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50',
    label: 'Pending',
  },
  error: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/50',
    label: 'Error',
  },
  disabled: {
    dot: 'bg-gray-400',
    badge: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    label: 'Disabled',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function SipTrunks() {
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery();
  const business = businesses?.[0];
  const businessId = business?.id;

  const { data: sipTrunks, isLoading } = useGetSipTrunksQuery(businessId, {
    skip: !businessId,
  });

  const [deleteSipTrunk, { isLoading: isDeleting }] = useDeleteSipTrunkMutation();
  const [testSipTrunk] = useTestSipTrunkMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTrunk, setEditTrunk] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, trunk: null });
  const [testingTrunkId, setTestingTrunkId] = useState(null);
  const [copiedUri, setCopiedUri] = useState(null);

  const handleEdit = (trunk) => {
    setEditTrunk(trunk);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditTrunk(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTrunk(null);
  };

  const handleDeleteClick = (trunk) => {
    if (trunk.phoneNumberCount > 0) {
      toast.error(`Remove ${trunk.phoneNumberCount} phone number${trunk.phoneNumberCount > 1 ? 's' : ''} from this trunk before deleting it.`);
      return;
    }
    setDeleteModal({ open: true, trunk });
  };

  const handleConfirmDelete = async () => {
    const trunk = deleteModal.trunk;
    setDeleteModal({ open: false, trunk: null });

    try {
      await deleteSipTrunk(trunk.id).unwrap();
      toast.success('SIP trunk deleted');
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to delete SIP trunk');
    }
  };

  const handleTest = async (trunkId) => {
    setTestingTrunkId(trunkId);
    try {
      await testSipTrunk(trunkId).unwrap();
      toast.success('Connection test successful');
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Connection test failed');
    } finally {
      setTestingTrunkId(null);
    }
  };

  const handleCopyUri = (uri, trunkId) => {
    navigator.clipboard.writeText(uri);
    setCopiedUri(trunkId);
    toast.success('Inbound SIP URI copied');
    setTimeout(() => setCopiedUri(null), 2000);
  };

  if (businessesLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Loading business information...</div>
      </div>
    );
  }

  const trunks = sipTrunks || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">SIP Trunks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Connect your own SIP provider to use your existing phone numbers.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs py-1.5 px-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Trunk
        </button>
      </div>

      {trunks.length > 0 ? (
        <div className="space-y-3">
          {trunks.map((trunk) => {
            const statusStyle = STATUS_STYLES[trunk.status] || STATUS_STYLES.pending;
            const isTesting = testingTrunkId === trunk.id;

            return (
              <div
                key={trunk.id}
                className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#111114] rounded-md flex items-center justify-center flex-shrink-0">
                      {trunk.status === 'active' ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : trunk.status === 'error' ? (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      ) : (
                        <Wifi className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-gray-900 dark:text-white font-medium text-sm">{trunk.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded border ${statusStyle.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {trunk.sipHost}:{trunk.sipPort} ({trunk.transport?.toUpperCase()})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-[#303030] mb-3">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Username</p>
                    <p className="text-xs text-gray-900 dark:text-white font-mono mt-0.5">{trunk.authUsername || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Phone Numbers</p>
                    <p className="text-xs text-gray-900 dark:text-white mt-0.5">
                      {trunk.phoneNumberCount || 0} assigned
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Last Tested</p>
                    <p className="text-xs text-gray-900 dark:text-white mt-0.5">
                      {formatDateTime(trunk.lastTestedAt)}
                    </p>
                  </div>
                </div>

                {/* Inbound SIP URI */}
                {trunk.inboundSipUri && (
                  <div className="pt-3 border-t border-gray-200 dark:border-[#303030] mb-3">
                    <label className="text-xs text-gray-400 dark:text-gray-500 mb-1 block">Inbound SIP URI</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={trunk.inboundSipUri}
                        className="flex-1 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                      />
                      <button
                        onClick={() => handleCopyUri(trunk.inboundSipUri, trunk.id)}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                        title="Copy SIP URI"
                      >
                        {copiedUri === trunk.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Configure this URI on your SIP provider to route inbound calls.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {trunk.status === 'error' && trunk.errorMessage && (
                  <div className="pt-3 border-t border-gray-200 dark:border-[#303030] mb-3">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-600 dark:text-red-400">{trunk.errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-[#303030]">
                  <button
                    onClick={() => handleTest(trunk.id)}
                    disabled={isTesting}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded-md hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Wifi className="w-3 h-3" />
                        Test
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(trunk)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(trunk)}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                  <div className="ml-auto text-xs text-gray-400 dark:text-gray-600">
                    Created {formatDate(trunk.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
              <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              No SIP trunks connected
            </h3>
            <p className="text-xs text-gray-500 mb-4 max-w-sm">
              Connect your SIP provider (NetGSM, Bulutfon, etc.) to use your own phone numbers with Callnfy.
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs py-1.5 px-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Connect SIP Provider
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddSipTrunkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        businessId={businessId}
        editTrunk={editTrunk}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteModal({ open: false, trunk: null })}
          />
          <div className="relative bg-white dark:bg-[#1a1a1d] rounded-lg shadow-xl w-full max-w-sm mx-4 p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete SIP Trunk?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to delete "{deleteModal.trunk?.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ open: false, trunk: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-[#303030] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
