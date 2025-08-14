/**
 * Unified Real-time Collaboration Service
 * 
 * Consolidates all real-time functionality including presence tracking,
 * live collaboration, and WebSocket management into a single service.
 */

import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, createComponentLogger } from './debugLogger';
import timerManager from './timerManager';

const logger = createComponentLogger('RealtimeService');

interface PresenceData {
  user_id: string;
  username?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'offline';
  last_seen: string;
  current_page?: string;
  metadata?: Record<string, any>;
}

interface CollaborationEvent {
  type: 'cursor_move' | 'selection_change' | 'content_change' | 'user_join' | 'user_leave' | 'broadcast';
  user_id: string;
  data: any;
  timestamp: string;
}

interface RealtimeSubscription {
  id: string;
  channel: any;
  cleanup: () => void;
}

interface RealtimeServiceConfig {
  presenceHeartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enableAutomaticReconnect?: boolean;
}

class RealtimeCollaborationService {
  private static instance: RealtimeCollaborationService;
  private subscriptions = new Map<string, RealtimeSubscription>();
  private presenceData: PresenceData | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private config: RealtimeServiceConfig;

  private constructor(config: RealtimeServiceConfig = {}) {
    this.config = {
      presenceHeartbeatInterval: 30000, // 30 seconds
      reconnectInterval: 5000, // 5 seconds
      maxReconnectAttempts: 5,
      enableAutomaticReconnect: true,
      ...config
    };
  }

  public static getInstance(config?: RealtimeServiceConfig): RealtimeCollaborationService {
    if (!RealtimeCollaborationService.instance) {
      RealtimeCollaborationService.instance = new RealtimeCollaborationService(config);
    }
    return RealtimeCollaborationService.instance;
  }

  /**
   * Initialize presence tracking for a user
   */
  async initializePresence(
    userId: string,
    userProfile: { username?: string; avatar_url?: string } = {},
    currentPage?: string
  ): Promise<void> {
    try {
      this.presenceData = {
        user_id: userId,
        username: userProfile.username,
        avatar_url: userProfile.avatar_url,
        status: 'online',
        last_seen: new Date().toISOString(),
        current_page: currentPage
      };

      // Start heartbeat timer
      this.startPresenceHeartbeat();

      logger.debug('Presence initialized', { userId, currentPage });
    } catch (error) {
      logger.error('Failed to initialize presence', error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time presence for a specific room/channel
   */
  subscribeToPresence(
    roomId: string,
    onPresenceUpdate: (presences: PresenceData[]) => void,
    onUserJoin?: (user: PresenceData) => void,
    onUserLeave?: (user: PresenceData) => void
  ): () => void {
    const subscriptionId = `presence_${roomId}`;
    
    // Clean up existing subscription
    this.unsubscribe(subscriptionId);

    try {
      const channel = supabase.channel(`presence_${roomId}`, {
        config: {
          presence: {
            key: this.presenceData?.user_id || 'anonymous'
          }
        }
      });

      // Handle presence sync (all users)
      channel.on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const presences: PresenceData[] = [];
        
        // Extract presence data properly
        Object.values(presenceState).forEach((presenceArray: any) => {
          if (Array.isArray(presenceArray)) {
            presenceArray.forEach((presence: any) => {
              if (presence && presence.user_id) {
                presences.push(presence as PresenceData);
              }
            });
          }
        });
        
        onPresenceUpdate(presences);
        logger.debug('Presence sync', { roomId, userCount: presences.length });
      });

      // Handle user join
      channel.on('presence', { event: 'join' }, ({ newPresences }) => {
        if (Array.isArray(newPresences)) {
          newPresences.forEach((presence: any) => {
            if (presence && presence.user_id && onUserJoin) {
              onUserJoin(presence as PresenceData);
              logger.debug('User joined', { roomId, userId: presence.user_id });
            }
          });
        }
      });

      // Handle user leave
      channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
        if (Array.isArray(leftPresences)) {
          leftPresences.forEach((presence: any) => {
            if (presence && presence.user_id && onUserLeave) {
              onUserLeave(presence as PresenceData);
              logger.debug('User left', { roomId, userId: presence.user_id });
            }
          });
        }
      });

      // Subscribe and track presence
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && this.presenceData) {
          await channel.track(this.presenceData);
        }
      });

      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        channel,
        cleanup: () => {
          channel.unsubscribe();
          supabase.removeChannel(channel);
        }
      });

      logger.debug('Subscribed to presence', { roomId, subscriptionId });

      // Return cleanup function
      return () => this.unsubscribe(subscriptionId);

    } catch (error) {
      logger.error('Failed to subscribe to presence', error as Error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time collaboration events
   */
  subscribeToCollaboration(
    roomId: string,
    onCollaborationEvent: (event: CollaborationEvent) => void
  ): () => void {
    const subscriptionId = `collaboration_${roomId}`;
    
    // Clean up existing subscription
    this.unsubscribe(subscriptionId);

    try {
      const channel = supabase.channel(`collaboration_${roomId}`);

      // Handle collaboration events
      channel.on('broadcast', { event: 'collaboration' }, (payload) => {
        const event: CollaborationEvent = {
          type: payload.type,
          user_id: payload.user_id,
          data: payload.data,
          timestamp: payload.timestamp || new Date().toISOString()
        };
        
        onCollaborationEvent(event);
        logger.debug('Collaboration event received', { roomId, type: event.type });
      });

      // Subscribe to channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          logger.debug('Collaboration channel connected', { roomId });
        }
      });

      // Store subscription
      this.subscriptions.set(subscriptionId, {
        id: subscriptionId,
        channel,
        cleanup: () => {
          channel.unsubscribe();
          supabase.removeChannel(channel);
        }
      });

      return () => this.unsubscribe(subscriptionId);

    } catch (error) {
      logger.error('Failed to subscribe to collaboration', error as Error);
      throw error;
    }
  }

  /**
   * Broadcast collaboration event to room
   */
  async broadcastCollaborationEvent(
    roomId: string,
    event: Omit<CollaborationEvent, 'timestamp'>
  ): Promise<void> {
    try {
      const subscription = this.subscriptions.get(`collaboration_${roomId}`);
      if (!subscription) {
        throw new Error(`No collaboration subscription found for room: ${roomId}`);
      }

      await subscription.channel.send({
        type: 'broadcast',
        event: 'collaboration',
        payload: {
          ...event,
          timestamp: new Date().toISOString()
        }
      });

      logger.debug('Collaboration event sent', { roomId, type: event.type });
    } catch (error) {
      logger.error('Failed to broadcast collaboration event', error as Error);
      throw error;
    }
  }

  /**
   * Update user presence status
   */
  async updatePresenceStatus(
    status: 'online' | 'away' | 'offline',
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.presenceData) return;

    try {
      this.presenceData = {
        ...this.presenceData,
        status,
        last_seen: new Date().toISOString(),
        metadata: { ...this.presenceData.metadata, ...metadata }
      };

      // Update all active presence subscriptions
      for (const subscription of this.subscriptions.values()) {
        if (subscription.id.startsWith('presence_')) {
          await subscription.channel.track(this.presenceData);
        }
      }

      logger.debug('Presence status updated', { status, metadata });
    } catch (error) {
      logger.error('Failed to update presence status', error as Error);
    }
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.cleanup();
      this.subscriptions.delete(subscriptionId);
      logger.debug('Unsubscribed', { subscriptionId });
    }
  }

  /**
   * Cleanup all subscriptions and timers
   */
  cleanup(): void {
    // Clear all subscriptions
    for (const subscription of this.subscriptions.values()) {
      subscription.cleanup();
    }
    this.subscriptions.clear();

    // Clear timers
    timerManager.clearAll();

    // Mark user as offline
    if (this.presenceData) {
      this.updatePresenceStatus('offline');
    }

    this.isConnected = false;
    logger.debug('Realtime service cleaned up');
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    isConnected: boolean;
    activeSubscriptions: number;
    reconnectAttempts: number;
  } {
    return {
      isConnected: this.isConnected,
      activeSubscriptions: this.subscriptions.size,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Private methods
   */
  private startPresenceHeartbeat(): void {
    timerManager.setInterval(
      'presence_heartbeat',
      () => {
        if (this.presenceData) {
          this.presenceData.last_seen = new Date().toISOString();
        }
      },
      this.config.presenceHeartbeatInterval!
    );
  }
}

/**
 * React hook for real-time presence
 */
export const useRealtimePresence = (
  roomId: string,
  userId?: string,
  userProfile?: { username?: string; avatar_url?: string }
) => {
  const [presences, setPresences] = React.useState<PresenceData[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const serviceRef = React.useRef<RealtimeCollaborationService>();

  React.useEffect(() => {
    if (!userId) return;

    serviceRef.current = RealtimeCollaborationService.getInstance();
    
    // Initialize presence
    serviceRef.current.initializePresence(userId, userProfile)
      .then(() => setIsConnected(true))
      .catch((error) => logger.error('Failed to initialize presence', error));

    // Subscribe to presence updates
    const cleanup = serviceRef.current.subscribeToPresence(
      roomId,
      setPresences,
      (user) => logger.debug('User joined', { userId: user.user_id }),
      (user) => logger.debug('User left', { userId: user.user_id })
    );

    return () => {
      cleanup();
      serviceRef.current?.cleanup();
      setIsConnected(false);
    };
  }, [roomId, userId]);

  const updateStatus = React.useCallback((status: 'online' | 'away' | 'offline') => {
    serviceRef.current?.updatePresenceStatus(status);
  }, []);

  return {
    presences,
    isConnected,
    updateStatus,
    connectionStatus: serviceRef.current?.getConnectionStatus()
  };
};

/**
 * React hook for real-time collaboration
 */
export const useRealTimeCollaboration = (
  roomId: string,
  onCollaborationEvent?: (event: CollaborationEvent) => void
) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const serviceRef = React.useRef<RealtimeCollaborationService>();

  React.useEffect(() => {
    serviceRef.current = RealtimeCollaborationService.getInstance();
    
    const cleanup = serviceRef.current.subscribeToCollaboration(
      roomId,
      (event) => {
        onCollaborationEvent?.(event);
        setIsConnected(true);
      }
    );

    return () => {
      cleanup();
      setIsConnected(false);
    };
  }, [roomId]);

  const broadcastEvent = React.useCallback((event: Omit<CollaborationEvent, 'timestamp'>) => {
    return serviceRef.current?.broadcastCollaborationEvent(roomId, event);
  }, [roomId]);

  return {
    isConnected,
    broadcastEvent,
    connectionStatus: serviceRef.current?.getConnectionStatus()
  };
};

// Export singleton instance
export const realtimeService = RealtimeCollaborationService.getInstance();
export default RealtimeCollaborationService;