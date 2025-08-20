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

export function ChallengeTeamWorkspace({ challengeId }: ChallengeTeamWorkspaceProps) {
  const [teams] = useState<Team[]>([]);

  return (
    <div className="space-y-8">
      {/* Enhanced Team Formation Header */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              فرق التحدي
            </span>
          </CardTitle>
          <CardDescription className="text-lg leading-relaxed">
            كون فريقك أو انضم لفريق موجود للعمل معاً على التحدي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="hover-scale gradient-border">
              <Plus className="h-4 w-4 mr-2" />
              إنشاء فريق جديد
            </Button>
            <Button variant="outline" className="hover-scale gradient-border">
              <Target className="h-4 w-4 mr-2" />
              البحث عن فريق
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Teams List */}
      {teams.length === 0 ? (
        <Card className="gradient-border hover-scale">
          <CardContent className="pt-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
                لا توجد فرق بعد
              </h3>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed max-w-md mx-auto">
                كن أول من ينشئ فريقاً لهذا التحدي
              </p>
              <Button className="hover-scale gradient-border">
                <Plus className="h-4 w-4 mr-2" />
                إنشاء أول فريق
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {teams.map((team, index) => (
            <Card key={index} className="gradient-border hover-scale group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{team.name}</h3>
                      <Badge variant="outline" className="gradient-border">{team.members?.length || 0}/5 أعضاء</Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{team.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-primary/10 text-primary">
                          <Clock className="h-3 w-3" />
                        </div>
                        منذ {team.createdAgo}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-primary/10 text-primary">
                          <MessageCircle className="h-3 w-3" />
                        </div>
                        {team.messagesCount || 0} رسالة
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" className="hover-scale gradient-border">
                      عرض
                    </Button>
                    <Button size="sm" className="hover-scale gradient-border">
                      انضمام
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gradient-to-r from-transparent via-border to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {team.members?.slice(0, 4).map((member: TeamMember, idx: number) => (
                        <Avatar key={idx} className="h-10 w-10 border-2 border-background ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-medium">
                            {member.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members?.length > 4 && (
                        <div className="h-10 w-10 bg-gradient-to-br from-muted to-muted/50 border-2 border-background rounded-full flex items-center justify-center ring-2 ring-primary/10">
                          <span className="text-sm font-medium">+{team.members.length - 4}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="hover-scale">
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