import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { debugLog } from '@/utils/debugLogger';
import { 
  MessageSquare, 
  Pin, 
  Users, 
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Check
} from 'lucide-react';

interface Annotation {
  id: string;
  x: number;
  y: number;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  resolved: boolean;
  replies: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    timestamp: string;
  }>;
}

interface SharedAnnotationSystemProps {
  contentId: string;
  contentType: 'document' | 'image' | 'design' | 'code';
  readonly?: boolean;
  className?: string;
}

export const SharedAnnotationSystem: React.FC<SharedAnnotationSystemProps> = ({
  contentId,
  contentType,
  readonly = false,
  className = ''
}) => {
  const { onlineUsers, currentUserPresence } = useCollaboration();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotationPosition, setNewAnnotationPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [expandedAnnotations, setExpandedAnnotations] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly || !isAddingAnnotation) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewAnnotationPosition({ x, y });
  };

  const createAnnotation = (content: string) => {
    if (!newAnnotationPosition || !currentUserPresence || !content.trim()) return;

    const newAnnotation: Annotation = {
      id: `annotation_${Date.now()}`,
      x: newAnnotationPosition.x,
      y: newAnnotationPosition.y,
      content: content.trim(),
      author: {
        id: currentUserPresence.user_id,
        name: currentUserPresence.user_info.display_name || 'User',
        avatar: currentUserPresence.user_info.avatar_url
      },
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setNewAnnotationPosition(null);
    setIsAddingAnnotation(false);
    setSelectedAnnotation(newAnnotation.id);

    debugLog.log('Created annotation:', newAnnotation);
  };

  const addReply = (annotationId: string, content: string) => {
    if (!currentUserPresence || !content.trim()) return;

    const reply = {
      id: `reply_${Date.now()}`,
      content: content.trim(),
      author: {
        id: currentUserPresence.user_id,
        name: currentUserPresence.user_info.display_name || 'User',
        avatar: currentUserPresence.user_info.avatar_url
      },
      timestamp: new Date().toISOString()
    };

    setAnnotations(prev => prev.map(annotation => 
      annotation.id === annotationId 
        ? { ...annotation, replies: [...annotation.replies, reply] }
        : annotation
    ));
  };

  const resolveAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.map(annotation => 
      annotation.id === annotationId 
        ? { ...annotation, resolved: !annotation.resolved }
        : annotation
    ));
  };

  const deleteAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== annotationId));
    setSelectedAnnotation(null);
  };

  const toggleExpanded = (annotationId: string) => {
    setExpandedAnnotations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(annotationId)) {
        newSet.delete(annotationId);
      } else {
        newSet.add(annotationId);
      }
      return newSet;
    });
  };

  const unresolvedCount = annotations.filter(a => !a.resolved).length;
  const resolvedCount = annotations.filter(a => a.resolved).length;

  return (
    <div className={`relative ${className}`}>
      {/* Annotation Controls */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Annotations
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {unresolvedCount} active
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {resolvedCount} resolved
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {onlineUsers.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-2">
            {!readonly && (
              <Button
                variant={isAddingAnnotation ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsAddingAnnotation(!isAddingAnnotation);
                  setNewAnnotationPosition(null);
                }}
              >
                <Pin className="h-4 w-4 mr-1" />
                {isAddingAnnotation ? 'Cancel' : 'Add Annotation'}
              </Button>
            )}
            <div className="flex -space-x-2 ml-auto">
              {onlineUsers.slice(0, 5).map((user) => (
                <Avatar key={user.user_id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={user.user_info.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {user.user_info.display_name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annotatable Content Area */}
      <div 
        ref={containerRef}
        className={`relative border border-muted rounded-lg min-h-[400px] bg-muted/10 ${
          isAddingAnnotation ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onClick={handleContainerClick}
      >
        {isAddingAnnotation && (
          <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Pin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Click anywhere to add an annotation</p>
            </div>
          </div>
        )}

        {/* Content Placeholder */}
        <div className="p-8 text-center text-muted-foreground">
          <div className="text-lg font-medium mb-2">
            {contentType === 'document' && 'Document Content'}
            {contentType === 'image' && 'Image Content'}
            {contentType === 'design' && 'Design Content'}
            {contentType === 'code' && 'Code Content'}
          </div>
          <p className="text-sm">
            Content will be displayed here. Annotations can be added by clicking on specific areas.
          </p>
        </div>

        {/* Annotation Markers */}
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              annotation.resolved ? 'opacity-60' : ''
            }`}
            style={{ 
              left: `${annotation.x}%`, 
              top: `${annotation.y}%` 
            }}
          >
            <Button
              variant={selectedAnnotation === annotation.id ? "default" : "secondary"}
              size="sm"
              className={`h-6 w-6 rounded-full p-0 ${
                annotation.resolved ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnotation(
                  selectedAnnotation === annotation.id ? null : annotation.id
                );
              }}
            >
              {annotation.resolved ? (
                <Check className="h-3 w-3" />
              ) : (
                <MessageSquare className="h-3 w-3" />
              )}
            </Button>
          </div>
        ))}

        {/* New Annotation Input */}
        {newAnnotationPosition && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${newAnnotationPosition.x}%`, 
              top: `${newAnnotationPosition.y}%` 
            }}
          >
            <NewAnnotationInput
              onSave={createAnnotation}
              onCancel={() => {
                setNewAnnotationPosition(null);
                setIsAddingAnnotation(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Selected Annotation Details */}
      {selectedAnnotation && (
        <Card className="mt-4">
          <CardContent className="p-4">
            {annotations
              .filter(a => a.id === selectedAnnotation)
              .map(annotation => (
                <AnnotationDetail
                  key={annotation.id}
                  annotation={annotation}
                  onReply={(content) => addReply(annotation.id, content)}
                  onResolve={() => resolveAnnotation(annotation.id)}
                  onDelete={() => deleteAnnotation(annotation.id)}
                  onToggleExpanded={() => toggleExpanded(annotation.id)}
                  isExpanded={expandedAnnotations.has(annotation.id)}
                  readonly={readonly}
                />
              ))}
          </CardContent>
        </Card>
      )}

      {/* Annotations List */}
      {annotations.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">All Annotations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedAnnotation === annotation.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/50'
                  } ${annotation.resolved ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedAnnotation(annotation.id)}
                >
                  <div className="flex items-start gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={annotation.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {annotation.author.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{annotation.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(annotation.timestamp).toLocaleTimeString()}
                        </span>
                        {annotation.resolved && (
                          <Badge variant="secondary" className="text-xs">Resolved</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {annotation.content}
                      </p>
                      {annotation.replies.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {annotation.replies.length} replies
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper Components
const NewAnnotationInput: React.FC<{
  onSave: (content: string) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
    }
  };

  return (
    <Card className="w-64 shadow-lg">
      <CardContent className="p-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your annotation..."
          className="mb-2 min-h-[60px]"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!content.trim()}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AnnotationDetail: React.FC<{
  annotation: Annotation;
  onReply: (content: string) => void;
  onResolve: () => void;
  onDelete: () => void;
  onToggleExpanded: () => void;
  isExpanded: boolean;
  readonly: boolean;
}> = ({ annotation, onReply, onResolve, onDelete, onToggleExpanded, isExpanded, readonly }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={annotation.author.avatar} />
          <AvatarFallback className="text-sm">
            {annotation.author.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{annotation.author.name}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(annotation.timestamp).toLocaleString()}
            </span>
            {annotation.resolved && (
              <Badge variant="secondary" className="text-xs">Resolved</Badge>
            )}
          </div>
          <p className="text-sm">{annotation.content}</p>
        </div>
        <div className="flex items-center gap-1">
          {!readonly && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResolve}
                className="h-7 w-7 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-7 w-7 p-0 text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
          {annotation.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpanded}
              className="h-7 w-7 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Replies */}
      {isExpanded && annotation.replies.length > 0 && (
        <div className="ml-11 space-y-2 border-l-2 border-muted pl-3">
          {annotation.replies.map((reply) => (
            <div key={reply.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={reply.author.avatar} />
                <AvatarFallback className="text-xs">
                  {reply.author.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs">{reply.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {!readonly && (
        <div className="ml-11">
          {showReplyInput ? (
            <div className="space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px]"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                  Reply
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(true)}
              className="text-xs"
            >
              Reply
            </Button>
          )}
        </div>
      )}
    </div>
  );
};