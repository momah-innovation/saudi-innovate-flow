import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AllSystemSettings {
  // General Settings
  systemName: string;
  systemDescription: string;
  systemLanguage: string;
  maintenanceMode: boolean;
  allowPublicRegistration: boolean;
  maxFileUploadSize: number;
  autoArchiveAfterDays: number;

  // Challenge Settings
  defaultStatus: string;
  defaultPriority: string;
  defaultSensitivity: string;
  maxChallengesPerUser: number;
  itemsPerPage: number;
  defaultViewMode: string;
  enableAdvancedFilters: boolean;
  showPreviewOnHover: boolean;
  requireApprovalForPublish: boolean;
  allowAnonymousSubmissions: boolean;
  enableCollaboration: boolean;
  enableComments: boolean;
  enableRatings: boolean;

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

  // Security Settings
  sessionTimeout: number;
  maxLoginAttempts: number;
  enableDataEncryption: boolean;
  enableAccessLogs: boolean;
  passwordPolicy: string;
  dataRetentionPolicy: string;
  passwordMinLength: number;

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

  // UI Settings
  uiInitialsMaxLength: number;

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
  systemName: "نظام إدارة الابتكار",
  systemDescription: "منصة شاملة لإدارة التحديات والأفكار الابتكارية",
  systemLanguage: "ar",
  maintenanceMode: false,
  allowPublicRegistration: true,
  maxFileUploadSize: 10,
  autoArchiveAfterDays: 365,
  defaultStatus: 'draft',
  defaultPriority: 'medium',
  defaultSensitivity: 'normal',
  maxChallengesPerUser: 10,
  itemsPerPage: 12,
  defaultViewMode: 'cards',
  enableAdvancedFilters: true,
  showPreviewOnHover: true,
  requireApprovalForPublish: true,
  allowAnonymousSubmissions: false,
  enableCollaboration: true,
  enableComments: true,
  enableRatings: true,
  
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

  sessionTimeout: 60,
  maxLoginAttempts: 5,
  enableDataEncryption: true,
  enableAccessLogs: true,
  passwordPolicy: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص',
  dataRetentionPolicy: 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم',
  passwordMinLength: 8,
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
  uiInitialsMaxLength: 2,
  loading: true,
  error: null,
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AllSystemSettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      setSettings(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      const processedSettings = data?.reduce((acc, setting) => {
        let value = setting.setting_value;
        
        // Handle JSON arrays
        if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string if parsing fails
          }
        }
        
        // Convert string booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        // Convert string numbers
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
          value = Number(value);
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
      console.error('Error loading settings:', error);
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
          setting_value: Array.isArray(value) ? JSON.stringify(value) : value.toString(),
          setting_category: category,
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
