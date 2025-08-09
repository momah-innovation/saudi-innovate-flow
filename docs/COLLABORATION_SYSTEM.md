/**
 * Real-Time Collaboration System Documentation
 * 
 * Complete implementation guide for the multi-user collaboration platform
 */

# Real-Time Collaboration System

## 🎯 Overview

The Real-Time Collaboration System enables seamless multi-user interaction across the Ruwād platform, supporting real-time messaging, user presence tracking, activity feeds, notifications, and collaborative editing.

## 🏗️ Architecture

### Database Schema

#### Core Collaboration Tables
```sql
-- User Presence Tracking
CREATE TABLE user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('online', 'away', 'busy', 'offline')) DEFAULT 'online',
  current_location JSONB,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Events
CREATE TABLE activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  privacy_level TEXT DEFAULT 'public',
  visibility_scope JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Messages
CREATE TABLE collaboration_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID,
  space_id UUID,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  context JSONB DEFAULT '{}',
  thread_id UUID,
  reply_to UUID,
  metadata JSONB DEFAULT '{}',
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration Spaces
CREATE TABLE collaboration_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  space_type TEXT NOT NULL,
  privacy_level TEXT DEFAULT 'public',
  created_by UUID,
  participants UUID[] DEFAULT '{}',
  admins UUID[] DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Translation System Integration
All collaboration strings are stored in the `system_translations` table with category 'collaboration'.

## 🔧 Core Components

### 1. Context Provider
```typescript
// src/contexts/CollaborationContext.tsx
import { CollaborationProvider, useCollaboration } from '@/contexts/CollaborationContext';

// Wrap your app
<CollaborationProvider>
  <App />
</CollaborationProvider>
```

### 2. Real-Time Hook
```typescript
// src/hooks/useRealTimeCollaboration.ts
const {
  onlineUsers,
  currentUserPresence,
  updatePresence,
  messages,
  sendMessage,
  activities,
  notifications,
  isConnected,
  connectionQuality
} = useRealTimeCollaboration();
```

### 3. UI Components

#### User Presence
```typescript
import { UserPresence } from '@/components/collaboration';

<UserPresence 
  showOnlineCount={true}
  maxUsers={5}
  size="sm"
/>
```

#### Activity Feed
```typescript
import { ActivityFeed } from '@/components/collaboration';

<ActivityFeed 
  scope="organization"
  limit={50}
  showFilters={true}
/>
```

#### Messaging Panel
```typescript
import { MessagingPanel } from '@/components/collaboration';

<MessagingPanel 
  contextType="team"
  contextId="team-123"
  isOpen={true}
/>
```

#### Notification Center
```typescript
import { NotificationCenter } from '@/components/collaboration';

<NotificationCenter 
  isOpen={showNotifications}
  onClose={() => setShowNotifications(false)}
/>
```

## 🏷️ Tag System Integration

### Tag Selector Component
```typescript
import { TagSelector } from '@/components/collaboration';

<TagSelector 
  entityType="challenge"
  entityId="challenge-123"
  onTagsChange={(tags) => handleTagsUpdate(tags)}
  showSuggestions={true}
  maxTags={10}
/>
```

### Tag Integration Hook
```typescript
import { useTagIntegration } from '@/hooks/useTagIntegration';

const {
  tags,
  searchTags,
  getSuggestedTags,
  addTagToEntity,
  removeTagFromEntity
} = useTagIntegration();
```

## 👥 User Mention System

### User Mention Selector
```typescript
import { UserMentionSelector } from '@/components/collaboration';

<UserMentionSelector 
  onUserSelect={(user) => handleUserMention(user)}
  contextType="team"
  contextId="team-123"
  showSuggestions={true}
/>
```

### User Discovery Hook
```typescript
import { useUserDiscovery } from '@/hooks/useUserDiscovery';

const {
  searchResults,
  searchUsers,
  getOnlineUsers,
  getUserSuggestions
} = useUserDiscovery();
```

## 🔒 Security & RBAC

### Row-Level Security Policies

#### User Presence
- Users can only update their own presence
- All users can view public presence data
- Team members can view organization presence

#### Messages
- Users can only send messages to accessible spaces
- Message visibility based on space privacy level
- Admins can moderate messages

#### Activity Events
- Users can create activities for their actions
- Activity visibility based on privacy level
- Organization members can view organization activities

### Role-Based Access Control
```typescript
// Collaboration permissions by role
const collaborationPermissions = {
  admin: ['view_all', 'moderate', 'manage_spaces'],
  team_member: ['participate', 'create_spaces', 'invite_users'],
  user: ['participate', 'view_public']
};
```

## 🚀 Real-Time Features

### Presence Tracking
- Automatic online/offline detection
- Current page location tracking
- Heartbeat mechanism every 30 seconds
- Graceful disconnection handling

### Live Updates
- Real-time message delivery
- Activity feed updates
- Notification pushes
- User presence changes

### WebSocket Implementation
Uses Supabase Realtime for:
- Presence channels
- Database change listeners
- Custom event broadcasting

## 📱 Platform Integration

### Navigation Integration
```typescript
// Add to navigation menu
const collaborationMenuItem = {
  to: '/collaboration',
  label: t('collaboration.collaboration'),
  icon: Users,
  permission: 'collaborate'
};
```

### Workspace Integration
```typescript
import { WorkspaceCollaboration } from '@/components/collaboration';

<WorkspaceCollaboration 
  workspaceId="workspace-123"
  enableMessaging={true}
  enablePresence={true}
  enableActivityFeed={true}
/>
```

## 🔧 Configuration

### Environment Variables
```env
# Supabase configuration (automatically configured)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Real-Time Settings
```typescript
// Collaboration settings
const collaborationConfig = {
  presenceHeartbeat: 30000, // 30 seconds
  messageRetention: 30, // days
  maxConcurrentUsers: 1000,
  enableNotifications: true,
  enablePresence: true,
  enableMessaging: true
};
```

## 📊 Analytics & Monitoring

### Usage Tracking
- User engagement metrics
- Message frequency
- Feature adoption rates
- Performance monitoring

### Admin Dashboard
- Real-time user count
- System health status
- Usage statistics
- Moderation tools

## 🔄 Migration Guide

### From Legacy System
1. Update existing components to use new collaboration hooks
2. Migrate hardcoded translations to database
3. Implement new RBAC permissions
4. Test real-time functionality

### Breaking Changes
- `useTranslation` replaced with `useUnifiedTranslation`
- Static translation files deprecated
- New permission structure required

## 🐛 Troubleshooting

### Common Issues

#### Real-Time Connection Issues
```typescript
// Check connection status
const { isConnected, connectionQuality } = useRealTimeCollaboration();

if (!isConnected) {
  // Handle disconnection
  toast.error(t('collaboration.connection_failed'));
}
```

#### Permission Errors
```typescript
// Verify user permissions
const hasPermission = await checkCollaborationPermission(user, 'participate');
if (!hasPermission) {
  throw new Error(t('collaboration.access_denied'));
}
```

#### Translation Missing
```typescript
// Fallback handling
const text = t('collaboration.some_key', 'Default fallback text');
```

## 📚 API Reference

### Hooks
- `useRealTimeCollaboration()` - Core collaboration functionality
- `useTagIntegration()` - Tag management
- `useUserDiscovery()` - User search and mentions
- `useUnifiedTranslation()` - Database-driven translations

### Components
- `UserPresence` - User status display
- `ActivityFeed` - Live activity stream
- `MessagingPanel` - Real-time chat
- `NotificationCenter` - Notification management
- `TagSelector` - Content tagging
- `UserMentionSelector` - User mentions
- `CollaborationWidget` - Main collaboration UI

### Types
- `UserPresence` - User presence data
- `ActivityEvent` - Activity event structure
- `CollaborationMessage` - Message structure
- `RealtimeNotification` - Notification structure

## 🚀 Deployment Notes

### Database Setup
```sql
-- Enable real-time for collaboration tables
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_events;
ALTER PUBLICATION supabase_realtime ADD TABLE collaboration_messages;
```

### Performance Optimization
- Connection pooling for WebSocket connections
- Message batching for high-frequency updates
- Presence state caching
- Activity feed pagination

## 📈 Future Enhancements

### Planned Features
- Voice/video calling integration
- Screen sharing capabilities
- File collaboration
- Advanced moderation tools
- Mobile app support
- Offline synchronization

### Integration Opportunities
- Calendar integration
- Task management
- Document collaboration
- AI-powered suggestions
- Analytics dashboard

---

*This documentation is maintained alongside the collaboration system implementation. For technical support, refer to the troubleshooting guide or contact the development team.*