import { useState, useEffect, useRef } from 'react';
import { Loader2, MessageCircle, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetWhatsAppSettingsQuery,
  useSendWhatsAppCodeMutation,
  useVerifyWhatsAppCodeMutation,
  useEnableWhatsAppNotificationsMutation,
  useDisableWhatsAppNotificationsMutation,
  useRemoveWhatsAppNumberMutation,
} from '../slices/apiSlice/notificationApiSlice';

// Toggle Switch Component (same as in NotificationSettings)
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

// Mask phone number: +90 541 *** ** 66
function maskPhoneNumber(phone) {
  if (!phone || phone.length < 6) return phone;
  const countryCode = phone.slice(0, 3);
  const lastTwo = phone.slice(-2);
  const middle = phone.slice(3, -2);
  // Format middle portion with asterisks
  let formatted = '';
  for (let i = 0; i < middle.length; i++) {
    if (i === 0 || i === 3) formatted += ' ';
    formatted += i >= 1 && i < middle.length - 1 ? '*' : middle[i];
  }
  return `${countryCode}${formatted}${lastTwo}`;
}

export default function WhatsAppNotificationSettings() {
  const { data: settings, isLoading, refetch } = useGetWhatsAppSettingsQuery();
  const [sendCode, { isLoading: isSendingCode }] = useSendWhatsAppCodeMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyWhatsAppCodeMutation();
  const [enableNotifications, { isLoading: isEnabling }] = useEnableWhatsAppNotificationsMutation();
  const [disableNotifications, { isLoading: isDisabling }] = useDisableWhatsAppNotificationsMutation();
  const [removeNumber, { isLoading: isRemoving }] = useRemoveWhatsAppNumberMutation();

  // Local state
  const [phoneNumber, setPhoneNumber] = useState('');
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

  // Determine current state
  const isVerified = settings?.verified === true;
  const hasPhoneNumber = !!settings?.phoneNumber;
  const isEnabled = settings?.enabled === true;

  // Handle send verification code
  const handleSendCode = async () => {
    setError('');

    // Basic phone validation
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!cleanPhone.match(/^\+?[1-9]\d{6,14}$/)) {
      setError('Please enter a valid phone number with country code (e.g., +905321112233)');
      return;
    }

    try {
      await sendCode(cleanPhone).unwrap();
      setPendingPhone(cleanPhone);
      setShowVerification(true);
      setResendCountdown(60);
      toast.success('Verification code sent to your WhatsApp');
    } catch (err) {
      setError(err?.data?.error?.message || 'Failed to send verification code');
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
      toast.success('WhatsApp number verified successfully');
      refetch();
    } catch (err) {
      setError(err?.data?.error?.message || 'Invalid verification code');
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
      setError(err?.data?.error?.message || 'Failed to resend code');
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
        toast.success('WhatsApp notifications enabled');
      } else {
        await disableNotifications().unwrap();
        toast.success('WhatsApp notifications disabled');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to update settings');
    }
  };

  // Handle remove number
  const handleRemoveNumber = async () => {
    try {
      await removeNumber().unwrap();
      setShowRemoveConfirm(false);
      setPhoneNumber('');
      toast.success('WhatsApp number removed');
      refetch();
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to remove number');
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
        <MessageCircle className="w-4 h-4 text-gray-400 dark:text-white/60" />
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp Notifications</h2>
      </div>

      {/* State 3: Verified */}
      {isVerified && hasPhoneNumber && !showRemoveConfirm && (
        <div className="space-y-4">
          {/* Verified Number */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-900 dark:text-white">{maskPhoneNumber(settings.phoneNumber)}</span>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
          </div>

          {/* Toggle Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Receive WhatsApp notifications</p>
              <p className="text-xs text-gray-500">Get important updates via WhatsApp</p>
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
            Are you sure you want to remove your WhatsApp number?
          </p>
          <p className="text-xs text-gray-500">
            You will stop receiving WhatsApp notifications and will need to verify again.
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

      {/* State 2: Code sent, waiting for verification */}
      {showVerification && !isVerified && (
        <div className="space-y-4">
          {/* Masked Phone Number */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Verification code sent to</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">{maskPhoneNumber(pendingPhone)}</p>
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

      {/* State 1: No number added */}
      {!isVerified && !hasPhoneNumber && !showVerification && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Add your WhatsApp number to receive important notifications via WhatsApp.
          </p>

          {/* Phone Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              placeholder="+905321112233"
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-white/40"
            />
            <p className="mt-1 text-xs text-gray-400">Include country code (e.g., +90 for Turkey)</p>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          {/* Send Code Button */}
          <button
            onClick={handleSendCode}
            disabled={isSendingCode || !phoneNumber.trim()}
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
