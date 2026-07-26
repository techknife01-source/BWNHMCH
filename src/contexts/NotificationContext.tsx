import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface NotificationContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const success = (msg: string) => toast.success(msg, { id: msg });
  const error = (msg: string) => toast.error(msg, { id: msg });
  const info = (msg: string) => toast(msg, { icon: 'ℹ️', id: msg });

  return (
    <NotificationContext.Provider value={{ success, error, info }}>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
