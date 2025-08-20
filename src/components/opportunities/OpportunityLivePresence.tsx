import { useEffect, useState } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Eye } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface LivePresenceProps {
  opportunityId: string;
  className?: string;
}

interface PresenceUser {
  session_id: string;
  user_name?: string;
  user_avatar?: string;
  current_section: string;
  last_seen: string;
  is_active: boolean;
}

export const OpportunityLivePresence = ({ opportunityId, className }: LivePresenceProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [sessionId] = useState(() => 
    sessionStorage.getItem('opportunity-session') || crypto.randomUUID()
  );
  const { user } = useCurrentUser();
  const { setInterval: scheduleInterval } = useTimerManager();

  useEffect(() => {
    if (!opportunityId) return;
    
    initializePresence();
    setupRealtimePresence();
    
    // Update presence every 30 seconds
    const cleanup = scheduleInterval(updatePresence, 30000);
    
    // Cleanup on unmount
    return () => {
      cleanup();
      markUserInactive();
    };
  }, [opportunityId]);

  const initializePresence = async () => {
    try {
      if (user) {
        // Upsert current user's presence
        await supabase
          .from('opportunity_live_presence')
          .upsert({
            opportunity_id: opportunityId,
            user_id: user.id,
            session_id: sessionId,
            user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
            user_avatar: user.user_metadata?.avatar_url,
            last_seen: new Date().toISOString(),
            is_active: true,
            current_section: 'overview'
          }, {
            onConflict: 'opportunity_id,session_id'
          });
      }
      
      // Load existing presence
      await loadPresenceUsers();
    } catch (error) {
      // Failed to initialize presence - continue without live presence
    }
  };

  const setupRealtimePresence = () => {
    const channel = supabase
      .channel(`opportunity-presence-${opportunityId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunity_live_presence',
          filter: `opportunity_id=eq.${opportunityId}`
        },
        (payload) => {
          // Presence update received
          loadPresenceUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadPresenceUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunity_live_presence')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .eq('is_active', true)
        .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('last_seen', { ascending: false });

      if (error) throw error;
      setPresenceUsers(data || []);
    } catch (error) {
      // Failed to load presence users - use empty array
    }
  };

  const updatePresence = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('opportunity_live_presence')
        .update({
          last_seen: new Date().toISOString(),
          is_active: true
        })
        .eq('opportunity_id', opportunityId)
        .eq('session_id', sessionId);
    } catch (error) {
      // Failed to update presence - continue silently
    }
  };

  const markUserInactive = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('opportunity_live_presence')
        .update({ is_active: false })
        .eq('opportunity_id', opportunityId)
        .eq('session_id', sessionId);
    } catch (error) {
      // Failed to mark user inactive - continue silently
    }
  };

  const updateCurrentSection = async (section: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('opportunity_live_presence')
        .update({ 
          current_section: section,
          last_seen: new Date().toISOString()
        })
        .eq('opportunity_id', opportunityId)
        .eq('session_id', sessionId);
    } catch (error) {
      // Failed to update section - continue silently
    }
  };

  const activeUsers = presenceUsers.filter(user => 
    user.session_id !== sessionId && user.is_active
  );

  if (activeUsers.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4 text-green-500" />
        <Badge variant="secondary" className="text-xs">
          {activeUsers.length} {t('opportunities:live_presence.viewing_now')}
        </Badge>
      </div>
      
      <div className={`flex ${isRTL ? '-space-x-reverse -space-x-2' : '-space-x-2'}`}>
        {activeUsers.slice(0, 5).map((user, index) => (
          <Avatar key={user.session_id} className="w-6 h-6 border-2 border-background">
            <AvatarImage src={user.user_avatar} />
            <AvatarFallback className="text-xs">
              {user.user_name?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
        {activeUsers.length > 5 && (
          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};
