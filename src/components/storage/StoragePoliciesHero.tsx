import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Database,
  Users,
  Settings
} from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';

interface StoragePoliciesHeroProps {
  totalBuckets: number;
  publicBuckets: number;
  protectedBuckets: number;
  unprotectedBuckets: number;
  totalPolicies: number;
  securityScore: number;
  lastReview: string;
  criticalIssues: number;
}

export function StoragePoliciesHero({
  totalBuckets,
  publicBuckets,
  protectedBuckets,
  unprotectedBuckets,
  totalPolicies,
  securityScore,
  lastReview,
  criticalIssues
}: StoragePoliciesHeroProps) {
  const { t, isRTL } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Buckets */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('total_buckets')}</CardTitle>
          <Database className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBuckets}</div>
          <p className="text-xs text-muted-foreground">
            {totalPolicies} {t('active')} {t('total_policies')}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              {publicBuckets} {t('public')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {protectedBuckets} {t('protected')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('security_score')}</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {securityScore >= 80 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : securityScore >= 60 ? (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <div className="text-xl font-bold">{securityScore}%</div>
          </div>
          <div className="mt-2">
            <Progress value={securityScore} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t('last_review')}: {lastReview}
          </p>
        </CardContent>
      </Card>

      {/* Policy Coverage */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('total_policies')}</CardTitle>
          <Lock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{protectedBuckets}</div>
          <p className="text-xs text-muted-foreground">
            of {totalBuckets} buckets {t('protected')}
          </p>
          <div className="mt-2">
            <Progress value={(protectedBuckets / totalBuckets) * 100} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {((protectedBuckets / totalBuckets) * 100).toFixed(1)}% coverage
          </p>
        </CardContent>
      </Card>

      {/* Security Issues */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('critical_issues')}</CardTitle>
          <AlertTriangle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            {criticalIssues > 0 ? (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div className="text-xl font-bold text-red-600">{criticalIssues}</div>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div className="text-xl font-bold text-green-600">0</div>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {unprotectedBuckets} {t('unprotected_buckets')}
          </p>
          {criticalIssues > 0 && (
            <Badge variant="destructive" className="mt-2 text-xs">
              {t('attention_required')}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}