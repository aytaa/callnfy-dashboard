import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Plus, Copy, Check, Settings, ChevronRight } from 'lucide-react';
import {
  useGetPhoneNumbersQuery,
  useDeletePhoneNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import PurchasePhoneModal from '../../components/PurchasePhoneModal';

export default function PhoneNumbers() {
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: phoneNumbersData, isLoading: isLoadingPhones, error: phonesError } = useGetPhoneNumbersQuery();
  const { data: businessesData, isLoading: isLoadingBusinesses } = useGetBusinessesQuery();
  const [deletePhoneNumber, { isLoading: isDeleting }] = useDeletePhoneNumberMutation();

  // Debug: Log the raw API response
  console.log('Phone Numbers List API Response:', phoneNumbersData);
  console.log('Businesses API Response:', businessesData);

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

  const handleDelete = async (phoneId) => {
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
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading phone numbers...</p>
        </div>
      </div>
    );
  }

  if (phonesError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a1a1d] border border-zinc-800 rounded-xl p-12 text-center">
            <Phone className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load phone numbers</h3>
            <p className="text-sm text-gray-400 mb-4">
              {phonesError?.data?.error?.message || phonesError?.data?.message || 'An error occurred while loading phone numbers.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-sm text-green-400">{success}</p>
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
                  className="bg-[#1a1a1d] border border-zinc-800 rounded-xl p-6"
                >
                  {/* Business Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{business.name}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {business.industry || 'Business'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number or CTA */}
                  {phoneNumber ? (
                    <button
                      onClick={() => navigate(`/phone-numbers/${phoneNumber.id}`)}
                      className="w-full bg-[#1a1a1d] border border-zinc-800 rounded-lg p-4 hover:border-zinc-600 transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-[#171717] flex items-center justify-center">
                            <Phone className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-base font-medium text-white">
                                {phoneNumber.phoneNumber || phoneNumber.number}
                              </p>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                phoneNumber.status === 'active'
                                  ? 'bg-green-900/20 text-green-400 border border-green-800'
                                  : 'bg-[#171717] text-gray-400 border border-[#404040]'
                              }`}>
                                {phoneNumber.status || 'Active'}
                              </span>
                              {phoneNumber.provider && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#171717] text-white border border-[#303030]">
                                  {phoneNumber.provider.toUpperCase()}
                                </span>
                              )}
                            </div>
                            {phoneNumber.assistant?.name && (
                              <p className="text-sm text-gray-400">
                                Assistant: {phoneNumber.assistant.name}
                              </p>
                            )}
                            {phoneNumber.name && (
                              <p className="text-sm text-gray-400">
                                {phoneNumber.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(phoneNumber.phoneNumber || phoneNumber.number, phoneNumber.id);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-[#171717] rounded-lg transition-colors"
                            title="Copy number"
                          >
                            {copiedId === phoneNumber.id ? (
                              <Check className="w-4 h-4 text-white" strokeWidth={1.5} />
                            ) : (
                              <Copy className="w-4 h-4" strokeWidth={1.5} />
                            )}
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPurchaseModalOpen(true)}
                      className="w-full bg-[#1a1a1d] border border-zinc-800 rounded-lg p-6 hover:border-white transition-colors group"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-[#171717] flex items-center justify-center mb-3">
                          <Phone className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-base font-medium text-white mb-1">
                          No phone number
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">
                          Get a phone number for this business
                        </p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg">
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
          <div className="bg-[#1a1a1d] border border-zinc-800 rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No businesses found
              </h3>
              <p className="text-sm text-white opacity-60 mb-4">
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
