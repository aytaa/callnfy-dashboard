import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useGeneratePromptMutation } from '../../../slices/apiSlice/assistantApiSlice';

export default function ModelTab({ assistant, onUpdate }) {
  const [generatePromptApi, { isLoading: isGenerating }] = useGeneratePromptMutation();
  const [greeting, setGreeting] = useState(assistant?.greeting || '');

  const handleGreetingBlur = () => {
    if (onUpdate) {
      onUpdate({ greeting });
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

      const prompt = result?.data?.prompt || result?.prompt;

      if (prompt) {
        if (onUpdate) {
          onUpdate({ systemPrompt: prompt });
        }
      } else {
        console.error('No prompt in response:', result);
      }
    } catch (err) {
      console.error('Failed to generate prompt:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Optimized Banner */}
      <div className="bg-gray-900/5 dark:bg-white/5 border border-gray-200 dark:border-[#303030] rounded-md p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          All settings are optimized for the best call quality. Want custom settings? Contact support.
        </p>
      </div>

      {/* First Message */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">First Message</h3>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Greeting Message</label>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            onBlur={handleGreetingBlur}
            rows={2}
            placeholder="Hello! Thanks for calling. How can I help you today?"
            className="w-full bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Model Configuration (disabled) */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Model Configuration</h3>
        <div className="space-y-3 opacity-60">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Provider</label>
            <input
              type="text"
              value="OpenAI"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optimized for speed & quality</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Model</label>
            <input
              type="text"
              value="GPT-4o Mini"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Temperature</label>
            <input
              type="text"
              value="0.7"
              disabled
              className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Optimized for natural conversation</p>
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
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
        </div>
        <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3 mb-3">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            We've crafted the perfect prompt for your AI receptionist. It handles angry customers, books appointments, and sounds natural.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">Your prompt handles:</p>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Professional call answering & greetings</li>
            <li>Appointment booking, rescheduling & cancellations</li>
            <li>Business info (hours, services, location)</li>
            <li>Difficult callers & de-escalation</li>
            <li>Message taking & callback requests</li>
          </ul>
        </div>
        {assistant?.systemPrompt && (
          <details className="mt-3">
            <summary className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
              View current prompt
            </summary>
            <div className="bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md p-3 mt-2">
              <pre className="text-xs text-gray-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                {assistant.systemPrompt}
              </pre>
            </div>
          </details>
        )}
      </div>

      {/* Transcriber (disabled) */}
      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-md p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Transcriber</h3>
        <div className="opacity-60">
          <input
            type="text"
            value="Deepgram Nova-2"
            disabled
            className="w-full bg-gray-50 dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-3 py-2 text-sm text-gray-900 dark:text-white cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Industry-leading accuracy</p>
        </div>
      </div>
    </div>
  );
}
