
# 🔍 Activity Monitoring & Logging System

## Overview

The Ruwād Platform implements a **comprehensive activity monitoring system** with **real-time logging**, **RBAC-based access control**, and **intelligent activity feeds**. This system provides complete visibility into user actions, system events, and business processes while maintaining privacy and security.

## System Architecture

### 1. **Activity Data Model**

#### Core Activity Structure
```typescript
interface ActivityEvent {
  id: uuid;
  actor_id: uuid;              // Who performed the action
  action_type: string;         // What action was performed
  entity_type: string;         // What was acted upon (challenge, idea, event, etc.)
  entity_id: uuid;             // Specific entity ID
  target_user_id?: uuid;       // For user-to-user actions
  workspace_id?: uuid;         // Context workspace
  workspace_type?: string;     // Workspace context type
  metadata: jsonb;             // Additional details and context
  ip_address?: string;         // Request origin
  user_agent?: string;         // Client information
  privacy_level: string;       // public, team, organization, private
  severity: string;            // info, warning, error, critical
  tags: string[];              // Categorization tags
  created_at: timestamp;
  expires_at?: timestamp;      // For temporary activities
}
```

### 2. **Activity Categories**

#### **Entity Lifecycle Activities**
- **Challenges**: `challenge_created`, `challenge_updated`, `challenge_published`, `challenge_archived`, `challenge_deleted`
- **Ideas/Submissions**: `idea_created`, `idea_submitted`, `idea_reviewed`, `idea_approved`, `idea_implemented`
- **Events**: `event_created`, `event_registered`, `event_attended`, `event_cancelled`
- **Opportunities**: `opportunity_created`, `opportunity_applied`, `opportunity_awarded`
- **Partnerships**: `partnership_created`, `partnership_activated`, `partnership_ended`
- **Campaigns**: `campaign_launched`, `campaign_updated`, `campaign_completed`

#### **User Engagement Activities**
- **Social**: `liked`, `bookmarked`, `shared`, `commented`, `followed`, `unfollowed`
- **Collaboration**: `team_joined`, `team_left`, `task_assigned`, `task_completed`, `message_sent`
- **Content**: `file_uploaded`, `file_downloaded`, `workspace_created`, `workspace_joined`

#### **Authentication & Security**
- **Auth**: `user_login`, `user_logout`, `password_changed`, `profile_updated`
- **Security**: `failed_login`, `suspicious_activity`, `permission_denied`, `security_alert`

#### **Administrative Activities**
- **Management**: `role_assigned`, `role_revoked`, `user_activated`, `user_suspended`
- **System**: `backup_created`, `maintenance_started`, `configuration_changed`
- **Analytics**: `report_generated`, `data_exported`, `analytics_viewed`

### 3. **RBAC Activity Viewing Matrix**

#### **Role-Based Access Control**

| Role | Scope | Permissions |
|------|-------|-------------|
| **Super Admin** | Global | All activities across all entities and users |
| **Admin** | Organization | All activities within their organization/department |
| **Team Lead** | Team | Team activities + direct reports + own activities |
| **Innovation Team** | Managed Content | Activities on challenges/submissions they manage |
| **Domain Expert** | Assignments | Activities related to their evaluation assignments |
| **Partner** | Partnerships | Activities related to their partnerships/opportunities |
| **Evaluator** | Reviews | Activities on content they're assigned to evaluate |
| **User** | Personal | Own activities + public activities + team activities |

#### **Context-Based Visibility**

```typescript
interface ActivityAccessContext {
  workspace_access: {
    user: boolean;      // Can view activities in user workspaces they're in
    expert: boolean;    // Can view expert workspace activities if expert
    org: boolean;       // Can view org activities if org member
    partner: boolean;   // Can view partner activities if partner
    admin: boolean;     // Can view admin activities if admin
    team: boolean;      // Can view team activities if team member
  };
  
  privacy_levels: {
    public: boolean;        // Always visible to authenticated users
    team: boolean;          // Visible to team members
    organization: boolean;  // Visible to org members
    private: boolean;       // Only visible to actor and admins
  };
  
  entity_access: {
    owned: boolean;         // Activities on entities user owns
    assigned: boolean;      // Activities on entities user is assigned to
    participated: boolean;  // Activities on entities user participated in
    public: boolean;        // Activities on public entities
  };
}
```

### 4. **Activity Logging Service**

#### **Automatic Logging**
- Database triggers for CRUD operations
- Middleware for API requests
- React hooks for user interactions
- Background jobs for system events

#### **Manual Logging**
```typescript
const { logActivity } = useActivityLogger();

await logActivity({
  action_type: 'challenge_submitted',
  entity_type: 'challenge',
  entity_id: challengeId,
  metadata: {
    submission_id: submissionId,
    team_members: teamIds,
    submission_type: 'individual'
  },
  privacy_level: 'team'
});
```

### 5. **Real-time Activity Feeds**

#### **Feed Types**
- **Personal Feed**: User's own activities and notifications
- **Team Feed**: Activities within user's teams
- **Workspace Feed**: Activities within specific workspaces
- **Global Feed**: Public activities across the platform
- **Entity Feed**: Activities related to specific entities

#### **Feed Filtering**
```typescript
interface ActivityFeedFilter {
  action_types: string[];
  entity_types: string[];
  privacy_levels: string[];
  date_range: { start: Date; end: Date };
  actors: string[];
  workspaces: string[];
  tags: string[];
}
```

### 6. **Performance & Scalability**

#### **Data Management**
- **Partitioning**: Activities partitioned by date for performance
- **Archiving**: Old activities moved to cold storage
- **Aggregation**: Pre-computed activity summaries
- **Caching**: Frequently accessed feeds cached in Redis

#### **Query Optimization**
- Composite indexes on common query patterns
- Materialized views for complex aggregations
- Background processing for heavy operations
- Rate limiting for activity queries

### 7. **Privacy & Security**

#### **Data Protection**
- PII masking in activity logs
- Configurable data retention periods
- GDPR compliance with right to erasure
- Encryption of sensitive metadata

#### **Access Auditing**
- All activity access is logged
- Audit trails for administrative actions
- Anomaly detection for unusual access patterns
- Compliance reporting capabilities

### 8. **Integration Points**

#### **Notification System**
- Activities trigger relevant notifications
- Configurable notification preferences
- Digest emails for activity summaries
- Real-time push notifications

#### **Analytics Integration**
- Activities feed into analytics pipelines
- User behavior analysis
- Engagement metrics calculation
- Performance monitoring

#### **Search Integration**
- Activities indexed for full-text search
- Advanced filtering and sorting
- Historical activity search
- Cross-entity activity correlation

## Implementation Phases

### **Phase 1: Foundation** (2-3 weeks)
- Database schema implementation
- Core activity logging service
- Basic RBAC policies
- Essential triggers

### **Phase 2: Integration** (2-3 weeks)
- Frontend activity components
- Real-time activity feeds
- Activity filtering and search
- Notification integration

### **Phase 3: Enhancement** (2-3 weeks)
- Advanced analytics
- Performance optimization
- Security hardening
- Compliance features

### **Phase 4: Polish** (1-2 weeks)
- UI/UX improvements
- Testing and bug fixes
- Documentation completion
- Production deployment

---

**System Status**: 🚧 **In Development**  
**Expected Completion**: Q1 2024  
**Priority**: **High** - Critical for platform observability
