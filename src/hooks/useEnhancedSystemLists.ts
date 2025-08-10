/**
 * Enhanced useSystemLists hook that supports both legacy hardcoded values 
 * and new key-based translation system
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { VALUE_KEY_MAPPINGS, getCategoryKeys } from '@/utils/valueKeys';
import { useTranslatableOptions } from '@/components/ui/translatable-select';

// Extended interface with translation support
interface EnhancedSystemListsHook {
  // Legacy arrays (for backward compatibility)
  challengePriorityLevels: string[];
  challengeSensitivityLevels: string[];
  challengeTypes: string[];
  challengeStatusOptions: string[];
  partnerStatusOptions: string[];
  partnerTypeOptions: string[];
  partnershipTypeOptions: string[];
  expertStatusOptions: string[];
  assignmentStatusOptions: string[];
  roleRequestStatusOptions: string[];
  userStatusOptions: string[];
  generalStatusOptions: string[];
  eventTypes: string[];
  eventFormats: string[];
  priorityLevels: string[];
  ideaMaturityLevels: string[];
  
  // NEW: Translation-aware options
  getTranslatableOptions: <T extends keyof typeof VALUE_KEY_MAPPINGS>(category: T) => Array<{
    value: string;
    key: string;
    label: string;
    displayValue: string;
  }>;
  
  // NEW: Translated status options by category
  statusOptions: Array<{ value: string; label: string }>;
  priorityOptions: Array<{ value: string; label: string }>;
  challengeTypeOptions: Array<{ value: string; label: string }>;
  eventTypeOptions: Array<{ value: string; label: string }>;
  opportunityTypeOptions: Array<{ value: string; label: string }>;
  sensitivityOptions: Array<{ value: string; label: string }>;
  participationTypeOptions: Array<{ value: string; label: string }>;
  registrationTypeOptions: Array<{ value: string; label: string }>;
  assignmentTypeOptions: Array<{ value: string; label: string }>;
  roleTypeOptions: Array<{ value: string; label: string }>;
  
  // Helper functions
  getTranslatedValue: (value: string, category: keyof typeof VALUE_KEY_MAPPINGS) => string;
  
  loading: boolean;
}

export const useEnhancedSystemLists = (): EnhancedSystemListsHook => {
  const { t } = useUnifiedTranslation();
  
  // Get translatable options for each category
  const statusOptionsData = useTranslatableOptions('status');
  const priorityOptionsData = useTranslatableOptions('priority');
  const challengeTypeOptionsData = useTranslatableOptions('challenge_type');
  const eventTypeOptionsData = useTranslatableOptions('event_type');
  const opportunityTypeOptionsData = useTranslatableOptions('opportunity_type');
  const sensitivityOptionsData = useTranslatableOptions('sensitivity');
  const participationTypeOptionsData = useTranslatableOptions('participation_type');
  const registrationTypeOptionsData = useTranslatableOptions('registration_type');
  const assignmentTypeOptionsData = useTranslatableOptions('assignment_type');
  const roleTypeOptionsData = useTranslatableOptions('role_type');

  const [legacySettings, setLegacySettings] = useState({
    challengePriorityLevels: ['low', 'medium', 'high', 'urgent'],
    challengeSensitivityLevels: ['normal', 'sensitive', 'confidential'],
    challengeTypes: ['innovation', 'improvement', 'research', 'development'],
    challengeStatusOptions: ['draft', 'published', 'active', 'closed', 'archived', 'completed'],
    partnerStatusOptions: ['active', 'inactive', 'pending', 'suspended'],
    partnerTypeOptions: ['government', 'private', 'academic', 'non_profit', 'international'],
    partnershipTypeOptions: ['collaborator', 'sponsor', 'technical_partner', 'strategic_partner'],
    expertStatusOptions: ['active', 'inactive', 'available', 'busy', 'unavailable'],
    assignmentStatusOptions: ['active', 'inactive', 'pending', 'completed', 'cancelled'],
    roleRequestStatusOptions: ['pending', 'approved', 'rejected', 'withdrawn'],
    userStatusOptions: ['active', 'inactive', 'suspended', 'pending', 'revoked'],
    generalStatusOptions: ['active', 'inactive', 'pending', 'completed', 'cancelled', 'draft', 'published', 'archived'],
    eventTypes: ['workshop', 'seminar', 'conference', 'networking', 'hackathon', 'training'],
    eventFormats: ['in_person', 'virtual', 'hybrid'],
    priorityLevels: ['low', 'medium', 'high', 'urgent'],
    ideaMaturityLevels: ['concept', 'prototype', 'pilot', 'scaling'],
    loading: true
  });

  useEffect(() => {
    const loadLegacySettings = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'challenge_priority_levels',
            'challenge_status_options',
            'partner_status_options',
            'event_types',
            'priority_levels'
          ]);
        
        if (data) {
          const updates = { ...legacySettings };
          
          data.forEach(setting => {
            const value = typeof setting.setting_value === 'string' 
              ? JSON.parse(setting.setting_value) 
              : setting.setting_value;
              
            switch (setting.setting_key) {
              case 'challenge_priority_levels':
                updates.challengePriorityLevels = value;
                break;
              case 'challenge_status_options':
                updates.challengeStatusOptions = value;
                break;
              case 'partner_status_options':
                updates.partnerStatusOptions = value;
                break;
              case 'event_types':
                updates.eventTypes = value;
                break;
              case 'priority_levels':
                updates.priorityLevels = value;
                break;
            }
          });
          
          setLegacySettings({ ...updates, loading: false });
        }
      } catch (error) {
        logger.error('Error loading system lists:', error);
        setLegacySettings(prev => ({ ...prev, loading: false }));
      }
    };

    loadLegacySettings();
  }, []);

  const getTranslatableOptions = <T extends keyof typeof VALUE_KEY_MAPPINGS>(category: T) => {
    const keys = getCategoryKeys(category);
    return keys.map(key => ({
      value: key.split('.')[1], // Standard database value
      key: key,
      label: t(key, key.split('.')[1]),
      displayValue: key.split('.')[1]
    }));
  };

  const getTranslatedValue = (value: string, category: keyof typeof VALUE_KEY_MAPPINGS) => {
    const mapping = VALUE_KEY_MAPPINGS[category];
    if (!mapping) return value;
    
    const key = mapping[value as keyof typeof mapping];
    return key ? t(key, value) : value;
  };

  return {
    // Legacy arrays for backward compatibility
    ...legacySettings,
    
    // NEW: Translation-aware options
    getTranslatableOptions,
    
    // NEW: Pre-built translated options
    statusOptions: statusOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    priorityOptions: priorityOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    challengeTypeOptions: challengeTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    eventTypeOptions: eventTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    opportunityTypeOptions: opportunityTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    sensitivityOptions: sensitivityOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    participationTypeOptions: participationTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    registrationTypeOptions: registrationTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    assignmentTypeOptions: assignmentTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    roleTypeOptions: roleTypeOptionsData.map(opt => ({ value: opt.value, label: opt.label })),
    
    // Helper functions
    getTranslatedValue
  };
};