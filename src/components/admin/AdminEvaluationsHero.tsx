import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useRTLAwareClasses } from '@/components/ui/rtl-aware';
import { 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Users, 
  Star,
  CheckCircle,
  AlertCircle,
  Timer
} from 'lucide-react';

interface AdminEvaluationsHeroProps {
  totalEvaluations: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  topPerformingIdeas: number;
  criticalReviews: number;
  activeEvaluators: number;
  evaluationRate: number;
}

export function AdminEvaluationsHero({
  totalEvaluations,
  pendingEvaluations,
  completedEvaluations,
  averageScore,
  topPerformingIdeas,
  criticalReviews,
  activeEvaluators,
  evaluationRate
}: AdminEvaluationsHeroProps) {
  const { t } = useUnifiedTranslation();
  const { flexRow } = useRTLAwareClasses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Evaluations */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('total_evaluations')}</CardTitle>
          <FileCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalEvaluations}</div>
          <p className="text-xs text-muted-foreground">
            {t('from_last_month', { percentage: 12 })}
          </p>
        </CardContent>
      </Card>

      {/* Pending Evaluations */}
      <Card className="hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('pending_reviews')}</CardTitle>
          <Clock className="h-4 w-4 icon-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{pendingEvaluations}</div>
          <p className="text-xs text-muted-foreground">
            {t('awaiting_expert_review')}
          </p>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card className="hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('average_score')}</CardTitle>
          <Star className="h-4 w-4 icon-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{averageScore}/10</div>
          <p className="text-xs text-muted-foreground">
            {t('quality_benchmark')}
          </p>
        </CardContent>
      </Card>

      {/* Active Evaluators */}
      <Card className="hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('active_evaluators')}</CardTitle>
          <Users className="h-4 w-4 icon-info" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{activeEvaluators}</div>
          <p className="text-xs text-muted-foreground">
            {t('expert_reviewers')}
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="md:col-span-2 lg:col-span-2 gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('evaluation_performance')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-success">{completedEvaluations}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {t('completed')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-innovation">{topPerformingIdeas}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3" />
                {t('top_rated_8_plus')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 icon-warning" />
            {t('review_status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-destructive">{criticalReviews}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {t('critical_issues')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{evaluationRate}%</div>
              <div className="text-sm text-muted-foreground">
                {t('completion_rate')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}