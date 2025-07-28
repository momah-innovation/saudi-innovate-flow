import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { IdeaDetailView } from "./IdeaDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

import { 
  Lightbulb, 
  Target, 
  Star,
  TrendingUp,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns";

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level: string;
  overall_score: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  created_at: string;
  updated_at: string;
  innovator?: {
    user_id: string;
    innovation_score: number;
  };
  challenge?: {
    id: string;
    title_ar: string;
    status: string;
  };
  focus_question?: {
    id: string;
    question_text_ar: string;
  };
}

interface IdeasManagementListProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  filters: {
    status: string;
    challenge: string;
    innovator: string;
    maturityLevel: string;
    scoreRange: [number, number];
  };
  onEdit: (idea: Idea) => void;
  onView: (idea: Idea) => void;
  onRefresh: () => void;
}

const statusConfig = {
  submitted: { label: 'مُرسلة', variant: 'secondary' as const },
  under_review: { label: 'قيد المراجعة', variant: 'default' as const },
  approved: { label: 'موافق عليها', variant: 'default' as const },
  rejected: { label: 'مرفوضة', variant: 'destructive' as const },
  in_development: { label: 'قيد التطوير', variant: 'secondary' as const },
  implemented: { label: 'منفذة', variant: 'default' as const }
};

const maturityConfig = {
  concept: { label: 'مفهوم', variant: 'outline' as const },
  prototype: { label: 'نموذج أولي', variant: 'secondary' as const },
  pilot: { label: 'تجريبي', variant: 'default' as const },
  scaled: { label: 'قابل للتوسع', variant: 'default' as const }
};

export function IdeasManagementList({ 
  viewMode, 
  searchTerm, 
  selectedItems,
  onSelectedItemsChange,
  filters,
  onEdit,
  onView,
  onRefresh 
}: IdeasManagementListProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          innovators!innovator_id(user_id, innovation_score),
          challenges!challenge_id(id, title_ar, status),
          focus_questions!focus_question_id(id, question_text_ar)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الأفكار",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDetailView(true);
  };

  const handleDelete = async (idea: Idea) => {
    if (!confirm(`هل أنت متأكد من حذف "${idea.title_ar}"؟`)) return;
    
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', idea.id);
      
      if (error) throw error;
      
      setIdeas(prev => prev.filter(i => i.id !== idea.id));
      toast({
        title: "تم بنجاح",
        description: "تم حذف الفكرة بنجاح"
      });
    } catch (error) {
      console.error('Error deleting idea:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الفكرة",
        variant: "destructive"
      });
    }
  };

  const getStatusLabel = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.label || status;
  };

  const getStatusVariant = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.variant || 'secondary';
  };

  const getMaturityLabel = (maturity: string) => {
    return maturityConfig[maturity as keyof typeof maturityConfig]?.label || maturity;
  };

  const getMaturityVariant = (maturity: string) => {
    return maturityConfig[maturity as keyof typeof maturityConfig]?.variant || 'outline';
  };

  // Filter ideas based on search term and filters
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.challenge?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || idea.status === filters.status;
    const matchesMaturity = !filters.maturityLevel || idea.maturity_level === filters.maturityLevel;
    const matchesScore = idea.overall_score >= filters.scoreRange[0] && idea.overall_score <= filters.scoreRange[1];
    
    return matchesSearch && matchesStatus && matchesMaturity && matchesScore;
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

  if (filteredIdeas.length === 0) {
    return (
      <EmptyState
        icon={<Lightbulb className="w-12 h-12 text-muted-foreground" />}
        title="لا توجد أفكار"
        description="ابدأ بإنشاء فكرة جديدة أو قم بتغيير معايير البحث"
        action={{
          label: "إنشاء فكرة جديدة",
          onClick: () => {
            setSelectedIdea(null);
            // onAddDialogChange(true); // This would need to be passed down
          }
        }}
      />
    );
  }

  return (
    <>
      <ViewLayouts viewMode={viewMode}>
        {filteredIdeas.map((idea) => (
          <ManagementCard
            key={idea.id}
            id={idea.id}
            title={idea.title_ar}
            subtitle={idea.challenge?.title_ar ? `التحدي: ${idea.challenge.title_ar}` : 'فكرة مستقلة'}
            onClick={() => handleView(idea)}
            badges={[
              {
                label: getStatusLabel(idea.status),
                variant: getStatusVariant(idea.status)
              },
              {
                label: getMaturityLabel(idea.maturity_level),
                variant: getMaturityVariant(idea.maturity_level)
              },
              {
                label: `${idea.overall_score}/100`,
                variant: idea.overall_score >= 70 ? 'default' : idea.overall_score >= 50 ? 'secondary' : 'outline'
              }
            ]}
            metadata={[
              {
                icon: <Star className="w-4 h-4" />,
                label: 'النقاط الإجمالية',
                value: `${idea.overall_score}/100`
              },
              {
                icon: <TrendingUp className="w-4 h-4" />,
                label: 'مستوى النضج',
                value: getMaturityLabel(idea.maturity_level)
              },
              {
                icon: <Calendar className="w-4 h-4" />,
                label: 'تاريخ الإرسال',
                value: format(new Date(idea.created_at), 'dd/MM/yyyy')
              },
              ...(idea.challenge ? [{
                icon: <Target className="w-4 h-4" />,
                label: 'التحدي',
                value: idea.challenge.title_ar
              }] : []),
              {
                icon: <User className="w-4 h-4" />,
                label: 'المبتكر',
                value: `نقاط الابتكار: ${idea.innovator?.innovation_score || 0}`
              }
            ]}
            actions={[
              {
                type: 'view' as const,
                label: 'عرض',
                onClick: () => handleView(idea)
              },
              {
                type: 'edit' as const,
                label: 'تعديل',
                onClick: () => onEdit(idea)
              },
              {
                type: 'delete' as const,
                label: 'حذف',
                onClick: () => handleDelete(idea)
              }
            ]}
            viewMode={viewMode}
          />
        ))}
      </ViewLayouts>

      <IdeaDetailView
        isOpen={showDetailView}
        onClose={() => {
          setShowDetailView(false);
          setSelectedIdea(null);
        }}
        idea={selectedIdea}
        onEdit={(idea) => {
          setSelectedIdea(idea);
          setShowDetailView(false);
          onEdit(idea);
        }}
        onRefresh={fetchIdeas}
      />
    </>
  );
}