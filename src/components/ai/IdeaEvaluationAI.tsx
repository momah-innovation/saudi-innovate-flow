import React, { useState } from 'react';
import { useTimerManager } from '@/utils/timerManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Lightbulb, Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { useToast } from '@/hooks/use-toast';

interface IdeaEvaluationProps {
  ideaId?: string;
  ideaTitle: string;
  ideaDescription: string;
  onEvaluationComplete?: (evaluation: AIEvaluation) => void;
}

interface AIEvaluation {
  overall_score: number;
  technical_feasibility: number;
  innovation_level: number;
  market_potential: number;
  implementation_difficulty: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  similar_ideas: Array<{
    title: string;
    similarity_score: number;
    id: string;
  }>;
  tags_suggestions: string[];
}

export const IdeaEvaluationAI: React.FC<IdeaEvaluationProps> = ({
  ideaId,
  ideaTitle,
  ideaDescription,
  onEvaluationComplete,
}) => {
  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'IdeaEvaluationAI',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({
    component: 'IdeaEvaluationAI',
    showToast: true,
    logError: true
  });
  
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const { setTimeout: scheduleTimeout } = useTimerManager();
  const [feedback, setFeedback] = useState('');
  const { isFeatureEnabled, getFeatureConfig } = useAIFeatures();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();

  const handleEvaluate = async () => {
    if (!isFeatureEnabled('idea_evaluation')) {
      toast({
        title: t('idea_evaluation_ai.feature_unavailable'),
        description: t('idea_evaluation_ai.feature_not_enabled'),
        variant: 'destructive',
      });
      return;
    }

    return withLoading('evaluate-idea', async () => {
      // Simulate AI evaluation - in real implementation, this would call an Edge Function
      await new Promise(resolve => scheduleTimeout(() => resolve(undefined), 3000));
      
      const mockEvaluation: AIEvaluation = {
        overall_score: 78,
        technical_feasibility: 85,
        innovation_level: 72,
        market_potential: 80,
        implementation_difficulty: 65,
        strengths: [
          'حل مبتكر لمشكلة حقيقية',
          'قابلية تطبيق عالية',
          'إمكانية توسع جيدة',
          'تأثير إيجابي على المجتمع'
        ],
        weaknesses: [
          'يحتاج لاستثمار أولي كبير',
          'قد يواجه تحديات تنظيمية',
          'يتطلب خبرات تقنية متخصصة'
        ],
        recommendations: [
          'إجراء دراسة جدوى مفصلة',
          'البحث عن شركاء استراتيجيين',
          'تطوير نموذج أولي للاختبار',
          'دراسة المتطلبات التنظيمية'
        ],
        similar_ideas: [
          { title: 'منصة الخدمات الذكية', similarity_score: 0.75, id: '1' },
          { title: 'نظام إدارة المدن', similarity_score: 0.68, id: '2' },
        ],
        tags_suggestions: [
          'تقنية', 'ذكاء اصطناعي', 'مدن ذكية', 'خدمات حكومية', 'تحول رقمي'
        ]
      };

      setEvaluation(mockEvaluation);
      onEvaluationComplete?.(mockEvaluation);
      return mockEvaluation;
    }, {
      successMessage: t('idea_evaluation_ai.evaluation_success'),
      errorMessage: t('idea_evaluation_ai.evaluation_failed'),
      logContext: { ideaId, ideaTitle: ideaTitle.substring(0, 50), action: 'evaluate_idea' }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return AlertTriangle;
  };

  if (!isFeatureEnabled('idea_evaluation')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('idea_evaluation_ai.title')}
          </CardTitle>
          <CardDescription>
            {t('idea_evaluation_ai.feature_disabled')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('idea_evaluation_ai.enable_feature')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {t('idea_evaluation_ai.title')}
          </CardTitle>
          <CardDescription>
            {t('idea_evaluation_ai.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!evaluation ? (
            <div className="text-center py-8">
              <Button onClick={handleEvaluate} disabled={isLoading('evaluate-idea')} className="mb-4">
                {isLoading('evaluate-idea') ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t('idea_evaluation_ai.evaluating')}
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    {t('idea_evaluation_ai.evaluate_idea')}
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('idea_evaluation_ai.click_to_evaluate')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  <span className={getScoreColor(evaluation.overall_score)}>
                    {evaluation.overall_score}%
                  </span>
                </div>
                <p className="text-muted-foreground">{t('idea_evaluation_ai.overall_score')}</p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الجدوى التقنية</span>
                    <span className={getScoreColor(evaluation.technical_feasibility)}>
                      {evaluation.technical_feasibility}%
                    </span>
                  </div>
                  <Progress value={evaluation.technical_feasibility} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>مستوى الابتكار</span>
                    <span className={getScoreColor(evaluation.innovation_level)}>
                      {evaluation.innovation_level}%
                    </span>
                  </div>
                  <Progress value={evaluation.innovation_level} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>إمكانية السوق</span>
                    <span className={getScoreColor(evaluation.market_potential)}>
                      {evaluation.market_potential}%
                    </span>
                  </div>
                  <Progress value={evaluation.market_potential} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>صعوبة التنفيذ</span>
                    <span className={getScoreColor(100 - evaluation.implementation_difficulty)}>
                      {evaluation.implementation_difficulty}%
                    </span>
                  </div>
                  <Progress value={evaluation.implementation_difficulty} className="h-2" />
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    {t('idea_evaluation_ai.strengths')}
                  </h4>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Star className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    {t('idea_evaluation_ai.improvement_areas')}
                  </h4>
                  <ul className="space-y-2">
                    {evaluation.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  {t('idea_evaluation_ai.recommendations')}
                </h4>
                <ul className="space-y-2">
                  {evaluation.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Similar Ideas */}
              {evaluation.similar_ideas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">{t('idea_evaluation_ai.similar_ideas')}</h4>
                  <div className="space-y-2">
                    {evaluation.similar_ideas.map((idea, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">{idea.title}</span>
                        <Badge variant="outline">
                          {Math.round(idea.similarity_score * 100)}% {t('idea_evaluation_ai.similarity')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              <div>
                <h4 className="font-semibold mb-3">{t('idea_evaluation_ai.suggested_tags')}</h4>
                <div className="flex flex-wrap gap-2">
                  {evaluation.tags_suggestions.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="space-y-3">
                <h4 className="font-semibold">{t('idea_evaluation_ai.feedback_question')}</h4>
                <Textarea
                  placeholder={t('idea_evaluation_ai.feedback_placeholder')}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button variant="outline" size="sm">
                  {t('idea_evaluation_ai.send_feedback')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};