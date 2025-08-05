import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, Star, Medal, Crown, Zap, Target, 
  TrendingUp, Award, Flame, Sparkles 
} from 'lucide-react';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_level: string;
  title: string;
  description: string;
  points_earned: number;
  icon_name: string;
  earned_at: string;
  metadata: any;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  ideas_submitted: number;
  ideas_implemented: number;
  engagement_score: number;
  rank_position: number;
  profiles?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
  } | null;
}

interface GamificationDashboardProps {
  userId?: string;
  showLeaderboard?: boolean;
}

export function GamificationDashboard({ userId, showLeaderboard = true }: GamificationDashboardProps) {
  const { isRTL } = useDirection();
  const { user, userProfile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 'novice',
    progress: 0,
    nextLevelPoints: 1000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, userId]);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUserAchievements(),
        loadLeaderboard(),
        loadUserStats()
      ]);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAchievements = async () => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('is_active', true)
      .order('earned_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setAchievements(data || []);
  };

  const loadLeaderboard = async () => {
    if (!showLeaderboard) return;

    const currentMonth = new Date();
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const { data, error } = await supabase
      .from('innovation_leaderboard')
      .select(`
        *,
        profiles(name, name_ar, profile_image_url)
      `)
      .eq('period_type', 'monthly')
      .gte('period_start', startDate.toISOString().split('T')[0])
      .order('rank_position', { ascending: true })
      .limit(10);

    if (error) throw error;
    setLeaderboard((data as any) || []);
  };

  const loadUserStats = async () => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    // Get user's innovation profile
    const { data: profile } = await supabase
      .from('innovation_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (profile) {
      const level = getLevelFromPoints(profile.total_points);
      const progress = getLevelProgress(profile.total_points);
      const nextLevelPoints = getNextLevelPoints(profile.total_points);

      setUserStats({
        totalPoints: profile.total_points,
        level: profile.level_tier || level,
        progress,
        nextLevelPoints
      });
    }
  };

  const getLevelFromPoints = (points: number): string => {
    if (points >= 10000) return 'legend';
    if (points >= 5000) return 'expert';
    if (points >= 2500) return 'advanced';
    if (points >= 1000) return 'intermediate';
    if (points >= 500) return 'beginner';
    return 'novice';
  };

  const getLevelProgress = (points: number): number => {
    const levels = [0, 500, 1000, 2500, 5000, 10000];
    const currentLevelIndex = levels.findIndex(level => points < level) - 1;
    if (currentLevelIndex === -1) return 100;
    
    const currentLevelPoints = levels[currentLevelIndex] || 0;
    const nextLevelPoints = levels[currentLevelIndex + 1] || levels[levels.length - 1];
    const progressPoints = points - currentLevelPoints;
    const totalNeeded = nextLevelPoints - currentLevelPoints;
    
    return Math.min((progressPoints / totalNeeded) * 100, 100);
  };

  const getNextLevelPoints = (points: number): number => {
    const levels = [500, 1000, 2500, 5000, 10000];
    return levels.find(level => points < level) || levels[levels.length - 1];
  };

  const getAchievementIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      trophy: Trophy,
      star: Star,
      medal: Medal,
      crown: Crown,
      zap: Zap,
      target: Target,
      trending: TrendingUp,
      award: Award,
      flame: Flame,
      sparkles: Sparkles
    };
    const IconComponent = icons[iconName] || Trophy;
    return <IconComponent className="w-5 h-5" />;
  };

  const getAchievementColor = (level: string) => {
    switch (level) {
      case 'gold': return 'bg-warning/10 text-warning border-warning/20';
      case 'silver': return 'bg-muted text-muted-foreground border-muted-foreground/20';
      case 'bronze': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'platinum': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'legend': return 'text-secondary';
      case 'expert': return 'text-destructive';
      case 'advanced': return 'text-warning';
      case 'intermediate': return 'text-info';
      case 'beginner': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelName = (level: string) => {
    const levelNames = {
      legend: isRTL ? 'أسطورة' : 'Legend',
      expert: isRTL ? 'خبير' : 'Expert', 
      advanced: isRTL ? 'متقدم' : 'Advanced',
      intermediate: isRTL ? 'متوسط' : 'Intermediate',
      beginner: isRTL ? 'مبتدئ' : 'Beginner',
      novice: isRTL ? 'مبتدىء' : 'Novice'
    };
    return levelNames[level as keyof typeof levelNames] || level;
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Level & Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Crown className={`w-6 h-6 ${getLevelColor(userStats.level)}`} />
            <div>
              <span className={`text-lg font-bold ${getLevelColor(userStats.level)}`}>
                {getLevelName(userStats.level)}
              </span>
              <p className="text-sm text-muted-foreground font-normal">
                {userStats.totalPoints} {isRTL ? 'نقطة' : 'points'}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{isRTL ? 'التقدم للمستوى التالي' : 'Progress to next level'}</span>
              <span className="font-medium">
                {userStats.nextLevelPoints - userStats.totalPoints} {isRTL ? 'نقطة متبقية' : 'points to go'}
              </span>
            </div>
            <Progress value={userStats.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {isRTL ? 'الإنجازات الأخيرة' : 'Recent Achievements'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`p-2 rounded-full ${getAchievementColor(achievement.achievement_level)}`}>
                      {getAchievementIcon(achievement.icon_name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{achievement.title}</span>
                        <Badge className={getAchievementColor(achievement.achievement_level)} variant="secondary">
                          {achievement.achievement_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-primary font-medium">
                        +{achievement.points_earned} {isRTL ? 'نقطة' : 'points'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{isRTL ? 'لا توجد إنجازات بعد' : 'No achievements yet'}</p>
                <p className="text-sm">{isRTL ? 'ابدأ بتقديم أفكارك لكسب النقاط!' : 'Start submitting ideas to earn points!'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        {showLeaderboard && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="w-5 h-5" />
                {isRTL ? 'المتصدرون هذا الشهر' : 'Monthly Leaderboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < 3 ? (
                          index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                        ) : (
                          entry.rank_position || index + 1
                        )}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={entry.profiles?.profile_image_url} />
                        <AvatarFallback>
                          {(isRTL ? entry.profiles?.name_ar : entry.profiles?.name)?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {isRTL ? entry.profiles?.name_ar : entry.profiles?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.total_points} {isRTL ? 'نقطة' : 'pts'} • {entry.ideas_submitted} {isRTL ? 'فكرة' : 'ideas'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Medal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{isRTL ? 'لا توجد بيانات للمتصدرين' : 'No leaderboard data'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}