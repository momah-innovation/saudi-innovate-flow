import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManagementCard } from "@/components/ui/management-card";
import { ChallengeWizardV2 } from "./ChallengeWizardV2";
import { ChallengeDetailView } from "./ChallengeDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useStatusTranslations } from "@/utils/statusMappings";
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
  title_en?: string;
  description_ar: string;
  description_en?: string;
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
  const { getStatusLabel, getPriorityLabel } = useStatusTranslations();
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels } = useSystemLists();
  

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      console.log('🔍 ChallengeManagementList: Starting fetchChallenges');
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('🔍 ChallengeManagementList: Query result:', { data, error, count: data?.length });
      
      if (error) {
        console.error('🔴 ChallengeManagementList: Database error:', error);
        throw error;
      }
      
      console.log('✅ ChallengeManagementList: Successfully fetched challenges:', data?.length || 0);
      setChallenges(data || []);
    } catch (error) {
      console.error('🔴 ChallengeManagementList: fetchChallenges failed:', error);
      logger.error('Error fetching challenges', { component: 'ChallengeManagementList', action: 'fetchChallenges' }, error as Error);
      toast({
        title: t('challenge_management.load_error_title'),
        description: t('challenge_management.load_error_description'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('🔍 ChallengeManagementList: fetchChallenges completed');
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
        title: t('challenge_management.delete_success_title'),
        description: t('challenge_management.delete_success_description')
      });
    } catch (error) {
      logger.error('Error deleting challenge', { component: 'ChallengeManagementList', action: 'handleDelete', data: { challengeId } }, error as Error);
      toast({
        title: t('challenge_management.delete_error_title'),
        description: t('challenge_management.delete_error_description'),
        variant: "destructive"
      });
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowWizard(true);
  };

  const handleView = (challenge: Challenge) => {
    // Navigate to full page view instead of dialog
    console.log('🔍 Navigating to challenge detail:', `/admin/challenges/${challenge.id}`);
    window.location.href = `/admin/challenges/${challenge.id}`;
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
            <h2 className="text-2xl font-bold">{t('challenge_management.title', 'إدارة التحديات')}</h2>
            <p className="text-muted-foreground">{t('challenge_management.description', 'إنشاء وإدارة التحديات الابتكارية')} ({filteredChallenges.length})</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Layout Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <button
                onClick={() => handleLayoutChange('cards')}
                className={`p-2 rounded ${currentLayout === 'cards' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title={t('common.card_view', 'عرض البطاقات')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLayoutChange('list')}
                className={`p-2 rounded ${currentLayout === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title={t('common.list_view', 'عرض القائمة')}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLayoutChange('grid')}
                className={`p-2 rounded ${currentLayout === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                title={t('common.grid_view', 'عرض الشبكة')}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
            
            <Button onClick={() => {
              setSelectedChallenge(null);
              setShowWizard(true);
            }}>
              <Target className="w-4 h-4 mr-2" />
              {t('challenge_management.new_challenge', 'تحدي جديد')}
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
                <SelectItem value="all">{t('common.all_statuses', 'كل الحالات')}</SelectItem>
                {challengeStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status as any)}
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
                <SelectItem value="all">{t('common.all_priorities', 'كل الأولويات')}</SelectItem>
                {challengePriorityLevels.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {getPriorityLabel(priority as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="الحساسية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all_levels', 'كل المستويات')}</SelectItem>
                {challengeSensitivityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {t(`sensitivity.${level}`, level)}
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
              label: t('challenges.create_new_challenge', 'إنشاء تحدي جديد'),
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
                    label: t(challenge.status, challenge.status),
                    variant: 'default' as const
                  },
                  { 
                    label: t(challenge.priority_level, challenge.priority_level),
                    variant: 'outline' as const
                  },
                  { 
                    label: t(challenge.challenge_type, challenge.challenge_type), 
                    variant: 'outline' as const 
                  }
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
        challenge={selectedChallenge ? {
          ...selectedChallenge,
          title_ar: selectedChallenge.title_ar || '',
          description_ar: selectedChallenge.description_ar || '',
          status: selectedChallenge.status || '',
          priority_level: selectedChallenge.priority_level || '',
          sensitivity_level: selectedChallenge.sensitivity_level || '',
          challenge_type: selectedChallenge.challenge_type || '',
          start_date: selectedChallenge.start_date || '',
          end_date: selectedChallenge.end_date || '',
          estimated_budget: selectedChallenge.estimated_budget || 0,
          actual_budget: selectedChallenge.actual_budget || 0,
          vision_2030_goal: selectedChallenge.vision_2030_goal || '',
          kpi_alignment: selectedChallenge.kpi_alignment || '',
          collaboration_details: selectedChallenge.collaboration_details || '',
          internal_team_notes: selectedChallenge.internal_team_notes || '',
          challenge_owner_id: selectedChallenge.challenge_owner_id || '',
          assigned_expert_id: selectedChallenge.assigned_expert_id || '',
          partner_organization_id: selectedChallenge.partner_organization_id || '',
          department_id: selectedChallenge.department_id || '',
          deputy_id: selectedChallenge.deputy_id || '',
          sector_id: selectedChallenge.sector_id || '',
          domain_id: selectedChallenge.domain_id || '',
          sub_domain_id: selectedChallenge.sub_domain_id || '',
          service_id: selectedChallenge.service_id || ''
        } : undefined} // Type compatibility fix
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