import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Settings, Check, PhoneOutgoing, Calendar } from 'lucide-react';
import {
  useGetPhoneNumberQuery,
  useUpdatePhoneNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetAssistantQuery } from '../../slices/apiSlice/assistantApiSlice';

export default function PhoneNumberSettings() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [selectedAssistantId, setSelectedAssistantId] = useState('');
  const [fallbackCountryCode, setFallbackCountryCode] = useState('+1');
  const [fallbackNumber, setFallbackNumber] = useState('');

  // Outbound settings state
  const [callMode, setCallMode] = useState('single');
  const [outboundCountryCode, setOutboundCountryCode] = useState('+1');
  const [outboundNumber, setOutboundNumber] = useState('');
  const [outboundAssistantId, setOutboundAssistantId] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data: phoneData, isLoading: isLoadingPhone, error: phoneError } = useGetPhoneNumberQuery(id);
  const { data: assistants, isLoading: isLoadingAssistants } = useGetAssistantQuery();
  const [updatePhoneNumber, { isLoading: isUpdating }] = useUpdatePhoneNumberMutation();

  const phoneNumber = phoneData?.data?.phoneNumber;

  // Initialize form values when data loads
  useEffect(() => {
    if (phoneNumber) {
      setDisplayName(phoneNumber.name || '');
      setSelectedAssistantId(phoneNumber.assistant?.id || '');

      // Parse fallback number if it exists
      if (phoneNumber.fallbackDestination) {
        const fallback = phoneNumber.fallbackDestination;
        // Extract country code and number (simple parsing)
        if (fallback.startsWith('+')) {
          const parts = fallback.match(/^(\+\d+)(.+)$/);
          if (parts) {
            setFallbackCountryCode(parts[1]);
            setFallbackNumber(parts[2].replace(/\D/g, ''));
          }
        } else {
          setFallbackNumber(fallback.replace(/\D/g, ''));
        }
      }
    }
  }, [phoneNumber]);

  // Track unsaved changes
  useEffect(() => {
    if (phoneNumber) {
      const fallbackDestination = fallbackNumber ? `${fallbackCountryCode}${fallbackNumber}` : '';
      const hasChanges =
        displayName !== (phoneNumber.name || '') ||
        selectedAssistantId !== (phoneNumber.assistant?.id || '') ||
        fallbackDestination !== (phoneNumber.fallbackDestination || '');
      setHasUnsavedChanges(hasChanges);
    }
  }, [displayName, selectedAssistantId, fallbackCountryCode, fallbackNumber, phoneNumber]);

  // Filter assistants by business
  const filteredAssistants = assistants?.filter(
    (assistant) => assistant.businessId === phoneNumber?.business?.id
  ) || [];

  const handleSave = async () => {
    setError('');
    setSuccess('');

    try {
      const updates = {
        id,
        name: displayName,
        assistantId: selectedAssistantId || null,
      };

      // Add fallback destination if provided
      if (fallbackNumber) {
        updates.fallbackDestination = `${fallbackCountryCode}${fallbackNumber}`;
      }

      await updatePhoneNumber(updates).unwrap();
      setSuccess('Phone number settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to update phone number settings');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading phone number settings...</p>
        </div>
      </div>
    );
  }

  if (phoneError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-12 text-center">
            <Phone className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Failed to load phone number</h3>
            <p className="text-sm text-zinc-400 mb-4">
              {phoneError?.data?.error?.message || phoneError?.data?.message || 'An error occurred while loading the phone number.'}
            </p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors"
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
          <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-12 text-center">
            <Phone className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Phone number not found</h3>
            <p className="text-sm text-zinc-400 mb-4">The phone number you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors"
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
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/phone-numbers')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Phone Numbers</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-md">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-900/20 border border-green-800 rounded-md flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* CARD 1: Phone Number Details */}
        <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-6">
          {/* Section Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-zinc-500" />
              <h2 className="text-base font-medium text-white">Phone Number Details</h2>
            </div>
            <p className="text-sm text-zinc-500">
              Give your phone number a descriptive name to help identify it in your list.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Phone Number Label */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Phone Number Label</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Main Office Line"
                className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            {/* Provider (readonly) */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Provider</label>
              <input
                type="text"
                value={phoneNumber.provider?.toUpperCase() || 'VAPI'}
                readOnly
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Inbound Settings */}
        <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-6">
          {/* Section Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-zinc-500" />
              <h2 className="text-base font-medium text-white">Inbound Settings</h2>
            </div>
            <p className="text-sm text-zinc-500">
              Assign an assistant to handle incoming calls to this phone number.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Inbound Phone Number (readonly) */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Inbound Phone Number</label>
              <input
                type="text"
                value={formatPhoneNumber(phoneNumber.phoneNumber || phoneNumber.number)}
                readOnly
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white cursor-not-allowed"
              />
            </div>

            {/* Assistant Dropdown */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Assistant</label>
              <select
                value={selectedAssistantId}
                onChange={(e) => setSelectedAssistantId(e.target.value)}
                className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
              >
                <option value="">Select assistant...</option>
                {filteredAssistants.map((assistant) => (
                  <option key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
              {filteredAssistants.length === 0 && (
                <p className="text-xs text-zinc-500 mt-1.5">
                  No assistants available. Create an assistant first.
                </p>
              )}
            </div>

            {/* Fallback Destination */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Fallback Destination</label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <select
                  value={fallbackCountryCode}
                  onChange={(e) => setFallbackCountryCode(e.target.value)}
                  className="w-24 bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                </select>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  value={fallbackNumber}
                  onChange={(e) => setFallbackNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="5551234567"
                  className="flex-1 bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1.5">
                Transfer calls here when the assistant is unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3: Outbound Settings */}
        <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PhoneOutgoing className="w-5 h-5 text-zinc-500" />
              <div>
                <h2 className="text-base font-medium text-white">Outbound Settings</h2>
                <p className="text-sm text-zinc-500">
                  Configure outbound calling with assistant selection and batch options.
                </p>
              </div>
            </div>
            <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">Coming Soon</span>
          </div>

          {/* Fields */}
          <div className="space-y-4 opacity-60">
            {/* Call Mode Radio Buttons */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Call Mode</label>
              <div className="flex gap-4">
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-zinc-700 bg-[#111114] text-zinc-400 opacity-50 cursor-not-allowed"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-sm">Call One Number</span>
                </button>
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-zinc-700 bg-[#111114] text-zinc-400 opacity-50 cursor-not-allowed"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-600 flex items-center justify-center">
                  </div>
                  <span className="text-sm">Call Many Numbers (Upload CSV)</span>
                </button>
              </div>
            </div>

            {/* Outbound Phone Number */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Outbound Phone Number</label>
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <select
                  disabled
                  value={outboundCountryCode}
                  className="w-24 bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white opacity-50 cursor-not-allowed"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                </select>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  disabled
                  value={outboundNumber}
                  placeholder="Enter a phone number"
                  className="flex-1 bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Assistant Dropdown */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Assistant</label>
              <select
                disabled
                value={outboundAssistantId}
                className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white opacity-50 cursor-not-allowed"
              >
                <option value="">Select Assistant...</option>
                {filteredAssistants.map((assistant) => (
                  <option key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
              {filteredAssistants.length === 0 && (
                <p className="text-xs text-zinc-500 mt-1.5">
                  No assistants available. Create an assistant first.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-700 text-white rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                <Phone className="w-4 h-4" />
                Make a Call
              </button>
              <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 text-zinc-400 rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                <Calendar className="w-4 h-4" />
                Schedule Call
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isUpdating || !hasUnsavedChanges}
            className="px-6 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
