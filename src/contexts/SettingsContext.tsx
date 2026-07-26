import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreference, NotificationChannel } from '../modules/core/types/core.types';

interface SettingsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  preferences: UserPreference;
  updatePreferences: (prefs: Partial<UserPreference>) => void;
}

const DEFAULT_PREFERENCES: UserPreference = {
  theme: 'light',
  language: 'en',
  timezone: 'Asia/Kolkata',
  notificationPreferences: [
    {
      channel: NotificationChannel.EMAIL,
      enabled: true,
      academicAlerts: true,
      opdScheduleAlerts: true,
      examDutyAlerts: true,
      systemAnnouncements: true,
    },
    {
      channel: NotificationChannel.IN_APP,
      enabled: true,
      academicAlerts: true,
      opdScheduleAlerts: true,
      examDutyAlerts: true,
      systemAnnouncements: true,
    },
  ],
  compactView: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferencesState] = useState<UserPreference>(() => {
    const saved = localStorage.getItem('bhmch_user_preferences');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const [language, setLanguageState] = useState<string>(() => preferences.language || 'en');

  useEffect(() => {
    localStorage.setItem('bhmch_user_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setPreferencesState((prev) => ({ ...prev, language: lang }));
  };

  const updatePreferences = (newPrefs: Partial<UserPreference>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...newPrefs };
      if (newPrefs.language) setLanguageState(newPrefs.language);
      return updated;
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        language,
        setLanguage,
        preferences,
        updatePreferences,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
