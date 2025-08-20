import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { TeamChatMessage, WorkspaceMeeting } from '@/types/workspace';

interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  current_location?: string;
  metadata?: Record<string, any>;
}

export const useWorkspaceCollaboration = () => {
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuth();
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [meetings, setMeetings] = useState<WorkspaceMeeting[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch recent chat messages
  const fetchMessages = async (channel = 'general', limit = 50) => {
    if (!currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('team_chat_messages')
        .select(`
          *,
          profiles(
            display_name,
            profile_image_url
          )
        `)
        .eq('workspace_id', currentWorkspace.id)
        .eq('channel_name', channel)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Transform the data to match TeamChatMessage interface
      const transformedMessages = (data || []).map(msg => ({
        id: msg.id,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: (msg.message_type as 'text' | 'file' | 'image' | 'system') || 'text',
        created_at: msg.created_at,
        edited_at: msg.edited_at,
        reply_to: msg.parent_message_id,
        attachments: [],
        sender: {
          id: msg.sender_id,
          display_name: 'Unknown User',
          role: 'member',
          specialization: 'general'
        }
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (content: string, channel = 'general', messageType: 'text' | 'system' = 'text') => {
    if (!currentWorkspace || !user) return;

    try {
      const { error } = await supabase
        .from('team_chat_messages')
        .insert({
          workspace_id: currentWorkspace.id,
          sender_id: user.id,
          content,
          message_type: messageType,
          channel_name: channel
        });

      if (error) throw error;

      // Refresh messages
      await fetchMessages(channel);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch upcoming meetings
  const fetchMeetings = async () => {
    if (!currentWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('workspace_meetings')
        .select(`
          *,
          meeting_participants(
            *,
            profiles(
              display_name,
              profile_image_url
            )
          )
        `)
        .eq('workspace_id', currentWorkspace.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10);

      if (error) throw error;

      // Transform meetings data
      const transformedMeetings = (data || []).map(meeting => ({
        ...meeting,
        meeting_type: (meeting.meeting_type as 'team-sync' | 'project-review' | 'brainstorming' | 'one-on-one') || 'team-sync',
        attendees: []
      })) as WorkspaceMeeting[];

      setMeetings(transformedMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  // Create a new meeting
  const createMeeting = async (meetingData: {
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    meeting_type?: string;
    location?: string;
    virtual_link?: string;
  }) => {
    if (!currentWorkspace || !user) return;

    try {
      const { data: meeting, error } = await supabase
        .from('workspace_meetings')
        .insert({
          ...meetingData,
          workspace_id: currentWorkspace.id,
          organizer_id: user.id,
          meeting_type: meetingData.meeting_type || 'general'
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      // Refresh meetings
      await fetchMeetings();

      return meeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  // Update user presence
  const updatePresence = async (status: UserPresence['status'], location?: string) => {
    if (!currentWorkspace || !user) return;

    try {
      // This would typically use Supabase Realtime presence
      // For now, we'll simulate it with a simple state update
      const presence: UserPresence = {
        user_id: user.id,
        status,
        last_seen: new Date().toISOString(),
        current_location: location
      };

      // Update local state
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.user_id !== user.id);
        return [...filtered, presence];
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!currentWorkspace || !user) return;

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`workspace-messages-${currentWorkspace.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_chat_messages',
          filter: `workspace_id=eq.${currentWorkspace.id}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    // Subscribe to meeting updates
    const meetingSubscription = supabase
      .channel(`workspace-meetings-${currentWorkspace.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspace_meetings',
          filter: `workspace_id=eq.${currentWorkspace.id}`
        },
        () => {
          fetchMeetings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
      supabase.removeChannel(meetingSubscription);
    };
  }, [currentWorkspace, user]);

  // Load initial data
  useEffect(() => {
    if (currentWorkspace) {
      setLoading(true);
      Promise.all([
        fetchMessages(),
        fetchMeetings()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [currentWorkspace]);

  return {
    // Data
    messages,
    meetings,
    onlineUsers,
    
    // State
    loading,
    
    // Actions
    sendMessage,
    fetchMessages,
    createMeeting,
    fetchMeetings,
    updatePresence
  };
};