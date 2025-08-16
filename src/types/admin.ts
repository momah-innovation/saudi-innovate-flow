/**
 * Admin Component Type Definitions
 * Replaces 'any' types with proper interfaces
 */

export interface AdminMetrics {
  systemHealth: number;
  activeUsers: number;
  totalRoles: number;
  pendingApprovals: number;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  hasError: boolean;
  errorMessage?: string | null;
}

export interface AdminAnalyticsData {
  coreMetrics: CoreMetrics | null;
  securityMetrics: SecurityMetrics | null;
  roleBasedMetrics: RoleBasedMetrics | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: string | null;
  hasAccess: {
    security: boolean;
    analytics: boolean;
  };
}

export interface CoreMetrics {
  users: {
    total: number;
    active: number;
    new: number;
    growthRate: number;
    trend: 'up' | 'down' | 'stable';
  };
  challenges: {
    total: number;
    active: number;
    completed: number;
  };
  business: {
    roi: number;
    conversionRate: number;
  };
  engagement: {
    totalParticipants: number;
    participationRate: number;
    pageViews: number;
  };
  metadata?: {
    version: string;
    data_quality: 'complete' | 'partial' | 'incomplete';
  };
}

export interface SecurityMetrics {
  securityScore: number;
  riskLevel: string;
  threatCount: number;
  suspiciousActivities: number;
  metadata?: {
    data_quality: 'complete' | 'partial' | 'incomplete';
  };
}

export interface RoleBasedMetrics {
  admin_metrics: {
    system_health: {
      uptime: number;
      active_sessions: number;
      error_rate: number;
    };
    total_roles_assigned: number;
    pending_approvals: number;
    data_quality: 'complete' | 'partial' | 'incomplete';
  };
  metadata?: {
    version: string;
  };
}

export interface AdminMetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  error?: boolean;
  variant?: 'default' | 'security' | 'performance';
  fallbackValue?: string;
  t: (key: string, fallback?: string) => string;
}

export interface RoleRequestFormData {
  role: string;
  organization: string;
  experience: string;
  expertise: string;
  qualifications: string;
  motivation: string;
  portfolio?: string;
  linkedin?: string;
  certifications?: string[];
  availability: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  last_active?: string;
  permissions: string[];
}

export interface WorkspaceRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number;
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface LiveEngagementData {
  activeUsers: number;
  pageViews: number;
  sessionsToday: number;
  participationRate: number;
  currentOnline: number;
  lastUpdated: string;
}

export interface SecurityThreat {
  id: string;
  type: 'intrusion' | 'malware' | 'phishing' | 'ddos' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detected_at: string;
  resolved_at?: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  affected_systems: string[];
}

export interface UserBehaviorPattern {
  user_id: string;
  session_duration: number;
  pages_visited: number;
  actions_taken: number;
  engagement_score: number;
  risk_indicators: string[];
  last_activity: string;
}

export interface ChallengeAnalyticsData {
  total_challenges: number;
  active_challenges: number;
  completed_challenges: number;
  participation_rate: number;
  completion_rate: number;
  avg_completion_time: number;
  top_performers: Array<{
    user_id: string;
    name: string;
    score: number;
    completed_challenges: number;
  }>;
  challenge_categories: Array<{
    category: string;
    count: number;
    completion_rate: number;
  }>;
}

export interface StorageAnalyticsData {
  total_files: number;
  total_size: number;
  files_uploaded_today: number;
  storage_used_percentage: number;
  file_types: Array<{
    type: string;
    count: number;
    size: number;
  }>;
  recent_uploads: Array<{
    filename: string;
    size: number;
    uploaded_at: string;
    uploaded_by: string;
  }>;
}

// Additional type definitions for challenges
export interface OnlineUser {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen?: string;
  current_activity?: string;
}

export interface RecentActivity {
  id: string;
  type: 'comment' | 'edit' | 'mention' | 'collaboration';
  user_id: string;
  description: string;
  created_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface ChallengeExpert {
  id: string;
  challenge_id: string;
  expert_id: string;
  role_type: 'reviewer' | 'mentor' | 'judge' | 'advisor';
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  assigned_at: string;
  expert?: {
    profiles: {
      name: string;
      email: string;
      avatar_url?: string;
      expertise_areas?: string[];
    };
  };
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  score?: number;
  feedback?: string;
  submitted_at: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface ChallengeTeam {
  id: string;
  name: string;
  description?: string;
  challenge_id: string;
  team_lead_id: string;
  status: 'active' | 'inactive' | 'completed';
  member_count: number;
  created_at: string;
  members?: {
    user_id: string;
    role: 'lead' | 'member';
    joined_at: string;
    user: {
      name: string;
      email: string;
      avatar_url?: string;
    };
  }[];
}