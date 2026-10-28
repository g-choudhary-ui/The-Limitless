import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AppContextType {
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  apiStatus: { status: string; api_key_configured: boolean; mode: string } | null;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  activeStage: number;
  setActiveStage: (stage: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [apiStatus, setApiStatus] = useState<{ status: string; api_key_configured: boolean; mode: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [activeStage, setActiveStage] = useState<number>(1);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('limitless_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('limitless_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile();
      if (data && data.name) {
        setProfile(data);
        setActiveStage(data.current_cycle_stage || 1);
      }
    } catch (err) {
      console.warn('Could not load profile from backend:', err);
    }
  };

  useEffect(() => {
    refreshProfile();
    api.getHealth()
      .then(res => setApiStatus(res))
      .catch(() => setApiStatus({ status: 'offline', api_key_configured: false, mode: 'deterministic_demo' }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        refreshProfile,
        theme,
        toggleTheme,
        apiStatus,
        toast,
        showToast,
        activeStage,
        setActiveStage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
