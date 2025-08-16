/**
 * Admin Component Types - Comprehensive type definitions for admin interfaces
 */

// Partner Types
export interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  partnership_status: 'active' | 'pending' | 'inactive' | 'suspended';
  partnership_type: 'strategic' | 'operational' | 'technical' | 'financial' | 'academic';
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  logo_url?: string;
  industry_sector?: string;
  partnership_agreement?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

// Idea Management Types
export interface IdeaForManagement {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  innovation_type: 'process' | 'product' | 'service' | 'technology' | 'business_model';
  impact_level: 'department' | 'organization' | 'sector' | 'national' | 'international';
  feasibility_score?: number;
  innovation_score?: number;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  innovator_id: string;
  assigned_expert_id?: string;
  evaluation_notes?: string;
  implementation_plan?: Record<string, unknown>;
  budget_estimate?: number;
  expected_roi?: number;
  target_sectors?: string[];
  required_resources?: string[];
  collaboration_preferences?: 'individual' | 'team' | 'open';
  metadata?: Record<string, unknown>;
}

// Opportunity Management Types
export interface OpportunityForManagement {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  opportunity_type: 'funding' | 'partnership' | 'mentorship' | 'incubation' | 'acceleration' | 'competition';
  status: 'draft' | 'published' | 'active' | 'closed' | 'cancelled';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  application_deadline?: string;
  start_date?: string;
  end_date?: string;
  budget_available?: number;
  target_audience?: string[];
  eligibility_criteria?: string[];
  application_requirements?: string[];
  selection_criteria?: string[];
  contact_information?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  created_at: string;
  updated_at: string;
  created_by: string;
  organization_id?: string;
  metadata?: Record<string, unknown>;
}

// Event-related Types for Wizards
export interface EventResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'presentation' | 'tool';
  url: string;
  description?: string;
  is_required: boolean;
}

export interface EventPartner {
  id: string;
  name: string;
  name_ar?: string;
  partnership_type: 'sponsor' | 'collaborator' | 'supporter' | 'media' | 'vendor';
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
}

export interface EventStakeholder {
  id: string;
  name: string;
  name_ar?: string;
  role: 'organizer' | 'speaker' | 'moderator' | 'facilitator' | 'advisor';
  organization?: string;
  bio?: string;
  profile_image?: string;
  contact_email?: string;
}

export interface EventCampaign {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string;
  end_date: string;
  target_audience?: string[];
}

export interface EventChallenge {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  status: 'draft' | 'published' | 'active' | 'completed';
  challenge_type: 'innovation' | 'problem_solving' | 'improvement' | 'research';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface EventSector {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  is_active: boolean;
  category?: string;
}

export interface FocusQuestion {
  id: string;
  question: string;
  question_ar?: string;
  category: string;
  is_active: boolean;
  order_index?: number;
}

export interface EventManager {
  id: string;
  display_name: string;
  email: string;
  profile_image_url?: string;
  expertise_areas?: string[];
  organization?: string;
  position?: string;
}

// Badge Variant Types
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';

// Partnership Status Color Mapping
export const PARTNERSHIP_STATUS_COLORS: Record<string, BadgeVariant> = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
  suspended: 'destructive'
} as const;

// Partnership Type Labels
export const PARTNERSHIP_TYPE_LABELS: Record<string, { en: string; ar: string }> = {
  strategic: { en: 'Strategic Partnership', ar: 'شراكة استراتيجية' },
  operational: { en: 'Operational Partnership', ar: 'شراكة تشغيلية' },
  technical: { en: 'Technical Partnership', ar: 'شراكة تقنية' },
  financial: { en: 'Financial Partnership', ar: 'شراكة مالية' },
  academic: { en: 'Academic Partnership', ar: 'شراكة أكاديمية' }
} as const;

// Partnership Status Labels
export const PARTNERSHIP_STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  active: { en: 'Active', ar: 'نشط' },
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  inactive: { en: 'Inactive', ar: 'غير نشط' },
  suspended: { en: 'Suspended', ar: 'معلق' }
} as const;