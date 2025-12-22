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
      const result = await connectGoogle(businessId).unwrap();
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
        <div className="text-gray-400">Loading integrations...</div>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading business information...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-white mb-3">Integrations</h1>
      <p className="text-sm text-gray-400 mb-4">
        Connect Callnfy with your favorite tools to streamline your workflow.
      </p>

      <div className="space-y-3">
        {/* Google Calendar Integration */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#262626] rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-0.5 text-sm">Google Calendar</h3>
                <p className="text-xs text-gray-400">
                  Sync your appointments with Google Calendar automatically.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGoogleConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-lg border border-green-800">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-lg">
                  <X className="w-3 h-3" />
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {isGoogleConnected ? (
            <div className="space-y-3">
              {/* Connected Account */}
              <div className="pt-3 border-t border-[#303030]">
                <label className="block text-xs text-gray-400 mb-1.5">Connected Account</label>
                <div className="flex items-center justify-between bg-[#262626] border border-[#303030] rounded-lg px-2.5 py-1.5">
                  <span className="text-xs text-white">{googleEmail}</span>
                  <button
                    onClick={handleDisconnectGoogle}
                    disabled={isDisconnectingGoogle}
                    className="bg-white text-black text-xs py-1 px-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {isDisconnectingGoogle ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              </div>

              {/* Sync Mode */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Sync Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateSyncMode('one-way')}
                    disabled={isUpdatingGoogle}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                      googleSyncMode === 'one-way'
                        ? 'bg-[#262626] border-white text-white'
                        : 'bg-[#1a1a1a] border-[#303030] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    One-way (Callnfy → Google)
                  </button>
                  <button
                    onClick={() => handleUpdateSyncMode('two-way')}
                    disabled={isUpdatingGoogle}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors ${
                      googleSyncMode === 'two-way'
                        ? 'bg-[#262626] border-white text-white'
                        : 'bg-[#1a1a1a] border-[#303030] text-gray-400 hover:border-gray-600'
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
            <div className="pt-3 border-t border-[#303030]">
              <button
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="inline-flex items-center gap-1.5 bg-white text-black text-sm py-1.5 px-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link className="w-3.5 h-3.5" />
                {isConnectingGoogle ? 'Connecting...' : 'Connect Google Calendar'}
              </button>
            </div>
          )}
        </div>

        {/* Zapier Integration */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#262626] rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-0.5 text-sm">Zapier</h3>
                <p className="text-xs text-gray-400">
                  Connect Callnfy to 5,000+ apps through Zapier webhooks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isZapierConnected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-900/30 text-green-400 text-xs font-medium rounded-lg border border-green-800">
                  <Check className="w-3 h-3" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-lg">
                  <X className="w-3 h-3" />
                  Not Connected
                </span>
              )}
            </div>
          </div>

          {isZapierConnected ? (
            <div className="space-y-3 pt-3 border-t border-[#303030]">
              {/* API Key */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    value={zapierApiKey || ''}
                    className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white font-mono"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="bg-white text-black p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(zapierApiKey, 'API Key')}
                    className="bg-white text-black p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
                    title="Copy API key"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Webhook URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={zapierWebhookUrl || ''}
                    className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs text-white font-mono truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(zapierWebhookUrl, 'Webhook URL')}
                    className="bg-white text-black p-1.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
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
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                {isRevokingZapier ? 'Revoking...' : 'Revoke API Key'}
              </button>

              {/* Zapier Documentation Link */}
              <div className="pt-1.5">
                <a
                  href="https://docs.zapier.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Zapier documentation
                </a>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#303030]">
              <button
                onClick={handleGenerateZapierKey}
                disabled={isGeneratingZapier}
                className="inline-flex items-center gap-1.5 bg-white text-black text-sm py-1.5 px-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
