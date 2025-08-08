/**
 * Hooks and Real-time Types - Type definitions for hook-based functionality
 */

// Real-time payload types
export interface RealtimePayload<T = Record<string, unknown>> {
  new: T;
  old: T;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  commit_timestamp: string;
}

// Challenge participant types
export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  status: 'active' | 'inactive' | 'removed';
  submission_count?: number;
  last_activity?: string;
}

// Challenge submission types  
export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submitted_at?: string;
  evaluation_score?: number;
  feedback?: string;
}

// Challenge notification types
export interface ChallengeNotification {
  id: string;
  challenge_id: string;
  title: string;
  message: string;
  type: 'status_change' | 'new_participant' | 'deadline_reminder' | 'evaluation_complete';
  data: {
    old_status?: string;
    new_status?: string;
    title?: string;
    participant_count?: number;
    deadline?: string;
  };
  created_at: string;
}

// Bookmark types
export interface BookmarkItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'challenge' | 'idea' | 'event' | 'opportunity' | 'partner';
  title: string;
  description?: string;
  created_at: string;
  metadata?: {
    status?: string;
    category?: string;
    priority?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

// Table name mapping for bookmarks
export type BookmarkTableName = 'challenge_bookmarks' | 'idea_bookmarks' | 'event_bookmarks' | 'opportunity_bookmarks' | 'partner_bookmarks';

export const BOOKMARK_TABLE_MAPPING: Record<string, BookmarkTableName> = {
  challenge: 'challenge_bookmarks',
  idea: 'idea_bookmarks', 
  event: 'event_bookmarks',
  opportunity: 'opportunity_bookmarks',
  partner: 'partner_bookmarks'
} as const;

// Event interaction types
export interface EventStats {
  total_participants: number;
  confirmed_participants: number;
  pending_participants: number;
  waitlist_count: number;
  total_views: number;
  engagement_score: number;
  average_rating?: number;
  feedback_count: number;
}

export interface EventInteraction {
  id: string;
  event_id: string;
  user_id: string;
  interaction_type: 'view' | 'like' | 'share' | 'register' | 'attend' | 'feedback';
  interaction_data?: {
    rating?: number;
    feedback?: string;
    shared_platform?: string;
    referral_source?: string;
    [key: string]: unknown;
  };
  created_at: string;
}

// Hook return types
export interface UseRealTimeChallengesReturn {
  notifications: ChallengeNotification[];
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  isConnected: boolean;
}

export interface UseBookmarksReturn {
  challengeBookmarks: BookmarkItem[];
  ideaBookmarks: BookmarkItem[];
  eventBookmarks: BookmarkItem[];
  opportunityBookmarks: BookmarkItem[];
  partnerBookmarks: BookmarkItem[];
  isBookmarked: (itemId: string, itemType: string) => boolean;
  addBookmark: (itemId: string, itemType: string, title: string, metadata?: Record<string, unknown>) => Promise<void>;
  removeBookmark: (itemId: string, itemType: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface UseEventInteractionsReturn {
  stats: EventStats | null;
  interactions: EventInteraction[];
  recordInteraction: (type: EventInteraction['interaction_type'], data?: Record<string, unknown>) => Promise<void>;
  loading: boolean;
  error: string | null;
}