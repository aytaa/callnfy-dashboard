import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';

/**
 * Calendar Component
 *
 * Props:
 * @param {Array} markedDates - Array of date strings (YYYY-MM-DD) to mark with appointments
 * @param {function} onDateClick - Handler when a date is clicked
 * @param {string} selectedDate - Currently selected date (YYYY-MM-DD)
 * @param {string} className - Additional CSS classes
 */
export default function Calendar({
  markedDates = [],
  onDateClick,
  selectedDate,
  className,
  ...props
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDatePart = (num) => String(num).padStart(2, '0');

  const isDateMarked = (day) => {
    const dateString = `${year}-${formatDatePart(month + 1)}-${formatDatePart(day)}`;
    return markedDates.includes(dateString);
  };

  const isDateSelected = (day) => {
    if (\!selectedDate) return false;
    const dateString = `${year}-${formatDatePart(month + 1)}-${formatDatePart(day)}`;
    return selectedDate === dateString;
  };

  const handleDateClick = (day) => {
    const dateString = `${year}-${formatDatePart(month + 1)}-${formatDatePart(day)}`;
    onDateClick?.(dateString);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card className={className} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {monthNames[month]} {year}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={clsx(
                'relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500',
                isDateSelected(day)
                  ? 'bg-teal-500 text-white font-semibold hover:bg-teal-600'
                  : isToday(day)
                  ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium hover:bg-teal-200 dark:hover:bg-teal-900/50'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {day}
              {isDateMarked(day) && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-teal-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full" />
          <span className="text-xs text-gray-600 dark:text-gray-400">Has appointments</span>
        </div>
      </div>
    </Card>
  );
}
