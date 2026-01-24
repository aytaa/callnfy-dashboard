import { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { Phone, AlertCircle, Loader2, Info, Search, Check, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { usePurchasePhoneNumberMutation, useSearchTwilioNumbersMutation, useCreatePhoneNumberCheckoutMutation } from '../slices/apiSlice/phoneApiSlice';
import { useGetBusinessesQuery } from '../slices/apiSlice/businessApiSlice';

// Error code mappings for user-friendly messages
const ERROR_MESSAGES = {
  PHONE_ORDER_DUPLICATE: 'You already have a pending order for this phone number. Please complete or cancel the existing order first.',
  PHONE_NOT_AVAILABLE: 'This phone number is no longer available. Please search for a different number.',
};

const PHONE_OPTIONS = [
  {
    id: 'vapi-number',
    type: 'vapi',
    label: 'Standard Number',
    description: 'Free US phone number',
    icon: Phone,
  },
  {
    id: 'twilio-number',
    type: 'twilio',
    label: 'Premium Number',
    description: 'Paid phone number',
    icon: DollarSign,
  },
];

const TWILIO_NUMBER_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'tollfree', label: 'Toll-Free' },
  { value: 'mobile', label: 'Mobile' },
];

const TWILIO_COUNTRIES = [
  { value: 'US', label: 'United States (+1)' },
  { value: 'CA', label: 'Canada (+1)' },
  { value: 'GB', label: 'United Kingdom (+44)' },
  { value: 'AU', label: 'Australia (+61)' },
  { value: 'DE', label: 'Germany (+49)' },
  { value: 'FR', label: 'France (+33)' },
];

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

export default function PurchasePhoneModal({ isOpen, onClose, checkoutResult }) {
  const [selectedOption, setSelectedOption] = useState('vapi-number');
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Twilio-specific state
  const [twilioCountry, setTwilioCountry] = useState('US');
  const [twilioType, setTwilioType] = useState('local');
  const [twilioAreaCode, setTwilioAreaCode] = useState('');
  const [twilioContains, setTwilioContains] = useState('');
  const [twilioSearchResults, setTwilioSearchResults] = useState([]);
  const [selectedTwilioNumber, setSelectedTwilioNumber] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: businesses, refetch: refetchBusinesses } = useGetBusinessesQuery();
  const [purchaseNumber, { isLoading: isCreating }] = usePurchasePhoneNumberMutation();
  const [searchTwilioNumbers, { isLoading: isSearching }] = useSearchTwilioNumbersMutation();
  const [createPhoneCheckout, { isLoading: isCreatingCheckout }] = useCreatePhoneNumberCheckoutMutation();

  // Refetch businesses when checkout was successful
  useEffect(() => {
    if (checkoutResult === 'success') {
      refetchBusinesses();
    }
  }, [checkoutResult, refetchBusinesses]);

  const handleReset = () => {
    setSelectedOption('vapi-number');
    setSelectedBusiness('');
    setAreaCode('');
    setError('');
    setSuccessMessage('');
    // Reset Twilio state
    setTwilioCountry('US');
    setTwilioType('local');
    setTwilioAreaCode('');
    setTwilioContains('');
    setTwilioSearchResults([]);
    setSelectedTwilioNumber(null);
    setHasSearched(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleTwilioSearch = async () => {
    if (!selectedBusiness) {
      setError('Please select a business first');
      return;
    }

    setError('');
    setSelectedTwilioNumber(null);
    setHasSearched(true);

    try {
      const result = await searchTwilioNumbers({
        businessId: selectedBusiness,
        country: twilioCountry,
        type: twilioType,
        areaCode: twilioAreaCode || undefined,
        contains: twilioContains || undefined,
      }).unwrap();

      setTwilioSearchResults(result?.data?.numbers || result?.numbers || []);
    } catch (err) {
      console.error('Twilio search error:', err);
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to search for phone numbers');
      setTwilioSearchResults([]);
    }
  };

  const getErrorMessage = (err) => {
    const errorCode = err?.data?.error?.code;
    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return ERROR_MESSAGES[errorCode];
    }
    return err?.data?.error?.details || err?.data?.error?.message || err?.data?.message || 'An error occurred';
  };

  const handleCreate = async () => {
    if (!selectedBusiness) {
      setError('Please select a business');
      return;
    }

    // Handle Premium number purchase via Stripe checkout
    if (selectedOption === 'twilio-number') {
      if (!selectedTwilioNumber) {
        setError('Please search and select a phone number first');
        return;
      }

      setError('');
      setSuccessMessage('');

      try {
        // Create Stripe checkout session
        const result = await createPhoneCheckout({
          phoneNumber: selectedTwilioNumber.phoneNumber,
          businessId: selectedBusiness,
        }).unwrap();

        // Redirect to Stripe checkout
        if (result?.url) {
          window.location.href = result.url;
        } else if (result?.data?.url) {
          window.location.href = result.data.url;
        } else {
          setError('Failed to create checkout session. Please try again.');
        }
      } catch (err) {
        console.error('Checkout creation error:', err);
        setError(getErrorMessage(err));
      }
      return;
    }

    // Validate based on selected option (Standard/Vapi)
    if (selectedOption === 'vapi-number') {
      if (!areaCode || areaCode.length !== 3) {
        setError('Please enter a valid 3-digit area code');
        return;
      }
    }

    setError('');
    setSuccessMessage('');

    try {
      // Direct creation for free numbers - backend assigns the number
      const payload = {
        provider: 'vapi',
        businessId: selectedBusiness,
      };

      if (selectedOption === 'vapi-number') {
        payload.areaCode = areaCode;
        payload.numberType = 'phone';
      }

      await purchaseNumber(payload).unwrap();
      handleClose();
    } catch (err) {
      console.error('Create phone number error:', err);
      setError(getErrorMessage(err));
    }
  };

  const isLoading = isCreating || isCreatingCheckout;
  const isRedirectingToCheckout = isCreatingCheckout;

  // If showing checkout result, render a simplified view
  if (checkoutResult) {
    const isSuccess = checkoutResult === 'success';
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Phone Number" size="md">
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {isSuccess ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                Purchase Successful
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Phone number purchased successfully! It will be ready in a few moments.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                Checkout Canceled
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                Checkout was canceled. You can try again.
              </p>
            </>
          )}
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={isRedirectingToCheckout ? undefined : handleClose} title="Phone Number" size="lg">
      {/* Full modal loading overlay during checkout redirect */}
      {isRedirectingToCheckout && (
        <div className="absolute inset-0 bg-white/80 dark:bg-[#111114]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
          <Loader2 className="w-8 h-8 text-gray-900 dark:text-white animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">Redirecting to secure checkout...</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please wait</p>
        </div>
      )}
      <div className="flex min-h-[400px]">
        {/* Left Sidebar - Phone Number Options */}
        <div className="w-56 border-r border-gray-200 dark:border-[#303030] pr-4">
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
                    setTwilioSearchResults([]);
                    setSelectedTwilioNumber(null);
                    setHasSearched(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all ${
                    isSelected
                      ? 'bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20'
                      : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    isSelected ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#111114]'
                  }`}>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-600">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side - Configuration */}
        <div className="flex-1 pl-4">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
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
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
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
                  className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Info Box */}
              <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Free US phone numbers</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Up to 10 per account</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Twilio Number Configuration */}
          {selectedOption === 'twilio-number' && (
            <div className="space-y-4">
              {/* Search Form */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Country
                  </label>
                  <select
                    value={twilioCountry}
                    onChange={(e) => setTwilioCountry(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  >
                    {TWILIO_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Number Type
                  </label>
                  <select
                    value={twilioType}
                    onChange={(e) => setTwilioType(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  >
                    {TWILIO_NUMBER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Area Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={twilioAreaCode}
                    onChange={(e) => setTwilioAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="e.g. 415"
                    className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Contains (Optional)
                  </label>
                  <input
                    type="text"
                    value={twilioContains}
                    onChange={(e) => setTwilioContains(e.target.value.replace(/\D/g, '').slice(0, 7))}
                    placeholder="e.g. 1234"
                    className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleTwilioSearch}
                disabled={isSearching}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-[#303030] transition-colors disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search Available Numbers
                  </>
                )}
              </button>

              {/* Search Results */}
              {hasSearched && (
                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1.5">
                    Available Numbers ({twilioSearchResults.length})
                  </label>
                  {twilioSearchResults.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-[#303030] rounded-md">
                      {twilioSearchResults.map((number, index) => (
                        <button
                          key={number.phoneNumber || index}
                          onClick={() => setSelectedTwilioNumber(number)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                            selectedTwilioNumber?.phoneNumber === number.phoneNumber
                              ? 'bg-gray-100 dark:bg-white/10'
                              : 'hover:bg-gray-50 dark:hover:bg-white/5'
                          } ${index !== 0 ? 'border-t border-gray-200 dark:border-[#303030]' : ''}`}
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatPhoneNumber(number.phoneNumber)}
                            </p>
                            {number.locality && (
                              <p className="text-xs text-gray-500">
                                {number.locality}{number.region ? `, ${number.region}` : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {number.monthlyPrice && (
                              <span className="text-xs text-gray-500">
                                ${number.monthlyPrice}/mo
                              </span>
                            )}
                            {selectedTwilioNumber?.phoneNumber === number.phoneNumber && (
                              <Check className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center border border-gray-200 dark:border-[#303030] rounded-md">
                      <p className="text-xs text-gray-500">
                        No numbers found. Try different search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Premium phone numbers</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">You'll be redirected to secure checkout to complete your purchase.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-[#303030]">
            <button
              onClick={handleClose}
              disabled={isRedirectingToCheckout}
              className="px-4 py-2 text-sm border border-gray-200 dark:border-[#303030] text-gray-700 dark:text-white rounded-md hover:border-gray-300 dark:hover:border-[#404040] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={
                isLoading ||
                !selectedBusiness ||
                (selectedOption === 'vapi-number' && (!areaCode || areaCode.length !== 3)) ||
                (selectedOption === 'twilio-number' && !selectedTwilioNumber)
              }
              className="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-black font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                selectedOption === 'twilio-number' ? 'Processing...' : 'Creating...'
              ) : (
                selectedOption === 'twilio-number' ? 'Continue to Checkout' : 'Create'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
