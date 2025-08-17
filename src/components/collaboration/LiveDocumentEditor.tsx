import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Save, 
  Users, 
  Clock,
  Eye,
  Edit3,
  MessageSquare
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { debugLog } from '@/utils/debugLogger';
import { UserPresence } from './UserPresence';
// import type { LiveDocument } from '@/types/collaboration';

interface LiveDocumentEditorProps {
  documentId?: string;
  documentType: 'idea' | 'challenge_submission' | 'project_plan' | 'proposal' | 'notes';
  entityId?: string;
  title?: string;
  content?: any;
  readOnly?: boolean;
  onSave?: (title: string, content: any) => void;
}

export const LiveDocumentEditor: React.FC<LiveDocumentEditorProps> = ({
  documentId,
  documentType,
  entityId,
  title: initialTitle = '',
  content: initialContent = {},
  readOnly = false,
  onSave
}) => {
  const { onlineUsers, currentUserPresence } = useCollaboration();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(JSON.stringify(initialContent, null, 2));
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeEditors, setActiveEditors] = useState<any[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  // Unified loading and error handling
  const unifiedLoading = useUnifiedLoading({
    component: 'LiveDocumentEditor',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({
    component: 'LiveDocumentEditor',
    showToast: true,
    logError: true
  });

  // Simulate active editors (in real implementation, this would come from live_documents.current_editors)
  useEffect(() => {
    const currentEditors = onlineUsers
      .filter(user => 
        user.current_location.entity_type === documentType && 
        user.current_location.entity_id === entityId
      )
      .map(user => ({
        user_id: user.user_id,
        cursor_position: 0,
        last_activity: user.last_seen,
        user_info: user.user_info
      }));
    
    setActiveEditors(currentEditors);
  }, [onlineUsers, documentType, entityId]);

  const handleSave = async () => {
    await unifiedLoading.withLoading('saveDocument', async () => {
      const parsedContent = JSON.parse(content);
      onSave?.(title, parsedContent);
      setLastSaved(new Date());
      setIsEditing(false);
      return true;
    }, {
      successMessage: 'تم حفظ المستند بنجاح',
      errorMessage: 'فشل في حفظ المستند - تحقق من صحة JSON'
    });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsEditing(true);
  };

  const getDocumentTypeLabel = () => {
    const labels = {
      idea: 'فكرة',
      challenge_submission: 'مشاركة في تحدي',
      project_plan: 'خطة مشروع',
      proposal: 'مقترح',
      notes: 'ملاحظات'
    };
    return labels[documentType] || documentType;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {getDocumentTypeLabel()}
            {isEditing && (
              <Badge variant="secondary" className="text-xs">
                يتم التحرير
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-3">
            {/* Active Editors */}
            <div className="flex items-center gap-2">
              <UserPresence 
                users={activeEditors.map(editor => ({
                  user_id: editor.user_id,
                  session_id: 'live-edit',
                  status: 'online' as const,
                  current_location: { page: 'document-editor' },
                  last_seen: editor.last_activity,
                  user_info: editor.user_info
                }))}
                maxVisible={3}
                size="sm"
              />
              {activeEditors.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {activeEditors.length} محرر
                </span>
              )}
            </div>

            {/* Save Button */}
            {!readOnly && (
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={!isEditing || unifiedLoading.isLoading('saveDocument')}
                variant={isEditing ? "default" : "outline"}
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ
              </Button>
            )}
          </div>
        </div>

        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            آخر حفظ: {lastSaved.toLocaleTimeString('ar')}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Document Title */}
        <div>
          <Input
            placeholder="عنوان المستند..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={readOnly}
            className="font-medium"
          />
        </div>

        <Separator />

        {/* Document Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">المحتوى</label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                JSON
              </Badge>
              {readOnly ? (
                <Badge variant="secondary" className="text-xs">
                  <Eye className="w-3 h-3 ml-1" />
                  للقراءة فقط
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  <Edit3 className="w-3 h-3 ml-1" />
                  قابل للتحرير
                </Badge>
              )}
            </div>
          </div>
          
          <Textarea
            ref={contentRef}
            placeholder="محتوى المستند (JSON)..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            disabled={readOnly}
            rows={12}
            className="font-mono text-sm"
          />
        </div>

        {/* Document Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>معرف المستند: {documentId || 'جديد'}</span>
            {entityId && <span>معرف الكيان: {entityId}</span>}
          </div>
          
          <Button variant="ghost" size="sm">
            <MessageSquare className="w-4 h-4 ml-2" />
            تعليقات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};