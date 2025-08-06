import { useSettings } from '@/contexts/SettingsContext';

export const useSecuritySettings = () => {
  const { 
    session_timeout,
    max_login_attempts,
    enable_data_encryption,
    enable_access_logs,
    password_policy,
    data_retention_policy,
    password_min_length
  } = useSettings();
  
  return {
    session: {
      timeout: session_timeout,
      maxLoginAttempts: max_login_attempts,
    },
    password: {
      minLength: password_min_length,
      policy: password_policy,
    },
    data: {
      enableEncryption: enable_data_encryption,
      enableAccessLogs: enable_access_logs,
      retentionPolicy: data_retention_policy,
    }
  };
};