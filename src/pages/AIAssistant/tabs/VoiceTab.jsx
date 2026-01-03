import { useState } from 'react';

export default function VoiceTab({ assistant, onUpdate }) {
  // Use Vapi data as source of truth, fallback to local data
  const vapiVoice = assistant?.vapiVoice || assistant?.voice;

  const [formData, setFormData] = useState({
    provider: vapiVoice?.provider || 'elevenlabs',
    voiceId: vapiVoice?.voiceId || vapiVoice?.voice || '',
    speed: vapiVoice?.speed || 1.0,
    pitch: vapiVoice?.pitch || 1.0,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        voice: {
          provider: formData.provider,
          voiceId: formData.voiceId,
          speed: formData.speed,
          pitch: formData.pitch,
        },
      });
    }
  };

  // Voice options based on provider
  const getVoiceOptions = () => {
    switch (formData.provider) {
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

  return (
    <div className="space-y-4">
      {/* Voice Provider */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">Voice Provider</h3>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Provider</label>
          <select
            value={formData.provider}
            onChange={(e) => {
              handleChange('provider', e.target.value);
              handleChange('voiceId', ''); // Reset voice when provider changes
            }}
            onBlur={handleBlur}
            className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
          >
            <option value="elevenlabs">ElevenLabs</option>
            <option value="playht">PlayHT</option>
            <option value="azure">Azure</option>
            <option value="openai">OpenAI</option>
            <option value="deepgram">Deepgram</option>
            <option value="cartesia">Cartesia</option>
            <option value="rime-ai">Rime AI</option>
            <option value="lmnt">LMNT</option>
          </select>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">Voice Selection</h3>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Voice</label>
          {getVoiceOptions().length > 0 ? (
            <select
              value={formData.voiceId}
              onChange={(e) => handleChange('voiceId', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="">Select a voice</option>
              {getVoiceOptions().map((voice) => (
                <option key={voice.value} value={voice.value}>
                  {voice.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.voiceId}
              onChange={(e) => handleChange('voiceId', e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter voice ID"
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Voice Settings */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">Voice Settings</h3>
        <div className="space-y-4">
          {/* Speed Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-zinc-400">Speed</label>
              <span className="text-xs text-zinc-400">{formData.speed.toFixed(1)}x</span>
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
              className="w-full h-1.5 bg-zinc-700 rounded-md appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #71717a 0%, #71717a ${((formData.speed - 0.5) / 1.5) * 100}%, #3f3f46 ${((formData.speed - 0.5) / 1.5) * 100}%, #3f3f46 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">0.5x</span>
              <span className="text-xs text-zinc-500">2.0x</span>
            </div>
          </div>

          {/* Pitch Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-zinc-400">Pitch</label>
              <span className="text-xs text-zinc-400">{formData.pitch.toFixed(1)}x</span>
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
              className="w-full h-1.5 bg-zinc-700 rounded-md appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #71717a 0%, #71717a ${((formData.pitch - 0.5) / 1.5) * 100}%, #3f3f46 ${((formData.pitch - 0.5) / 1.5) * 100}%, #3f3f46 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-zinc-500">0.5x</span>
              <span className="text-xs text-zinc-500">2.0x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
