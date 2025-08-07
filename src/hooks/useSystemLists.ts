import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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
  loading: boolean;
}

export const useSystemLists = (): SystemListsHook => {
  const [settings, setSettings] = useState<SystemListsHook>({
    challengePriorityLevels: ['low', 'medium', 'high'],
    challengeSensitivityLevels: ['normal', 'sensitive', 'confidential'],
    challengeTypes: ['technology', 'sustainability', 'healthcare', 'education', 'governance'],
    challengeStatusOptions: ['draft', 'published', 'active', 'closed', 'archived', 'completed'],
    partnerStatusOptions: ['active', 'inactive', 'pending', 'suspended'],
    partnerTypeOptions: ['government', 'private', 'academic', 'non_profit', 'international'],
    partnershipTypeOptions: ['collaborator', 'sponsor', 'technical_partner', 'strategic_partner', 'implementation_partner'],
    expertStatusOptions: ['active', 'inactive', 'available', 'busy', 'unavailable'],
    assignmentStatusOptions: ['active', 'inactive', 'pending', 'completed', 'cancelled'],
    roleRequestStatusOptions: ['pending', 'approved', 'rejected', 'withdrawn'],
    userStatusOptions: ['active', 'inactive', 'suspended', 'pending', 'revoked'],
    generalStatusOptions: ['active', 'inactive', 'pending', 'completed', 'cancelled', 'draft', 'published', 'archived'],
    availableUserRoles: [
      { value: 'innovator', label: 'Innovator', description: 'Default role for new users' },
      { value: 'evaluator', label: 'Evaluator', description: 'Evaluate challenge submissions and ideas' },
      { value: 'domain_expert', label: 'Domain Expert', description: 'Subject matter expert in specific domains' }
    ],
    requestableUserRoles: [
      { value: 'evaluator', label: 'Evaluator', description: 'Evaluate challenge submissions and ideas' },
      { value: 'domain_expert', label: 'Domain Expert', description: 'Subject matter expert in specific domains' },
      { value: 'team_leader', label: 'Team Leader', description: 'Lead innovation teams and coordinate projects' }
    ],
    teamRoleOptions: [
      'Innovation Manager',
      'Data Analyst', 
      'Content Creator',
      'Project Manager',
      'Research Analyst'
    ],
    teamSpecializationOptions: [
      'Innovation Strategy & Planning',
      'Project Management & Execution', 
      'Research & Market Analysis',
      'Stakeholder Engagement',
      'Change Management'
    ],
    focusQuestionTypes: ['general', 'technical', 'business', 'impact', 'implementation', 'social', 'ethical', 'medical', 'regulatory'],
    experienceLevels: ['beginner', 'intermediate', 'advanced', 'expert'],
    expertRoleTypes: ['lead_expert', 'evaluator', 'reviewer', 'subject_matter_expert', 'external_consultant'],
    eventTypes: ['workshop', 'seminar', 'conference', 'networking', 'hackathon', 'pitch_session', 'training'],
    eventFormats: ['in_person', 'virtual', 'hybrid'],
    eventCategories: ['standalone', 'campaign_event', 'training', 'workshop'],
    eventVisibilityOptions: ['public', 'private', 'internal'],
    supportedLanguages: [
      {code: 'en', label: 'English', nativeLabel: 'English'},
      {code: 'ar', label: 'Arabic', nativeLabel: 'العربية'},
      {code: 'he', label: 'Hebrew', nativeLabel: 'עברית'},
      {code: 'fa', label: 'Persian', nativeLabel: 'فارسی'}
    ],
    stakeholderInfluenceLevels: ['high', 'medium', 'low'],
    stakeholderInterestLevels: ['high', 'medium', 'low'],
    ideaAssignmentTypes: ['reviewer', 'evaluator', 'implementer', 'observer'],
    priorityLevels: ['low', 'medium', 'high', 'urgent'],
    ideaMaturityLevels: ['concept', 'prototype', 'pilot', 'scaling'],
    campaignThemeOptions: ['digital_transformation', 'sustainability', 'smart_cities', 'healthcare', 'education', 'fintech', 'energy', 'transportation'],
    attendanceStatusOptions: ['registered', 'attended', 'absent', 'cancelled', 'confirmed'],
    evaluatorTypes: ['lead_expert', 'evaluator', 'reviewer', 'subject_matter_expert', 'external_consultant'],
    relationshipTypes: ['direct', 'indirect', 'collaborative', 'competitive', 'supportive'],
    organizationTypes: ['operational', 'strategic', 'administrative', 'technical', 'support'],
    assignmentTypes: ['campaign', 'event', 'project', 'content', 'analysis'],
    extendedStatusOptions: ['planning', 'scheduled', 'ongoing', 'postponed', 'draft', 'published'],
    sectorTypes: ['health', 'education', 'transport', 'environment', 'economy', 'technology', 'finance', 'defense', 'social'],
    tagCategories: ['innovation', 'digital', 'sustainability', 'efficiency', 'technology', 'business', 'social', 'environmental'],
    sensitivityLevels: ['normal', 'sensitive', 'confidential'],
    frequencyOptions: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    backupFrequencyOptions: ['hourly', 'daily', 'weekly', 'monthly'],
    reportFrequencyOptions: ['daily', 'weekly', 'monthly'],
    reminderFrequencyOptions: ['daily', 'weekly', 'monthly'],
    recurrencePatternOptions: ['daily', 'weekly', 'monthly', 'yearly'],
    questionTypeOptions: ['open_ended', 'multiple_choice', 'yes_no', 'rating', 'ranking'],
    timeRangeOptions: ['all', 'last_30', 'last_90', 'last_year'],
    roleRequestJustifications: ['domain_expertise', 'evaluation_experience', 'academic_background', 'industry_experience', 'certification', 'volunteer_contribution'],
    uiLanguageOptions: ['en', 'ar'],
    stakeholderCategories: ['government', 'private_sector', 'academic', 'civil_society', 'international', 'media', 'experts'],
    engagementLevels: ['high', 'medium', 'low'],
    chartColorPalette: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#ff7c7c', '#8dd9cc'],
    themeVariants: ['modern', 'minimal', 'vibrant'],
    themeColorSchemes: ['light', 'dark', 'auto'],
    themeBorderRadiusOptions: ['none', 'sm', 'md', 'lg', 'xl'],
    challengeFilterStatusOptions: ['all', 'draft', 'published', 'active', 'closed', 'archived'],
    navigationMenuVisibilityRoles: ['admin', 'super_admin', 'team_member', 'evaluator', 'domain_expert'],
    dataExportFormats: ['csv', 'excel', 'pdf', 'json'],
    chartVisualizationColors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'],
    loading: true
  });

  useEffect(() => {
    const loadSystemLists = async () => {
      try {
        const { data } = await supabase
          .from('system_settings')
          .select('setting_key, setting_value')
          .in('setting_key', [
            'challenge_priority_levels',
            'challenge_sensitivity_levels', 
            'challenge_types',
            'challenge_status_options',
            'partner_status_options',
            'partner_type_options',
            'partnership_type_options',
            'expert_status_options',
            'assignment_status_options',
            'role_request_status_options',
            'user_status_options',
            'general_status_options',
            'available_user_roles',
            'requestable_user_roles',
            'team_role_options',
            'team_specialization_options',
            'focus_question_types',
            'experience_levels',
            'expert_role_types',
            'event_types',
            'event_formats',
            'event_categories',
            'event_visibility_options',
            'supported_languages',
            'stakeholder_influence_levels',
            'stakeholder_interest_levels',
            'idea_assignment_types',
            'priority_levels',
            'idea_maturity_levels',
            'campaign_theme_options',
            'attendance_status_options',
            'evaluator_types',
            'relationship_types',
            'organization_types',
            'assignment_types',
            'extended_status_options',
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
            'challenge_filter_status_options',
            'navigation_menu_visibility_roles',
            'data_export_formats',
            'chart_visualization_colors'
          ]);
        
        if (data) {
          const newSettings = { ...settings };
          
          data.forEach(setting => {
            const value = typeof setting.setting_value === 'string' 
              ? JSON.parse(setting.setting_value) 
              : setting.setting_value;
              
            switch (setting.setting_key) {
              case 'challenge_priority_levels':
                newSettings.challengePriorityLevels = value;
                break;
              case 'challenge_sensitivity_levels':
                newSettings.challengeSensitivityLevels = value;
                break;
              case 'challenge_types':
                newSettings.challengeTypes = value;
                break;
              case 'challenge_status_options':
                newSettings.challengeStatusOptions = value;
                break;
              case 'partner_status_options':
                newSettings.partnerStatusOptions = value;
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
              case 'user_status_options':
                newSettings.userStatusOptions = value;
                break;
              case 'general_status_options':
                newSettings.generalStatusOptions = value;
                break;
              case 'available_user_roles':
                newSettings.availableUserRoles = value;
                break;
              case 'requestable_user_roles':
                newSettings.requestableUserRoles = value;
                break;
              case 'team_role_options':
                newSettings.teamRoleOptions = value;
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
              case 'expert_role_types':
                newSettings.expertRoleTypes = value;
                break;
              case 'event_types':
                newSettings.eventTypes = value;
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
              case 'idea_assignment_types':
                newSettings.ideaAssignmentTypes = value;
                break;
              case 'priority_levels':
                newSettings.priorityLevels = value;
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
              case 'assignment_types':
                newSettings.assignmentTypes = value;
                break;
              case 'extended_status_options':
                newSettings.extendedStatusOptions = value;
                break;
              case 'sector_types':
                newSettings.sectorTypes = value;
                break;
              case 'tag_categories':
                newSettings.tagCategories = value;
                break;
              case 'sensitivity_levels':
                newSettings.sensitivityLevels = value;
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
              case 'challenge_filter_status_options':
                newSettings.challengeFilterStatusOptions = value;
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
          
          setSettings({ ...newSettings, loading: false });
        } else {
          setSettings(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        logger.error('Failed to load system lists', { component: 'useSystemLists', action: 'loadSystemLists' }, error as Error);
        setSettings(prev => ({ ...prev, loading: false }));
      }
    };

    loadSystemLists();
  }, []);

  return settings;
};