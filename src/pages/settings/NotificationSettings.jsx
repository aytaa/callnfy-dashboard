import { useState, useEffect, useMemo } from 'react';
import { Loader2, Bell, Clock, Mail, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useResetNotificationSettingsMutation,
} from '../../slices/apiSlice/notificationApiSlice';
import PhoneNotificationSettings from '../../components/PhoneNotificationSettings';

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

// Notification type configuration
const NOTIFICATION_CATEGORIES = [
  {
    name: 'Calls',
    types: [
      { key: 'newCall', label: 'New Call', description: 'When a new call is received' },
      { key: 'missedCall', label: 'Missed Call', description: 'When a call is missed' },
    ],
  },
  {
    name: 'Appointments',
    types: [
      { key: 'newAppointment', label: 'New Appointment', description: 'When an appointment is booked' },
      { key: 'appointmentReminder', label: 'Appointment Reminder', description: 'Reminder before appointments' },
      { key: 'appointmentCancelled', label: 'Appointment Cancelled', description: 'When an appointment is cancelled' },
    ],
  },
  {
    name: 'Billing',
    types: [
      { key: 'trialEnding', label: 'Trial Ending', description: 'When your trial is about to end' },
      { key: 'trialEnded', label: 'Trial Ended', description: 'When your trial has ended' },
      { key: 'paymentSuccess', label: 'Payment Success', description: 'When a payment is successful' },
      { key: 'paymentFailed', label: 'Payment Failed', description: 'When a payment fails' },
    ],
  },
  {
    name: 'Usage',
    types: [
      { key: 'usageWarning', label: 'Usage Warning', description: 'When usage is approaching limits' },
      { key: 'usageLimitReached', label: 'Usage Limit Reached', description: 'When usage limits are reached' },
    ],
  },
  {
    name: 'Other',
    types: [
      { key: 'newLead', label: 'New Lead', description: 'When a new lead is captured' },
      { key: 'weeklyReport', label: 'Weekly Report', description: 'Weekly summary report' },
    ],
  },
];

// Common timezones
const TIMEZONES = [
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Amsterdam',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Istanbul',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Hong_Kong',
  'Australia/Sydney',
  'Pacific/Auckland',
];

// Default settings structure (matches backend _formatSettings)
const DEFAULT_SETTINGS = {
  notificationTypes: {
    newCall: { inApp: true, email: false },
    missedCall: { inApp: true, email: true },
    newAppointment: { inApp: true, email: true },
    appointmentReminder: { inApp: true, email: true },
    appointmentCancelled: { inApp: true, email: true },
    trialEnding: { inApp: true, email: true },
    trialEnded: { inApp: true, email: true },
    paymentSuccess: { inApp: true, email: true },
    paymentFailed: { inApp: true, email: true },
    usageWarning: { inApp: true, email: true },
    usageLimitReached: { inApp: true, email: true },
    newLead: { inApp: true, email: false },
    weeklyReport: { inApp: false, email: true },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  timezone: 'Europe/London',
  emailDigest: {
    enabled: false,
    frequency: 'daily',
  },
};

export default function NotificationSettings() {
  const { data: serverSettings, isLoading, error } = useGetNotificationSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateSettings, { isLoading: isSaving }] = useUpdateNotificationSettingsMutation();
  const [resetSettings, { isLoading: isResetting }] = useResetNotificationSettingsMutation();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState(null);

  // Populate form when data loads
  useEffect(() => {
    if (serverSettings) {
      const merged = {
        ...DEFAULT_SETTINGS,
        ...serverSettings,
        notificationTypes: {
          ...DEFAULT_SETTINGS.notificationTypes,
          ...serverSettings.notificationTypes,
        },
        quietHours: {
          ...DEFAULT_SETTINGS.quietHours,
          ...serverSettings.quietHours,
        },
        emailDigest: {
          ...DEFAULT_SETTINGS.emailDigest,
          ...serverSettings.emailDigest,
        },
      };
      setSettings(merged);
      setOriginalSettings(merged);
    }
  }, [serverSettings]);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  // Handle notification type toggle
  const handleNotificationToggle = (typeKey, channel) => {
    setSettings((prev) => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [typeKey]: {
          ...prev.notificationTypes[typeKey],
          [channel]: !prev.notificationTypes[typeKey]?.[channel],
        },
      },
    }));
  };

  // Handle quiet hours toggle
  const handleQuietHoursToggle = (value) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: value,
      },
    }));
  };

  // Handle quiet hours time change
  const handleQuietHoursChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  // Handle timezone change
  const handleTimezoneChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      timezone: value,
    }));
  };

  // Handle email digest toggle
  const handleEmailDigestToggle = (value) => {
    setSettings((prev) => ({
      ...prev,
      emailDigest: {
        ...prev.emailDigest,
        enabled: value,
      },
    }));
  };

  // Handle email digest frequency change
  const handleEmailDigestFrequencyChange = (value) => {
    setSettings((prev) => ({
      ...prev,
      emailDigest: {
        ...prev.emailDigest,
        frequency: value,
      },
    }));
  };

  // Save changes - transform to backend format
  const handleSave = async () => {
    try {
      // Transform to backend format (flat fields for quiet hours and email digest)
      const payload = {
        notificationTypes: settings.notificationTypes,
        quietHoursEnabled: settings.quietHours.enabled,
        quietHoursStart: settings.quietHours.start,
        quietHoursEnd: settings.quietHours.end,
        timezone: settings.timezone,
        emailDigestEnabled: settings.emailDigest.enabled,
        emailDigestFrequency: settings.emailDigest.frequency,
      };

      await updateSettings(payload).unwrap();
      setOriginalSettings(settings);
      toast.success('Notification settings saved');
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to save settings');
    }
  };

  // Reset to defaults
  const handleReset = async () => {
    try {
      const result = await resetSettings().unwrap();
      // Result is already transformed to the nested structure by transformResponse
      const merged = {
        ...DEFAULT_SETTINGS,
        ...result,
        notificationTypes: {
          ...DEFAULT_SETTINGS.notificationTypes,
          ...result?.notificationTypes,
        },
        quietHours: {
          ...DEFAULT_SETTINGS.quietHours,
          ...result?.quietHours,
        },
        emailDigest: {
          ...DEFAULT_SETTINGS.emailDigest,
          ...result?.emailDigest,
        },
      };
      setSettings(merged);
      setOriginalSettings(merged);
      toast.success('Settings reset to defaults');
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to reset settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-zinc-500/10 border border-red-200 dark:border-zinc-500/20 rounded-lg p-3">
        <p className="text-red-600 dark:text-zinc-400 text-sm">Failed to load notification settings</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Notifications</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Manage how and when you receive notifications
      </p>

      {/* SMS Notifications */}
      <div className="mb-3">
        <PhoneNotificationSettings />
      </div>

      {/* Notification Types */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
          <Bell className="w-4 h-4 text-gray-400 dark:text-white/60" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Notification Types</h2>
        </div>

        {/* Table Header */}
        <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">
          <span>Notification</span>
          <div className="flex items-center gap-6">
            <span className="w-12 text-center">In-App</span>
            <span className="w-12 text-center">Email</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {NOTIFICATION_CATEGORIES.map((category) => (
            <div key={category.name}>
              <p className="text-xs text-gray-500 font-medium mb-2 px-1">{category.name}</p>
              <div className="space-y-2">
                {category.types.map((type) => (
                  <div
                    key={type.key}
                    className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-white/5 rounded transition-colors"
                  >
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="w-12 flex justify-center">
                        <Toggle
                          checked={settings.notificationTypes[type.key]?.inApp ?? false}
                          onChange={() => handleNotificationToggle(type.key, 'inApp')}
                        />
                      </div>
                      <div className="w-12 flex justify-center">
                        <Toggle
                          checked={settings.notificationTypes[type.key]?.email ?? false}
                          onChange={() => handleNotificationToggle(type.key, 'email')}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
          <Clock className="w-4 h-4 text-gray-400 dark:text-white/60" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Quiet Hours</h2>
        </div>

        <div className="space-y-3">
          {/* Enable Quiet Hours */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Enable Quiet Hours</p>
              <p className="text-xs text-gray-500">Pause non-critical notifications during set hours</p>
            </div>
            <Toggle
              checked={settings.quietHours.enabled}
              onChange={handleQuietHoursToggle}
            />
          </div>

          {/* Quiet Hours Settings */}
          {settings.quietHours.enabled && (
            <div className="pt-3 border-t border-gray-200 dark:border-[#303030] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {/* Start Time */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-300 dark:focus:border-white/40"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">End Time</label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-300 dark:focus:border-white/40"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleTimezoneChange(e.target.value)}
                  className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-300 dark:focus:border-white/40"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-500 italic">
                Critical notifications (payment failed, usage limit) will still be sent
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Digest */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
          <Mail className="w-4 h-4 text-gray-400 dark:text-white/60" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">Email Digest</h2>
        </div>

        <div className="space-y-3">
          {/* Enable Email Digest */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-900 dark:text-white">Enable Email Digest</p>
              <p className="text-xs text-gray-500">Receive a summary of notifications via email</p>
            </div>
            <Toggle
              checked={settings.emailDigest.enabled}
              onChange={handleEmailDigestToggle}
            />
          </div>

          {/* Frequency */}
          {settings.emailDigest.enabled && (
            <div className="pt-3 border-t border-gray-200 dark:border-[#303030]">
              <label className="block text-xs text-gray-500 mb-2">Frequency</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="digestFrequency"
                    value="daily"
                    checked={settings.emailDigest.frequency === 'daily'}
                    onChange={(e) => handleEmailDigestFrequencyChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 dark:text-white bg-white dark:bg-[#111114] border-gray-200 dark:border-[#303030] focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Daily</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="digestFrequency"
                    value="weekly"
                    checked={settings.emailDigest.frequency === 'weekly'}
                    onChange={(e) => handleEmailDigestFrequencyChange(e.target.value)}
                    className="w-4 h-4 text-gray-900 dark:text-white bg-white dark:bg-[#111114] border-gray-200 dark:border-[#303030] focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Weekly</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          disabled={isResetting || isSaving}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-[#303030] rounded-md hover:border-gray-300 dark:hover:border-white/40 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isResetting ? 'Resetting...' : 'Reset to Defaults'}
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 ${
            hasChanges
              ? 'bg-violet-500 text-white hover:bg-violet-600'
              : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
          }`}
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
