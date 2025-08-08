/**
 * Ideas System Types - Type definitions for idea-related functionality
 */

// Base idea interface - flexible to accommodate database structure
export interface Idea {
  id: string;
  title?: string; // Made optional to match database
  title_ar?: string;
  description?: string; // Made optional to match database
  description_ar?: string;
  status: string; // Made flexible for any status
  maturity_level: string; // Made flexible for any maturity level
  overall_score?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  created_at: string;
  updated_at?: string;
  user_id?: string; // Made optional to match database
  challenge_id?: string;
  sector_id?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
  
  // Related entities
  challenges?: {
    title_ar?: string;
    sectors?: {
      name_ar?: string;
    };
  };
}

// Achievement types for gamification - flexible for database structure
export interface Achievement {
  id: string;
  achievement_type: string;
  achievement_level: string;
  title: string;
  description: string;
  points_earned: number;
  icon_name: string;
  earned_at: string;
  metadata: unknown; // Made flexible for database Json type
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Leaderboard entry - flexible for database structure
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  ideas_submitted: number;
  ideas_implemented: number;
  engagement_score: number;
  rank_position: number;
  
  // Allow additional database fields
  [key: string]: unknown;
  
  profiles?: {
    name?: string;
    name_ar?: string;
    profile_image_url?: string;
  } | null;
}

// User stats for gamification
export interface UserStats {
  totalPoints: number;
  level: string;
  progress: number;
  nextLevelPoints: number;
}

// Analytics data structures
export interface IdeaAnalytics {
  overview: {
    totalIdeas: number;
    approvedIdeas: number;
    implementedIdeas: number;
    averageScore: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    implementationRate: number;
  };
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  maturityDistribution: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    ideas: number;
    approved: number;
    implemented: number;
  }>;
  topSectors: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  topChallenges: Array<{
    title: string;
    ideas: number;
    avgScore: number;
  }>;
}

// Filter state for ideas
export interface FilterState {
  status?: string[];
  sector?: string[];
  challenge?: string[];
  maturity?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  scoreRange?: {
    min: number;
    max: number;
  };
}

// Sector and challenge types for filters - flexible for database structure
export interface Sector {
  id: string;
  name?: string; // Made optional to match database
  name_ar: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Challenge {
  id: string;
  title?: string; // Made optional to match database
  title_ar: string;
  sector_id?: string; // Made optional to match database
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Smart recommendation types
export interface SmartRecommendation {
  id: string;
  user_id: string;
  recommended_idea_id: string;
  recommendation_type: 'popular' | 'trending' | 'collaborative' | 'skill_based';
  confidence_score: number;
  reasoning: string;
  is_viewed: boolean;
  expires_at: string;
  created_at: string;
  ideas?: Idea;
}

// Success story types
export interface SuccessStory {
  id: string;
  idea_id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  impact_metrics: Record<string, unknown>;
  media_urls: string[];
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  ideas?: Idea;
}

// Icons mapping for achievements
export interface IconsMapping {
  [key: string]: React.ComponentType<{ className?: string }>;
}

// Hook return types
export interface UseIdeaAnalyticsReturn {
  analytics: IdeaAnalytics | null;
  loading: boolean;
  error: string | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  refreshAnalytics: () => Promise<void>;
}

export interface UseGamificationReturn {
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  userStats: UserStats;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export interface UseSmartRecommendationsReturn {
  recommendations: SmartRecommendation[];
  loading: boolean;
  error: string | null;
  markAsViewed: (id: string) => Promise<void>;
  refreshRecommendations: () => Promise<void>;
}

export interface UseSuccessStoriesReturn {
  stories: SuccessStory[];
  loading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
}