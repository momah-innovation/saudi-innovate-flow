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

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const query = supabase
        .from('workspace_notifications')
        .select(`
          *,
          sender:sender_id(display_name)
        `)
        .eq('recipient_id', user.id)
        .eq('workspace_id', workspaceId)
        .eq('workspace_type', workspaceType)
        .order('created_at', { ascending: false })
        .limit(100);

      // Filter by categories if specified
      if (categories.length > 0) {
        query.in('category', categories);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      const formattedNotifications: WorkspaceNotification[] = data?.map(notification => ({
        id: notification.id,
        type: notification.notification_type as any,
        category: notification.category as any,
        title: notification.title,
        message: notification.message,
        workspaceType: notification.workspace_type as WorkspaceType,
        workspaceId: notification.workspace_id,
        senderId: notification.sender_id,
        senderName: notification.sender?.display_name,
        entityType: notification.entity_type,
        entityId: notification.entity_id,
        actionUrl: notification.action_url,
        actionLabel: notification.action_label,
        isRead: notification.is_read,
        isPinned: notification.is_pinned || false,
        priority: notification.priority || 'medium',
        createdAt: notification.created_at,
        readAt: notification.read_at,
        expiresAt: notification.expires_at,
        metadata: notification.metadata
      })) || [];

      setNotifications(formattedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceId, workspaceType, categories]);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          email: data.email_notifications,
          push: data.push_notifications,
          inApp: data.in_app_notifications,
          categories: data.category_preferences || {},
          workspaceSpecific: data.workspace_preferences || {},
          quietHours: data.quiet_hours || {
            enabled: false,
            startTime: '22:00',
            endTime: '08:00',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        });
      } else {
        // Create default preferences
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
      }
    } catch (err) {
      console.error('Failed to load notification preferences:', err);
    }
  }, [user]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('workspace_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('recipient_id', user?.id);

      if (error) throw error;

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
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotificationIds = notifications
        .filter(n => !n.isRead)
        .map(n => n.id);

      if (unreadNotificationIds.length === 0) return;

      const { error } = await supabase
        .from('workspace_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in('id', unreadNotificationIds)
        .eq('recipient_id', user?.id);

      if (error) throw error;

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
  }, [notifications, user?.id]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('workspace_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('recipient_id', user?.id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [user?.id]);

  // Pin/unpin notification
  const pinNotification = useCallback(async (notificationId: string, pinned: boolean) => {
    try {
      const { error } = await supabase
        .from('workspace_notifications')
        .update({ is_pinned: pinned })
        .eq('id', notificationId)
        .eq('recipient_id', user?.id);

      if (error) throw error;

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
  }, [user?.id]);

  // Send notification
  const sendNotification = useCallback(async (
    notification: Omit<WorkspaceNotification, 'id' | 'createdAt' | 'isRead'>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('workspace_notifications')
        .insert({
          recipient_id: user.id,
          workspace_id: notification.workspaceId,
          workspace_type: notification.workspaceType,
          notification_type: notification.type,
          category: notification.category,
          title: notification.title,
          message: notification.message,
          sender_id: notification.senderId,
          entity_type: notification.entityType,
          entity_id: notification.entityId,
          action_url: notification.actionUrl,
          action_label: notification.actionLabel,
          priority: notification.priority,
          expires_at: notification.expiresAt,
          metadata: notification.metadata
        });

      if (error) throw error;
    } catch (err) {
      console.error('Failed to send notification:', err);
      throw err;
    }
  }, [user]);

  // Send bulk notification
  const sendBulkNotification = useCallback(async (
    userIds: string[],
    notification: Partial<WorkspaceNotification>
  ) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const notifications = userIds.map(userId => ({
        recipient_id: userId,
        workspace_id: workspaceId,
        workspace_type: workspaceType,
        notification_type: notification.type || 'info',
        category: notification.category || 'system',
        title: notification.title || '',
        message: notification.message || '',
        sender_id: user.id,
        entity_type: notification.entityType,
        entity_id: notification.entityId,
        action_url: notification.actionUrl,
        action_label: notification.actionLabel,
        priority: notification.priority || 'medium',
        expires_at: notification.expiresAt,
        metadata: notification.metadata
      }));

      const { error } = await supabase
        .from('workspace_notifications')
        .insert(notifications);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to send bulk notification:', err);
      throw err;
    }
  }, [user, workspaceId, workspaceType]);

  // Update preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          email_notifications: updatedPreferences.email,
          push_notifications: updatedPreferences.push,
          in_app_notifications: updatedPreferences.inApp,
          category_preferences: updatedPreferences.categories,
          workspace_preferences: updatedPreferences.workspaceSpecific,
          quiet_hours: updatedPreferences.quietHours
        });

      if (error) throw error;

      setPreferences(updatedPreferences);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      throw err;
    }
  }, [user, preferences]);

  // Real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (!realTimeUpdates || !user) return;

    const channel = supabase
      .channel(`workspace-notifications-${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'workspace_notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workspace_notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as any;
          setNotifications(prev => 
            prev.map(n => 
              n.id === updatedNotification.id 
                ? { ...n, ...updatedNotification }
                : n
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      const { error } = await supabase
        .from('workspace_notifications')
        .delete()
        .eq('recipient_id', user?.id)
        .lt('expires_at', now);

      if (error) throw error;

      setNotifications(prev => 
        prev.filter(n => !n.expiresAt || n.expiresAt > now)
      );
    } catch (err) {
      console.error('Failed to clear expired notifications:', err);
    }
  }, [user?.id]);

  // Load data on mount
  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, [loadNotifications, loadPreferences]);

  // Set up real-time updates
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