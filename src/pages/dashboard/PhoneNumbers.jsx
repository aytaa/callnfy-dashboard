import { useState } from 'react';
import { Phone, Plus, Eye, Copy, Trash2, Check } from 'lucide-react';
import {
  useGetPhoneNumbersQuery,
  useAssignPhoneNumberMutation,
  useReleasePhoneNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';

export default function PhoneNumbers() {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [assigningPhoneId, setAssigningPhoneId] = useState(null);
  const [error, setError] = useState('');

  const { data: phoneNumbersData, isLoading } = useGetPhoneNumbersQuery();
  const { data: businesses } = useGetBusinessesQuery();
  const [assignPhoneNumber, { isLoading: isAssigning }] = useAssignPhoneNumberMutation();
  const [releasePhoneNumber, { isLoading: isReleasing }] = useReleasePhoneNumberMutation();

  const phoneNumbers = phoneNumbersData?.phoneNumbers || [];

  const handleCopy = (number, id) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAssign = async (phoneId) => {
    if (!selectedBusinessId) {
      setError('Please select a business to assign');
      return;
    }

    setError('');
    try {
      await assignPhoneNumber({ id: phoneId, businessId: selectedBusinessId }).unwrap();
      setAssigningPhoneId(null);
      setSelectedBusinessId('');
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to assign phone number');
    }
  };

  const handleRelease = async (phoneId) => {
    if (!window.confirm('Are you sure you want to release this phone number?')) return;

    setError('');
    try {
      await releasePhoneNumber(phoneId).unwrap();
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to release phone number');
    }
  };

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

  return (
    <div className="px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white opacity-60 text-sm mt-1">
              Manage your AI receptionist phone numbers
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Phone Number Cards */}
        {phoneNumbers.length > 0 ? (
          <div className="space-y-4">
            {phoneNumbers.map((phone) => (
              <div
                key={phone.id}
                className="bg-[#171717] border border-[#303030] rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  {/* Left side - Number info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">
                          {phone.phoneNumber || phone.number}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          phone.status === 'assigned'
                            ? 'bg-green-900/20 text-green-400 border border-green-800'
                            : 'bg-[#262626] text-white'
                        }`}>
                          {phone.status}
                        </span>
                      </div>
                      {phone.assignedTo && (
                        <p className="text-sm text-white opacity-60 mb-3">
                          Assigned to: {phone.assignedTo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(phone.phoneNumber || phone.number, phone.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#262626] rounded-lg transition-colors"
                      title="Copy number"
                    >
                      {copiedId === phone.id ? (
                        <Check className="w-4 h-4 text-white" strokeWidth={1.5} />
                      ) : (
                        <Copy className="w-4 h-4" strokeWidth={1.5} />
                      )}
                    </button>

                    {phone.status === 'available' ? (
                      assigningPhoneId === phone.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedBusinessId}
                            onChange={(e) => setSelectedBusinessId(e.target.value)}
                            className="bg-[#262626] border border-[#303030] rounded-lg px-3 py-1.5 text-sm text-white focus:border-[#3a3a3a] focus:outline-none"
                          >
                            <option value="">Select Business</option>
                            {businesses?.map((business) => (
                              <option key={business.id} value={business.id}>
                                {business.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssign(phone.id)}
                            disabled={isAssigning}
                            className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            {isAssigning ? 'Assigning...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => {
                              setAssigningPhoneId(null);
                              setSelectedBusinessId('');
                            }}
                            className="border border-[#303030] text-white px-3 py-1.5 text-sm rounded-lg hover:border-[#3a3a3a] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningPhoneId(phone.id)}
                          className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Assign
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleRelease(phone.id)}
                        disabled={isReleasing}
                        className="border border-red-600 text-red-600 px-3 py-1.5 text-sm rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isReleasing ? 'Releasing...' : 'Release'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#262626] flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No phone numbers
              </h3>
              <p className="text-sm text-white opacity-60">
                No phone numbers available yet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
