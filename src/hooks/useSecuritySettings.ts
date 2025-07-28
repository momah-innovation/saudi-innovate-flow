import { useSettings } from '@/contexts/SettingsContext';

export const useSecuritySettings = () => {
  const { 
    sessionTimeout,
    maxLoginAttempts,
    enableDataEncryption,
    enableAccessLogs,
    passwordPolicy,
    dataRetentionPolicy,
    passwordMinLength
  } = useSettings();
  
  return {
    session: {
      timeout: sessionTimeout,
      maxLoginAttempts,
    },
    password: {
      minLength: passwordMinLength,
      policy: passwordPolicy,
    },
    data: {
      enableEncryption: enableDataEncryption,
      enableAccessLogs,
      retentionPolicy: dataRetentionPolicy,
    }
  };
};