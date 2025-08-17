import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceActivity, TeamChatMessage, WorkspaceMember } from '@/types/workspace';

interface WorkspacePresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  location?: string;
  last_seen: string;
  metadata?: Record<string, any>;
}

interface UseWorkspaceRealtimeProps {
  workspaceId: string;
  enabled?: boolean;
}

export function useWorkspaceRealtime({ workspaceId, enabled = true }: UseWorkspaceRealtimeProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  const [presence, setPresence] = useState<Record<string, WorkspacePresence>>({});
  const [onlineMembers, setOnlineMembers] = useState<WorkspaceMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize real-time channel
  const initializeChannel = useCallback(() => {
    if (!enabled || !workspaceId || !user) return null;

    const channel = supabase.channel(`workspace_${workspaceId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Handle presence events
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const formattedPresence: Record<string, WorkspacePresence> = {};
        
        Object.entries(presenceState).forEach(([userId, presences]) => {
          const latestPresence = (presences as any[])[0];
          if (latestPresence) {
            formattedPresence[userId] = latestPresence;
          }
        });
        
        setPresence(formattedPresence);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined workspace:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left workspace:', key, leftPresences);
      });

    // Handle activity feed updates
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'workspace_activity_feed',
        filter: `workspace_id=eq.${workspaceId}`,
      },
      (payload) => {
        const newActivity = payload.new as WorkspaceActivity;
        setActivities(prev => [newActivity, ...prev].slice(0, 50));
      }
    );

    // Handle team chat messages
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'team_chat_messages',
        filter: `workspace_id=eq.${workspaceId}`,
      },
      (payload) => {
        const newMessage = payload.new as TeamChatMessage;
        // Emit custom event for chat components to handle
        window.dispatchEvent(new CustomEvent('workspace_chat_message', {
          detail: { message: newMessage, workspaceId }
        }));
      }
    );

    return channel;
  }, [workspaceId, enabled, user]);

  // Track user presence
  const updatePresence = useCallback(async (status: WorkspacePresence['status'], location?: string, metadata?: Record<string, any>) => {
    if (!user || !workspaceId) return;

    const channel = supabase.channel(`workspace_${workspaceId}`);
    
    const presenceData: WorkspacePresence = {
      user_id: user.id,
      status,
      location,
      last_seen: new Date().toISOString(),
      metadata,
    };

    await channel.track(presenceData);
  }, [user, workspaceId]);

  // Send activity to feed
  const addActivity = useCallback(async (activity: Omit<WorkspaceActivity, 'id' | 'created_at'>) => {
    if (!user || !workspaceId) return;

    try {
      await supabase.from('workspace_activity_feed').insert({
        workspace_id: workspaceId,
        user_id: user.id,
        ...activity,
      });
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  }, [user, workspaceId]);

  // Fetch initial data and setup real-time
  useEffect(() => {
    if (!enabled || !workspaceId || !user) return;

    let channel: ReturnType<typeof initializeChannel> = null;

    const setupRealtime = async () => {
      try {
        // Fetch initial activities
        const { data: activitiesData } = await supabase
          .from('workspace_activity_feed')
          .select(`
            *,
            user:profiles(id, full_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .order('created_at', { ascending: false })
          .limit(20);

        if (activitiesData) {
          setActivities(activitiesData);
        }

        // Fetch online members
        const { data: membersData } = await supabase
          .from('workspace_members')
          .select(`
            *,
            user:profiles(id, full_name, avatar_url, last_sign_in_at)
          `)
          .eq('workspace_id', workspaceId)
          .eq('status', 'active');

        if (membersData) {
          setOnlineMembers(membersData);
        }

        // Initialize real-time channel
        channel = initializeChannel();
        
        if (channel) {
          await channel.subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED');
            
            if (status === 'SUBSCRIBED') {
              // Track initial presence
              updatePresence('online', window.location.pathname);
            }
          });
        }

      } catch (error) {
        console.error('Failed to setup workspace realtime:', error);
      }
    };

    setupRealtime();

    // Cleanup function
    return () => {
      if (channel) {
        updatePresence('offline');
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [workspaceId, enabled, user, initializeChannel, updatePresence]);

  // Update presence on route changes
  useEffect(() => {
    if (isConnected) {
      updatePresence('online', window.location.pathname);
    }
  }, [window.location.pathname, isConnected, updatePresence]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online', window.location.pathname);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePresence]);

  return {
    activities,
    presence,
    onlineMembers,
    isConnected,
    updatePresence,
    addActivity,
  };
}