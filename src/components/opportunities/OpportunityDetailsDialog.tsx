import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ShareOpportunityDialog } from './ShareOpportunityDialog';
import { BookmarkOpportunityButton } from './BookmarkOpportunityButton';
import { LikeOpportunityButton } from './LikeOpportunityButton';
import { supabase } from '@/integrations/supabase/client';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import { useViewTracking } from '@/hooks/useViewTracking';
import { 
  Building2, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  Target,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  TrendingUp,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';

interface OpportunityDetailsDialogProps {
  opportunityId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OpportunityDetails {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  priority_level: string;
  budget_min?: number;
  budget_max?: number;
  deadline: string;
  location: string;
  contact_person: string;
  contact_email: string;
  contact_phone?: string;
  image_url?: string;
  requirements: any;
  benefits: any;
  created_at: string;
  updated_at: string;
  applications_count?: number;
  views_count?: number;
  likes_count?: number;
}

export const OpportunityDetailsDialog = ({
  opportunityId,
  open,
  onOpenChange
}: OpportunityDetailsDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [opportunity, setOpportunity] = useState<OpportunityDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<number>(Date.now());
  const [sessionId] = useState<string>(() => 
    sessionStorage.getItem('opportunity-session') || 
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('opportunity-session', id);
      return id;
    })()
  );

  // View tracking and analytics hooks
  const { trackCustomEvent } = useViewTracking({
    opportunityId,
    enabled: open && !!opportunityId
  });

  // Real-time analytics hook
  const { analytics } = useRealTimeAnalytics({
    opportunityId,
    onAnalyticsUpdate: (newAnalytics) => {
      if (opportunity) {
        setOpportunity(prev => prev ? {
          ...prev,
          views_count: newAnalytics.view_count || prev.views_count,
          likes_count: newAnalytics.like_count || prev.likes_count,
          applications_count: newAnalytics.application_count || prev.applications_count
        } : null);
      }
    }
  });

  useEffect(() => {
    if (open && opportunityId) {
      setViewStartTime(Date.now());
      loadOpportunityDetails();
      trackView();
    }
  }, [open, opportunityId]);

  // Track time spent when dialog closes
  useEffect(() => {
    if (!open && opportunityId && viewStartTime) {
      const timeSpent = Math.floor((Date.now() - viewStartTime) / 1000);
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        trackViewTimeSpent(timeSpent);
      }
    }
  }, [open]);

  const trackView = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          action: 'view',
          userId: user.user?.id,
          sessionId,
          metadata: { source: 'details_dialog' }
        }
      });
    } catch (error) {
      // View tracking failed - continue without blocking UI
    }
  };

  const trackViewTimeSpent = async (timeSpent: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          opportunityId,
          action: 'view',
          userId: user.user?.id,
          sessionId,
          timeSpent,
          metadata: { source: 'details_dialog', action: 'time_spent' }
        }
      });
    } catch (error) {
      // Time tracking failed - continue without blocking UI
    }
  };

  const loadOpportunityDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', opportunityId)
        .maybeSingle();

      if (error) throw error;

      // Get analytics data separately
      const { data: analyticsData } = await supabase
        .from('opportunity_analytics')
        .select('view_count, like_count, application_count')
        .eq('opportunity_id', opportunityId)
        .single();

      // Get applications count
      const { count: applicationsCount } = await supabase
        .from('opportunity_applications')
        .select('*', { count: 'exact', head: true })
        .eq('opportunity_id', opportunityId);

      const processedData: OpportunityDetails = {
        ...data,
        opportunity_type: data.opportunity_type || 'project',
        priority_level: 'medium',
        contact_person: 'Contact Person',
        contact_email: 'contact@example.com',
        benefits: data.qualifications,
        applications_count: applicationsCount || 0,
        views_count: analyticsData?.view_count || 0,
        likes_count: analyticsData?.like_count || 0
      };

      setOpportunity(processedData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return isRTL ? 'غير محدد' : 'Not specified';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${isRTL ? 'ريال' : 'SAR'}`;
    if (min) return `${isRTL ? 'من' : 'From'} ${min.toLocaleString()} ${isRTL ? 'ريال' : 'SAR'}`;
    if (max) return `${isRTL ? 'حتى' : 'Up to'} ${max.toLocaleString()} ${isRTL ? 'ريال' : 'SAR'}`;
    return isRTL ? 'غير محدد' : 'Not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!opportunity) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {isRTL ? 'لم يتم العثور على الفرصة' : 'Opportunity not found'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {isRTL ? 'تفاصيل الفرصة' : 'Opportunity Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section with Image */}
          <Card>
            {/* Image Section */}
            {opportunity.image_url && (
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={opportunity.image_url.startsWith('http') 
                    ? opportunity.image_url 
                    : `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${opportunity.image_url}`
                  } 
                  alt={isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">
                    {isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getStatusColor(opportunity.status)}>
                      {isRTL ? 
                        (opportunity.status === 'open' ? 'مفتوح' : 
                         opportunity.status === 'closed' ? 'مغلق' : 'متوقف') :
                        opportunity.status
                      }
                    </Badge>
                    <Badge className={getPriorityColor(opportunity.priority_level)}>
                      {isRTL ? 
                        (opportunity.priority_level === 'high' ? 'عالي' : 
                         opportunity.priority_level === 'medium' ? 'متوسط' : 'منخفض') :
                        opportunity.priority_level
                      } {isRTL ? 'الأولوية' : 'Priority'}
                    </Badge>
                    <Badge variant="outline">
                      {isRTL ? 
                        (opportunity.opportunity_type === 'funding' ? 'تمويل' :
                         opportunity.opportunity_type === 'collaboration' ? 'تعاون' :
                         opportunity.opportunity_type === 'sponsorship' ? 'رعاية' : 'بحث') :
                        opportunity.opportunity_type
                      }
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <LikeOpportunityButton
                    opportunityId={opportunity.id}
                    showCount={true}
                    variant="outline"
                    size="sm"
                  />
                  <ShareOpportunityDialog
                    opportunityId={opportunity.id}
                    opportunityTitle={isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
                  >
                    <Button variant="outline" size="sm">
                      <Share2 className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      {isRTL ? 'مشاركة' : 'Share'}
                    </Button>
                  </ShareOpportunityDialog>
                  <BookmarkOpportunityButton
                    opportunityId={opportunity.id}
                    variant="outline"
                    size="sm"
                    showText={false}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? opportunity.description_ar : (opportunity.description_en || opportunity.description_ar)}
              </p>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{opportunity.applications_count}</p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'طلبات' : 'Applications'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{opportunity.views_count}</p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'مشاهدات' : 'Views'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{opportunity.likes_count}</p>
                    <p className="text-sm text-muted-foreground">{isRTL ? 'إعجابات' : 'Likes'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isRTL ? 'المعلومات الأساسية' : 'Key Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{isRTL ? 'الميزانية:' : 'Budget:'}</span>
                  </div>
                  <p className={`text-muted-foreground ${isRTL ? 'mr-6' : 'ml-6'}`}>
                    {formatBudget(opportunity.budget_min, opportunity.budget_max)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{isRTL ? 'الموعد النهائي:' : 'Deadline:'}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {formatDate(opportunity.deadline)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{isRTL ? 'الموقع:' : 'Location:'}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {opportunity.location || (isRTL ? 'غير محدد' : 'Not specified')}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">{isRTL ? 'تاريخ النشر:' : 'Published:'}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {formatDate(opportunity.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {isRTL ? 'معلومات التواصل' : 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{isRTL ? 'الشخص المسؤول:' : 'Contact Person:'}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">{opportunity.contact_person}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    <a href={`mailto:${opportunity.contact_email}`} className="hover:underline">
                      {opportunity.contact_email}
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements and Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {isRTL ? 'المتطلبات' : 'Requirements'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {typeof opportunity.requirements === 'string' ? opportunity.requirements : 
                   JSON.stringify(opportunity.requirements) || (isRTL ? 'لا توجد متطلبات محددة' : 'No specific requirements')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {isRTL ? 'الفوائد' : 'Benefits'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {typeof opportunity.benefits === 'string' ? opportunity.benefits : 
                   JSON.stringify(opportunity.benefits) || (isRTL ? 'لا توجد فوائد محددة' : 'No specific benefits')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};