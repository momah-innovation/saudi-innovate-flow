import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
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
  const presenceTimerRef = useRef<NodeJS.Timeout>();

  // Initialize real-time connections
  useEffect(() => {
    if (!user) return;

    const initializeCollaboration = async () => {
      try {
        await setupPresenceChannel();
        await setupActivityChannel();
        await setupMessagingChannel();
        await setupNotificationChannel();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to initialize collaboration:', error);
        setConnectionQuality('poor');
        toast({
          title: "اتصال ضعيف",
          description: "يواجه النظام صعوبة في الاتصال. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    };

    initializeCollaboration();

    return () => {
      // Cleanup all channels
      Object.values(channelsRef.current).forEach(channel => {
        supabase.removeChannel(channel);
      });
      if (presenceTimerRef.current) {
        clearInterval(presenceTimerRef.current);
      }
    };
  }, [user]);

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
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
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
            role: 'user' // This should come from user roles
          }
        };

        await presenceChannel.track(userPresence);
        setCurrentUserPresence(userPresence);
      }
    });

    channelsRef.current.presence = presenceChannel;

    // Update presence every 30 seconds
    presenceTimerRef.current = setInterval(async () => {
      if (currentUserPresence) {
        const updatedPresence = {
          ...currentUserPresence,
          last_seen: new Date().toISOString(),
          current_location: {
            page: window.location.pathname,
          }
        };
        await presenceChannel.track(updatedPresence);
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

  // Send message - using existing messages table
  const sendMessage = useCallback(async (
    content: string, 
    context: CollaborationMessage['context']
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          content,
          user_name: user.user_metadata?.display_name || user.email || 'مستخدم'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  // Mark notification as read - using existing notifications table
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
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