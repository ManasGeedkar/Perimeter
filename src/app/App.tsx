import React, { useEffect } from 'react';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';

export function App() {
  useEffect(() => {
    document.title = 'PERIMETER | Legal Metrology Verification';
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App;
