import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspaceNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'team' | 'project' | 'task' | 'meeting' | 'mention' | 'invitation';
  title: string;
  message: string;
  workspaceType: WorkspaceType;
  workspaceId: string;
  senderId?: string;
  senderName?: string;
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  isPinned: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: Record<string, boolean>;
  workspaceSpecific: Record<string, {
    email: boolean;
    push: boolean;
    inApp: boolean;
  }>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

interface UseWorkspaceNotificationsOptions {
  workspaceType: WorkspaceType;
  workspaceId: string;
  realTimeUpdates?: boolean;
  categories?: string[];
}

interface UseWorkspaceNotificationsReturn {
  notifications: WorkspaceNotification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  
  // Notification management
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  pinNotification: (notificationId: string, pinned: boolean) => Promise<void>;
  
  // Sending notifications
  sendNotification: (notification: Omit<WorkspaceNotification, 'id' | 'createdAt' | 'isRead'>) => Promise<void>;
  sendBulkNotification: (userIds: string[], notification: Partial<WorkspaceNotification>) => Promise<void>;
  
  // Preferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  
  // Real-time
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  
  // Utilities
  refreshNotifications: () => Promise<void>;
  getNotificationsByCategory: (category: string) => WorkspaceNotification[];
  clearExpiredNotifications: () => Promise<void>;
}

export function useWorkspaceNotifications(
  options: UseWorkspaceNotificationsOptions
): UseWorkspaceNotificationsReturn {
  const { user } = useAuth();
  const {
    workspaceType,
    workspaceId,
    realTimeUpdates = true,
    categories = []
  } = options;

  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications - using existing activity_events table as fallback
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('activity_events')
        .select(`
          id,
          event_type,
          entity_type,
          entity_id,
          created_at,
          user_id,
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
        actionLabel: undefined,
        isRead: false,
        isPinned: false,
        priority: 'medium' as const,
        createdAt: event.created_at,
        readAt: undefined,
        expiresAt: undefined,
        metadata: event.metadata
      })) || [];

      setNotifications(formattedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceId, workspaceType]);

  // Load user preferences - mock implementation
  const loadPreferences = useCallback(async () => {
    if (!user) return;
    
    try {
      // Mock preferences since notification_preferences table doesn't exist
      const defaultPreferences: NotificationPreferences = {
        email: true,
        push: true,
        inApp: true,
        categories: {
          system: true,
          team: true,
          project: true,
          task: true,
          meeting: true,
          mention: true,
          invitation: true
        },
        workspaceSpecific: {},
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      setPreferences(defaultPreferences);
    } catch (err) {
      console.error('Failed to load notification preferences:', err);
    }
  }, [user]);

  // Mark notification as read - mock implementation
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          !n.isRead 
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, []);

  // Pin/unpin notification
  const pinNotification = useCallback(async (notificationId: string, pinned: boolean) => {
    try {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, isPinned: pinned }
            : n
        )
      );
    } catch (err) {
      console.error('Failed to pin notification:', err);
    }
  }, []);

  // Send notification - mock implementation
  const sendNotification = useCallback(async (
    notification: Omit<WorkspaceNotification, 'id' | 'createdAt' | 'isRead'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Mock implementation
      console.log('Sending notification:', notification);
    } catch (err) {
      console.error('Failed to send notification:', err);
      throw err;
    }
  }, [user]);

  // Send bulk notification - mock implementation
  const sendBulkNotification = useCallback(async (
    userIds: string[],
    notification: Partial<WorkspaceNotification>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Mock implementation
      console.log('Sending bulk notification to:', userIds, notification);
    } catch (err) {
      console.error('Failed to send bulk notification:', err);
      throw err;
    }
  }, [user, workspaceId, workspaceType]);

  // Update preferences - mock implementation
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      throw err;
    }
  }, [user, preferences]);

  // Real-time updates - mock implementation
  const startRealTimeUpdates = useCallback(() => {
    if (!realTimeUpdates || !user) return;

    // Mock real-time subscription
    console.log('Starting real-time notifications for workspace:', workspaceId);
    
    return () => {
      console.log('Stopping real-time notifications');
    };
  }, [realTimeUpdates, user, workspaceId]);

  const stopRealTimeUpdates = useCallback(() => {
    // Implementation for stopping real-time updates
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Get notifications by category
  const getNotificationsByCategory = useCallback((category: string) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  // Clear expired notifications
  const clearExpiredNotifications = useCallback(async () => {
    const now = new Date().toISOString();
    
    try {
      setNotifications(prev => 
        prev.filter(n => !n.expiresAt || n.expiresAt > now)
      );
    } catch (err) {
      console.error('Failed to clear expired notifications:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [loadNotifications, loadPreferences]);

  // Set up real-time updates if enabled
  useEffect(() => {
    if (realTimeUpdates) {
      const cleanup = startRealTimeUpdates();
      return cleanup;
    }
  }, [realTimeUpdates, startRealTimeUpdates]);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    pinNotification,
    sendNotification,
    sendBulkNotification,
    updatePreferences,
    startRealTimeUpdates,
    stopRealTimeUpdates,
    refreshNotifications,
    getNotificationsByCategory,
    clearExpiredNotifications
  };
}