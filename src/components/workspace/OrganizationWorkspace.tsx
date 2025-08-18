import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceTranslations } from '@/hooks/useWorkspaceTranslations';
import { useOrganizationWorkspaceData } from '@/hooks/useWorkspaceData';
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Shield,
  FileText,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Globe,
  Settings,
  Award,
  Calendar,
  DollarSign
} from 'lucide-react';

interface OrganizationWorkspaceProps {
  userId: string;
}

export const OrganizationWorkspace: React.FC<OrganizationWorkspaceProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('strategic');
  
  const { tw, isRTL } = useWorkspaceTranslations({
    workspaceType: 'organization',
    dynamicContent: true,
    fallbackStrategy: 'english'
  });

  const { 
    data: workspaceData,
    isLoading: isDataLoading 
  } = useOrganizationWorkspaceData();

  const {
    data: analytics,
    isLoading: isAnalyticsLoading
  } = useWorkspaceAnalytics({
    workspaceType: 'organization',
    workspaceId: `organization-${userId}`,
    timeframe: '30d'
  });

  const organizationStats = {
    totalEmployees: workspaceData?.stats?.teamSize || 1247,
    activeDepartments: 12,
    activeProjects: workspaceData?.stats?.activeChallenges || 45,
    complianceScore: 96,
    innovationIndex: 8.7,
    digitalMaturity: 85
  };

  if (isDataLoading || isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {tw('header.organization_dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {tw('header.strategic_overview')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            {tw('actions.generate_report')}
          </Button>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            {tw('actions.manage_policies')}
          </Button>
        </div>
      </div>

      {/* Organization Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.total_employees')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {organizationStats.totalEmployees.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.compliance_score')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {organizationStats.complianceScore}%
                </p>
              </div>
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.innovation_index')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {organizationStats.innovationIndex}/10
                </p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {tw('stats.digital_maturity')}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {organizationStats.digitalMaturity}%
                </p>
              </div>
              <Globe className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="strategic">{tw('tabs.strategic_dashboard')}</TabsTrigger>
          <TabsTrigger value="analytics">{tw('tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="strategic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {tw('strategic.overview')}
              </CardTitle>
              <CardDescription>{tw('strategic.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{tw('strategic.active_challenges')}</h4>
                  <p className="text-2xl font-bold text-primary">{workspaceData?.challenges?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">{tw('strategic.challenges_description')}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{tw('strategic.total_submissions')}</h4>
                  <p className="text-2xl font-bold text-primary">{workspaceData?.submissions?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">{tw('strategic.submissions_description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {tw('analytics.organization_metrics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{tw('analytics.digital_transformation')}</span>
                  <span className="font-medium">{organizationStats.digitalMaturity}%</span>
                </div>
                <Progress value={organizationStats.digitalMaturity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{tw('analytics.compliance_score')}</span>
                  <span className="font-medium">{organizationStats.complianceScore}%</span>
                </div>
                <Progress value={organizationStats.complianceScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};