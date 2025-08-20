import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

interface Notification {
  id: string;
  title_ar: string;
  title_en: string;
  message_ar: string;
  message_en: string;
  type: string;
  is_read: boolean;
  created_at: string;
  action_url?: string;
}

export const useUserNotifications = (limit: number = 10) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-notifications', user?.id, limit],
    queryFn: async (): Promise<Notification[]> => {
      if (!user?.id) return [];

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.warn('Could not load notifications:', error);
          return [];
        }

        return (data || []).map(notif => ({
          id: notif.id,
          title_ar: notif.title || '',
          title_en: notif.title || '',
          message_ar: notif.message || '',
          message_en: notif.message || '',
          type: notif.type || 'info',
          is_read: notif.is_read || false,
          created_at: notif.created_at,
          action_url: typeof notif.metadata === 'object' && notif.metadata ? (notif.metadata as any).action_url : undefined
        }));
      } catch (error) {
        console.warn('Failed to fetch notifications:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-notifications', user?.id] });
    }
  });

  return {
    ...query,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending
  };
};