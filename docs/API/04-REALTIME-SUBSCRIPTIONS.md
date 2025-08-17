# ⚡ Real-time Subscriptions API

## Overview

WebSocket-based real-time subscriptions for live data updates, user presence, and collaborative features.

## Connection Setup

### Initialize Real-time Connection
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jxpbiljkoibvqxzdkgod.supabase.co',
  'your-anon-key'
);

// Connection will be established automatically
```

### Connection Status Monitoring
```javascript
const channel = supabase.channel('test-channel');

channel.subscribe((status) => {
  switch (status) {
    case 'SUBSCRIBED':
      console.log('Connected to real-time');
      break;
    case 'CHANNEL_ERROR':
      console.log('Real-time connection error');
      break;
    case 'TIMED_OUT':
      console.log('Real-time connection timed out');
      break;
    case 'CLOSED':
      console.log('Real-time connection closed');
      break;
  }
});
```

## Database Change Subscriptions

### Challenge Updates
Subscribe to challenge table changes.

```javascript
const challengeChannel = supabase
  .channel('challenge-changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'challenges'
    },
    (payload) => {
      console.log('Challenge changed:', payload);
    }
  )
  .subscribe();
```

**Payload Structure:**
```json
{
  "eventType": "INSERT",
  "new": {
    "id": "uuid",
    "title_ar": "تحدي جديد",
    "status": "draft",
    "created_at": "2025-01-17T18:45:49Z"
  },
  "old": {},
  "schema": "public",
  "table": "challenges",
  "commit_timestamp": "2025-01-17T18:45:49Z"
}
```

### Idea Submissions
```javascript
const ideaChannel = supabase
  .channel('idea-submissions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public', 
      table: 'ideas'
    },
    (payload) => {
      // New idea submitted
      showNotification(`New idea: ${payload.new.title_ar}`);
    }
  )
  .subscribe();
```

### User-Specific Notifications
```javascript
const userNotificationChannel = supabase
  .channel(`user-notifications-${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      displayNotification(payload.new);
    }
  )
  .subscribe();
```

## Real-time Channels

### Channel Types
1. **Database Changes** - Table modifications
2. **Broadcast** - Custom messages
3. **Presence** - User online/offline status

### Challenge Discussion Channel
```javascript
const discussionChannel = supabase
  .channel(`challenge-discussion-${challengeId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'challenge_comments',
      filter: `challenge_id=eq.${challengeId}`
    },
    (payload) => {
      addCommentToUI(payload.new);
    }
  )
  .subscribe();
```

### Event Registration Updates
```javascript
const eventChannel = supabase
  .channel(`event-registrations-${eventId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'event_registrations',
      filter: `event_id=eq.${eventId}`
    },
    (payload) => {
      updateRegistrationCount();
    }
  )
  .subscribe();
```

## User Presence Tracking

### Join Presence Channel
```javascript
const presenceChannel = supabase.channel(`room-${roomId}`);

// Track user presence
presenceChannel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await presenceChannel.track({
      user_id: userId,
      username: userName,
      online_at: new Date().toISOString(),
      status: 'online'
    });
  }
});
```

### Listen to Presence Changes
```javascript
presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const presenceState = presenceChannel.presenceState();
    const users = Object.keys(presenceState).map(key => 
      presenceState[key][0]
    );
    updateOnlineUsersList(users);
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    console.log('User joined:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ leftPresences }) => {
    console.log('User left:', leftPresences);
  });
```

## Broadcast Messages

### Send Custom Messages
```javascript
// Send typing indicator
await channel.send({
  type: 'broadcast',
  event: 'typing',
  payload: {
    user_id: userId,
    is_typing: true
  }
});

// Send chat message
await channel.send({
  type: 'broadcast', 
  event: 'message',
  payload: {
    user_id: userId,
    message: 'Hello everyone!',
    timestamp: new Date().toISOString()
  }
});
```

### Listen to Broadcast Messages
```javascript
channel
  .on('broadcast', { event: 'typing' }, (payload) => {
    showTypingIndicator(payload.user_id, payload.is_typing);
  })
  .on('broadcast', { event: 'message' }, (payload) => {
    displayChatMessage(payload);
  });
```

## Advanced Subscriptions

### Multiple Table Subscription
```javascript
const multiTableChannel = supabase
  .channel('admin-dashboard')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'challenges'
    },
    handleChallengeChange
  )
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'ideas'
    },
    handleIdeaChange
  )
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'events'
    },
    handleEventChange
  )
  .subscribe();
```

### Filtered Subscriptions
```javascript
// Only public challenges
const publicChallengesChannel = supabase
  .channel('public-challenges')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'challenges',
      filter: 'status=eq.published'
    },
    (payload) => {
      updatePublicChallengesList(payload.new);
    }
  )
  .subscribe();
```

## React Hooks Examples

### Real-time Challenge Hook
```javascript
const useRealTimeChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel('challenge-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges'
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setChallenges(prev => [payload.new, ...prev]);
              setNotifications(prev => [
                ...prev,
                { type: 'new_challenge', data: payload.new }
              ]);
              break;
            case 'UPDATE':
              setChallenges(prev => 
                prev.map(c => c.id === payload.new.id ? payload.new : c)
              );
              break;
            case 'DELETE':
              setChallenges(prev => 
                prev.filter(c => c.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { challenges, notifications };
};
```

### User Presence Hook
```javascript
const useUserPresence = (roomId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !roomId) return;

    const channel = supabase.channel(`presence-${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state).flatMap(key => state[key]);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            username: user.name,
            avatar_url: user.avatar_url,
            online_at: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomId]);

  return { onlineUsers, userCount: onlineUsers.length };
};
```

## Error Handling

### Connection Error Recovery
```javascript
const setupChannelWithRetry = (channelName, maxRetries = 3) => {
  let retryCount = 0;

  const createChannel = () => {
    const channel = supabase.channel(channelName);

    channel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying connection... (${retryCount}/${maxRetries})`);
        setTimeout(() => {
          supabase.removeChannel(channel);
          createChannel();
        }, 1000 * retryCount);
      } else if (status === 'SUBSCRIBED') {
        retryCount = 0; // Reset on successful connection
      }
    });

    return channel;
  };

  return createChannel();
};
```

### Subscription Management
```javascript
class SubscriptionManager {
  constructor() {
    this.channels = new Map();
  }

  subscribe(channelName, config) {
    // Prevent duplicate subscriptions
    if (this.channels.has(channelName)) {
      console.warn(`Channel ${channelName} already subscribed`);
      return this.channels.get(channelName);
    }

    const channel = supabase.channel(channelName);
    
    // Apply configuration
    if (config.postgresChanges) {
      config.postgresChanges.forEach(change => {
        channel.on('postgres_changes', change.filter, change.callback);
      });
    }

    if (config.broadcast) {
      config.broadcast.forEach(broadcast => {
        channel.on('broadcast', { event: broadcast.event }, broadcast.callback);
      });
    }

    channel.subscribe();
    this.channels.set(channelName, channel);
    
    return channel;
  }

  unsubscribe(channelName) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}
```

## Best Practices

1. **Always clean up subscriptions** in useEffect cleanup
2. **Use channel names strategically** to group related updates
3. **Handle connection states** gracefully
4. **Implement retry logic** for critical subscriptions
5. **Avoid too many simultaneous channels**
6. **Use filters** to reduce unnecessary data transfer

### Performance Tips
```javascript
// ✅ Good: Specific filtering
.on('postgres_changes', {
  event: 'UPDATE',
  schema: 'public',
  table: 'challenges',
  filter: 'status=eq.published'
}, callback)

// ❌ Avoid: Overly broad subscriptions
.on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'all_data'
}, callback)
```

## Debugging

### Enable Debug Logs
```javascript
// Enable debug mode
localStorage.setItem('supabase.debug', 'true');

// Monitor channel state
console.log('Channel state:', channel.state);
console.log('Presence state:', channel.presenceState());
```

### Common Issues
1. **Connection drops** - Implement retry logic
2. **Memory leaks** - Always unsubscribe channels
3. **Duplicate subscriptions** - Check existing channels
4. **Missing RLS policies** - Ensure proper permissions