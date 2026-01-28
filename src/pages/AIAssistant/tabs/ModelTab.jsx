import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useGeneratePromptMutation } from '../../../slices/apiSlice/assistantApiSlice';

export default function ModelTab({ assistant, onUpdate }) {
  const [generatePromptApi, { isLoading: isGenerating }] = useGeneratePromptMutation();
  // Use direct API fields
  const model = assistant?.model;

  const [formData, setFormData] = useState({
    provider: model?.provider || 'openai',
    model: model?.model || 'gpt-4o-mini',
    firstMessageMode: assistant?.firstMessageMode || 'assistant-speaks-first',
    greeting: assistant?.greeting || '',
    systemPrompt: assistant?.systemPrompt || '',
    maxTokens: model?.maxTokens || 1000,
    temperature: model?.temperature || 0.7,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    if (onUpdate) {
      onUpdate({
        greeting: formData.greeting,
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

  const handleGeneratePrompt = async () => {
    if (!assistant?.businessId) {
      console.error('No businessId available');
      return;
    }

    try {
      const result = await generatePromptApi({
        businessId: assistant.businessId,
      }).unwrap();

      if (result.prompt) {
        handleChange('systemPrompt', result.prompt);
        // Also trigger save
        if (onUpdate) {
          onUpdate({ systemPrompt: result.prompt });
        }
      }
    } catch (err) {
      console.error('Failed to generate prompt:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Cost & Latency Display */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Cost</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">~$0.11/min</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latency</p>
            <p className="text-sm text-gray-900 dark:text-white font-medium">~1200ms</p>
          </div>
        </div>
      </div>

      {/* Provider & Model */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Model Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Provider</label>
            <select
              value={formData.provider}
              onChange={(e) => handleChange('provider', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="groq">Groq</option>
              <option value="together-ai">Together AI</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Model</label>
            <select
              value={formData.model}
              onChange={(e) => handleChange('model', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            >
              {formData.provider === 'openai' && (
                <>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
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
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">First Message</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Mode</label>
            <select
              value={formData.firstMessageMode}
              onChange={(e) => handleChange('firstMessageMode', e.target.value)}
              onBlur={handleBlur}
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            >
              <option value="assistant-speaks-first">Assistant speaks first</option>
              <option value="assistant-waits">Assistant waits for user</option>
              <option value="assistant-speaks-first-with-model-generated-message">
                Assistant speaks first (AI generated)
              </option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Greeting Message</label>
            <textarea
              value={formData.greeting}
              onChange={(e) => handleChange('greeting', e.target.value)}
              onBlur={handleBlur}
              rows={2}
              placeholder="Hello! Thanks for calling. How can I help you today?"
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Prompt</h3>
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="flex items-center gap-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => handleChange('systemPrompt', e.target.value)}
          onBlur={handleBlur}
          rows={6}
          placeholder="You are a helpful AI assistant. Your role is to..."
          className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none resize-none"
        />
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Advanced Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Max Tokens</label>
            <input
              type="number"
              value={formData.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              onBlur={handleBlur}
              min="100"
              max="4000"
              className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-gray-500 dark:text-gray-400">Temperature</label>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formData.temperature}</span>
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
              className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-md appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${formData.temperature * 100}%, #d1d5db ${formData.temperature * 100}%, #d1d5db 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
