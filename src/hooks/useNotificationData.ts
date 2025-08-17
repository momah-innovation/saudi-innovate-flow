import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  recipient_type: string;
  recipient_id?: string;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  priority: string;
  channel: string;
}

export const useNotificationData = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useNotificationData' });

  // Mock data for notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance tomorrow',
      type: 'info',
      status: 'sent',
      recipient_type: 'all',
      sent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      priority: 'medium',
      channel: 'email'
    },
    {
      id: '2',
      title: 'Security Alert',
      message: 'Suspicious login detected',
      type: 'warning',
      status: 'pending',
      recipient_type: 'user',
      recipient_id: 'user-123',
      created_at: new Date().toISOString(),
      priority: 'high',
      channel: 'sms'
    }
  ];

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshNotifications');
      toast({
        title: 'خطأ في جلب الإشعارات',
        description: 'حدث خطأ أثناء جلب بيانات الإشعارات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createNotification = useCallback(async (notificationData: any) => {
    try {
      const newNotification = {
        ...notificationData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        status: 'pending',
      };
      setNotifications(prev => [newNotification, ...prev]);
      toast({
        title: 'تم إنشاء الإشعار',
        description: 'تم إنشاء الإشعار بنجاح',
      });
      return newNotification;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createNotification');
      throw error;
    }
  }, [errorHandler, toast]);

  const updateNotification = useCallback(async (id: string, updates: any) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, ...updates } : notification
      ));
      toast({
        title: 'تم تحديث الإشعار',
        description: 'تم تحديث الإشعار بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateNotification');
      throw error;
    }
  }, [errorHandler, toast]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      toast({
        title: 'تم حذف الإشعار',
        description: 'تم حذف الإشعار بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'deleteNotification');
      throw error;
    }
  }, [errorHandler, toast]);

  return {
    notifications,
    loading,
    refreshNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
  };
};