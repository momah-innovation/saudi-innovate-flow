// API Response Types for the Government Innovation Platform

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  count?: number;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Database Row Types (matching Supabase schema)
export interface ChallengeRow {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  actual_budget?: number;
  created_by?: string;
  challenge_owner_id?: string;
  assigned_expert_id?: string;
  partner_organization_id?: string;
  sector_id?: string;
  department_id?: string;
  deputy_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
  vision_2030_goal?: string;
  kpi_alignment?: string;
  internal_team_notes?: string;
  collaboration_details?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string;
  title_ar: string;
  description_ar?: string;
  status: string;
  theme?: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  target_participants?: number;
  target_ideas?: number;
  budget?: number;
  success_metrics?: string;
  campaign_manager_id?: string;
  challenge_id?: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaRow {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level?: string;
  overall_score?: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  resource_requirements?: string;
  estimated_timeline?: string;
  collaboration_open?: boolean;
  visibility_level?: string;
  alignment_score?: number;
  feasibility_score?: number;
  innovation_score?: number;
  impact_score?: number;
  comment_count?: number;
  view_count?: number;
  like_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EventRow {
  id: string;
  title_ar: string;
  description_ar?: string;
  event_type: string;
  event_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  virtual_link?: string;
  format: string;
  max_participants?: number;
  registered_participants?: number;
  actual_participants?: number;
  status: string;
  budget?: number;
  event_manager_id?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_visibility?: string;
  event_category?: string;
  inherit_from_campaign?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  target_stakeholder_groups?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  role?: string;
  is_active: boolean;
  email_verified?: boolean;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export interface DepartmentRow {
  id: string;
  name: string;
  name_ar?: string;
  department_head?: string;
  deputy_id?: string;
  budget_allocation?: number;
  created_at: string;
  updated_at: string;
}

export interface DeputyRow {
  id: string;
  name: string;
  name_ar?: string;
  deputy_minister?: string;
  contact_email?: string;
  sector_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SectorRow {
  id: string;
  name: string;
  name_ar?: string;
  created_at: string;
  updated_at: string;
}

export interface DomainRow {
  id: string;
  name: string;
  name_ar?: string;
  domain_lead?: string;
  department_id?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export interface FocusQuestionRow {
  id: string;
  challenge_id?: string;
  question_text_ar: string;
  question_type: string;
  sensitivity_level: string;
  order_sequence: number;
  is_required: boolean;
  is_active: boolean;
  options?: string[];
  min_rating?: number;
  max_rating?: number;
  rating_labels?: string[];
  allowed_file_types?: string[];
  max_file_size?: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface PartnerRow {
  id: string;
  name: string;
  name_ar?: string;
  partnership_type: string;
  partnership_status: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  description?: string;
  services_offered?: string[];
  expertise_areas?: string[];
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface StakeholderRow {
  id: string;
  name: string;
  name_ar?: string;
  stakeholder_type: string;
  influence_level: string;
  engagement_status: string;
  contact_email?: string;
  contact_phone?: string;
  organization?: string;
  role_title?: string;
  interests?: string[];
  concerns?: string[];
  created_at: string;
  updated_at: string;
}

// Enriched types with relationships
export interface ChallengeWithRelations extends ChallengeRow {
  sector?: SectorRow;
  department?: DepartmentRow;
  deputy?: DeputyRow;
  domain?: DomainRow;
  created_by_profile?: ProfileRow;
  challenge_owner?: ProfileRow;
  assigned_expert?: ProfileRow;
  partner_organization?: PartnerRow;
  focus_questions?: FocusQuestionRow[];
  participants_count?: number;
  submissions_count?: number;
  ideas_count?: number;
}

export interface CampaignWithRelations extends CampaignRow {
  sector?: SectorRow;
  department?: DepartmentRow;
  deputy?: DeputyRow;
  challenge?: ChallengeRow;
  campaign_manager?: ProfileRow;
  linked_challenges?: ChallengeRow[];
  linked_partners?: PartnerRow[];
  linked_stakeholders?: StakeholderRow[];
  participants_count?: number;
  ideas_count?: number;
}

export interface IdeaWithRelations extends IdeaRow {
  innovator?: ProfileRow;
  challenge?: ChallengeRow;
  focus_question?: FocusQuestionRow;
  campaign?: CampaignRow;
  evaluations?: any[];
  comments?: any[];
  attachments?: any[];
}

export interface EventWithRelations extends EventRow {
  event_manager?: ProfileRow;
  campaign?: CampaignRow;
  challenge?: ChallengeRow;
  sector?: SectorRow;
  linked_partners?: PartnerRow[];
  linked_stakeholders?: StakeholderRow[];
  linked_focus_questions?: FocusQuestionRow[];
  linked_challenges?: ChallengeRow[];
  attendees?: ProfileRow[];
  feedback?: any[];
}

// Query filter types
export interface ChallengeFilters {
  status?: string;
  priority_level?: string;
  sensitivity_level?: string;
  challenge_type?: string;
  sector_id?: string;
  department_id?: string;
  deputy_id?: string;
  created_by?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface CampaignFilters {
  status?: string;
  theme?: string;
  sector_id?: string;
  department_id?: string;
  deputy_id?: string;
  campaign_manager_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface IdeaFilters {
  status?: string;
  maturity_level?: string;
  challenge_id?: string;
  innovator_id?: string;
  score_min?: number;
  score_max?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface EventFilters {
  status?: string;
  event_type?: string;
  format?: string;
  event_category?: string;
  event_visibility?: string;
  campaign_id?: string;
  challenge_id?: string;
  sector_id?: string;
  event_manager_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

// Sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Common query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: SortOptions;
  filters?: any;
  include_relations?: boolean;
}

// Bulk operations
export interface BulkUpdateRequest<T> {
  ids: string[];
  updates: Partial<T>;
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkOperationResponse {
  success_count: number;
  error_count: number;
  errors?: { id: string; error: string }[];
}

// Analytics types
export interface AnalyticsMetrics {
  total_count: number;
  active_count: number;
  growth_rate: number;
  completion_rate?: number;
  average_score?: number;
  distribution: { label: string; value: number; percentage: number }[];
}

export interface TrendData {
  period: string;
  value: number;
  change_from_previous?: number;
}

export interface AnalyticsResponse {
  overview: AnalyticsMetrics;
  trends: TrendData[];
  distributions: {
    by_status: { label: string; value: number; percentage: number }[];
    by_type: { label: string; value: number; percentage: number }[];
    by_department: { label: string; value: number; percentage: number }[];
  };
  top_performers?: {
    id: string;
    name: string;
    score: number;
    metric: string;
  }[];
}

// Detail View Types
export interface DetailViewProps<T> {
  isOpen: boolean;
  onClose: () => void;
  item: T | null;
  onEdit: (item: T) => void;
  onRefresh: () => void;
}

// Aliases for existing types
export type Challenge = ChallengeWithRelations;
export type Idea = IdeaWithRelations;
export type Campaign = CampaignWithRelations;
export type Event = EventWithRelations;
export type Partner = PartnerRow;
export type Stakeholder = StakeholderRow;
export type FocusQuestion = FocusQuestionRow;
export type Department = DepartmentRow;
export type Deputy = DeputyRow;
export type Sector = SectorRow;
export type Domain = DomainRow;

// Enhanced detail view types
export interface ChallengeDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  onEdit: (challenge: Challenge) => void;
  onRefresh: () => void;
}

export interface IdeaDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  idea: IdeaDetailView | null;
  onEdit: (idea: IdeaDetailView) => void;
  onRefresh: () => void;
}

export interface IdeaDetailView extends Idea {
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  resource_requirements?: string;
  challenge?: Challenge;
  focus_question?: FocusQuestion;
}

// Expert types (extending existing structure)
export interface Expert {
  id: string;
  user_id: string;
  expertise_areas: string[];
  expert_level: 'junior' | 'senior' | 'lead' | 'principal';
  availability_status: 'available' | 'busy' | 'unavailable';
  hourly_rate?: number;
  bio?: string;
  years_of_experience?: number;
  certification_level?: string;
  specialization_tags?: string[];
  max_concurrent_projects?: number;
  preferred_project_types?: string[];
  language_preferences?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    email: string;
    profile_image_url?: string;
  };
}

export interface ExpertDetailViewProps extends DetailViewProps<ExpertDetailView> {
  expert: ExpertDetailView | null;
}

export interface ExpertDetailView extends Expert {
  assignments?: any[];
  evaluations?: any[];
  team_activities?: any[];
  workload_info?: {
    current_workload: number;
    max_concurrent_projects: number;
    utilization_percentage: number;
  };
}

export interface PartnerDetailViewProps extends DetailViewProps<PartnerDetailView> {
  partner: PartnerDetailView | null;
}

export interface PartnerDetailView extends Partner {
  active_collaborations?: Challenge[];
  partnership_history?: any[];
  partnership_metrics?: {
    total_collaborations: number;
    success_rate: number;
    average_rating: number;
  };
}

// Opportunity types
export interface OpportunityRow {
  id: string;
  title_ar: string;
  description_ar: string;
  status: 'open' | 'closed' | 'paused';
  opportunity_type: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  requirements?: string[];
  deliverables?: string[];
  application_process?: string;
  evaluation_criteria?: string[];
  created_by?: string;
  sector_id?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OpportunityWithRelations extends OpportunityRow {
  sector?: SectorRow;
  department?: DepartmentRow;
  created_by_profile?: ProfileRow;
  applications_count?: number;
  views_count?: number;
  likes_count?: number;
}

export type Opportunity = OpportunityWithRelations;

export interface OpportunityDetailViewProps extends DetailViewProps<OpportunityDetailView> {
  opportunity: OpportunityDetailView | null;
}

export interface OpportunityDetailView extends Opportunity {
  applications?: any[];
  analytics?: {
    views_count: number;
    applications_count: number;
    likes_count: number;
    conversion_rate: number;
  };
}

// All interfaces are already exported above