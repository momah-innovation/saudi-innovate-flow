import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SystemSettingsContextType {
  uiInitialsMaxLength: number;
  notificationFetchLimit: number;
  passwordMinLength: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
};

interface SystemSettingsProviderProps {
  children: ReactNode;
}

export const SystemSettingsProvider: React.FC<SystemSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState({
    uiInitialsMaxLength: 2,
    notificationFetchLimit: 50,
    passwordMinLength: 6,
    loading: true,
    error: null as string | null,
  });

  const fetchSettings = async () => {
    try {
      setSettings(prev => ({ ...prev, loading: true, error: null }));
      
      // Use React Query cache if available, fallback to direct query
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['ui_initials_max_length', 'notification_fetch_limit', 'password_min_length']);
      
      if (error) throw error;
      
      let uiInitialsMaxLength = 2;
      let notificationFetchLimit = 50;
      let passwordMinLength = 6;
      
      if (data) {
        data.forEach(setting => {
          let value: number;
          
          if (typeof setting.setting_value === 'string') {
            value = parseInt(setting.setting_value);
          } else if (typeof setting.setting_value === 'number') {
            value = setting.setting_value;
          } else {
            // For any other type, use default values
            value = 0;
          }
            
          switch (setting.setting_key) {
            case 'ui_initials_max_length':
              uiInitialsMaxLength = value || 2;
              break;
            case 'notification_fetch_limit':
              notificationFetchLimit = value || 50;
              break;
            case 'password_min_length':
              passwordMinLength = value || 6;
              break;
          }
        });
      }
      
      setSettings({
        uiInitialsMaxLength,
        notificationFetchLimit,
        passwordMinLength,
        loading: false,
        error: null,
      });
    } catch (error) {
      logger.error('Error loading system settings', { component: 'SystemSettingsContext', action: 'fetchSettings' }, error as Error);
      setSettings(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load system settings',
      }));
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refetch = async () => {
    await fetchSettings();
  };

  const value = {
    ...settings,
    refetch,
  };

  return (
    <SystemSettingsContext.Provider value={value}>
      {children}
    </SystemSettingsContext.Provider>
  );
};

// Utility function for getting initials
export const getInitials = (name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
};