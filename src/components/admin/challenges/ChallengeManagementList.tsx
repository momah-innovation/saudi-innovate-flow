import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout/PageLayout";
import { ManagementCard } from "@/components/ui/management-card";
import { ChallengeWizardV2 } from "./ChallengeWizardV2";
import { ChallengeDetailView } from "./ChallengeDetailView";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
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
  Filter
} from "lucide-react";
import { format } from "date-fns";

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
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

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
      console.error('Error fetching challenges:', error);
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
      console.error('Error deleting challenge:', error);
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

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description_ar.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || challenge.priority_level === priorityFilter;
    const matchesSensitivity = sensitivityFilter === 'all' || challenge.sensitivity_level === sensitivityFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesSensitivity;
  });

  const filters = [
    {
      id: 'status',
      label: 'الحالة',
      type: 'select' as const,
      options: [
        { label: 'الكل', value: 'all' },
        { label: 'مسودة', value: 'draft' },
        { label: 'نشط', value: 'active' },
        { label: 'مكتمل', value: 'completed' },
        { label: 'ملغي', value: 'cancelled' },
        { label: 'معلق', value: 'on_hold' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    },
    {
      id: 'priority',
      label: 'الأولوية',
      type: 'select' as const,
      options: [
        { label: 'الكل', value: 'all' },
        { label: 'عالي', value: 'high' },
        { label: 'متوسط', value: 'medium' },
        { label: 'منخفض', value: 'low' }
      ],
      value: priorityFilter,
      onChange: setPriorityFilter
    },
    {
      id: 'sensitivity',
      label: 'مستوى الحساسية',
      type: 'select' as const,
      options: [
        { label: 'الكل', value: 'all' },
        { label: 'عادي', value: 'normal' },
        { label: 'حساس', value: 'sensitive' },
        { label: 'سري', value: 'confidential' }
      ],
      value: sensitivityFilter,
      onChange: setSensitivityFilter
    }
  ];

  return (
    <>
      <PageLayout
        title="إدارة التحديات"
        description="إنشاء وإدارة التحديات الابتكارية"
        itemCount={filteredChallenges.length}
        primaryAction={{
          label: "تحدي جديد",
          onClick: () => {
            setSelectedChallenge(null);
            setShowWizard(true);
          },
          icon: <Target className="w-4 h-4" />
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        spacing="md"
      >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ManagementCard
                key={challenge.id}
                id={challenge.id}
                title={challenge.title_ar}
                description={challenge.description_ar}
                badges={[
                  { 
                    label: getStatusLabel(challenge.status),
                    variant: getStatusColor(challenge.status) as any
                  },
                  { 
                    label: getPriorityLabel(challenge.priority_level),
                    variant: getPriorityColor(challenge.priority_level) as any
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
          </div>
        )}
      </PageLayout>

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
        challenge={selectedChallenge as any}
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