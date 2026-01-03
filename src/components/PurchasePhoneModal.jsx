import { useState } from 'react';
import Modal from './ui/Modal';
import { Phone, Search, CheckCircle, AlertCircle } from 'lucide-react';
import {
  useLazyListAvailableNumbersQuery,
  usePurchasePhoneNumberMutation,
} from '../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';

export default function PurchasePhoneModal({ isOpen, onClose }) {
  const [step, setStep] = useState('provider'); // 'provider' | 'twilio-search' | 'twilio-select'
  const [provider, setProvider] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [error, setError] = useState('');

  const { data: businesses } = useGetBusinessesQuery();
  const [searchNumbers, { data: availableNumbers, isLoading: isSearching }] =
    useLazyListAvailableNumbersQuery();
  const [purchaseNumber, { isLoading: isPurchasing }] = usePurchasePhoneNumberMutation();

  const handleReset = () => {
    setStep('provider');
    setProvider('');
    setSelectedBusiness('');
    setAreaCode('');
    setSelectedNumber(null);
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleProviderSelect = (selectedProvider) => {
    setProvider(selectedProvider);
    setError('');

    if (selectedProvider === 'vapi') {
      // For Vapi, we can proceed directly if business is selected
      if (!selectedBusiness) {
        setError('Please select a business first');
        return;
      }
      // Stay on provider selection to confirm
    } else if (selectedProvider === 'twilio') {
      setStep('twilio-search');
    }
  };

  const handleTwilioSearch = async () => {
    if (!selectedBusiness) {
      setError('Please select a business');
      return;
    }

    setError('');
    try {
      await searchNumbers({
        provider: 'twilio',
        businessId: selectedBusiness,
        areaCode: areaCode || undefined,
        country: 'US',
      }).unwrap();
      setStep('twilio-select');
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to search numbers');
    }
  };

  const handlePurchase = async (numberToPurchase) => {
    if (!selectedBusiness) {
      setError('Please select a business');
      return;
    }

    setError('');
    try {
      const purchaseData = {
        provider,
        businessId: selectedBusiness,
      };

      if (provider === 'vapi') {
        if (!areaCode || areaCode.length !== 3) {
          setError('Please enter a valid 3-digit area code');
          return;
        }
        purchaseData.areaCode = areaCode;
      }

      if (provider === 'twilio') {
        if (!numberToPurchase) {
          setError('Please select a number');
          return;
        }
        purchaseData.number = numberToPurchase;
      }

      await purchaseNumber(purchaseData).unwrap();
      handleClose();
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to purchase number');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Buy Phone Number" size="md">
      <div className="space-y-4">
        {error && (
          <div className="p-2.5 bg-red-900/20 border border-red-800 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {step === 'provider' && (
          <>
            {/* Business Selection */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Select Business
              </label>
              <select
                value={selectedBusiness}
                onChange={(e) => {
                  setSelectedBusiness(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#111114] border border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-white focus:border-[#404040] focus:outline-none"
              >
                <option value="">Choose a business...</option>
                {businesses?.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Choose Provider
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Vapi Option */}
                <button
                  onClick={() => handleProviderSelect('vapi')}
                  disabled={!selectedBusiness}
                  className={`p-3 rounded-md border transition-all text-left ${
                    provider === 'vapi'
                      ? 'border-white/20 bg-white/10'
                      : 'border-[#303030] hover:border-[#404040]'
                  } ${!selectedBusiness ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">Vapi</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Free SIP Number</p>
                    </div>
                    {provider === 'vapi' && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>US Only</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>Limit: 10 numbers</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>Instant setup</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#303030]">
                    <span className="text-sm font-semibold text-white">Free</span>
                  </div>
                </button>

                {/* Twilio Option */}
                <button
                  onClick={() => handleProviderSelect('twilio')}
                  disabled={!selectedBusiness}
                  className={`p-3 rounded-md border transition-all text-left ${
                    provider === 'twilio'
                      ? 'border-white/20 bg-white/10'
                      : 'border-[#303030] hover:border-[#404040]'
                  } ${!selectedBusiness ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">Twilio</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Premium Numbers</p>
                    </div>
                    {provider === 'twilio' && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>International</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>Choose area code</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                      <span>SMS & Voice</span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#303030]">
                    <span className="text-sm font-semibold text-white">Paid</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Vapi Area Code Input */}
            {provider === 'vapi' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Area Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="e.g. 415, 212, 346"
                  className="w-full bg-[#111114] border border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-[#404040] focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter US area code for free Vapi number
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={handleClose}
                className="px-3 py-1.5 text-xs border border-[#303030] text-white rounded-md hover:border-[#404040] transition-colors"
              >
                Cancel
              </button>
              {provider === 'vapi' && (
                <button
                  onClick={() => handlePurchase()}
                  disabled={isPurchasing || !selectedBusiness || areaCode.length !== 3}
                  className="px-3 py-1.5 text-xs bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? 'Creating...' : 'Get Free Number'}
                </button>
              )}
            </div>
          </>
        )}

        {step === 'twilio-search' && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Area Code (Optional)
                </label>
                <input
                  type="text"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="e.g., 415"
                  className="w-full bg-[#111114] border border-[#303030] rounded-md px-2.5 py-1.5 text-sm text-white placeholder:text-gray-600 focus:border-[#404040] focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to search all available numbers
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setStep('provider')}
                  className="px-3 py-1.5 text-xs border border-[#303030] text-white rounded-md hover:border-[#404040] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleTwilioSearch}
                  disabled={isSearching}
                  className="px-3 py-1.5 text-xs bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-black border-t-transparent" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      Search Numbers
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'twilio-select' && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs text-gray-500 mb-2">
                  Available Numbers
                  {availableNumbers?.availableNumbers && (
                    <span className="text-gray-400 ml-2">
                      ({availableNumbers.availableNumbers.length} found)
                    </span>
                  )}
                </h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {availableNumbers?.availableNumbers?.map((num) => (
                    <button
                      key={num.phoneNumber}
                      onClick={() => setSelectedNumber(num.phoneNumber)}
                      className={`w-full p-3 rounded-md border transition-all text-left ${
                        selectedNumber === num.phoneNumber
                          ? 'border-white/20 bg-white/10'
                          : 'border-[#303030] hover:border-[#404040]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{num.phoneNumber}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {num.locality}, {num.region}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {num.capabilities?.voice && (
                            <span className="px-2 py-0.5 text-xs bg-[#111114] text-white rounded border border-[#303030]">
                              Voice
                            </span>
                          )}
                          {num.capabilities?.sms && (
                            <span className="px-2 py-0.5 text-xs bg-[#111114] text-gray-400 rounded border border-[#303030]">
                              SMS
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setStep('twilio-search')}
                  className="px-3 py-1.5 text-xs border border-[#303030] text-white rounded-md hover:border-[#404040] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => handlePurchase(selectedNumber)}
                  disabled={isPurchasing || !selectedNumber}
                  className="px-3 py-1.5 text-xs bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isPurchasing ? 'Purchasing...' : 'Purchase Number'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
