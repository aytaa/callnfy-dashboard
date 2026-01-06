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
        'p-2 hover:opacity-70 transition-opacity focus:outline-none',
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
