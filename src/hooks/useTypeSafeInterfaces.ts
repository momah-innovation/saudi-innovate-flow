/**
 * Type-Safe Interfaces Hook - Phase 5
 * Provides strongly typed interfaces to replace 'any' types
 */

export interface UserProfile {
  id: string;
  name?: string;
  name_ar?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export interface ChallengeData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  start_date: string;
  end_date: string;
  department_id?: string;
  sector_id?: string;
  created_by?: string;
  created_at?: string;
}

export interface IdeaSubmission {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  challenge_id: string;
  submitted_by: string;
  status: string;
  score?: number;
  created_at?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  recipient_id: string;
  sender_id?: string;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  name?: string;
  name_ar?: string;
  role: string;
  status: string;
  joined_at?: string;
}

export interface TagData {
  id: string;
  name_ar: string;
  name_en?: string;
  color?: string;
  category?: string;
  usage_count?: number;
}

export interface ExpertData {
  id: string;
  user_id: string;
  specialization: string;
  expertise_level: string;
  status: string;
  bio_ar?: string;
  bio_en?: string;
}

export interface PartnerData {
  id: string;
  organization_name_ar: string;
  organization_name_en?: string;
  contact_person?: string;
  partnership_type: string;
  status: string;
  collaboration_history?: Record<string, any>;
}

export interface EventData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location?: string;
  max_participants?: number;
  status: string;
}

export interface AnalyticsMetric {
  metric_name: string;
  value: number;
  percentage_change?: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export const useTypeSafeInterfaces = () => {
  // Type guards for runtime type checking
  const isUserProfile = (obj: any): obj is UserProfile => {
    return obj && typeof obj.id === 'string';
  };

  const isChallengeData = (obj: any): obj is ChallengeData => {
    return obj && typeof obj.id === 'string' && typeof obj.title_ar === 'string';
  };

  const isNotificationData = (obj: any): obj is NotificationData => {
    return obj && typeof obj.id === 'string' && typeof obj.title === 'string';
  };

  const isTeamMember = (obj: any): obj is TeamMember => {
    return obj && typeof obj.id === 'string' && typeof obj.user_id === 'string';
  };

  // Safe casting helpers
  const castToUserProfile = (obj: any): UserProfile => {
    if (!isUserProfile(obj)) {
      throw new Error('Invalid UserProfile data');
    }
    return obj;
  };

  const castToChallengeData = (obj: any): ChallengeData => {
    if (!isChallengeData(obj)) {
      throw new Error('Invalid ChallengeData');
    }
    return obj;
  };

  return {
    // Type guards
    isUserProfile,
    isChallengeData,
    isNotificationData,
    isTeamMember,
    
    // Safe casting
    castToUserProfile,
    castToChallengeData,
    
    // Default objects
    defaultUserProfile: (): UserProfile => ({
      id: '',
      name: '',
      name_ar: '',
      email: ''
    }),
    
    defaultChallengeData: (): ChallengeData => ({
      id: '',
      title_ar: '',
      description_ar: '',
      status: 'draft',
      priority_level: 'medium',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString()
    })
  };
};