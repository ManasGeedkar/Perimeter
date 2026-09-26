import React, { ReactNode } from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../i18n';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
