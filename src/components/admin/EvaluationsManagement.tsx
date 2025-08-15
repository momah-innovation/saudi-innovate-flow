import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Edit, Filter, Search, FileCheck, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/error-handler";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { formatDate } from '@/utils/unified-date-handler';
import { AdminEvaluationsHero } from "@/components/admin/AdminEvaluationsHero";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { EnhancedEvaluationCard } from "@/components/evaluations/EnhancedEvaluationCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  description_en?: string;
  status: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

interface EvaluationsManagementProps {
  viewMode?: 'cards' | 'list' | 'grid';
  searchTerm?: string;
  showAddDialog?: boolean;
  onAddDialogChange?: (open: boolean) => void;
}

export function EvaluationsManagement({ 
  viewMode = 'cards',
  searchTerm: externalSearchTerm = '',
  showAddDialog = false,
  onAddDialogChange
}: EvaluationsManagementProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [ideas, setIdeas] = useState<{ [key: string]: Idea }>({});
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  const expertRoleTypes = getSettingValue('expert_role_types', []) as string[];
  const evaluatorTypes = getSettingValue('evaluator_types', []) as string[];

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
          .select("id, title_ar, title_en, description_ar, description_en, status")
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
      logger.error("Error fetching evaluations", error);
      toast({
        title: t('error.title'),
        description: t('error.fetch_evaluations_failed'),
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
      evaluation.innovation_level,
      evaluation.implementation_complexity
    ].filter(score => score !== null && score !== undefined);
    
    return scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : "N/A";
  };

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return "bg-muted text-muted-foreground";
    if (score >= 8) return "score-excellent";
    if (score >= 6) return "score-good";
    return "score-poor";
  };

  const currentSearchTerm = externalSearchTerm || searchTerm;
  
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesType = filterType === "all" || evaluation.evaluator_type === filterType;
    const matchesSearch = currentSearchTerm === "" || 
      ideas[evaluation.idea_id]?.title_ar?.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
      profiles[evaluation.evaluator_id]?.name?.toLowerCase().includes(currentSearchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate metrics for hero
  const totalEvaluations = evaluations.length;
  const pendingEvaluations = evaluations.filter(e => !e.evaluation_date).length;
  const completedEvaluations = evaluations.filter(e => e.evaluation_date).length;
  const averageScore = evaluations.length > 0 ? 
    Number((evaluations.reduce((sum, e) => sum + Number(getOverallScore(e)), 0) / evaluations.length).toFixed(1)) : 0;
  const topPerformingIdeas = evaluations.filter(e => Number(getOverallScore(e)) >= 8).length;
  const criticalReviews = evaluations.filter(e => Number(getOverallScore(e)) < 5).length;
  const activeEvaluators = Object.keys(profiles).length;
  const evaluationRate = evaluations.length > 0 ? Math.round((completedEvaluations / totalEvaluations) * 100) : 0;

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{t('loading.evaluations')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Hero Dashboard */}
      <AdminEvaluationsHero 
        totalEvaluations={totalEvaluations}
        pendingEvaluations={pendingEvaluations}
        completedEvaluations={completedEvaluations}
        averageScore={averageScore}
        topPerformingIdeas={topPerformingIdeas}
        criticalReviews={criticalReviews}
        activeEvaluators={activeEvaluators}
        evaluationRate={evaluationRate}
      />

      <ViewLayouts viewMode={viewMode}>
        {loading ? [
          <div key="loading" className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('loading.evaluations')}</p>
          </div>
        ] : filteredEvaluations.length > 0 ? 
          filteredEvaluations.map((evaluation) => (
            <EnhancedEvaluationCard
              key={evaluation.id}
              evaluation={{
                ...evaluation,
                 idea_title: ideas[evaluation.idea_id]?.title_ar || t('common.unknown_idea', 'Unknown Idea'),
                 evaluator_name: profiles[evaluation.evaluator_id]?.name || t('common.unknown_evaluator', 'Unknown Evaluator'),
                overall_score: Number(getOverallScore(evaluation))
              }}
              viewMode={viewMode}
              onView={(evalData) => {
                const originalEval = evaluations.find(e => e.id === evalData.id);
                if (originalEval) handleViewEvaluation(originalEval);
              }}
              onEdit={(evalData) => {
                const originalEval = evaluations.find(e => e.id === evalData.id);
                if (originalEval) {
                  setSelectedEvaluation(originalEval);
                  setIsEditMode(true);
                  setShowDialog(true);
                }
              }}
              onDelete={(evalData) => {
                const originalEval = evaluations.find(e => e.id === evalData.id);
                if (originalEval) {
                  setEvaluationToDelete(originalEval);
                  setShowDeleteConfirmation(true);
                }
              }}
            />
          )) : [
          <div key="empty" className="text-center py-12">
            <FileCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('evaluations.no_evaluations_found')}</p>
            <p className="text-muted-foreground">{t('evaluations.no_evaluations_criteria')}</p>
          </div>
        ]}
      </ViewLayouts>

      {/* View Evaluation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('evaluations.evaluation_details')}</DialogTitle>
          </DialogHeader>
          
          {selectedEvaluation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.idea_information')}</h3>
                  <p className="text-sm"><strong>{t('form.title_label')}:</strong> {ideas[selectedEvaluation.idea_id]?.title_ar || t('common.unknown')}</p>
                  <p className="text-sm"><strong>{t('form.status_label')}:</strong> {ideas[selectedEvaluation.idea_id]?.status || t('common.unknown')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.evaluator_information')}</h3>
                  <p className="text-sm"><strong>{t('form.name_label')}:</strong> {profiles[selectedEvaluation.evaluator_id]?.name || t('common.unknown')}</p>
                  <p className="text-sm"><strong>{t('form.type_label')}:</strong> {selectedEvaluation.evaluator_type}</p>
                  <p className="text-sm"><strong>{t('form.date_label')}:</strong> {formatDate(selectedEvaluation.evaluation_date || selectedEvaluation.created_at)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.technical_feasibility || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.technical_feasibility')}</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.financial_viability || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.financial_viability')}</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.market_potential || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.market_potential')}</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.strategic_alignment || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.strategic_alignment')}</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.innovation_level || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.innovation_level')}</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.implementation_complexity || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{t('evaluations.implementation_complexity')}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.strengths')}</h3>
                  <p className="text-sm status-success p-3 rounded border">{selectedEvaluation.strengths || t('evaluations.no_strengths_provided')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.weaknesses')}</h3>
                  <p className="text-sm status-error p-3 rounded border">{selectedEvaluation.weaknesses || t('evaluations.no_weaknesses_provided')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.recommendations')}</h3>
                  <p className="text-sm status-info p-3 rounded border">{selectedEvaluation.recommendations || t('evaluations.no_recommendations_provided')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('evaluations.next_steps')}</h3>
                  <p className="text-sm status-warning p-3 rounded border">{selectedEvaluation.next_steps || t('evaluations.no_next_steps_provided')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}