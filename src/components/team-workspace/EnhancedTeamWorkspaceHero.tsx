import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTimerManager } from '@/utils/timerManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Target, 
  Award, 
  Zap, 
  Plus, 
  Filter,
  Play,
  ArrowRight,
  Sparkles,
  MessageSquare,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';

interface EnhancedTeamWorkspaceHeroProps {
  totalTeams: number;
  activeProjects: number;
  teamMembers: number;
  completedTasks: number;
  onJoinTeam: () => void;
  onShowFilters: () => void;
  canJoinTeams?: boolean;
}

export const EnhancedTeamWorkspaceHero = ({ 
  totalTeams, 
  activeProjects, 
  teamMembers,
  completedTasks,
  onJoinTeam,
  onShowFilters,
  canJoinTeams = true
}: EnhancedTeamWorkspaceHeroProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { icon: Users, value: totalTeams, label: t('team:hero.stats.teams'), color: 'text-blue-400' },
    { icon: Target, value: activeProjects, label: t('team:hero.stats.active_projects'), color: 'text-green-400' },
    { icon: UserPlus, value: teamMembers, label: t('team:hero.stats.members'), color: 'text-purple-400' },
    { icon: CheckCircle, value: `${completedTasks}%`, label: t('team:hero.stats.completion'), color: 'text-yellow-400' }
  ];

  const { setInterval: scheduleInterval } = useTimerManager();

  useEffect(() => {
    const clearTimer = scheduleInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return clearTimer;
  }, [stats.length, scheduleInterval]);

  return (
    <div className="relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(99deg, rgba(59, 20, 93, 1) 51%, rgba(23, 8, 38, 1) 99%)' }}>
        <div className="absolute inset-0 bg-[url('/dashboard-images/team-collaboration.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Content Section */}
          <div className="space-y-8">
            {/* Header with animation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Users className="w-3 h-3 mr-1" />
                  {t('team:hero.workspace.collaborative')}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {isRTL ? (
                    <>
                      تعاون <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">فعال</span> ومنتج
                    </>
                  ) : (
                    <>
                      Effective & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Productive</span> Collaboration
                    </>
                  )}
                </h1>
                
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {isRTL 
                    ? 'انضم إلى فرق العمل المتخصصة وشارك في المشاريع الابتكارية بأدوات تعاون متقدمة ومتابعة مستمرة'
                    : 'Join specialized teams and participate in innovative projects with advanced collaboration tools and continuous monitoring'
                  }
                </p>
              </div>
            </div>

            {/* Animated Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                
                return (
                  <Card 
                    key={index}
                    className={cn(
                      "bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-500",
                      isActive && "bg-white/10 border-white/20 scale-105"
                    )}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={cn("w-6 h-6 mx-auto mb-2 transition-colors", stat.color)} />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {canJoinTeams && (
                <Button
                  onClick={onJoinTeam}
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t('team:hero.workspace.join_team')}
                </Button>
              )}
              
              <Button
                onClick={onShowFilters}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="w-5 h-5 mr-2" />
                {t('team:hero.workspace.advanced_filters')}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                {t('team:hero.workspace.collaboration_guide')}
              </Button>
            </div>
          </div>

          {/* Enhanced Team Dashboard */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Team Collaboration */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/60" />
                  </div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500/90 text-white border-0 animate-pulse">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {t('team:hero.workspace.active')}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/90 text-white border-0">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {t('team:hero.workspace.interactive')}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {t('team:hero.workspace.active_workspace')}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">
                        {activeProjects}
                      </div>
                      <div className="text-sm text-white/70">{t('team:hero.workspace.active_projects')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300">
                        {completedTasks}%
                      </div>
                      <div className="text-sm text-white/70">{t('team:hero.workspace.completion_rate')}</div>
                    </div>
                  </div>

                  <Progress 
                    value={completedTasks} 
                    className="h-2 bg-white/20"
                  />

                  <Button 
                    className="w-full gradient-primary hover:opacity-90 text-white"
                  >
                    {t('team:hero.workspace.enter_workspace')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('team:hero.workspace.meetings')}
                  </div>
                  <div className="text-xs text-white/70">
                    {Math.round(activeProjects * 1.5)} {t('team:hero.workspace.scheduled')}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">
                    {t('team:hero.workspace.achievements')}
                  </div>
                  <div className="text-xs text-white/70">
                    {Math.round(completedTasks * 0.1)} {t('team:hero.workspace.milestones')}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
