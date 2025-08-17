import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { TeamChatMessage } from '@/types/workspace';

interface UseWorkspaceChatProps {
  workspaceId: string;
  teamId?: string;
  enabled?: boolean;
}

interface ChatThread {
  id: string;
  parent_message_id: string;
  messages: TeamChatMessage[];
  unread_count: number;
}

export function useWorkspaceChat({ workspaceId, teamId, enabled = true }: UseWorkspaceChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<TeamChatMessage[]>([]);
  const [threads, setThreads] = useState<Record<string, ChatThread>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});

  // Send a new message
  const sendMessage = useCallback(async (
    content: string,
    messageType: 'text' | 'file' | 'system' = 'text',
    parentMessageId?: string,
    attachments?: { name: string; url: string; type: string; size: number }[]
  ) => {
    if (!user || !workspaceId || !content.trim()) return null;

    try {
      const messageData = {
        workspace_id: workspaceId,
        team_id: teamId,
        sender_id: user.id,
        content: content.trim(),
        message_type: messageType,
        parent_message_id: parentMessageId,
        attachments: attachments || [],
        is_edited: false,
      };

      const { data, error } = await supabase
        .from('team_chat_messages')
        .insert(messageData)
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // If it's a thread reply, update the thread
      if (parentMessageId && data) {
        setThreads(prev => ({
          ...prev,
          [parentMessageId]: {
            ...prev[parentMessageId],
            messages: [...(prev[parentMessageId]?.messages || []), data as unknown as TeamChatMessage],
          }
        }));
      } else if (data) {
        setMessages(prev => [data as unknown as TeamChatMessage, ...prev]);
      }

      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }, [user, workspaceId, teamId]);

  // Edit a message
  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!user || !newContent.trim()) return false;

    try {
      const { error } = await supabase
        .from('team_chat_messages')
        .update({ 
          content: newContent.trim(),
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, is_edited: true, edited_at: new Date().toISOString() }
          : msg
      ));

      return true;
    } catch (error) {
      console.error('Failed to edit message:', error);
      return false;
    }
  }, [user]);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('team_chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return true;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }, [user]);

  // Add reaction to message
  const addReaction = useCallback(async (messageId: string, reactionType: string) => {
    if (!user) return false;

    try {
      // Create a simple reactions table entry or handle reactions differently
      // For now, we'll skip reactions until the table is properly defined
      console.log('Reaction feature pending implementation:', messageId, reactionType);
      return true;
    } catch (error) {
      console.error('Failed to add reaction:', error);
      return false;
    }
  }, [user]);

  // Load thread messages
  const loadThread = useCallback(async (parentMessageId: string) => {
    if (!workspaceId) return;

    try {
      const { data, error } = await supabase
        .from('team_chat_messages')
        .select(`
          *,
          sender:profiles(id, full_name, avatar_url)
        `)
        .eq('parent_message_id', parentMessageId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setThreads(prev => ({
        ...prev,
        [parentMessageId]: {
          id: parentMessageId,
          parent_message_id: parentMessageId,
          messages: (data || []) as unknown as TeamChatMessage[],
          unread_count: 0,
        }
      }));
    } catch (error) {
      console.error('Failed to load thread:', error);
    }
  }, [workspaceId]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    try {
      // Handle read status tracking differently until table is defined
      console.log('Mark as read feature pending implementation:', messageIds);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }, [user]);

  // Handle typing indicators
  const setTyping = useCallback((isUserTyping: boolean) => {
    if (!user || !workspaceId) return;

    // Broadcast typing status via realtime
    const channel = supabase.channel(`workspace_${workspaceId}_typing`);
    
    if (isUserTyping) {
      channel.track({ user_id: user.id, typing: true });
    } else {
      channel.untrack();
    }
  }, [user, workspaceId]);

  // Load initial messages
  useEffect(() => {
    if (!enabled || !workspaceId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('team_chat_messages')
          .select(`
            *,
            sender:profiles(id, full_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .is('parent_message_id', null)
          .order('created_at', { ascending: false })
          .limit(50);

        if (teamId) {
          query = query.eq('team_id', teamId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setMessages((data || []) as unknown as TeamChatMessage[]);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [workspaceId, teamId, enabled]);

  // Listen for new messages via custom events
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const { message, workspaceId: msgWorkspaceId } = event.detail;
      
      if (msgWorkspaceId === workspaceId && (!teamId || message.team_id === teamId)) {
        if (message.parent_message_id) {
          // Handle thread message
          setThreads(prev => ({
            ...prev,
            [message.parent_message_id]: {
              ...prev[message.parent_message_id],
              messages: [...(prev[message.parent_message_id]?.messages || []), message],
            }
          }));
        } else {
          // Handle main chat message
          setMessages(prev => [message, ...prev]);
        }
      }
    };

    window.addEventListener('workspace_chat_message', handleNewMessage as EventListener);
    
    return () => {
      window.removeEventListener('workspace_chat_message', handleNewMessage as EventListener);
    };
  }, [workspaceId, teamId]);

  return {
    messages,
    threads,
    isLoading,
    isTyping,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    loadThread,
    markAsRead,
    setTyping,
  };
}