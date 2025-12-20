import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import {
  useGetAssistantQuery,
  useCreateAssistantMutation,
  useUpdateAssistantMutation,
} from '../../slices/apiSlice/assistantApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';

export default function AIAssistant() {
  const [name, setName] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [greeting, setGreeting] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: assistantsData, isLoading, isError, error: queryError } = useGetAssistantQuery();
  const { data: businesses } = useGetBusinessesQuery();
  const [createAssistant, { isLoading: isCreating }] = useCreateAssistantMutation();
  const [updateAssistant, { isLoading: isUpdating }] = useUpdateAssistantMutation();

  // Handle API response structure - check if data is wrapped in { success, data }
  const assistants = assistantsData?.data || assistantsData;
  const assistant = assistants && Array.isArray(assistants) && assistants.length > 0 ? assistants[0] : null;
  const businessId = businesses && businesses.length > 0 ? businesses[0].id : null;

  useEffect(() => {
    if (assistant) {
      setName(assistant.name || '');
      setVoiceId(assistant.voiceId || '');
      setGreeting(assistant.greeting || '');
      setSystemPrompt(assistant.systemPrompt || '');
    }
  }, [assistant]);

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    try {
      if (assistant) {
        await updateAssistant({
          id: assistant.id,
          name,
          voiceId,
          greeting,
          systemPrompt,
        }).unwrap();
        setSuccessMessage('Assistant updated successfully!');
      } else {
        if (!businessId) {
          setError('No business found. Please create a business first.');
          return;
        }
        await createAssistant({
          businessId,
          name,
          voiceId,
          greeting,
          systemPrompt,
        }).unwrap();
        setSuccessMessage('Assistant created successfully!');
      }
    } catch (err) {
      setError(err?.data?.error?.message || err?.data?.message || 'Failed to save assistant');
    }
  };

  if (isLoading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading assistant...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">AI Assistant</h1>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {queryError?.data?.error?.message || queryError?.data?.message || 'Failed to load assistant data'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-4">

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {!assistant ? (
          <div className="bg-[#171717] border border-[#303030] rounded-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-semibold text-white mb-1">No AI Assistant yet</h3>
              <p className="text-sm text-white opacity-60 mb-6">
                Create an AI assistant to handle your calls
              </p>
            </div>
          </div>
        ) : null}

        {/* Name */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Name</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
            placeholder="My AI Assistant"
          />
        </div>

        {/* Voice ID */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Voice ID</h2>
          <input
            type="text"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none"
            placeholder="voice-id-here"
          />
        </div>

        {/* Greeting Message */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Greeting Message</h2>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none resize-none"
            rows={2}
            placeholder="Hello! Thanks for calling..."
          />
        </div>

        {/* System Prompt */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">System Prompt</h2>
          <p className="text-gray-500 text-sm mb-3">
            Instructions for the AI assistant on how to handle calls.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full bg-[#262626] border border-[#303030] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none resize-none"
            rows={6}
            placeholder="You are a helpful AI assistant for a business. Answer customer questions professionally and book appointments when requested..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : isUpdating ? 'Saving...' : assistant ? 'Save Changes' : 'Create Assistant'}
          </button>
        </div>
      </div>
    </div>
  );
}
