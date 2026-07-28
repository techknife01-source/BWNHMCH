import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { SessionProvider } from './contexts/SessionContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export const App: React.FC = () => {
  React.useEffect(() => {
    document.title = "Burdwan Homeopathic Medical College & Hospital";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SettingsProvider>
          <NotificationProvider>
            <LoadingProvider>
              <AuthProvider>
                <PermissionProvider>
                  <SessionProvider>
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </SessionProvider>
                </PermissionProvider>
              </AuthProvider>
            </LoadingProvider>
          </NotificationProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
