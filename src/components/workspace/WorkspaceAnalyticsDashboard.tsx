import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWorkspaceAnalytics } from '@/hooks/useWorkspaceAnalytics'
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation'
import { 
  BarChart3, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Download,
  RefreshCw,
  Calendar,
  Activity,
  Target,
  Clock
} from 'lucide-react'

interface WorkspaceAnalyticsDashboardProps {
  workspaceId: string
  workspaceType: string
}

export const WorkspaceAnalyticsDashboard: React.FC<WorkspaceAnalyticsDashboardProps> = ({
  workspaceId,
  workspaceType
}) => {
  const { t } = useUnifiedTranslation()
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  
  const { 
    data, 
    isLoading, 
    error, 
    refreshMetrics, 
    exportAnalytics 
  } = useWorkspaceAnalytics({
    workspaceId,
    workspaceType: workspaceType as any,
    timeframe,
    realTimeUpdates: true
  })

  const availableTimeRanges = [
    { label: 'آخر 7 أيام', value: '7d' },
    { label: 'آخر 30 يوم', value: '30d' },
    { label: 'آخر 90 يوم', value: '90d' },
    { label: 'آخر سنة', value: '1y' }
  ]

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const blob = await exportAnalytics(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `workspace-analytics-${workspaceId}-${timeframe}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p>{error}</p>
          <Button onClick={refreshMetrics} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('workspace.analytics.retry')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('workspace.analytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('workspace.analytics.subtitle')} {workspaceType}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            {availableTimeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('workspace.analytics.refresh')}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download className="h-4 w-4 mr-2" />
            {t('workspace.analytics.export')}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('workspace.analytics.total_members')}
                </p>
                <p className="text-2xl font-bold">
                  {data?.metrics.totalMembers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-muted-foreground">
                {t('workspace.analytics.active')}: {data?.metrics.activeMembers || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('workspace.analytics.total_projects')}
                </p>
                <p className="text-2xl font-bold">
                  {data?.metrics.totalProjects || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              {getTrendIcon(data?.trends.memberGrowth || 0)}
              <span className={`ml-1 ${getTrendColor(data?.trends.memberGrowth || 0)}`}>
                {data?.trends.memberGrowth || 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('workspace.analytics.completed_tasks')}
                </p>
                <p className="text-2xl font-bold">
                  {data?.metrics.completedTasks || 0}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="ml-1 text-muted-foreground">
                {t('workspace.analytics.pending')}: {data?.metrics.pendingTasks || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('workspace.analytics.collaboration_score')}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(data?.metrics.collaborationScore || 0)}`}>
                  {data?.metrics.collaborationScore || 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              <Progress 
                value={data?.metrics.collaborationScore || 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('workspace.analytics.overview')}</TabsTrigger>
          <TabsTrigger value="engagement">{t('workspace.analytics.engagement')}</TabsTrigger>
          <TabsTrigger value="performance">{t('workspace.analytics.performance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('workspace.analytics.engagement_metrics')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('workspace.analytics.engagement_score')}
                    </span>
                    <span className={`font-bold ${getScoreColor(data?.metrics.engagementScore || 0)}`}>
                      {data?.metrics.engagementScore || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={data?.metrics.engagementScore || 0} 
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('workspace.analytics.productivity_score')}
                    </span>
                    <span className={`font-bold ${getScoreColor(data?.metrics.productivityScore || 0)}`}>
                      {data?.metrics.productivityScore || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={data?.metrics.productivityScore || 0} 
                    className="h-2"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {t('workspace.analytics.last_updated')} {new Date().toLocaleString('ar-SA')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t('workspace.analytics.activity_summary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {data?.metrics.activeMembers || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('workspace.analytics.active_members')}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {data?.metrics.totalProjects || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('workspace.analytics.active_projects')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('workspace.analytics.member_growth')}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(data?.trends.memberGrowth || 0)}
                      <Badge variant="outline">
                        {data?.trends.memberGrowth || 0}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('workspace.analytics.task_completion')}</span>
                    <Badge variant="secondary">
                      {data?.trends.taskCompletion || 0}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('workspace.analytics.engagement_details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>{t('workspace.analytics.engagement_coming_soon')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('workspace.analytics.performance_metrics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>{t('workspace.analytics.performance_coming_soon')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}