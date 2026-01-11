import { useState } from 'react';
import { Calendar, Zap, Check, X, Copy, Link, RefreshCw, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import {
  useGetIntegrationStatusQuery,
  useConnectGoogleCalendarMutation,
  useDisconnectGoogleCalendarMutation,
  useUpdateGoogleCalendarSettingsMutation,
  useGenerateZapierKeyMutation,
  useRevokeZapierKeyMutation,
} from '../../slices/apiSlice/integrationsApiSlice';

export default function Integrations() {
  // Get businessId from current business
  const { data: businesses, isLoading: businessesLoading } = useGetBusinessesQuery();
  const business = businesses?.[0];
  const businessId = business?.id;

  const { data: integrationStatus, isLoading } = useGetIntegrationStatusQuery(businessId, {
    skip: !businessId,
  });
  const [connectGoogle, { isLoading: isConnectingGoogle }] = useConnectGoogleCalendarMutation();
  const [disconnectGoogle, { isLoading: isDisconnectingGoogle }] = useDisconnectGoogleCalendarMutation();
  const [updateGoogleSettings, { isLoading: isUpdatingGoogle }] = useUpdateGoogleCalendarSettingsMutation();
  const [generateZapierKey, { isLoading: isGeneratingZapier }] = useGenerateZapierKeyMutation();
  const [revokeZapierKey, { isLoading: isRevokingZapier }] = useRevokeZapierKeyMutation();

  const [syncMode, setSyncMode] = useState('one-way'); // 'one-way' or 'two-way'
  const [showApiKey, setShowApiKey] = useState(false);

  // Extract integration data
  const googleCalendar = integrationStatus?.googleCalendar || {};
  const zapier = integrationStatus?.zapier || {};

  const isGoogleConnected = googleCalendar?.connected || false;
  const googleEmail = googleCalendar?.email || '';
  const googleSyncMode = googleCalendar?.syncMode || 'one-way';

  const isZapierConnected = zapier?.connected || false;
  const zapierApiKey = zapier?.settings?.apiKey || ''; // Full API key from settings
  const zapierWebhookUrl = zapier?.webhookUrl || ''; // Webhook URL from root level

  // Handle Google Calendar connection
  const handleConnectGoogle = async () => {
    if (!businessId) {
      toast.error('Business not found');
      return;
    }

    try {
      const result = await connectGoogle({ businessId }).unwrap();
      if (result?.data?.authUrl) {
        // Redirect to Google OAuth
        window.location.href = result.data.authUrl;
      }
    } catch (err) {
      console.error('Google connection error:', err);
      toast.error('Failed to connect Google Calendar');
    }
  };

  const handleDisconnectGoogle = async () => {
    if (!window.confirm('Are you sure you want to disconnect Google Calendar?')) return;
    if (!businessId) {
      toast.error('Business not found');
      return;
    }

    try {
      await disconnectGoogle(businessId).unwrap();
      toast.success('Google Calendar disconnected');
    } catch (err) {
      console.error('Google disconnect error:', err);
      toast.error('Failed to disconnect Google Calendar');
    }
  };

  const handleUpdateSyncMode = async (mode) => {
    if (!businessId) {
      toast.error('Business not found');
      return;
    }

    try {
      await updateGoogleSettings({ businessId, settings: { syncMode: mode } }).unwrap();
      setSyncMode(mode);
      toast.success('Sync mode updated');
    } catch (err) {
      console.error('Sync mode update error:', err);
      toast.error('Failed to update sync mode');
    }
  };

  // Handle Zapier API key
  const handleGenerateZapierKey = async () => {
    if (!businessId) {
      toast.error('Business not found');
      return;
    }

    try {
      await generateZapierKey(businessId).unwrap();
      toast.success('Zapier API key generated');
    } catch (err) {
      console.error('Zapier key generation error:', err);
      toast.error('Failed to generate API key');
    }
  };

  const handleRevokeZapierKey = async () => {
    if (!window.confirm('Are you sure? This will break existing Zapier integrations.')) return;
    if (!businessId) {
      toast.error('Business not found');
      return;
    }

    try {
      await revokeZapierKey(businessId).unwrap();
      toast.success('Zapier API key revoked');
    } catch (err) {
      console.error('Zapier key revoke error:', err);
      toast.error('Failed to revoke API key');
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (businessesLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading integrations...</div>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading business information...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Integrations</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Connect Callnfy with your favorite tools to streamline your workflow.
      </p>

      <div className="space-y-3">
        {/* Google Calendar Integration */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-[#111114] rounded-md flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium mb-0.5 text-sm">Google Calendar</h3>
                <p className="text-xs text-gray-500">
                  Sync your appointments with Google Calendar automatically.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGoogleConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-xs font-medium rounded border border-gray-200 dark:border-white/20">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-[#111114] text-gray-500 dark:text-gray-400 text-xs font-medium rounded border border-gray-200 dark:border-[#303030]">
                  <X className="w-3 h-3" />
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {isGoogleConnected ? (
            <div className="space-y-3">
              {/* Connected Account */}
              <div className="pt-3 border-t border-gray-200 dark:border-[#303030]">
                <label className="block text-xs text-gray-500 mb-1">Connected Account</label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5">
                  <span className="text-xs text-gray-900 dark:text-white">{googleEmail}</span>
                  <button
                    onClick={handleDisconnectGoogle}
                    disabled={isDisconnectingGoogle}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black text-xs py-1 px-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isDisconnectingGoogle ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              </div>

              {/* Sync Mode */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sync Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateSyncMode('one-way')}
                    disabled={isUpdatingGoogle}
                    className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                      googleSyncMode === 'one-way'
                        ? 'bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white'
                        : 'bg-white dark:bg-[#111114] border-gray-200 dark:border-[#303030] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#404040]'
                    }`}
                  >
                    One-way (Callnfy → Google)
                  </button>
                  <button
                    onClick={() => handleUpdateSyncMode('two-way')}
                    disabled={isUpdatingGoogle}
                    className={`px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                      googleSyncMode === 'two-way'
                        ? 'bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white'
                        : 'bg-white dark:bg-[#111114] border-gray-200 dark:border-[#303030] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#404040]'
                    }`}
                  >
                    Two-way (Sync both ways)
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {googleSyncMode === 'one-way'
                    ? 'Appointments created in Callnfy will be added to Google Calendar.'
                    : 'Appointments sync in both directions between Callnfy and Google Calendar.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-200 dark:border-[#303030]">
              <button
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs py-1.5 px-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link className="w-3.5 h-3.5" />
                {isConnectingGoogle ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
            </div>
          )}
        </div>

        {/* Zapier Integration */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-[#111114] rounded-md flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium mb-0.5 text-sm">Zapier</h3>
                <p className="text-xs text-gray-500">
                  Connect Callnfy to 5,000+ apps through Zapier webhooks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isZapierConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-xs font-medium rounded border border-gray-200 dark:border-white/20">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 dark:bg-[#111114] text-gray-500 dark:text-gray-400 text-xs font-medium rounded border border-gray-200 dark:border-[#303030]">
                  <X className="w-3 h-3" />
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {isZapierConnected ? (
            <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-[#303030]">
              {/* API Key */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    value={zapierApiKey || ''}
                    className="flex-1 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(zapierApiKey, 'API Key')}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                    title="Copy API key"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Webhook URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={zapierWebhookUrl || ''}
                    className="flex-1 bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-mono truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(zapierWebhookUrl, 'Webhook URL')}
                    className="bg-gray-900 dark:bg-white text-white dark:text-black p-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex-shrink-0"
                    title="Copy webhook URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Use this URL in Zapier to receive events (new appointments, cancellations, etc.)
                </p>
              </div>

              {/* Revoke Button */}
              <button
                onClick={handleRevokeZapierKey}
                disabled={isRevokingZapier}
                className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isRevokingZapier ? 'Revoking...' : 'Revoke API Key'}
              </button>

              {/* Zapier Documentation Link */}
              <div className="pt-1.5">
                <a
                  href="https://docs.zapier.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Zapier documentation
                </a>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-200 dark:border-[#303030]">
              <button
                onClick={handleGenerateZapierKey}
                disabled={isGeneratingZapier}
                className="inline-flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs py-1.5 px-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {isGeneratingZapier ? 'Generating...' : 'Generate API Key'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
