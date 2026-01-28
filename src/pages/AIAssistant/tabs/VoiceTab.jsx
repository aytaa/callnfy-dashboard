import { useState } from 'react';

export default function VoiceTab({ assistant, onUpdate }) {
  // Use direct API fields (voiceProvider and voiceId are flat)
  const [formData, setFormData] = useState({
    voiceProvider: assistant?.voiceProvider || 'azure',
    voiceId: assistant?.voiceId || '',
    speed: 1.0,
    pitch: 1.0,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        voiceProvider: formData.voiceProvider,
        voiceId: formData.voiceId,
        // Note: voiceSpeed and voicePitch may need backend support
        // These are passed to Vapi voice config if supported
        voiceSpeed: formData.speed,
        voicePitch: formData.pitch,
      });
    }
  };

  // Voice options based on provider
  const getVoiceOptions = () => {
    switch (formData.voiceProvider) {
      case 'elevenlabs':
        return [
          { value: 'rachel', label: 'Rachel' },
          { value: 'domi', label: 'Domi' },
          { value: 'bella', label: 'Bella' },
          { value: 'antoni', label: 'Antoni' },
          { value: 'elli', label: 'Elli' },
          { value: 'josh', label: 'Josh' },
          { value: 'arnold', label: 'Arnold' },
          { value: 'adam', label: 'Adam' },
          { value: 'sam', label: 'Sam' },
        ];
      case 'playht':
        return [
          { value: 'larry', label: 'Larry' },
          { value: 'jennifer', label: 'Jennifer' },
          { value: 'melissa', label: 'Melissa' },
          { value: 'will', label: 'Will' },
          { value: 'chris', label: 'Chris' },
        ];
      case 'azure':
        return [
          { value: 'en-US-AriaNeural', label: 'Aria (US)' },
          { value: 'en-US-GuyNeural', label: 'Guy (US)' },
          { value: 'en-US-JennyNeural', label: 'Jenny (US)' },
          { value: 'en-GB-SoniaNeural', label: 'Sonia (UK)' },
          { value: 'en-GB-RyanNeural', label: 'Ryan (UK)' },
        ];
      case 'openai':
        return [
          { value: 'alloy', label: 'Alloy' },
          { value: 'echo', label: 'Echo' },
          { value: 'fable', label: 'Fable' },
          { value: 'onyx', label: 'Onyx' },
          { value: 'nova', label: 'Nova' },
          { value: 'shimmer', label: 'Shimmer' },
        ];
      case 'deepgram':
        return [
          { value: 'aura-asteria-en', label: 'Asteria' },
          { value: 'aura-luna-en', label: 'Luna' },
          { value: 'aura-stella-en', label: 'Stella' },
          { value: 'aura-athena-en', label: 'Athena' },
          { value: 'aura-hera-en', label: 'Hera' },
        ];
      default:
        return [];
    }
  };

  // Check if current voiceId is in the options list
  const voiceOptions = getVoiceOptions();
  const isCustomVoice = formData.voiceId && !voiceOptions.find(v => v.value === formData.voiceId);

  return (
    <div className="space-y-4">
      {/* Current Voice Display */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Provider</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium capitalize">
              {assistant?.voiceProvider || 'Not set'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Voice</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {assistant?.voiceId || 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Voice Provider */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice Provider</h3>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Provider</label>
          <select
            value={formData.voiceProvider}
            onChange={(e) => {
              handleChange('voiceProvider', e.target.value);
              handleChange('voiceId', ''); // Reset voice when provider changes
            }}
            onBlur={handleBlur}
            className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
          >
            <option value="azure">Azure</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="playht">PlayHT</option>
            <option value="openai">OpenAI</option>
            <option value="deepgram">Deepgram</option>
            <option value="cartesia">Cartesia</option>
            <option value="rime-ai">Rime AI</option>
            <option value="lmnt">LMNT</option>
          </select>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice Selection</h3>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Voice</label>
          {voiceOptions.length > 0 ? (
            <>
              <select
                value={isCustomVoice ? '' : formData.voiceId}
                onChange={(e) => handleChange('voiceId', e.target.value)}
                onBlur={handleBlur}
                className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
              >
                <option value="">Select a voice</option>
                {voiceOptions.map((voice) => (
                  <option key={voice.value} value={voice.value}>
                    {voice.label}
                  </option>
                ))}
              </select>
              {isCustomVoice && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current custom voice: <span className="font-mono">{formData.voiceId}</span>
                </p>
              )}
            </>
          ) : (
            <input
              type="text"
              value={formData.voiceId}
              onChange={(e) => handleChange('voiceId', e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter voice ID"
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Voice Settings</h3>
        <div className="space-y-4">
          {/* Speed Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-gray-500 dark:text-gray-400">Speed</label>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formData.speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={formData.speed}
              onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
              onMouseUp={handleBlur}
              onTouchEnd={handleBlur}
              className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-md appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${((formData.speed - 0.5) / 1.5) * 100}%, #d1d5db ${((formData.speed - 0.5) / 1.5) * 100}%, #d1d5db 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400 dark:text-zinc-500">0.5x</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500">2.0x</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-gray-500 dark:text-gray-400">Pitch</label>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formData.pitch.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={formData.pitch}
              onChange={(e) => handleChange('pitch', parseFloat(e.target.value))}
              onMouseUp={handleBlur}
              onTouchEnd={handleBlur}
              className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-md appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${((formData.pitch - 0.5) / 1.5) * 100}%, #d1d5db ${((formData.pitch - 0.5) / 1.5) * 100}%, #d1d5db 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400 dark:text-zinc-500">0.5x</span>
              <span className="text-xs text-gray-400 dark:text-zinc-500">2.0x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
