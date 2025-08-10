/**
 * Updated ChallengeManagementList component demonstrating the new key-based translation system
 * This shows how to replace hardcoded values with translatable keys
 */

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

// NEW: Import key-based translation components
import { TranslatableBadge, TranslatableSelect, useTranslatableOptions } from "@/components/ui/translatable-select";
import { useTranslatedValue } from "@/utils/valueKeys";

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
  department_id?: string;
  sensitivity_level?: string;
}

export function ChallengeManagementListUpdated() {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  
  // NEW: Use translatable options instead of hardcoded arrays
  const statusOptions = useTranslatableOptions('status');
  const priorityOptions = useTranslatableOptions('priority');
  const challengeTypeOptions = useTranslatableOptions('challenge_type');
  const sensitivityOptions = useTranslatableOptions('sensitivity');

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sensitivityFilter, setSensitivityFilter] = useState("all");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  const { systemLists } = useSystemLists();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          sectors(name_ar, name_en),
          departments(name_ar, name_en)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching challenges:', error);
        toast({
          title: t('error.load_failed', 'Failed to load data'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setChallenges(data || []);
    } catch (error) {
      logger.error('Unexpected error fetching challenges:', error);
      toast({
        title: t('error.load_failed', 'Failed to load data'),
        description: 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (challenge.title_en && challenge.title_en.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || challenge.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || challenge.priority_level === priorityFilter;
    const matchesType = typeFilter === "all" || challenge.challenge_type === typeFilter;
    const matchesSensitivity = sensitivityFilter === "all" || challenge.sensitivity_level === sensitivityFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesSensitivity;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error('Error deleting challenge:', error);
        toast({
          title: t('error.delete_failed', 'Failed to delete item'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t('success.delete_success', 'Successfully Deleted'),
        description: t('success.challenge_deleted', 'Challenge has been deleted successfully'),
        variant: "default",
      });

      await fetchChallenges();
    } catch (error) {
      logger.error('Unexpected error deleting challenge:', error);
      toast({
        title: t('error.delete_failed', 'Failed to delete item'),
        description: 'An unexpected error occurred',
        variant: "destructive",
      });
    }
  };

  const renderChallengeCard = (challenge: Challenge) => {
    return (
      <ManagementCard
        key={challenge.id}
        title={challenge.title_ar}
        subtitle={challenge.title_en}
        description={challenge.description_ar}
        status={
          /* OLD: Hardcoded status display
          <Badge variant={
            challenge.status === 'active' ? 'default' : 
            challenge.status === 'completed' ? 'secondary' : 
            challenge.status === 'published' ? 'secondary' : 'outline'
          }>
            {challenge.status === 'draft' ? 'مسودة' : 
             challenge.status === 'active' ? 'نشط' : 
             challenge.status === 'completed' ? 'مكتمل' : 
             challenge.status === 'cancelled' ? 'ملغي' : 
             challenge.status === 'published' ? 'منشور' : 
             challenge.status === 'closed' ? 'مغلق' : 
             challenge.status}
          </Badge>
          */
          
          // NEW: Key-based translation with automatic variant selection
          <TranslatableBadge 
            value={challenge.status} 
            category="status" 
          />
        }
        metadata={[
          {
            icon: <Target className="h-4 w-4" />,
            label: t('challenge_type', 'Type'),
            value: <TranslatableBadge value={challenge.challenge_type} category="challenge_type" variant="outline" />
          },
          {
            icon: <Clock className="h-4 w-4" />,
            label: t('priority', 'Priority'),
            value: <TranslatableBadge value={challenge.priority_level} category="priority" />
          },
          {
            icon: <Calendar className="h-4 w-4" />,
            label: t('start_date', 'Start Date'),
            value: challenge.start_date ? format(new Date(challenge.start_date), 'yyyy-MM-dd') : t('not_specified', 'Not specified')
          },
          {
            icon: <DollarSign className="h-4 w-4" />,
            label: t('budget', 'Budget'),
            value: challenge.estimated_budget 
              ? `${challenge.estimated_budget.toLocaleString()} ${t('currency.sar', 'SAR')}`
              : t('not_specified', 'Not specified')
          }
        ]}
        onView={() => setSelectedChallenge(challenge)}
        onEdit={() => {
          setSelectedChallenge(challenge);
          setShowWizard(true);
        }}
        onDelete={() => handleDelete(challenge.id)}
        actionItems={[
          {
            label: t('view_details', 'View Details'),
            onClick: () => setSelectedChallenge(challenge),
            icon: <Eye className="h-4 w-4" />
          },
          {
            label: t('settings', 'Settings'),
            onClick: () => {
              setSelectedChallenge(challenge);
              setShowWizard(true);
            },
            icon: <Settings className="h-4 w-4" />
          }
        ]}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t('challenges.challenges_management', 'Challenges Management')}</h1>
          <Badge variant="secondary">
            {filteredChallenges.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <ViewLayouts 
            currentView={viewMode} 
            onViewChange={setViewMode}
            showTableView={true}
          />
          <Button onClick={() => setShowWizard(true)}>
            <Lightbulb className="mr-2 h-4 w-4" />
            {t('challenges.create_challenge', 'Create Challenge')}
          </Button>
        </div>
      </div>

      {/* Filters Section - Updated with TranslatableSelect */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1 min-w-[250px]">
          <Input
            placeholder={t('search_challenges', 'Search challenges...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          {/* OLD: Hardcoded status filter
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="closed">مغلق</SelectItem>
              <SelectItem value="archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
          */}
          
          {/* NEW: Key-based translatable filter */}
          <TranslatableSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            category="status"
            placeholder={t('status', 'Status')}
            className="w-32"
            includeAll
            allLabel={t('common.all_statuses', 'All Statuses')}
          />

          <TranslatableSelect
            value={priorityFilter}
            onValueChange={setPriorityFilter}
            category="priority"
            placeholder={t('priority', 'Priority')}
            className="w-32"
            includeAll
            allLabel={t('common.all_priorities', 'All Priorities')}
          />

          <TranslatableSelect
            value={typeFilter}
            onValueChange={setTypeFilter}
            category="challenge_type"
            placeholder={t('type', 'Type')}
            className="w-32"
            includeAll
            allLabel={t('common.all_types', 'All Types')}
          />

          <TranslatableSelect
            value={sensitivityFilter}
            onValueChange={setSensitivityFilter}
            category="sensitivity"
            placeholder={t('sensitivity', 'Sensitivity')}
            className="w-32"
            includeAll
            allLabel={t('common.all_levels', 'All Levels')}
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          {t('loading', 'Loading...')}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <EmptyState
          title={t('challenges.no_challenges', 'No challenges found')}
          description={t('challenges.create_first_challenge', 'Create your first challenge to get started')}
          actionLabel={t('challenges.create_challenge', 'Create Challenge')}
          onAction={() => setShowWizard(true)}
        />
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1'
        }`}>
          {filteredChallenges.map(renderChallengeCard)}
        </div>
      )}

      {/* Modals */}
      {selectedChallenge && !showWizard && (
        <ChallengeDetailView
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onEdit={(challenge) => {
            setSelectedChallenge(challenge);
            setShowWizard(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {showWizard && (
        <ChallengeWizardV2
          challenge={selectedChallenge}
          onClose={() => {
            setShowWizard(false);
            setSelectedChallenge(null);
          }}
          onSave={() => {
            setShowWizard(false);
            setSelectedChallenge(null);
            fetchChallenges();
          }}
        />
      )}
    </div>
  );
}