import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      { value: 'domain_expert', label: 'Domain Expert', description: 'Subject matter expert in specific domains' }
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
            'supported_languages'
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
            }
          });
          
          setSettings({ ...newSettings, loading: false });
        } else {
          setSettings(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error loading system lists:', error);
        setSettings(prev => ({ ...prev, loading: false }));
      }
    };

    loadSystemLists();
  }, []);

  return settings;
};