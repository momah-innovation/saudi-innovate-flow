import { useSettings } from '@/contexts/SettingsContext';

export const useMaintenanceMode = () => {
  const { maintenance_mode: maintenanceMode, system_name: systemName } = useSettings();
  
  return {
    isMaintenanceMode: maintenanceMode,
    systemName,
  };
};