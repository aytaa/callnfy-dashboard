import { useState } from 'react';
import Modal from './ui/Modal';
import { Phone, Globe, AlertCircle, Loader2, Info } from 'lucide-react';
import { usePurchasePhoneNumberMutation } from '../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';

const PHONE_OPTIONS = [
  {
    id: 'vapi-number',
    type: 'vapi',
    label: 'Free Vapi Number',
    description: 'Free US phone number',
    icon: Phone,
  },
  {
    id: 'vapi-sip',
    type: 'vapi-sip',
    label: 'Free Vapi SIP',
    description: 'SIP URI for VoIP',
    icon: Globe,
  },
];

export default function PurchasePhoneModal({ isOpen, onClose }) {
  const [selectedOption, setSelectedOption] = useState('vapi-number');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [sipUri, setSipUri] = useState('');
  const [error, setError] = useState('');

  const { data: businesses } = useGetBusinessesQuery();
  const [purchaseNumber, { isLoading: isCreating }] = usePurchasePhoneNumberMutation();

  const handleReset = () => {
    setSelectedOption('vapi-number');
    setSelectedBusiness('');
    setAreaCode('');
    setSipUri('');
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleCreate = async () => {
    if (!selectedBusiness) {
      setError('Please select a business');
      return;
    }

    // Validate based on selected option
    if (selectedOption === 'vapi-number') {
      if (!areaCode || areaCode.length !== 3) {
        setError('Please enter a valid 3-digit area code');
        return;
      }
    }

    setError('');

    try {
      // Direct creation - backend assigns the number
      const payload = {
        provider: 'vapi',
        businessId: selectedBusiness,
      };

      if (selectedOption === 'vapi-number') {
        payload.areaCode = areaCode;
        payload.numberType = 'phone';
      } else if (selectedOption === 'vapi-sip') {
        payload.numberType = 'sip';
        if (sipUri) payload.sipUri = sipUri;
      }

      await purchaseNumber(payload).unwrap();
      handleClose();
    } catch (err) {
      console.error('Create phone number error:', err);
      const errorMessage = err?.data?.error?.details || err?.data?.error?.message || err?.data?.message || 'Failed to create phone number';
      setError(errorMessage);
    }
  };

  const currentOption = PHONE_OPTIONS.find((opt) => opt.id === selectedOption);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Phone Number" size="lg">
      <div className="flex min-h-[360px]">
        {/* Left Sidebar - Phone Number Options */}
        <div className="w-56 border-r border-[#303030] pr-4">
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-2">
              Phone Number Options
            </label>
          </div>
          <div className="space-y-1">
            {PHONE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id);
                    setError('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all ${
                    isSelected
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    isSelected ? 'bg-white/10' : 'bg-[#111114]'
                  }`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side - Configuration */}
        <div className="flex-1 pl-4">
          {error && (
            <div className="mb-4 p-2.5 bg-red-900/20 border border-red-800 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Business Selection */}
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">
              Business
            </label>
            <select
              value={selectedBusiness}
              onChange={(e) => {
                setSelectedBusiness(e.target.value);
                setError('');
              }}
              className="w-full bg-[#111114] border border-[#303030] rounded-md px-3 py-2 text-sm text-white focus:border-[#404040] focus:outline-none"
            >
              <option value="">Select a business...</option>
              {businesses?.map((business) => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vapi Number Configuration */}
          {selectedOption === 'vapi-number' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Area Code
                </label>
                <input
                  type="text"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="e.g. 415, 212, 346"
                  className="w-full bg-[#111114] border border-[#303030] rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#404040] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Info Box */}
              <div className="bg-[#111114] border border-[#303030] rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Free US phone numbers</p>
                    <p className="text-xs text-gray-500">Up to 10 per account</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vapi SIP Configuration */}
          {selectedOption === 'vapi-sip' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  SIP URI (Optional)
                </label>
                <input
                  type="text"
                  value={sipUri}
                  onChange={(e) => setSipUri(e.target.value)}
                  placeholder="sip:user@domain.com"
                  className="w-full bg-[#111114] border border-[#303030] rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#404040] focus:outline-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-[#111114] border border-[#303030] rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Free SIP endpoint</p>
                    <p className="text-xs text-gray-500">Works with any VoIP provider</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#303030]">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm border border-[#303030] text-white rounded-md hover:border-[#404040] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || !selectedBusiness}
              className="px-4 py-2 text-sm bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
