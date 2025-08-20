
# 🔍 Activity Monitoring & Logging System - Comprehensive Plan

## Overview

The Ruwād Platform requires a comprehensive activity monitoring and logging system that tracks all user interactions, system events, and business processes while implementing robust Role-Based Access Control (RBAC) for activity visibility.

## 1. Activity Categories & Event Types

### 1.1 Core Entity Activities

#### **Challenges** (`entity_type: 'challenge'`)
- `challenge_created` - New challenge published
- `challenge_updated` - Challenge details modified
- `challenge_deleted` - Challenge removed
- `challenge_published` - Challenge made public
- `challenge_archived` - Challenge archived
- `challenge_participated` - User registered for challenge
- `challenge_submitted` - Solution submitted
- `challenge_evaluated` - Expert evaluation completed
- `challenge_approved` - Submission approved
- `challenge_rejected` - Submission rejected

#### **Ideas/Submissions** (`entity_type: 'submission'`)
- `submission_created` - New idea/submission created
- `submission_updated` - Content modified
- `submission_deleted` - Submission removed
- `submission_submitted` - Draft submitted for review
- `submission_reviewed` - Expert review completed
- `submission_approved` - Approved for implementation
- `submission_implemented` - Implementation started
- `submission_rejected` - Rejected with feedback

#### **Events** (`entity_type: 'event'`)
- `event_created` - New event scheduled
- `event_updated` - Event details changed
- `event_deleted` - Event cancelled
- `event_registered` - User registered
- `event_attended` - User attended
- `event_cancelled` - Event cancelled
- `event_feedback` - Feedback provided

#### **Opportunities** (`entity_type: 'opportunity'`)
- `opportunity_created` - New opportunity posted
- `opportunity_updated` - Details modified
- `opportunity_deleted` - Opportunity removed
- `opportunity_applied` - Application submitted
- `opportunity_approved` - Application approved
- `opportunity_rejected` - Application rejected
- `opportunity_withdrawn` - Application withdrawn

#### **Partners** (`entity_type: 'partner'`)
- `partner_created` - New partner added
- `partner_updated` - Profile updated
- `partner_deleted` - Partner removed
- `partner_activated` - Partnership activated
- `partner_deactivated` - Partnership paused
- `partner_collaborated` - Collaboration started

#### **Campaigns** (`entity_type: 'campaign'`)
- `campaign_created` - New campaign created
- `campaign_updated` - Campaign modified
- `campaign_deleted` - Campaign removed
- `campaign_launched` - Campaign started
- `campaign_paused` - Campaign paused
- `campaign_completed` - Campaign finished

### 1.2 User Activities

#### **Authentication** (`entity_type: 'user'`)
- `user_login` - User signed in
- `user_logout` - User signed out
- `user_password_changed` - Password updated
- `user_profile_updated` - Profile information changed
- `user_registered` - New account created
- `user_verified` - Email verification completed

#### **Engagement** (`entity_type: 'engagement'`)
- `content_liked` - User liked content
- `content_unliked` - User removed like
- `content_bookmarked` - Content saved
- `content_unbookmarked` - Bookmark removed
- `content_shared` - Content shared
- `content_commented` - Comment added
- `user_followed` - User followed another user
- `user_unfollowed` - User unfollowed

#### **Collaboration** (`entity_type: 'collaboration'`)
- `team_invited` - User invited to team
- `team_joined` - User joined team
- `team_left` - User left team
- `task_assigned` - Task assigned to user
- `task_completed` - Task marked complete
- `workspace_created` - New workspace created
- `workspace_joined` - User joined workspace

#### **Content Management** (`entity_type: 'content'`)
- `file_uploaded` - File uploaded to system
- `file_downloaded` - File downloaded
- `file_deleted` - File removed
- `document_created` - Document created
- `document_updated` - Document modified
- `document_shared` - Document shared

### 1.3 Administrative Activities

#### **User Management** (`entity_type: 'admin'`)
- `role_assigned` - Role granted to user
- `role_revoked` - Role removed from user
- `user_activated` - Account activated
- `user_suspended` - Account suspended
- `user_promoted` - User promoted
- `user_demoted` - User demoted

#### **System Management** (`entity_type: 'system'`)
- `backup_created` - System backup completed
- `maintenance_started` - Maintenance mode enabled
- `maintenance_ended` - Maintenance mode disabled
- `security_alert` - Security incident detected
- `configuration_changed` - System settings modified
- `migration_executed` - Database migration run

#### **Analytics** (`entity_type: 'analytics'`)
- `report_generated` - Report created
- `data_exported` - Data export completed
- `analytics_viewed` - Analytics dashboard accessed
- `metrics_calculated` - Performance metrics updated

## 2. Activity Data Structure

### 2.1 Core Activity Event Schema

```typescript
interface ActivityEvent {
  id: uuid;                    // Unique identifier
  actor_id: uuid;              // User who performed the action
  actor_name?: string;         // Cached actor display name
  action_type: string;         // Specific action performed
  entity_type: string;         // Type of entity acted upon
  entity_id: uuid;             // Specific entity identifier
  entity_name?: string;        // Cached entity display name
  target_user_id?: uuid;       // For user-to-user actions
  target_user_name?: string;   // Cached target user name
  workspace_id?: uuid;         // Context workspace
  workspace_name?: string;     // Cached workspace name
  
  // Metadata and context
  metadata: jsonb;             // Additional action details
  ip_address?: string;         // Source IP address
  user_agent?: string;         // Browser/client info
  session_id?: string;         // User session identifier
  
  // Privacy and visibility
  privacy_level: 'public' | 'team' | 'organization' | 'private';
  visibility_scope?: jsonb;    // Detailed visibility rules
  
  // Timestamps
  created_at: timestamp;       // When action occurred
  expires_at?: timestamp;      // Optional expiration
}
```

### 2.2 Activity Metadata Examples

```json
{
  "challenge_created": {
    "challenge_title": "AI Innovation Challenge",
    "challenge_type": "hackathon",
    "deadline": "2024-03-15",
    "prize_amount": 50000
  },
  "submission_evaluated": {
    "score": 85,
    "criteria_scores": {
      "innovation": 90,
      "feasibility": 80,
      "impact": 85
    },
    "feedback_length": 250
  },
  "user_promoted": {
    "old_role": "innovator",
    "new_role": "domain_expert",
    "promoted_by": "admin_user_id",
    "effective_date": "2024-01-15"
  }
}
```

## 3. RBAC Activity Viewing Matrix

### 3.1 Role-Based Visibility Rules

| Role | Visibility Scope | Access Level |
|------|------------------|--------------|
| **Super Admin** | All activities across entire platform | Full access |
| **Admin** | All activities within their organization/department | Organization-wide |
| **Team Lead** | Team activities + subordinate activities + own | Team + personal |
| **Innovation Team** | Challenge/submission activities they manage | Project-based |
| **Domain Expert** | Activities related to their evaluation assignments | Assignment-based |
| **Partner** | Activities related to their partnerships/opportunities | Partnership-based |
| **User** | Own activities + public activities they can access | Personal + public |

### 3.2 Context-Based Access Control

#### **Workspace-Level Access**
- Users can see activities in workspaces they're members of
- Workspace admins can see all activities in their workspace
- Read-only members see limited activity types

#### **Entity-Level Access**
- Users can see activities on entities they have permission to view
- Content creators can see all activities on their content
- Collaborators see activities relevant to their role

#### **Privacy-Level Filtering**
- **Public**: Visible to all authenticated users
- **Team**: Visible to team members only
- **Organization**: Visible to organization members
- **Private**: Visible to actor and explicitly granted users

### 3.3 Activity Feed Filtering

```typescript
interface ActivityFilter {
  user_roles: string[];           // Current user's roles
  workspace_memberships: uuid[];  // Workspaces user belongs to
  team_memberships: uuid[];       // Teams user belongs to
  privacy_levels: string[];       // Allowed privacy levels
  entity_permissions: {           // Entity-specific permissions
    [entity_type: string]: {
      can_view: boolean;
      entity_ids?: uuid[];        // Specific entities user can access
    }
  };
}
```

## 4. Implementation Architecture

### 4.1 Database Layer

#### **Tables Structure**
```sql
-- Main activity events table
CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action_type VARCHAR NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  workspace_id UUID,
  metadata JSONB DEFAULT '{}',
  privacy_level VARCHAR DEFAULT 'public',
  visibility_scope JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Activity summaries for performance
CREATE TABLE activity_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  activity_counts JSONB NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- User activity preferences
CREATE TABLE user_activity_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  feed_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### **Indexes for Performance**
```sql
-- Core indexes
CREATE INDEX idx_activity_events_actor_id ON activity_events(actor_id);
CREATE INDEX idx_activity_events_entity ON activity_events(entity_type, entity_id);
CREATE INDEX idx_activity_events_created_at ON activity_events(created_at DESC);
CREATE INDEX idx_activity_events_workspace ON activity_events(workspace_id);

-- Composite indexes for common queries
CREATE INDEX idx_activity_events_actor_created ON activity_events(actor_id, created_at DESC);
CREATE INDEX idx_activity_events_entity_created ON activity_events(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_activity_events_privacy_created ON activity_events(privacy_level, created_at DESC);
```

### 4.2 Service Layer

#### **Activity Logger Service**
```typescript
interface ActivityLoggerService {
  logActivity(event: ActivityEventInput): Promise<ActivityEvent>;
  logBulkActivities(events: ActivityEventInput[]): Promise<ActivityEvent[]>;
  getActivityFeed(userId: uuid, filters: ActivityFilter): Promise<ActivityEvent[]>;
  getUserActivities(userId: uuid, limit?: number): Promise<ActivityEvent[]>;
  getEntityActivities(entityType: string, entityId: uuid): Promise<ActivityEvent[]>;
  searchActivities(query: string, filters: ActivityFilter): Promise<ActivityEvent[]>;
}
```

#### **Real-time Activity Streaming**
```typescript
interface ActivityStreamService {
  subscribeToUserFeed(userId: uuid): Observable<ActivityEvent>;
  subscribeToEntityActivities(entityType: string, entityId: uuid): Observable<ActivityEvent>;
  subscribeToWorkspaceActivities(workspaceId: uuid): Observable<ActivityEvent>;
  broadcastActivity(event: ActivityEvent): void;
}
```

#### **Activity Notification Service**
```typescript
interface ActivityNotificationService {
  processActivityForNotifications(event: ActivityEvent): Promise<void>;
  sendDigestNotifications(userId: uuid, period: 'daily' | 'weekly'): Promise<void>;
  getNotificationPreferences(userId: uuid): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: uuid, preferences: NotificationPreferences): Promise<void>;
}
```

### 4.3 API Layer

#### **Activity Feed Endpoints**
```typescript
// GET /api/activities/feed - Get user's activity feed
// GET /api/activities/user/{userId} - Get specific user's activities
// GET /api/activities/entity/{entityType}/{entityId} - Get entity activities
// GET /api/activities/workspace/{workspaceId} - Get workspace activities
// POST /api/activities/search - Search activities
// GET /api/activities/summary - Get activity summary/analytics
```

## 5. Auto-Population Strategy

### 5.1 Database Triggers

#### **Automatic Activity Creation**
```sql
-- Function to create activity events
CREATE OR REPLACE FUNCTION log_entity_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_events (
    actor_id,
    action_type,
    entity_type,
    entity_id,
    metadata,
    privacy_level
  ) VALUES (
    auth.uid(),
    TG_ARGV[0], -- action type passed as trigger argument
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old_values', to_jsonb(OLD),
      'new_values', to_jsonb(NEW),
      'operation', TG_OP
    ),
    COALESCE(NEW.privacy_level, 'public')
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers to key tables
CREATE TRIGGER challenges_activity_trigger
  AFTER INSERT OR UPDATE OR DELETE ON challenges
  FOR EACH ROW EXECUTE FUNCTION log_entity_activity('challenge_modified');
```

### 5.2 Application-Level Logging

#### **React Hook for Activity Logging**
```typescript
export const useActivityLogger = () => {
  const logActivity = useCallback(async (
    actionType: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>
  ) => {
    await supabase.functions.invoke('log-activity', {
      body: {
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        metadata
      }
    });
  }, []);

  return { logActivity };
};
```

#### **Middleware for HTTP Requests**
```typescript
// Automatic logging for API requests
export const activityMiddleware = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 400) {
      logActivity({
        action_type: `${req.method.toLowerCase()}_${req.route?.path}`,
        entity_type: 'api',
        metadata: {
          method: req.method,
          path: req.path,
          status_code: res.statusCode,
          duration: Date.now() - req.start_time
        }
      });
    }
  });
  next();
};
```

### 5.3 Background Processing

#### **Activity Aggregation Jobs**
```typescript
// Scheduled job to create activity summaries
export const activityAggregationJob = async () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Aggregate activities by entity type
  const summaries = await aggregateActivitiesByPeriod(yesterday, 'day');
  
  // Store summaries for fast retrieval
  await storeActivitySummaries(summaries);
  
  // Clean up old detailed activities (optional)
  await archiveOldActivities(30); // Archive activities older than 30 days
};
```

## 6. Privacy & Security

### 6.1 Data Protection

#### **PII Masking**
```typescript
const maskSensitiveData = (metadata: any): any => {
  const sensitiveFields = ['email', 'phone', 'address', 'ssn'];
  
  return Object.keys(metadata).reduce((masked, key) => {
    if (sensitiveFields.includes(key.toLowerCase())) {
      masked[key] = '***masked***';
    } else {
      masked[key] = metadata[key];
    }
    return masked;
  }, {});
};
```

#### **Retention Policies**
```typescript
interface RetentionPolicy {
  activity_type: string;
  retention_days: number;
  archive_after_days: number;
  anonymize_after_days: number;
}

const defaultRetentionPolicies: RetentionPolicy[] = [
  { activity_type: 'user_login', retention_days: 90, archive_after_days: 30, anonymize_after_days: 365 },
  { activity_type: 'challenge_created', retention_days: 1095, archive_after_days: 365, anonymize_after_days: 2190 },
  { activity_type: 'submission_evaluated', retention_days: 1095, archive_after_days: 365, anonymize_after_days: 2190 }
];
```

### 6.2 Access Control Implementation

#### **Row-Level Security Policies**
```sql
-- Policy for viewing activities based on user roles and permissions
CREATE POLICY activity_events_select_policy ON activity_events
FOR SELECT TO authenticated
USING (
  -- Users can always see their own activities
  actor_id = auth.uid()
  
  -- Or activities that are public
  OR privacy_level = 'public'
  
  -- Or activities in workspaces they belong to
  OR workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
  
  -- Or activities they have specific permission to view
  OR has_activity_permission(auth.uid(), id)
);
```

#### **Permission Checking Function**
```sql
CREATE OR REPLACE FUNCTION has_activity_permission(user_id UUID, activity_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  activity_record activity_events%ROWTYPE;
  user_roles TEXT[];
BEGIN
  SELECT * INTO activity_record FROM activity_events WHERE id = activity_id;
  SELECT array_agg(role) INTO user_roles FROM user_roles WHERE user_id = user_id;
  
  -- Super admins can see everything
  IF 'super_admin' = ANY(user_roles) THEN
    RETURN TRUE;
  END IF;
  
  -- Additional role-based checks
  CASE activity_record.privacy_level
    WHEN 'team' THEN
      RETURN EXISTS(
        SELECT 1 FROM team_members 
        WHERE user_id = user_id 
        AND team_id = (activity_record.metadata->>'team_id')::UUID
      );
    WHEN 'organization' THEN
      RETURN 'admin' = ANY(user_roles);
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 7. Performance Optimization

### 7.1 Caching Strategy

#### **Activity Feed Caching**
```typescript
interface ActivityCache {
  getUserFeedCache(userId: uuid): Promise<ActivityEvent[]>;
  setUserFeedCache(userId: uuid, activities: ActivityEvent[]): Promise<void>;
  invalidateUserCache(userId: uuid): Promise<void>;
  invalidateEntityCache(entityType: string, entityId: uuid): Promise<void>;
}
```

### 7.2 Pagination and Infinite Scroll

#### **Cursor-Based Pagination**
```typescript
interface ActivityPagination {
  cursor?: string;        // Last activity ID
  limit: number;          // Number of activities to fetch
  direction: 'before' | 'after';
}

const getActivityFeed = async (
  userId: uuid,
  pagination: ActivityPagination
): Promise<{
  activities: ActivityEvent[];
  nextCursor?: string;
  hasMore: boolean;
}> => {
  // Implementation with efficient cursor-based pagination
};
```

## 8. Monitoring & Analytics

### 8.1 Activity Metrics

#### **Key Performance Indicators**
- Activity volume by type and time period
- User engagement levels
- Most active entities and workspaces
- Activity distribution across user roles
- Performance metrics (query response times)

#### **System Health Monitoring**
```typescript
interface ActivitySystemHealth {
  activities_per_second: number;
  avg_query_response_time: number;
  failed_activity_logs: number;
  cache_hit_rate: number;
  storage_usage_gb: number;
}
```

## 9. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Database schema creation
- [ ] Basic activity logging service
- [ ] Core RLS policies
- [ ] Basic API endpoints

### Phase 2: Integration (Weeks 3-4)
- [ ] Database triggers for automatic logging
- [ ] React hooks for manual logging
- [ ] Activity feed components
- [ ] User preferences system

### Phase 3: Advanced Features (Weeks 5-6)
- [ ] Real-time activity streaming
- [ ] Activity notifications
- [ ] Advanced filtering and search
- [ ] Activity analytics dashboard

### Phase 4: Optimization (Weeks 7-8)
- [ ] Performance optimization
- [ ] Caching implementation
- [ ] Data archiving and cleanup
- [ ] Monitoring and alerting

## 10. Testing Strategy

### 10.1 Unit Tests
- Activity logging functions
- Permission checking logic
- Data transformation utilities
- Cache management

### 10.2 Integration Tests
- End-to-end activity flows
- RBAC enforcement
- Real-time updates
- API endpoint functionality

### 10.3 Performance Tests
- High-volume activity logging
- Feed loading performance
- Database query optimization
- Cache effectiveness

## 11. Documentation Requirements

### 11.1 Technical Documentation
- API documentation with examples
- Database schema documentation
- Configuration guide
- Troubleshooting guide

### 11.2 User Documentation
- Activity feed user guide
- Privacy settings explanation
- Notification preferences
- Admin management guide

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-20  
**Status**: Draft - Ready for Implementation  
**Estimated Timeline**: 8 weeks  
**Team Size**: 3-4 developers
