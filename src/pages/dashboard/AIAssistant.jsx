import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Input from '../../components/Input';

export default function AIAssistant() {
  const [greeting, setGreeting] = useState('Hello! Thank you for calling. How can I assist you today?');
  const [voice, setVoice] = useState('female-1');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [businessDescription, setBusinessDescription] = useState('We are a professional consulting firm providing expert advice and services to our clients.');
  const [services, setServices] = useState(['Consultation', 'Follow-up Appointment', 'General Inquiry']);
  const [newService, setNewService] = useState('');
  const [minNotice, setMinNotice] = useState('2');
  const [maxPerDay, setMaxPerDay] = useState('10');

  const voiceOptions = [
    { value: 'female-1', label: 'Female Voice 1 (Professional)' },
    { value: 'female-2', label: 'Female Voice 2 (Friendly)' },
    { value: 'male-1', label: 'Male Voice 1 (Professional)' },
    { value: 'male-2', label: 'Male Voice 2 (Warm)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
  ];

  const toneButtons = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
  ];

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving AI Assistant settings:', {
      greeting,
      voice,
      tone,
      language,
      businessDescription,
      services,
      minNotice,
      maxPerDay,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">AI Assistant Settings</h1>
        <p className="text-gray-400 mt-1">Configure your AI assistant's behavior and responses</p>
      </div>

      {/* Greeting Message */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Greeting Message</h2>
        <Textarea
          placeholder="Enter your greeting message..."
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          rows={3}
        />
        <p className="text-sm text-gray-500 mt-2">
          This is the first message callers will hear when they call
        </p>
      </Card>

      {/* Voice & Language */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Voice & Language</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Voice"
            options={voiceOptions}
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </Card>

      {/* Tone */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Conversation Tone</h2>
        <div className="flex gap-3">
          {toneButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => setTone(button.value)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                tone === button.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Business Description */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Business Description</h2>
        <Textarea
          placeholder="Describe your business..."
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-2">
          Help the AI understand your business to provide better responses
        </p>
      </Card>

      {/* Services */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Available Services</h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new service..."
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
            />
            <Button onClick={handleAddService}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg"
              >
                <span className="text-white">{service}</span>
                <button
                  onClick={() => handleRemoveService(index)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Booking Rules */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Booking Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Notice (hours)"
            type="number"
            value={minNotice}
            onChange={(e) => setMinNotice(e.target.value)}
            placeholder="2"
          />
          <Input
            label="Max Appointments per Day"
            type="number"
            value={maxPerDay}
            onChange={(e) => setMaxPerDay(e.target.value)}
            placeholder="10"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Set minimum notice period and daily appointment limits for automatic booking
        </p>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
