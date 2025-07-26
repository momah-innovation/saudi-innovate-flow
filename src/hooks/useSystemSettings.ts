import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemSettingsHook {
  uiInitialsMaxLength: number;
  loading: boolean;
}

export const useSystemSettings = (): SystemSettingsHook => {
  const [settings, setSettings] = useState({
    uiInitialsMaxLength: 2,
    loading: true
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['ui_initials_max_length']);
        
        if (data) {
          let uiInitialsMaxLength = 2;
          
          data.forEach(setting => {
            const value = typeof setting.setting_value === 'string' 
              ? JSON.parse(setting.setting_value) 
              : setting.setting_value;
              
            if (setting.setting_key === 'ui_initials_max_length') {
              uiInitialsMaxLength = parseInt(value) || 2;
            }
          });
          
          setSettings({
            uiInitialsMaxLength,
            loading: false
          });
        } else {
          setSettings(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error loading system settings:', error);
        setSettings(prev => ({ ...prev, loading: false }));
      }
    };

    loadSettings();
  }, []);

  return settings;
};

export const getInitials = (name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
};