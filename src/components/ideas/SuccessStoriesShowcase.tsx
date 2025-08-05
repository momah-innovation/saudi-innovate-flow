import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Star, ExternalLink, Calendar, TrendingUp, DollarSign,
  Users, Target, Rocket, CheckCircle, Award
} from 'lucide-react';

interface SuccessStory {
  id: string;
  idea_id: string;
  title: string;
  summary: string;
  detailed_story: string;
  implementation_timeline: any;
  roi_metrics: any;
  impact_areas: any;
  testimonials: any;
  media_urls: any;
  featured_image_url: string;
  status: string;
  published_at: string;
  created_at: string;
  ideas?: {
    title_ar: string;
    innovators?: {
      profiles?: {
        name: string;
        name_ar: string;
        profile_image_url?: string;
      } | null;
    } | null;
  } | null;
}

interface SuccessStoriesShowcaseProps {
  limit?: number;
  showHeader?: boolean;
}

export function SuccessStoriesShowcase({ limit = 6, showHeader = true }: SuccessStoriesShowcaseProps) {
  const { isRTL } = useDirection();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuccessStories();
  }, []);

  const loadSuccessStories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('innovation_success_stories')
        .select(`
          *,
          ideas(
            title_ar,
            innovators(
              profiles(name, name_ar, profile_image_url)
            )
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setStories((data as any) || []);
    } catch (error) {
      console.error('Error loading success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (story: SuccessStory) => {
    setSelectedStory(story);
    setDetailDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderROIMetric = (metric: any) => {
    if (!metric) return null;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
        {metric.cost_savings && (
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{metric.cost_savings}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'توفير في التكاليف' : 'Cost Savings'}</div>
          </div>
        )}
        {metric.revenue_increase && (
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metric.revenue_increase}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'زيادة الإيرادات' : 'Revenue Increase'}</div>
          </div>
        )}
        {metric.efficiency_gain && (
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{metric.efficiency_gain}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'تحسن الكفاءة' : 'Efficiency Gain'}</div>
          </div>
        )}
        {metric.time_saved && (
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{metric.time_saved}</div>
            <div className="text-sm text-muted-foreground">{isRTL ? 'توفير الوقت' : 'Time Saved'}</div>
          </div>
        )}
      </div>
    );
  };

  const renderTimelineStep = (step: any, index: number) => (
    <div key={index} className="flex gap-4 pb-6">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
          {index + 1}
        </div>
        {index < (selectedStory?.implementation_timeline?.length - 1) && (
          <div className="w-0.5 h-12 bg-primary/30 mt-2"></div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{step.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
        <Badge variant="outline" className="text-xs">
          {step.duration || step.date}
        </Badge>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted"></div>
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
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Award className="w-6 h-6" />
            {isRTL ? 'قصص النجاح الابتكارية' : 'Innovation Success Stories'}
          </h2>
          <p className="text-muted-foreground">
            {isRTL ? 
              'اكتشف كيف تحولت الأفكار الابتكارية إلى حلول ناجحة وأثرت بشكل إيجابي' :
              'Discover how innovative ideas transformed into successful solutions with positive impact'
            }
          </p>
        </div>
      )}

      {stories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={story.featured_image_url || '/idea-images/success-story-1.jpg'} 
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute top-4 right-4">
                   <Badge className="bg-success text-white border-0">
                     <CheckCircle className="w-3 h-3 mr-1" />
                     {isRTL ? 'منفذة' : 'Implemented'}
                   </Badge>
                 </div>
                 <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold line-clamp-2">{story.title}</h3>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(story.published_at)}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {story.summary}
                </p>

                {/* Quick Impact Metrics */}
                {story.roi_metrics && (
                  <div className="flex justify-between text-xs">
                    {story.roi_metrics.cost_savings && (
                      <div className="text-center">
                        <div className="font-semibold text-success">{story.roi_metrics.cost_savings}</div>
                        <div className="text-muted-foreground">{isRTL ? 'توفير' : 'Saved'}</div>
                      </div>
                    )}
                    {story.roi_metrics.efficiency_gain && (
                      <div className="text-center">
                        <div className="font-semibold text-primary">{story.roi_metrics.efficiency_gain}</div>
                        <div className="text-muted-foreground">{isRTL ? 'كفاءة' : 'Efficiency'}</div>
                      </div>
                    )}
                    {story.impact_areas && story.impact_areas.length > 0 && (
                      <div className="text-center">
                        <div className="font-semibold text-accent">{story.impact_areas.length}</div>
                        <div className="text-muted-foreground">{isRTL ? 'مجالات' : 'Areas'}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Innovator Info */}
                {story.ideas?.innovators?.profiles && (
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={story.ideas.innovators.profiles.profile_image_url} />
                      <AvatarFallback className="text-xs">
                        {(isRTL ? story.ideas.innovators.profiles.name_ar : story.ideas.innovators.profiles.name)?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {isRTL ? story.ideas.innovators.profiles.name_ar : story.ideas.innovators.profiles.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{isRTL ? 'المبتكر' : 'Innovator'}</p>
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => handleViewDetails(story)}
                >
                  <ExternalLink className="w-4 h-4" />
                  {isRTL ? 'قراءة القصة كاملة' : 'Read Full Story'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {isRTL ? 'لا توجد قصص نجاح بعد' : 'No Success Stories Yet'}
          </h3>
          <p className="text-muted-foreground">
            {isRTL ? 
              'ستظهر قصص النجاح هنا عند تنفيذ الأفكار الابتكارية' :
              'Success stories will appear here as innovative ideas get implemented'
            }
          </p>
        </div>
      )}

      {/* Success Story Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedStory.title}</DialogTitle>
                <p className="text-muted-foreground">{selectedStory.summary}</p>
              </DialogHeader>

              <div className="space-y-6">
                {/* Hero Image */}
                {selectedStory.featured_image_url && (
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <img 
                      src={selectedStory.featured_image_url} 
                      alt={selectedStory.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Detailed Story */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    {isRTL ? 'القصة التفصيلية' : 'Detailed Story'}
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed">{selectedStory.detailed_story}</p>
                  </div>
                </div>

                {/* ROI Metrics */}
                {selectedStory.roi_metrics && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {isRTL ? 'مؤشرات الأداء والعائد' : 'ROI & Impact Metrics'}
                    </h3>
                    {renderROIMetric(selectedStory.roi_metrics)}
                  </div>
                )}

                {/* Implementation Timeline */}
                {selectedStory.implementation_timeline && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {isRTL ? 'جدول زمني للتنفيذ' : 'Implementation Timeline'}
                    </h3>
                    <div className="space-y-4">
                      {selectedStory.implementation_timeline.map(renderTimelineStep)}
                    </div>
                  </div>
                )}

                {/* Testimonials */}
                {selectedStory.testimonials && selectedStory.testimonials.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {isRTL ? 'شهادات وآراء' : 'Testimonials'}
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {selectedStory.testimonials.map((testimonial: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={testimonial.avatar} />
                              <AvatarFallback>{testimonial.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
                              <div className="text-xs text-muted-foreground">
                                <div className="font-medium">{testimonial.name}</div>
                                <div>{testimonial.position}</div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}