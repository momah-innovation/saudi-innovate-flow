import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { FocusQuestionWizard } from "../FocusQuestionWizard";
import { FocusQuestionDetailView } from "./FocusQuestionDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { ViewLayouts } from "@/components/ui/view-layouts";

import { 
  HelpCircle, 
  Target, 
  Hash,
  Shield,
  Plus,
  LayoutGrid,
  List,
  Grid3x3
} from "lucide-react";

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
  challenge_id?: string;
  challenge?: Challenge;
  created_at: string;
  updated_at: string;
}

export function FocusQuestionManagementList() {
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sensitivityFilter, setSensitivityFilter] = useState<string>("all");
  const [currentLayout, setCurrentLayout] = useState<'cards' | 'list' | 'grid'>('cards');
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<FocusQuestion | null>(null);
  const { focusQuestionTypes, sensitivityLevels, questionTypeOptions } = useSystemLists();
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();

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
      console.error('Error fetching focus questions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الأسئلة المحورية",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      
      setFocusQuestions(prev => prev.filter(q => q.id !== questionId));
      toast({
        title: "تم بنجاح",
        description: "تم حذف السؤال المحوري بنجاح"
      });
    } catch (error) {
      console.error('Error deleting focus question:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف السؤال المحوري",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (question: FocusQuestion) => {
    setSelectedQuestion(question);
    setShowWizard(true);
  };

  const handleView = (question: FocusQuestion) => {
    setSelectedQuestion(question);
    setShowDetails(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'open_ended': return 'default';
      case 'multiple_choice': return 'secondary';
      case 'yes_no': return 'outline';
      case 'rating': return 'warning';
      case 'ranking': return 'success';
      default: return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      open_ended: 'سؤال مفتوح',
      multiple_choice: 'متعدد الخيارات',
      yes_no: 'نعم/لا',
      rating: 'تقييم',
      ranking: 'ترتيب'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Load saved layout preference
  useEffect(() => {
    const savedLayout = localStorage.getItem('focus-question-layout') as 'cards' | 'list' | 'grid';
    if (savedLayout) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Save layout preference
  const handleLayoutChange = (layout: 'cards' | 'list' | 'grid') => {
    setCurrentLayout(layout);
    localStorage.setItem('focus-question-layout', layout);
  };

  const filteredQuestions = focusQuestions.filter(question => {
    const matchesSearch = question.question_text_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.challenge?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || question.question_type === typeFilter;
    const matchesSensitivity = sensitivityFilter === 'all' || 
                              (sensitivityFilter === 'sensitive' && question.is_sensitive) ||
                              (sensitivityFilter === 'normal' && !question.is_sensitive);
    return matchesSearch && matchesType && matchesSensitivity;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-2xl font-bold">الأسئلة المحورية</h2>
            <p className="text-muted-foreground">إنشاء وإدارة الأسئلة المحورية للتحديات ({filteredQuestions.length})</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Layout Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <button
                onClick={() => handleLayoutChange('cards')}
                className={`p-2 rounded ${currentLayout === 'cards' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title="عرض البطاقات"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLayoutChange('list')}
                className={`p-2 rounded ${currentLayout === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title="عرض القائمة"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLayoutChange('grid')}
                className={`p-2 rounded ${currentLayout === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title="عرض الشبكة"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
            
            <Button onClick={() => {
              setSelectedQuestion(null);
              setShowWizard(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              سؤال محوري جديد
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="البحث في الأسئلة المحورية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="نوع السؤال" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                {questionTypeOptions.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'open_ended' ? 'سؤال مفتوح' : 
                     type === 'multiple_choice' ? 'متعدد الخيارات' :
                     type === 'yes_no' ? 'نعم/لا' :
                     type === 'rating' ? 'تقييم' :
                     type === 'ranking' ? 'ترتيب' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحساسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {sensitivityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === 'normal' ? 'عادي' : 'حساس'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg h-64" />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <EmptyState
            icon={<HelpCircle className="w-12 h-12 text-muted-foreground" />}
            title="لا توجد أسئلة محورية"
            description="ابدأ بإنشاء سؤال محوري جديد لتوجيه المبتكرين"
            action={{
              label: "إنشاء سؤال محوري جديد",
              onClick: () => {
                setSelectedQuestion(null);
                setShowWizard(true);
              }
            }}
          />
        ) : (
          <ViewLayouts viewMode={currentLayout}>
            {filteredQuestions.map((question) => (
              <ManagementCard
                key={question.id}
                id={question.id}
                title={question.question_text_ar}
                description={question.challenge?.title_ar ? `التحدي: ${question.challenge.title_ar}` : 'سؤال عام'}
                viewMode={currentLayout}
                badges={[
                  { 
                    label: getTypeLabel(question.question_type),
                    variant: getTypeColor(question.question_type) as any
                  },
                  ...(question.is_sensitive ? [{ 
                    label: 'حساس', 
                    variant: 'destructive' as const 
                  }] : []),
                  ...(question.challenge ? [{ 
                    label: 'مرتبط بتحدي', 
                    variant: 'outline' as const 
                  }] : [{ 
                    label: 'سؤال عام', 
                    variant: 'secondary' as const 
                  }])
                ]}
                metadata={[
                  { 
                    icon: <Hash className="h-4 w-4" />, 
                    label: "الترتيب", 
                    value: question.order_sequence.toString() 
                  },
                  { 
                    icon: <Shield className="h-4 w-4" />, 
                    label: "الحساسية", 
                    value: question.is_sensitive ? 'حساس' : 'عادي' 
                  },
                  ...(question.challenge ? [{ 
                    icon: <Target className="h-4 w-4" />, 
                    label: "التحدي", 
                    value: question.challenge.title_ar 
                  }] : [])
                ]}
                actions={[
                  {
                    type: 'view',
                    label: 'عرض تفصيلي',
                    onClick: () => handleView(question)
                  },
                  {
                    type: 'edit',
                    label: 'تعديل',
                    onClick: () => handleEdit(question)
                  },
                  {
                    type: 'delete',
                    label: 'حذف',
                    onClick: () => {
                      if (confirm(`هل أنت متأكد من حذف "${question.question_text_ar}"؟`)) {
                        handleDelete(question.id);
                      }
                    }
                  }
                ]}
                onClick={() => handleView(question)}
              />
            ))}
          </ViewLayouts>
        )}
      </div>

      <FocusQuestionWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setSelectedQuestion(null);
        }}
        onSave={() => {
          fetchFocusQuestions();
          setShowWizard(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
      />

      <FocusQuestionDetailView
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedQuestion(null);
        }}
        question={selectedQuestion}
        onEdit={handleEdit}
        onRefresh={fetchFocusQuestions}
      />
    </>
  );
}