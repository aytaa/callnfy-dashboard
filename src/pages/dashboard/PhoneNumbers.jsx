import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Plus, Copy, Check, Trash2, ChevronRight, AlertTriangle, Bot, Loader2 } from 'lucide-react';
import {
  useGetPhoneNumbersQuery,
  useDeletePhoneNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import PurchasePhoneModal from '../../components/PurchasePhoneModal';

const formatPhoneNumber = (number) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return number;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function PhoneNumbers() {
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: phoneNumbersData, isLoading: isLoadingPhones, error: phonesError } = useGetPhoneNumbersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deletePhoneNumber, { isLoading: isDeleting }] = useDeletePhoneNumberMutation();

  const phoneNumbers = phoneNumbersData?.data?.phoneNumbers || [];
  const businesses = businessesData || [];

  // Create a map of businessId -> phone number
  const phoneNumbersByBusiness = phoneNumbers.reduce((acc, phone) => {
    if (phone.business?.id) {
      acc[phone.business.id] = phone;
    }
    return acc;
  }, {});

  const handleCopy = (number, id) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e, phoneId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this phone number? This action cannot be undone.')) return;

    setError('');
    setSuccess('');
    try {
      await deletePhoneNumber(phoneId).unwrap();
      setSuccess('Phone number deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to delete phone number');
    }
  };

  const isLoading = isLoadingPhones || isLoadingBusinesses;

  if (isLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (phonesError) {
    return (
      <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8 text-center">
            <Phone className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Failed to load phone numbers</h3>
            <p className="text-xs text-gray-500 mb-4">
              {phonesError?.data?.error?.message || phonesError?.data?.message || 'An error occurred while loading phone numbers.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Business Cards with Phone Numbers */}
        {businesses.length > 0 ? (
          <div className="space-y-4">
            {businesses.map((business) => {
              const phoneNumber = phoneNumbersByBusiness[business.id];

              return (
                <div
                  key={business.id}
                  className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-4"
                >
                  {/* Business Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{business.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {business.industry || 'Business'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number Card or CTA */}
                  {phoneNumber ? (
                    <button
                      onClick={() => navigate(`/phone-numbers/${phoneNumber.id}`)}
                      className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-4 hover:border-gray-300 dark:hover:border-[#404040] transition-colors text-left group"
                    >
                      {/* Sync Warning Banner */}
                      {phoneNumber.syncWarning && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-md">
                          <AlertTriangle className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                          <p className="text-xs text-orange-600 dark:text-orange-400">Sync issue detected - click to view details</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1d] flex items-center justify-center">
                            <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Phone Number & Badges */}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatPhoneNumber(phoneNumber.number || phoneNumber.phoneNumber)}
                              </p>
                              {/* Status Badge */}
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                phoneNumber.status === 'assigned'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700/50'
                                  : 'bg-gray-100 dark:bg-[#262626] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#303030]'
                              }`}>
                                {phoneNumber.status === 'assigned' ? 'Assigned' : phoneNumber.status || 'Active'}
                              </span>
                              {/* Provider Badge */}
                              {phoneNumber.provider && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white border border-gray-200 dark:border-[#303030]">
                                  {phoneNumber.provider.toUpperCase()}
                                </span>
                              )}
                            </div>

                            {/* Label/Name */}
                            {phoneNumber.name && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {phoneNumber.name}
                              </p>
                            )}

                            {/* Assistant Info */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Bot className="w-3 h-3" />
                              <span>
                                {phoneNumber.localAssistantName || phoneNumber.assistant?.name
                                  ? `Assistant: ${phoneNumber.localAssistantName || phoneNumber.assistant?.name}`
                                  : 'No assistant assigned'}
                              </span>
                            </div>

                            {/* Created Date */}
                            {phoneNumber.createdAt && (
                              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                                Added {formatDate(phoneNumber.createdAt)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(phoneNumber.number || phoneNumber.phoneNumber, phoneNumber.id);
                            }}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors"
                            title="Copy number"
                          >
                            {copiedId === phoneNumber.id ? (
                              <Check className="w-4 h-4 text-green-500 dark:text-green-400" strokeWidth={1.5} />
                            ) : (
                              <Copy className="w-4 h-4" strokeWidth={1.5} />
                            )}
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, phoneNumber.id)}
                            disabled={isDeleting}
                            className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPurchaseModalOpen(true)}
                      className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-4 hover:border-gray-400 dark:hover:border-white/40 transition-colors group"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1a1a1d] flex items-center justify-center mb-2">
                          <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          No phone number
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          Get a phone number for this business
                        </p>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-medium rounded-md">
                          <Plus className="w-4 h-4" />
                          Get Phone Number
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State - No Businesses */
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#111114] flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No businesses found
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Create a business first to get a phone number
              </p>
            </div>
          </div>
        )}

        {/* Purchase Phone Modal */}
        <PurchasePhoneModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
        />
      </div>
    </div>
  );
}
