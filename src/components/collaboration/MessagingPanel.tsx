import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  MessageSquare, 
  Users,
  Hash,
  X,
  Settings,
  AtSign,
  Tag
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
// import type { CollaborationMessage } from '@/types/collaboration';

interface MessagingPanelProps {
  contextType?: 'global' | 'organization' | 'team' | 'project' | 'direct';
  contextId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const MessagingPanel: React.FC<MessagingPanelProps> = ({
  contextType = 'global',
  contextId = 'global',
  isOpen = true,
  onClose
}) => {
  const { messages, sendMessage, onlineUsers } = useCollaboration();
  const { t } = useUnifiedTranslation();
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages by context
  const contextMessages = messages.filter(msg => 
    msg.context.space_type === contextType && msg.context.space_id === contextId
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contextMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(newMessage, {
      space_type: contextType,
      space_id: contextId
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('ar', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContextTitle = (): string => {
    switch (contextType) {
      case 'global':
        return t('collaboration.global_chat');
      case 'organization':
        return t('collaboration.organization_chat');
      case 'team':
        return t('collaboration.team_chat');
      case 'project':
        return t('collaboration.project_chat');
      case 'direct':
        return t('collaboration.direct_chat');
      default:
        return t('collaboration.messages');
    }
  };

  // Handle user mentions
  const handleMentionUser = (user: any) => {
    const mentionText = `@${user.display_name || user.name} `;
    setNewMessage(prev => prev + mentionText);
    setShowMentions(false);
    setMentionQuery('');
  };

  // Filter users for mentions
  const filteredUsers = onlineUsers.filter(user => 
    user.user_info?.display_name?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    mentionQuery === ''
  );

  const getContextIcon = () => {
    switch (contextType) {
      case 'global':
        return <Hash className="w-4 h-4" />;
      case 'organization':
      case 'team':
        return <Users className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={`fixed bottom-4 left-4 w-80 z-50 shadow-lg ${isMinimized ? 'h-12' : 'h-96'}`}>
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getContextIcon()}
            {getContextTitle()}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {onlineUsers.length} {t('collaboration.users_online')}
            </Badge>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-3 py-2">
              {contextMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('collaboration.no_messages')}
                </div>
              ) : (
                contextMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={message.sender.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {message.sender.display_name?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender.display_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.created_at)}
                        </span>
                        {message.is_edited && (
                          <Badge variant="outline" className="text-xs">
                            {t('collaboration.message_edited')}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm break-words">
                        {message.content}
                      </p>
                      
                      {message.metadata?.reactions && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(message.metadata.reactions).map(([emoji, userIds]) => (
                            <Badge key={emoji} variant="outline" className="text-xs">
                              {emoji} {(userIds as string[]).length}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <Separator />

          {/* Message Input */}
          <div className="p-3">
            <div className="flex gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMentions(!showMentions)}
              >
                <AtSign className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* TODO: Implement tag selector */}}
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            
            {showMentions && (
              <div className="mb-2 p-2 border rounded-lg bg-muted/50">
                <Input
                  placeholder={t('collaboration.search_users')}
                  value={mentionQuery}
                  onChange={(e) => setMentionQuery(e.target.value)}
                  className="text-xs mb-2"
                />
                <div className="max-h-24 overflow-y-auto space-y-1">
                  {filteredUsers.slice(0, 5).map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleMentionUser(user.user_info)}
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={user.user_info?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {user.user_info?.display_name?.charAt(0) || 'م'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{user.user_info?.display_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                placeholder={t('collaboration.type_message')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};