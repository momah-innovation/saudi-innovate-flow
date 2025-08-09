import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useParams } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Building, Users, Target, TrendingUp, Plus } from 'lucide-react';

export default function OrganizationWorkspace() {
  const { orgId } = useParams();
  const { t } = useUnifiedTranslation();
  const [activeView, setActiveView] = useState('overview');

  return (
    <AppShell>
      <PageLayout 
        title={t('organizationWorkspace') || 'Organization Workspace'}
        description={t('manageOrganizationInnovation') || 'Manage your organization\'s innovation initiatives'}
        primaryAction={{
          label: t('newChallenge') || 'New Challenge',
          onClick: () => console.log('New challenge'),
          icon: <Plus className="w-4 h-4" />
        }}
        maxWidth="full"
      >
        <div className="space-y-6">
          {/* Organization Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('activeChallenges') || 'Active Challenges'}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-sm text-muted-foreground">
                {t('challengesInProgress') || 'Challenges currently in progress'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('teamMembers') || 'Team Members'}</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">45</div>
              <p className="text-sm text-muted-foreground">
                {t('activeTeamMembers') || 'Active team members'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('ideasSubmitted') || 'Ideas Submitted'}</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-muted-foreground">
                {t('totalIdeasReceived') || 'Total ideas received this quarter'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('partnerships') || 'Partnerships'}</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600">8</div>
              <p className="text-sm text-muted-foreground">
                {t('activePartnerships') || 'Active strategic partnerships'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('recentChallenges') || 'Recent Challenges'}</h3>
              <p className="text-muted-foreground">
                {t('noChallengesYet') || 'No recent challenges to display'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('organizationMetrics') || 'Organization Metrics'}</h3>
              <p className="text-muted-foreground">
                {t('innovationKpis') || 'Track your organization\'s innovation KPIs'}
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}