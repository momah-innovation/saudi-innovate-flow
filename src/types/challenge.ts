import { BaseEntity, SystemDepartment, SystemSector, SystemDomain, SystemPartner, SystemExpert } from './common';

export interface Challenge extends BaseEntity {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  challenge_type: 'innovation' | 'improvement' | 'research' | 'development';
  status: 'draft' | 'active' | 'closed' | 'archived';
  start_date: string;
  end_date?: string;
  submission_deadline?: string;
  max_participants?: number;
  current_participants?: number;
  is_public: boolean;
  is_featured: boolean;
  departments?: string[];
  sectors?: string[];
  domains?: string[];
  partners?: string[];
  experts?: string[];
  tags?: string[];
  metadata?: ChallengeMetadata;
  evaluation_criteria?: EvaluationCriteria[];
  rewards?: ChallengeReward[];
}

export interface ChallengeMetadata {
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimated_duration?: string;
  required_skills?: string[];
  resources_provided?: string[];
  submission_format?: 'document' | 'presentation' | 'prototype' | 'video' | 'other';
  collaboration_allowed?: boolean;
  external_links?: string[];
}

export interface EvaluationCriteria {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  weight_percentage: number;
  max_score: number;
}

export interface ChallengeReward {
  id: string;
  rank: number;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  value?: number;
  currency?: string;
  type: 'monetary' | 'certificate' | 'badge' | 'opportunity' | 'other';
}

export interface ChallengeFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  challenge_type: Challenge['challenge_type'];
  start_date: string;
  end_date?: string;
  submission_deadline?: string;
  max_participants?: number;
  is_public: boolean;
  is_featured: boolean;
  departments: string[];
  sectors: string[];
  domains: string[];
  partners: string[];
  experts: string[];
  tags: string[];
  difficulty_level?: ChallengeMetadata['difficulty_level'];
  estimated_duration?: string;
  required_skills: string[];
  collaboration_allowed: boolean;
  evaluation_criteria: Omit<EvaluationCriteria, 'id'>[];
  rewards: Omit<ChallengeReward, 'id'>[];
}

export interface ChallengeListItem {
  id: string;
  title_ar: string;
  title_en?: string;
  challenge_type: Challenge['challenge_type'];
  status: Challenge['status'];
  start_date: string;
  end_date?: string;
  current_participants: number;
  max_participants?: number;
  is_featured: boolean;
  departments?: SystemDepartment[];
  sectors?: SystemSector[];
}

export interface ChallengeDetailData extends Challenge {
  departments_data?: SystemDepartment[];
  sectors_data?: SystemSector[];
  domains_data?: SystemDomain[];
  partners_data?: SystemPartner[];
  experts_data?: SystemExpert[];
  participation_stats?: {
    total_participants: number;
    total_submissions: number;
    completion_rate: number;
  };
  recent_activities?: ChallengeActivity[];
}

export interface ChallengeActivity extends BaseEntity {
  challenge_id: string;
  user_id?: string;
  activity_type: 'join' | 'submit' | 'comment' | 'vote' | 'update';
  description_ar: string;
  description_en?: string;
  metadata?: Record<string, unknown>;
}

export interface ChallengeFilters {
  search?: string;
  challenge_type?: Challenge['challenge_type'];
  status?: Challenge['status'];
  departments?: string[];
  sectors?: string[];
  start_date_from?: string;
  start_date_to?: string;
  is_featured?: boolean;
  is_public?: boolean;
  sort_by?: 'created_at' | 'start_date' | 'title_ar' | 'participants';
  sort_direction?: 'asc' | 'desc';
}

export interface ChallengeAnalytics {
  total_challenges: number;
  active_challenges: number;
  total_participants: number;
  total_submissions: number;
  completion_rate: number;
  popular_types: Array<{
    type: Challenge['challenge_type'];
    count: number;
  }>;
  participation_by_department: Array<{
    department: string;
    count: number;
  }>;
  monthly_stats: Array<{
    month: string;
    challenges_created: number;
    total_participants: number;
  }>;
}