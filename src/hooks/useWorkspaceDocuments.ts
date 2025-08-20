import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WorkspaceDocument {
  id: string;
  workspace_id: string;
  filename: string;
  file_category: string;
  file_size: number;
  uploaded_by: string;
  updated_at: string;
  access_level: string;
  content?: string;
}

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
  const [documents, setDocuments] = useState<WorkspaceDocument[]>([]);
  const [activeSessions, setActiveSessions] = useState<Record<string, DocumentSession[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [operationQueue, setOperationQueue] = useState<DocumentOperation[]>([]);

  // Create a new document
  const createDocument = useCallback(async (
    name: string,
    content?: string,
    parentId?: string
  ): Promise<WorkspaceDocument | null> => {
    if (!user || !workspaceId) return null;

    try {
      const documentData = {
        workspace_id: workspaceId,
        filename: name,
        original_filename: name,
        file_path: `/documents/${name}`,
        file_size: (content || '').length,
        mime_type: 'text/plain',
        file_category: 'document',
        uploaded_by: user.id,
        access_level: 'workspace',
      };

      const { data, error } = await supabase
        .from('workspace_files')
        .insert(documentData)
        .select('id, workspace_id, filename, file_category, file_size, uploaded_by, updated_at, access_level')
        .maybeSingle();

      if (error) throw error;

      const newDoc: WorkspaceDocument = {
        id: data?.id || '',
        workspace_id: data?.workspace_id || workspaceId,
        filename: data?.filename || name,
        file_category: data?.file_category || 'document',
        file_size: data?.file_size || 0,
        uploaded_by: data?.uploaded_by || user.id,
        updated_at: data?.updated_at || new Date().toISOString(),
        access_level: data?.access_level || 'workspace',
        content: content || ''
      };

      setDocuments(prev => [newDoc, ...prev]);
      return newDoc;
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
          const sessions = Object.values(presenceState).flat().map(p => ({
            id: user.id,
            document_id: documentId,
            user_id: user.id,
            last_activity: new Date().toISOString(),
            ...(p as any)
          })) as DocumentSession[];
          
          setActiveSessions(prev => ({
            ...prev,
            [documentId]: sessions,
          }));
        });

      await channel.subscribe();

      return { channel };
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
      console.log('Document sharing feature pending implementation:', documentId, shareWith);
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
          .select('id, workspace_id, filename, file_category, file_size, uploaded_by, updated_at, access_level')
          .eq('workspace_id', workspaceId)
          .eq('file_category', 'document')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        const docs: WorkspaceDocument[] = (data || []).map(item => ({
          id: item.id,
          workspace_id: item.workspace_id,
          filename: item.filename,
          file_category: item.file_category,
          file_size: item.file_size,
          uploaded_by: item.uploaded_by,
          updated_at: item.updated_at,
          access_level: item.access_level,
          content: ''
        }));
        
        setDocuments(docs);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [workspaceId, enabled]);

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