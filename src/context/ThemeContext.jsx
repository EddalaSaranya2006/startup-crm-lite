/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(undefined);

/**
 * Provides application theme state and applies the root dark class.
 *
 * @param {Object} props - Provider props.
 * @param {React.ReactNode} props.children - Child tree.
 * @returns {React.ReactElement} Theme context provider.
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('startup-crm-lite:theme');
      if (savedTheme) {
        return JSON.parse(savedTheme) === 'dark';
      }
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('startup-crm-lite:theme', JSON.stringify(isDarkMode ? 'dark' : 'light'));
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Reads the theme context.
 *
 * @returns {{isDarkMode: boolean, toggleTheme: Function}} Theme context value.
 * @throws {Error} When used outside ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }

  return context;
};
