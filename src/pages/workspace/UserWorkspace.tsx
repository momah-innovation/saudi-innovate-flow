import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { WorkspaceMetrics } from '@/components/workspace/WorkspaceMetrics';
import { WorkspaceQuickActions } from '@/components/workspace/WorkspaceQuickActions';
import { WorkspaceNavigation } from '@/components/workspace/WorkspaceNavigation';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { WorkspaceBreadcrumb } from '@/components/layout/WorkspaceBreadcrumb';
import { EnhancedWorkspaceHero } from '@/components/workspace/EnhancedWorkspaceHero';
import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { useUserWorkspaceData } from '@/hooks/useWorkspaceData';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb, Target, Bookmark, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_ROUTES } from '@/routing/routes';

export default function UserWorkspace() {
  const { t, getDynamicText } = useUnifiedTranslation();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const permissions = useWorkspacePermissions();
  const { data: workspaceData, isLoading } = useUserWorkspaceData();

  const navigationItems = [
    {
      id: 'ideas',
      label: t('workspace.user.nav.ideas'),
      icon: Lightbulb,
      count: workspaceData?.stats?.totalIdeas || 0,
      active: true,
      onClick: () => navigate(ALL_ROUTES.IDEAS)
    },
    {
      id: 'challenges',
      label: t('workspace.user.nav.challenges'),
      icon: Target,
      count: workspaceData?.stats?.activeChallenges || 0,
      active: false,
      onClick: () => navigate(ALL_ROUTES.CHALLENGES)
    },
    {
      id: 'bookmarks',
      label: t('workspace.user.nav.bookmarks'),
      icon: Bookmark,
      count: workspaceData?.stats?.savedItems || 0,
      active: false,
      onClick: () => {}
    }
  ];

  const quickActions = [
    {
      id: 'new-idea',
      title: t('workspace.user.actions.new_idea'),
      description: t('workspace.user.actions.new_idea_desc'),
      icon: Plus,
      onClick: () => navigate(ALL_ROUTES.IDEAS + '?action=create'),
      variant: 'default' as const
    },
    {
      id: 'join-challenge',
      title: t('workspace.user.actions.join_challenge'),
      description: t('workspace.user.actions.join_challenge_desc'),
      icon: Trophy,
      onClick: () => navigate(ALL_ROUTES.CHALLENGES),
      variant: 'outline' as const
    }
  ];

  const stats = [
    {
      label: t('workspace.user.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: Lightbulb
    },
    {
      label: t('workspace.user.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      label: t('workspace.user.metrics.saved_items'),
      value: workspaceData?.stats?.savedItems || 0,
      icon: Bookmark
    }
  ];

  const metrics = [
    {
      title: t('workspace.user.metrics.total_ideas'),
      value: workspaceData?.stats?.totalIdeas || 0,
      icon: Lightbulb
    },
    {
      title: t('workspace.user.metrics.active_challenges'),
      value: workspaceData?.stats?.activeChallenges || 0,
      icon: Target
    },
    {
      title: t('workspace.user.metrics.saved_items'),
      value: workspaceData?.stats?.savedItems || 0,
      icon: Bookmark
    }
  ];

  if (isLoading) {
    return (
      <>
        <WorkspaceBreadcrumb />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WorkspaceBreadcrumb />
      <div className="container mx-auto px-4 py-8">
        <EnhancedWorkspaceHero
          userRole={userProfile?.roles?.[0] || 'user'}
          userProfile={userProfile}
          title={t('workspace.user.title')}
          description={t('workspace.user.description')}
          stats={stats}
          quickActions={[
            {
              label: t('workspace.user.actions.new_idea'),
              onClick: () => navigate(ALL_ROUTES.IDEAS + '?action=create'),
              icon: Plus
            }
          ]}
        />
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-6">
        {/* Navigation */}
        <WorkspaceNavigation items={navigationItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Ideas */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.user.recent_ideas')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.ideas?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.ideas.slice(0, 5).map((idea) => (
                      <div key={idea.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Lightbulb className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{getDynamicText(idea.title_ar, idea.title_en)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('common.status_label')}: {idea.status?.startsWith('status.') ? t(idea.status) : t(`status.${idea.status}`) || idea.status}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                          {t('common.view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Lightbulb className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.user.no_ideas')}</p>
                    <p className="text-sm mb-6">{t('workspace.user.no_ideas_desc', 'Start your innovation journey by sharing your first idea')}</p>
                    <Button 
                      className="hover-scale gradient-border" 
                      onClick={() => navigate(ALL_ROUTES.IDEAS + '?action=create')}
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {t('workspace.user.actions.new_idea')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Participated Challenges */}
            <Card className="gradient-border hover-scale group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                  {t('workspace.user.participated_challenges')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workspaceData?.participatedChallenges?.length > 0 ? (
                  <div className="space-y-3">
                    {workspaceData.participatedChallenges.map((participation) => (
                      <div key={participation.id} className="flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300 hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{getDynamicText(participation.challenges?.title_ar, (participation.challenges as any)?.title_en)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('common.status_label')}: {participation.challenges?.status?.startsWith('status.') ? t(participation.challenges.status) : t(`status.${participation.challenges?.status}`) || participation.challenges?.status}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover-scale gradient-border">
                          {t('common.view')}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 w-fit mx-auto mb-4">
                      <Target className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">{t('workspace.user.no_challenges')}</p>
                    <p className="text-sm mb-6">{t('workspace.user.no_challenges_desc', 'Join challenges to showcase your innovation skills')}</p>
                    <Button 
                      className="hover-scale gradient-border" 
                      onClick={() => navigate(ALL_ROUTES.CHALLENGES)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      {t('workspace.user.actions.browse_challenges')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <WorkspaceQuickActions
              title={t('workspace.user.quick_actions')}
              actions={quickActions}
            />

            {/* Metrics */}
            <WorkspaceMetrics metrics={metrics} />
          </div>
        </div>
        </div>
        
        {/* User Workspace Collaboration */}
        <WorkspaceCollaboration
          workspaceType="user"
          entityId={user?.id}
          showWidget={true}
          showPresence={true}
          showActivity={true}
        />
      </div>
    </>
  );
}