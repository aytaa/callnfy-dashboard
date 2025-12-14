import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { clsx } from 'clsx';

/**
 * ThemeToggle Component
 *
 * Toggles between light and dark mode using the useTheme hook
 *
 * Props:
 * @param {string} className - Additional CSS classes
 */
export default function ThemeToggle({ className, ...props }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
        className
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}
