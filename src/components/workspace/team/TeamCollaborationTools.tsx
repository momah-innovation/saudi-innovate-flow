import React, { useState } from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Share2,
  FileText,
  Users,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Eye,
  Download,
  Edit3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  created_at: string;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
}

interface SharedDocument {
  id: string;
  name: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'pdf';
  size: string;
  shared_by: string;
  shared_at: string;
  last_modified: string;
  permissions: 'view' | 'edit' | 'admin';
  collaborators: Array<{
    id: string;
    name: string;
    avatar_url?: string;
    status: 'viewing' | 'editing' | 'offline';
  }>;
}

interface TeamCollaborationToolsProps {
  teamId: string;
  userId: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    sender_id: 'user1',
    sender_name: 'Ahmed Salem',
    content: 'Good morning everyone! Ready for today\'s sprint review?',
    message_type: 'text',
    created_at: '2025-01-20T09:30:00Z',
    reactions: [
      { emoji: '👍', users: ['user2', 'user3'] },
      { emoji: '☕', users: ['user4'] }
    ]
  },
  {
    id: '2',
    sender_id: 'user2',
    sender_name: 'Sara Mohamed',
    content: 'Yes! I\'ve prepared the demo for the new dashboard features.',
    message_type: 'text',
    created_at: '2025-01-20T09:32:00Z'
  },
  {
    id: '3',
    sender_id: 'user3',
    sender_name: 'Omar Ali',
    content: 'I\'ll share the performance metrics document shortly.',
    message_type: 'text',
    created_at: '2025-01-20T09:35:00Z'
  }
];

const mockDocuments: SharedDocument[] = [
  {
    id: '1',
    name: 'Sprint Planning Document.docx',
    type: 'document',
    size: '2.4 MB',
    shared_by: 'Ahmed Salem',
    shared_at: '2025-01-19T14:30:00Z',
    last_modified: '2025-01-20T08:15:00Z',
    permissions: 'edit',
    collaborators: [
      { id: 'user1', name: 'Ahmed Salem', status: 'editing' },
      { id: 'user2', name: 'Sara Mohamed', status: 'viewing' },
      { id: 'user3', name: 'Omar Ali', status: 'offline' }
    ]
  },
  {
    id: '2',
    name: 'Team Performance Metrics.xlsx',
    type: 'spreadsheet',
    size: '1.8 MB',
    shared_by: 'Omar Ali',
    shared_at: '2025-01-20T09:00:00Z',
    last_modified: '2025-01-20T09:30:00Z',
    permissions: 'view',
    collaborators: [
      { id: 'user3', name: 'Omar Ali', status: 'editing' },
      { id: 'user1', name: 'Ahmed Salem', status: 'viewing' }
    ]
  }
];

export function TeamCollaborationTools({ teamId, userId }: TeamCollaborationToolsProps) {
  const { t } = useUnifiedTranslation();
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'spreadsheet':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'presentation':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      viewing: 'bg-blue-100 text-blue-800',
      editing: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {t(`workspace.team.collaboration.status.${status}`)}
      </Badge>
    );
  };

  const formatMessageTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('workspace.team.collaboration.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('workspace.team.collaboration.description')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            {t('workspace.team.collaboration.active_members')}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            {t('workspace.team.collaboration.share')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('workspace.team.collaboration.chat')}
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            {t('workspace.team.collaboration.documents')}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Eye className="h-4 w-4" />
            {t('workspace.team.collaboration.activity')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('workspace.team.collaboration.team_chat')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback className="text-xs">
                        {message.sender_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.sender_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm">{message.content}</p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1">
                          {message.reactions.map((reaction, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs gap-1"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2 pt-4 border-t">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder={t('workspace.team.collaboration.type_message')}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('workspace.team.collaboration.shared_documents')}</h4>
              <Button size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                {t('workspace.team.collaboration.share_document')}
              </Button>
            </div>

            <div className="space-y-3">
              {mockDocuments.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {getFileIcon(document.type)}
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium text-sm">{document.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{document.size}</span>
                            <span>
                              {t('workspace.team.collaboration.shared_by')}: {document.shared_by}
                            </span>
                            <span>
                              {t('workspace.team.collaboration.last_modified')}: {
                                new Date(document.last_modified).toLocaleDateString()
                              }
                            </span>
                          </div>

                          {/* Collaborators */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-2">
                              {document.collaborators.map((collaborator) => (
                                <div key={collaborator.id} className="relative">
                                  <Avatar className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={collaborator.avatar_url} />
                                    <AvatarFallback className="text-xs">
                                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  {collaborator.status === 'editing' && (
                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {document.collaborators.length} {t('workspace.team.collaboration.collaborators')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {t(`workspace.team.collaboration.permissions.${document.permissions}`)}
                        </Badge>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              {t('workspace.team.collaboration.open')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              {t('workspace.team.collaboration.download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Share2 className="h-4 w-4" />
                              {t('workspace.team.collaboration.share')}
                            </DropdownMenuItem>
                            {document.permissions === 'edit' && (
                              <DropdownMenuItem className="gap-2">
                                <Edit3 className="h-4 w-4" />
                                {t('workspace.team.collaboration.edit')}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t('workspace.team.collaboration.activity_feed')}
                </h3>
                <p className="text-muted-foreground">
                  {t('workspace.team.collaboration.activity_description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}