import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { 
  CalendarIcon, Handshake, Users, Award, Star, Eye, BookmarkIcon, 
  TrendingUp, Clock, Zap, CheckCircle, AlertCircle, DollarSign, MapPin,
  Building2, Target, MessageSquare, Activity, Wifi, WifiOff
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { getOpportunityImageUrl } from '@/utils/storageUtils';

interface OpportunityData {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  deadline: string;
  created_at?: string;
  applications_count?: number;
  budget_min?: number;
  budget_max?: number;
  priority_level?: string;
  image_url?: string;
  trending?: boolean;
  featured?: boolean;
  location?: string;
  contact_person?: string;
  category?: { name_ar: string; name: string; name_en?: string; color?: string; };
  sector?: { name_ar: string; name: string; };
  department?: { name_ar: string; name: string; };
  likes_count?: number;
  views_count?: number;
  requirements?: string | null;
  benefits?: string | null;
}

interface CollaborativeOpportunityCardProps {
  opportunity: OpportunityData;
  onViewDetails: (opportunity: OpportunityData) => void;
  onApply: (opportunity: OpportunityData) => void;
  onBookmark?: (opportunity: OpportunityData) => void;
  onStartCollaboration?: (opportunity: OpportunityData) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  showCollaboration?: boolean;
}

export const CollaborativeOpportunityCard = ({ 
  opportunity, 
  onViewDetails, 
  onApply, 
  onBookmark,
  onStartCollaboration,
  viewMode = 'cards',
  showCollaboration = true
}: CollaborativeOpportunityCardProps) => {
  const { isRTL } = useDirection();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liveApplications, setLiveApplications] = useState(opportunity.applications_count || 0);
  const [liveViews, setLiveViews] = useState(opportunity.views_count || 0);
  
  // Collaboration integration
  const { 
    onlineUsers, 
    isConnected, 
    activities,
    startCollaboration,
    endCollaboration 
  } = useCollaboration();

  // Get users currently viewing this opportunity
  const opportunityViewers = onlineUsers.filter(user => 
    user.current_location.page?.includes('opportunity') || user.current_location.entity_type === 'opportunity'
  );

  const recentActivity = activities
    .filter(activity => 
      activity.entity_type === 'opportunity' && 
      activity.entity_id === opportunity.id
    )
    .slice(0, 3);

  useEffect(() => {
    // Simulate real-time updates for applications and views
    const interval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance of update
        const variation = Math.floor(Math.random() * 2); // 0 or 1
        setLiveApplications(prev => prev + variation);
        setLiveViews(prev => prev + Math.floor(Math.random() * 3)); // 0-2 views
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      case 'review': return 'bg-yellow-500 text-white';
      case 'pending': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return isRTL ? 'مفتوحة' : 'Open';
      case 'closed': return isRTL ? 'مغلقة' : 'Closed';
      case 'review': return isRTL ? 'قيد المراجعة' : 'Under Review';
      case 'pending': return isRTL ? 'معلقة' : 'Pending';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return CheckCircle;
      case 'closed': return AlertCircle;
      case 'review': return Clock;
      case 'pending': return Clock;
      default: return Handshake;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sponsorship': return DollarSign;
      case 'collaboration': return Users;
      case 'research': return Target;
      case 'training': return Award;
      default: return Building2;
    }
  };

  const calculateDaysLeft = () => {
    if (!opportunity.deadline) return null;
    const deadline = new Date(opportunity.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatBudgetRange = () => {
    if (!opportunity.budget_min && !opportunity.budget_max) return isRTL ? 'حسب التفاوض' : 'Negotiable';
    if (!opportunity.budget_max) return `${opportunity.budget_min?.toLocaleString()}+ ${isRTL ? 'ر.س' : 'SAR'}`;
    if (!opportunity.budget_min) return `${isRTL ? 'حتى' : 'Up to'} ${opportunity.budget_max?.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}`;
    return `${opportunity.budget_min?.toLocaleString()} - ${opportunity.budget_max?.toLocaleString()} ${isRTL ? 'ر.س' : 'SAR'}`;
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(opportunity);
  };

  const handleStartCollaboration = async () => {
    try {
      await startCollaboration('opportunity', opportunity.id);
      onStartCollaboration?.(opportunity);
    } catch (error) {
      console.error('Failed to start collaboration:', error);
    }
  };

  const daysLeft = calculateDaysLeft();
  const StatusIcon = getStatusIcon(opportunity.status);
  const TypeIcon = getTypeIcon(opportunity.opportunity_type);

  return (
    <Card className="group relative overflow-hidden hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl">
      {/* Enhanced Image Section */}
      <div className="relative h-48 overflow-hidden">
        {opportunity.image_url ? (
          <img 
            src={getOpportunityImageUrl(opportunity.image_url)}
            alt={opportunity.title_ar} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Handshake className="w-16 h-16 text-primary" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Status Badge - Enhanced */}
        <div className="absolute top-3 right-3 flex gap-2">
          {opportunity.priority_level === 'high' && (
            <Badge className="bg-orange-500 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isRTL ? 'مميزة' : 'Featured'}
            </Badge>
          )}
          <Badge className={`${getStatusColor(opportunity.status)} border-0 flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {getStatusText(opportunity.status)}
          </Badge>
        </div>

        {/* Collaboration Status & Live Viewers */}
        {showCollaboration && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Connection Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 flex items-center gap-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs text-white">{opportunityViewers.length}</span>
            </div>
            
            {/* Active Viewers */}
            {opportunityViewers.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex -space-x-1">
                  {opportunityViewers.slice(0, 3).map((user, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-white">
                      <AvatarImage src={user.user_info.avatar_url} />
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {user.user_id?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {opportunityViewers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-white/90 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-700 font-bold">+{opportunityViewers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Days Left Indicator */}
        {daysLeft !== null && daysLeft <= 7 && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysLeft === 0 ? (isRTL ? 'اليوم الأخير' : 'Last Day') : `${daysLeft} ${isRTL ? 'أيام' : 'days'}`}
          </div>
        )}

        {/* Category Badge */}
        {opportunity.category && (
          <div className="absolute bottom-3 left-3">
            <Badge 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm"
              style={{ borderColor: opportunity.category.color }}
            >
              <TypeIcon className="w-3 h-3 mr-1" style={{ color: opportunity.category.color }} />
              {isRTL ? opportunity.category.name_ar : opportunity.category.name_en || opportunity.category.name}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {isRTL ? opportunity.title_ar : opportunity.title_en || opportunity.title_ar}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {isRTL ? opportunity.description_ar : opportunity.description_en || opportunity.description_ar}
            </p>
          </div>
          <Badge className={getPriorityColor(opportunity.priority_level || 'medium')}>
            {opportunity.priority_level || 'medium'}
          </Badge>
        </div>

        {/* Progress Indicator for Active Opportunities */}
        {opportunity.status === 'open' && opportunity.deadline && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{isRTL ? 'الوقت المتبقي' : 'Time Remaining'}</span>
              <span>{daysLeft} {isRTL ? 'أيام' : 'days'}</span>
            </div>
            <Progress value={daysLeft ? Math.max(0, 100 - (daysLeft / 30) * 100) : 100} className="h-2" />
          </div>
        )}

        {/* Real-time Activity Feed */}
        {showCollaboration && recentActivity.length > 0 && (
          <div className="mt-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{isRTL ? 'نشاط حديث' : 'Recent Activity'}</span>
            </div>
            <div className="space-y-1">
              {recentActivity.slice(0, 2).map((activity, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {activity.event_type} • {
                    Math.floor((Date.now() - new Date(activity.created_at).getTime()) / (1000 * 60))
                  } {isRTL ? 'دقيقة مضت' : 'min ago'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Person */}
        {opportunity.contact_person && (
          <div className="flex items-center justify-between mt-3 p-2 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium text-foreground">{isRTL ? 'جهة الاتصال:' : 'Contact Person:'}</span>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                  {opportunity.contact_person[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{opportunity.contact_person}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Live Stats Grid - Enhanced */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <div className={`text-sm font-medium ${liveApplications !== opportunity.applications_count ? 'text-primary' : ''}`}>
                {liveApplications}
                {liveApplications !== opportunity.applications_count && (
                  <span className="text-xs ml-1">📈</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'طلب' : 'applications'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Eye className="h-4 w-4 text-primary" />
            <div>
              <div className={`text-sm font-medium ${liveViews !== opportunity.views_count ? 'text-primary' : ''}`}>
                {liveViews}
                {liveViews !== opportunity.views_count && (
                  <span className="text-xs ml-1">👀</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'مشاهدة' : 'views'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <DollarSign className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium truncate">{formatBudgetRange()}</div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'الميزانية' : 'budget'}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <div>
              <div className="text-sm font-medium">
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString('ar-SA') : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">{isRTL ? 'الموعد النهائي' : 'deadline'}</div>
            </div>
          </div>
        </div>

        {/* Live Collaboration Indicator */}
        {showCollaboration && opportunityViewers.length > 0 && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {opportunityViewers.length} {isRTL ? 'يتصفح الآن' : 'viewing now'}
              </span>
            </div>
            <div className="flex -space-x-1">
              {opportunityViewers.slice(0, 5).map((user, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-background">
                  <AvatarImage src={user.user_info.avatar_url} />
                  <AvatarFallback className="text-xs bg-primary text-white">
                    {user.user_id?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              ))}
              {opportunityViewers.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-bold">+{opportunityViewers.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Organization Info */}
        {(opportunity.sector || opportunity.department) && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{isRTL ? 'الجهة المسؤولة' : 'Responsible Entity'}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {opportunity.sector && (isRTL ? opportunity.sector.name_ar : opportunity.sector.name)}
              {opportunity.sector && opportunity.department && ' - '}
              {opportunity.department && (isRTL ? opportunity.department.name_ar : opportunity.department.name)}
            </div>
          </div>
        )}

        {/* Opportunity Type Badge */}
        <div className="mb-4">
          <Badge variant="outline" className="truncate">
            <Zap className="w-3 h-3 mr-1" />
            {isRTL ? 
              (opportunity.opportunity_type === 'sponsorship' ? 'رعاية' : 
               opportunity.opportunity_type === 'collaboration' ? 'تعاون' : 
               opportunity.opportunity_type === 'research' ? 'بحث' : 
               opportunity.opportunity_type) :
              opportunity.opportunity_type
            }
          </Badge>
        </div>

        {/* Action Buttons - Enhanced with Collaboration */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(opportunity)}
            className="flex-1 hover:bg-primary hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'التفاصيل' : 'Details'}
          </Button>
          {showCollaboration && (
            <Button 
              variant="secondary"
              size="sm" 
              onClick={handleStartCollaboration}
              className="hover:bg-primary hover:text-white transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isRTL ? 'تعاون' : 'Collaborate'}
            </Button>
          )}
          {opportunity.status === 'open' && (
            <Button 
              size="sm" 
              onClick={() => onApply(opportunity)}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Star className="h-4 w-4 mr-2" />
              {isRTL ? 'تقدم الآن' : 'Apply Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};