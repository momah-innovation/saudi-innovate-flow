import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { VALUE_KEY_MAPPINGS, getCategoryKeys, useTranslatedValue } from '@/utils/valueKeys';

// Debug logging for useSystemLists hook (removed to prevent re-renders)

interface SystemListsHook {
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
  availableUserRoles: Array<{value: string; label: string; description: string}>;
  requestableUserRoles: Array<{value: string; label: string; description: string}>;
  teamRoleOptions: string[];
  teamSpecializationOptions: string[];
  focusQuestionTypes: string[];
  experienceLevels: string[];
  expertRoleTypes: string[];
  eventTypes: string[];
  eventFormats: string[];
  eventCategories: string[];
  eventVisibilityOptions: string[];
  supportedLanguages: Array<{code: string; label: string; nativeLabel: string}>;
  stakeholderInfluenceLevels: string[];
  stakeholderInterestLevels: string[];
  ideaAssignmentTypes: string[];
  priorityLevels: string[];
  ideaMaturityLevels: string[];
  campaignThemeOptions: string[];
  attendanceStatusOptions: string[];
  evaluatorTypes: string[];
  relationshipTypes: string[];
  organizationTypes: string[];
  assignmentTypes: string[];
  extendedStatusOptions: string[];
  sectorTypes: string[];
  tagCategories: string[];
  sensitivityLevels: string[];
  frequencyOptions: string[];
  backupFrequencyOptions: string[];
  reportFrequencyOptions: string[];
  reminderFrequencyOptions: string[];
  recurrencePatternOptions: string[];
  questionTypeOptions: string[];
  timeRangeOptions: string[];
  roleRequestJustifications: string[];
  uiLanguageOptions: string[];
  stakeholderCategories: string[];
  engagementLevels: string[];
  chartColorPalette: string[];
  themeVariants: string[];
  themeColorSchemes: string[];
  themeBorderRadiusOptions: string[];
  challengeFilterStatusOptions: string[];
  navigationMenuVisibilityRoles: string[];
  dataExportFormats: string[];
  chartVisualizationColors: string[];
  
  // NEW: Translation-aware helper functions
  getTranslatedOptions: (category: keyof typeof VALUE_KEY_MAPPINGS) => Array<{
    value: string;
    label: string;
  }>;
  getTranslatedValue: (value: string, category: keyof typeof VALUE_KEY_MAPPINGS) => string;
  
  loading: boolean;
}

export const useSystemLists = (): SystemListsHook => {
  const { t } = useUnifiedTranslation();
  const [settings, setSettings] = useState<SystemListsHook>({
    // Initialize with empty arrays - will be populated from translation keys
    challengePriorityLevels: [],
    challengeSensitivityLevels: [],
    challengeTypes: [],
    challengeStatusOptions: [],
    partnerStatusOptions: [],
    partnerTypeOptions: [],
    partnershipTypeOptions: [],
    expertStatusOptions: [],
    assignmentStatusOptions: [],
    roleRequestStatusOptions: [],
    userStatusOptions: [],
    generalStatusOptions: [],
    availableUserRoles: [],
    requestableUserRoles: [],
    teamRoleOptions: [],
    teamSpecializationOptions: [],
    focusQuestionTypes: [],
    experienceLevels: [],
    expertRoleTypes: [],
    eventTypes: [],
    eventFormats: [],
    eventCategories: [],
    eventVisibilityOptions: [],
    supportedLanguages: [],
    stakeholderInfluenceLevels: [],
    stakeholderInterestLevels: [],
    ideaAssignmentTypes: [],
    priorityLevels: [],
    ideaMaturityLevels: [],
    campaignThemeOptions: [],
    attendanceStatusOptions: [],
    evaluatorTypes: [],
    relationshipTypes: [],
    organizationTypes: [],
    assignmentTypes: [],
    extendedStatusOptions: [],
    sectorTypes: [],
    tagCategories: [],
    sensitivityLevels: [],
    frequencyOptions: [],
    backupFrequencyOptions: [],
    reportFrequencyOptions: [],
    reminderFrequencyOptions: [],
    recurrencePatternOptions: [],
    questionTypeOptions: [],
    timeRangeOptions: [],
    roleRequestJustifications: [],
    uiLanguageOptions: [],
    stakeholderCategories: [],
    engagementLevels: [],
    chartColorPalette: [],
    themeVariants: [],
    themeColorSchemes: [],
    themeBorderRadiusOptions: [],
    challengeFilterStatusOptions: [],
    navigationMenuVisibilityRoles: [],
    dataExportFormats: [],
    chartVisualizationColors: [],
    
    // NEW: Translation helper functions
    getTranslatedOptions: (category: keyof typeof VALUE_KEY_MAPPINGS) => {
      const keys = getCategoryKeys(category);
      return keys.map(key => ({
        value: key.split('.')[1], // Standard database value
        label: t(key, key.split('.')[1]) // Translated label
      }));
    },
    
    getTranslatedValue: (value: string, category: keyof typeof VALUE_KEY_MAPPINGS) => {
      const mapping = VALUE_KEY_MAPPINGS[category];
      if (!mapping) return value;
      
      const key = mapping[value as keyof typeof mapping];
      return key ? t(key, value) : value;
    },
    
    loading: true
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounts
    
    const loadSystemLists = async () => {
      try {
        // Use key-based translation system for core lists that have mappings
        const keyBasedSettings = {
          // Core challenge/opportunity/status lists from VALUE_KEY_MAPPINGS
          challengePriorityLevels: getCategoryKeys('priority').map(key => key.split('.')[1]),
          challengeTypes: getCategoryKeys('challenge_type').map(key => key.split('.')[1]),
          challengeStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          priorityLevels: getCategoryKeys('priority').map(key => key.split('.')[1]),
          partnerStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          userStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          generalStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          extendedStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          challengeFilterStatusOptions: getCategoryKeys('status').map(key => key.split('.')[1]),
          eventTypes: getCategoryKeys('event_type').map(key => key.split('.')[1]),
          assignmentTypes: getCategoryKeys('assignment_type').map(key => key.split('.')[1]),
          ideaAssignmentTypes: getCategoryKeys('assignment_type').map(key => key.split('.')[1]),
          expertRoleTypes: getCategoryKeys('role_type').map(key => key.split('.')[1]),
          teamRoleOptions: getCategoryKeys('role_type').map(key => key.split('.')[1]),
        };

        // Load remaining lists from database for backward compatibility
        const [settingsData, listsData] = await Promise.all([
          supabase
            .from('system_settings')
            .select('setting_key, setting_value')
            .in('setting_key', [
              'challenge_sensitivity_levels',
              'partner_type_options',
              'partnership_type_options',
              'expert_status_options',
              'assignment_status_options',
              'role_request_status_options',
              'available_user_roles',
              'requestable_user_roles',
              'team_specialization_options',
              'focus_question_types',
              'experience_levels',
              'event_formats',
              'event_categories',
              'event_visibility_options',
              'supported_languages',
              'stakeholder_influence_levels',
              'stakeholder_interest_levels',
              'idea_maturity_levels',
              'campaign_theme_options',
              'attendance_status_options',
              'evaluator_types',
              'relationship_types',
              'organization_types',
              'sector_types',
              'tag_categories',
              'sensitivity_levels',
              'frequency_options',
              'backup_frequency_options',
              'report_frequency_options',
              'reminder_frequency_options',
              'recurrence_pattern_options',
              'question_type_options',
              'time_range_options',
              'role_request_justifications',
              'ui_language_options',
              'stakeholder_categories',
              'engagement_levels',
              'chart_color_palette',
              'theme_variants',
              'theme_color_schemes',
              'theme_border_radius_options',
              'navigation_menu_visibility_roles',
              'data_export_formats',
              'chart_visualization_colors'
            ]),
          supabase
            .from('system_lists')
            .select('list_key, list_values')
            .eq('is_active', true)
        ]);
        
        // Start with key-based settings
        const newSettings = { ...settings, ...keyBasedSettings };
        
        // Process system_settings data
        if (settingsData.data) {
          settingsData.data.forEach(setting => {
            const value = typeof setting.setting_value === 'string' 
              ? JSON.parse(setting.setting_value) 
              : setting.setting_value;
              
            switch (setting.setting_key) {
              case 'challenge_sensitivity_levels':
                newSettings.challengeSensitivityLevels = value;
                newSettings.sensitivityLevels = value;
                break;
              case 'partner_type_options':
                newSettings.partnerTypeOptions = value;
                break;
              case 'partnership_type_options':
                newSettings.partnershipTypeOptions = value;
                break;
              case 'expert_status_options':
                newSettings.expertStatusOptions = value;
                break;
              case 'assignment_status_options':
                newSettings.assignmentStatusOptions = value;
                break;
              case 'role_request_status_options':
                newSettings.roleRequestStatusOptions = value;
                break;
              case 'available_user_roles':
                newSettings.availableUserRoles = value;
                break;
              case 'requestable_user_roles':
                newSettings.requestableUserRoles = value;
                break;
              case 'team_specialization_options':
                newSettings.teamSpecializationOptions = value;
                break;
              case 'focus_question_types':
                newSettings.focusQuestionTypes = value;
                break;
              case 'experience_levels':
                newSettings.experienceLevels = value;
                break;
              case 'event_formats':
                newSettings.eventFormats = value;
                break;
              case 'event_categories':
                newSettings.eventCategories = value;
                break;
              case 'event_visibility_options':
                newSettings.eventVisibilityOptions = value;
                break;
              case 'supported_languages':
                newSettings.supportedLanguages = value;
                break;
              case 'stakeholder_influence_levels':
                newSettings.stakeholderInfluenceLevels = value;
                break;
              case 'stakeholder_interest_levels':
                newSettings.stakeholderInterestLevels = value;
                break;
              case 'idea_maturity_levels':
                newSettings.ideaMaturityLevels = value;
                break;
              case 'campaign_theme_options':
                newSettings.campaignThemeOptions = value;
                break;
              case 'attendance_status_options':
                newSettings.attendanceStatusOptions = value;
                break;
              case 'evaluator_types':
                newSettings.evaluatorTypes = value;
                break;
              case 'relationship_types':
                newSettings.relationshipTypes = value;
                break;
              case 'organization_types':
                newSettings.organizationTypes = value;
                break;
              case 'sector_types':
                newSettings.sectorTypes = value;
                break;
              case 'tag_categories':
                newSettings.tagCategories = value;
                break;
              case 'frequency_options':
                newSettings.frequencyOptions = value;
                break;
              case 'backup_frequency_options':
                newSettings.backupFrequencyOptions = value;
                break;
              case 'report_frequency_options':
                newSettings.reportFrequencyOptions = value;
                break;
              case 'reminder_frequency_options':
                newSettings.reminderFrequencyOptions = value;
                break;
              case 'recurrence_pattern_options':
                newSettings.recurrencePatternOptions = value;
                break;
              case 'question_type_options':
                newSettings.questionTypeOptions = value;
                break;
              case 'time_range_options':
                newSettings.timeRangeOptions = value;
                break;
              case 'role_request_justifications':
                newSettings.roleRequestJustifications = value;
                break;
              case 'ui_language_options':
                newSettings.uiLanguageOptions = value;
                break;
              case 'stakeholder_categories':
                newSettings.stakeholderCategories = value;
                break;
              case 'engagement_levels':
                newSettings.engagementLevels = value;
                break;
              case 'chart_color_palette':
                newSettings.chartColorPalette = value;
                break;
              case 'theme_variants':
                newSettings.themeVariants = value;
                break;
              case 'theme_color_schemes':
                newSettings.themeColorSchemes = value;
                break;
              case 'theme_border_radius_options':
                newSettings.themeBorderRadiusOptions = value;
                break;
              case 'navigation_menu_visibility_roles':
                newSettings.navigationMenuVisibilityRoles = value;
                break;
              case 'data_export_formats':
                newSettings.dataExportFormats = value;
                break;
              case 'chart_visualization_colors':
                newSettings.chartVisualizationColors = value;
                break;
            }
          });
        }

        // Process system_lists data 
        if (listsData.data) {
          listsData.data.forEach(list => {
            const values = Array.isArray(list.list_values) ? list.list_values : [];
            
            // Extend newSettings with additional lists from system_lists table
            switch (list.list_key) {
              case 'opportunity_types':
                (newSettings as any).opportunityTypes = values;
                break;
              case 'opportunity_status_options':
                (newSettings as any).opportunityStatusOptions = values;
                break;
              case 'application_status_options':
                (newSettings as any).applicationStatusOptions = values;
                break;
              case 'budget_ranges':
                (newSettings as any).budgetRanges = values;
                break;
              case 'collaboration_types':
                (newSettings as any).collaborationTypes = values;
                break;
              case 'attachment_types':
                (newSettings as any).attachmentTypes = values;
                break;
              case 'notification_channels':
                (newSettings as any).notificationChannels = values;
                break;
              case 'notification_types':
                (newSettings as any).notificationTypeOptions = values;
                break;
              case 'workflow_statuses':
                (newSettings as any).workflowStatuses = values;
                break;
              case 'visibility_levels':
                (newSettings as any).visibilityLevels = values;
                break;
              case 'integration_types':
                (newSettings as any).integrationTypes = values;
                break;
              case 'file_categories':
                (newSettings as any).fileCategories = values;
                break;
            }
          });
        }
          
        if (isMounted) {
          setSettings({ ...newSettings, loading: false });
        }
      } catch (error) {
        logger.error('Failed to load system lists', { component: 'useSystemLists', action: 'loadSystemLists' }, error as Error);
        if (isMounted) {
          setSettings(prev => ({ ...prev, loading: false }));
        }
      }
    };

    loadSystemLists();
    
    return () => {
      isMounted = false; // Cleanup
    };
  }, []);

  return settings;
};