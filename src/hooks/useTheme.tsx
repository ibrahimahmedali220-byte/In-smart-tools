import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, getStoredTheme, getEffectiveTheme, setStoredTheme, initializeTheme } from '../utils/theme/themeManager';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => getEffectiveTheme(getStoredTheme()));

  useEffect(() => {
    const cleanup = initializeTheme();

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      const newTheme = customEvent.detail?.theme || getStoredTheme();
      setThemeState(newTheme);
      setEffectiveTheme(getEffectiveTheme(newTheme));
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (getStoredTheme() === 'system') {
        setEffectiveTheme(getEffectiveTheme('system'));
      }
    };

    window.addEventListener('ist_theme_changed', handleThemeChange);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      cleanup();
      window.removeEventListener('ist_theme_changed', handleThemeChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setStoredTheme(mode);
    setThemeState(mode);
    setEffectiveTheme(getEffectiveTheme(mode));
  };

  const toggleTheme = () => {
    // Cycles light -> dark -> system -> light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
