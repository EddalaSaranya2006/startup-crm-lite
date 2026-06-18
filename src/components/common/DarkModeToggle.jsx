import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}
      `}
      aria-label="Toggle Dark Mode"
      title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
    >
      <div
        className={`
          absolute left-1 top-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 flex items-center justify-center
          ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          <Moon className="w-3 h-3 text-blue-600" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" />
        )}
      </div>
      
      {/* Hidden text for screen readers */}
      <span className="sr-only">Toggle dark mode</span>
    </button>
  );
};

export default DarkModeToggle;
