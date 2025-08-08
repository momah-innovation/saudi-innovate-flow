/**
 * Events System Types - Comprehensive type definitions for event wizards and management
 */

// Event Resource Types
export interface EventResource {
  id: string;
  title: string;
  title_ar?: string;
  type: 'document' | 'video' | 'link' | 'presentation' | 'tool' | 'template';
  url: string;
  description?: string;
  description_ar?: string;
  is_required: boolean;
  file_size?: number;
  file_format?: string;
  created_at: string;
  created_by: string;
}

// Partner Types for Events
export interface EventPartner {
  id: string;
  name: string;
  name_ar?: string;
  partnership_type: 'sponsor' | 'collaborator' | 'supporter' | 'media' | 'vendor' | 'strategic';
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  partnership_level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';
  contribution_details?: string;
  is_active: boolean;
  partnership_start_date?: string;
  partnership_end_date?: string;
}

// Stakeholder Types for Events  
export interface EventStakeholder {
  id: string;
  name: string;
  name_ar?: string;
  role: 'organizer' | 'speaker' | 'moderator' | 'facilitator' | 'advisor' | 'coordinator';
  organization?: string;
  organization_ar?: string;
  position?: string;
  position_ar?: string;
  bio?: string;
  bio_ar?: string;
  profile_image?: string;
  contact_email?: string;
  contact_phone?: string;
  linkedin_url?: string;
  expertise_areas?: string[];
  speaking_topics?: string[];
  is_keynote_speaker?: boolean;
  availability_status: 'confirmed' | 'pending' | 'declined' | 'tentative';
}

// Campaign Types for Events
export interface EventCampaign {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  campaign_type: 'awareness' | 'recruitment' | 'engagement' | 'educational' | 'promotional';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  target_audience?: string[];
  budget_allocated?: number;
  expected_reach?: number;
  success_metrics?: string[];
  related_events?: string[];
}

// Challenge Types for Events
export interface EventChallenge {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  challenge_type: 'innovation' | 'problem_solving' | 'improvement' | 'research' | 'ideation';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration_hours?: number;
  max_participants?: number;
  submission_deadline?: string;
  evaluation_criteria?: string[];
  prizes?: Array<{
    position: number;
    prize_description: string;
    prize_value?: number;
  }>;
}

// Sector Types for Events
export interface EventSector {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  is_active: boolean;
  category?: 'government' | 'private' | 'non_profit' | 'academic' | 'international';
  sector_code?: string;
  parent_sector_id?: string;
  related_ministries?: string[];
  key_stakeholders?: string[];
}

// Focus Question Types
export interface FocusQuestion {
  id: string;
  question: string;
  question_ar?: string;
  category: 'strategic' | 'operational' | 'technical' | 'innovation' | 'impact';
  question_type: 'multiple_choice' | 'open_text' | 'rating' | 'yes_no' | 'ranking';
  is_active: boolean;
  is_mandatory: boolean;
  order_index?: number;
  related_sectors?: string[];
  scoring_weight?: number;
  options?: Array<{
    id: string;
    text: string;
    text_ar?: string;
    score_value?: number;
  }>;
}

// Event Manager Types
export interface EventManager {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  profile_image_url?: string;
  expertise_areas?: string[];
  organization?: string;
  organization_ar?: string;
  position?: string;
  position_ar?: string;
  management_level: 'lead' | 'coordinator' | 'assistant' | 'advisor';
  responsibilities?: string[];
  contact_preferences?: {
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    teams: boolean;
  };
  availability_schedule?: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
  event_types_managed?: string[];
  max_concurrent_events?: number;
}

// Event Form Data Types
export interface EventFormData {
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  event_type: 'workshop' | 'seminar' | 'conference' | 'networking' | 'hackathon' | 'pitch_session' | 'training';
  mode: 'in_person' | 'virtual' | 'hybrid';
  venue?: string;
  venue_ar?: string;
  virtual_platform?: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  max_participants?: number;
  registration_fee?: number;
  target_audience?: string[];
  agenda?: Array<{
    time: string;
    title: string;
    title_ar?: string;
    speaker?: string;
    duration_minutes?: number;
  }>;
  learning_objectives?: string[];
  prerequisites?: string[];
  certificates_available?: boolean;
  contact_information?: {
    primary_contact: string;
    email: string;
    phone?: string;
  };
}

// Wizard State Management Types
export interface EventWizardState {
  currentStep: number;
  formData: EventFormData;
  selectedResources: string[];
  selectedPartners: string[];
  selectedStakeholders: string[];
  selectedCampaigns: string[];
  selectedChallenges: string[];
  selectedSectors: string[];
  selectedFocusQuestions: string[];
  selectedManagers: string[];
  validationErrors: Record<string, string>;
  isLoading: boolean;
  isDirty: boolean;
}

// API Response Types
export interface EventsApiResponse<T> {
  data: T[];
  count?: number;
  error?: string;
  status: 'success' | 'error' | 'loading';
}

// Event Creation Response
export interface EventCreationResult {
  success: boolean;
  eventId?: string;
  errors?: string[];
  warnings?: string[];
  message: string;
}