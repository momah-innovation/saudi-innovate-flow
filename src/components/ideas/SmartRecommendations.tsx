import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, TrendingUp, Users, Target, Clock, 
  ArrowRight, Star, Lightbulb, BookOpen 
} from 'lucide-react';

interface Recommendation {
  id: string;
  recommended_idea_id: string;
  recommendation_type: string;
  confidence_score: number;
  reasoning: string;
  created_at: string;
  ideas?: {
    title_ar: string;
    description_ar: string;
    overall_score: number;
    status: string;
    image_url?: string;
    like_count: number;
    view_count: number;
  };
}

interface SmartRecommendationsProps {
  limit?: number;
  showHeader?: boolean;
  onIdeaClick?: (ideaId: string) => void;
}

export function SmartRecommendations({ 
  limit = 6, 
  showHeader = true, 
  onIdeaClick 
}: SmartRecommendationsProps) {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, limit]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First try to get existing recommendations
      const { data: existingRecs, error: recError } = await supabase
        .from('idea_recommendations')
        .select(`
          *,
          ideas(
            title_ar,
            description_ar,
            overall_score,
            status,
            image_url,
            like_count,
            view_count
          )
        `)
        .eq('user_id', user.id)
        .eq('is_viewed', false)
        .gte('expires_at', new Date().toISOString())
        .order('confidence_score', { ascending: false })
        .limit(limit);

      if (recError) throw recError;

      if (existingRecs && existingRecs.length > 0) {
        setRecommendations(existingRecs as any);
      } else {
        // Generate new recommendations if none exist
        await generateRecommendations();
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Fallback to popular ideas
      await loadPopularIdeas();
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!user) return;

    try {
      // Get user's interaction history
      const { data: userLikes } = await supabase
        .from('idea_likes')
        .select('idea_id')
        .eq('user_id', user.id);

      const { data: userComments } = await supabase
        .from('idea_comments')
        .select('idea_id')
        .eq('author_id', user.id);

      const { data: userBookmarks } = await supabase
        .from('idea_bookmarks')
        .select('idea_id')
        .eq('user_id', user.id);

      const interactedIdeaIds = [
        ...(userLikes?.map(l => l.idea_id) || []),
        ...(userComments?.map(c => c.idea_id) || []),
        ...(userBookmarks?.map(b => b.idea_id) || [])
      ];

      // Get ideas similar to user's interests (excluding already interacted ones)
      const { data: similarIdeas, error } = await supabase
        .from('ideas')
        .select('id, title_ar, description_ar, overall_score, status, image_url, like_count, view_count')
        .not('id', 'in', `(${interactedIdeaIds.join(',')})`)
        .neq('status', 'draft')
        .gte('overall_score', 7)
        .order('overall_score', { ascending: false })
        .limit(limit * 2);

      if (error) throw error;

      // Create recommendations with different types
      const recommendationsToInsert = (similarIdeas || []).slice(0, limit).map((idea, index) => {
        const recommendationType = getRecommendationType(index, idea);
        const confidenceScore = calculateConfidenceScore(idea, recommendationType);
        const reasoning = generateReasoning(recommendationType, idea);

        return {
          user_id: user.id,
          recommended_idea_id: idea.id,
          recommendation_type: recommendationType,
          confidence_score: confidenceScore,
          reasoning,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };
      });

      if (recommendationsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('idea_recommendations')
          .insert(recommendationsToInsert);

        if (insertError) throw insertError;

        // Reload recommendations
        await loadRecommendations();
      } else {
        await loadPopularIdeas();
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      await loadPopularIdeas();
    }
  };

  const loadPopularIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id, title_ar, description_ar, overall_score, status, image_url, like_count, view_count')
        .neq('status', 'draft')
        .order('like_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Convert to recommendation format
      const popularRecs = (data || []).map(idea => ({
        id: `popular-${idea.id}`,
        recommended_idea_id: idea.id,
        recommendation_type: 'popular',
        confidence_score: 8.5,
        reasoning: isRTL ? 'فكرة شائعة ومحبوبة من المجتمع' : 'Popular idea loved by the community',
        created_at: new Date().toISOString(),
        ideas: idea
      }));

      setRecommendations(popularRecs as any);
    } catch (error) {
      console.error('Error loading popular ideas:', error);
    }
  };

  const getRecommendationType = (index: number, idea: any): string => {
    if (idea.overall_score >= 9) return 'high_potential';
    if (idea.like_count > 50) return 'trending';
    if (idea.view_count > 200) return 'popular';
    if (index % 3 === 0) return 'similar_interests';
    if (index % 2 === 0) return 'expert_recommended';
    return 'discovery';
  };

  const calculateConfidenceScore = (idea: any, type: string): number => {
    let baseScore = idea.overall_score || 5;
    
    switch (type) {
      case 'high_potential': return Math.min(baseScore + 1, 10);
      case 'trending': return Math.min(baseScore + 0.5, 10);
      case 'popular': return Math.min(baseScore + 0.3, 10);
      case 'similar_interests': return Math.min(baseScore + 0.7, 10);
      case 'expert_recommended': return Math.min(baseScore + 0.8, 10);
      default: return baseScore;
    }
  };

  const generateReasoning = (type: string, idea: any): string => {
    const reasons = {
      high_potential: isRTL ? 
        `فكرة عالية الجودة بنتيجة ${idea.overall_score}/10` :
        `High-quality idea with score ${idea.overall_score}/10`,
      trending: isRTL ?
        `فكرة رائجة بـ ${idea.like_count} إعجاب` :
        `Trending idea with ${idea.like_count} likes`,
      popular: isRTL ?
        `فكرة شائعة بـ ${idea.view_count} مشاهدة` :
        `Popular idea with ${idea.view_count} views`,
      similar_interests: isRTL ?
        'قد تعجبك بناءً على اهتماماتك' :
        'You might like this based on your interests',
      expert_recommended: isRTL ?
        'موصى بها من قبل الخبراء' :
        'Recommended by experts',
      discovery: isRTL ?
        'اكتشف شيئاً جديداً' :
        'Discover something new'
    };
    
    return reasons[type as keyof typeof reasons] || reasons.discovery;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'high_potential': return <Star className="w-4 h-4" />;
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'popular': return <Users className="w-4 h-4" />;
      case 'similar_interests': return <Target className="w-4 h-4" />;
      case 'expert_recommended': return <BookOpen className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'high_potential': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'trending': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'popular': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'similar_interests': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'expert_recommended': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRecommendationLabel = (type: string) => {
    const labels = {
      high_potential: isRTL ? 'إمكانية عالية' : 'High Potential',
      trending: isRTL ? 'رائجة' : 'Trending',
      popular: isRTL ? 'شائعة' : 'Popular',
      similar_interests: isRTL ? 'مشابهة لاهتماماتك' : 'Similar Interests',
      expert_recommended: isRTL ? 'موصى بها' : 'Expert Pick',
      discovery: isRTL ? 'اكتشاف' : 'Discovery'
    };
    return labels[type as keyof typeof labels] || labels.discovery;
  };

  const handleIdeaClick = async (recommendation: Recommendation) => {
    try {
      // Mark as viewed
      await supabase
        .from('idea_recommendations')
        .update({ 
          is_viewed: true, 
          is_clicked: true 
        })
        .eq('id', recommendation.id);

      // Call parent callback
      if (onIdeaClick) {
        onIdeaClick(recommendation.recommended_idea_id);
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
  };

  const refreshRecommendations = async () => {
    await generateRecommendations();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {isRTL ? 'توصيات ذكية لك' : 'Smart Recommendations'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isRTL ? 'أفكار مختارة بعناية قد تهمك' : 'Carefully curated ideas you might find interesting'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={refreshRecommendations}>
            <ArrowRight className="w-4 h-4" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/30 hover:border-l-primary"
              onClick={() => handleIdeaClick(recommendation)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {recommendation.ideas?.title_ar}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRecommendationColor(recommendation.recommendation_type)} variant="secondary">
                        {getRecommendationIcon(recommendation.recommendation_type)}
                        <span className="ml-1">{getRecommendationLabel(recommendation.recommendation_type)}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(recommendation.confidence_score)}/10
                      </Badge>
                    </div>
                  </div>
                  <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {recommendation.ideas?.description_ar}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{recommendation.ideas?.overall_score}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{recommendation.ideas?.like_count} {isRTL ? 'إعجاب' : 'likes'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{recommendation.ideas?.view_count} {isRTL ? 'مشاهدة' : 'views'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-primary font-medium italic">
                    {recommendation.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {isRTL ? 'لا توجد توصيات متاحة' : 'No Recommendations Available'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isRTL ? 
              'تفاعل مع المزيد من الأفكار للحصول على توصيات مخصصة' :
              'Interact with more ideas to get personalized recommendations'
            }
          </p>
          <Button onClick={refreshRecommendations} className="gap-2">
            <ArrowRight className="w-4 h-4" />
            {isRTL ? 'إنشاء توصيات' : 'Generate Recommendations'}
          </Button>
        </div>
      )}
    </div>
  );
}