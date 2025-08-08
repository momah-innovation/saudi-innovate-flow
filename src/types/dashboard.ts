/**
 * Dashboard Types - Comprehensive type definitions for dashboard components
 */

// User Profile Types
export interface UserProfile {
  id: string;
  display_name?: string;
  email?: string;
  profile_image_url?: string;
  expertise_areas?: string[];
  organization?: string;
  position?: string;
  profile_completion_percentage?: number;
  innovation_score?: number;
  points?: number;
  user_roles?: Array<{
    role: string;
    is_active: boolean;
    expires_at?: string;
  }>;
  metadata?: Record<string, unknown>;
}

// Role Permissions Types
export interface RolePermissions {
  canCreateIdeas: boolean;
  canJoinChallenges: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canAccessAdminPanel: boolean;
  canModerateCommunity: boolean;
  allowedSections: string[];
}

// Dashboard Stats Types
export interface DashboardStats {
  totalIdeas: number;
  activeChallenges: number;
  totalPoints: number;
  innovationScore: number;
  userIdeas?: number;
  userChallenges?: number;
  userEvents?: number;
  totalEvents?: number;
  totalUsers?: number;
}

// Recent Activity Types
export interface RecentActivity {
  id: string;
  type: 'idea_submitted' | 'idea_evaluated' | 'challenge_joined' | 'event_attended' | 'achievement_earned' | 'profile_updated';
  title: string;
  description: string;
  date: string;
  status?: 'completed' | 'pending' | 'in_progress' | 'cancelled';
  metadata?: {
    challenge_id?: string;
    idea_id?: string;
    event_id?: string;
    achievement_type?: string;
    evaluation_result?: string;
    [key: string]: unknown;
  };
}

// Achievement Types
export interface Achievement {
  id: string;
  type: 'first_idea' | 'challenge_winner' | 'community_contributor' | 'innovation_leader' | 'expert_reviewer';
  title: string;
  description: string;
  icon: string;
  earned_at: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  points_awarded: number;
  metadata?: {
    challenge_id?: string;
    ideas_count?: number;
    contributions_count?: number;
    [key: string]: unknown;
  };
}

// Quick Action Types
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  category: 'create' | 'explore' | 'manage' | 'analyze';
  permissions?: string[];
}

// Challenge Data Types (for dashboard display)
export interface DashboardChallenge {
  id: string;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  status: 'draft' | 'published' | 'active' | 'evaluation' | 'completed' | 'cancelled';
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  sensitivity_level: 'public' | 'internal' | 'confidential' | 'restricted';
  submission_deadline: string;
  evaluation_deadline?: string;
  total_budget: number;
  participants_count?: number;
  submissions_count?: number;
  created_at: string;
  challenge_type: 'innovation' | 'problem_solving' | 'improvement' | 'research';
  target_sectors?: string[];
  required_skills?: string[];
  collaboration_level: 'individual' | 'team' | 'both';
}

// Navigation Item Types
export interface NavigationItem {
  title: string;
  path: string;
  icon: string;
  category?: string;
  permissions?: string[];
  isActive?: boolean;
}

// Dashboard Component Props Types
export interface DashboardHeroProps {
  userProfile?: UserProfile;
  stats: DashboardStats;
  onNavigate: (path: string) => void;
  userRole?: string;
  rolePermissions?: RolePermissions;
}

export interface UserDashboardProps {
  userProfile: UserProfile;
  canCreateIdeas: boolean;
  canJoinChallenges: boolean;
  canViewAnalytics: boolean;
}

export interface InnovatorDashboardProps {
  userProfile: UserProfile;
}

export interface ExpertDashboardProps {
  userProfile: UserProfile;
}

export interface PartnerDashboardProps {
  userProfile: UserProfile;
}

// Badge Configuration Types
export interface BadgeConfig {
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  text: string;
  color?: string;
}

// Dashboard Section Types
export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  component: string;
  order: number;
  visibility: 'public' | 'authenticated' | 'role_based';
  required_roles?: string[];
  config?: Record<string, unknown>;
}