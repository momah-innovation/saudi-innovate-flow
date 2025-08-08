import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { ChallengeWizardV2 } from "./ChallengeWizardV2";
import { ChallengeDetailView } from "./ChallengeDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";

import { 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Eye,
  Settings,
  Lightbulb,
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  Grid3x3
} from "lucide-react";
import { format } from "date-fns";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { useSystemLists } from "@/hooks/useSystemLists";
import type { BadgeVariant, DatabaseChallenge } from "@/types";

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  challenge_type: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  actual_budget?: number;
  created_at: string;
  updated_at: string;
  sector_id?: string;
  deputy_id?: string;
  department_id?: string;
  domain_id?: string;
  service_id?: string;
  vision_2030_goal?: string;
  kpi_alignment?: string;
  sensitivity_level: string;
  collaboration_details?: string;
  internal_team_notes?: string;
  challenge_owner_id?: string;
  assigned_expert_id?: string;
  partner_organization_id?: string;
  sub_domain_id?: string;
}

export function ChallengeManagementList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sensitivityFilter, setSensitivityFilter] = useState<string>("all");
  const [currentLayout, setCurrentLayout] = useState<'cards' | 'list' | 'grid'>('cards');
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels } = useSystemLists();
  

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      logger.error('Error fetching challenges', { component: 'ChallengeManagementList', action: 'fetchChallenges' }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);
      
      if (error) throw error;
      
      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      toast({
        title: "تم بنجاح",
        description: "تم حذف التحدي بنجاح"
      });
    } catch (error) {
      logger.error('Error deleting challenge', { component: 'ChallengeManagementList', action: 'handleDelete', data: { challengeId } }, error as Error);
      toast({
        title: "خطأ",
        description: "فشل في حذف التحدي",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowWizard(true);
  };

  const handleView = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'success';
      case 'cancelled': return 'destructive';
      case 'on_hold': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'مسودة',
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      on_hold: 'معلق'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  // Load saved layout preference
  useEffect(() => {
    const savedLayout = localStorage.getItem('challenge-layout') as 'cards' | 'list' | 'grid';
    if (savedLayout) {
      setCurrentLayout(savedLayout);
    }
  }, []);

  // Save layout preference
  const handleLayoutChange = (layout: 'cards' | 'list' | 'grid') => {
    setCurrentLayout(layout);
    localStorage.setItem('challenge-layout', layout);
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || challenge.priority_level === priorityFilter;
    const matchesSensitivity = sensitivityFilter === 'all' || challenge.sensitivity_level === sensitivityFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesSensitivity;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div>
            <h2 className="text-2xl font-bold">إدارة التحديات</h2>
            <p className="text-muted-foreground">إنشاء وإدارة التحديات الابتكارية ({filteredChallenges.length})</p>
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
              setSelectedChallenge(null);
              setShowWizard(true);
            }}>
              <Target className="w-4 h-4 mr-2" />
              تحدي جديد
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="البحث في التحديات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {challengeStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'draft' ? 'مسودة' : status === 'active' ? 'نشط' : status === 'completed' ? 'مكتمل' : 
                     status === 'cancelled' ? 'ملغي' : status === 'published' ? 'منشور' : status === 'closed' ? 'مغلق' : 
                     status === 'archived' ? 'مؤرشف' : status}
                  </SelectItem>
                ))}
                <SelectItem value="on_hold">معلق</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأولويات</SelectItem>
                {challengePriorityLevels.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority === 'high' ? 'عالي' : priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحساسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المستويات</SelectItem>
                {challengeSensitivityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === 'normal' ? 'عادي' : level === 'sensitive' ? 'حساس' : 'سري'}
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
        ) : filteredChallenges.length === 0 ? (
          <EmptyState
            icon={<Target className="w-12 h-12 text-muted-foreground" />}
            title="لا توجد تحديات"
            description="ابدأ بإنشاء تحدي ابتكاري جديد لجذب الأفكار المبدعة"
            action={{
              label: "إنشاء تحدي جديد",
              onClick: () => {
                setSelectedChallenge(null);
                setShowWizard(true);
              }
            }}
          />
        ) : (
          <ViewLayouts viewMode={currentLayout}>
            {filteredChallenges.map((challenge) => (
              <ManagementCard
                key={challenge.id}
                id={challenge.id}
                title={challenge.title_ar}
                description={challenge.description_ar}
                viewMode={currentLayout}
                badges={[
                  { 
                    label: getStatusLabel(challenge.status),
                    variant: getStatusColor(challenge.status) as BadgeVariant
                  },
                  { 
                    label: getPriorityLabel(challenge.priority_level),
                    variant: getPriorityColor(challenge.priority_level) as BadgeVariant
                  },
                  ...(challenge.challenge_type ? [{ 
                    label: challenge.challenge_type, 
                    variant: 'outline' as const 
                  }] : [])
                ]}
                metadata={[
                  ...(challenge.start_date ? [{ 
                    icon: <Calendar className="h-4 w-4" />, 
                    label: "تاريخ البداية", 
                    value: format(new Date(challenge.start_date), 'PPP') 
                  }] : []),
                  ...(challenge.end_date ? [{ 
                    icon: <Clock className="h-4 w-4" />, 
                    label: "تاريخ النهاية", 
                    value: format(new Date(challenge.end_date), 'PPP') 
                  }] : []),
                  ...(challenge.estimated_budget ? [{ 
                    icon: <DollarSign className="h-4 w-4" />, 
                    label: "الميزانية", 
                    value: `${challenge.estimated_budget.toLocaleString()} ريال` 
                  }] : []),
                  { 
                    icon: <Lightbulb className="h-4 w-4" />, 
                    label: "مستوى الحساسية", 
                    value: challenge.sensitivity_level 
                  }
                ]}
                actions={[
                  {
                    type: 'view',
                    label: 'عرض تفصيلي',
                    onClick: () => handleView(challenge)
                  },
                  {
                    type: 'edit',
                    label: 'تعديل',
                    onClick: () => handleEdit(challenge)
                  },
                  {
                    type: 'delete',
                    label: 'حذف',
                    onClick: () => {
                      if (confirm(`هل أنت متأكد من حذف "${challenge.title_ar}"؟`)) {
                        handleDelete(challenge.id);
                      }
                    }
                  }
                ]}
                onClick={() => handleView(challenge)}
              />
            ))}
          </ViewLayouts>
        )}
      </div>

      <ChallengeWizardV2
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setSelectedChallenge(null);
        }}
        onSuccess={() => {
          fetchChallenges();
          setShowWizard(false);
          setSelectedChallenge(null);
        }}
        challenge={selectedChallenge ? selectedChallenge as unknown as Challenge : undefined} // Type compatibility fix
      />

      <ChallengeDetailView
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedChallenge(null);
        }}
        challenge={selectedChallenge}
        onEdit={handleEdit}
        onRefresh={fetchChallenges}
      />
    </>
  );
}