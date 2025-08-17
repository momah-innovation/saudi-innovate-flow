# 🔔 Notifications & Messaging API

## Overview

Multi-channel notification system supporting email, SMS, push notifications, and in-app messaging.

## Notification Channels

### Available Channels
- **Email** - HTML/text email notifications
- **SMS** - Text message alerts
- **Push** - Browser/mobile push notifications  
- **In-App** - Platform notifications
- **Real-time** - WebSocket live updates

## Email Notifications

### Send Email via Edge Function
```http
POST /functions/v1/send-notification
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_id": "user_uuid",
  "channels": ["email"],
  "template": "challenge_invitation",
  "data": {
    "challenge_title": "Innovation Challenge 2025",
    "deadline": "2025-02-15",
    "recipient_name": "Ahmed"
  },
  "language": "ar"
}
```

### Email Templates
```http
POST /functions/v1/email-templates
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "template_id": "challenge_invitation",
  "recipient": "user@example.com",
  "data": {
    "user_name": "Ahmed",
    "challenge_title": "تحدي الابتكار 2025",
    "challenge_url": "https://platform.com/challenges/123",
    "deadline": "2025-02-15"
  },
  "language": "ar"
}
```

**Available Templates:**
- `challenge_invitation` - Challenge participation invite
- `idea_submission_confirmation` - Idea submission receipt
- `event_registration` - Event registration confirmation
- `evaluation_complete` - Evaluation results
- `password_reset` - Password reset instructions
- `welcome_message` - New user welcome

## SMS Notifications

### Send SMS
```http
POST /functions/v1/sms-sender
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "phone_number": "+966501234567",
  "message": "Your verification code is: 123456",
  "type": "verification",
  "language": "ar"
}
```

### SMS Types
- `verification` - Account verification codes
- `alert` - Important system alerts
- `reminder` - Event/deadline reminders
- `notification` - General notifications

## In-App Notifications

### Create Notification
```http
POST /rest/v1/notifications
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "user_id": "user_uuid",
  "title": "New Challenge Available",
  "title_ar": "تحدي جديد متاح",
  "message": "A new innovation challenge has been published",
  "message_ar": "تم نشر تحدي ابتكار جديد",
  "type": "challenge",
  "data": {
    "challenge_id": "challenge_uuid",
    "action_url": "/challenges/123"
  },
  "priority": "medium"
}
```

### Get User Notifications
```http
GET /rest/v1/notifications?user_id=eq.<user_id>&is_read=eq.false&order=created_at.desc&limit=50
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "notification_uuid",
    "user_id": "user_uuid",
    "title": "New Challenge Available",
    "title_ar": "تحدي جديد متاح",
    "message": "A new innovation challenge has been published",
    "message_ar": "تم نشر تحدي ابتكار جديد",
    "type": "challenge",
    "priority": "medium",
    "is_read": false,
    "data": {
      "challenge_id": "challenge_uuid",
      "action_url": "/challenges/123"
    },
    "created_at": "2025-01-17T18:45:49Z"
  }
]
```

### Mark as Read
```http
PATCH /rest/v1/notifications?id=eq.<notification_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "is_read": true,
  "read_at": "2025-01-17T18:45:49Z"
}
```

### Mark All as Read
```http
PATCH /rest/v1/notifications?user_id=eq.<user_id>&is_read=eq.false
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "is_read": true,
  "read_at": "2025-01-17T18:45:49Z"
}
```

## Push Notifications

### Register Device for Push
```javascript
// Register service worker for push notifications
const registration = await navigator.serviceWorker.register('/sw.js');

// Subscribe to push notifications
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: vapidPublicKey
});

// Send subscription to server
await supabase.from('push_subscriptions').insert({
  user_id: userId,
  subscription: JSON.stringify(subscription),
  device_type: 'web'
});
```

### Send Push Notification
```http
POST /functions/v1/send-notification
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_id": "user_uuid",
  "channels": ["push"],
  "title": "New Challenge Available",
  "message": "Check out the latest innovation challenge",
  "data": {
    "url": "/challenges/123",
    "icon": "/icons/challenge.png",
    "badge": "/icons/badge.png"
  }
}
```

## Real-time Notifications

### Subscribe to User Notifications
```javascript
const notificationChannel = supabase
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
      // Show real-time notification
      showToastNotification(payload.new);
      
      // Update notification count
      updateNotificationBadge();
    }
  )
  .subscribe();
```

### Real-time Toast Notifications
```javascript
const showToastNotification = (notification) => {
  const toast = {
    id: notification.id,
    title: notification.title_ar || notification.title,
    message: notification.message_ar || notification.message,
    type: notification.type,
    duration: 5000,
    actions: [
      {
        label: 'View',
        action: () => navigateToNotification(notification)
      },
      {
        label: 'Dismiss',
        action: () => dismissNotification(notification.id)
      }
    ]
  };
  
  toastManager.show(toast);
};
```

## Notification Preferences

### Get User Preferences
```http
GET /rest/v1/notification_preferences?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user_id": "user_uuid",
  "email_enabled": true,
  "sms_enabled": false,
  "push_enabled": true,
  "in_app_enabled": true,
  "preferences": {
    "challenges": {
      "new_challenge": true,
      "deadline_reminder": true,
      "evaluation_complete": false
    },
    "ideas": {
      "submission_received": true,
      "feedback_available": true
    },
    "events": {
      "registration_confirmed": true,
      "event_reminder": true,
      "event_cancelled": true
    }
  }
}
```

### Update Preferences
```http
PATCH /rest/v1/notification_preferences?user_id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "email_enabled": true,
  "sms_enabled": false,
  "preferences": {
    "challenges": {
      "new_challenge": true,
      "deadline_reminder": false
    }
  }
}
```

## Notification Types

### System Notifications
- `system_maintenance` - Scheduled maintenance alerts
- `system_update` - Platform updates
- `security_alert` - Security-related notifications

### Challenge Notifications
- `challenge_published` - New challenge available
- `challenge_deadline` - Deadline reminders
- `challenge_evaluation` - Evaluation completed
- `challenge_winner` - Winner announcements

### Idea Notifications
- `idea_submitted` - Submission confirmation
- `idea_feedback` - Feedback received
- `idea_approved` - Idea approved
- `idea_rejected` - Idea rejected

### Event Notifications
- `event_published` - New event available
- `event_registration` - Registration confirmed
- `event_reminder` - Event reminders
- `event_cancelled` - Event cancellation

## Batch Notifications

### Send to Multiple Users
```http
POST /functions/v1/send-notification
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_ids": ["user1_uuid", "user2_uuid", "user3_uuid"],
  "channels": ["email", "in_app"],
  "title": "Batch Notification",
  "message": "This message goes to multiple users",
  "type": "announcement"
}
```

### Send to User Group
```http
POST /functions/v1/send-notification
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_group": "challenge_participants",
  "group_filter": {
    "challenge_id": "challenge_uuid"
  },
  "channels": ["email"],
  "template": "challenge_update",
  "data": {
    "challenge_title": "Innovation Challenge",
    "update_message": "New resources have been added"
  }
}
```

## JavaScript Integration

### Notification Manager Hook
```javascript
const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast
            showToast(payload.new);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
            
            if (payload.new.is_read && !payload.old.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    fetchNotifications();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);
      
    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);
      
    if (!error) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};
```

### Toast Notification Component
```javascript
const ToastNotification = ({ notification, onDismiss }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`toast toast-${notification.priority}`}>
      <div className="toast-header">
        <h4>{notification.title_ar || notification.title}</h4>
        <button onClick={() => onDismiss(notification.id)}>×</button>
      </div>
      <div className="toast-body">
        <p>{notification.message_ar || notification.message}</p>
        {notification.data?.action_url && (
          <button 
            onClick={() => window.location.href = notification.data.action_url}
            className="toast-action"
          >
            {t('notifications.view')}
          </button>
        )}
      </div>
    </div>
  );
};
```

## Error Handling

### Common Errors
- `400` - Invalid notification data
- `401` - Authentication required
- `403` - Permission denied
- `404` - User/template not found
- `429` - Rate limit exceeded
- `500` - Delivery failed

### Retry Logic
```javascript
const sendNotificationWithRetry = async (notification, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: notification
      });
      
      if (!error) return data;
      
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }
  }
};
```