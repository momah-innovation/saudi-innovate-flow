import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, Send, Paperclip, Smile, Users, Hash, 
  Phone, Video, MoreHorizontal, Pin, Search, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRTLAware } from '@/hooks/useRTLAware';
import { useTranslation } from '@/hooks/useAppTranslation';

interface TeamChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: any[];
}

interface Message {
  id: string;
  content: string;
  sender: any;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  reactions?: { emoji: string; users: string[] }[];
}

export function TeamChatSheet({ open, onOpenChange, teamMembers }: TeamChatSheetProps) {
  const { user } = useAuth();
  const { start, end } = useRTLAware();
  const { t } = useTranslation();
  const [currentChannel, setCurrentChannel] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'مرحباً بالجميع! كيف يسير العمل على المشروع الجديد؟',
        sender: { id: '1', name: 'أحمد محمد', profile_image_url: null, role: 'قائد فريق' },
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: '2',
        content: 'العمل يسير بشكل جيد، سأرفع التقرير اليومي قريباً',
        sender: { id: '2', name: 'سارة أحمد', profile_image_url: null, role: 'مطورة' },
        timestamp: new Date(Date.now() - 3000000),
        type: 'text'
      },
      {
        id: '3',
        content: 'رائع! هل تحتاجون أي مساعدة في التصميم؟',
        sender: { id: '3', name: 'محمد علي', profile_image_url: null, role: 'مصمم UI/UX' },
        timestamp: new Date(Date.now() - 1800000),
        type: 'text'
      }
    ];
    setMessages(mockMessages);
    setOnlineMembers(['1', '2', '3']);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: user?.id || '',
        name: 'أنت',
        profile_image_url: null,
        role: 'العضو الحالي'
      },
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const channels = [
    { id: 'general', name: 'عام', description: 'النقاشات العامة', members: teamMembers.length },
    { id: 'project-updates', name: 'تحديثات المشروع', description: 'آخر أخبار المشاريع', members: 8 },
    { id: 'random', name: 'عشوائي', description: 'محادثات غير رسمية', members: 12 },
    { id: 'announcements', name: 'الإعلانات', description: 'الإعلانات المهمة', members: teamMembers.length }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30 flex flex-col">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-right">
                <MessageSquare className="h-5 w-5" />
                محادثة الفريق
              </SheetTitle>
            </SheetHeader>

            {/* Channels */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  القنوات
                </h3>
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant={currentChannel === channel.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start h-auto p-2"
                      onClick={() => setCurrentChannel(channel.id)}
                    >
                       <div className="text-start">
                         <div className="flex items-center gap-2">
                           <Hash className="h-3 w-3" />
                           <span className="text-sm">{channel.name}</span>
                         </div>
                         <p className="text-xs text-muted-foreground">
                           {channel.members} {t("member")}
                         </p>
                       </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Online Members */}
              <div className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  متصل الآن ({onlineMembers.length})
                </h3>
                <div className="space-y-2">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.profiles?.profile_image_url} />
                          <AvatarFallback className="text-xs">
                            {member.profiles?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                         {onlineMembers.includes(member.id) && (
                           <div className={`absolute -bottom-0.5 ${end('0.5')} w-2 h-2 bg-success rounded-full border border-background`} />
                         )}
                      </div>
                      <span className="text-sm">{member.profiles?.display_name || 'مستخدم'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {channels.find(c => c.id === currentChannel)?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {channels.find(c => c.id === currentChannel)?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.sender.id === user?.id;
                  const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id;
                  
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                      {showAvatar && !isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={msg.sender.profile_image_url} />
                          <AvatarFallback>
                            {msg.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!showAvatar && !isCurrentUser && <div className="w-8" />}
                      
                      <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                        {showAvatar && (
                          <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <span className="text-sm font-medium">{msg.sender.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {msg.sender.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        <Card className={`max-w-md ${isCurrentUser ? 'ml-auto bg-primary text-primary-foreground' : ''}`}>
                          <CardContent className="p-3">
                            <p className="text-sm">{msg.content}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="اكتب رسالة..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pe-10"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`absolute ${start('2')} top-1/2 transform -translate-y-1/2`}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}