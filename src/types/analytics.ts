/**
 * Analytics System Types - Type definitions for analytics and reporting functionality
 */

// Base analytics interfaces
export interface AnalyticsMetric {
  name: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: number[];
  
  // Allow additional fields
  [key: string]: unknown;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  category?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Engagement analytics
export interface EngagementData {
  likes: EngagementAction[];
  shares: EngagementAction[];
  comments: EngagementAction[];
  bookmarks: EngagementAction[];
  views: ViewSession[];
}

export interface EngagementAction {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  action_type: 'like' | 'share' | 'comment' | 'bookmark';
  created_at: string;
  platform?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

export interface ViewSession {
  id: string;
  user_id: string;
  item_id: string;
  session_duration: number;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Application data for opportunities
export interface ApplicationData {
  id: string;
  opportunity_id: string;
  user_id: string;
  status: string;
  submitted_at: string;
  source?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Analytics dashboard props
export interface AnalyticsDashboardProps {
  opportunities?: OpportunityItem[];
  timeRange?: string;
  className?: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  view_count?: number;
  like_count?: number;
  application_count?: number;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Engagement analytics props
export interface EngagementAnalyticsProps {
  opportunityId: string;
  timeRange?: string;
}

// Comprehensive analytics types
export interface ComprehensiveAnalyticsData {
  applications: ApplicationData[];
  likes: EngagementAction[];
  shares: EngagementAction[];
  viewSessions: ViewSession[];
  comments: EngagementAction[];
  bookmarks: EngagementAction[];
}

// Trend data
export interface TrendData {
  period: string;
  applications: number;
  views: number;
  engagement: number;
  conversion_rate: number;
}

// Platform share data
export interface PlatformShareData {
  platform: string;
  shares: number;
  percentage: number;
}

// Hourly engagement data
export interface HourlyEngagementData {
  hour: number;
  engagement: number;
  peak?: boolean;
}

// Export data types
export interface ExportData {
  format: 'csv' | 'json' | 'xlsx';
  data: unknown[];
  filename: string;
  columns?: string[];
}

export interface ExportActionsProps {
  data: unknown[];
  filename: string;
  includeCharts?: boolean;
  onExport?: (format: string, data: unknown[]) => void;
}

// Analytics filters
export interface AnalyticsFilters {
  timeRange: string;
  categories?: string[];
  sectors?: string[];
  departments?: string[];
  status?: string[];
}

// Statistics types
export interface StatisticsData {
  overview: {
    total_users: number;
    active_users: number;
    total_opportunities: number;
    total_applications: number;
  };
  trends: TrendData[];
  engagement: EngagementData;
  
  // Allow additional fields
  [key: string]: unknown;
}

export interface StatisticsFiltersProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  departments: Department[];
  sectors: Sector[];
}

// Department and sector types for analytics
export interface Department {
  id: string;
  name: string;
  name_ar?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

export interface Sector {
  id: string;
  name: string;
  name_ar?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Hook return types
export interface UseAnalyticsReturn {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  exportData: (format: string) => Promise<void>;
}

export interface UseEngagementAnalyticsReturn {
  engagementData: EngagementData | null;
  trendData: TrendData[];
  platformShares: PlatformShareData[];
  hourlyEngagement: HourlyEngagementData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}