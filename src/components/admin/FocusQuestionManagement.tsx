import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { AdminFocusQuestionWizard } from "./AdminFocusQuestionWizard";
import { FocusQuestionDetailView } from "./focus-questions/FocusQuestionDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/error-handler";

import { 
  HelpCircle, 
  Target, 
  Hash,
  Shield,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

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

const getSensitivityConfig = (t: (key: string, fallback: string) => string) => ({
  normal: { label: t('sensitivity.normal', 'عادي'), variant: 'secondary' as const },
  sensitive: { label: t('sensitivity.sensitive', 'حساس'), variant: 'destructive' as const }
});

const typeConfig = {
  open_ended: { label: 'سؤال مفتوح', variant: 'default' as const },
  multiple_choice: { label: 'متعدد الخيارات', variant: 'secondary' as const },
  yes_no: { label: 'نعم/لا', variant: 'outline' as const },
  rating: { label: 'تقييم', variant: 'default' as const },
  ranking: { label: 'ترتيب', variant: 'secondary' as const }
};

export function FocusQuestionManagement({ viewMode, searchTerm, showAddDialog, onAddDialogChange }: FocusQuestionManagementProps) {
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<FocusQuestion | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  const sensitivityConfig = getSensitivityConfig(t);

  useEffect(() => {
    fetchFocusQuestions();
  }, []);

  const fetchFocusQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('focus_questions')
        .select(`
          *,
          challenges!challenge_id(id, title_ar, status, sensitivity_level)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFocusQuestions(data || []);
    } catch (error) {
      logger.error('Error fetching focus questions', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('focus_questions.delete_success'),
        description: t('focus_questions.delete_success_description')
      });

      fetchFocusQuestions();
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
        title="لا توجد أسئلة محورية"
        description="ابدأ بإنشاء سؤال محوري جديد لتوجيه المبتكرين"
        action={{
          label: "إنشاء سؤال محوري جديد",
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
            subtitle={question.challenge?.title_ar ? `التحدي: ${question.challenge.title_ar}` : 'سؤال عام'}
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
                label: question.challenge ? 'مرتبط بتحدي' : 'سؤال عام',
                variant: question.challenge ? 'outline' : 'secondary'
              }
            ]}
            metadata={[
              {
                icon: <Hash className="w-4 h-4" />,
                label: 'الترتيب',
                value: question.order_sequence.toString()
              },
              {
                icon: <Shield className="w-4 h-4" />,
                label: t('focus_questions.sensitivity', 'الحساسية'),
                value: question.is_sensitive ? sensitivityConfig.sensitive.label : sensitivityConfig.normal.label
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                label: 'تاريخ الإنشاء',
                value: format(new Date(question.created_at), 'dd/MM/yyyy')
              },
              ...(question.challenge ? [{
                icon: <Target className="w-4 h-4" />,
                label: 'التحدي',
                value: question.challenge.title_ar
              }] : [])
            ]}
            actions={[
              {
                type: 'view' as const,
                label: 'عرض',
                onClick: () => handleView(question)
              },
              {
                type: 'edit' as const,
                label: 'تعديل',
                onClick: () => handleEdit(question)
              },
              {
                type: 'delete' as const,
                label: 'حذف',
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
          fetchFocusQuestions();
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
        onRefresh={fetchFocusQuestions}
      />
    </>
  );
}