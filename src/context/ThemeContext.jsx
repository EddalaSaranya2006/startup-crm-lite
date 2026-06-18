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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  /**
   * Toggles dark mode on and off.
   *
   * @returns {void}
   */
  const toggleTheme = useCallback(() => {
    setIsDarkMode((currentValue) => !currentValue);
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
