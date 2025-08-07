import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AllSystemSettings {
  // General Settings - snake_case to match database
  system_name: string;
  system_description: string;
  system_language: string;
  maintenance_mode: boolean;
  allow_public_registration: boolean;
  max_file_upload_size: number;
  auto_archive_after_days: number;

  // Challenge Settings - snake_case to match database
  challenge_default_status: string;
  challenge_default_priority: string;
  challenge_default_sensitivity: string;
  max_challenges_per_user: number;
  items_per_page: number;
  challenge_default_view_mode: string;
  challenge_enable_advanced_filters: boolean;
  challenge_show_preview_on_hover: boolean;
  require_approval_for_publish: boolean;
  allow_anonymous_submissions: boolean;
  enable_collaboration: boolean;
  challenge_enable_comments: boolean;
  challenge_enable_ratings: boolean;

  // Idea Settings
  idea_max_title_length: number;
  idea_max_description_length: number;
  idea_min_description_length: number;
  idea_allow_anonymous_submissions: boolean;
  idea_auto_save_drafts: boolean;
  idea_draft_expiry_days: number;
  idea_default_status: string;
  idea_auto_approve_submissions: boolean;
  idea_require_focus_question: boolean;
  idea_workflow_notifications_enabled: boolean;
  idea_assignment_due_date_days: number;
  idea_evaluation_scale_max: number;
  idea_evaluation_require_comments: boolean;
  idea_evaluation_multiple_allowed: boolean;
  idea_evaluation_criteria_weights: Record<string, number>;
  idea_collaboration_enabled: boolean;
  idea_max_collaborators: number;
  idea_collaboration_invite_expiry_hours: number;
  idea_version_tracking_enabled: boolean;
  idea_comments_enabled: boolean;
  idea_comments_moderation_enabled: boolean;
  idea_comments_max_length: number;
  idea_comments_allow_replies: boolean;
  idea_comments_public_by_default: boolean;
  idea_attachments_enabled: boolean;
  idea_max_attachments_per_idea: number;
  idea_max_attachment_size_mb: number;
  idea_allowed_attachment_types: string[];
  idea_analytics_enabled: boolean;
  idea_analytics_retention_days: number;
  idea_public_analytics_enabled: boolean;
  idea_lifecycle_milestones_enabled: boolean;
  idea_milestone_notifications_enabled: boolean;
  idea_implementation_tracking_enabled: boolean;
  idea_items_per_page: number;
  idea_default_view_mode: string;
  idea_show_preview_on_hover: boolean;
  idea_enable_advanced_filters: boolean;
  idea_sort_default: string;

  // Security Settings - snake_case to match database
  session_timeout: number;
  max_login_attempts: number;
  enable_data_encryption: boolean;
  enable_access_logs: boolean;
  password_policy: string;
  data_retention_policy: string;
  password_min_length: number;

  // Notification Settings
  emailNotifications: boolean;
  systemNotifications: boolean;
  mobileNotifications: boolean;
  notifyOnNewSubmission: boolean;
  notifyOnStatusChange: boolean;
  notifyOnDeadline: boolean;
  notifyOnEvaluation: boolean;
  reminderDaysBefore: number;
  reminderFrequency: string;
  newSubmissionTemplate: string;
  statusChangeTemplate: string;
  notificationFetchLimit: number;

  // Integration Settings
  enableApiAccess: boolean;
  apiRateLimit: number;
  allowedDomains: string;
  enableWebhooks: boolean;
  webhookUrl: string;
  webhookSecret: string;
  webhookEvents: string;
  enableTeamsIntegration: boolean;
  enableSlackIntegration: boolean;
  enableEmailIntegration: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  retentionPeriod: number;
  backupLocation: string;

  // System Lists
  challengeTypes: string[];
  ideaCategories: string[];
  evaluationCriteria: string[];
  themes: string[];
  roles: string[];
  statusOptions: string[];
  priorityLevels: string[];
  sensitivityLevels: string[];
  allowCustomValues: boolean;
  sortListsAlphabetically: boolean;
  
  // Global Lists
  supported_languages: string[];
  ui_themes: string[];
  currency_codes: string[];
  time_zones: string[];
  frequency_options: string[];
  file_formats: string[];
  export_formats: string[];
  color_schemes: string[];
  font_sizes: string[];
  notification_channels: string[];
  communication_methods: string[];
  log_levels: string[];
  backup_types: string[];
  status_types: string[];
  rating_scales: string[];

  // UI Settings
  uiInitialsMaxLength: number;

  // Additional platform service settings
  // Evaluation settings
  evaluationScale: string;
  evaluationRequiredFields: number;
  evaluationRequireComments: boolean;

  // Campaign settings
  campaignDefaultDuration: number;
  campaignMaxBudget: number;
  campaignRequireApproval: boolean;

  // Focus Question settings
  focusQuestionMaxPerChallenge: number;
  focusQuestionRequireDescription: boolean;
  focusQuestionAutoSequence: boolean;

  // Event settings
  eventMaxParticipants: number;
  eventRequireRegistration: boolean;
  eventAllowWaitlist: boolean;

  // Stakeholder settings
  stakeholderMaxPerOrganization: number;
  stakeholderRequireVerification: boolean;
  stakeholderAutoCategorize: boolean;

  // Team settings
  teamMaxMembers: number;
  teamRequireLead: boolean;
  teamAutoWorkloadBalance: boolean;

  // Analytics settings
  analyticsDataRetention: number;
  analyticsReportFrequency: string;
  analyticsRealtimeUpdates: boolean;

  // Partner settings
  partnerMaxPerProject: number;
  partnerRequireContract: boolean;
  partnerAutoOnboarding: boolean;

  // Organizational settings
  orgMaxHierarchyLevels: number;
  orgMaxSectors: number;
  orgAutoUpdateStructure: boolean;

  // User Management settings
  userMaxRolesPerUser: number;
  userRequireApproval: boolean;
  userAutoDeactivateInactive: boolean;

  // Loading and error states
  loading: boolean;
  error: string | null;
}

interface SettingsContextType extends AllSystemSettings {
  refetch: () => Promise<void>;
  updateSetting: (key: keyof AllSystemSettings, value: any) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

const defaultSettings: AllSystemSettings = {
  // System Settings - using i18n keys
  system_name: "system.name",
  system_description: "system.description", 
  system_language: "ar",
  maintenance_mode: false,
  allow_public_registration: true,
  max_file_upload_size: 10,
  auto_archive_after_days: 365,
  
  // Challenge Settings
  challenge_default_status: "challenge.status.draft",
  challenge_default_priority: 'medium',
  challenge_default_sensitivity: 'normal',
  max_challenges_per_user: 10,
  items_per_page: 12,
  challenge_default_view_mode: 'cards',
  challenge_enable_advanced_filters: true,
  challenge_show_preview_on_hover: true,
  require_approval_for_publish: true,
  allow_anonymous_submissions: false,
  enable_collaboration: true,
  challenge_enable_comments: true,
  challenge_enable_ratings: true,
  
  // Idea Settings
  idea_max_title_length: 200,
  idea_max_description_length: 5000,
  idea_min_description_length: 50,
  idea_allow_anonymous_submissions: false,
  idea_auto_save_drafts: true,
  idea_draft_expiry_days: 30,
  idea_default_status: 'draft',
  idea_auto_approve_submissions: false,
  idea_require_focus_question: true,
  idea_workflow_notifications_enabled: true,
  idea_assignment_due_date_days: 7,
  idea_evaluation_scale_max: 10,
  idea_evaluation_require_comments: false,
  idea_evaluation_multiple_allowed: true,
  idea_evaluation_criteria_weights: {
    technical_feasibility: 20,
    financial_viability: 20,
    market_potential: 20,
    strategic_alignment: 20,
    innovation_level: 20
  },
  idea_collaboration_enabled: true,
  idea_max_collaborators: 5,
  idea_collaboration_invite_expiry_hours: 48,
  idea_version_tracking_enabled: true,
  idea_comments_enabled: true,
  idea_comments_moderation_enabled: false,
  idea_comments_max_length: 1000,
  idea_comments_allow_replies: true,
  idea_comments_public_by_default: true,
  idea_attachments_enabled: true,
  idea_max_attachments_per_idea: 10,
  idea_max_attachment_size_mb: 25,
  idea_allowed_attachment_types: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif'],
  idea_analytics_enabled: true,
  idea_analytics_retention_days: 365,
  idea_public_analytics_enabled: false,
  idea_lifecycle_milestones_enabled: true,
  idea_milestone_notifications_enabled: true,
  idea_implementation_tracking_enabled: true,
  idea_items_per_page: 12,
  idea_default_view_mode: 'cards',
  idea_show_preview_on_hover: true,
  idea_enable_advanced_filters: true,
  idea_sort_default: 'created_at_desc',

  session_timeout: 60,
  max_login_attempts: 5,
  enable_data_encryption: true,
  enable_access_logs: true,
  password_policy: 'security.password_policy',
  data_retention_policy: 'security.data_retention_policy',
  password_min_length: 8,
  emailNotifications: true,
  systemNotifications: true,
  mobileNotifications: false,
  notifyOnNewSubmission: true,
  notifyOnStatusChange: true,
  notifyOnDeadline: true,
  notifyOnEvaluation: false,
  reminderDaysBefore: 7,
  reminderFrequency: 'daily',
  newSubmissionTemplate: 'تم تقديم فكرة جديدة للتحدي: {challengeTitle}',
  statusChangeTemplate: 'تم تغيير حالة التحدي {challengeTitle} إلى {newStatus}',
  notificationFetchLimit: 50,
  enableApiAccess: false,
  apiRateLimit: 1000,
  allowedDomains: '',
  enableWebhooks: false,
  webhookUrl: '',
  webhookSecret: '',
  webhookEvents: 'all',
  enableTeamsIntegration: false,
  enableSlackIntegration: false,
  enableEmailIntegration: true,
  autoBackup: true,
  backupFrequency: 'daily',
  retentionPeriod: 30,
  backupLocation: 'cloud',
  challengeTypes: ['تحدي تقني', 'تحدي إبداعي', 'تحدي تشغيلي', 'تحدي استراتيجي'],
  ideaCategories: ['تطوير منتج', 'تحسين عملية', 'حل مشكلة', 'ابتكار تقني'],
  evaluationCriteria: ['الجدوى التقنية', 'الأثر المتوقع', 'التكلفة', 'سهولة التنفيذ', 'الابتكار'],
  themes: ['التكنولوجيا المالية', 'الصحة', 'التعليم', 'البيئة'],
  roles: ['مبتكر', 'خبير', 'منسق فريق', 'مدير', 'مدير عام'],
  statusOptions: ['مسودة', 'منشور', 'نشط', 'مكتمل', 'ملغي'],
  priorityLevels: ['منخفض', 'متوسط', 'عالي', 'عاجل'],
  sensitivityLevels: ['عادي', 'حساس', 'سري', 'سري للغاية'],
  allowCustomValues: true,
  sortListsAlphabetically: false,
  
  // Global Lists defaults
  supported_languages: ["en", "ar", "he", "fa"],
  ui_themes: ["light", "dark", "auto"],
  currency_codes: ["SAR", "USD", "EUR", "GBP"],
  time_zones: ["Asia/Riyadh", "UTC", "Asia/Dubai", "Europe/London"],
  frequency_options: ["daily", "weekly", "monthly", "yearly"],
  file_formats: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"],
  export_formats: ["csv", "excel", "pdf", "json", "xml"],
  color_schemes: ["blue", "green", "purple", "orange", "red"],
  font_sizes: ["small", "medium", "large", "extra-large"],
  notification_channels: ["email", "sms", "push", "in_app"],
  communication_methods: ["email", "phone", "video_call", "in_person"],
  log_levels: ["debug", "info", "warning", "error", "critical"],
  backup_types: ["full", "incremental", "differential"],
  status_types: ["active", "inactive", "pending", "completed", "cancelled"],
  rating_scales: ["1-5", "1-10", "percentage", "letter_grade"],
  
  uiInitialsMaxLength: 2,

  // Additional platform service defaults
  evaluationScale: "10",
  evaluationRequiredFields: 5,
  evaluationRequireComments: true,
  campaignDefaultDuration: 30,
  campaignMaxBudget: 1000000,
  campaignRequireApproval: true,
  focusQuestionMaxPerChallenge: 10,
  focusQuestionRequireDescription: true,
  focusQuestionAutoSequence: true,
  eventMaxParticipants: 500,
  eventRequireRegistration: true,
  eventAllowWaitlist: true,
  stakeholderMaxPerOrganization: 100,
  stakeholderRequireVerification: true,
  stakeholderAutoCategorize: false,
  teamMaxMembers: 20,
  teamRequireLead: true,
  teamAutoWorkloadBalance: true,
  analyticsDataRetention: 365,
  analyticsReportFrequency: "weekly",
  analyticsRealtimeUpdates: true,
  partnerMaxPerProject: 5,
  partnerRequireContract: true,
  partnerAutoOnboarding: false,
  orgMaxHierarchyLevels: 5,
  orgMaxSectors: 20,
  orgAutoUpdateStructure: true,
  userMaxRolesPerUser: 3,
  userRequireApproval: true,
  userAutoDeactivateInactive: false,

  loading: true,
  error: null,
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AllSystemSettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      setSettings(prev => ({ ...prev, loading: true, error: null }));
      
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value, data_type, is_localizable, setting_category');

      if (error) throw error;

      const processedSettings = settings?.reduce((acc, setting) => {
        let value = setting.setting_value;
        
        // Handle different data types - store unified values, let i18n handle translation
        if (setting.data_type === 'boolean') {
          value = value === true || value === 'true';
        } else if (setting.data_type === 'number') {
          value = typeof value === 'number' ? value : Number(value) || 0;
        } else if (setting.data_type === 'array') {
          // For arrays, store unified values (translation keys)
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              const parsed = JSON.parse(value);
              // If it's the old i18n format with language keys, extract the English version
              if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) && parsed['en']) {
                value = parsed['en'];
              } else if (Array.isArray(parsed)) {
                value = parsed;
              } else {
                value = [];
              }
            } catch (e) {
              value = [];
            }
          } else if (Array.isArray(value)) {
            // Already an array, keep as is
          } else {
            value = [];
          }
        } else if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          // Handle JSON values
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }

        const key = setting.setting_key.replace(/^(challenge_|system_|notification_|security_|integration_)/, '');
        acc[key] = value;
        return acc;
      }, {}) || {};

      setSettings(prev => ({ 
        ...prev, 
        ...processedSettings, 
        loading: false, 
        error: null 
      }));
    } catch (error) {
      logger.error('Error loading settings', { component: 'SettingsProvider', action: 'fetchSettings' }, error as Error);
      setSettings(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load settings',
      }));
    }
  };

  const updateSetting = async (key: keyof AllSystemSettings, value: any) => {
    try {
      let category = 'system';
      let prefixedKey = key as string;
      
      // Categorize settings
      if (['defaultStatus', 'defaultPriority', 'defaultSensitivity', 'maxChallengesPerUser', 'itemsPerPage', 'defaultViewMode', 'enableAdvancedFilters', 'showPreviewOnHover', 'requireApprovalForPublish', 'allowAnonymousSubmissions', 'enableCollaboration', 'enableComments', 'enableRatings'].includes(key)) {
        category = 'challenges';
        prefixedKey = `challenge_${key}`;
      } else if (['emailNotifications', 'systemNotifications', 'mobileNotifications', 'notifyOnNewSubmission', 'notifyOnStatusChange', 'notifyOnDeadline', 'notifyOnEvaluation', 'reminderDaysBefore', 'reminderFrequency', 'newSubmissionTemplate', 'statusChangeTemplate', 'notificationFetchLimit'].includes(key)) {
        category = 'notifications';
        prefixedKey = `notification_${key}`;
      } else if (['sessionTimeout', 'maxLoginAttempts', 'enableDataEncryption', 'enableAccessLogs', 'passwordPolicy', 'dataRetentionPolicy', 'passwordMinLength'].includes(key)) {
        category = 'security';
        prefixedKey = `security_${key}`;
      } else if (['enableApiAccess', 'apiRateLimit', 'allowedDomains', 'enableWebhooks', 'webhookUrl', 'webhookSecret', 'webhookEvents', 'enableTeamsIntegration', 'enableSlackIntegration', 'enableEmailIntegration', 'autoBackup', 'backupFrequency', 'retentionPeriod', 'backupLocation'].includes(key)) {
        category = 'integration';
        prefixedKey = `integration_${key}`;
      } else {
        prefixedKey = `system_${key}`;
      }

      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: prefixedKey,
          setting_value: Array.isArray(value) || typeof value === 'object' ? value : value.toString(),
          setting_category: category,
          data_type: Array.isArray(value) ? 'array' : typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'number' : 'string',
          is_localizable: false, // Will be updated manually for i18n lists
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });

      if (error) throw error;

      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refetch = async () => {
    await fetchSettings();
  };

  const value = {
    ...settings,
    refetch,
    updateSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Utility function for getting initials
export const getInitials = (name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
};
