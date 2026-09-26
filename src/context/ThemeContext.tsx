import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Purge any stale theme keys from storage
    try {
      localStorage.removeItem('lmv_theme');
      localStorage.removeItem('lmv_theme_v2');
      localStorage.removeItem('theme');
      sessionStorage.removeItem('lmv_theme');
      sessionStorage.removeItem('lmv_theme_v2');
    } catch {
      // ignore storage access errors
    }

    // Strictly enforce cream light theme on root elements
    const enforceCream = () => {
      const root = document.documentElement;
      if (root.classList.contains('dark')) {
        root.classList.remove('dark');
      }
      root.setAttribute('data-theme', 'cream');
      if (document.body && document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
      }
    };

    enforceCream();

    // Guard against any external scripts or browser quirks attempting to re-inject 'dark'
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          document.documentElement.classList.contains('dark')
        ) {
          document.documentElement.classList.remove('dark');
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Permanent Warm Cream Theme: isDarkMode is always false
  const isDarkMode = false;
  const toggleDarkMode = () => {
    // Permanent cream theme cannot be switched to dark
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
