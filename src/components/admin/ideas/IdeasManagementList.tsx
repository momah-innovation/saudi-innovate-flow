import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { IdeaWizard } from "../IdeaWizard";
import { IdeaDetailView } from "./IdeaDetailView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useStatusTranslations } from "@/utils/statusMappings";
import { logger } from "@/utils/logger";
import { BulkActionsPanel } from "./BulkActionsPanel";
import { IdeaCommentsPanel } from "./IdeaCommentsPanel";
import { IdeaWorkflowPanel } from "./IdeaWorkflowPanel";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractionButtons } from "@/components/ui/interaction-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  User,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  MoreVertical,
  Trash2,
  Archive,
  Clock,
  Award,
  BarChart3,
  Search,
  UserCheck,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { EmptyState } from "@/components/ui/empty-state";
import { useSystemLists } from "@/hooks/useSystemLists";
import { format } from "date-fns";
import { ManagementListProps } from "@/types";

// Enhanced Admin Idea interface with full data for management
interface IdeaListItem {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level: string;
  overall_score?: number;
  feasibility_score?: number;
  impact_score?: number;
  innovation_score?: number;
  alignment_score?: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  featured?: boolean;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
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
  innovator_profile?: {
    name: string;
    name_ar: string;
    email?: string;
  };
}

export type { IdeaListItem as Idea };

interface IdeasManagementListProps extends ManagementListProps<IdeaListItem> {
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
  onEdit: (idea: IdeaListItem) => void;
  onView: (idea: IdeaListItem) => void;
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
  const [ideas, setIdeas] = useState<IdeaListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<IdeaListItem | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [maturityFilter, setMaturityFilter] = useState<string>("all");
  
  // New state for advanced features
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [selectedIdeaForPanel, setSelectedIdeaForPanel] = useState<string>("");
  const [selectMode, setSelectMode] = useState(false);
  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>([]);
  
  // Sync with parent filters
  useEffect(() => {
    if (filters.status && filters.status !== '') {
      setStatusFilter(filters.status);
    }
    if (filters.maturityLevel && filters.maturityLevel !== '') {
      setMaturityFilter(filters.maturityLevel);
    }
  }, [filters]);
  const [currentLayout, setCurrentLayout] = useState<'cards' | 'list' | 'grid'>('cards');
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  const { generalStatusOptions } = useSystemLists();

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
      logger.error('Error fetching ideas', { component: 'IdeasManagementList', action: 'fetchIdeas' }, error as Error);
      toast({
        title: t('error.validation_error'),
        description: t('error.load_failed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Admin-specific actions
  const handleApproveIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ status: 'approved' })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم الموافقة على الفكرة",
      });
      
      fetchIdeas();
    } catch (error) {
      logger.error('Error approving idea', { ideaId }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في الموافقة على الفكرة",
        variant: "destructive"
      });
    }
  };

  const handleRejectIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ status: 'rejected' })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم رفض الفكرة",
      });
      
      fetchIdeas();
    } catch (error) {
      logger.error('Error rejecting idea', { ideaId }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في رفض الفكرة",
        variant: "destructive"
      });
    }
  };

  const handleFeatureIdea = async (ideaId: string, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ featured })
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: featured ? "تم إبراز الفكرة" : "تم إلغاء إبراز الفكرة",
      });
      
      fetchIdeas();
    } catch (error) {
      logger.error('Error featuring idea', { ideaId }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الإبراز",
        variant: "destructive"
      });
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الفكرة",
      });
      
      fetchIdeas();
    } catch (error) {
      logger.error('Error deleting idea', { ideaId }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الفكرة",
        variant: "destructive"
      });
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
    const { getStatusLabel: translateStatus } = useStatusTranslations();
    return translateStatus(status as any);
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
        {/* Admin Header with Stats */}
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">إدارة الأفكار الابتكارية</h2>
              </div>
              <p className="text-muted-foreground">إدارة شاملة لجميع الأفكار المقدمة في النظام ({filteredIdeas.length})</p>
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
                {t('ideas.new_idea', 'فكرة جديدة')}
              </Button>
            </div>
          </div>

          {/* Admin Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي الأفكار</p>
                    <p className="text-2xl font-bold">{ideas.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('status.under_review', 'قيد المراجعة')}</p>
                    <p className="text-2xl font-bold">{ideas.filter(i => i.status === 'under_review').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">موافق عليها</p>
                    <p className="text-2xl font-bold">{ideas.filter(i => i.status === 'approved').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">مميزة</p>
                    <p className="text-2xl font-bold">{ideas.filter(i => i.featured).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                {generalStatusOptions.filter(status => ['draft', 'submitted', 'under_review', 'approved', 'rejected'].includes(status)).map(status => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
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

        {/* Bulk Actions Panel */}
        <BulkActionsPanel
          selectedItems={localSelectedItems}
          onItemsUpdate={fetchIdeas}
          onClearSelection={() => setLocalSelectedItems([])}
        />

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-lg h-64" />
            ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <EmptyState
            title={t('ideas.no_ideas_found', 'لا توجد أفكار')}
            description={t('ideas.no_matching_ideas', 'لم يتم العثور على أفكار مطابقة للفلاتر المحددة')}
            action={{
              label: t('ideas.new_idea', 'فكرة جديدة'),
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
                 interactionButtons={
                   <InteractionButtons
                     itemId={idea.id}
                     itemType="idea"
                     title={idea.title_ar}
                     onComment={() => {
                       setSelectedIdeaForPanel(idea.id);
                       setShowCommentsPanel(true);
                     }}
                     className="mb-2"
                   />
                 }
                  actions={[
                   {
                     type: 'view',
                     label: 'عرض التفاصيل',
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
                   },
                   // Admin approval actions
                   ...(idea.status === 'under_review' ? [
                     {
                       type: 'custom' as const,
                       label: 'موافقة',
                       onClick: () => handleApproveIdea(idea.id),
                       icon: <CheckCircle className="w-4 h-4 text-green-600" />
                     },
                     {
                       type: 'custom' as const,
                       label: 'رفض',
                       onClick: () => handleRejectIdea(idea.id),
                       icon: <XCircle className="w-4 h-4 text-red-600" />
                     }
                   ] : []),
                   // Feature/unfeature action
                   {
                     type: 'custom',
                     label: idea.featured ? 'إلغاء الإبراز' : 'إبراز',
                     onClick: () => handleFeatureIdea(idea.id, !idea.featured),
                     icon: <Award className={`w-4 h-4 ${idea.featured ? 'text-yellow-500' : 'text-gray-500'}`} />
                   },
                   {
                     type: 'custom',
                     label: 'التعليقات',
                     onClick: () => {
                       setSelectedIdeaForPanel(idea.id);
                       setShowCommentsPanel(true);
                     },
                     icon: <MessageSquare className="w-4 h-4" />
                   },
                   {
                     type: 'custom',
                     label: 'سير العمل',
                     onClick: () => {
                       setSelectedIdea(idea);
                       setSelectedIdeaForPanel(idea.id);
                       setShowWorkflowPanel(true);
                     },
                     icon: <TrendingUp className="w-4 h-4" />
                   },
                   // Delete action (admin only)
                   {
                     type: 'custom',
                     label: 'حذف',
                     onClick: () => {
                       if (confirm('هل أنت متأكد من حذف هذه الفكرة؟')) {
                         handleDeleteIdea(idea.id);
                       }
                     },
                     icon: <Trash2 className="w-4 h-4 text-red-600" />
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
        idea={selectedIdea as any} // TODO: Fix type compatibility in next iteration
        isOpen={showDetailView}
        onClose={() => {
          setShowDetailView(false);
          setSelectedIdea(null);
        }}
        onEdit={(idea) => {
          setShowDetailView(false);
          setSelectedIdea(idea as IdeaListItem);
          setShowWizard(true);
        }}
        onRefresh={fetchIdeas}
      />

      {/* Comments Panel Dialog */}
      <Dialog open={showCommentsPanel} onOpenChange={setShowCommentsPanel}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>تعليقات الفكرة</DialogTitle>
          </DialogHeader>
          <IdeaCommentsPanel
            ideaId={selectedIdeaForPanel}
            isOpen={showCommentsPanel}
            onClose={() => setShowCommentsPanel(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Workflow Panel Dialog */}
      <Dialog open={showWorkflowPanel} onOpenChange={setShowWorkflowPanel}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>إدارة سير عمل الفكرة</DialogTitle>
          </DialogHeader>
          <IdeaWorkflowPanel
            ideaId={selectedIdeaForPanel}
            currentStatus={selectedIdea?.status || ''}
            onStatusChange={() => {
              fetchIdeas();
              onRefresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}