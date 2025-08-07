import { BaseEntity, SystemDepartment, SystemSector, SystemPartner } from './common';

export interface AppEvent extends BaseEntity {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: 'workshop' | 'seminar' | 'conference' | 'networking' | 'hackathon' | 'pitch_session' | 'training';
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  registration_start?: string;
  registration_end?: string;
  location_ar?: string;
  location_en?: string;
  is_online: boolean;
  meeting_link?: string;
  max_participants?: number;
  current_registrations?: number;
  registration_fee?: number;
  currency?: string;
  is_public: boolean;
  is_featured: boolean;
  departments?: string[];
  sectors?: string[];
  partners?: string[];
  speakers?: EventSpeaker[];
  agenda?: EventAgendaItem[];
  tags?: string[];
  image_url?: string;
  metadata?: EventMetadata;
}

export interface EventSpeaker {
  id: string;
  name_ar: string;
  name_en?: string;
  bio_ar?: string;
  bio_en?: string;
  title_ar?: string;
  title_en?: string;
  organization_ar?: string;
  organization_en?: string;
  photo_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_keynote: boolean;
  display_order: number;
}

export interface EventAgendaItem {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  start_time: string;
  end_time: string;
  speaker_ids?: string[];
  location_ar?: string;
  location_en?: string;
  session_type: 'presentation' | 'workshop' | 'panel' | 'break' | 'networking' | 'qa';
  is_break: boolean;
  display_order: number;
}

export interface EventMetadata {
  target_audience?: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  materials_provided?: string[];
  certificates_offered?: boolean;
  language: 'ar' | 'en' | 'both';
  dress_code?: string;
  parking_info?: string;
  catering_provided?: boolean;
  accessibility_features?: string[];
}

export interface EventFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: AppEvent['event_type'];
  start_date: string;
  end_date?: string;
  registration_start?: string;
  registration_end?: string;
  location_ar?: string;
  location_en?: string;
  is_online: boolean;
  meeting_link?: string;
  max_participants?: number;
  registration_fee?: number;
  currency?: string;
  is_public: boolean;
  is_featured: boolean;
  departments: string[];
  sectors: string[];
  partners: string[];
  speakers: Omit<EventSpeaker, 'id'>[];
  agenda: Omit<EventAgendaItem, 'id'>[];
  tags: string[];
  image_url?: string;
  target_audience: string[];
  prerequisites: string[];
  learning_objectives: string[];
  certificates_offered: boolean;
  language: EventMetadata['language'];
}

export interface EventListItem {
  id: string;
  title_ar: string;
  title_en?: string;
  event_type: AppEvent['event_type'];
  status: AppEvent['status'];
  start_date: string;
  end_date?: string;
  current_registrations: number;
  max_participants?: number;
  is_online: boolean;
  is_featured: boolean;
  image_url?: string;
}

export interface EventDetailData extends AppEvent {
  departments_data?: SystemDepartment[];
  sectors_data?: SystemSector[];
  partners_data?: SystemPartner[];
  registration_stats?: {
    total_registrations: number;
    confirmed_attendees: number;
    no_shows: number;
    cancellations: number;
  };
  feedback_summary?: {
    average_rating: number;
    total_feedback: number;
    satisfaction_rate: number;
  };
}

export interface EventRegistration extends BaseEntity {
  event_id: string;
  user_id: string;
  status: 'registered' | 'confirmed' | 'attended' | 'no_show' | 'cancelled';
  registration_date: string;
  attendance_date?: string;
  payment_status?: 'pending' | 'paid' | 'refunded' | 'waived';
  special_requirements?: string;
  feedback_rating?: number;
  feedback_comment?: string;
}

export interface EventFilters {
  search?: string;
  event_type?: AppEvent['event_type'];
  status?: AppEvent['status'];
  departments?: string[];
  sectors?: string[];
  start_date_from?: string;
  start_date_to?: string;
  is_online?: boolean;
  is_featured?: boolean;
  has_available_spots?: boolean;
  sort_by?: 'created_at' | 'start_date' | 'title_ar' | 'registrations';
  sort_direction?: 'asc' | 'desc';
}

export interface EventAnalytics {
  total_events: number;
  upcoming_events: number;
  total_registrations: number;
  average_attendance_rate: number;
  popular_types: Array<{
    type: AppEvent['event_type'];
    count: number;
  }>;
  registrations_by_department: Array<{
    department: string;
    count: number;
  }>;
  monthly_stats: Array<{
    month: string;
    events_held: number;
    total_registrations: number;
    attendance_rate: number;
  }>;
}