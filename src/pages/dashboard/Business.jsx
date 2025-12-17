import React, { useState } from 'react';
import { Save, Clock } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

export default function Business() {
  const [businessName, setBusinessName] = useState('My Business');
  const [industry, setIndustry] = useState('consulting');
  const [address, setAddress] = useState('123 Main Street, New York, NY 10001');
  const [timezone, setTimezone] = useState('America/New_York');
  const [workingHours, setWorkingHours] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' },
  });

  const industryOptions = [
    { value: 'consulting', label: 'Consulting' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'finance', label: 'Finance & Accounting' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' },
  ];

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const handleHoursChange = (day, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving business settings:', {
      businessName,
      industry,
      address,
      timezone,
      workingHours,
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 pt-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Business Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your business information and operating hours</p>
        </div>

        {/* Basic Information */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Basic Information</h2>
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
            />
            <Select
              label="Industry"
              options={industryOptions}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <Textarea
              label="Business Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your business address"
              rows={2}
            />
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-white">Working Hours</h2>
          </div>
          <div className="space-y-3">
            {daysOfWeek.map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center gap-4 p-3 bg-[#212121] border border-[#303030] rounded-lg"
              >
                <div className="flex items-center min-w-[120px]">
                  <input
                    type="checkbox"
                    id={`day-${key}`}
                    checked={workingHours[key].enabled}
                    onChange={(e) => handleHoursChange(key, 'enabled', e.target.checked)}
                    className="w-4 h-4 bg-[#212121] border border-[#303030] rounded checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor={`day-${key}`} className="ml-2 text-white font-medium">
                    {label}
                  </label>
                </div>
                {workingHours[key].enabled ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="time"
                      value={workingHours[key].start}
                      onChange={(e) => handleHoursChange(key, 'start', e.target.value)}
                      className="bg-[#212121] border border-[#303030] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3a3a3a]"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={workingHours[key].end}
                      onChange={(e) => handleHoursChange(key, 'end', e.target.value)}
                      className="bg-[#212121] border border-[#303030] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3a3a3a]"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="bg-[#171717] border border-[#303030] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Timezone</h2>
          <Select
            label="Select your timezone"
            options={timezoneOptions}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            This timezone will be used for scheduling appointments and displaying call times
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-black font-medium px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
