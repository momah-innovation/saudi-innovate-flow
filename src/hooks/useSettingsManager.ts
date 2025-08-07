import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from './useUnifiedTranslation';
import { useTranslation } from './useAppTranslation';
import { useToast } from './use-toast';

export interface SettingsManagerProps {
  settingKey: string;
  category: string;
  dataType: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: any;
  isShared?: boolean;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
}

export const useSettingsManager = () => {
  const { getTranslation } = useUnifiedTranslation();
  const { language, isRTL } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all settings with translations
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['all-system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_category', { ascending: true })
        .order('setting_key', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch shared setting concepts
  const { data: sharedConcepts = [] } = useQuery({
    queryKey: ['shared-setting-concepts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_setting_concepts')
        .select('*')
        .order('concept_name');

      if (error) throw error;
      return data;
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, category, dataType }: {
      key: string;
      value: any;
      category: string;
      dataType: string;
    }) => {
      let processedValue = value;
      
      // Process value based on data type
      if (dataType === 'array' || dataType === 'object') {
        processedValue = JSON.stringify(value);
      } else if (dataType === 'boolean') {
        processedValue = value.toString();
      } else if (dataType === 'number') {
        processedValue = value.toString();
      }

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: key,
          setting_value: processedValue,
          setting_category: category,
          data_type: dataType,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-system-settings'] });
      toast({
        title: getTranslation('settings.save.success') || 'Settings saved successfully',
        description: getTranslation('settings.save.success.description') || 'Your changes have been saved',
      });
    },
    onError: (error) => {
      toast({
        title: getTranslation('settings.save.error') || 'Error saving settings',
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Delete setting mutation
  const deleteSettingMutation = useMutation({
    mutationFn: async (settingKey: string) => {
      const { error } = await supabase
        .from('system_settings')
        .delete()
        .eq('setting_key', settingKey);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-system-settings'] });
      toast({
        title: getTranslation('settings.delete.success') || 'Setting deleted',
        description: getTranslation('settings.delete.success.description') || 'The setting has been removed',
      });
    },
    onError: (error) => {
      toast({
        title: getTranslation('settings.delete.error') || 'Error deleting setting',
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Bulk update settings
  const bulkUpdateMutation = useMutation({
    mutationFn: async (settingsMap: Record<string, { value: any; category: string; dataType: string }>) => {
      const updates = Object.entries(settingsMap).map(([key, config]) => ({
        setting_key: key,
        setting_value: config.dataType === 'array' || config.dataType === 'object' 
          ? JSON.stringify(config.value) 
          : config.value.toString(),
        setting_category: config.category,
        data_type: config.dataType,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-system-settings'] });
      toast({
        title: getTranslation('settings.bulk.success') || 'Settings saved',
        description: getTranslation('settings.bulk.success.description') || 'All changes have been saved',
      });
    },
    onError: (error) => {
      toast({
        title: getTranslation('settings.bulk.error') || 'Error saving settings',
        description: error.message,
        variant: "destructive"
      });
    },
  });

  // Get setting value with proper type conversion
  const getSettingValue = (key: string, defaultValue?: any) => {
    const setting = settings.find(s => s.setting_key === key);
    if (!setting) return defaultValue;

    try {
      switch (setting.data_type) {
        case 'boolean':
          return setting.setting_value === 'true' || setting.setting_value === true;
        case 'number':
          return parseFloat(String(setting.setting_value));
        case 'array':
        case 'object':
          return typeof setting.setting_value === 'string' 
            ? JSON.parse(setting.setting_value) 
            : setting.setting_value;
        default:
          return typeof setting.setting_value === 'string' ? setting.setting_value : String(setting.setting_value);
      }
    } catch (e) {
      console.warn(`Failed to parse setting ${key}:`, e);
      return defaultValue;
    }
  };

  // Get localized label for setting
  const getSettingLabel = (key: string) => {
    return getTranslation(`settings.${key}.label`) || key.replace(/_/g, ' ');
  };

  // Get localized description for setting
  const getSettingDescription = (key: string) => {
    return getTranslation(`settings.${key}.description`) || '';
  };

  // Check if setting is shared across systems
  const isSharedSetting = (key: string) => {
    return sharedConcepts.some(concept => concept.unified_key === key);
  };

  // Get affected systems for shared setting
  const getAffectedSystems = (key: string) => {
    const concept = sharedConcepts.find(c => c.unified_key === key);
    return concept?.applies_to_systems || [];
  };

  return {
    settings,
    sharedConcepts,
    isLoading,
    updateSetting: updateSettingMutation.mutate,
    deleteSetting: deleteSettingMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    getSettingValue,
    getSettingLabel,
    getSettingDescription,
    isSharedSetting,
    getAffectedSystems,
    isUpdating: updateSettingMutation.isPending,
    isDeleting: deleteSettingMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,
  };
};