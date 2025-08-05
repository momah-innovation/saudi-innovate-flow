import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  FileCheck, 
  TrendingUp, 
  Calendar,
  User
} from 'lucide-react';

interface EvaluationCardData {
  id: string;
  idea_title: string;
  evaluator_name: string;
  evaluator_type: string;
  overall_score: number;
  technical_feasibility: number;
  financial_viability: number;
  market_potential: number;
  strategic_alignment: number;
  innovation_level: number;
  implementation_complexity: number;
  evaluation_date: string;
  created_at: string;
}

interface EnhancedEvaluationCardProps {
  evaluation: EvaluationCardData;
  viewMode: 'cards' | 'list' | 'grid';
  onView: (evaluation: EvaluationCardData) => void;
  onEdit: (evaluation: EvaluationCardData) => void;
  onDelete: (evaluation: EvaluationCardData) => void;
}

export function EnhancedEvaluationCard({
  evaluation,
  viewMode,
  onView,
  onEdit,
  onDelete
}: EnhancedEvaluationCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'score-excellent border-success/20';
    if (score >= 6) return 'score-good border-warning/20';
    if (score >= 4) return 'score-average border-warning/20';
    return 'score-poor border-destructive/20';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 8) return <Star className="w-4 h-4 icon-success" />;
    if (score >= 6) return <TrendingUp className="w-4 h-4 icon-warning" />;
    return <FileCheck className="w-4 h-4 icon-error" />;
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(evaluation.overall_score)}
                <div>
                  <h3 className="font-medium text-sm">{evaluation.idea_title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {evaluation.evaluator_name}
                  </p>
                </div>
              </div>
              
              <Badge variant="outline" className="text-xs">
                {evaluation.evaluator_type}
              </Badge>
              
              <Badge className={`${getScoreColor(evaluation.overall_score)} text-xs`}>
                {evaluation.overall_score}/10
              </Badge>
              
              <span className="text-xs text-muted-foreground">
                {new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => onView(evaluation)}>
                <Eye className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(evaluation)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(evaluation)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover-scale group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {evaluation.idea_title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {evaluation.evaluator_type}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />
                {evaluation.evaluator_name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(evaluation.overall_score)}
            <Badge className={getScoreColor(evaluation.overall_score)}>
              {evaluation.overall_score}/10
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Technical</div>
            <div className="text-sm font-bold">{evaluation.technical_feasibility || 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Financial</div>
            <div className="text-sm font-bold">{evaluation.financial_viability || 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Market</div>
            <div className="text-sm font-bold">{evaluation.market_potential || 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Strategic</div>
            <div className="text-sm font-bold">{evaluation.strategic_alignment || 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Innovation</div>
            <div className="text-sm font-bold">{evaluation.innovation_level || 'N/A'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Complexity</div>
            <div className="text-sm font-bold">{evaluation.implementation_complexity || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {new Date(evaluation.evaluation_date || evaluation.created_at).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onView(evaluation)}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(evaluation)}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(evaluation)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}