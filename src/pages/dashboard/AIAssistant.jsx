import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import {
  useGetAssistantQuery,
  useCreateAssistantMutation,
  useUpdateAssistantMutation,
} from '../../slices/apiSlice/assistantApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import CreateAssistantModal from '../../components/CreateAssistantModal';

export default function AIAssistant() {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [voiceProvider, setVoiceProvider] = useState('vapi');
  const [voiceId, setVoiceId] = useState('');
  const [llmProvider, setLlmProvider] = useState('openai');
  const [llmModel, setLlmModel] = useState('gpt-4o');

  // UI state
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // API hooks
  const { data: assistantsData, isLoading, isError, error: queryError } = useGetAssistantQuery();
  const { data: businesses } = useGetBusinessesQuery();
  const [createAssistant, { isLoading: isCreating }] = useCreateAssistantMutation();
  const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistantMutation();

  // Get assistant and business
  const assistants = assistantsData || [];
  const assistant = assistants.length > 0 ? assistants[0] : null;
  const businessId = businesses && businesses.length > 0 ? businesses[0].id : null;
  const businessName = businesses && businesses.length > 0 ? businesses[0].name : '';

  // Initialize form when assistant data loads
  useEffect(() => {
    if (assistant) {
      setName(assistant.name || '');
      setFirstMessage(assistant.firstMessage || '');
      setSystemPrompt(assistant.systemPrompt || '');

      // Handle voice - can be object or string
      if (assistant.voice && typeof assistant.voice === 'object') {
        setVoiceProvider(assistant.voice.provider || 'vapi');
        setVoiceId(assistant.voice.voiceId || '');
      } else {
        setVoiceProvider(assistant.voiceProvider || 'vapi');
        setVoiceId(assistant.voiceId || '');
      }

      // Handle model - can be object or string
      if (assistant.model && typeof assistant.model === 'object') {
        setLlmProvider(assistant.model.provider || 'openai');
        setLlmModel(assistant.model.model || 'gpt-4o');
      } else {
        setLlmProvider(assistant.llmProvider || 'openai');
        setLlmModel(assistant.llmModel || 'gpt-4o');
      }
    }
  }, [assistant]);

  // Track unsaved changes
  useEffect(() => {
    if (assistant) {
      // Get current voice values
      const currentVoiceProvider = assistant.voice?.provider || assistant.voiceProvider || 'vapi';
      const currentVoiceId = assistant.voice?.voiceId || assistant.voiceId || '';

      // Get current model values
      const currentLlmProvider = assistant.model?.provider || assistant.llmProvider || 'openai';
      const currentLlmModel = assistant.model?.model || assistant.llmModel || 'gpt-4o';

      const hasChanges =
        name !== (assistant.name || '') ||
        firstMessage !== (assistant.firstMessage || '') ||
        systemPrompt !== (assistant.systemPrompt || '') ||
        voiceProvider !== currentVoiceProvider ||
        voiceId !== currentVoiceId ||
        llmProvider !== currentLlmProvider ||
        llmModel !== currentLlmModel;

      setHasUnsavedChanges(hasChanges);
    }
  }, [assistant, name, firstMessage, systemPrompt, voiceProvider, voiceId, llmProvider, llmModel]);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    try {
      await updateAssistant({
        id: assistant.id,
        name,
        firstMessage,
        systemPrompt,
        voice: {
          provider: voiceProvider,
          voiceId: voiceId,
        },
        model: {
          provider: llmProvider,
          model: llmModel,
        },
      }).unwrap();
      setSuccessMessage('Assistant updated successfully!');
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to save assistant');
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading assistant...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">
              {queryError?.data?.error?.message || queryError?.data?.message || 'Failed to load assistant data'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // STATE A: No Assistant Yet - Show Empty State
  if (!assistant) {
    return (
      <>
        <div className="px-8 py-6">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-6">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg mb-6">
                <p className="text-sm text-green-400">{successMessage}</p>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No AI Assistant Yet</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-md">
                  Create an AI assistant to handle your calls intelligently. Configure its voice, behavior, and conversation style.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black font-medium px-6 py-2.5 text-sm rounded-lg hover:bg-zinc-200 transition-colors"
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

  // STATE B: Has Assistant - Show Settings Form
  return (
    <div className="px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
            <p className="text-sm text-green-400">{successMessage}</p>
          </div>
        )}

        {hasUnsavedChanges && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-400">You have unsaved changes</p>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Assistant Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                placeholder="My AI Assistant"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">First Message</label>
              <textarea
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none resize-none"
                rows={2}
                placeholder="Hello! Thanks for calling. How can I help you today?"
              />
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Instructions</h2>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none resize-none"
              rows={8}
              placeholder="You are a helpful receptionist for {business_name}..."
            />
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Voice</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Voice Provider</label>
              <select
                value={voiceProvider}
                onChange={(e) => setVoiceProvider(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
              >
                <option value="vapi">Vapi</option>
                <option value="azure">Azure</option>
                <option value="elevenlabs">ElevenLabs</option>
                <option value="openai">OpenAI</option>
                <option value="playht">PlayHT</option>
                <option value="deepgram">Deepgram</option>
                <option value="cartesia">Cartesia</option>
                <option value="rime-ai">Rime AI</option>
                <option value="lmnt">LMNT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Voice ID</label>
              <input
                type="text"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                placeholder="Provider-specific voice ID"
              />
            </div>
          </div>
        </div>

        {/* Model Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Language Model</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Provider</label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
                <option value="groq">Groq</option>
                <option value="together-ai">Together AI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Model</label>
              <input
                type="text"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
                placeholder="gpt-4o, claude-3-5-sonnet, etc."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isUpdating || !hasUnsavedChanges}
            className="bg-white text-black font-medium px-6 py-2.5 text-sm rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
