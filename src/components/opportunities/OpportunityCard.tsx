import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { LikeOpportunityButton } from './LikeOpportunityButton';
import { ShareOpportunityDialog } from './ShareOpportunityDialog';
import { BookmarkOpportunityButton } from './BookmarkOpportunityButton';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  DollarSign,
  Eye,
  Users,
  TrendingUp,
  Share2
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: {
    id: string;
    title_ar: string;
    title_en?: string;
    description_ar: string;
    description_en?: string;
    opportunity_type: string;
    status: string;
    priority_level?: string;
    budget_min?: number;
    budget_max?: number;
    deadline: string;
    location?: string;
    image_url?: string;
    created_at: string;
  };
  onView?: (opportunity: any) => void;
  onEdit?: (opportunity: any) => void;
  onDelete?: (opportunity: any) => void;
  showActions?: boolean;
}

export const OpportunityCard = ({
  opportunity,
  onView,
  onEdit,
  onDelete,
  showActions = true
}: OpportunityCardProps) => {
  const { isRTL } = useDirection();
  const [analytics, setAnalytics] = useState({
    views: 0,
    likes: 0,
    applications: 0
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {/* Image Section */}
      {opportunity.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={opportunity.image_url.startsWith('http') 
              ? opportunity.image_url 
              : `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${opportunity.image_url}`
            } 
            alt={isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(opportunity.status)}>
              {isRTL ? 
                (opportunity.status === 'open' ? 'مفتوح' : 
                 opportunity.status === 'closed' ? 'مغلق' : 'متوقف') :
                opportunity.status
              }
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              {!opportunity.image_url && (
                <Badge className={getStatusColor(opportunity.status)}>
                  {isRTL ? 
                    (opportunity.status === 'open' ? 'مفتوح' : 
                     opportunity.status === 'closed' ? 'مغلق' : 'متوقف') :
                    opportunity.status
                  }
                </Badge>
              )}
              <Badge className={getPriorityColor(opportunity.priority_level)}>
                {isRTL ? 
                  (opportunity.priority_level === 'high' ? 'عالي' : 
                   opportunity.priority_level === 'medium' ? 'متوسط' : 
                   opportunity.priority_level === 'low' ? 'منخفض' : 'عادي') :
                  (opportunity.priority_level || 'normal')
                } {isRTL ? 'الأولوية' : 'Priority'}
              </Badge>
            </div>
          </div>
          
          {/* Interactive Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <LikeOpportunityButton
              opportunityId={opportunity.id}
              variant="ghost"
              size="sm"
              showCount={false}
            />
            <BookmarkOpportunityButton
              opportunityId={opportunity.id}
              variant="ghost"
              size="sm"
              showText={false}
            />
            <ShareOpportunityDialog
              opportunityId={opportunity.id}
              opportunityTitle={isRTL ? opportunity.title_ar : (opportunity.title_en || opportunity.title_ar)}
            >
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </ShareOpportunityDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {isRTL ? opportunity.description_ar : (opportunity.description_en || opportunity.description_ar)}
        </p>

        {/* Key Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>{formatBudget(opportunity.budget_min, opportunity.budget_max)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{isRTL ? 'الموعد النهائي:' : 'Deadline:'} {formatDate(opportunity.deadline)}</span>
          </div>
          
          {opportunity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{opportunity.location}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{analytics.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{analytics.applications}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onView && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onView(opportunity)}
                className="flex-1"
              >
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(opportunity)}
              >
                {isRTL ? 'تعديل' : 'Edit'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};