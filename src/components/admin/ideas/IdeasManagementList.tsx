import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { IdeaWizard } from "../IdeaWizard";
import { IdeaDetailView } from "./IdeaDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

import { 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  Users, 
  Star,
  Eye,
  Settings,
  Target,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Grid3x3,
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
    display_name: string;
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

export type { Idea };

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
  const [showWizard, setShowWizard] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [maturityFilter, setMaturityFilter] = useState<string>("all");
  const [currentLayout, setCurrentLayout] = useState<'cards' | 'list' | 'grid'>('cards');
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
          *
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

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'submitted': return 'default';
      case 'under_review': return 'outline';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getMaturityVariant = (level: string) => {
    switch (level) {
      case 'concept': return 'secondary';
      case 'prototype': return 'default';
      case 'pilot': return 'warning';
      case 'scaling': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'مسودة',
      submitted: 'مقدم',
      under_review: 'قيد المراجعة',
      approved: 'موافق عليه',
      rejected: 'مرفوض'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getMaturityLabel = (level: string) => {
    const labels = {
      concept: 'مفهوم',
      prototype: 'نموذج أولي',
      pilot: 'تجريبي',
      scaling: 'توسع'
    };
    return labels[level as keyof typeof labels] || level;
  };

  // Load saved layout preference
  useEffect(() => {
    const savedLayout = localStorage.getItem('ideas-layout') as 'cards' | 'list' | 'grid';
    if (savedLayout) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Save layout preference
  const handleLayoutChange = (layout: 'cards' | 'list' | 'grid') => {
    setCurrentLayout(layout);
    localStorage.setItem('ideas-layout', layout);
  };

  const filteredIdeas = ideas.filter(idea => {
    const searchText = localSearchTerm || searchTerm;
    const matchesSearch = idea.title_ar.toLowerCase().includes(searchText.toLowerCase()) ||
                         idea.description_ar.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    const matchesMaturity = maturityFilter === 'all' || idea.maturity_level === maturityFilter;
    return matchesSearch && matchesStatus && matchesMaturity;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-2xl font-bold">إدارة الأفكار</h2>
            <p className="text-muted-foreground">إنشاء وإدارة الأفكار الابتكارية ({filteredIdeas.length})</p>
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
              setSelectedIdea(null);
              setShowWizard(true);
            }}>
              <Lightbulb className="w-4 h-4 mr-2" />
              فكرة جديدة
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="البحث في الأفكار..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="submitted">مقدم</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={maturityFilter} onValueChange={setMaturityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="النضج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المستويات</SelectItem>
                <SelectItem value="concept">مفهوم</SelectItem>
                <SelectItem value="prototype">نموذج أولي</SelectItem>
                <SelectItem value="pilot">تجريبي</SelectItem>
                <SelectItem value="scaling">توسع</SelectItem>
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
        ) : filteredIdeas.length === 0 ? (
          <EmptyState
            title="لا توجد أفكار"
            description="لم يتم العثور على أفكار مطابقة للفلاتر المحددة"
            action={{
              label: "فكرة جديدة",
              onClick: () => setShowWizard(true)
            }}
          />
        ) : (
          <div className={`grid gap-6 ${
            currentLayout === 'cards' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            currentLayout === 'list' ? 'grid-cols-1' :
            'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {filteredIdeas.map((idea) => (
              <ManagementCard
                key={idea.id}
                id={idea.id}
                title={idea.title_ar}
                description={idea.description_ar}
                badges={[{
                  label: getStatusLabel(idea.status),
                  variant: getStatusVariant(idea.status)
                }]}
                viewMode={currentLayout}
                metadata={[
                 {
                   icon: <Star className="w-4 h-4" />,
                   label: 'النتيجة',
                   value: `${idea.overall_score || 0}/10`
                 },
                 {
                   icon: <Target className="w-4 h-4" />,
                   label: 'مستوى النضج',
                   value: getMaturityLabel(idea.maturity_level)
                 },
                 {
                   icon: <Calendar className="w-4 h-4" />,
                   label: 'تاريخ الإنشاء',
                   value: new Date(idea.created_at).toLocaleDateString('ar-SA')
                 }
                ]}
                actions={[
                  {
                    type: 'view',
                    label: 'عرض',
                    onClick: () => {
                      setSelectedIdea(idea);
                      setShowDetailView(true);
                    },
                    icon: <Eye className="w-4 h-4" />
                  },
                  {
                    type: 'edit',
                    label: 'تعديل',
                    onClick: () => {
                      setSelectedIdea(idea);
                      setShowWizard(true);
                    },
                    icon: <Settings className="w-4 h-4" />
                  }
                ]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Wizard Dialog */}
      <IdeaWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setSelectedIdea(null);
        }}
        onSave={() => {
          fetchIdeas();
          setShowWizard(false);
          setSelectedIdea(null);
        }}
        idea={selectedIdea}
      />

      {/* Detail View Dialog */}
      <IdeaDetailView
        idea={selectedIdea}
        isOpen={showDetailView}
        onClose={() => {
          setShowDetailView(false);
          setSelectedIdea(null);
        }}
        onEdit={(idea) => {
          setShowDetailView(false);
          setSelectedIdea(idea);
          setShowWizard(true);
        }}
        onRefresh={fetchIdeas}
      />
    </>
  );
}