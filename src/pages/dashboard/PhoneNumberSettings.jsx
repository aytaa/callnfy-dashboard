import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Settings, Check, PhoneOutgoing, Calendar, AlertTriangle, Bot, RefreshCw, Clock, ExternalLink, Loader2 } from 'lucide-react';
import {
  useGetPhoneNumberQuery,
  useUpdatePhoneNumberMutation,
  useAssignAssistantMutation,
  useResyncPhoneNumberMutation,
  useReleaseTwilioNumberMutation,
} from '../../slices/apiSlice/phoneApiSlice';
import { useGetAssistantQuery } from '../../slices/apiSlice/assistantApiSlice';

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

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function PhoneNumberSettings() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [selectedAssistantId, setSelectedAssistantId] = useState('');
  const [fallbackCountryCode, setFallbackCountryCode] = useState('+1');
  const [fallbackNumber, setFallbackNumber] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { data: phoneData, isLoading: isLoadingPhone, error: phoneError } = useGetPhoneNumberQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const { data: assistants, isLoading: isLoadingAssistants } = useGetAssistantQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updatePhoneNumber, { isLoading: isUpdating }] = useUpdatePhoneNumberMutation();
  const [assignAssistant, { isLoading: isAssigning }] = useAssignAssistantMutation();
  const [resyncPhoneNumber, { isLoading: isResyncing }] = useResyncPhoneNumberMutation();
  const [releaseTwilioNumber, { isLoading: isReleasing }] = useReleaseTwilioNumberMutation();

  const phoneNumber = phoneData?.data?.phoneNumber;

  // Initialize form values when data loads
  useEffect(() => {
    if (phoneNumber) {
      setDisplayName(phoneNumber.name || '');
      setSelectedAssistantId(phoneNumber.localAssistantId || phoneNumber.assistant?.id || '');

      // Parse fallback number if it exists
      const fallbackDest = phoneNumber.fallbackDestination;
      if (fallbackDest) {
        if (fallbackDest.startsWith('+')) {
          const parts = fallbackDest.match(/^(\+\d+)(.+)$/);
          if (parts) {
            setFallbackCountryCode(parts[1]);
            setFallbackNumber(parts[2].replace(/\D/g, ''));
          }
        } else {
          setFallbackNumber(fallbackDest.replace(/\D/g, ''));
        }
      }
    }
  }, [phoneNumber]);

  // Track unsaved changes
  useEffect(() => {
    if (phoneNumber) {
      const fallbackDestination = fallbackNumber ? `${fallbackCountryCode}${fallbackNumber}` : '';
      const originalName = phoneNumber.name || '';
      const originalAssistantId = phoneNumber.localAssistantId || phoneNumber.assistant?.id || '';
      const originalFallback = phoneNumber.fallbackDestination || '';
      const hasChanges =
        displayName !== originalName ||
        selectedAssistantId !== originalAssistantId ||
        fallbackDestination !== originalFallback;
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
    setValidationErrors({});

    // Frontend validation
    const errors = {};
    if (!displayName.trim()) {
      errors.displayName = 'Label is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const updates = {
        id,
        name: displayName.trim(),
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

  const handleAssignAssistant = async () => {
    setError('');
    setSuccess('');

    try {
      await assignAssistant({
        id,
        assistantId: selectedAssistantId || null,
      }).unwrap();
      setSuccess('Assistant assigned successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to assign assistant');
    }
  };

  const handleResync = async () => {
    setError('');
    setSuccess('');

    try {
      await resyncPhoneNumber(id).unwrap();
      setSuccess('Phone number resynced successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to resync phone number');
    }
  };

  const handleReleaseTwilio = async () => {
    if (!phoneNumber?.twilioSid) {
      setError('Twilio SID not found for this phone number');
      return;
    }

    if (!window.confirm('Are you sure you want to release this Twilio number? This will remove it from your account and you will no longer be charged for it.')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await releaseTwilioNumber(phoneNumber.twilioSid).unwrap();
      setSuccess('Twilio number released successfully');
      setTimeout(() => {
        navigate('/phone-numbers');
      }, 1500);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to release Twilio number');
    }
  };

  if (isLoadingPhone || isLoadingAssistants) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (phoneError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-12 text-center">
            <Phone className="w-12 h-12 text-gray-400 dark:text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load phone number</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
              {phoneError?.data?.error?.message || phoneError?.data?.message || 'An error occurred while loading the phone number.'}
            </p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
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
          <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-12 text-center">
            <Phone className="w-12 h-12 text-gray-400 dark:text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone number not found</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">The phone number you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/phone-numbers')}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
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
          className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Phone Numbers</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Sync Warning Banner */}
        {phoneNumber.syncWarning && (
          <div className="p-4 bg-orange-900/20 border border-orange-700 rounded-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-orange-400 font-medium">Sync Issue Detected</p>
                  <p className="text-xs text-orange-400/80 mt-1">{phoneNumber.syncWarning}</p>
                </div>
              </div>
              <button
                onClick={handleResync}
                disabled={isResyncing}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResyncing ? 'animate-spin' : ''}`} />
                {isResyncing ? 'Resyncing...' : 'Resync'}
              </button>
            </div>
          </div>
        )}

        {/* Phone Number Overview Card */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#262626] flex items-center justify-center">
                <Phone className="w-6 h-6 text-gray-900 dark:text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatPhoneNumber(phoneNumber.number || phoneNumber.phoneNumber)}
                </h1>
                {phoneNumber.name && (
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{phoneNumber.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Status Badge */}
              <span className={`px-2.5 py-1 text-xs font-medium rounded ${
                phoneNumber.status === 'assigned'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700/50'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
              }`}>
                {phoneNumber.status === 'assigned' ? 'Assigned' : phoneNumber.status || 'Active'}
              </span>
              {/* Provider Badge */}
              <span className="px-2.5 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700">
                {(phoneNumber.provider || 'vapi').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-[#303030]">
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Business</p>
              <p className="text-sm text-gray-900 dark:text-white">{phoneNumber.businessName || phoneNumber.business?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Assistant</p>
              {phoneNumber.localAssistantName || phoneNumber.assistant?.name ? (
                <Link
                  to="/ai-assistant"
                  className="text-sm text-gray-900 dark:text-white hover:underline flex items-center gap-1"
                >
                  {phoneNumber.localAssistantName || phoneNumber.assistant?.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              ) : (
                <p className="text-sm text-gray-400 dark:text-zinc-500">Not assigned</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Created</p>
              <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(phoneNumber.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(phoneNumber.updatedAt)}</p>
            </div>
          </div>

          {/* Assigned At Info */}
          {phoneNumber.assignedAt && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#303030]">
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>Assistant assigned on {formatDateTime(phoneNumber.assignedAt)}</span>
              </div>
            </div>
          )}
        </div>

        {/* CARD: Phone Number Details */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Phone Number Details</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Give your phone number a descriptive name to help identify it in your list.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone Number Label */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">
                Phone Number Label <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (validationErrors.displayName) {
                    setValidationErrors((prev) => ({ ...prev, displayName: '' }));
                  }
                }}
                placeholder="e.g., Main Office Line"
                className={`w-full bg-white dark:bg-[#111114] border rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none ${
                  validationErrors.displayName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-[#303030] focus:border-gray-300 dark:focus:border-[#404040]'
                }`}
              />
              {validationErrors.displayName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">{validationErrors.displayName}</p>
              )}
            </div>

            {/* Provider (readonly) */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">Provider</label>
              <input
                type="text"
                value={(phoneNumber.provider || 'vapi').toUpperCase()}
                readOnly
                className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>

            {/* Vapi Phone ID (readonly) */}
            {phoneNumber.vapiPhoneId && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">Vapi Phone ID</label>
                <input
                  type="text"
                  value={phoneNumber.vapiPhoneId}
                  readOnly
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white font-mono cursor-not-allowed"
                />
              </div>
            )}

            {/* Twilio SID (readonly) */}
            {phoneNumber.twilioSid && (
              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">Twilio SID</label>
                <input
                  type="text"
                  value={phoneNumber.twilioSid}
                  readOnly
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white font-mono cursor-not-allowed"
                />
              </div>
            )}

            {/* Twilio Release Button */}
            {phoneNumber.provider === 'twilio' && (
              <div className="pt-4 border-t border-gray-200 dark:border-[#303030]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Release Twilio Number</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
                      Remove this number from your Twilio account and stop billing.
                    </p>
                  </div>
                  <button
                    onClick={handleReleaseTwilio}
                    disabled={isReleasing}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                  >
                    {isReleasing ? 'Releasing...' : 'Release Number'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD: Assistant Assignment */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Assistant Assignment</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Assign an AI assistant to handle incoming calls to this phone number.
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Assistant Info */}
            {(phoneNumber.localAssistantName || phoneNumber.assistant?.name) && (
              <div className="p-3 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-zinc-700 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {phoneNumber.localAssistantName || phoneNumber.assistant?.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">Currently assigned</p>
                    </div>
                  </div>
                  <Link
                    to="/ai-assistant"
                    className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View Assistant
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Assistant Dropdown */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">
                {phoneNumber.localAssistantName || phoneNumber.assistant?.name ? 'Change Assistant' : 'Select Assistant'}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedAssistantId}
                  onChange={(e) => setSelectedAssistantId(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                >
                  <option value="">No assistant</option>
                  {filteredAssistants.map((assistant) => (
                    <option key={assistant.id} value={assistant.id}>
                      {assistant.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignAssistant}
                  disabled={isAssigning || selectedAssistantId === (phoneNumber.localAssistantId || phoneNumber.assistant?.id || '')}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAssigning ? 'Assigning...' : 'Assign'}
                </button>
              </div>
              {filteredAssistants.length === 0 && (
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">
                  No assistants available. <Link to="/ai-assistant" className="text-gray-900 dark:text-white hover:underline">Create an assistant</Link> first.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CARD: Inbound Settings */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <h2 className="text-base font-medium text-gray-900 dark:text-white">Inbound Settings</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Configure how incoming calls are handled.
            </p>
          </div>

          <div className="space-y-4">
            {/* Inbound Phone Number (readonly) */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">Inbound Phone Number</label>
              <input
                type="text"
                value={formatPhoneNumber(phoneNumber.number || phoneNumber.phoneNumber)}
                readOnly
                className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>

            {/* Fallback Destination */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-1">Fallback Destination</label>
              <div className="flex gap-2">
                <select
                  value={fallbackCountryCode}
                  onChange={(e) => setFallbackCountryCode(e.target.value)}
                  className="w-24 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                >
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                </select>
                <input
                  type="tel"
                  value={fallbackNumber}
                  onChange={(e) => setFallbackNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="5551234567"
                  className="flex-1 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">
                Transfer calls here when the assistant is unavailable.
              </p>
            </div>
          </div>
        </div>

        {/* CARD: Outbound Settings */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PhoneOutgoing className="w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <div>
                <h2 className="text-base font-medium text-gray-900 dark:text-white">Outbound Settings</h2>
                <p className="text-sm text-gray-500 dark:text-zinc-500">
                  Configure outbound calling with assistant selection and batch options.
                </p>
              </div>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 px-2 py-0.5 rounded">Coming Soon</span>
          </div>

          <div className="space-y-4 opacity-60">
            <div>
              <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">Call Mode</label>
              <div className="flex gap-4">
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-[#111114] text-gray-400 dark:text-zinc-400 opacity-50 cursor-not-allowed"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900 dark:bg-white"></div>
                  </div>
                  <span className="text-sm">Call One Number</span>
                </button>
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-[#111114] text-gray-400 dark:text-zinc-400 opacity-50 cursor-not-allowed"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-zinc-600 flex items-center justify-center"></div>
                  <span className="text-sm">Call Many Numbers (Upload CSV)</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
                <Phone className="w-4 h-4" />
                Make a Call
              </button>
              <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-md text-sm font-medium opacity-50 cursor-not-allowed">
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
            className="px-6 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-white rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
