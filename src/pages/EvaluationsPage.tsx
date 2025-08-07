import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { EnhancedEvaluationHero } from '@/components/evaluation/EnhancedEvaluationHero';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Clock, CheckCircle, AlertCircle, Eye, FileText, MessageSquare, Download, Filter, Search, Users, TrendingUp, Calendar, Target, BookOpen, ArrowRight, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Evaluation {
  id: string;
  idea_id: string;
  evaluator_id: string;
  evaluator_type: string;
  technical_feasibility: number;
  financial_viability: number;
  market_potential: number;
  strategic_alignment: number;
  innovation_level: number;
  implementation_complexity: number;
  strengths: string;
  weaknesses: string;
  recommendations: string;
  next_steps: string;
  evaluation_date: string;
  created_at: string;
}

interface Idea {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  status: string;
  innovator_id: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

const EvaluationsPage = () => {
  const { t, isRTL } = useUnifiedTranslation();
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [ideas, setIdeas] = useState<{ [key: string]: Idea }>({});
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      
      // Fetch evaluations
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from("idea_evaluations")
        .select("*")
        .order("created_at", { ascending: false });

      if (evaluationsError) throw evaluationsError;
      setEvaluations(evaluationsData || []);

      // Fetch related ideas
      const ideaIds = [...new Set(evaluationsData?.map(e => e.idea_id).filter(Boolean))];
      if (ideaIds.length > 0) {
        const { data: ideasData, error: ideasError } = await supabase
          .from("ideas")
          .select("id, title_ar, description_ar, status, innovator_id")
          .in("id", ideaIds);

        if (ideasError) throw ideasError;

        const ideasMap = (ideasData || []).reduce((acc, idea) => {
          acc[idea.id] = idea;
          return acc;
        }, {} as { [key: string]: Idea });
        setIdeas(ideasMap);
      }

      // Fetch evaluator profiles
      const evaluatorIds = [...new Set(evaluationsData?.map(e => e.evaluator_id).filter(Boolean))];
      if (evaluatorIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, email")
          .in("id", evaluatorIds);

        if (profilesError) throw profilesError;

        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as { [key: string]: Profile });
        setProfiles(profilesMap);
      }

    } catch (error) {
      console.error("Error fetching evaluations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch evaluations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOverallScore = (evaluation: Evaluation) => {
    const scores = [
      evaluation.technical_feasibility,
      evaluation.financial_viability,
      evaluation.market_potential,
      evaluation.strategic_alignment,
      evaluation.innovation_level
    ].filter(score => score !== null && score !== undefined);
    
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  };

  const getStatusFromScore = (score: number) => {
    if (score >= 8) return 'completed';
    if (score >= 5) return 'in_progress';
    return 'pending';
  };

  const getPriorityFromComplexity = (complexity: number | null) => {
    if (!complexity) return 'medium';
    if (complexity >= 8) return 'high';
    if (complexity >= 5) return 'medium';
    return 'low';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'in_progress': return 'bg-info/10 text-info border-info/20';
      case 'completed': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return isRTL ? 'في الانتظار' : 'Pending Review';
      case 'in_progress': return isRTL ? 'قيد التقييم' : 'Under Evaluation';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return isRTL ? 'عالية' : 'High Priority';
      case 'medium': return isRTL ? 'متوسطة' : 'Medium Priority';
      case 'low': return isRTL ? 'منخفضة' : 'Low Priority';
      default: return priority;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const openEvaluationDetail = async (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    
    // Fetch comments for this evaluation
    try {
      const { data: commentsData } = await supabase
        .from('idea_comments')
        .select('*, profiles(name)')
        .eq('idea_id', evaluation.idea_id)
        .order('created_at', { ascending: false });
      
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    
    setIsDetailDialogOpen(true);
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedEvaluation) return;

    try {
      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: selectedEvaluation.idea_id,
          author_id: 'current-user-id', // This should be from auth context
          content: newComment,
          comment_type: 'evaluation_feedback'
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: isRTL ? 'تم إضافة التعليق' : 'Comment Added',
        description: isRTL ? 'تم إضافة تعليقك بنجاح' : 'Your comment has been added successfully'
      });
      
      // Refresh comments
      const { data: commentsData } = await supabase
        .from('idea_comments')
        .select('*, profiles(name)')
        .eq('idea_id', selectedEvaluation.idea_id)
        .order('created_at', { ascending: false });
      
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const idea = ideas[evaluation.idea_id];
    const profile = profiles[evaluation.evaluator_id];
    const overallScore = getOverallScore(evaluation);
    const status = getStatusFromScore(overallScore);
    const priority = getPriorityFromComplexity(evaluation.implementation_complexity);

    const matchesSearch = searchTerm === '' || 
      idea?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea?.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const groupedEvaluations = {
    assigned: filteredEvaluations,
    pending: filteredEvaluations.filter(e => getStatusFromScore(getOverallScore(e)) === 'pending'),
    in_progress: filteredEvaluations.filter(e => getStatusFromScore(getOverallScore(e)) === 'in_progress'),
    completed: filteredEvaluations.filter(e => getStatusFromScore(getOverallScore(e)) === 'completed')
  };

  const EvaluationCard = ({ evaluation }: { evaluation: Evaluation }) => {
    const idea = ideas[evaluation.idea_id];
    const profile = profiles[evaluation.evaluator_id];
    const overallScore = getOverallScore(evaluation);
    const status = getStatusFromScore(overallScore);
    const priority = getPriorityFromComplexity(evaluation.implementation_complexity);
    const progress = Math.round((overallScore / 10) * 100);

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/20" 
            onClick={() => openEvaluationDetail(evaluation)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {isRTL ? idea?.title_ar : idea?.title_ar} 
              </CardTitle>
              <CardDescription className="text-sm">
                {isRTL ? 'بواسطة:' : 'Evaluated by:'} {profile?.name || 'Unknown Evaluator'}
              </CardDescription>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {evaluation.evaluator_type}
                </Badge>
                <Badge className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                  <span className="ml-1">{getStatusText(status)}</span>
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <Star className={`h-4 w-4 ${getScoreColor(overallScore)}`} fill="currentColor" />
                <span className={`font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}/10
                </span>
              </div>
              <Badge className={getPriorityColor(priority)}>
                {getPriorityText(priority)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">{isRTL ? 'تاريخ التقييم:' : 'Evaluation Date:'}</span>
              <div className="font-medium">
                {new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">{isRTL ? 'حالة الفكرة:' : 'Idea Status:'}</span>
              <div className="font-medium capitalize">{idea?.status || 'Unknown'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}</span>
              <span className="font-medium">{overallScore}/10</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-semibold">{evaluation.technical_feasibility || 'N/A'}</div>
              <div className="text-muted-foreground">{isRTL ? 'الجدوى' : 'Technical'}</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-semibold">{evaluation.innovation_level || 'N/A'}</div>
              <div className="text-muted-foreground">{isRTL ? 'الابتكار' : 'Innovation'}</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-semibold">{evaluation.market_potential || 'N/A'}</div>
              <div className="text-muted-foreground">{isRTL ? 'السوق' : 'Market'}</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageSquare className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="h-3 w-3" />
              </Button>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <AppShell>
        <PageLayout 
          title={isRTL ? 'التقييمات' : 'Evaluations'}
          description={isRTL ? 'جاري التحميل...' : 'Loading...'}
        >
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">{isRTL ? 'جاري تحميل التقييمات...' : 'Loading evaluations...'}</p>
            </div>
          </div>
        </PageLayout>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <EnhancedEvaluationHero 
        totalEvaluations={evaluations.length}
        pendingEvaluations={evaluations.filter(e => getStatusFromScore(getOverallScore(e)) === 'pending').length}
        completedEvaluations={evaluations.filter(e => getStatusFromScore(getOverallScore(e)) === 'completed').length}
        averageScore={evaluations.length > 0 ? Math.round(evaluations.reduce((sum, e) => sum + getOverallScore(e), 0) / evaluations.length * 10) / 10 : 0}
        onCreateEvaluation={() => logger.info('Create evaluation requested', { component: 'EvaluationsPage', action: 'onCreateEvaluation' })}
        onShowFilters={() => logger.info('Show filters requested', { component: 'EvaluationsPage', action: 'onShowFilters' })}
      />
      <PageLayout
        title={isRTL ? 'التقييمات' : 'Evaluations'}
        description={isRTL ? 'إدارة ومراجعة تقييمات الأفكار والمشاريع' : 'Manage and review idea and project evaluations'}
        primaryAction={{
          label: isRTL ? 'تقييم جديد' : 'New Evaluation',
          onClick: () => {},
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</SelectItem>
                <SelectItem value="in_progress">{isRTL ? 'قيد المراجعة' : 'In Progress'}</SelectItem>
                <SelectItem value="completed">{isRTL ? 'مكتمل' : 'Completed'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder={isRTL ? 'الأولوية' : 'Priority'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأولويات' : 'All Priorities'}</SelectItem>
                <SelectItem value="high">{isRTL ? 'عالية' : 'High'}</SelectItem>
                <SelectItem value="medium">{isRTL ? 'متوسطة' : 'Medium'}</SelectItem>
                <SelectItem value="low">{isRTL ? 'منخفضة' : 'Low'}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              {isRTL ? 'تصدير' : 'Export'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={isRTL ? 'البحث في التقييمات...' : 'Search evaluations...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'إجمالي التقييمات' : 'Total Evaluations'}</p>
                  <p className="text-2xl font-bold">{evaluations.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'في الانتظار' : 'Pending'}</p>
                  <p className="text-2xl font-bold">{groupedEvaluations.pending.length}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'قيد المراجعة' : 'In Progress'}</p>
                  <p className="text-2xl font-bold">{groupedEvaluations.in_progress.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-info" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'مكتملة' : 'Completed'}</p>
                  <p className="text-2xl font-bold">{groupedEvaluations.completed.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assigned">
                {isRTL ? 'جميع التقييمات' : 'All Evaluations'} ({groupedEvaluations.assigned.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {isRTL ? 'في الانتظار' : 'Pending'} ({groupedEvaluations.pending.length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                {isRTL ? 'قيد المراجعة' : 'In Progress'} ({groupedEvaluations.in_progress.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                {isRTL ? 'المكتملة' : 'Completed'} ({groupedEvaluations.completed.length})
              </TabsTrigger>
            </TabsList>

            {Object.entries(groupedEvaluations).map(([key, evaluationList]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {evaluationList.map((evaluation) => (
                    <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                  ))}
                </div>
                {evaluationList.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isRTL ? 'لا توجد تقييمات' : 'No evaluations found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {isRTL ? 'لم يتم العثور على تقييمات في هذه الفئة' : 'No evaluations found in this category'}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </PageLayout>

      {/* Evaluation Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isRTL ? 'تفاصيل التقييم' : 'Evaluation Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvaluation && (
            <ScrollArea className="max-h-[80vh]">
              <div className="space-y-6 pr-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-lg">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {isRTL ? 'معلومات الفكرة' : 'Idea Information'}
                    </h3>
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'العنوان:' : 'Title:'}</strong> {ideas[selectedEvaluation.idea_id]?.title_ar}</p>
                      <p><strong>{isRTL ? 'الحالة:' : 'Status:'}</strong> 
                        <Badge className="ml-2">{ideas[selectedEvaluation.idea_id]?.status}</Badge>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {isRTL ? 'معلومات المقيم' : 'Evaluator Information'}
                    </h3>
                    <div className="space-y-2">
                      <p><strong>{isRTL ? 'الاسم:' : 'Name:'}</strong> {profiles[selectedEvaluation.evaluator_id]?.name}</p>
                      <p><strong>{isRTL ? 'النوع:' : 'Type:'}</strong> 
                        <Badge className="ml-2">{selectedEvaluation.evaluator_type}</Badge>
                      </p>
                      <p><strong>{isRTL ? 'التاريخ:' : 'Date:'}</strong> {new Date(selectedEvaluation.evaluation_date || selectedEvaluation.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{getOverallScore(selectedEvaluation)}/10</div>
                      <div className="text-sm text-muted-foreground">{isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}</div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {isRTL ? 'النتائج التفصيلية' : 'Detailed Scores'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: 'technical_feasibility', label: isRTL ? 'الجدوى التقنية' : 'Technical Feasibility', value: selectedEvaluation.technical_feasibility },
                      { key: 'financial_viability', label: isRTL ? 'الجدوى المالية' : 'Financial Viability', value: selectedEvaluation.financial_viability },
                      { key: 'market_potential', label: isRTL ? 'إمكانات السوق' : 'Market Potential', value: selectedEvaluation.market_potential },
                      { key: 'strategic_alignment', label: isRTL ? 'التوافق الاستراتيجي' : 'Strategic Alignment', value: selectedEvaluation.strategic_alignment },
                      { key: 'innovation_level', label: isRTL ? 'مستوى الابتكار' : 'Innovation Level', value: selectedEvaluation.innovation_level },
                      { key: 'implementation_complexity', label: isRTL ? 'تعقيد التنفيذ' : 'Implementation Complexity', value: selectedEvaluation.implementation_complexity }
                    ].map((item) => (
                      <Card key={item.key} className="text-center p-4">
                        <div className="text-2xl font-bold mb-2">{item.value || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <Progress value={(item.value || 0) * 10} className="mt-2 h-2" />
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Qualitative Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 border-l-4 border-l-success">
                    <h4 className="font-semibold text-success mb-3">{isRTL ? 'نقاط القوة' : 'Strengths'}</h4>
                    <p className="text-sm">{selectedEvaluation.strengths || (isRTL ? 'لم يتم تقديم نقاط قوة' : 'No strengths provided')}</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-destructive">
                    <h4 className="font-semibold text-destructive mb-3">{isRTL ? 'نقاط الضعف' : 'Weaknesses'}</h4>
                    <p className="text-sm">{selectedEvaluation.weaknesses || (isRTL ? 'لم يتم تقديم نقاط ضعف' : 'No weaknesses provided')}</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-info">
                    <h4 className="font-semibold text-info mb-3">{isRTL ? 'التوصيات' : 'Recommendations'}</h4>
                    <p className="text-sm">{selectedEvaluation.recommendations || (isRTL ? 'لم يتم تقديم توصيات' : 'No recommendations provided')}</p>
                  </Card>
                  <Card className="p-4 border-l-4 border-l-warning">
                    <h4 className="font-semibold text-warning mb-3">{isRTL ? 'الخطوات التالية' : 'Next Steps'}</h4>
                    <p className="text-sm">{selectedEvaluation.next_steps || (isRTL ? 'لم يتم تحديد خطوات تالية' : 'No next steps provided')}</p>
                  </Card>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {isRTL ? 'التعليقات والملاحظات' : 'Comments & Feedback'}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder={isRTL ? 'إضافة تعليق...' : 'Add a comment...'}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1"
                        rows={3}
                      />
                      <Button onClick={addComment} disabled={!newComment.trim()}>
                        {isRTL ? 'إضافة' : 'Post'}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments.map((comment, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.profiles?.name || 'Anonymous'}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          {isRTL ? 'لا توجد تعليقات بعد' : 'No comments yet'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default EvaluationsPage;