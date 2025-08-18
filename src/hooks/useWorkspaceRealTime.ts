import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface UserPresence {
  userId: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  metadata?: Record<string, any>;
}

export interface WorkspaceMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'mention';
  metadata?: Record<string, any>;
}

export interface WorkspaceActivity {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

interface UseWorkspaceRealTimeOptions {
  workspaceId: string;
  maxMessages?: number;
  maxActivities?: number;
}

interface UseWorkspaceRealTimeReturn {
  // Presence
  onlineUsers: UserPresence[];
  currentUserStatus: UserPresence['status'];
  updatePresence: (status: UserPresence['status'], metadata?: Record<string, any>) => Promise<void>;
  
  // Messages
  messages: WorkspaceMessage[];
  sendMessage: (content: string, type?: WorkspaceMessage['type'], metadata?: Record<string, any>) => Promise<void>;
  
  // Activities
  activities: WorkspaceActivity[];
  addActivity: (type: string, description: string, entityType?: string, entityId?: string) => Promise<void>;
  
  // Connection state
  isConnected: boolean;
  reconnect: () => Promise<void>;
  
  // Online members for backward compatibility
  onlineMembers: Array<{
    id: string;
    user_id: string;
    name: string;
    status: string;
    last_active?: string;
  }>;
}

export function useWorkspaceRealTime(
  options: UseWorkspaceRealTimeOptions
): UseWorkspaceRealTimeReturn {
  const { user } = useAuth();
  const { workspaceId, maxMessages = 100, maxActivities = 50 } = options;

  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<UserPresence['status']>('offline');
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);

  // Initialize presence channel
  const initializePresenceChannel = useCallback(async () => {
    if (!user || !workspaceId) return;

    const channelId = `workspace-presence-${workspaceId}`;
    
    // Remove existing channel
    if (presenceChannelRef.current) {
      await supabase.removeChannel(presenceChannelRef.current);
    }

    const channel = supabase
      .channel(channelId, {
        config: {
          presence: {
            key: user.id
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: UserPresence[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          presences.forEach((presence: any) => {
            users.push({
              userId: key,
              name: presence.user_metadata?.name || 'Unknown User',
              status: presence.user_metadata?.status || 'online',
              lastSeen: new Date(presence.user_metadata?.lastSeen || Date.now()),
              metadata: presence.user_metadata?.metadata || {}
            });
          });
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const newUsers: UserPresence[] = newPresences.map((p: any) => ({
          userId: p.presence_ref || '',
          name: p.user_metadata?.name || 'Unknown User',
          status: p.user_metadata?.status || 'online',
          lastSeen: new Date(),
          metadata: p.user_metadata?.metadata || {}
        }));
        
        setOnlineUsers(prev => [...prev, ...newUsers]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftUserIds = leftPresences.map((p: any) => p.presence_ref);
        setOnlineUsers(prev => 
          prev.filter(user => !leftUserIds.includes(user.userId))
        );
      });

    await channel.subscribe();
    presenceChannelRef.current = channel;
    setIsConnected(true);
  }, [user, workspaceId]);

  // Initialize activity and message channels
  const initializeDataChannels = useCallback(async () => {
    if (!user || !workspaceId) return;

    const activityChannelId = `workspace-activity-${workspaceId}`;
    const messageChannelId = `workspace-messages-${workspaceId}`;

    // Activity channel
    const activityChannel = supabase
      .channel(activityChannelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workspace_activity_feed',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          const newActivity: WorkspaceActivity = {
            id: payload.new.id,
            type: payload.new.activity_type,
            description: payload.new.description,
            userId: payload.new.user_id,
            userName: 'Unknown User', // Would be joined from profiles
            timestamp: new Date(payload.new.created_at),
            entityType: payload.new.entity_type,
            entityId: payload.new.entity_id,
            metadata: payload.new.metadata as Record<string, any>
          };

          setActivities(prev => [newActivity, ...prev.slice(0, maxActivities - 1)]);
        }
      )
      .on('broadcast', { event: 'user-activity' }, ({ payload }) => {
        setActivities(prev => [payload, ...prev.slice(0, maxActivities - 1)]);
      });

    // Message channel
    const messageChannel = supabase
      .channel(messageChannelId)
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        const newMessage: WorkspaceMessage = {
          id: payload.id || crypto.randomUUID(),
          content: payload.content,
          userId: payload.userId,
          userName: payload.userName,
          timestamp: new Date(payload.timestamp),
          type: payload.type || 'text',
          metadata: payload.metadata || {}
        };

        setMessages(prev => [newMessage, ...prev.slice(0, maxMessages - 1)]);
      });

    await Promise.all([
      activityChannel.subscribe(),
      messageChannel.subscribe()
    ]);

    channelsRef.current.set(activityChannelId, activityChannel);
    channelsRef.current.set(messageChannelId, messageChannel);
  }, [user, workspaceId, maxMessages, maxActivities]);

  // Update user presence
  const updatePresence = useCallback(async (
    status: UserPresence['status'], 
    metadata?: Record<string, any>
  ) => {
    if (!presenceChannelRef.current || !user) return;

    setCurrentUserStatus(status);

    await presenceChannelRef.current.track({
      user_metadata: {
        name: user.email || 'Unknown User',
        status,
        lastSeen: new Date().toISOString(),
        metadata: metadata || {}
      }
    });
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    type: WorkspaceMessage['type'] = 'text',
    metadata?: Record<string, any>
  ) => {
    if (!user || !workspaceId) return;

    const messageChannelId = `workspace-messages-${workspaceId}`;
    const channel = channelsRef.current.get(messageChannelId);

    if (!channel) return;

    const message = {
      id: crypto.randomUUID(),
      content,
      userId: user.id,
      userName: user.email || 'Unknown User',
      timestamp: new Date().toISOString(),
      type,
      metadata: metadata || {}
    };

    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: message
    });
  }, [user, workspaceId]);

  // Add activity
  const addActivity = useCallback(async (
    type: string,
    description: string,
    entityType?: string,
    entityId?: string
  ) => {
    if (!user || !workspaceId) return;

    try {
      // Insert into database
      await supabase
        .from('workspace_activity_feed')
        .insert({
          workspace_id: workspaceId,
          actor_id: user.id,
          action_type: type,
          activity_title: description,
          entity_type: entityType,
          entity_id: entityId,
          metadata: {}
        });

      // Also broadcast for immediate update
      const activityChannelId = `workspace-activity-${workspaceId}`;
      const channel = channelsRef.current.get(activityChannelId);

      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'user-activity',
          payload: {
            id: crypto.randomUUID(),
            type,
            description,
            userId: user.id,
            userName: user.email || 'Unknown User',
            timestamp: new Date(),
            entityType,
            entityId,
            metadata: {}
          }
        });
      }
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  }, [user, workspaceId]);

  // Reconnect functionality
  const reconnect = useCallback(async () => {
    setIsConnected(false);
    
    // Clean up existing channels
    channelsRef.current.forEach(async (channel) => {
      await supabase.removeChannel(channel);
    });
    channelsRef.current.clear();

    if (presenceChannelRef.current) {
      await supabase.removeChannel(presenceChannelRef.current);
      presenceChannelRef.current = null;
    }

    // Reinitialize
    await initializePresenceChannel();
    await initializeDataChannels();
  }, [initializePresenceChannel, initializeDataChannels]);

  // Initialize channels
  useEffect(() => {
    if (workspaceId && user) {
      initializePresenceChannel();
      initializeDataChannels();
    }

    return () => {
      // Cleanup on unmount
      channelsRef.current.forEach(async (channel) => {
        await supabase.removeChannel(channel);
      });
      channelsRef.current.clear();

      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
      }
    };
  }, [workspaceId, user, initializePresenceChannel, initializeDataChannels]);

  // Update presence when status changes
  useEffect(() => {
    if (user && workspaceId && isConnected) {
      updatePresence('online');
    }
  }, [user, workspaceId, isConnected, updatePresence]);

  // Convert online users to legacy format for backward compatibility
  const onlineMembers = onlineUsers.map(user => ({
    id: user.userId,
    user_id: user.userId,
    name: user.name,
    status: user.status,
    last_active: user.lastSeen.toISOString()
  }));

  return {
    onlineUsers,
    currentUserStatus,
    updatePresence,
    messages,
    sendMessage,
    activities,
    addActivity,
    isConnected,
    reconnect,
    onlineMembers
  };
}