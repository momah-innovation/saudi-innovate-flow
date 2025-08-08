/**
 * Centralized type definitions for the application
 */

// Badge variants - matching shadcn/ui badge component
export type BadgeVariant = 
  | "default" 
  | "secondary" 
  | "destructive" 
  | "outline"
  | "success"
  | "warning";

// Common data structures
export interface Partner {
  id: string;
  name: string;
  organization?: string;
  partnership_status: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  description?: string;
  partnership_type?: string;
  expertise_areas?: string[];
  created_at: string;
  updated_at: string;
}

export interface Expert {
  id: string;
  user_id: string;
  expert_level: string;
  availability_status: string;
  specialization_areas?: string[];
  years_experience?: number;
  hourly_rate?: number;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_text_en?: string;
  question_type: string;
  category?: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

// Response data for focus questions
export interface QuestionResponse {
  id: string;
  focus_question_id: string;
  respondent_id: string;
  response_text: string;
  rating?: number;
  submitted_at: string;
  metadata?: Record<string, unknown>;
}

// Analytics data structure
export interface QuestionAnalytics {
  totalResponses: number;
  averageRating: number;
  completionRate: number;
  lastActivity: string | null;
  responseDistribution?: Record<string, number>;
}

// Challenge related types
export interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  budget_range?: string;
  target_audience?: string[];
  expected_outcomes?: string[];
  success_metrics?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

// System list items
export interface SystemListItem {
  label: string;
  value: string;
  color?: string;
  description?: string;
}

// File upload related types
export interface FileUploadConfig {
  uploadType: string;
  maxFiles: number;
  maxSizeBytes: number;
  allowedTypes: string[];
  acceptString: string;
  entityId?: string;
  bucketName?: string;
  folder?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

// Event and opportunity types
export interface Event {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: string;
  status: string;
  start_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  registration_deadline?: string;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  deadline?: string;
  budget_range?: string;
  requirements?: string[];
  benefits?: string[];
  created_at: string;
  updated_at: string;
}

// User profile types
export interface UserProfile {
  id: string;
  user_id: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  city?: string;
  organization?: string;
  job_title?: string;
  interests?: string[];
  skills?: string[];
  created_at: string;
  updated_at: string;
}

// Database table row types for better typing
export interface DatabaseChallenge extends Challenge {
  profiles?: UserProfile;
  challenge_partners?: Array<{ partners: Partner }>;
  challenge_experts?: Array<{ experts: Expert }>;
}

export interface DatabaseExpert extends Expert {
  profiles?: UserProfile;
}

export interface DatabasePartner extends Partner {
  partnership_events?: Array<{ events: Event }>;
}