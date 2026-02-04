import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { AlertCircle, Loader2, Check, Wifi, WifiOff } from 'lucide-react';
import { useCreateSipTrunkMutation, useUpdateSipTrunkMutation, useTestSipTrunkCredentialsMutation } from '../slices/apiSlice/sipTrunkApiSlice';

const SIP_PROVIDERS = [
  { value: 'netgsm', label: 'NetGSM', defaultHost: 'sip.netgsm.com.tr' },
  { value: 'bulutfon', label: 'Bulutfon', defaultHost: 'sip.bulutfon.com' },
  { value: 'verimor', label: 'Verimor', defaultHost: 'sip.verimor.com.tr' },
  { value: 'telsam', label: 'Telsam', defaultHost: 'sip.telsam.com.tr' },
  { value: 'turkcell', label: 'Turkcell Kurumsal', defaultHost: '' },
  { value: 'vodafone', label: 'Vodafone İş', defaultHost: '' },
  { value: 'custom', label: 'Custom / Other', defaultHost: '' },
];

const TRANSPORT_OPTIONS = [
  { value: 'udp', label: 'UDP' },
  { value: 'tcp', label: 'TCP' },
  { value: 'tls', label: 'TLS' },
];

export default function AddSipTrunkModal({ isOpen, onClose, businessId, editTrunk }) {
  const [providerName, setProviderName] = useState('netgsm');
  const [name, setName] = useState('');
  const [sipHost, setSipHost] = useState('sip.netgsm.com.tr');
  const [sipPort, setSipPort] = useState('5060');
  const [transport, setTransport] = useState('udp');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [error, setError] = useState('');
  const [testResult, setTestResult] = useState(null); // null | 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');

  const [createSipTrunk, { isLoading: isCreating }] = useCreateSipTrunkMutation();
  const [updateSipTrunk, { isLoading: isUpdating }] = useUpdateSipTrunkMutation();
  const [testCredentials, { isLoading: isTesting }] = useTestSipTrunkCredentialsMutation();

  const isEditing = !!editTrunk;

  // Populate form when editing
  useEffect(() => {
    if (editTrunk) {
      setProviderName(editTrunk.providerName || 'custom');
      setName(editTrunk.name || '');
      setSipHost(editTrunk.sipHost || '');
      setSipPort(String(editTrunk.sipPort || 5060));
      setTransport(editTrunk.transport || 'udp');
      setAuthUsername(editTrunk.authUsername || '');
      setAuthPassword('');
    } else {
      handleReset();
    }
  }, [editTrunk, isOpen]);

  const handleReset = () => {
    setProviderName('netgsm');
    setName('');
    setSipHost('sip.netgsm.com.tr');
    setSipPort('5060');
    setTransport('udp');
    setAuthUsername('');
    setAuthPassword('');
    setError('');
    setTestResult(null);
    setTestMessage('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleProviderChange = (value) => {
    setProviderName(value);
    const provider = SIP_PROVIDERS.find((p) => p.value === value);
    if (provider?.defaultHost) {
      setSipHost(provider.defaultHost);
    } else {
      setSipHost('');
    }
    // Auto-fill name
    if (!name || SIP_PROVIDERS.some((p) => p.label === name || `My ${p.label} Trunk` === name)) {
      const selectedProvider = SIP_PROVIDERS.find((p) => p.value === value);
      if (selectedProvider && selectedProvider.value !== 'custom') {
        setName(`My ${selectedProvider.label} Trunk`);
      } else {
        setName('');
      }
    }
    setTestResult(null);
    setTestMessage('');
  };

  const handleTestConnection = async () => {
    setError('');
    setTestResult(null);
    setTestMessage('');

    if (!sipHost.trim()) {
      setError('SIP Host is required');
      return;
    }

    try {
      const payload = {
        businessId,
        providerName,
        sipHost: sipHost.trim(),
        sipPort: Number(sipPort) || 5060,
        transport,
        authUsername: authUsername.trim(),
        ...(authPassword && { authPassword }),
      };

      if (isEditing) {
        payload.sipTrunkId = editTrunk.id;
      }

      const result = await testCredentials(payload).unwrap();
      setTestResult('success');
      setTestMessage(result?.message || 'Connection test successful');
    } catch (err) {
      setTestResult('error');
      setTestMessage(err?.data?.error?.message || err?.data?.message || 'Connection test failed');
    }
  };

  const handleSubmit = async () => {
    setError('');

    if (!name.trim()) {
      setError('Display name is required');
      return;
    }
    if (!sipHost.trim()) {
      setError('SIP Host is required');
      return;
    }
    if (!authUsername.trim()) {
      setError('Username is required');
      return;
    }
    if (!isEditing && !authPassword) {
      setError('Password is required');
      return;
    }

    try {
      const payload = {
        businessId,
        name: name.trim(),
        providerName,
        sipHost: sipHost.trim(),
        sipPort: Number(sipPort) || 5060,
        transport,
        authUsername: authUsername.trim(),
        ...(authPassword && { authPassword }),
      };

      if (isEditing) {
        await updateSipTrunk({ id: editTrunk.id, ...payload }).unwrap();
      } else {
        await createSipTrunk(payload).unwrap();
      }

      handleClose();
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} SIP trunk`);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Edit SIP Trunk' : 'Connect SIP Provider'} size="lg">
      <div className="space-y-4">
        {/* Error */}
        {error && (
          <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Provider Selection */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Provider</label>
          <select
            value={providerName}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
          >
            {SIP_PROVIDERS.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., My NetGSM Trunk"
            className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
          />
        </div>

        {/* Connection Details */}
        <div className="pt-2 border-t border-gray-200 dark:border-[#303030]">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Connection Details</p>

          {/* SIP Host */}
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1.5">
              SIP Host / Domain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sipHost}
              onChange={(e) => {
                setSipHost(e.target.value);
                setTestResult(null);
              }}
              placeholder="e.g., sip.provider.com"
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            />
          </div>

          {/* Port & Transport */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Port</label>
              <input
                type="text"
                value={sipPort}
                onChange={(e) => setSipPort(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="5060"
                className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Transport</label>
              <select
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              >
                {TRANSPORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="pt-2 border-t border-gray-200 dark:border-[#303030]">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Authentication</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={authUsername}
                onChange={(e) => {
                  setAuthUsername(e.target.value);
                  setTestResult(null);
                }}
                placeholder="SIP username"
                className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">
                Password {!isEditing && <span className="text-red-500">*</span>}
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  setTestResult(null);
                }}
                placeholder={isEditing ? 'Leave blank to keep current' : 'SIP password'}
                className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="pt-2 border-t border-gray-200 dark:border-[#303030]">
          <button
            onClick={handleTestConnection}
            disabled={isTesting || !sipHost.trim()}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-xs font-medium rounded-md hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" />
                Test Connection
              </>
            )}
          </button>

          {testResult === 'success' && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <p className="text-xs text-green-600 dark:text-green-400">{testMessage}</p>
            </div>
          )}

          {testResult === 'error' && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-red-500 dark:text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{testMessage}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-[#303030]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-[#303030] text-gray-700 dark:text-white rounded-md hover:border-gray-300 dark:hover:border-[#404040] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !name.trim() || !sipHost.trim() || !authUsername.trim() || (!isEditing && !authPassword)}
            className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Trunk' : 'Save Trunk')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
