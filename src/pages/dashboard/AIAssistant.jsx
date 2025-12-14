import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function AIAssistant() {
  const [greeting, setGreeting] = useState('Hello! Thanks for calling...');
  const [voice, setVoice] = useState('female-sarah');
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('en-uk');
  const [businessDescription, setBusinessDescription] = useState('');
  const [services, setServices] = useState(['Emergency Repair', 'Regular Maintenance', 'Installation']);
  const [newService, setNewService] = useState('');

  const handleAddService = () => {
    if (newService.trim()) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving AI Assistant settings...');
  };

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>

        {/* Greeting Message */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Greeting Message</h2>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none resize-none"
            rows={2}
            placeholder="Hello! Thanks for calling..."
          />
        </div>

        {/* Voice Settings */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Voice Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white opacity-60 mb-2">Voice</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3a3a3a] focus:outline-none"
              >
                <option value="female-sarah">Female - Sarah</option>
                <option value="male-james">Male - James</option>
                <option value="female-emily">Female - Emily</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white opacity-60 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3a3a3a] focus:outline-none"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Language</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#3a3a3a] focus:outline-none"
          >
            <option value="en-uk">English (UK)</option>
            <option value="en-us">English (US)</option>
            <option value="tr">Turkish</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        {/* Business Description */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Business Description</h2>
          <p className="text-gray-500 text-sm mb-3">
            Tell the AI about your business so it can answer questions accurately.
          </p>
          <textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            className="w-full bg-black border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-[#3a3a3a] focus:outline-none resize-none"
            rows={3}
            placeholder="We are a plumbing company based in London..."
          />
        </div>

        {/* Services */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Services</h2>
          <p className="text-gray-500 text-sm mb-3">
            List the services your AI can book appointments for.
          </p>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="flex-1 bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white"
                  value={service}
                  readOnly
                />
                <button
                  onClick={() => handleRemoveService(index)}
                  className="p-2 text-white opacity-60 hover:opacity-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-black border border-[#2a2a2a] rounded-lg px-4 py-2 text-white placeholder:text-gray-600"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="New service name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
              />
              <button
                onClick={handleAddService}
                className="flex items-center gap-1.5 px-3 py-2 text-white opacity-60 hover:opacity-100 text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
