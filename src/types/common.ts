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
  sensitivity_level: string; // flexible to accommodate any sensitivity level from database
  theme?: string;
  domain?: string;
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