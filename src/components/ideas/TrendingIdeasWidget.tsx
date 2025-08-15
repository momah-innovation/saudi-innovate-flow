import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { 
  TrendingUp, Flame, Eye, Heart, MessageSquare, 
  Star, Trophy, Zap, ArrowRight, ArrowLeft 
} from 'lucide-react';

interface TrendingIdea {
  id: string;
  title_ar: string;
  description_ar: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  overall_score: number;
  status: string;
  maturity_level: string;
  created_at: string;
  innovators?: {
    id: string;
    user_id: string;
  };
  profile?: {
    name: string;
    name_ar: string;
    profile_image_url?: string;
  };
}

interface TrendingIdeasWidgetProps {
  className?: string;
  onIdeaClick?: (idea: TrendingIdea) => void;
}

export function TrendingIdeasWidget({ className, onIdeaClick }: TrendingIdeasWidgetProps) {
  const { isRTL } = useDirection();
  const [trendingIdeas, setTrendingIdeas] = useState<TrendingIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingIdeas();
  }, []);

  const loadTrendingIdeas = async () => {
    try {
      setLoading(true);

      // Get ideas with highest engagement in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          innovators!ideas_innovator_id_fkey(
            id,
            user_id
          )
        `)
        .neq('status', 'draft')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('view_count', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Fetch user profiles for innovators
      const ideasWithProfiles = await Promise.all(
        (data || []).map(async (idea) => {
          if (idea.innovators?.user_id) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('name, name_ar, profile_image_url')
              .eq('id', idea.innovators.user_id)
              .maybeSingle();
            
            return { ...idea, profile };
          }
          return idea;
        })
      );

      setTrendingIdeas(ideasWithProfiles);
    } catch (error) {
      logger.error('Failed to load trending ideas', { 
        component: 'TrendingIdeasWidget', 
        action: 'loadTrendingIdeas' 
      }, error as Error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 1: return <Star className="w-4 h-4 text-gray-400" />;
      case 2: return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <Flame className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'under_review': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'in_development': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'implemented': return 'bg-green-500/10 text-green-600 border-green-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'معتمدة';
      case 'under_review': return 'قيد المراجعة';
      case 'in_development': return 'قيد التطوير';
      case 'implemented': return 'منفذة';
      case 'submitted': return 'مُقدمة';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">الأفكار الرائجة</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">الأفكار الرائجة</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            آخر 7 أيام
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {trendingIdeas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد أفكار رائجة حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingIdeas.map((idea, index) => (
              <div 
                key={idea.id}
                className="group p-3 rounded-lg border hover:border-primary/20 hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => onIdeaClick?.(idea)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    {getTrendingIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {idea.title_ar}
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {idea.description_ar}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        {idea.profile && (
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={idea.profile.profile_image_url} />
                            <AvatarFallback className="text-xs">
                              {(idea.profile.name_ar || idea.profile.name)?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {idea.profile?.name_ar || idea.profile?.name || 'مبتكر'}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className={`text-xs ${getStatusColor(idea.status)}`}>
                        {getStatusText(idea.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{idea.view_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{idea.like_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{idea.comment_count}</span>
                      </div>
                      {idea.overall_score > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{idea.overall_score.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}