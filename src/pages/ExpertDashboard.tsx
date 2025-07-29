import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Target, Lightbulb, Clock, CheckCircle, 
  AlertCircle, Calendar, TrendingUp, Award, Eye, Edit
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ExpertStats {
  assignedChallenges: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageRating: number;
  totalIdeasEvaluated: number;
  expertiseAreas: string[];
}

interface PendingEvaluation {
  id: string;
  idea_title: string;
  challenge_title: string;
  submission_date: string;
  priority: 'high' | 'medium' | 'low';
  days_pending: number;
}

interface RecentEvaluation {
  id: string;
  idea_title: string;
  evaluation_date: string;
  score: number;
  status: string;
}

export default function ExpertDashboard() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ExpertStats>({
    assignedChallenges: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageRating: 0,
    totalIdeasEvaluated: 0,
    expertiseAreas: []
  });
  
  const [pendingEvaluations, setPendingEvaluations] = useState<PendingEvaluation[]>([]);
  const [recentEvaluations, setRecentEvaluations] = useState<RecentEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      loadExpertData();
    }
  }, [userProfile]);

  const loadExpertData = async () => {
    try {
      setLoading(true);
      
      // Load expert assignments
      const { data: expertAssignments } = await supabase
        .from('challenge_experts')
        .select(`
          challenge_id,
          challenges (id, title_ar)
        `)
        .eq('expert_id', userProfile?.id);

      // Load idea evaluations
      const { data: evaluations } = await supabase
        .from('idea_evaluations')
        .select(`
          id,
          idea_id,
          technical_feasibility,
          created_at,
          ideas (title_ar, challenge_id, challenges (title_ar))
        `)
        .eq('evaluator_id', userProfile?.id);

      // Calculate stats
      const assignedChallenges = expertAssignments?.length || 0;
      const completedEvaluations = evaluations?.filter(e => e.technical_feasibility > 0)?.length || 0;
      const pendingEvaluations = evaluations?.filter(e => !e.technical_feasibility)?.length || 0;
      
      const scores = evaluations?.filter(e => e.technical_feasibility).map(e => e.technical_feasibility) || [];
      const averageRating = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      setStats({
        assignedChallenges,
        pendingEvaluations,
        completedEvaluations,
        averageRating,
        totalIdeasEvaluated: evaluations?.length || 0,
        expertiseAreas: ['Technology', 'Innovation', 'Business Development'] // Placeholder
      });

      // Create pending evaluations list
      const pending: PendingEvaluation[] = evaluations?.filter(e => !e.technical_feasibility).map(evaluation => ({
        id: evaluation.id,
        idea_title: evaluation.ideas?.title_ar || 'Untitled Idea',
        challenge_title: evaluation.ideas?.challenges?.title_ar || 'No Challenge',
        submission_date: evaluation.created_at,
        priority: 'medium',
        days_pending: Math.floor((new Date().getTime() - new Date(evaluation.created_at).getTime()) / (1000 * 3600 * 24))
      })) || [];

      setPendingEvaluations(pending);

      // Create recent evaluations list
      const recent: RecentEvaluation[] = evaluations?.filter(e => e.technical_feasibility > 0)
        .slice(0, 5)
        .map(evaluation => ({
          id: evaluation.id,
          idea_title: evaluation.ideas?.title_ar || 'Untitled Idea',
          evaluation_date: evaluation.created_at,
          score: evaluation.technical_feasibility || 0,
          status: 'completed'
        })) || [];

      setRecentEvaluations(recent);
      
    } catch (error) {
      console.error('Error loading expert data:', error);
      toast.error('Error loading expert dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string, daysPending: number) => {
    if (daysPending > 7) return <Badge variant="destructive">Urgent</Badge>;
    if (daysPending > 3) return <Badge variant="default">High</Badge>;
    return <Badge variant="secondary">Normal</Badge>;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return <Badge variant="default" className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 6) return <Badge variant="secondary">Good</Badge>;
    if (score >= 4) return <Badge variant="outline">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  return (
    <PageLayout
      title="Expert Dashboard"
      description="Manage your expert evaluations and assignments"
      className="space-y-6"
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Evaluations
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Expert Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned Challenges</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.assignedChallenges}</div>
                <p className="text-xs text-muted-foreground">
                  active assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
                <p className="text-xs text-muted-foreground">
                  awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Evaluated</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalIdeasEvaluated}</div>
                <p className="text-xs text-muted-foreground">
                  ideas reviewed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">
                  evaluation quality
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Progress</CardTitle>
                <CardDescription>Your evaluation performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{stats.totalIdeasEvaluated > 0 ? Math.round((stats.completedEvaluations / stats.totalIdeasEvaluated) * 100) : 0}%</span>
                  </div>
                  <Progress value={stats.totalIdeasEvaluated > 0 ? (stats.completedEvaluations / stats.totalIdeasEvaluated) * 100 : 0} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Average Response Time</span>
                    <span>2.3 days</span>
                  </div>
                  <Progress value={70} className="mt-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Quality Score</span>
                    <span>{stats.averageRating.toFixed(1)}/10</span>
                  </div>
                  <Progress value={(stats.averageRating / 10) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do next?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => navigate('/evaluations')} className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Start Evaluating Ideas
                </Button>
                <Button onClick={() => navigate('/expert-profile')} variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Expert Profile
                </Button>
                <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  View Assigned Challenges
                </Button>
                <Button onClick={() => navigate('/statistics')} variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Expertise Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Expertise Areas</CardTitle>
              <CardDescription>Your areas of specialization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.expertiseAreas.map((area, index) => (
                  <Badge key={index} variant="outline">{area}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Evaluations</CardTitle>
              <CardDescription>Ideas waiting for your expert review</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : pendingEvaluations.length > 0 ? (
                <div className="space-y-3">
                  {pendingEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                          <h4 className="font-medium">{evaluation.idea_title}</h4>
                          <p className="text-sm text-muted-foreground">{evaluation.challenge_title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted {evaluation.days_pending} days ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(evaluation.priority, evaluation.days_pending)}
                        <Button size="sm" onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
                          <Star className="w-4 h-4 mr-1" />
                          Evaluate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No pending evaluations</h3>
                  <p className="text-muted-foreground">Great job! You're all caught up.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Evaluations</CardTitle>
              <CardDescription>Your recently completed evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              {recentEvaluations.length > 0 ? (
                <div className="space-y-3">
                  {recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-medium">{evaluation.idea_title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Evaluated on {new Date(evaluation.evaluation_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getScoreBadge(evaluation.score)}
                        <span className="text-sm font-medium">{evaluation.score}/10</span>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/evaluations/${evaluation.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No completed evaluations yet</h3>
                  <p className="text-muted-foreground">Start evaluating ideas to see your history here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}