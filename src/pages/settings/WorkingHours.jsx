import { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { useGetBusinessesQuery, useUpdateWorkingHoursMutation } from '../../slices/apiSlice/businessApiSlice';
import toast from 'react-hot-toast';

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_HOURS = {
  monday: { open: '09:00', close: '17:00', closed: false },
  tuesday: { open: '09:00', close: '17:00', closed: false },
  wednesday: { open: '09:00', close: '17:00', closed: false },
  thursday: { open: '09:00', close: '17:00', closed: false },
  friday: { open: '09:00', close: '17:00', closed: false },
  saturday: { open: '10:00', close: '14:00', closed: false },
  sunday: { open: null, close: null, closed: true },
};

const TIME_OPTIONS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h.toString().padStart(2, '0');
    const minute = m.toString().padStart(2, '0');
    TIME_OPTIONS.push(`${hour}:${minute}`);
  }
}

export default function WorkingHours() {
  const { data: businesses, isLoading, error } = useGetBusinessesQuery();
  const [updateWorkingHours, { isLoading: isUpdating }] = useUpdateWorkingHoursMutation();

  const business = Array.isArray(businesses) && businesses.length > 0 ? businesses[0] : null;

  const [hours, setHours] = useState(DEFAULT_HOURS);

  useEffect(() => {
    if (business?.workingHours && Object.keys(business.workingHours).length > 0) {
      setHours({ ...DEFAULT_HOURS, ...business.workingHours });
    }
  }, [business]);

  const handleToggleClosed = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: !prev[day].closed,
        open: !prev[day].closed ? null : '09:00',
        close: !prev[day].closed ? null : '17:00',
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!business?.id) return;

    try {
      await updateWorkingHours({
        id: business.id,
        workingHours: hours,
      }).unwrap();
      toast.success('Working hours updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update working hours');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-gray-500 dark:text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-zinc-500/10 border border-red-200 dark:border-zinc-500/20 rounded-lg p-3">
        <p className="text-red-600 dark:text-zinc-400 text-sm">Failed to load business</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-500/10 border border-gray-200 dark:border-zinc-500/20 rounded-lg p-3">
        <p className="text-gray-500 dark:text-zinc-400 text-sm">No business found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Working Hours</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set your business operating hours</p>

      <div className="bg-white dark:bg-[#1a1a1d] border border-gray-200 dark:border-[#303030] rounded-lg p-3">
        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-[#303030]">
          <div className="w-10 h-10 bg-gray-100 dark:bg-[#111114] rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-900 dark:text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white text-sm font-medium">Business Hours</p>
            <p className="text-gray-500 text-xs">Configure when your business is open</p>
          </div>
        </div>

        <div className="space-y-3">
          {DAYS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-[#262626] last:border-0"
            >
              {/* Day label */}
              <div className="w-24 flex-shrink-0">
                <span className="text-sm text-gray-900 dark:text-white">{label}</span>
              </div>

              {/* Closed toggle */}
              <button
                onClick={() => handleToggleClosed(key)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  hours[key]?.closed
                    ? 'bg-gray-100 dark:bg-[#262626] text-gray-500 dark:text-gray-400'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-black'
                }`}
              >
                {hours[key]?.closed ? 'Closed' : 'Open'}
              </button>

              {/* Time selectors */}
              {!hours[key]?.closed && (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={hours[key]?.open || '09:00'}
                    onChange={(e) => handleTimeChange(key, 'open', e.target.value)}
                    className="bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">to</span>
                  <select
                    value={hours[key]?.close || '17:00'}
                    onChange={(e) => handleTimeChange(key, 'close', e.target.value)}
                    className="bg-white dark:bg-[#111114] border border-gray-200 dark:border-[#303030] rounded-md px-2 py-1.5 text-xs text-gray-900 dark:text-white focus:border-gray-300 dark:focus:border-[#404040] focus:outline-none"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {hours[key]?.closed && (
                <div className="flex-1">
                  <span className="text-xs text-gray-400 dark:text-gray-600">Not available</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-3 pt-3 border-t border-gray-200 dark:border-[#303030]">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
