import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceType } from '@/types/workspace';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UserPresence {
  userId: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  location?: string;
  lastSeen: string;
  metadata?: Record<string, any>;
}

interface RealTimeMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: 'text' | 'system' | 'file' | 'notification';
  timestamp: string;
  channelId: string;
  metadata?: Record<string, any>;
}

interface RealTimeUpdate {
  type: 'insert' | 'update' | 'delete';
  table: string;
  record: any;
  old_record?: any;
  timestamp: string;
}

interface UseWorkspaceRealTimeOptions {
  workspaceType: WorkspaceType;
  workspaceId: string;
  enablePresence?: boolean;
  enableMessages?: boolean;
  enableUpdates?: boolean;
  customChannels?: string[];
  presenceUpdateInterval?: number;
}

interface UseWorkspaceRealTimeReturn {
  // Connection state
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  
  // Presence
  onlineUsers: UserPresence[];
  myPresence: UserPresence | null;
  updatePresence: (status: UserPresence['status'], metadata?: Record<string, any>) => Promise<void>;
  
  // Messaging
  messages: RealTimeMessage[];
  sendMessage: (content: string, channelId?: string, metadata?: Record<string, any>) => Promise<void>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  
  // Data updates
  updates: RealTimeUpdate[];
  subscribeToTable: (tableName: string, filters?: Record<string, any>) => void;
  unsubscribeFromTable: (tableName: string) => void;
  
  // Channel management
  activeChannels: string[];
  createChannel: (channelName: string, config?: Record<string, any>) => Promise<void>;
  
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  
  // Utilities
  clearMessages: () => void;
  clearUpdates: () => void;
  getChannelInfo: (channelId: string) => any;
}

export function useWorkspaceRealTime(
  options: UseWorkspaceRealTimeOptions
): UseWorkspaceRealTimeReturn {
  const { user } = useAuth();
  const {
    workspaceType,
    workspaceId,
    enablePresence = true,
    enableMessages = true,
    enableUpdates = true,
    customChannels = [],
    presenceUpdateInterval = 30000 // 30 seconds
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [myPresence, setMyPresence] = useState<UserPresence | null>(null);
  const [messages, setMessages] = useState<RealTimeMessage[]>([]);
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [activeChannels, setActiveChannels] = useState<string[]>([]);

  // Refs
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const presenceIntervalRef = useRef<NodeJS.Timeout>();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // Get channel name for workspace
  const getWorkspaceChannelName = useCallback((suffix?: string) => {
    const baseName = `workspace-${workspaceType}-${workspaceId}`;
    return suffix ? `${baseName}-${suffix}` : baseName;
  }, [workspaceType, workspaceId]);

  // Update presence
  const updatePresence = useCallback(async (
    status: UserPresence['status'], 
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    const presenceData: UserPresence = {
      userId: user.id,
      name: user.email || 'Unknown User',
      status,
      location: window.location.pathname,
      lastSeen: new Date().toISOString(),
      metadata
    };

    try {
      // Update presence in all relevant channels
      for (const [channelName, channel] of channelsRef.current) {
        if (channelName.includes('presence')) {
          await channel.track(presenceData);
        }
      }

      setMyPresence(presenceData);
    } catch (err) {
      console.error('Failed to update presence:', err);
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (
    content: string, 
    channelId?: string, 
    metadata?: Record<string, any>
  ) => {
    if (!user) throw new Error('User not authenticated');

    const message: RealTimeMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: user.id,
      senderName: user.email || 'Unknown User',
      content,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      channelId: channelId || getWorkspaceChannelName('chat'),
      metadata
    };

    try {
      const targetChannelName = channelId || getWorkspaceChannelName('chat');
      const channel = channelsRef.current.get(targetChannelName);
      
      if (channel) {
        await channel.send({
          type: 'broadcast',
          event: 'message',
          payload: message
        });
      }

      // Also store in database for persistence
      await supabase.from('collaboration_messages').insert({
        collaboration_id: workspaceId,
        sender_id: user.id,
        content,
        message_type: 'text',
        metadata
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [user, workspaceId, getWorkspaceChannelName]);

  // Join channel
  const joinChannel = useCallback(async (channelId: string) => {
    if (channelsRef.current.has(channelId)) return;

    try {
      const channel = supabase.channel(channelId);
      
      // Set up event handlers
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const users: UserPresence[] = [];
          
          Object.values(state).forEach((presences: any) => {
            presences.forEach((presence: any) => {
              users.push(presence);
            });
          });
          
          setOnlineUsers(users);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          setOnlineUsers(prev => [...prev, ...newPresences]);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          setOnlineUsers(prev => 
            prev.filter(user => 
              !leftPresences.some((left: any) => left.userId === user.userId)
            )
          );
        })
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          setMessages(prev => [payload, ...prev.slice(0, 99)]); // Keep last 100 messages
        });

      await channel.subscribe();
      channelsRef.current.set(channelId, channel);
      setActiveChannels(prev => [...prev, channelId]);

    } catch (err) {
      console.error('Failed to join channel:', err);
      setError(`Failed to join channel: ${channelId}`);
    }
  }, []);

  // Leave channel
  const leaveChannel = useCallback(async (channelId: string) => {
    const channel = channelsRef.current.get(channelId);
    if (channel) {
      await supabase.removeChannel(channel);
      channelsRef.current.delete(channelId);
      setActiveChannels(prev => prev.filter(id => id !== channelId));
    }
  }, []);

  // Subscribe to table updates
  const subscribeToTable = useCallback((tableName: string, filters?: Record<string, any>) => {
    const channelName = `table-updates-${tableName}`;
    
    if (channelsRef.current.has(channelName)) return;

    try {
      const channel = supabase.channel(channelName);
      
      // Build filter string
      let filterString = `workspace_id=eq.${workspaceId}`;
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          filterString += `,${key}=eq.${value}`;
        });
      }

      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: tableName,
            filter: filterString
          },
          (payload) => {
            const update: RealTimeUpdate = {
              type: payload.eventType as any,
              table: tableName,
              record: payload.new,
              old_record: payload.old,
              timestamp: new Date().toISOString()
            };
            
            setUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
          }
        )
        .subscribe();

      channelsRef.current.set(channelName, channel);
    } catch (err) {
      console.error('Failed to subscribe to table:', err);
    }
  }, [workspaceId]);

  // Unsubscribe from table
  const unsubscribeFromTable = useCallback(async (tableName: string) => {
    const channelName = `table-updates-${tableName}`;
    await leaveChannel(channelName);
  }, [leaveChannel]);

  // Create custom channel
  const createChannel = useCallback(async (
    channelName: string, 
    config?: Record<string, any>
  ) => {
    const fullChannelName = getWorkspaceChannelName(channelName);
    await joinChannel(fullChannelName);
  }, [getWorkspaceChannelName, joinChannel]);

  // Connect to workspace channels
  const connect = useCallback(async () => {
    if (!user) return;

    setConnectionStatus('connecting');
    setError(null);

    try {
      // Join main workspace channels
      const channels = [
        getWorkspaceChannelName('presence'),
        getWorkspaceChannelName('chat'),
        ...customChannels.map(c => getWorkspaceChannelName(c))
      ];

      await Promise.all(channels.map(channelName => joinChannel(channelName)));

      // Set up presence updates
      if (enablePresence) {
        await updatePresence('online');
        
        presenceIntervalRef.current = setInterval(() => {
          updatePresence('online');
        }, presenceUpdateInterval);
      }

      // Subscribe to workspace tables
      if (enableUpdates) {
        subscribeToTable('workspace_members');
        subscribeToTable('workspace_activities');
        subscribeToTable('workspace_projects');
      }

      setIsConnected(true);
      setConnectionStatus('connected');

    } catch (err) {
      console.error('Failed to connect to real-time:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setConnectionStatus('error');
    }
  }, [
    user, 
    getWorkspaceChannelName, 
    customChannels, 
    joinChannel, 
    enablePresence, 
    enableUpdates,
    updatePresence,
    subscribeToTable,
    presenceUpdateInterval
  ]);

  // Disconnect from all channels
  const disconnect = useCallback(() => {
    // Clear intervals
    if (presenceIntervalRef.current) {
      clearInterval(presenceIntervalRef.current);
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Update presence to offline
    if (myPresence) {
      updatePresence('offline');
    }

    // Remove all channels
    channelsRef.current.forEach(async (channel, channelName) => {
      await supabase.removeChannel(channel);
    });
    
    channelsRef.current.clear();
    setActiveChannels([]);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setOnlineUsers([]);
    setMyPresence(null);
  }, [myPresence, updatePresence]);

  // Reconnect
  const reconnect = useCallback(async () => {
    disconnect();
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // Utility functions
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  const getChannelInfo = useCallback((channelId: string) => {
    const channel = channelsRef.current.get(channelId);
    return channel ? {
      name: channelId,
      state: channel.state,
      presenceState: channel.presenceState()
    } : null;
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updatePresence]);

  return {
    isConnected,
    connectionStatus,
    error,
    onlineUsers,
    myPresence,
    updatePresence,
    messages,
    sendMessage,
    joinChannel,
    leaveChannel,
    updates,
    subscribeToTable,
    unsubscribeFromTable,
    activeChannels,
    createChannel,
    connect,
    disconnect,
    reconnect,
    clearMessages,
    clearUpdates,
    getChannelInfo
  };
}