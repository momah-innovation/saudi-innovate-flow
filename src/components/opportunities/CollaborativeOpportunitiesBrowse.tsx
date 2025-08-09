import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { CollaborativeOpportunityCard } from './CollaborativeOpportunityCard';
import { ActivityFeed } from '@/components/collaboration/ActivityFeed';
import { UserPresence } from '@/components/collaboration/UserPresence';
import { CollaborationWidget } from '@/components/collaboration/CollaborationWidget';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Clock,
  Briefcase,
  Target
} from 'lucide-react';
import type { Opportunity } from '@/types/opportunities';

interface CollaborativeOpportunitiesBrowseProps {
  opportunities: Opportunity[];
  onOpportunitySelect: (opportunity: Opportunity) => void;
  viewMode?: 'cards' | 'list' | 'grid';
  activeTab?: string;
}

export const CollaborativeOpportunitiesBrowse: React.FC<CollaborativeOpportunitiesBrowseProps> = ({
  opportunities,
  onOpportunitySelect,
  viewMode = 'cards',
  activeTab = 'all'
}) => {
  const { onlineUsers, activities, isConnected, startCollaboration } = useCollaboration();
  const [realtimeStats, setRealtimeStats] = useState({
    totalViewers: 0,
    activeApplications: 0,
    recentActivity: 0
  });

  // Calculate collaboration stats
  useEffect(() => {
    const browseViewers = onlineUsers.filter(user => 
      user.current_location.page?.includes('/opportunities')
    );
    
    const recentActivities = activities.filter(activity => 
      activity.entity_type === 'opportunity' && 
      Date.now() - new Date(activity.created_at).getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    setRealtimeStats({
      totalViewers: browseViewers.length,
      activeApplications: activities.filter(a => 
        a.entity_type === 'opportunity' && a.event_type === 'create'
      ).length,
      recentActivity: recentActivities.length
    });
  }, [onlineUsers, activities]);

  // Start collaboration for opportunities browse
  useEffect(() => {
    if (isConnected) {
      startCollaboration('opportunities', 'browse');
    }
  }, [isConnected, startCollaboration]);

  const renderCollaborationHeader = () => (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">الأنشطة المباشرة</span>
            </div>
            <UserPresence 
              users={onlineUsers.filter(user => 
                user.current_location.page?.includes('/opportunities')
              )}
              maxVisible={6}
              showStatus={true}
              size="sm"
            />
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {realtimeStats.totalViewers}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>المتصفحون النشطون</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600">
                      {realtimeStats.activeApplications}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>التطبيقات النشطة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-600">
                      {realtimeStats.recentActivity}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>النشاط الأخير</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCollaborativeGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <CollaborativeOpportunityCard
          key={opportunity.id}
          opportunity={{
            ...opportunity,
            description_ar: opportunity.description_ar || '',
            opportunity_type: opportunity.opportunity_type || 'general',
            deadline: opportunity.deadline || new Date().toISOString()
          }}
          onViewDetails={(opp) => onOpportunitySelect(opp as any)}
          onApply={(opp) => onOpportunitySelect(opp as any)}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderCollaborativeList = () => (
    <div className="space-y-4">
      {opportunities.map((opportunity) => (
        <CollaborativeOpportunityCard
          key={opportunity.id}
          opportunity={{
            ...opportunity,
            description_ar: opportunity.description_ar || '',
            opportunity_type: opportunity.opportunity_type || 'general',
            deadline: opportunity.deadline || new Date().toISOString()
          }}
          onViewDetails={(opp) => onOpportunitySelect(opp as any)}
          onApply={(opp) => onOpportunitySelect(opp as any)}
          showCollaboration={true}
        />
      ))}
    </div>
  );

  const renderActivitySidebar = () => (
    <div className="w-80 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <MessageSquare className="w-5 h-5" />
            <span>النشاط المباشر</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            scope="all"
            limit={10}
            showFilters={false}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Clock className="w-5 h-5" />
            <span>الفرص الرائجة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {opportunities.slice(0, 5).map((opportunity, index) => {
              const viewers = onlineUsers.filter(user => 
                user.current_location.entity_type === 'opportunity' && 
                user.current_location.entity_id === opportunity.id
              );
              
              return (
                <div key={opportunity.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{opportunity.title_ar}</p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {viewers.length} متصفح
                      </span>
                    </div>
                  </div>
                  <div className="flex -space-x-1 rtl:space-x-reverse">
                    {viewers.slice(0, 3).map((user, userIndex) => (
                      <Avatar key={userIndex} className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={user.user_info.avatar_url} />
                        <AvatarFallback className="text-xs bg-primary text-white">
                          {user.user_info.display_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">جاري الاتصال بنظام التعاون...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderCollaborationHeader()}
      
      <div className="flex gap-6">
        <div className="flex-1">
          {viewMode === 'grid' && renderCollaborativeGrid()}
          {viewMode === 'cards' && renderCollaborativeGrid()}
          {viewMode === 'list' && renderCollaborativeList()}
          
          {opportunities.length === 0 && (
            <Card className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد فرص متاحة</h3>
              <p className="text-muted-foreground">
                لم يتم العثور على فرص تطابق المعايير المحددة.
              </p>
            </Card>
          )}
        </div>
        
        {renderActivitySidebar()}
      </div>

      <CollaborationWidget
        contextType="global"
        contextId="opportunities-browse"
        entityType="opportunities"
        entityId="browse"
        position="bottom-right"
      />
    </div>
  );
};