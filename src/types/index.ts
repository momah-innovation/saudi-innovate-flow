/**
 * Centralized type definitions for the application
 */

// Badge variants - matching shadcn/ui badge component  
export type BadgeVariant = 
  | "default" 
  | "secondary" 
  | "destructive" 
  | "outline";

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
  opportunity_type: "job" | "internship" | "volunteer" | "partnership" | "grant" | "competition";
  status: "open" | "cancelled" | "on_hold" | "closed";
  deadline?: string;
  budget_range?: string | string[]; // Can be string or array
  requirements?: string | string[]; // Can be string or array  
  benefits?: string[];
  // Additional fields for compatibility
  title?: string;
  description?: string;
  type?: string;
  department_id?: string;
  contact_person?: string;
  contact_email?: string;
  application_deadline?: string;
  start_date?: string;
  end_date?: string;
  required_skills?: string[];
  preferred_qualifications?: string[];
  location?: string;
  is_remote?: boolean;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
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

// Legacy type definitions for compatibility
export interface Idea {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends UserProfile {}

export interface Team {
  id: string;
  name: string;
  description?: string;
  department_id?: string; // Missing property
  manager_id?: string; // Missing property
  max_members?: number; // Missing property
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  assigned_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  idea_id: string;
  score: number;
  feedback?: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Deputy extends Department {}
export interface Sector extends Department {}
export interface Domain extends Department {}
export interface SubDomain extends Department {}
export interface Service extends Department {}

// Form data interfaces - using hook interface to avoid conflicts
export type { CampaignFormData } from '@/hooks/useCampaignManagement';
export interface IdeaFormData {
  // Optional base fields for forms
  id?: string;
  title?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // Form-specific fields
  title_ar: string;
  description_ar: string;
  status: string;
  innovator_id?: string;
  maturity_level?: string;
  challenge_id?: string;
  focus_question_id?: string;
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  resource_requirements?: string;
  campaign_id?: string;
  event_id?: string;
}
export interface EventFormData {
  // Optional base fields for forms
  id?: string;
  created_at?: string;
  updated_at?: string;
  // Required Event fields
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: string;
  status: string;
  start_date?: string; // Optional for form
  end_date?: string;
  location?: string;
  registration_deadline?: string;
  // Additional properties used in EventWizard
  event_date?: string;
  format?: string;
  budget?: string | number;
  virtual_link?: string;
  start_time?: string;
  end_time?: string;
  is_recurring?: boolean;
  max_participants?: string | number; // Used as string in form
  registered_participants?: string; // Used as string in form, not number
  actual_participants?: string; // Used as string in form, not number
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_visibility?: string;
  event_category?: string;
  inherit_from_campaign?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  target_stakeholder_groups?: string[];
}

export interface SystemLists {
  departments: Department[];
  deputies: Deputy[];
  sectors: Sector[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
}

export interface ManagementListProps<T = unknown> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
}