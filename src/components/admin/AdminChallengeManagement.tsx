import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import { ManagementCard } from "@/components/ui/management-card";
import { ChallengeWizard } from "./ChallengeWizard";
import { ChallengeSettings } from "./ChallengeSettings";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Eye,
  Settings,
  Lightbulb
} from "lucide-react";
import { format } from "date-fns";

interface AdminChallenge {
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

export function AdminChallengeManagement() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showWizard, setShowWizard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<AdminChallenge | null>(null);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('error.validation_error'),
        description: t('error.load_failed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleDelete = useCallback(async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);
      
      if (error) throw error;
      
      setChallenges(prev => prev.filter(c => c.id !== challengeId));
      toast({
        title: t('success.delete_success'),
        description: t('success.challenge_deleted')
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('error.validation_error'),
        description: t('error.delete_failed'),
        variant: "destructive"
      });
    }
  }, [setChallenges, toast]);

  const handleEdit = useCallback((challenge: AdminChallenge) => {
    setSelectedChallenge(challenge);
    setShowWizard(true);
  }, [setSelectedChallenge, setShowWizard]);

  const handleSettings = useCallback((challenge: AdminChallenge) => {
    setSelectedChallenge(challenge);
    setShowSettings(true);
  }, [setSelectedChallenge, setShowSettings]);

  const handleView = useCallback((challenge: AdminChallenge) => {
    setSelectedChallenge(challenge);
    setShowDetails(true);
  }, [setSelectedChallenge, setShowDetails]);


  const getStatusLabel = useCallback((status: string) => {
    return t(`status.${status}`) || status;
  }, [t]);

  const getPriorityLabel = useCallback((priority: string) => {
    return t(`priority.${priority}`) || priority;
  }, [t]);

  const filteredChallenges = useMemo(() => challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (challenge.title_en?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (challenge.description_en?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [challenges, searchTerm, statusFilter]);

  const filters = [
    {
      id: 'status',
      label: 'الحالة',
      type: 'select' as const,
      options: [
        { label: 'الكل', value: 'all' },
          { label: t('status.draft'), value: 'draft' },
          { label: t('status.active'), value: 'active' },
          { label: t('status.completed'), value: 'completed' },
          { label: t('status.cancelled'), value: 'cancelled' },
          { label: t('status.on_hold'), value: 'on_hold' }
      ],
      value: statusFilter,
      onChange: setStatusFilter
    }
  ];

  return (
    <>
      <StandardPageLayout
        title="إدارة التحديات"
        description="إنشاء وإدارة التحديات الابتكارية"
        itemCount={filteredChallenges.length}
        addButton={{
          label: "تحدي جديد",
          onClick: () => {
            setSelectedChallenge(null);
            setShowWizard(true);
          },
          icon: <Target className="w-4 h-4" />
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        loading={loading}
        emptyState={
          <EmptyState
            icon={<Target className="w-6 h-6 text-muted-foreground" />}
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
        }
      >
        {filteredChallenges.map((challenge) => (
          <ManagementCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title_ar}
            description={challenge.description_ar}
            badges={[
              { label: getStatusLabel(challenge.status), variant: 'secondary' as const },
              { label: getPriorityLabel(challenge.priority_level), variant: 'outline' as const },
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
                label: "الميزانية المقدرة", 
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
                label: 'عرض',
                onClick: () => handleView(challenge)
              },
              {
                type: 'edit',
                label: 'تعديل',
                onClick: () => handleEdit(challenge)
              },
              {
                type: 'settings',
                label: 'إعدادات',
                onClick: () => handleSettings(challenge)
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
      </StandardPageLayout>

      <ChallengeWizard
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
          sub_domain_id: selectedChallenge.sub_domain_id || '',
          department_id: selectedChallenge.department_id || '',
          deputy_id: selectedChallenge.deputy_id || '',
          sector_id: selectedChallenge.sector_id || '',
          domain_id: selectedChallenge.domain_id || '',
          service_id: selectedChallenge.service_id || ''
        } : undefined}
      />

      {selectedChallenge && (
        <ChallengeSettings
          isOpen={showSettings}
          onClose={() => {
            setShowSettings(false);
            setSelectedChallenge(null);
          }}
          challenge={selectedChallenge}
          onUpdate={fetchChallenges}
        />
      )}

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedChallenge?.title_ar}
              {selectedChallenge?.title_en && (
                <span className="text-sm text-muted-foreground block mt-1" dir="ltr">
                  {selectedChallenge.title_en}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedChallenge && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">{t('description')}</h4>
                <p className="text-sm text-muted-foreground" dir="rtl">{selectedChallenge.description_ar}</p>
                {selectedChallenge.description_en && (
                  <>
                    <h4 className="font-semibold mb-2 mt-4">Description (English)</h4>
                    <p className="text-sm text-muted-foreground" dir="ltr">{selectedChallenge.description_en}</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('status')}</h4>
                  <StatusBadge status={selectedChallenge.status} size="sm" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('priority')}</h4>
                  <PriorityBadge priority={selectedChallenge.priority_level} size="sm" />
                </div>
              </div>

              {selectedChallenge.vision_2030_goal && (
                <div>
                  <h4 className="font-semibold mb-2">{t('vision_2030_goal')}</h4>
                  <p className="text-sm text-muted-foreground">{selectedChallenge.vision_2030_goal}</p>
                </div>
              )}

              {selectedChallenge.collaboration_details && (
                <div>
                  <h4 className="font-semibold mb-2">{t('collaboration_details')}</h4>
                  <p className="text-sm text-muted-foreground">{selectedChallenge.collaboration_details}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}