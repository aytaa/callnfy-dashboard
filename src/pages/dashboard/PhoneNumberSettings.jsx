import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Save, Check } from 'lucide-react';
import {
  useGetPhoneNumberQuery,
  useUpdatePhoneNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetAssistantQuery } from '../../slices/apiSlice/assistantApiSlice';

export default function PhoneNumberSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAssistantId, setSelectedAssistantId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasUnsavedName, setHasUnsavedName] = useState(false);

  const { data: phoneData, isLoading: isLoadingPhone, error: phoneError } = useGetPhoneNumberQuery(id);
  const { data: assistants, isLoading: isLoadingAssistants } = useGetAssistantQuery();
  const [updatePhoneNumber, { isLoading: isUpdating }] = useUpdatePhoneNumberMutation();

  // Debug: Log the raw API response
  console.log('Phone Number Detail API Response:', phoneData);

  const phoneNumber = phoneData?.data?.phoneNumber;

  // Initialize form values when data loads
  useEffect(() => {
    if (phoneNumber) {
      setSelectedAssistantId(phoneNumber.assistant?.id || '');
      setDisplayName(phoneNumber.name || '');
    }
  }, [phoneNumber]);

  // Track unsaved changes for display name
  useEffect(() => {
    if (phoneNumber) {
      setHasUnsavedName(displayName !== (phoneNumber.name || ''));
    }
  }, [displayName, phoneNumber]);

  // Filter assistants by business
  const filteredAssistants = assistants?.filter(
    (assistant) => assistant.businessId === phoneNumber?.business?.id
  ) || [];

  const handleAssistantChange = async (newAssistantId) => {
    setError('');
    setSuccess('');
    setSelectedAssistantId(newAssistantId);

    try {
      await updatePhoneNumber({
        id,
        assistantId: newAssistantId || null,
      }).unwrap();
      setSuccess('Assistant updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to update assistant');
      // Revert on error
      setSelectedAssistantId(phoneNumber?.assistant?.id || '');
    }
  };

  const handleSaveDisplayName = async () => {
    setError('');
    setSuccess('');

    try {
      await updatePhoneNumber({
        id,
        name: displayName,
      }).unwrap();
      setSuccess('Display name updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to update display name');
    }
  };

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Format as +1 (XXX) XXX-XXXX
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return number;
  };

  if (isLoadingPhone || isLoadingAssistants) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading phone number settings...</p>
        </div>
      </div>
    );
  }

  if (phoneError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-12 text-center">
            <Phone className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load phone number</h3>
            <p className="text-sm text-gray-400 mb-4">
              {phoneError?.data?.error?.message || phoneError?.data?.message || 'An error occurred while loading the phone number.'}
            </p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Phone Numbers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!phoneNumber) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-12 text-center">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Phone number not found</h3>
            <p className="text-sm text-gray-400 mb-4">The phone number you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Phone Numbers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/phone-numbers')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Phone Numbers</span>
        </button>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Phone Number Card */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-semibold text-white">
              {formatPhoneNumber(phoneNumber.phoneNumber || phoneNumber.number)}
            </span>
            <span className={`px-3 py-1.5 text-sm font-medium rounded ${
              phoneNumber.status === 'active'
                ? 'bg-green-900/20 text-green-400 border border-green-800'
                : 'bg-[#262626] text-gray-400 border border-[#404040]'
            }`}>
              {phoneNumber.status === 'active' ? 'Active' : phoneNumber.status || 'Activating'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Provider: {phoneNumber.provider?.toUpperCase() || 'VAPI'}
          </div>
          {phoneNumber.business && (
            <div className="text-sm text-gray-400">
              Business: {phoneNumber.business.name}
            </div>
          )}
        </div>

        {/* Configuration Section */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Configuration</h3>

          {/* Assistant Dropdown */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Assistant</label>
            <select
              value={selectedAssistantId}
              onChange={(e) => handleAssistantChange(e.target.value)}
              disabled={isUpdating}
              className="w-full bg-[#262626] border border-[#303030] rounded-lg px-4 py-2 text-white focus:border-[#3a3a3a] focus:outline-none disabled:opacity-50"
            >
              <option value="">Select assistant...</option>
              {filteredAssistants.map((assistant) => (
                <option key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </option>
              ))}
            </select>
            {filteredAssistants.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">
                No assistants available for this business. Create an assistant first.
              </p>
            )}
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Main Office Line"
              className="w-full bg-[#262626] border border-[#303030] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-[#3a3a3a] focus:outline-none"
            />
          </div>

          <button
            onClick={handleSaveDisplayName}
            disabled={isUpdating || !hasUnsavedName}
            className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
