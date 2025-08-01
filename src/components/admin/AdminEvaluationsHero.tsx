import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Evaluations */}
      <Card className="gradient-border hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
          <FileCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalEvaluations}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      {/* Pending Evaluations */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{pendingEvaluations}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting expert review
          </p>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{averageScore}/10</div>
          <p className="text-xs text-muted-foreground">
            Quality benchmark
          </p>
        </CardContent>
      </Card>

      {/* Active Evaluators */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Evaluators</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{activeEvaluators}</div>
          <p className="text-xs text-muted-foreground">
            Expert reviewers
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="md:col-span-2 lg:col-span-2 gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Evaluation Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{completedEvaluations}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{topPerformingIdeas}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3" />
                Top Rated (8+)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-orange-500" />
            Review Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{criticalReviews}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Critical Issues
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{evaluationRate}%</div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}