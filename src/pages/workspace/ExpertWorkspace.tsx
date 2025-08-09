import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { useParams } from 'react-router-dom';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { GraduationCap, ClipboardCheck, Users, Award, Calendar } from 'lucide-react';

export default function ExpertWorkspace() {
  const { expertId } = useParams();
  const { t } = useUnifiedTranslation();
  const [activeView, setActiveView] = useState('evaluations');

  return (
    <AppShell>
      <PageLayout 
        title={t('expertWorkspace') || 'Expert Workspace'}
        description={t('manageExpertActivities') || 'Manage your expert evaluation activities'}
        primaryAction={{
          label: t('newEvaluation') || 'New Evaluation',
          onClick: () => console.log('New evaluation'),
          icon: <ClipboardCheck className="w-4 h-4" />
        }}
        maxWidth="full"
      >
        <div className="space-y-6">
          {/* Expert Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <ClipboardCheck className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('pendingEvaluations') || 'Pending Evaluations'}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">5</div>
              <p className="text-sm text-muted-foreground">
                {t('ideasAwaitingReview') || 'Ideas awaiting your review'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('completedEvaluations') || 'Completed'}</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">23</div>
              <p className="text-sm text-muted-foreground">
                {t('totalEvaluationsCompleted') || 'Total evaluations completed'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('assignedChallenges') || 'Assigned Challenges'}</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">7</div>
              <p className="text-sm text-muted-foreground">
                {t('challengesUnderReview') || 'Active challenges under review'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{t('upcomingDeadlines') || 'Upcoming Deadlines'}</h3>
              </div>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-sm text-muted-foreground">
                {t('evaluationsDueThisWeek') || 'Evaluations due this week'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('recentEvaluations') || 'Recent Evaluations'}</h3>
              <p className="text-muted-foreground">
                {t('noRecentEvaluations') || 'No recent evaluations to display'}
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{t('expertProfile') || 'Expert Profile'}</h3>
              <p className="text-muted-foreground">
                {t('manageExpertProfile') || 'Manage your expertise areas and evaluation preferences'}
              </p>
            </div>
          </div>
        </div>
      </PageLayout>
    </AppShell>
  );
}