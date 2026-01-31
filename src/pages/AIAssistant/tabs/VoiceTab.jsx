import { useState } from 'react';

const VOICE_OPTIONS = [
  { value: 'rachel', label: 'Rachel (Female)' },
  { value: 'bella', label: 'Bella (Female)' },
  { value: 'adam', label: 'Adam (Male)' },
  { value: 'josh', label: 'Josh (Male)' },
];

export default function VoiceTab({ assistant, onUpdate }) {
  const [voiceId, setVoiceId] = useState(assistant?.voiceId || 'rachel');
  const [greeting, setGreeting] = useState(assistant?.greeting || '');

  const handleVoiceChange = (value) => {
    setVoiceId(value);
    if (onUpdate) {
      onUpdate({
        voiceProvider: 'elevenlabs',
        voiceId: value,
      });
    }
  };

  const handleGreetingBlur = () => {
    if (onUpdate) {
      onUpdate({ greeting });
    }
  };

  return (
    <div className="space-y-4">
      {/* Voice Selection */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice</h3>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Select Voice</label>
          <select
            value={voiceId}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
          >
            {VOICE_OPTIONS.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* First Message */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">First Message</h3>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Greeting</label>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            onBlur={handleGreetingBlur}
            rows={2}
            placeholder="Hello! Thanks for calling. How can I help you today?"
            className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none resize-none"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            This is the first thing your assistant will say when answering a call
          </p>
        </div>
      </div>

      {/* Optimized Settings Info */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice Settings</h3>
        <div className="space-y-3 opacity-60">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Provider</label>
            <input
              type="text"
              value="ElevenLabs"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optimized for best results</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Stability</label>
            <input
              type="text"
              value="0.5"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optimized for best results</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Similarity Boost</label>
            <input
              type="text"
              value="0.75"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optimized for best results</p>
          </div>
        </div>
      </div>
    </div>
  );
}
