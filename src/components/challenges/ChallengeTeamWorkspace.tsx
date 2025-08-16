import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Settings, 
  MessageCircle,
  Target,
  Clock
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description?: string;
  members?: TeamMember[];
  createdAgo?: string;
  messagesCount?: number;
}

interface TeamMember {
  id: string;
  name?: string;
  avatar?: string;
}

interface ChallengeTeamWorkspaceProps {
  challengeId: string;
}

export const ChallengeTeamWorkspace: React.FC<ChallengeTeamWorkspaceProps> = ({
  challengeId
}) => {
  const [teams] = useState<Team[]>([]);

  return (
    <div className="space-y-6">
      {/* Team Formation Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            فرق التحدي
          </CardTitle>
          <CardDescription>
            كون فريقك أو انضم لفريق موجود للعمل معاً على التحدي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إنشاء فريق جديد
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              البحث عن فريق
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد فرق بعد</h3>
              <p className="text-muted-foreground mb-4">
                كن أول من ينشئ فريقاً لهذا التحدي
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إنشاء أول فريق
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {teams.map((team, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{team.name}</h3>
                      <Badge variant="outline">{team.members?.length || 0}/5 أعضاء</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        منذ {team.createdAgo}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {team.messagesCount || 0} رسالة
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      عرض
                    </Button>
                    <Button size="sm">
                      انضمام
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {team.members?.slice(0, 4).map((member: TeamMember, idx: number) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members?.length > 4 && (
                        <div className="h-8 w-8 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                          <span className="text-xs">+{team.members.length - 4}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};