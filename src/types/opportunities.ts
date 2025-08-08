/**
 * Opportunities System Types - Type definitions for opportunities functionality
 */

// Base opportunity interfaces - flexible for database compatibility
export interface Opportunity {
  id: string;
  title?: string; // Made optional to match database
  title_ar: string;
  description?: string;
  description_ar?: string;
  status: string; // Made flexible for any status
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  opportunity_type?: string;
  applications_count?: number;
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Application data - flexible for database compatibility
export interface Application {
  id: string;
  opportunity_id?: string;
  user_id?: string; // Made optional
  applicant_id?: string; // Alternative field
  status: string;
  submitted_at?: string; // Made optional
  created_at?: string; // Alternative field
  source?: string;
  attachment_urls?: string[];
  organization_name?: string;
  contact_person?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Engagement data - flexible for database compatibility  
export interface Like {
  id?: string; // Made optional
  opportunity_id?: string;
  user_id?: string; // Made optional
  created_at: string;
  platform?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Share {
  id?: string; // Made optional
  opportunity_id?: string;
  user_id?: string; // Made optional
  platform: string;
  created_at: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Comment {
  id?: string; // Made optional
  opportunity_id?: string;
  user_id?: string; // Made optional
  content: string;
  created_at: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Bookmark {
  id?: string; // Made optional
  opportunity_id?: string;
  user_id?: string; // Made optional
  created_at: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface ViewSession {
  id?: string; // Made optional
  opportunity_id?: string;
  user_id?: string; // Made optional
  session_duration?: number;
  created_at: string;
  ip_address?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Filter data - flexible for database compatibility
export interface Category {
  id: string;
  name?: string; // Made optional
  name_ar?: string;
  name_en?: string; // Alternative field
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Sector {
  id: string;
  name?: string; // Made optional
  name_ar?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface Department {
  id: string;
  name?: string; // Made optional
  name_ar?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Analytics data structures
export interface EngagementTrendPoint {
  date: string;
  applications: number;
  likes: number;
  shares: number;
  views: number;
  engagement: number;
}

export interface PlatformShareData {
  platform: string;
  count: number;
  percentage: number;
}

export interface HourlyEngagement {
  hour: number;
  engagement: number;
}

export interface EngagementMetrics {
  avgTimeOnPage: number;
  bounceRate: number;
  returnVisitors: number;
}

export interface TrendData {
  applications: { current: number; change: number };
  likes: { current: number; change: number };
  shares: { current: number; change: number };
  bookmarks: { current: number; change: number };
  views: { current: number; change: number };
}

// Component props
export interface OpportunityAnalyticsDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunities: Opportunity[];
}

export interface OpportunityRecommendationsProps {
  opportunities: Opportunity[];
}

export interface TrendingOpportunitiesWidgetProps {
  opportunities: Opportunity[];
}

export interface EnhancedOpportunityDetailDialogProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface EnhancedOpportunityFiltersProps {
  filters: Record<string, unknown>;
  onFiltersChange: (filters: Record<string, unknown>) => void;
  onClearFilters: () => void;
}

// Hook return types
export interface UseOpportunityAnalyticsReturn {
  applications: Application[];
  likes: Like[];
  shares: Share[];
  comments: Comment[];
  bookmarks: Bookmark[];
  viewSessions: ViewSession[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export interface UseOpportunityEngagementReturn {
  engagementTrend: EngagementTrendPoint[];
  platformShares: PlatformShareData[];
  hourlyEngagement: HourlyEngagement[];
  engagementMetrics: EngagementMetrics;
  trends: TrendData;
  loading: boolean;
  error: string | null;
}