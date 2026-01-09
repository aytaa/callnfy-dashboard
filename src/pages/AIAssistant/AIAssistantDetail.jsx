import { useState } from 'react';
import { Phone, MessageSquare, TestTube, Sparkles, AlertTriangle, Info, Loader2, Clock, Mic, Brain, Settings, Hash } from 'lucide-react';
import {
  useGetAssistantQuery,
  useUpdateAssistantMutation,
  useCreateAssistantMutation,
} from '../../slices/apiSlice/assistantApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import ModelTab from './tabs/ModelTab';
import VoiceTab from './tabs/VoiceTab';
import CreateAssistantModal from '../../components/CreateAssistantModal';

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  return `${mins} min`;
};

const formatFirstMessageMode = (mode) => {
  if (!mode) return '-';
  return mode
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const capitalize = (str) => {
  if (!str) return '-';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Info field component
const InfoField = ({ label, value, mono = false }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">{label}</p>
    <p className={`text-sm text-gray-900 dark:text-white ${mono ? 'font-mono text-xs break-all' : ''}`}>
      {value || '-'}
    </p>
  </div>
);

// Section component
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />}
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default function AIAssistantDetail() {
  const [activeTab, setActiveTab] = useState('overview');
  const [updateData, setUpdateData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // API hooks
  const { data: assistantsData, isLoading, isError, error: queryError } = useGetAssistantQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: businesses } = useGetBusinessesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistantMutation();
  const [createAssistant, { isLoading: isCreating }] = useCreateAssistantMutation();

  // Get the first assistant (single assistant per business)
  const assistants = assistantsData || [];
  const assistant = assistants.length > 0 ? assistants[0] : null;
  const businessId = businesses && businesses.length > 0 ? businesses[0].id : null;
  const businessName = businesses && businesses.length > 0 ? businesses[0].name : '';

  const handleCreateFromModal = async (payload) => {
    setError('');
    setSuccessMessage('');

    if (!businessId) {
      setError('No business found. Please create a business first.');
      return;
    }

    try {
      await createAssistant({
        businessId,
        ...payload,
      }).unwrap();
      setSuccessMessage('Assistant created successfully!');
      setIsModalOpen(false);
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to create assistant');
    }
  };

  const handleUpdate = async (data) => {
    if (!assistant) return;

    // Merge new data with existing updateData
    const mergedData = { ...updateData, ...data };
    setUpdateData(mergedData);

    try {
      await updateAssistant({
        id: assistant.id,
        ...mergedData,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update assistant:', err);
    }
  };

  const handleTest = () => {
    console.log('Test assistant');
  };

  const handleChat = () => {
    console.log('Open chat');
  };

  const handleTalk = () => {
    console.log('Talk to assistant');
  };

  if (isLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-transparent">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">
              {queryError?.data?.error?.message || queryError?.data?.message || 'Failed to load assistant data'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No assistant - show empty state
  if (!assistant) {
    return (
      <>
        <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md mb-6">
                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
              </div>
            )}

            <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#111114] rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No AI Assistant Yet</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 max-w-md">
                  Create an AI assistant to handle your calls intelligently. Configure its voice, behavior, and conversation style.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black font-medium px-6 py-2.5 text-sm rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Create AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>

        <CreateAssistantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateFromModal}
          isCreating={isCreating}
          businessName={businessName}
        />
      </>
    );
  }

  // Format helper for voice display
  const formatVoice = () => {
    const provider = assistant.voiceProvider;
    const voiceId = assistant.voiceId;
    if (!provider && !voiceId) return 'Not configured';
    return `${capitalize(provider)} - ${voiceId || 'Unknown'}`;
  };

  // Format helper for model display
  const formatModel = () => {
    const model = assistant.model;
    if (!model) return 'Not configured';
    return `${capitalize(model.provider)} - ${model.model || 'Unknown'}`;
  };

  // Format helper for transcriber display
  const formatTranscriber = () => {
    const transcriber = assistant.transcriber;
    if (!transcriber) return 'Not configured';
    return `${capitalize(transcriber.provider)} - ${transcriber.model || 'Unknown'}`;
  };

  return (
    <div className="px-8 py-6 bg-gray-50 dark:bg-transparent min-h-screen">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Vapi Sync Warning */}
        {assistant.vapiError && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Could not sync with Vapi</p>
              <p className="text-xs text-yellow-500 dark:text-yellow-400/70 mt-0.5">{assistant.vapiError}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{assistant.name || 'AI Receptionist'}</h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{assistant.businessName || businessName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTest}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                Test
              </button>
              <button
                onClick={handleChat}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-700 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={handleTalk}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-white rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Talk to Assistant
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-gray-200 dark:border-zinc-800">
            {['overview', 'model', 'voice'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative capitalize ${
                  activeTab === tab
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Voice</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={formatVoice()}>
                    {formatVoice()}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Model</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={formatModel()}>
                    {formatModel()}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Transcriber</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={formatTranscriber()}>
                    {formatTranscriber()}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-800 rounded-md p-4">
                  <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Max Duration</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(assistant.maxDurationSeconds)}
                  </p>
                </div>
              </div>

              {/* Basic Info Section */}
              <Section title="Basic Info" icon={Info}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InfoField label="Name" value={assistant.name} />
                  <InfoField label="Business Name" value={assistant.businessName} />
                  <InfoField label="Created" value={formatDate(assistant.createdAt)} />
                  <InfoField label="Updated" value={formatDate(assistant.updatedAt)} />
                </div>
              </Section>

              {/* Voice Settings Section */}
              <Section title="Voice Settings" icon={Mic}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <InfoField label="Voice Provider" value={capitalize(assistant.voiceProvider)} />
                  <InfoField label="Voice ID" value={assistant.voiceId} />
                  <InfoField label="First Message Mode" value={formatFirstMessageMode(assistant.firstMessageMode)} />
                  <InfoField label="Greeting" value={assistant.greeting || 'Not set'} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoField label="End Call Message" value={assistant.endCallMessage || 'Not set'} />
                  <InfoField label="Voicemail Message" value={assistant.voicemailMessage || 'Not set'} />
                </div>
              </Section>

              {/* AI Model Section */}
              <Section title="AI Model" icon={Brain}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <InfoField label="Provider" value={capitalize(assistant.model?.provider)} />
                  <InfoField label="Model" value={assistant.model?.model} />
                  <InfoField label="Max Tokens" value={assistant.model?.maxTokens?.toString()} />
                  <InfoField label="Temperature" value={assistant.model?.temperature?.toString()} />
                </div>
                {assistant.systemPrompt && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-2">System Prompt</p>
                    <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-zinc-800 rounded-md p-3">
                      <pre className="text-xs text-gray-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                        {assistant.systemPrompt}
                      </pre>
                    </div>
                  </div>
                )}
              </Section>

              {/* Transcriber Section */}
              <Section title="Transcriber" icon={Mic}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoField label="Provider" value={capitalize(assistant.transcriber?.provider)} />
                  <InfoField label="Model" value={assistant.transcriber?.model} />
                  <InfoField label="Language" value={assistant.transcriber?.language?.toUpperCase()} />
                </div>
              </Section>

              {/* Call Settings Section */}
              <Section title="Call Settings" icon={Clock}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <InfoField label="Max Duration" value={formatDuration(assistant.maxDurationSeconds)} />
                  <InfoField label="First Message Mode" value={formatFirstMessageMode(assistant.firstMessageMode)} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">End Call Phrases</p>
                    {assistant.endCallPhrases && assistant.endCallPhrases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {assistant.endCallPhrases.map((phrase, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs rounded"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-900 dark:text-white">-</p>
                    )}
                  </div>
                </div>
              </Section>

              {/* Technical Info Section */}
              <Section title="Technical Info" icon={Hash}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoField label="Assistant ID" value={assistant.id} mono />
                  <InfoField label="Vapi Assistant ID" value={assistant.vapiAssistantId} mono />
                  <InfoField label="Business ID" value={assistant.businessId} mono />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'model' && (
            <ModelTab assistant={assistant} onUpdate={handleUpdate} />
          )}
          {activeTab === 'voice' && (
            <VoiceTab assistant={assistant} onUpdate={handleUpdate} />
          )}
        </div>

        {/* Update Indicator */}
        {isUpdating && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-zinc-700 rounded-md px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
              <span className="text-sm text-gray-900 dark:text-white">Saving changes...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
