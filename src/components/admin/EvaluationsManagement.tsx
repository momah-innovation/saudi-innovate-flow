import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Edit, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
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
  description_ar: string;
  status: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
}

export function EvaluationsManagement() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [ideas, setIdeas] = useState<{ [key: string]: Idea }>({});
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useTranslation();
  const { expertRoleTypes } = useSystemLists();

  const evaluatorTypes = expertRoleTypes;

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
          .select("id, title_ar, description_ar, status")
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
      evaluation.innovation_level,
      evaluation.implementation_complexity
    ].filter(score => score !== null && score !== undefined);
    
    return scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : "N/A";
  };

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return "bg-gray-100 text-gray-600";
    if (score >= 8) return "bg-green-100 text-green-700";
    if (score >= 6) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesType = filterType === "all" || evaluation.evaluator_type === filterType;
    const matchesSearch = searchTerm === "" || 
      ideas[evaluation.idea_id]?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profiles[evaluation.evaluator_id]?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading evaluations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Evaluations Management</h1>
          <p className="text-muted-foreground">Manage and review idea evaluations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search evaluations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Filter className="h-4 w-4" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {evaluatorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredEvaluations.map((evaluation) => (
          <Card key={evaluation.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">
                    {ideas[evaluation.idea_id]?.title_ar || t('unknownIdea')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {evaluation.evaluator_type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {profiles[evaluation.evaluator_id]?.name || t('unknownEvaluator')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getScoreColor(Number(getOverallScore(evaluation)))}>
                    Overall: {getOverallScore(evaluation)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewEvaluation(evaluation)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Technical</div>
                  <Badge className={getScoreColor(evaluation.technical_feasibility)} variant="secondary">
                    {evaluation.technical_feasibility || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Financial</div>
                  <Badge className={getScoreColor(evaluation.financial_viability)} variant="secondary">
                    {evaluation.financial_viability || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Market</div>
                  <Badge className={getScoreColor(evaluation.market_potential)} variant="secondary">
                    {evaluation.market_potential || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Strategic</div>
                  <Badge className={getScoreColor(evaluation.strategic_alignment)} variant="secondary">
                    {evaluation.strategic_alignment || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Innovation</div>
                  <Badge className={getScoreColor(evaluation.innovation_level)} variant="secondary">
                    {evaluation.innovation_level || "N/A"}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Complexity</div>
                  <Badge className={getScoreColor(evaluation.implementation_complexity)} variant="secondary">
                    {evaluation.implementation_complexity || "N/A"}
                  </Badge>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Evaluated on {new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEvaluations.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No evaluations found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Evaluation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evaluation Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvaluation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Idea Information</h3>
                  <p className="text-sm"><strong>Title:</strong> {ideas[selectedEvaluation.idea_id]?.title_ar || "Unknown"}</p>
                  <p className="text-sm"><strong>Status:</strong> {ideas[selectedEvaluation.idea_id]?.status || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Evaluator Information</h3>
                  <p className="text-sm"><strong>Name:</strong> {profiles[selectedEvaluation.evaluator_id]?.name || "Unknown"}</p>
                  <p className="text-sm"><strong>Type:</strong> {selectedEvaluation.evaluator_type}</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date(selectedEvaluation.evaluation_date || selectedEvaluation.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.technical_feasibility || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Technical Feasibility</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.financial_viability || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Financial Viability</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.market_potential || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Market Potential</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.strategic_alignment || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Strategic Alignment</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.innovation_level || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Innovation Level</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="text-2xl font-bold">{selectedEvaluation.implementation_complexity || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">Implementation Complexity</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Strengths</h3>
                  <p className="text-sm bg-green-50 p-3 rounded border">{selectedEvaluation.strengths || "No strengths provided"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Weaknesses</h3>
                  <p className="text-sm bg-red-50 p-3 rounded border">{selectedEvaluation.weaknesses || "No weaknesses provided"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <p className="text-sm bg-blue-50 p-3 rounded border">{selectedEvaluation.recommendations || "No recommendations provided"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p className="text-sm bg-yellow-50 p-3 rounded border">{selectedEvaluation.next_steps || "No next steps provided"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}