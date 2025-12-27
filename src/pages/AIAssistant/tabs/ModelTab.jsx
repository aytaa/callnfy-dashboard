import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function ModelTab({ assistant, onUpdate }) {
  const [formData, setFormData] = useState({
    provider: assistant?.model?.provider || 'openai',
    model: assistant?.model?.model || 'gpt-4',
    firstMessageMode: assistant?.firstMessageMode || 'assistant-speaks-first',
    firstMessage: assistant?.firstMessage || '',
    systemPrompt: assistant?.systemPrompt || '',
    maxTokens: assistant?.model?.maxTokens || 1000,
    temperature: assistant?.model?.temperature || 0.7,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        firstMessage: formData.firstMessage,
        firstMessageMode: formData.firstMessageMode,
        systemPrompt: formData.systemPrompt,
        model: {
          provider: formData.provider,
          model: formData.model,
          maxTokens: formData.maxTokens,
          temperature: formData.temperature,
        },
      });
    }
  };

  const handleGeneratePrompt = () => {
    // TODO: Implement AI prompt generation
    console.log('Generate prompt clicked');
  };

  return (
    <div className="space-y-4">
      {/* Cost & Latency Display */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-400 mb-1">Estimated Cost</p>
            <p className="text-sm text-white font-medium">~$0.11/min</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-1">Latency</p>
            <p className="text-sm text-white font-medium">~1200ms</p>
          </div>
        </div>
      </div>

      {/* Provider & Model */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">Model Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Provider</label>
            <select
              value={formData.provider}
              onChange={(e) => handleChange('provider', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="groq">Groq</option>
              <option value="together-ai">Together AI</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Model</label>
            <select
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              {formData.provider === 'openai' && (
                <>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </>
              )}
              {formData.provider === 'anthropic' && (
                <>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </>
              )}
              {formData.provider === 'google' && (
                <>
                  <option value="gemini-pro">Gemini Pro</option>
                  <option value="gemini-ultra">Gemini Ultra</option>
                </>
              )}
              {formData.provider === 'groq' && (
                <>
                  <option value="llama3-70b">Llama 3 70B</option>
                  <option value="llama3-8b">Llama 3 8B</option>
                  <option value="mixtral-8x7b">Mixtral 8x7B</option>
                </>
              )}
              {formData.provider === 'together-ai' && (
                <>
                  <option value="llama-2-70b">Llama 2 70B</option>
                  <option value="mistral-7b">Mistral 7B</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* First Message */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">First Message</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Mode</label>
            <select
              value={formData.firstMessageMode}
              onChange={(e) => handleChange('firstMessageMode', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            >
              <option value="assistant-speaks-first">Assistant speaks first</option>
              <option value="assistant-waits">Assistant waits for user</option>
              <option value="assistant-speaks-first-with-model-generated-message">
                Assistant speaks first (AI generated)
              </option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Message</label>
            <textarea
              value={formData.firstMessage}
              onChange={(e) => handleChange('firstMessage', e.target.value)}
              onBlur={handleBlur}
              rows={2}
              placeholder="Hello! Thanks for calling. How can I help you today?"
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">System Prompt</h3>
          <button
            onClick={handleGeneratePrompt}
            className="flex items-center gap-1.5 bg-white text-black text-xs font-medium px-3 py-1.5 rounded-md hover:bg-zinc-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate
          </button>
        </div>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => handleChange('systemPrompt', e.target.value)}
          onBlur={handleBlur}
          rows={6}
          placeholder="You are a helpful AI assistant. Your role is to..."
          className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none resize-none"
        />
      </div>

      {/* Advanced Settings */}
      <div className="bg-[#1a1a1d] border border-zinc-800 rounded-md p-3">
        <h3 className="text-sm font-semibold text-white mb-3">Advanced Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Max Tokens</label>
            <input
              type="number"
              value={formData.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              onBlur={handleBlur}
              min="100"
              max="4000"
              className="w-full bg-[#111114] border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:border-zinc-600 focus:outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-zinc-400">Temperature</label>
              <span className="text-xs text-zinc-400">{formData.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              onMouseUp={handleBlur}
              onTouchEnd={handleBlur}
              className="w-full h-1.5 bg-zinc-700 rounded-md appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #71717a 0%, #71717a ${formData.temperature * 100}%, #3f3f46 ${formData.temperature * 100}%, #3f3f46 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
