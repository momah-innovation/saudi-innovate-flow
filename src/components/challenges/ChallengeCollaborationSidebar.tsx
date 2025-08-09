import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Clock,
  UserPlus,
  Settings,
  Zap,
  Eye
} from 'lucide-react';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { UserPresence } from '@/components/collaboration/UserPresence';

interface ChallengeCollaborationSidebarProps {
  challengeId: string;
  isParticipant: boolean;
  userTeam: any;
}

export const ChallengeCollaborationSidebar: React.FC<ChallengeCollaborationSidebarProps> = ({
  challengeId,
  isParticipant,
  userTeam
}) => {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      {/* Collaboration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            التعاون المباشر
          </CardTitle>
          <CardDescription>
            {isParticipant ? 'أنت مشارك في هذا التحدي' : 'انضم للمشاركة في التعاون'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">المتصلون الآن</span>
              <Badge variant="secondary">{onlineUsers.length}</Badge>
            </div>
            
            <UserPresence 
              users={onlineUsers} 
              maxVisible={5}
              showStatus={true}
              size="sm"
            />
            
            {isParticipant && (
              <div className="pt-4 border-t">
                <WorkspaceCollaboration
                  workspaceType="user"
                  entityId={challengeId}
                  showWidget={true}
                  showPresence={false}
                  showActivity={true}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Status */}
      {userTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              فريقك
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{userTeam.name}</span>
                <Badge variant="outline">{userTeam.members?.length || 0} أعضاء</Badge>
              </div>
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {userTeam.members?.map((member: any, index: number) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                إدارة الفريق
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            بدء نقاش جديد
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start">
            <UserPlus className="h-4 w-4 mr-2" />
            دعوة للتعاون
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start">
            <Eye className="h-4 w-4 mr-2" />
            عرض النشاط
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا يوجد نشاط حديث
                </p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="text-xs space-y-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-muted-foreground">{activity.description}</p>
                    <p className="text-muted-foreground">منذ {activity.timeAgo}</p>
                    <Separator />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};