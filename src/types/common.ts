/**
 * Common Type Definitions - Phase 6 Type Safety Implementation
 * Replaces 'any' types with proper TypeScript interfaces
 */

// ✅ BASE ENTITY TYPES
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// ✅ SYSTEM ORGANIZATIONAL TYPES
export interface SystemSector extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface SystemDepartment extends BaseEntity {
  name_ar: string;
  name_en: string;
  description?: string;
  sector_id?: string;
  status: 'active' | 'inactive';
}

export interface SystemDomain extends BaseEntity {
  name_ar: string;
  name_en: string;
  description?: string;
  department_id?: string;
  status: 'active' | 'inactive';
}

export interface SystemPartner {
  id: string;
  name: string; // actual database field
  name_ar: string;
  name_en: string;
  description?: string;
  organization_type?: 'government' | 'private' | 'non_profit' | 'academic'; // optional to match database
  status?: string; // flexible to match any database status
  created_at?: string; // optional to match database
  updated_at?: string; // optional to match database
}

export interface SystemExpert extends BaseEntity {
  user_id: string;
  expertise_areas: string[];
  certifications?: string[];
  years_of_experience?: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  rating?: number;
}

// ✅ ORGANIZATIONAL ENTITY TYPES
export interface Entity extends BaseEntity {
  name_ar: string;
  name_en: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface Deputy extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en: string;
  entity_id: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface Department extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en: string;
  deputy_id?: string;
  entity_id?: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface Domain extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en: string;
  department_id?: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface SubDomain extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en?: string; // optional to match database
  domain_id: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface Service extends BaseEntity {
  name: string; // actual database field
  name_ar: string;
  name_en?: string; // optional to match database
  sub_domain_id?: string;
  description?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

// ✅ ERROR TYPES
export interface AppError extends Error {
  code?: string | number;
  status?: number;
  statusCode?: number; // Alternative property name for compatibility
  timestamp?: string; // For error tracking
  details?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

// ✅ USER AND PROFILE TYPES
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  expertise: string[];
  department?: string;
  organization?: string;
  role?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

// ✅ ROLE AND PERMISSIONS TYPES
export interface RolePermissions {
  canManageUsers: boolean;
  canViewAdmin: boolean;
  canEditChallenges: boolean;
  canReviewSubmissions: boolean;
  canAccessAnalytics: boolean;
  canManageSettings: boolean;
  canModerateContent: boolean;
  canManageEvents: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  expires_at?: string;
  granted_at: string;
}

// ✅ CHALLENGE TYPES
export interface Challenge {
  id: string;
  title_ar: string; // actual database field
  title_en?: string;
  description_ar: string; // actual database field  
  description_en?: string;
  title?: string; // for backward compatibility
  description?: string; // for backward compatibility
  status: string; // flexible to accommodate any status from database
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  priority_level?: string; // Flexible to accommodate database values
  sensitivity_level: string; // flexible to accommodate any sensitivity level from database
  challenge_type?: string; // For challenge form compatibility
  theme?: string;
  domain?: string;
  domain_id?: string; // For form compatibility
  sub_domain_id?: string; // For form compatibility
  service_id?: string; // For form compatibility
  deputy_id?: string; // For form compatibility
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  partner_organization_id?: string;
  department_id?: string;
  sector_id?: string;
}

// ✅ IDEA TYPES
export interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  category: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  challenge_id?: string;
  implementation_notes?: string;
  feedback?: string;
}

// ✅ EVENT TYPES
export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: 'workshop' | 'seminar' | 'conference' | 'webinar' | 'networking' | 'training';
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  location?: string;
  virtual_link?: string;
  max_participants?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ✅ COMPONENT SPECIFIC TYPES - UI INTERFACES
export interface ChallengeTeamMember {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  role: string;
  expertise_areas?: string[];
  joined_at: string;
  is_team_lead?: boolean;
}

export interface ChallengeTeamWorkspace {
  team_id: string;
  team_name: string;
  leader_id: string;
  members?: ChallengeTeamMember[];
  challenge_id: string;
  status: 'active' | 'inactive' | 'completed';
  created_at: string;
}

export interface ActivityFeedEvent {
  id: string;
  entity_type: 'challenge' | 'idea' | 'opportunity' | 'event';
  event_type: 'create' | 'update' | 'submit' | 'comment' | 'like' | 'share';
  actor_id: string;
  actor_name: string;
  actor_avatar?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  entity_title?: string;
}

export interface LiveDocumentContent {
  version: number;
  content: Record<string, unknown>;
  last_modified: string;
  modified_by: string;
  collaborators: string[];
  permissions?: DocumentPermissions;
}

export interface DocumentPermissions {
  read: string[];
  write: string[];
  admin: string[];
}

export interface TagSelectorProps {
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowCustomTags?: boolean;
  suggestedTags?: string[];
}

export interface UserMentionOption {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  is_available?: boolean;
}

export interface OrganizationReference {
  id: string;
  name: string;
  type: 'government' | 'private' | 'non_profit' | 'academic';
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  upload_date: string;
}

export interface DashboardUserProfile extends UserProfile {
  user_roles: UserRole[];
  department?: string; // Keep as string for compatibility
  organization?: string; // Keep as string for compatibility  
  permissions?: string[];
  recent_activity?: ActivityFeedEvent[];
}

export interface IdeaTemplateStructure {
  template_data: {
    sections: TemplateSection[];
    fields: TemplateField[];
    guidelines: string[];
    estimated_time: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  icon?: string;
}

export interface TemplateField {
  id: string;
  section_id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'date' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: FieldValidation;
}

export interface FieldValidation {
  min_length?: number;
  max_length?: number;
  pattern?: string;
  custom_message?: string;
}

export interface SuccessStoryMetrics {
  implementation_timeline: TimelineStep[];
  roi_metrics: ROIMetric[];
  impact_areas: ImpactArea[];
  testimonials: StoryTestimonial[];
  media_urls: MediaFile[];
}

export interface TimelineStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  duration: string;
  milestone: boolean;
  completed: boolean;
  start_date?: string;
  end_date?: string;
}

export interface ROIMetric {
  metric: string;
  value: number;
  unit: string;
  timeframe: string;
  category: 'financial' | 'operational' | 'social' | 'environmental';
  trend?: 'increasing' | 'decreasing' | 'stable';
}

export interface ImpactArea {
  area: string;
  description: string;
  beneficiaries: number;
  measurable_outcomes: string[];
  geographic_scope?: string;
}

export interface StoryTestimonial {
  id: string;
  author: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
  date: string;
  verified: boolean;
}

// ✅ NOTIFICATION TYPES
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'challenge' | 'idea' | 'event' | 'social';
  read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  read_at?: string;
}

// ✅ TEAM TYPES
export interface TeamMember {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  department?: string;
  expertise: string[];
  status: 'active' | 'inactive';
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  lead_id: string;
  created_at: string;
  updated_at: string;
}

// ✅ ANALYTICS TYPES
export interface AnalyticsMetric {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  period: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    growthRate: number;
    trend: 'up' | 'down' | 'stable';
  };
  challenges: {
    total: number;
    active: number;
    completed: number;
    submissions: number;
    completionRate: number;
  };
  engagement: {
    avgSessionDuration: number;
    pageViews: number;
    interactions: number;
    returnRate: number;
  };
  business: {
    implementedIdeas: number;
    budgetUtilized: number;
    partnershipValue: number;
    roi: number;
  };
}

// ✅ FORM TYPES
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'file' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string; }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface FormData {
  [key: string]: string | string[] | number | boolean | File | File[] | null | undefined;
}

// ✅ API RESPONSE TYPES
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ✅ SETTINGS TYPES
export interface SystemSettings {
  platform_name: string;
  default_language: 'en' | 'ar';
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  max_file_size_mb: number;
  allowed_file_types: string[];
  session_timeout_minutes: number;
}

export interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'never';
  categories: {
    system: boolean;
    challenges: boolean;
    ideas: boolean;
    events: boolean;
    social: boolean;
  };
}

// ✅ FILE AND STORAGE TYPES
export interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  bucket: string;
  path: string;
  uploaded_by: string;
  uploaded_at: string;
  metadata?: Record<string, unknown>;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  buckets: Array<{
    name: string;
    fileCount: number;
    size: number;
    isPublic: boolean;
  }>;
}

// ✅ ERROR AND LOADING TYPES
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
  details?: Record<string, unknown>;
}

// ✅ THEME AND UI TYPES
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize: 'sm' | 'md' | 'lg';
}

export interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  activeTab: string;
  currentPage: string;
  breadcrumbs: Array<{ label: string; href?: string; }>;
}

// ✅ UTILITY TYPES
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Sensitivity = 'normal' | 'restricted' | 'confidential';

// ✅ ANALYTICS AND METRICS TYPES
export interface CoreMetrics {
  users: {
    total: number;
    active: number;
    new: number;
    growthRate: number;
  };
  challenges: {
    total: number;
    active: number;
    completed: number;
    submissions: number;
    completionRate: number;
  };
  engagement: {
    avgSessionDuration: number;
    pageViews: number;
    interactions: number;
    returnRate: number;
  };
  business: {
    implementedIdeas: number;
    budgetUtilized: number;
    partnershipValue: number;
    roi: number;
  };
}

export interface SecurityMetrics {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatCount: number;
  suspiciousActivities: number;
  rateLimitViolations: number;
  failedLogins: number;
}

export interface RoleBasedMetrics {
  userSpecific: Record<string, any>;
  roleSpecific: Record<string, any>;
  departmentSpecific: Record<string, any>;
}

export interface AnalyticsFilters {
  timeframe?: '7d' | '30d' | '90d' | '1y';
  userRole?: string;
  department?: string;
  sector?: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  event_category: string;
  properties: Record<string, any>;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  action_type: string;
  resource_type: string;
  resource_id?: string;
  details: Record<string, any>;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

// ✅ MIGRATION AND SYSTEM OPERATION TYPES
export interface MigrationStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  executedAt: string;
  executedBy: string;
  details: Record<string, any>;
  error?: string;
}

export interface MigrationResult {
  migrationId: string;
  success: boolean;
  duration: number;
  message: string;
  affectedRecords: number;
  errors: string[];
}

export interface SystemOperation {
  type: string;
  component?: string;
  resourceType?: string;
  resourceId?: string;
  details: Record<string, any>;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// ✅ QUERY KEY TYPES (Phase 7 Type Safety)
export type QueryKey = (string | number | boolean | Record<string, any>)[];

export interface CacheWarmingTask {
  queryKey: QueryKey;
  priority: 'critical' | 'high' | 'medium' | 'low';
  staleTime: number;
  condition?: () => boolean;
}

export interface WarmingMetrics {
  totalTasks: number;
  warmedQueries: number;
  warmingRatio: number;
  queueLength: number;
  activeRequests: number;
}

// ✅ CAMPAIGN MANAGEMENT TYPES
export interface CampaignOptions {
  sectors: SystemSector[];
  deputies: Deputy[];
  departments: Department[];
  challenges: Challenge[];
  partners: SystemPartner[];
  stakeholders: Stakeholder[];
  managers: Manager[];
}

export interface Stakeholder extends BaseEntity {
  name: string; // actual database field  
  name_ar?: string; // optional to match database
  name_en?: string;
  organization?: string;
  role?: string;
  contact_email?: string;
  status?: 'active' | 'inactive'; // optional to match database
}

export interface Manager {
  id: string;
  name: string; // actual database field
  name_ar?: string; // optional to match database
  email: string;
  position?: string;
  status?: 'active' | 'inactive'; // optional to match database
  created_at?: string; // optional to match database
  updated_at?: string; // optional to match database
}

// ✅ CHALLENGE MANAGEMENT TYPES
export interface ChallengeOptions {
  departments: Department[];
  deputies: Deputy[];
  sectors: SystemSector[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
  partners: SystemPartner[];
  experts: Expert[];
}

export interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  certifications?: string[];
  years_of_experience?: number;
  availability_status?: 'available' | 'busy' | 'unavailable'; // optional to match database
  rating?: number;
  created_at?: string; // optional to match database
  updated_at?: string; // optional to match database
}

// ✅ NAVIGATION AND CACHE TYPES
export interface NavigationContext {
  currentPath: string;
  previousPath?: string;
  userRole?: string;
  permissions?: string[];
}

export interface CacheContext {
  user: UserProfile | null;
  role: string | null;
  permissions: string[];
  aggressiveMode: boolean;
}

// Query & Prefetch types for hooks
export interface QueryKeyConfig {
  entity: string;
  operation: string;
  params?: Record<string, any>;
}

export interface UserBehaviorPattern {
  route: string;
  frequency: number;
  lastVisited: number;
  timeSpent: number;
  interactions: string[];
}

export interface PrefetchPriority {
  queryKey: QueryKeyConfig[];
  priority: 'high' | 'medium' | 'low';
  staleTime: number;
}

// Helper type for making all properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Helper type for making specific properties required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ✅ ENTITY RELATIONSHIP TYPES (For UI Components)
export interface TeamMemberExtended {
  id: string;
  user_id: string;
  email?: string;
  name?: string;
  specialization?: string;
  role?: string;
  department?: string;
  status?: 'active' | 'inactive';
  join_date?: string;
  last_active?: string;
  campaigns?: CampaignReference[];
  challenges?: ChallengeReference[];
  events?: Event[];
  projects?: ProjectReference[];
  stakeholders?: Stakeholder[];
  partners?: SystemPartner[];
  experts?: Expert[];
  team_members?: TeamMemberExtended[];
  activeAssignments?: number;
  completedAssignments?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectReference {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  progress?: number;
  start_date?: string;
  end_date?: string;
}

// ✅ FORM DATA TYPES  
export interface CampaignFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  campaign_manager_id?: string;
  department_id?: string;
  sector_id?: string;
  deputy_id?: string;
  target_participants?: number;
  target_ideas?: number;
  registration_deadline?: string;
  theme?: string;
  success_metrics?: string;
}

export interface ChallengeFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'closed';
  challenge_type?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration?: number;
  rewards_ar?: string;
  rewards_en?: string;
  submission_deadline?: string;
  department_id?: string;
  sector_id?: string;
  partner_organization_id?: string;
  created_by?: string;
  sensitivity_level?: 'normal' | 'restricted' | 'confidential';
  priority_level?: 'low' | 'medium' | 'high' | 'urgent';
}

// ✅ ENTITY REFERENCE TYPES (For Transformation Functions)
export interface DepartmentReference {
  id: string;
  name: string;
  name_ar?: string;
  department_head?: string;
}

export interface DeputyReference {
  id: string;
  name: string;
  name_ar?: string;
  deputy_minister?: string;
}

export interface SectorReference {
  id: string;
  name: string;
  name_ar?: string;
}

export interface CampaignReference {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
}

export interface ChallengeReference {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
}