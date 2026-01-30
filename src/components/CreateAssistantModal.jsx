import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Voice options for each provider
const VOICE_OPTIONS = {
  vapi: [
    { value: 'jennifer-playht', label: 'Jennifer (Female, US)' },
    { value: 'melissa-playht', label: 'Melissa (Female, US)' },
    { value: 'will-playht', label: 'Will (Male, US)' },
    { value: 'chris-playht', label: 'Chris (Male, US)' },
  ],
  azure: [
    { value: 'en-US-JennyNeural', label: 'Jenny (Female, US)' },
    { value: 'en-US-GuyNeural', label: 'Guy (Male, US)' },
    { value: 'en-GB-SoniaNeural', label: 'Sonia (Female, UK)' },
    { value: 'en-GB-RyanNeural', label: 'Ryan (Male, UK)' },
  ],
  elevenlabs: [
    { value: 'rachel', label: 'Rachel (Female)' },
    { value: 'domi', label: 'Domi (Female)' },
    { value: 'bella', label: 'Bella (Female)' },
    { value: 'elli', label: 'Elli (Female)' },
    { value: 'antoni', label: 'Antoni (Male)' },
    { value: 'josh', label: 'Josh (Male)' },
    { value: 'arnold', label: 'Arnold (Male)' },
    { value: 'adam', label: 'Adam (Male)' },
    { value: 'sam', label: 'Sam (Male)' },
  ],
  openai: [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' },
  ],
};

// Model options for each provider
const MODEL_OPTIONS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o (Recommended)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Faster, cheaper)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet (Recommended)' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Faster)' },
  ],
  google: [
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
  ],
};

export default function CreateAssistantModal({ isOpen, onClose, onCreate, isCreating, businessName }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form state
  const [name, setName] = useState('AI Receptionist');
  const [firstMessage, setFirstMessage] = useState('Hello! Thanks for calling. How can I help you today?');
  const [voiceProvider, setVoiceProvider] = useState('vapi');
  const [voiceId, setVoiceId] = useState('jennifer-playht');
  const [llmProvider, setLlmProvider] = useState('openai');
  const [llmModel, setLlmModel] = useState('gpt-4o-mini');
  const [systemPrompt, setSystemPrompt] = useState(
    `You are a helpful AI receptionist for ${businessName || '{business_name}'}.
Answer calls professionally, help with inquiries,
and book appointments when requested.
Be friendly, concise, and helpful.`
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setName('AI Receptionist');
      setFirstMessage('Hello! Thanks for calling. How can I help you today?');
      setVoiceProvider('vapi');
      setVoiceId('jennifer-playht');
      setLlmProvider('openai');
      setLlmModel('gpt-4o-mini');
      setSystemPrompt(
        `You are a helpful AI receptionist for ${businessName || '{business_name}'}.
Answer calls professionally, help with inquiries,
and book appointments when requested.
Be friendly, concise, and helpful.`
      );
    }
  }, [isOpen, businessName]);

  // Update voiceId when provider changes
  useEffect(() => {
    if (voiceProvider === 'vapi') {
      setVoiceId('jennifer-playht');
    } else if (voiceProvider === 'azure') {
      setVoiceId('en-US-JennyNeural');
    } else if (voiceProvider === 'openai') {
      setVoiceId('alloy');
    } else if (voiceProvider === 'elevenlabs') {
      setVoiceId('rachel');
    }
  }, [voiceProvider]);

  // Update model when provider changes
  useEffect(() => {
    if (llmProvider === 'openai') {
      setLlmModel('gpt-4o-mini');
    } else if (llmProvider === 'anthropic') {
      setLlmModel('claude-3-5-sonnet');
    } else if (llmProvider === 'google') {
      setLlmModel('gemini-1.5-pro');
    }
  }, [llmProvider]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = 'Assistant name is required';
      }
      if (!firstMessage.trim()) {
        newErrors.firstMessage = 'First message is required';
      }
    }

    if (step === 2) {
      if (!voiceProvider) {
        newErrors.voiceProvider = 'Voice provider is required';
      }
      if (!voiceId) {
        newErrors.voiceId = 'Voice selection is required';
      }
    }

    if (step === 3) {
      if (!llmProvider) {
        newErrors.llmProvider = 'LLM provider is required';
      }
      if (!llmModel) {
        newErrors.llmModel = 'Model selection is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleCreate = () => {
    if (validateStep(currentStep)) {
      const payload = {
        name: name.trim(),
        firstMessage: firstMessage.trim(),
        systemPrompt: systemPrompt.trim() || `You are a helpful AI receptionist for ${businessName}. Answer calls professionally and assist with inquiries.`,
        voice: {
          provider: voiceProvider,
          voiceId: voiceId,
        },
        model: {
          provider: llmProvider,
          model: llmModel,
        },
      };
      onCreate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create AI Assistant</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Step {currentStep} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 p-6 border-b border-gray-200 dark:border-zinc-800">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === currentStep
                  ? 'bg-gray-900 dark:bg-white'
                  : step < currentStep
                  ? 'bg-gray-400 dark:bg-zinc-600'
                  : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  Assistant Name <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.name ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                  placeholder="AI Receptionist"
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  First Message <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.firstMessage ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none resize-none`}
                  rows={3}
                  placeholder="Hello! Thanks for calling. How can I help you today?"
                />
                {errors.firstMessage && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.firstMessage}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  This is the first thing your assistant will say when answering a call
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Voice Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Voice Selection</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  Choose how your assistant will sound to callers
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  Voice Provider <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  value={voiceProvider}
                  onChange={(e) => setVoiceProvider(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.voiceProvider ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                >
                  <option value="vapi">Vapi (Free - Recommended)</option>
                  <option value="azure">Azure</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI</option>
                </select>
                {errors.voiceProvider && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.voiceProvider}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  Voice <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.voiceId ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                >
                  {VOICE_OPTIONS[voiceProvider]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.voiceId && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.voiceId}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Language Model */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language Model</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  Select the AI model that will power your assistant
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  LLM Provider <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.llmProvider ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                >
                  <option value="openai">OpenAI (Recommended)</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                </select>
                {errors.llmProvider && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.llmProvider}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">
                  Model <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.llmModel ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                >
                  {MODEL_OPTIONS[llmProvider]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.llmModel && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.llmModel}</p>}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  <strong className="text-gray-700 dark:text-zinc-300">Tip:</strong> GPT-4o Mini offers the best
                  balance of speed and quality for most use cases.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: System Prompt */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Prompt</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  Define how your assistant should behave and respond to calls
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-zinc-400 mb-2">Instructions</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none resize-none"
                  rows={10}
                  placeholder="You are a helpful AI receptionist..."
                />
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  These instructions guide your assistant's responses and behavior
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  <strong className="text-gray-700 dark:text-zinc-300">Best practices:</strong> Be specific about
                  your business, mention services you offer, and include instructions for common
                  scenarios like booking appointments or answering FAQs.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            disabled={isCreating}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="px-6 py-2 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Assistant'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
