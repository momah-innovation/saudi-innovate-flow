// Core data types for the Government Innovation Platform
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User & Profile Types
export interface User extends BaseEntity {
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

export interface Profile extends BaseEntity {
  user_id: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  position?: string;
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  role: 'admin' | 'innovator' | 'expert' | 'evaluator' | 'manager';
  is_active: boolean;
  email_verified: boolean;
  preferences?: Record<string, any>;
}

// System Lists & Reference Data
export interface Department extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  deputy_id?: string;
  is_active: boolean;
}

export interface Deputy extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface Sector extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface Domain extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  sector_id?: string;
  is_active: boolean;
}

export interface SubDomain extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  domain_id: string;
  is_active: boolean;
}

export interface Service extends BaseEntity {
  name: string;
  name_en: string;
  code: string;
  description?: string;
  department_id?: string;
  is_active: boolean;
}

// Challenge Types
export interface Challenge extends BaseEntity {
  title: string;
  description: string;
  objectives?: string;
  success_criteria?: string;
  expected_outcomes?: string;
  implementation_timeline?: string;
  
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sensitivity: 'public' | 'internal' | 'confidential' | 'top_secret';
  
  start_date: string;
  end_date: string;
  submission_deadline?: string;
  
  min_budget?: number;
  max_budget?: number;
  currency: string;
  budget_justification?: string;
  
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
  
  creator_id: string;
  manager_id?: string;
  
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Focus Question Types
export interface FocusQuestion extends BaseEntity {
  challenge_id?: string;
  question_text: string;
  question_type: 'open_ended' | 'multiple_choice' | 'rating' | 'yes_no' | 'file_upload';
  sensitivity: 'public' | 'internal' | 'confidential' | 'top_secret';
  display_order: number;
  is_required: boolean;
  is_active: boolean;
  
  // For multiple choice questions
  options?: string[];
  
  // For rating questions
  min_rating?: number;
  max_rating?: number;
  rating_labels?: string[];
  
  // For file upload questions
  allowed_file_types?: string[];
  max_file_size?: number;
  
  metadata?: Record<string, any>;
}

// Idea Types
export interface Idea extends BaseEntity {
  title: string;
  description: string;
  problem_statement?: string;
  proposed_solution?: string;
  expected_impact?: string;
  implementation_plan?: string;
  
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sensitivity: 'public' | 'internal' | 'confidential' | 'top_secret';
  
  challenge_id?: string;
  campaign_id?: string;
  event_id?: string;
  
  innovator_id: string;
  team_members?: string[];
  
  estimated_budget?: number;
  estimated_timeline?: string;
  required_resources?: string;
  
  tags?: string[];
  attachments?: string[];
  
  evaluation_score?: number;
  evaluation_feedback?: string;
  
  is_featured: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Expert & Partnership Types
export interface Expert extends BaseEntity {
  profile_id: string;
  expertise_areas: string[];
  specializations: string[];
  years_of_experience: number;
  bio: string;
  credentials?: string[];
  languages?: string[];
  availability_status: 'available' | 'busy' | 'unavailable';
  hourly_rate?: number;
  rating?: number;
  total_reviews?: number;
  is_verified: boolean;
  is_active: boolean;
}

export interface Partner extends BaseEntity {
  name: string;
  name_en: string;
  type: 'government' | 'private' | 'academic' | 'non_profit' | 'international';
  description?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_person?: string;
  logo_url?: string;
  
  services_offered?: string[];
  expertise_areas?: string[];
  
  partnership_status: 'active' | 'inactive' | 'pending' | 'suspended';
  partnership_type: 'strategic' | 'operational' | 'technical' | 'financial';
  
  contract_start_date?: string;
  contract_end_date?: string;
  
  is_featured: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Team & Assignment Types
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  type: 'innovation' | 'evaluation' | 'implementation' | 'research';
  status: 'active' | 'inactive' | 'disbanded';
  
  department_id?: string;
  manager_id: string;
  
  max_members?: number;
  current_member_count: number;
  
  skills_required?: string[];
  objectives?: string[];
  
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface TeamMember extends BaseEntity {
  team_id: string;
  profile_id: string;
  role: 'leader' | 'member' | 'coordinator' | 'specialist';
  status: 'active' | 'inactive' | 'pending' | 'left';
  
  responsibilities?: string[];
  skills_contributed?: string[];
  
  joined_at: string;
  left_at?: string;
  
  performance_rating?: number;
  feedback?: string;
  
  is_active: boolean;
}

export interface Assignment extends BaseEntity {
  title: string;
  description: string;
  type: 'challenge' | 'idea' | 'evaluation' | 'research' | 'implementation';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  assignee_id: string;
  assigner_id: string;
  team_id?: string;
  
  due_date: string;
  estimated_hours?: number;
  actual_hours?: number;
  
  deliverables?: string[];
  requirements?: string;
  success_criteria?: string;
  
  progress_percentage: number;
  completion_notes?: string;
  
  challenge_id?: string;
  idea_id?: string;
  
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Campaign & Event Types
export interface Campaign extends BaseEntity {
  title: string;
  description: string;
  objectives?: string;
  target_audience?: string;
  
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  type: 'innovation' | 'awareness' | 'recruitment' | 'evaluation';
  
  start_date: string;
  end_date: string;
  
  budget?: number;
  allocated_budget?: number;
  spent_budget?: number;
  
  department_id?: string;
  manager_id: string;
  
  target_participants?: number;
  actual_participants?: number;
  
  success_metrics?: string[];
  kpis?: Record<string, any>;
  
  is_featured: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface Event extends BaseEntity {
  title: string;
  description: string;
  type: 'workshop' | 'seminar' | 'hackathon' | 'competition' | 'presentation' | 'meeting';
  format: 'in_person' | 'virtual' | 'hybrid';
  
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  
  location?: string;
  virtual_link?: string;
  capacity?: number;
  
  organizer_id: string;
  department_id?: string;
  
  registration_required: boolean;
  registration_fee?: number;
  
  agenda?: string;
  materials?: string[];
  
  attendee_count?: number;
  feedback_score?: number;
  
  challenge_id?: string;
  campaign_id?: string;
  
  is_featured: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Evaluation Types
export interface Evaluation extends BaseEntity {
  idea_id: string;
  evaluator_id: string;
  
  criteria_scores: Record<string, number>;
  overall_score: number;
  feedback: string;
  recommendations?: string;
  
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  
  evaluation_date: string;
  time_spent_minutes?: number;
  
  strengths?: string[];
  weaknesses?: string[];
  improvement_suggestions?: string[];
  
  is_final: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Opportunity & Application Types
export interface Opportunity extends BaseEntity {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  
  type: 'job' | 'internship' | 'volunteer' | 'partnership' | 'grant' | 'competition';
  status: 'open' | 'closed' | 'on_hold' | 'cancelled';
  
  department_id?: string;
  contact_person?: string;
  contact_email?: string;
  
  application_deadline: string;
  start_date?: string;
  end_date?: string;
  
  required_skills?: string[];
  preferred_qualifications?: string[];
  
  location?: string;
  is_remote: boolean;
  
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  
  application_count?: number;
  view_count?: number;
  
  is_featured: boolean;
  is_active: boolean;
  metadata?: Record<string, any>;
}

// Analytics & Metrics Types
export interface AnalyticsData {
  overview: {
    total: number;
    active: number;
    completed: number;
    percentage_change: number;
  };
  distributions: {
    by_type: Array<{ name: string; value: number; percentage: number }>;
    by_status: Array<{ name: string; value: number; percentage: number }>;
    by_department: Array<{ name: string; value: number; percentage: number }>;
  };
  trends: {
    monthly: Array<{
      month: string;
      created: number;
      completed: number;
      active: number;
    }>;
  };
  performance: {
    top_performers: Array<{
      id: string;
      name: string;
      score: number;
      metric: string;
    }>;
    success_rate: number;
    average_completion_time: number;
  };
}

// Utility Types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type SensitivityLevel = 'public' | 'internal' | 'confidential' | 'top_secret';
export type UserRole = 'admin' | 'innovator' | 'expert' | 'evaluator' | 'manager';

// Form & UI Types
export interface FormErrors {
  [key: string]: string;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  department_id?: string;
  priority?: string;
  sensitivity?: string;
  date_from?: string;
  date_to?: string;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingItem?: any;
}

export interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export interface ManagementListProps {
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
}