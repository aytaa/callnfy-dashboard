import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import { Sparkles } from 'lucide-react';

const VOICES = [
  { value: 'male-us', label: 'Male (US)' },
  { value: 'female-us', label: 'Female (US)' },
  { value: 'male-uk', label: 'Male (UK)' },
  { value: 'female-uk', label: 'Female (UK)' },
  { value: 'male-au', label: 'Male (Australian)' },
  { value: 'female-au', label: 'Female (Australian)' }
];

const TONES = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-like'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and approachable'
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational'
  }
];

export function AISettings({ data, onNext, onBack }) {
  const [formData, setFormData] = useState({
    greetingMessage: data?.greetingMessage || '',
    voice: data?.voice || '',
    tone: data?.tone || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.greetingMessage.trim()) {
      newErrors.greetingMessage = 'Greeting message is required';
    } else if (formData.greetingMessage.trim().length < 10) {
      newErrors.greetingMessage = 'Greeting message should be at least 10 characters';
    }

    if (!formData.voice) {
      newErrors.voice = 'Please select a voice';
    }

    if (!formData.tone) {
      newErrors.tone = 'Please select a tone';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Settings</h2>
            <p className="text-gray-400 text-sm mt-1">
              Customize your AI assistant's personality
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Greeting Message */}
        <Textarea
          label="Greeting Message"
          name="greetingMessage"
          value={formData.greetingMessage}
          onChange={handleChange}
          placeholder="e.g., Hello! Thank you for calling [Your Business]. How can I help you today?"
          rows={4}
          error={errors.greetingMessage}
          required
        />

        {/* Voice Selection */}
        <Select
          label="AI Voice"
          name="voice"
          value={formData.voice}
          onChange={handleChange}
          options={VOICES}
          placeholder="Select a voice"
          error={errors.voice}
          required
        />

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Conversation Tone <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {TONES.map((tone) => (
              <label
                key={tone.value}
                className={`
                  flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    formData.tone === tone.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }
                `}
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone.value}
                  checked={formData.tone === tone.value}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                />
                <div className="ml-3">
                  <div className="text-white font-medium">{tone.label}</div>
                  <div className="text-gray-400 text-sm">{tone.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.tone && <p className="mt-2 text-sm text-red-500">{errors.tone}</p>}
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-sm font-medium text-gray-300 mb-2">Preview</div>
          <div className="text-gray-400 text-sm italic">
            {formData.greetingMessage || 'Your greeting message will appear here...'}
          </div>
          {formData.voice && (
            <div className="mt-2 text-xs text-gray-500">
              Voice: {VOICES.find(v => v.value === formData.voice)?.label}
            </div>
          )}
          {formData.tone && (
            <div className="text-xs text-gray-500">
              Tone: {TONES.find(t => t.value === formData.tone)?.label}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
