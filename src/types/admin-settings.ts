/**
 * TypeScript interfaces for Admin Settings components
 * Replaces any types with proper type definitions
 */

export interface SystemSettings {
  // General Settings
  system_name?: string;
  system_language?: string;
  system_description?: string;
  maintenance_mode?: boolean;
  allow_public_registration?: boolean;
  max_file_upload_size?: number;
  auto_archive_after_days?: number;

  // AI Settings
  ai_features?: string[];
  ai_models?: string[];
  ai_request_limit?: number;
  ai_response_timeout?: number;
  default_ai_model?: string;
  creativity_level?: string;
  enable_ai?: boolean;
  enable_idea_generation?: boolean;
  enable_content_moderation?: boolean;
  enable_trend_analysis?: boolean;

  // Analytics Settings
  tag_categories?: string[];
  data_retention_days?: number;
  report_generation_frequency?: number;
  max_dashboard_widgets?: number;
  chart_refresh_interval?: number;
  enable_user_behavior_tracking?: boolean;
  enable_real_time_analytics?: boolean;
  enable_automatic_reports?: boolean;
  enable_data_export?: boolean;
  enable_data_anonymization?: boolean;

  // Campaign Settings
  assignment_types?: string[];
  max_campaigns_per_user?: number;
  campaign_min_duration?: number;
  campaign_max_duration?: number;
  max_participants_per_campaign?: number;
  campaign_budget_limit?: number;
  registration_deadline_buffer?: number;
  allow_open_campaign_registration?: boolean;
  require_campaign_review?: boolean;
  enable_campaign_analytics?: boolean;
  enable_automatic_notifications?: boolean;

  // Challenge Settings
  challenge_types?: string[];
  priority_levels?: string[];
  challenge_status_options?: string[];
  max_challenges_per_user?: number;
  itemsPerPage?: number;
  requireApprovalForPublish?: boolean;
  allowAnonymousSubmissions?: boolean;
  enableCollaboration?: boolean;

  // Event Settings
  event_types?: string[];
  event_categories?: string[];
  maxParticipants?: number;
  registrationDeadlineDays?: number;
  allowOpenRegistration?: boolean;
  enableAttendanceTracking?: boolean;

  // Integration Settings
  integrations?: string[];
  api_endpoints?: string[];
  max_api_requests_per_hour?: number;
  webhook_timeout?: number;
  enable_webhooks?: boolean;
  enable_external_apis?: boolean;
  require_api_authentication?: boolean;

  // Notification Settings
  notification_channels?: string[];
  notification_frequencies?: string[];
  max_notifications_per_user?: number;
  notification_batch_size?: number;
  enable_email_notifications?: boolean;
  enable_push_notifications?: boolean;
  enable_sms_notifications?: boolean;
  enable_notification_batching?: boolean;

  // Opportunity Settings
  opportunity_types?: string[];
  opportunity_statuses?: string[];
  max_opportunities_per_user?: number;
  opportunity_duration_days?: number;
  enable_opportunity_matching?: boolean;
  require_opportunity_approval?: boolean;

  // Partner Settings
  partnership_types?: string[];
  partner_categories?: string[];
  max_partners_per_organization?: number;
  partner_verification_required?: boolean;
  enable_partner_analytics?: boolean;

  // Performance Settings
  performance_metrics?: string[];
  cache_duration_hours?: number;
  max_concurrent_users?: number;
  enable_caching?: boolean;
  enable_compression?: boolean;
  enable_cdn?: boolean;

  // Security Settings
  security_levels?: string[];
  access_control_types?: string[];
  session_timeout_minutes?: number;
  max_login_attempts?: number;
  password_expiry_days?: number;
  enable_two_factor_auth?: boolean;
  enable_session_monitoring?: boolean;
  enable_audit_logging?: boolean;
  require_password_complexity?: boolean;

  // Team Settings
  team_roles?: string[];
  team_permissions?: string[];
  max_team_size?: number;
  enable_team_analytics?: boolean;
  require_team_approval?: boolean;

  // UI Settings
  ui_themes?: string[];
  ui_components?: string[];
  default_theme?: string;
  enable_dark_mode?: boolean;
  enable_theme_switching?: boolean;
  enable_accessibility_features?: boolean;

  // User Management Settings
  user_roles?: string[];
  user_statuses?: string[];
  max_users_per_organization?: number;
  user_approval_required?: boolean;
  enable_user_profiles?: boolean;
  enable_user_analytics?: boolean;

  // Workflow Settings
  workflow_statuses?: string[];
  workflow_types?: string[];
  max_workflow_steps?: number;
  enable_workflow_automation?: boolean;
  require_workflow_approval?: boolean;

  // Other common fields
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface SettingsChangeHandler {
  (key: keyof SystemSettings, value: SystemSettings[keyof SystemSettings]): void;
}

export interface BaseSettingsProps {
  settings: SystemSettings;
  onSettingChange: SettingsChangeHandler;
}

export interface AISettingsProps extends BaseSettingsProps {}
export interface AnalyticsSettingsProps extends BaseSettingsProps {}
export interface CampaignSettingsProps extends BaseSettingsProps {}
export interface ChallengeSettingsProps extends BaseSettingsProps {}
export interface EventSettingsProps extends BaseSettingsProps {}
export interface FocusQuestionSettingsProps extends BaseSettingsProps {}
export interface GeneralSettingsProps extends BaseSettingsProps {}
export interface IntegrationSettingsProps extends BaseSettingsProps {}
export interface NotificationSettingsProps extends BaseSettingsProps {}
export interface OpportunitySettingsProps extends BaseSettingsProps {}
export interface OrganizationalSettingsProps extends BaseSettingsProps {}
export interface PartnerSettingsProps extends BaseSettingsProps {}
export interface PerformanceSettingsProps extends BaseSettingsProps {}
export interface SecuritySettingsProps extends BaseSettingsProps {}
export interface SectorManagementSettingsProps extends BaseSettingsProps {}
export interface StakeholderSettingsProps extends BaseSettingsProps {}
export interface SystemListSettingsProps extends BaseSettingsProps {}
export interface TeamSettingsProps extends BaseSettingsProps {}
export interface UISettingsProps extends BaseSettingsProps {}
export interface UserManagementSettingsProps extends BaseSettingsProps {}
export interface WorkflowSettingsProps extends BaseSettingsProps {}
