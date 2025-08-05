import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Lightbulb, Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useToast } from '@/hooks/use-toast';
import { useRTLAware } from '@/hooks/useRTLAware';

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
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { isFeatureEnabled, getFeatureConfig } = useAIFeatures();
  const { toast } = useToast();
  const { me } = useRTLAware();

  const handleEvaluate = async () => {
    if (!isFeatureEnabled('idea_evaluation')) {
      toast({
        title: 'غير متاح',
        description: 'ميزة تقييم الأفكار بالذكاء الاصطناعي غير مفعلة',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate AI evaluation - in real implementation, this would call an Edge Function
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
      
      toast({
        title: 'تم التقييم',
        description: 'تم تقييم الفكرة بنجاح باستخدام الذكاء الاصطناعي',
      });
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تقييم الفكرة، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
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
            تقييم الذكاء الاصطناعي
          </CardTitle>
          <CardDescription>
            ميزة تقييم الأفكار غير متاحة حالياً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              يرجى تفعيل ميزة تقييم الأفكار من إعداداتك
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
            تقييم الذكاء الاصطناعي
          </CardTitle>
          <CardDescription>
            احصل على تقييم مفصل لفكرتك باستخدام الذكاء الاصطناعي
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!evaluation ? (
            <div className="text-center py-8">
              <Button onClick={handleEvaluate} disabled={loading} className="mb-4">
                {loading ? (
                  <>
                    <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${me('2')}`} />
                    جاري التقييم...
                  </>
                ) : (
                  <>
                    <Brain className={`h-4 w-4 ${me('2')}`} />
                    تقييم الفكرة
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                انقر لبدء تقييم شامل لفكرتك
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
                <p className="text-muted-foreground">النتيجة الإجمالية</p>
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
                    نقاط القوة
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
                    نقاط التحسين
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
                  التوصيات
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
                  <h4 className="font-semibold mb-3">أفكار مشابهة</h4>
                  <div className="space-y-2">
                    {evaluation.similar_ideas.map((idea, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">{idea.title}</span>
                        <Badge variant="outline">
                          {Math.round(idea.similarity_score * 100)}% تشابه
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Tags */}
              <div>
                <h4 className="font-semibold mb-3">التصنيفات المقترحة</h4>
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
                <h4 className="font-semibold">هل كان التقييم مفيداً؟</h4>
                <Textarea
                  placeholder="شاركنا رأيك حول دقة التقييم..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button variant="outline" size="sm">
                  إرسال التعليق
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};