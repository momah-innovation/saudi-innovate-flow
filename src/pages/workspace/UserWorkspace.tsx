import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useParams } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { User, Settings, Calendar, Lightbulb, Star } from 'lucide-react';

export default function UserWorkspace() {
  const { userId } = useParams();
  const { t } = useUnifiedTranslation();
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <AppShell>
      <PageLayout 
        title={t('userWorkspace') || 'User Workspace'}
        description={t('managePersonalInnovationJourney') || 'Manage your personal innovation journey'}
        primaryAction={{
          label: t('newIdea') || 'New Idea',
          onClick: () => console.log('New idea'),
          icon: <Lightbulb className="w-4 h-4" />
        }}
        maxWidth="full"
      >
        <div className="space-y-6">
          {/* User Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('myProfile') || 'My Profile'}</h3>
              </div>
              <p className="text-muted-foreground">
                {t('managePersonalInfo') || 'Manage your personal information and preferences'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('myIdeas') || 'My Ideas'}</h3>
              </div>
              <p className="text-muted-foreground">
                {t('trackIdeasProgress') || 'Track your submitted ideas and their progress'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('savedItems') || 'Saved Items'}</h3>
              </div>
              <p className="text-muted-foreground">
                {t('accessBookmarkedContent') || 'Access your bookmarked challenges and opportunities'}
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{t('recentActivity') || 'Recent Activity'}</h3>
            <p className="text-muted-foreground">
              {t('noRecentActivity') || 'No recent activity to display'}
            </p>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}