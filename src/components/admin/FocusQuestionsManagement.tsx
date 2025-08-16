import React, { useState, useEffect } from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useFocusQuestionManagement } from '@/hooks/useFocusQuestionManagement';
import { AdminFocusQuestionWizard } from './AdminFocusQuestionWizard';
import { HelpCircle, Plus } from 'lucide-react';

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_text_en?: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
  challenge_id?: string;
  challenge?: Challenge;
}

const FocusQuestionsManagement = () => {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { 
    focusQuestions, 
    loading, 
    error, 
    loadFocusQuestions, 
    deleteFocusQuestion 
  } = useFocusQuestionManagement();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await loadFocusQuestions();
    // Mock challenges data since we don't have useChallengeManagement available
    setChallenges([
      { id: '1', title_ar: 'تحدي التطبيقات المبتكرة', status: 'active', sensitivity_level: 'normal' },
      { id: '2', title_ar: 'تحدي الذكاء الاصطناعي', status: 'active', sensitivity_level: 'high' }
    ]);
  };

  const handleEdit = (question: FocusQuestion) => {
    setEditingQuestion(question);
    setShowWizard(true);
  };

  const handleWizardSave = () => {
    setShowWizard(false);
    setEditingQuestion(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('focus_questions.delete_confirm'))) return;
    
    try {
      await deleteFocusQuestion(id);
      toast({
        title: t('focus_questions.delete_success_title'),
        description: t('focus_questions.delete_success_description'),
      });
    } catch (error) {
      toast({
        title: t('focus_questions.delete_error_title'),
        description: t('focus_questions.delete_error_description'),
        variant: "destructive",
      });
    }
  };

  const filteredQuestions = focusQuestions.filter(question =>
    question.question_text_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.challenge_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout
      title={t('focus_questions.management_title')}
      description={t('focus_questions.management_description')}
      itemCount={filteredQuestions.length}
      primaryAction={{
        label: t('focus_questions.add_question'),
        icon: <Plus className="w-4 h-4" />,
        onClick: () => {
          setEditingQuestion(null);
          setShowWizard(true);
        }
      }}
      className="space-y-6"
    >
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder={t('focus_questions.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-card rounded-lg h-48" />
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-12 h-12 text-muted-foreground" />}
          title={t('focus_questions.no_questions_title')}
          description={t('focus_questions.no_questions_description')}
          action={{
            label: t('focus_questions.create_question'),
            onClick: () => {
              setEditingQuestion(null);
              setShowWizard(true);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {question.question_text_ar}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{question.question_type}</Badge>
                    {question.is_sensitive && (
                      <Badge variant="destructive">{t('focus_questions.sensitive_label')}</Badge>
                    )}
                  </div>
                  {question.challenge_id && (
                    <p className="text-sm text-muted-foreground">
                      {t('focus_questions.challenge_prefix')} {(() => {
                        const challenge = challenges.find(c => c.id === question.challenge_id);
                        return challenge?.title_ar || question.challenge_id;
                      })()}
                    </p>
                  )}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(question)}
                    >
                      {t('focus_questions.edit_action')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(question.id)}
                    >
                      {t('focus_questions.delete_action')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showWizard && (
        <AdminFocusQuestionWizard
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          question={editingQuestion}
          onSave={handleWizardSave}
        />
      )}
    </PageLayout>
  );
};

export default FocusQuestionsManagement;