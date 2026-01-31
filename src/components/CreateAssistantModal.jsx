import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const VOICE_OPTIONS = [
  { value: 'rachel', label: 'Rachel (Female)' },
  { value: 'bella', label: 'Bella (Female)' },
  { value: 'adam', label: 'Adam (Male)' },
  { value: 'josh', label: 'Josh (Male)' },
];

export default function CreateAssistantModal({ isOpen, onClose, onCreate, isCreating, businessName }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Form state - only user-controllable fields
  const [name, setName] = useState('AI Receptionist');
  const [firstMessage, setFirstMessage] = useState('Hello! Thanks for calling. How can I help you today?');
  const [voiceId, setVoiceId] = useState('rachel');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setErrors({});
      setName('AI Receptionist');
      setFirstMessage('Hello! Thanks for calling. How can I help you today?');
      setVoiceId('rachel');
    }
  }, [isOpen, businessName]);

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
      if (!voiceId) {
        newErrors.voiceId = 'Voice selection is required';
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
        voice: {
          provider: 'elevenlabs',
          voiceId: voiceId,
        },
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
        },
      };
      onCreate(payload);
    }
  };

  if (!isOpen) return null;

  const totalSteps = 2;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create AI Assistant</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Step {currentStep} of {totalSteps}</p>
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
          {[1, 2].map((step) => (
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
                  Voice <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  value={voiceId}
                  onChange={(e) => setVoiceId(e.target.value)}
                  className={`w-full bg-white dark:bg-zinc-800 border ${
                    errors.voiceId ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'
                  } rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-zinc-600 focus:outline-none`}
                >
                  {VOICE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.voiceId && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.voiceId}</p>}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  <strong className="text-gray-700 dark:text-zinc-300">Powered by ElevenLabs</strong> — All other settings
                  (model, transcriber, prompt) are automatically optimized for the best call quality.
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
            {currentStep < totalSteps ? (
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
