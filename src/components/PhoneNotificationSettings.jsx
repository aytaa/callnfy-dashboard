import { useState, useEffect, useRef } from 'react';
import { Loader2, Phone, Check, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetPhoneSettingsQuery,
  useSendPhoneCodeMutation,
  useVerifyPhoneCodeMutation,
  useEnablePhoneNotificationsMutation,
  useDisablePhoneNotificationsMutation,
  useRemovePhoneNumberMutation,
} from '../slices/apiSlice/notificationApiSlice';

// Toggle Switch Component
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-[#303030]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
          checked ? 'translate-x-[18px] bg-white dark:bg-black' : 'translate-x-1 bg-gray-400 dark:bg-white/60'
        }`}
      />
    </button>
  );
}

// Country data with flags and dial codes
const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
];

// Country Picker Component
function CountryPicker({ selectedCountry, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-2 bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-l-md text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1a1a1d] transition-colors min-w-[90px]"
      >
        <span className="text-base">{selectedCountry.flag}</span>
        <span className="text-gray-600 dark:text-gray-400">{selectedCountry.dialCode}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md shadow-lg z-50">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 dark:border-[#303030]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-gray-300 dark:focus:border-[#404040]"
              autoFocus
            />
          </div>

          {/* Country List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">No countries found</p>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onSelect(country);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors ${
                    selectedCountry.code === country.code ? 'bg-gray-50 dark:bg-[#262626]' : ''
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className="flex-1 text-gray-900 dark:text-white">{country.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">{country.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Format phone number for display
function formatPhoneNumber(phone) {
  if (!phone) return '';
  // Just return the phone number as-is for display
  return phone;
}

export default function PhoneNotificationSettings() {
  const { data: settings, isLoading, refetch } = useGetPhoneSettingsQuery();
  const [sendCode, { isLoading: isSendingCode }] = useSendPhoneCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyPhoneCodeMutation();
  const [enableNotifications, { isLoading: isEnabling }] = useEnablePhoneNotificationsMutation();
  const [disableNotifications, { isLoading: isDisabling }] = useDisablePhoneNotificationsMutation();
  const [removeNumber, { isLoading: isRemoving }] = useRemovePhoneNumberMutation();

  // Local state
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default to US
  const [localNumber, setLocalNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingPhone, setPendingPhone] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const countdownRef = useRef(null);

  // Handle countdown for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      countdownRef.current = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [resendCountdown]);

  // Determine current state from API response
  // API returns: { phone: { phoneNumber, phoneVerified, phoneEnabled } }
  const phone = settings?.phone;
  const isVerified = phone?.phoneVerified === true;
  const hasPhoneNumber = !!phone?.phoneNumber;
  const isEnabled = phone?.phoneEnabled === true;

  // Get full phone number
  const getFullPhoneNumber = () => {
    const cleanLocal = localNumber.replace(/\D/g, '');
    return `${selectedCountry.dialCode}${cleanLocal}`;
  };

  // Handle send verification code
  const handleSendCode = async () => {
    setError('');

    const cleanLocal = localNumber.replace(/\D/g, '');
    if (cleanLocal.length < 6) {
      setError('Please enter a valid phone number');
      return;
    }

    const fullPhone = getFullPhoneNumber();

    try {
      await sendCode(fullPhone).unwrap();
      setPendingPhone(fullPhone);
      setShowVerification(true);
      setResendCountdown(60);
      toast.success('Verification code sent via SMS');
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to send verification code');
    }
  };

  // Handle verify code
  const handleVerify = async () => {
    setError('');

    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    try {
      await verifyCode(verificationCode).unwrap();
      setShowVerification(false);
      setVerificationCode('');
      setPendingPhone('');
      setLocalNumber('');
      toast.success('Phone number verified successfully');
      refetch();
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Invalid verification code');
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    setError('');
    try {
      await sendCode(pendingPhone).unwrap();
      setResendCountdown(60);
      toast.success('Verification code resent');
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to resend code');
    }
  };

  // Handle change number (go back to input)
  const handleChangeNumber = () => {
    setShowVerification(false);
    setVerificationCode('');
    setPendingPhone('');
    setError('');
    setResendCountdown(0);
  };

  // Handle toggle notifications
  const handleToggleNotifications = async (enabled) => {
    try {
      if (enabled) {
        await enableNotifications().unwrap();
        toast.success('SMS notifications enabled');
      } else {
        await disableNotifications().unwrap();
        toast.success('SMS notifications disabled');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to update settings');
    }
  };

  // Handle remove number
  const handleRemoveNumber = async () => {
    try {
      await removeNumber().unwrap();
      setShowRemoveConfirm(false);
      setLocalNumber('');
      toast.success('Phone number removed');
      refetch();
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to remove number');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
        <Phone className="w-4 h-4 text-gray-400 dark:text-white/60" />
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</h2>
      </div>

      {/* VERIFIED STATE */}
      {isVerified && hasPhoneNumber && !showRemoveConfirm && (
        <div className="space-y-4">
          {/* Verified Number Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-900 dark:text-white font-medium">
                {formatPhoneNumber(phone?.phoneNumber)}
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              Verified
            </span>
          </div>

          {/* Toggle Notifications */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Receive SMS notifications</p>
              <p className="text-xs text-gray-500">Get important updates via SMS</p>
            </div>
            <Toggle
              checked={isEnabled}
              onChange={handleToggleNotifications}
              disabled={isEnabling || isDisabling}
            />
          </div>

          {/* Remove Number Button */}
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Number
          </button>
        </div>
      )}

      {/* Remove Confirmation */}
      {showRemoveConfirm && (
        <div className="space-y-3">
          <p className="text-sm text-gray-900 dark:text-white">
            Are you sure you want to remove your phone number?
          </p>
          <p className="text-xs text-gray-500">
            You will stop receiving SMS notifications and will need to verify again.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRemoveNumber}
              disabled={isRemoving}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              {isRemoving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isRemoving ? 'Removing...' : 'Yes, Remove'}
            </button>
            <button
              onClick={() => setShowRemoveConfirm(false)}
              disabled={isRemoving}
              className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* VERIFICATION CODE INPUT STATE */}
      {showVerification && !isVerified && (
        <div className="space-y-4">
          {/* Pending Phone Number */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Verification code sent to</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">{pendingPhone}</p>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(val);
                setError('');
              }}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-white/40 tracking-widest font-mono"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>

          {/* Resend & Change Links */}
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={handleResendCode}
              disabled={resendCountdown > 0 || isSendingCode}
              className={`${
                resendCountdown > 0
                  ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              } transition-colors`}
            >
              {isSendingCode ? (
                'Sending...'
              ) : resendCountdown > 0 ? (
                `Resend code (${resendCountdown}s)`
              ) : (
                'Resend Code'
              )}
            </button>
            <button
              onClick={handleChangeNumber}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Change Number
            </button>
          </div>
        </div>
      )}

      {/* PHONE INPUT STATE - Only show when not verified and not in verification flow */}
      {!isVerified && !showVerification && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Add your phone number to receive important notifications via SMS.
          </p>

          {/* Phone Input with Country Picker */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
            <div className="flex">
              <CountryPicker
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
              <input
                type="tel"
                value={localNumber}
                onChange={(e) => {
                  // Only allow numbers
                  const val = e.target.value.replace(/\D/g, '');
                  setLocalNumber(val);
                  setError('');
                }}
                placeholder="5321112233"
                className="flex-1 bg-white dark:bg-[#111114] border border-l-0 border-gray-200 dark:border-[#303030] rounded-r-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-white/40"
              />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Send Code Button */}
          <button
            onClick={handleSendCode}
            disabled={isSendingCode || !localNumber.trim()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingCode && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSendingCode ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      )}
    </div>
  );
}
