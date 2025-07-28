import { useSettings } from '@/contexts/SettingsContext';

export const useMaintenanceMode = () => {
  const { maintenanceMode, systemName } = useSettings();
  
  return {
    isMaintenanceMode: maintenanceMode,
    systemName,
  };
};