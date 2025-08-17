import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceFile } from '@/types/workspace';

interface DocumentSession {
  id: string;
  document_id: string;
  user_id: string;
  cursor_position?: number;
  selection_start?: number;
  selection_end?: number;
  last_activity: string;
}

interface DocumentOperation {
  type: 'insert' | 'delete' | 'format';
  position: number;
  content?: string;
  length?: number;
  user_id: string;
  timestamp: string;
}

interface UseWorkspaceDocumentsProps {
  workspaceId: string;
  enabled?: boolean;
}

export function useWorkspaceDocuments({ workspaceId, enabled = true }: UseWorkspaceDocumentsProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<WorkspaceFile[]>([]);
  const [activeSessions, setActiveSessions] = useState<Record<string, DocumentSession[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [operationQueue, setOperationQueue] = useState<DocumentOperation[]>([]);

  // Create a new document
  const createDocument = useCallback(async (
    name: string,
    content?: string,
    parentId?: string
  ): Promise<WorkspaceFile | null> => {
    if (!user || !workspaceId) return null;

    try {
      const documentData = {
        workspace_id: workspaceId,
        name,
        file_type: 'document',
        content: content || '',
        created_by: user.id,
        parent_id: parentId,
        is_collaborative: true,
        access_level: 'workspace',
      };

      const { data, error } = await supabase
        .from('workspace_files')
        .insert(documentData)
        .select(`
          *,
          created_by_user:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Failed to create document:', error);
      return null;
    }
  }, [user, workspaceId]);

  // Update document content with operational transformation
  const updateDocumentContent = useCallback(async (
    documentId: string,
    operations: DocumentOperation[]
  ) => {
    if (!user) return false;

    try {
      // Apply operations locally first for immediate UI feedback
      setDocuments(prev => prev.map(doc => {
        if (doc.id !== documentId) return doc;
        
        let newContent = doc.content || '';
        
        // Apply operations in order
        operations.forEach(op => {
          if (op.type === 'insert' && op.content) {
            newContent = newContent.slice(0, op.position) + op.content + newContent.slice(op.position);
          } else if (op.type === 'delete' && op.length) {
            newContent = newContent.slice(0, op.position) + newContent.slice(op.position + op.length);
          }
        });
        
        return { ...doc, content: newContent };
      }));

      // Send operations to server
      const { error } = await supabase
        .from('document_operations')
        .insert(operations.map(op => ({
          document_id: documentId,
          user_id: user.id,
          operation_type: op.type,
          position: op.position,
          content: op.content,
          length: op.length,
          timestamp: op.timestamp,
        })));

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Failed to update document:', error);
      return false;
    }
  }, [user]);

  // Join document editing session
  const joinDocumentSession = useCallback(async (documentId: string) => {
    if (!user) return null;

    try {
      const sessionData = {
        document_id: documentId,
        user_id: user.id,
        joined_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('document_sessions')
        .upsert(sessionData)
        .select(`
          *,
          user:profiles(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Set up real-time channel for document collaboration
      const channel = supabase.channel(`document_${documentId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      // Handle cursor/selection updates
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          const sessions = Object.values(presenceState).flat() as DocumentSession[];
          setActiveSessions(prev => ({
            ...prev,
            [documentId]: sessions,
          }));
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'document_operations',
          filter: `document_id=eq.${documentId}`,
        }, (payload) => {
          const operation = payload.new as DocumentOperation;
          
          // Apply remote operations
          if (operation.user_id !== user.id) {
            setOperationQueue(prev => [...prev, operation]);
          }
        });

      await channel.subscribe();

      return { session: data, channel };
    } catch (error) {
      console.error('Failed to join document session:', error);
      return null;
    }
  }, [user]);

  // Update cursor position
  const updateCursorPosition = useCallback(async (
    documentId: string,
    position: number,
    selectionStart?: number,
    selectionEnd?: number
  ) => {
    if (!user) return;

    const channel = supabase.channel(`document_${documentId}`);
    
    await channel.track({
      user_id: user.id,
      cursor_position: position,
      selection_start: selectionStart,
      selection_end: selectionEnd,
      last_activity: new Date().toISOString(),
    });
  }, [user]);

  // Leave document session
  const leaveDocumentSession = useCallback(async (documentId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('document_sessions')
        .delete()
        .eq('document_id', documentId)
        .eq('user_id', user.id);

      const channel = supabase.channel(`document_${documentId}`);
      await channel.untrack();
      supabase.removeChannel(channel);

      setActiveSessions(prev => ({
        ...prev,
        [documentId]: prev[documentId]?.filter(session => session.user_id !== user.id) || [],
      }));
    } catch (error) {
      console.error('Failed to leave document session:', error);
    }
  }, [user]);

  // Share document with specific users or teams
  const shareDocument = useCallback(async (
    documentId: string,
    shareWith: { type: 'user' | 'team'; id: string; permission: 'read' | 'write' | 'admin' }[]
  ) => {
    if (!user) return false;

    try {
      const shareData = shareWith.map(share => ({
        document_id: documentId,
        shared_with_type: share.type,
        shared_with_id: share.id,
        permission_level: share.permission,
        shared_by: user.id,
      }));

      const { error } = await supabase
        .from('document_shares')
        .upsert(shareData);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to share document:', error);
      return false;
    }
  }, [user]);

  // Load workspace documents
  useEffect(() => {
    if (!enabled || !workspaceId) return;

    const loadDocuments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('workspace_files')
          .select(`
            *,
            created_by_user:profiles(id, full_name, avatar_url)
          `)
          .eq('workspace_id', workspaceId)
          .eq('file_type', 'document')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setDocuments(data || []);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [workspaceId, enabled]);

  // Process operation queue
  useEffect(() => {
    if (operationQueue.length === 0) return;

    const processOperations = () => {
      const operations = [...operationQueue];
      setOperationQueue([]);

      // Group operations by document
      const operationsByDocument = operations.reduce((acc, op) => {
        if (!acc[op.user_id]) acc[op.user_id] = [];
        acc[op.user_id].push(op);
        return acc;
      }, {} as Record<string, DocumentOperation[]>);

      // Apply operations to documents
      setDocuments(prev => prev.map(doc => {
        const docOperations = Object.values(operationsByDocument).flat()
          .filter(op => (op as any).document_id === doc.id);
        
        if (docOperations.length === 0) return doc;

        let newContent = doc.content || '';
        
        docOperations
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .forEach(op => {
            if (op.type === 'insert' && op.content) {
              newContent = newContent.slice(0, op.position) + op.content + newContent.slice(op.position);
            } else if (op.type === 'delete' && op.length) {
              newContent = newContent.slice(0, op.position) + newContent.slice(op.position + op.length);
            }
          });

        return { ...doc, content: newContent };
      }));
    };

    const timer = setTimeout(processOperations, 100); // Batch operations for 100ms
    return () => clearTimeout(timer);
  }, [operationQueue]);

  return {
    documents,
    activeSessions,
    isLoading,
    createDocument,
    updateDocumentContent,
    joinDocumentSession,
    leaveDocumentSession,
    updateCursorPosition,
    shareDocument,
  };
}