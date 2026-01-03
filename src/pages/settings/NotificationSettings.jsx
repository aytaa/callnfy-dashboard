import { useState, useEffect } from 'react';
import { Loader2, Bell, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from '../../slices/apiSlice/notificationApiSlice';

// Toggle Switch Component
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-white' : 'bg-[#303030]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
          checked ? 'translate-x-[18px] bg-black' : 'translate-x-1 bg-white/60'
        }`}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const { data: preferences, isLoading, error } = useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isSaving }] = useUpdateNotificationPreferencesMutation();

  // Local state for form
  const [settings, setSettings] = useState({
    // Email notifications
    emailCallSummaries: true,
    emailNewAppointments: true,
    emailAppointmentReminders: true,
    emailLowMinutesWarning: true,
    // Dashboard notifications
    dashboardEnabled: true,
  });

  // Populate form when data loads
  useEffect(() => {
    if (preferences) {
      setSettings({
        emailCallSummaries: preferences.emailCallSummaries ?? true,
        emailNewAppointments: preferences.emailNewAppointments ?? true,
        emailAppointmentReminders: preferences.emailAppointmentReminders ?? true,
        emailLowMinutesWarning: preferences.emailLowMinutesWarning ?? true,
        dashboardEnabled: preferences.dashboardEnabled ?? true,
      });
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences(settings).unwrap();
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error(err?.data?.error?.message || 'Failed to save preferences');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-500/10 border border-zinc-500/20 rounded-lg p-3">
        <p className="text-zinc-400 text-sm">Failed to load notification preferences</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-1">Notifications</h1>
      <p className="text-sm text-gray-400 mb-4">
        Manage how you receive notifications
      </p>

      {/* Email Notifications */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#303030]">
          <Mail className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white">Email Notifications</h2>
        </div>

        <div className="space-y-3">
          {/* Call Summaries */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Call summaries</p>
              <p className="text-xs text-gray-500">Receive a summary after each call</p>
            </div>
            <Toggle
              checked={settings.emailCallSummaries}
              onChange={() => handleToggle('emailCallSummaries')}
            />
          </div>

          {/* New Appointments */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">New appointments</p>
              <p className="text-xs text-gray-500">Get notified when appointments are booked</p>
            </div>
            <Toggle
              checked={settings.emailNewAppointments}
              onChange={() => handleToggle('emailNewAppointments')}
            />
          </div>

          {/* Appointment Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Appointment reminders</p>
              <p className="text-xs text-gray-500">Reminder before upcoming appointments</p>
            </div>
            <Toggle
              checked={settings.emailAppointmentReminders}
              onChange={() => handleToggle('emailAppointmentReminders')}
            />
          </div>

          {/* Low Minutes Warning */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Low minutes warning</p>
              <p className="text-xs text-gray-500">Alert when your minutes are running low</p>
            </div>
            <Toggle
              checked={settings.emailLowMinutesWarning}
              onChange={() => handleToggle('emailLowMinutesWarning')}
            />
          </div>
        </div>
      </div>

      {/* Dashboard Notifications */}
      <div className="bg-[#1a1a1d] border border-[#303030] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#303030]">
          <Bell className="w-4 h-4 text-white/60" />
          <h2 className="text-sm font-medium text-white">Dashboard Notifications</h2>
        </div>

        <div className="space-y-3">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Enable notifications</p>
              <p className="text-xs text-gray-500">Show notifications in the dashboard</p>
            </div>
            <Toggle
              checked={settings.dashboardEnabled}
              onChange={() => handleToggle('dashboardEnabled')}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
