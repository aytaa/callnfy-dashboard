import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Clock } from 'lucide-react';

const DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

const DEFAULT_HOURS = { open: '09:00', close: '17:00', enabled: true };

export function WorkingHours({ data, onNext, onBack, onSkip }) {
  const [workingHours, setWorkingHours] = useState(
    data?.workingHours || {
      monday: DEFAULT_HOURS,
      tuesday: DEFAULT_HOURS,
      wednesday: DEFAULT_HOURS,
      thursday: DEFAULT_HOURS,
      friday: DEFAULT_HOURS,
      saturday: { open: '09:00', close: '17:00', enabled: false },
      sunday: { open: '09:00', close: '17:00', enabled: false }
    }
  );

  const handleDayToggle = (dayId) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        enabled: !prev[dayId].enabled
      }
    }));
  };

  const handleTimeChange = (dayId, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ workingHours });
  };

  return (
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Working Hours</h2>
            <p className="text-gray-400 text-sm mt-1">
              Set your business hours for AI call handling
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {DAYS.map((day) => (
          <div
            key={day.id}
            className={`
              p-4 rounded-lg border transition-all
              ${
                workingHours[day.id].enabled
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-900 border-gray-800 opacity-60'
              }
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Day Checkbox */}
              <div className="flex-shrink-0 w-32">
                <Checkbox
                  checked={workingHours[day.id].enabled}
                  onChange={() => handleDayToggle(day.id)}
                  label={day.label}
                />
              </div>

              {/* Time Inputs */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Open</label>
                  <input
                    type="time"
                    value={workingHours[day.id].open}
                    onChange={(e) => handleTimeChange(day.id, 'open', e.target.value)}
                    disabled={!workingHours[day.id].enabled}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <span className="text-gray-500 mt-5">-</span>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Close</label>
                  <input
                    type="time"
                    value={workingHours[day.id].close}
                    onChange={(e) => handleTimeChange(day.id, 'close', e.target.value)}
                    disabled={!workingHours[day.id].enabled}
                    className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-3">
            {onSkip && (
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip
              </Button>
            )}
            <Button type="submit" variant="primary" size="lg">
              Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
