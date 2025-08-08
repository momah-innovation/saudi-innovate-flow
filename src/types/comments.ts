/**
 * Comments and Discussion Types
 */

export interface CommentProfile {
  id?: string;
  display_name?: string;
  profile_image_url?: string;
  expertise_areas?: string[];
  is_expert?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  parent_comment_id?: string;
  likes_count: number;
  is_pinned: boolean;
  is_expert_comment: boolean;
  is_edited?: boolean;
  challenge_id?: string;
  profiles?: CommentProfile;
  replies?: Comment[];
}

export interface ChallengeComment extends Comment {
  challenge_id: string;
}

export interface IdeaComment extends Comment {
  idea_id: string;
}

export interface EventComment extends Comment {
  event_id: string;
}

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'helpful' | 'insightful';
  created_at: string;
}

export interface CommentReport {
  id: string;
  comment_id: string;
  reporter_id: string;
  reason: 'spam' | 'inappropriate' | 'harassment' | 'misinformation' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CommentThread {
  parent: Comment;
  replies: Comment[];
  total_replies: number;
  latest_reply_at?: string;
}