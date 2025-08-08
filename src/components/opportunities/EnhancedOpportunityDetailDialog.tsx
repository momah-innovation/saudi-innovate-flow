import { useState, useEffect } from 'react';
import { Application, Comment } from '@/types/opportunities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDirection } from '@/components/ui/direction-provider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  Calendar,
  Trophy,
  Handshake,
  Send,
  Bookmark,
  Clock,
  Star,
  Share2,
  MapPin,
  Building2,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-react';

interface OpportunityDetailDialogProps {
  opportunity: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: (opportunity: any) => void;
  onBookmark?: (opportunity: any) => void;
}

export const EnhancedOpportunityDetailDialog = ({
  opportunity,
  open,
  onOpenChange,
  onApply,
  onBookmark
}: OpportunityDetailDialogProps) => {
  const { isRTL } = useDirection();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isApplied, setIsApplied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (opportunity && user) {
      checkApplicationStatus();
      checkBookmarkStatus();
      checkLikeStatus();
      loadApplications();
      loadComments();
      loadLikes();
    }
  }, [opportunity, user]);

  const checkApplicationStatus = async () => {
    if (!user || !opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_applications')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('applicant_id', user.id)
        .maybeSingle();
      
      setIsApplied(!!data);
    } catch (error) {
      // Application status check failed - continue without blocking UI
    }
  };

  const checkBookmarkStatus = async () => {
    if (!user || !opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_bookmarks')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsBookmarked(!!data);
    } catch (error) {
      // Bookmark status check failed - continue without blocking UI
    }
  };

  const checkLikeStatus = async () => {
    if (!user || !opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_likes')
        .select('id')
        .eq('opportunity_id', opportunity.id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsLiked(!!data);
    } catch (error) {
      // Like status check failed - continue without blocking UI
    }
  };

  const loadApplications = async () => {
    if (!opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_applications')
        .select('*')
        .eq('opportunity_id', opportunity.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      setApplications((data as Application[]) || []);
    } catch (error) {
      // Applications loading failed - continue without blocking UI
    }
  };

  const loadComments = async () => {
    if (!opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_comments')
        .select('*')
        .eq('opportunity_id', opportunity.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      setComments((data as Comment[]) || []);
    } catch (error) {
      // Comments loading failed - continue without blocking UI
    }
  };

  const loadLikes = async () => {
    if (!opportunity) return;
    
    try {
      const { data } = await supabase
        .from('opportunity_likes')
        .select('id')
        .eq('opportunity_id', opportunity.id);
      
      setLikes(data?.length || 0);
    } catch (error) {
      // Likes loading failed - continue without blocking UI
    }
  };

  const handleLike = async () => {
    if (!user || !opportunity) return;

    try {
      if (isLiked) {
        await supabase
          .from('opportunity_likes')
          .delete()
          .eq('opportunity_id', opportunity.id)
          .eq('user_id', user.id);
        
        setIsLiked(false);
        setLikes(prev => prev - 1);
      } else {
        await supabase
          .from('opportunity_likes')
          .insert({
            opportunity_id: opportunity.id,
            user_id: user.id
          });
        
        setIsLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    }
  };

  const getDaysRemaining = () => {
    if (!opportunity.deadline) return null;
    const now = new Date();
    const deadline = new Date(opportunity.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getProgressPercentage = () => {
    if (!opportunity.created_at || !opportunity.deadline) return 0;
    const start = new Date(opportunity.created_at);
    const end = new Date(opportunity.deadline);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (current / total) * 100));
  };

  const formatBudgetRange = () => {
    if (!opportunity.budget_min && !opportunity.budget_max) return isRTL ? 'حسب التفاوض' : 'Negotiable';
    if (!opportunity.budget_max) return `${opportunity.budget_min?.toLocaleString()}+ ${isRTL ? 'ر.س' : 'SAR'}`;
    if (!opportunity.budget_min) return `${isRTL ? 'حتى' : 'Up to'} ${opportunity.budget_max?.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}`;
    return `${opportunity.budget_min?.toLocaleString()} - ${opportunity.budget_max?.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}`;
  };

  if (!opportunity) return null;

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        {/* Header with Hero Image */}
        <div className="relative h-48 gradient-primary overflow-hidden">
          {opportunity.image_url && (
            <img 
              src={opportunity.image_url.startsWith('http') 
                ? opportunity.image_url 
                : `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${opportunity.image_url}`
              } 
              alt={opportunity.title_ar}
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white">
              {opportunity.status === 'open' ? (isRTL ? 'مفتوحة' : 'Open') : opportunity.status}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleLike}
              className={`bg-white/20 backdrop-blur-sm hover:bg-white/30 ${isLiked ? 'text-red-500' : 'text-white'}`}
            >
              <Star className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onBookmark?.(opportunity)}
              className={`backdrop-blur-sm ${
                isBookmarked 
                  ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Title and Key Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl font-bold mb-2">{opportunity.title_ar}</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {daysRemaining !== null && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{daysRemaining} {isRTL ? 'يوم متبقي' : 'days left'}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{applications.length} {isRTL ? 'طلب' : 'applications'}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatBudgetRange()}</span>
              </div>
              {opportunity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{opportunity.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {opportunity.created_at && opportunity.deadline && (
          <div className="px-6 pt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{isRTL ? 'تقدم الفرصة' : 'Opportunity Progress'}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
              <TabsTrigger value="requirements">{isRTL ? 'المتطلبات' : 'Requirements'}</TabsTrigger>
              <TabsTrigger value="benefits">{isRTL ? 'المزايا' : 'Benefits'}</TabsTrigger>
              <TabsTrigger value="applications">{isRTL ? 'الطلبات' : 'Applications'}</TabsTrigger>
              <TabsTrigger value="comments">{isRTL ? 'التعليقات' : 'Comments'}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {isRTL ? 'وصف الفرصة' : 'Opportunity Description'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{opportunity.description_ar}</p>
                </CardContent>
              </Card>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{isRTL ? 'نوع الفرصة' : 'Type'}</div>
                        <div className="font-medium">{opportunity.opportunity_type}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Priority */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{isRTL ? 'الأولوية' : 'Priority'}</div>
                        <div className="font-medium capitalize">{opportunity.priority_level || 'medium'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                {opportunity.contact_person && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{isRTL ? 'جهة الاتصال' : 'Contact'}</div>
                          <div className="font-medium">{opportunity.contact_person}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Organization Details */}
              {(opportunity.sector || opportunity.department) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {isRTL ? 'الجهة المسؤولة' : 'Responsible Organization'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {opportunity.sector && (
                        <div>
                          <span className="font-medium">{isRTL ? 'القطاع: ' : 'Sector: '}</span>
                          <span>{isRTL ? opportunity.sector.name_ar : opportunity.sector.name}</span>
                        </div>
                      )}
                      {opportunity.department && (
                        <div>
                          <span className="font-medium">{isRTL ? 'الإدارة: ' : 'Department: '}</span>
                          <span>{isRTL ? opportunity.department.name_ar : opportunity.department.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success Metrics */}
              {opportunity.success_metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      {isRTL ? 'مؤشرات النجاح' : 'Success Metrics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{opportunity.success_metrics}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'متطلبات التقديم' : 'Application Requirements'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunity.requirements && Array.isArray(opportunity.requirements) ? (
                    <ul className="space-y-2">
                      {opportunity.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">{isRTL ? 'لم يتم تحديد متطلبات محددة.' : 'No specific requirements defined.'}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'المزايا والفوائد' : 'Benefits & Advantages'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {opportunity.benefits && Array.isArray(opportunity.benefits) ? (
                    <ul className="space-y-2">
                      {opportunity.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">{isRTL ? 'لم يتم تحديد مزايا محددة.' : 'No specific benefits defined.'}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'الطلبات المقدمة' : 'Recent Applications'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div key={app.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{(app.organization_name as string) || 'Individual Application'}</div>
                              <div className="text-sm text-muted-foreground">{app.contact_person as string}</div>
                            </div>
                            <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                              {app.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isRTL ? 'لا توجد طلبات مقدمة بعد.' : 'No applications submitted yet.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {isRTL ? 'التعليقات' : 'Comments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-3 border rounded-lg">
                          <div className="text-sm">{comment.content}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isRTL ? 'لا توجد تعليقات بعد.' : 'No comments yet.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            {!isApplied && opportunity.status === 'open' ? (
              <Button
                onClick={() => onApply?.(opportunity)}
                className="flex-1"
              >
                <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تقدم للفرصة' : 'Apply for Opportunity'}
              </Button>
            ) : isApplied ? (
              <Button variant="secondary" className="flex-1" disabled>
                <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تم التقديم' : 'Application Submitted'}
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" disabled>
                <AlertCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'مغلقة للتقديم' : 'Closed for Applications'}
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => onBookmark?.(opportunity)}
              className={isBookmarked ? 'border-red-500 text-red-500' : ''}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};