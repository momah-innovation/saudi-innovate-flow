/**
 * Common type definitions for the application
 */

// Base Entity Interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User and Profile Types
export interface UserProfile extends BaseEntity {
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  organization?: string;
  position?: string;
  department?: string;
  sector?: string;
  expertise_areas?: string[];
  skills?: string[];
  interests?: string[];
  is_active: boolean;
}

// System List Types
export interface SystemDepartment extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
}

export interface SystemSector extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  is_active: boolean;
}

export interface SystemDomain extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  sector_id?: string;
  is_active: boolean;
}

export interface SystemService extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  domain_id?: string;
  is_active: boolean;
}

export interface SystemPartner extends BaseEntity {
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  logo_url?: string;
  partnership_type?: string;
  is_active: boolean;
}

export interface SystemExpert extends BaseEntity {
  user_id: string;
  name_ar: string;
  name_en?: string;
  bio_ar?: string;
  bio_en?: string;
  expertise_areas: string[];
  email?: string;
  phone?: string;
  linkedin_url?: string;
  is_active: boolean;
}

// Team and Assignment Types
export interface TeamMember extends BaseEntity {
  user_id: string;
  team_id: string;
  role: 'leader' | 'member' | 'observer';
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  profile?: UserProfile;
}

export interface TeamAssignment extends BaseEntity {
  team_id: string;
  challenge_id?: string;
  event_id?: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_at: string;
  due_date?: string;
  completed_at?: string;
}

export interface TeamProject extends BaseEntity {
  team_id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  progress_percentage: number;
}

export interface TeamActivity extends BaseEntity {
  team_id: string;
  user_id?: string;
  activity_type: 'assignment' | 'project' | 'meeting' | 'discussion' | 'milestone';
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  metadata?: Record<string, unknown>;
}

// Form and Component Props Types
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  description?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'search' | 'toggle';
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: unknown;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp?: string;
}

// Event and Activity Types
export interface SystemActivity extends BaseEntity {
  user_id?: string;
  entity_type: 'challenge' | 'idea' | 'event' | 'team' | 'user' | 'system';
  entity_id?: string;
  action: string;
  details_ar: string;
  details_en?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

// Translation Types
export interface TranslationPair {
  ar: string;
  en?: string;
}

export interface SystemTranslation extends BaseEntity {
  translation_key: string;
  text_ar: string;
  text_en?: string;
  category: string;
  context?: string;
  is_active: boolean;
}

// Generic utility types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'draft' | 'archived';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list' | 'table';
export type Language = 'ar' | 'en';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total?: number;
}

// Component Event Handlers
export type EntityActionHandler<T = unknown> = (entity: T) => void;
export type EntityAsyncActionHandler<T = unknown> = (entity: T) => Promise<void>;

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}