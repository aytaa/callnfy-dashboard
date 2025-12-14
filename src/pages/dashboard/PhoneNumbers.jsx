import React, { useState } from 'react';
import { Phone, Save, Plus } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toggle from '../../components/Toggle';
import Badge from '../../components/Badge';

export default function PhoneNumbers() {
  const [currentNumber, setCurrentNumber] = useState('+1 (555) 123-4567');
  const [forwardTo, setForwardTo] = useState('+1 (555) 987-6543');
  const [callRecording, setCallRecording] = useState(true);
  const [voicemailEnabled, setVoicemailEnabled] = useState(true);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);

  const handleSave = () => {
    console.log('Saving phone settings:', {
      currentNumber,
      forwardTo,
      callRecording,
      voicemailEnabled,
      transcriptionEnabled,
    });
    alert('Settings saved successfully!');
  };

  const handleGetNewNumber = () => {
    alert('Get new number feature coming soon!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Phone Numbers</h1>
        <p className="text-gray-400 mt-1">Manage your phone numbers and call settings</p>
      </div>

      {/* Current Number */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Current Number</h2>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-white">{currentNumber}</span>
            </div>
          </div>
          <Badge variant="green">Active</Badge>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-white font-medium">Active</p>
            </div>
            <div>
              <p className="text-gray-400">Type</p>
              <p className="text-white font-medium">AI-Powered</p>
            </div>
            <div>
              <p className="text-gray-400">Monthly Cost</p>
              <p className="text-white font-medium">$15/month</p>
            </div>
            <div>
              <p className="text-gray-400">Activated</p>
              <p className="text-white font-medium">Nov 1, 2025</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Call Forwarding */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Call Forwarding</h2>
        <Input
          label="Forward calls to"
          type="tel"
          value={forwardTo}
          onChange={(e) => setForwardTo(e.target.value)}
          placeholder="+1 (555) 000-0000"
        />
        <p className="text-sm text-gray-500 mt-2">
          When AI cannot handle a call, it will be forwarded to this number
        </p>
      </Card>

      {/* Call Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Call Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <h3 className="text-white font-medium">Call Recording</h3>
              <p className="text-sm text-gray-400">Record all incoming calls for quality and training</p>
            </div>
            <Toggle
              checked={callRecording}
              onChange={setCallRecording}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <h3 className="text-white font-medium">Voicemail</h3>
              <p className="text-sm text-gray-400">Enable voicemail for missed or declined calls</p>
            </div>
            <Toggle
              checked={voicemailEnabled}
              onChange={setVoicemailEnabled}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="text-white font-medium">Call Transcription</h3>
              <p className="text-sm text-gray-400">Automatically transcribe all call recordings</p>
            </div>
            <Toggle
              checked={transcriptionEnabled}
              onChange={setTranscriptionEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Get New Number */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-2">Need Another Number?</h2>
        <p className="text-gray-400 mb-4">
          Add additional phone numbers to your account for different departments or locations.
        </p>
        <Button variant="outline" onClick={handleGetNewNumber}>
          <Plus className="w-4 h-4 mr-2" />
          Get New Number
        </Button>
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
