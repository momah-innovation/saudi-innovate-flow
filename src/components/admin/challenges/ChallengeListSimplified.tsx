import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeWizardV2 } from "./ChallengeWizardV2";
import { ChallengeDetailView } from "./ChallengeDetailView";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";
import { useDataTable } from "@/hooks/useDataTable";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSystemLists } from "@/hooks/useSystemLists";
import type { BadgeVariant } from "@/types";
import { Target, Calendar, DollarSign, Edit, Eye, Trash2 } from "lucide-react";
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

export function ChallengeListSimplified() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();
  const { challengeStatusOptions, challengePriorityLevels, challengeSensitivityLevels } = useSystemLists();

  // Configure data table with simpler options
  const dataTableConfig = {
    searchFields: ['title_ar', 'description_ar'],
    statusOptions: challengeStatusOptions.map(status => ({
      value: status,
      label: getStatusLabel(status)
    })),
    typeOptions: challengePriorityLevels.map(priority => ({
      value: priority,
      label: getPriorityLabel(priority)
    }))
  };

  const dataTable = useDataTable(challenges, dataTableConfig);

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
      logger.error('Error fetching challenges', { component: 'ChallengeList', action: 'fetchChallenges' }, error as Error);
      toast({
        title: t('error.title'),
        description: t('error.fetch_challenges'),
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
        title: t('success.title'),
        description: t('success.challenge_deleted')
      });
    } catch (error) {
      logger.error('Error deleting challenge', { component: 'ChallengeList', action: 'handleDelete', data: { challengeId } }, error as Error);
      toast({
        title: t('error.title'),
        description: t('error.delete_challenge'),
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

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: t('status.draft'),
      active: t('status.active'),
      completed: t('status.completed'),
      cancelled: t('status.cancelled'),
      on_hold: t('status.on_hold')
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: t('priority.high'),
      medium: t('priority.medium'),
      low: t('priority.low')
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      case 'on_hold': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string): BadgeVariant => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const columns: Column<Challenge>[] = [
    {
      key: 'title_ar',
      label: t('challenge.title'),
      sortable: true,
      render: (challenge) => (
        <div>
          <div className="font-medium">{challenge.title_ar}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {challenge.description_ar}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('challenge.status'),
      sortable: true,
      render: (challenge) => (
        <Badge variant={getStatusColor(challenge.status)}>
          {getStatusLabel(challenge.status)}
        </Badge>
      )
    },
    {
      key: 'priority_level',
      label: t('challenge.priority'),
      sortable: true,
      render: (challenge) => (
        <Badge variant={getPriorityColor(challenge.priority_level)}>
          {getPriorityLabel(challenge.priority_level)}
        </Badge>
      )
    },
    {
      key: 'start_date',
      label: t('challenge.start_date'),
      sortable: true,
      render: (challenge) => challenge.start_date 
        ? format(new Date(challenge.start_date), 'PPP')
        : '-'
    },
    {
      key: 'estimated_budget',
      label: t('challenge.budget'),
      sortable: true,
      render: (challenge) => challenge.estimated_budget
        ? `${challenge.estimated_budget.toLocaleString()} ${t('currency.sar')}`
        : '-'
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (challenge) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(challenge)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(challenge)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(t('confirm.delete_challenge', { name: challenge.title_ar }))) {
                handleDelete(challenge.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-muted rounded w-1/3" />
        <div className="animate-pulse h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('challenge.management.title')}</h2>
          <p className="text-muted-foreground">
            {t('challenge.management.description', { count: dataTable.totalItems })}
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedChallenge(null);
            setShowWizard(true);
          }}
        >
          <Target className="w-4 h-4 mr-2" />
          {t('challenge.add_new')}
        </Button>
      </div>

      {/* Simple filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder={t('search.placeholder')}
          value={dataTable.searchTerm}
          onChange={(e) => dataTable.setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <Select
          value={dataTable.statusFilter}
          onValueChange={dataTable.setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filter.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter.all_statuses')}</SelectItem>
            {dataTableConfig.statusOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={dataTable.typeFilter}
          onValueChange={dataTable.setTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filter.priority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter.all_priorities')}</SelectItem>
            {dataTableConfig.typeOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {dataTable.hasActiveFilters && (
          <Button 
            variant="ghost" 
            onClick={dataTable.clearFilters}
          >
            {t('filter.clear_all')}
          </Button>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={dataTable.data}
        columns={columns}
        sortConfig={dataTable.sortConfig}
        onSort={dataTable.handleSort}
        onRowClick={handleView}
        emptyState={
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('challenge.empty.title')}</h3>
            <p className="text-muted-foreground mb-4">{t('challenge.empty.description')}</p>
            <Button onClick={() => setShowWizard(true)}>
              <Target className="w-4 h-4 mr-2" />
              {t('challenge.add_new')}
            </Button>
          </div>
        }
      />

      {/* Simple Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('pagination.showing', 'Showing {{start}} to {{end}} of {{total}} results', {
            start: Math.min((dataTable.currentPage - 1) * dataTable.pageSize + 1, dataTable.totalItems),
            end: Math.min(dataTable.currentPage * dataTable.pageSize, dataTable.totalItems),
            total: dataTable.totalItems
          })}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dataTable.setCurrentPage(dataTable.currentPage - 1)}
            disabled={!dataTable.hasPreviousPage}
          >
            {t('pagination.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dataTable.setCurrentPage(dataTable.currentPage + 1)}
            disabled={!dataTable.hasNextPage}
          >
            {t('pagination.next')}
          </Button>
        </div>
      </div>

      {/* Dialogs */}
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
        } : undefined}
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
    </div>
  );
}