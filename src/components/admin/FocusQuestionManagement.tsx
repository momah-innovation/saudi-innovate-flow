import React, { useState, useEffect } from 'react';
import { useFocusQuestionManagement } from "@/hooks/useFocusQuestionManagement";
import { ManagementCard } from "@/components/ui/management-card";
import { AdminFocusQuestionWizard } from "./AdminFocusQuestionWizard";
import { FocusQuestionDetailView } from "./focus-questions/FocusQuestionDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/error-handler";
import { formatDate } from '@/utils/unified-date-handler';

import { 
  HelpCircle, 
  Target, 
  Hash,
  Shield,
  Calendar
} from "lucide-react";
import { dateHandler } from '@/utils/unified-date-handler';

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
  created_at: string;
  updated_at: string;
}

interface FocusQuestionManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

const getSensitivityConfig = (t: (key: string) => string) => ({
  normal: { label: t('sensitivity.normal'), variant: 'secondary' as const },
  sensitive: { label: t('sensitivity.sensitive'), variant: 'destructive' as const }
});

const getTypeConfig = (t: (key: string) => string) => ({
  open_ended: { label: t('question_type.open_ended'), variant: 'default' as const },
  multiple_choice: { label: t('question_type.multiple_choice'), variant: 'secondary' as const },
  yes_no: { label: t('question_type.yes_no'), variant: 'outline' as const },
  rating: { label: t('question_type.rating'), variant: 'default' as const },
  ranking: { label: t('question_type.ranking'), variant: 'secondary' as const }
});

export function FocusQuestionManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: FocusQuestionManagementProps) {
  const { 
    focusQuestions: hookFocusQuestions, 
    loading, 
    loadFocusQuestions,
    deleteFocusQuestion
  } = useFocusQuestionManagement();
  
  const [selectedQuestion, setSelectedQuestion] = useState<FocusQuestion | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  const sensitivityConfig = getSensitivityConfig(t);
  const typeConfig = getTypeConfig(t);
  
  // Convert hook data to expected format
  const focusQuestions: FocusQuestion[] = hookFocusQuestions || [];

  useEffect(() => {
    // Hook automatically loads data, no manual fetching needed
  }, []);

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteFocusQuestion(id);
      
      toast({
        title: t('focus_questions.delete_success'),
        description: t('focus_questions.delete_success_description')
      });
    } catch (error) {
      toast({
        title: t('focus_questions.delete_error'),
        description: t('focus_questions.delete_error_description'),
        variant: 'destructive'
      });
      logger.error('Error deleting focus question', error);
    }
  };

  const handleView = (question: FocusQuestion) => {
    setSelectedQuestion(question);
    setShowDetailView(true);
  };

  const handleEdit = (question: FocusQuestion) => {
    setSelectedQuestion(question);
    onAddDialogChange(true);
  };

  const handleDelete = (question: FocusQuestion) => {
    handleDeleteQuestion(question.id);
  };

  const getTypeLabel = (type: string) => {
    return typeConfig[type as keyof typeof typeConfig]?.label || type;
  };

  const getTypeVariant = (type: string) => {
    return typeConfig[type as keyof typeof typeConfig]?.variant || 'secondary';
  };

  // Filter questions based on search term
  const filteredQuestions = focusQuestions.filter(question => {
    const matchesSearch = question.question_text_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.challenge?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-card rounded-lg h-64" />
        ))}
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <EmptyState
        icon={<HelpCircle className="w-12 h-12 text-muted-foreground" />}
        title={t('focus_questions.empty_title')}
        description={t('focus_questions.empty_description')}
        action={{
          label: t('focus_questions.create_new'),
          onClick: () => {
            setSelectedQuestion(null);
            onAddDialogChange(true);
          }
        }}
      />
    );
  }

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {filteredQuestions.map((question) => (
          <ManagementCard
            key={question.id}
            id={question.id}
            title={question.question_text_ar}
            subtitle={question.challenge?.title_ar ? `${t('challenge')}: ${question.challenge.title_ar}` : t('general_question')}
            onClick={() => handleView(question)}
            badges={[
              {
                label: getTypeLabel(question.question_type),
                variant: getTypeVariant(question.question_type)
              },
              {
                label: question.is_sensitive ? sensitivityConfig.sensitive.label : sensitivityConfig.normal.label,
                variant: question.is_sensitive ? sensitivityConfig.sensitive.variant : sensitivityConfig.normal.variant
              },
              {
                label: question.challenge ? t('linked_to_challenge') : t('general_question'),
                variant: question.challenge ? 'outline' : 'secondary'
              }
            ]}
            metadata={[
              {
                icon: <Hash className="w-4 h-4" />,
                label: t('order'),
                value: question.order_sequence.toString()
              },
              {
                icon: <Shield className="w-4 h-4" />,
                label: t('focus_questions.sensitivity'),
                value: question.is_sensitive ? sensitivityConfig.sensitive.label : sensitivityConfig.normal.label
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                label: t('creation_date'),
                value: formatDate(question.created_at, 'dd/MM/yyyy')
              },
              ...(question.challenge ? [{
                icon: <Target className="w-4 h-4" />,
                label: t('challenge'),
                value: question.challenge.title_ar
              }] : [])
            ]}
            actions={[
              {
                type: 'view' as const,
                label: t('button.view'),
                onClick: () => handleView(question)
              },
              {
                type: 'edit' as const,
                label: t('button.edit'),
                onClick: () => handleEdit(question)
              },
              {
                type: 'delete' as const,
                label: t('button.delete'),
                onClick: () => handleDelete(question)
              }
            ]}
            viewMode={viewMode}
          />
        ))}
      </ViewLayouts>

      <AdminFocusQuestionWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedQuestion(null);
        }}
        onSave={() => {
          loadFocusQuestions();
          onAddDialogChange(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
      />

      <FocusQuestionDetailView
        isOpen={showDetailView}
        onClose={() => {
          setShowDetailView(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onEdit={(question) => {
          setSelectedQuestion(question);
          setShowDetailView(false);
          onAddDialogChange(true);
        }}
        onRefresh={loadFocusQuestions}
      />
    </>
  );
}