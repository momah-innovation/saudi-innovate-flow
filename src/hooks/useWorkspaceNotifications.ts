import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceType } from '@/types/workspace';

export interface WorkspaceNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'user' | 'workspace' | 'collaboration';
  title: string;
  message: string;
  workspaceType: WorkspaceType;
  workspaceId: string;
  senderId: string;
  senderName?: string;
  entityType: string;
  entityId?: string;
  actionUrl?: string;
  metadata: Record<string, any>;
  isRead: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
}

interface UseWorkspaceNotificationsOptions {
  workspaceType: WorkspaceType;
  workspaceId: string;
  realTimeUpdates?: boolean;
  autoMarkAsRead?: boolean;
  maxNotifications?: number;
}

interface UseWorkspaceNotificationsReturn {
  notifications: WorkspaceNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  
  // Real-time state
  isConnected: boolean;
  lastUpdate: Date | null;
}

export function useWorkspaceNotifications(
  options: UseWorkspaceNotificationsOptions
): UseWorkspaceNotificationsReturn {
  const { user } = useAuth();
  const {
    workspaceType,
    workspaceId,
    realTimeUpdates = true,
    autoMarkAsRead = false,
    maxNotifications = 100
  } = options;

  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch notifications from activity events
  const fetchNotifications = useCallback(async () => {
    if (!user || !workspaceId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch recent activity events related to the user
      const { data, error: queryError } = await supabase
        .from('activity_events')
        .select(`
          id,
          event_type,
          entity_type,
          entity_id,
          user_id,
          created_at,
          metadata
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (queryError) throw queryError;

      const formattedNotifications: WorkspaceNotification[] = data?.map(event => ({
        id: event.id,
        type: 'info' as const,
        category: 'system' as const,
        title: event.event_type.replace('_', ' '),
        message: `${event.event_type} activity in workspace`,
        workspaceType,
        workspaceId,
        senderId: event.user_id,
        senderName: undefined,
        entityType: event.entity_type,
        entityId: event.entity_id,
        actionUrl: undefined,
        metadata: typeof event.metadata === 'object' && event.metadata !== null 
          ? event.metadata as Record<string, any>
          : {},
        isRead: false,
        isArchived: false,
        priority: 'medium' as const,
        expiresAt: undefined,
        createdAt: event.created_at,
        readAt: undefined
      })) || [];

      setNotifications(formattedNotifications.slice(0, maxNotifications));
      setLastUpdate(new Date());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceId, workspaceType, maxNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt || now
      }))
    );
  }, []);

  // Archive notification
  const archiveNotification = useCallback(async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId
          ? { ...notification, isArchived: true }
          : notification
      )
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    setNotifications([]);
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications();
  }, [fetchNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  // Real-time subscriptions
  useEffect(() => {
    if (!realTimeUpdates || !user || !workspaceId) return;

    const channel = supabase
      .channel(`workspace-notifications-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_events',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [realTimeUpdates, user, workspaceId, fetchNotifications]);

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto mark as read when viewing
  useEffect(() => {
    if (autoMarkAsRead && notifications.length > 0) {
      const timeout = setTimeout(() => {
        markAllAsRead();
      }, 3000); // Mark as read after 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [notifications.length, autoMarkAsRead, markAllAsRead]);

  return {
    notifications: notifications.filter(n => !n.isArchived),
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    clearAll,
    refreshNotifications,
    isConnected,
    lastUpdate
  };
}