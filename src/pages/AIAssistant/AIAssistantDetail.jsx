import { useState } from 'react';
import { Phone, MessageSquare, TestTube, Sparkles } from 'lucide-react';
import {
  useGetAssistantQuery,
  useUpdateAssistantMutation,
  useCreateAssistantMutation,
} from '../../slices/apiSlice/assistantApiSlice';
import { useGetBusinessesQuery } from '../../slices/apiSlice/businessApiSlice';
import ModelTab from './tabs/ModelTab';
import VoiceTab from './tabs/VoiceTab';
import CreateAssistantModal from '../../components/CreateAssistantModal';

export default function AIAssistantDetail() {
  const [activeTab, setActiveTab] = useState('model');
  const [updateData, setUpdateData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // API hooks
  const { data: assistantsData, isLoading, isError, error: queryError } = useGetAssistantQuery();
  const { data: businesses } = useGetBusinessesQuery();
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
    // TODO: Implement test functionality
    console.log('Test assistant');
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    console.log('Open chat');
  };

  const handleTalk = () => {
    // TODO: Implement talk functionality
    console.log('Talk to assistant');
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
        <div className="max-w-5xl mx-auto">
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-md">
            <p className="text-sm text-red-400">
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
        <div className="px-8 py-6">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-md mb-6">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-md mb-6">
                <p className="text-sm text-green-400">{successMessage}</p>
              </div>
            )}

            <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#111114] rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No AI Assistant Yet</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-md">
                  Create an AI assistant to handle your calls intelligently. Configure its voice, behavior, and conversation style.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black font-medium px-6 py-2.5 text-sm rounded-md hover:bg-zinc-200 transition-colors"
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

  return (
    <div className="px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-white">AI Receptionist</h1>
              <p className="text-xs text-zinc-400 mt-0.5">{assistant.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTest}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                Test
              </button>
              <button
                onClick={handleChat}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={handleTalk}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-zinc-200 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Talk to Assistant
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('model')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'model'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              Model
              {activeTab === 'model' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === 'voice'
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-zinc-300'
              }`}
            >
              Voice
              {activeTab === 'voice' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'model' && (
            <ModelTab assistant={assistant} onUpdate={handleUpdate} />
          )}
          {activeTab === 'voice' && (
            <VoiceTab assistant={assistant} onUpdate={handleUpdate} />
          )}
        </div>

        {/* Update Indicator */}
        {isUpdating && (
          <div className="fixed bottom-4 right-4 bg-[#1a1a1d] border border-zinc-700 rounded-md px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm text-white">Saving changes...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
