import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { debugLog } from '@/utils/debugLogger';
import { useTimerManager } from '@/utils/timerManager';
import type { 
  UserPresence, 
  ActivityEvent, 
  CollaborationMessage, 
  RealtimeNotification,
  UseCollaborationReturn 
} from '@/types/collaboration';

export const useRealTimeCollaboration = (): UseCollaborationReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentUserPresence, setCurrentUserPresence] = useState<UserPresence | null>(null);
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'slow' | 'poor'>('good');
  
  // Refs for cleanup
  const channelsRef = useRef<Record<string, any>>({});
  const presenceTimerRef = useRef<(() => void) | undefined>();

  // Initialize real-time connections
  useEffect(() => {
    if (!user) {
      // Cleanup when user is not available
      Object.values(channelsRef.current).forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = {};
      setIsConnected(false);
      return;
    }

    let isMounted = true;

    const initializeCollaboration = async () => {
      try {
        // Prevent multiple initializations
        if (Object.keys(channelsRef.current).length > 0) {
          return;
        }

        await setupPresenceChannel();
        await setupActivityChannel();
        await setupMessagingChannel();
        await setupNotificationChannel();
        
        if (isMounted) {
          setIsConnected(true);
        }
      } catch (error) {
        debugLog.error('Failed to initialize collaboration', { error });
        if (isMounted) {
          setConnectionQuality('poor');
          toast({
            title: "اتصال ضعيف",
            description: "يواجه النظام صعوبة في الاتصال. يرجى المحاولة مرة أخرى.",
            variant: "destructive",
          });
        }
      }
    };

    initializeCollaboration();

    return () => {
      isMounted = false;
      // Cleanup all channels
      Object.values(channelsRef.current).forEach(channel => {
        if (channel && typeof channel.unsubscribe === 'function') {
          channel.unsubscribe();
        }
        supabase.removeChannel(channel);
      });
      channelsRef.current = {};
      
      if (presenceTimerRef.current) {
        presenceTimerRef.current();
        presenceTimerRef.current = undefined;
      }
      
      setIsConnected(false);
      setOnlineUsers([]);
      setCurrentUserPresence(null);
    };
  }, [user?.id]); // Only depend on user ID, not the entire user object

  // Setup presence tracking
  const setupPresenceChannel = async () => {
    if (!user) return;

    const presenceChannel = supabase.channel('global-presence', {
      config: { presence: { key: user.id } }
    });

    // Track current user presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat().map((presence: any) => presence as UserPresence);
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        debugLog.log('User joined', { key, newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        debugLog.log('User left', { key, leftPresences });
      });

    await presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const userPresence: UserPresence = {
          user_id: user.id,
          session_id: `${user.id}-${Date.now()}`,
          status: 'online',
          current_location: {
            page: window.location.pathname,
          },
          last_seen: new Date().toISOString(),
          user_info: {
            display_name: user.user_metadata?.display_name || user.email || 'مستخدم',
            avatar_url: user.user_metadata?.avatar_url,
            role: user.app_metadata?.role || 'user' // Get actual role from metadata
          }
        };

        await presenceChannel.track(userPresence);
        setCurrentUserPresence(userPresence);
      }
    });

    channelsRef.current.presence = presenceChannel;

    // Update presence every 30 seconds - only if we have a presence
    if (presenceTimerRef.current) {
      presenceTimerRef.current();
    }
    
    const { setInterval: scheduleInterval } = useTimerManager();
    presenceTimerRef.current = scheduleInterval(async () => {
      const currentPresence = channelsRef.current.presence?.presenceState()?.[user.id]?.[0];
      if (currentPresence && channelsRef.current.presence) {
        const updatedPresence = {
          ...currentPresence,
          last_seen: new Date().toISOString(),
          current_location: {
            page: window.location.pathname,
          }
        };
        await channelsRef.current.presence.track(updatedPresence);
        setCurrentUserPresence(updatedPresence);
      }
    }, 30000);
  };

  // Setup activity feed
  const setupActivityChannel = async () => {
    const activityChannel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_events'
        },
        (payload) => {
          const newActivity = payload.new as ActivityEvent;
          setActivities(prev => [newActivity, ...prev.slice(0, 99)]); // Keep last 100
          
          // Show notification for relevant activities
          if (shouldShowActivityNotification(newActivity)) {
            toast({
              title: "نشاط جديد",
              description: getActivityDescription(newActivity),
            });
          }
        }
      );

    await activityChannel.subscribe();
    channelsRef.current.activity = activityChannel;
  };

  // Setup messaging - using existing messages table for compatibility
  const setupMessagingChannel = async () => {
    const messagingChannel = supabase
      .channel('collaboration-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          // Map existing message structure to collaboration message
          const message = payload.new as any;
          const newMessage: CollaborationMessage = {
            id: message.id,
            sender_id: message.user_id,
            sender: {
              display_name: message.user_name || 'مستخدم',
              role: 'user'
            },
            content: message.content,
            message_type: 'text',
            context: {
              space_type: 'global',
              space_id: 'global'
            },
            is_edited: false,
            created_at: message.created_at
          };
          setMessages(prev => [newMessage, ...prev]);
        }
      );

    await messagingChannel.subscribe();
    channelsRef.current.messaging = messagingChannel;
  };

  // Setup notifications - using existing notifications table
  const setupNotificationChannel = async () => {
    if (!user) return;

    const notificationChannel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Map existing notification to realtime notification format
          const notification = payload.new as any;
          const realtimeNotification: RealtimeNotification = {
            id: notification.id,
            recipient_id: notification.user_id,
            sender_id: null,
            type: notification.type || 'system',
            title: notification.title,
            message: notification.message,
            data: notification.metadata || {},
            priority: 'medium',
            channels: ['in_app'],
            is_read: notification.is_read || false,
            created_at: notification.created_at
          };
          setNotifications(prev => [realtimeNotification, ...prev]);
          
          if (realtimeNotification.priority === 'high' || realtimeNotification.priority === 'urgent') {
            toast({
              title: realtimeNotification.title,
              description: realtimeNotification.message,
              variant: realtimeNotification.priority === 'urgent' ? 'destructive' : 'default',
            });
          }
        }
      );

    await notificationChannel.subscribe();
    channelsRef.current.notifications = notificationChannel;
  };

  // Update user presence location
  const updatePresence = useCallback(async (location: UserPresence['current_location']) => {
    if (!currentUserPresence || !channelsRef.current.presence) return;

    const updatedPresence = {
      ...currentUserPresence,
      current_location: location,
      last_seen: new Date().toISOString()
    };

    await channelsRef.current.presence.track(updatedPresence);
    setCurrentUserPresence(updatedPresence);
  }, [currentUserPresence]);

  // Send message - create new message directly
  const sendMessage = useCallback(async (
    content: string, 
    context: CollaborationMessage['context']
  ) => {
    if (!user) return;

    try {
      // For now, just add to local state as the messages table may not have the right structure
      const newMessage: CollaborationMessage = {
        id: `temp-${Date.now()}`,
        sender_id: user.id,
        sender: {
          display_name: user.user_metadata?.display_name || user.email || 'مستخدم',
          role: 'user'
        },
        content,
        message_type: 'text',
        context,
        is_edited: false,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [newMessage, ...prev]);
    } catch (error) {
      debugLog.error('Failed to send message', { error });
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Mark notification as read - simple local state update for now
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      
      // TODO: Implement actual database update when notification table structure is confirmed
      debugLog.log('Marked notification as read', { notificationId });
    } catch (error) {
      debugLog.error('Failed to mark notification as read', { error });
    }
  }, []);

  // Helper functions
  const shouldShowActivityNotification = (activity: ActivityEvent): boolean => {
    // Add logic to determine if user should see this activity
    return activity.privacy_level === 'public' || 
           activity.visibility_scope?.user_ids?.includes(user?.id || '');
  };

  const getActivityDescription = (activity: ActivityEvent): string => {
    switch (activity.event_type) {
      case 'create':
        return `تم إنشاء ${activity.entity_type} جديد`;
      case 'update':
        return `تم تحديث ${activity.entity_type}`;
      case 'comment':
        return `تم إضافة تعليق جديد`;
      default:
        return `نشاط جديد في ${activity.entity_type}`;
    }
  };

  return {
    onlineUsers,
    currentUserPresence,
    updatePresence,
    messages,
    sendMessage,
    spaces: [], // TODO: Implement spaces
    liveDocuments: [], // TODO: Implement live documents
    joinDocument: async () => {}, // TODO: Implement
    leaveDocument: async () => {}, // TODO: Implement
    activities,
    notifications,
    markAsRead,
    isConnected,
    connectionQuality
  };
};