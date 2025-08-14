import { useState, useEffect, useCallback } from 'react';
import { debugLog } from '@/utils/debugLogger';
import { supabase } from '@/integrations/supabase/client';
import type { 
  UserPresence, 
  CollaborationMessage, 
  CollaborationSpace, 
  ActivityEvent, 
  RealtimeNotification,
  UseCollaborationReturn 
} from '@/types/collaboration';

export const useRealTimeCollaboration = (): UseCollaborationReturn => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentUserPresence, setCurrentUserPresence] = useState<UserPresence | null>(null);
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [spaces, setSpaces] = useState<CollaborationSpace[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'slow' | 'poor'>('good');
  const [liveDocuments, setLiveDocuments] = useState([]);

  // Initialize real-time connection
  useEffect(() => {
    const initializeCollaboration = async () => {
      try {
        // Set up presence tracking
        const channel = supabase.channel('collaboration-presence');
        
        channel
          .on('presence', { event: 'sync' }, () => {
            const presenceState = channel.presenceState();
            const users = Object.values(presenceState).flat() as UserPresence[];
            setOnlineUsers(users);
            setIsConnected(true);
          })
          .on('presence', { event: 'join' }, ({ newPresences }) => {
            setOnlineUsers(prev => [...prev, ...newPresences as UserPresence[]]);
          })
          .on('presence', { event: 'leave' }, ({ leftPresences }) => {
            const leftUserIds = (leftPresences as UserPresence[]).map(p => p.user_id);
            setOnlineUsers(prev => prev.filter(user => !leftUserIds.includes(user.user_id)));
          })
          .subscribe();

        // Simulate initial data
        const mockNotifications: RealtimeNotification[] = [
          {
            id: 'notif_1',
            recipient_id: 'user_1',
            type: 'mention',
            title: 'You were mentioned',
            message: 'Sarah mentioned you in the project discussion',
            data: { entity_type: 'comment', entity_id: 'comment_123' },
            priority: 'high',
            channels: ['in_app'],
            is_read: false,
            created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
          },
          {
            id: 'notif_2',
            recipient_id: 'user_1',
            type: 'collaboration_invite',
            title: 'Collaboration Invite',
            message: 'You have been invited to collaborate on a new project',
            data: { entity_type: 'project', entity_id: 'project_456' },
            priority: 'medium',
            channels: ['in_app', 'email'],
            is_read: false,
            created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
          }
        ];

        setNotifications(mockNotifications);
        
        // Simulate some online users
        const mockUsers: UserPresence[] = [
          {
            user_id: 'user_1',
            session_id: 'session_1',
            status: 'online',
            current_location: { page: 'dashboard' },
            last_seen: new Date().toISOString(),
            user_info: { display_name: 'John Doe', role: 'user', avatar_url: '/placeholder.svg' }
          },
          {
            user_id: 'user_2',
            session_id: 'session_2',
            status: 'online',
            current_location: { page: 'ideas' },
            last_seen: new Date().toISOString(),
            user_info: { display_name: 'Sarah Wilson', role: 'expert', avatar_url: '/placeholder.svg' }
          }
        ];
        
        setOnlineUsers(mockUsers);
        setCurrentUserPresence(mockUsers[0]);

      } catch (error) {
        debugLog.error('Failed to initialize collaboration:', { error: error.message });
        setIsConnected(false);
      }
    };

    initializeCollaboration();
  }, []);

  const updatePresence = useCallback((location: UserPresence['current_location']) => {
    if (currentUserPresence) {
      const updatedPresence = {
        ...currentUserPresence,
        current_location: location,
        last_seen: new Date().toISOString()
      };
      setCurrentUserPresence(updatedPresence);
    }
  }, [currentUserPresence]);

  const sendMessage = useCallback((content: string, context: CollaborationMessage['context']) => {
    const newMessage: CollaborationMessage = {
      id: `msg_${Date.now()}`,
      sender_id: currentUserPresence?.user_id || 'unknown',
      sender: currentUserPresence?.user_info || { display_name: 'Unknown', role: 'user' },
      content,
      message_type: 'text',
      context,
      is_edited: false,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, [currentUserPresence]);

  const joinDocument = useCallback((documentId: string) => {
    // Implementation for joining live document collaboration
    debugLog.debug('Joining document', { documentId });
  }, []);

  const leaveDocument = useCallback((documentId: string) => {
    // Implementation for leaving live document collaboration
    debugLog.debug('Leaving document', { documentId });
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
  }, []);

  return {
    onlineUsers,
    currentUserPresence,
    updatePresence,
    messages,
    sendMessage,
    spaces,
    liveDocuments,
    joinDocument,
    leaveDocument,
    activities,
    notifications,
    markAsRead,
    isConnected,
    connectionQuality
  };
};

export default useRealTimeCollaboration;