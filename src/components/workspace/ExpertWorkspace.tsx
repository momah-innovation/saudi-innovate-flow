import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useExpertWorkspaceData } from '@/hooks/useWorkspaceData';
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics';
import { useWorkspaceNotifications } from '@/hooks/useWorkspaceNotifications';
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Clock,
  CheckCircle,
  Star,
  Target
} from 'lucide-react';

interface ExpertWorkspaceProps {
  userId: string;
}

export const ExpertWorkspace: React.FC<ExpertWorkspaceProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('queue');
  
  const { t, isRTL } = useUnifiedTranslation();
  const tw = React.useCallback((key: string, params?: Record<string, any>) => t(`workspace.expert.${key}`, params), [t]);

  const { 
    data: workspaceData,
    isLoading: isDataLoading 
  } = useExpertWorkspaceData();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading
  } = useWorkspaceAnalytics({
    workspaceType: 'expert',
    workspaceId: `expert-${userId}`,
    timeframe: '30d'
  });

  if (isDataLoading || isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {tw('header.expert_dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {tw('header.evaluation_consultation_hub')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {tw('actions.schedule_consultation')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.total_evaluations')}
                </p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="queue">{tw('tabs.evaluation_queue')}</TabsTrigger>
          <TabsTrigger value="consultations">{tw('tabs.consultations')}</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {tw('queue.pending_evaluations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{tw('queue.no_pending_evaluations')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {tw('consultations.schedule')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{tw('consultations.no_upcoming')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};