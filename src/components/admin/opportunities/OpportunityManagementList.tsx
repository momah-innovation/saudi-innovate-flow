import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { ManagementCard } from "@/components/ui/management-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useUnifiedLoading } from "@/hooks/useUnifiedLoading";
import { createErrorHandler } from "@/utils/unified-error-handler";
import { logger } from "@/utils/logger";
import { Checkbox } from "@/components/ui/checkbox";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { EmptyState } from "@/components/ui/empty-state";
import { OpportunityWizard } from "../OpportunityWizard";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Eye,
  Edit,
  Filter,
  Plus,
  Search
} from "lucide-react";
import { dateHandler } from '@/utils/unified-date-handler';
import { ManagementListProps } from "@/types";
import { debugLog } from '@/utils/debugLogger';

// Local opportunity interface for this management component
interface OpportunityListItem {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'internship' | 'volunteer' | 'partnership' | 'grant' | 'competition';
  status: 'open' | 'closed' | 'on_hold' | 'cancelled';
  department_id?: string;
  contact_person?: string;
  contact_email?: string;
  application_deadline: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  application_count?: number;
  view_count?: number;
  created_at: string;
  updated_at: string;
  department?: {
    id: string;
    name: string;
    name_ar?: string;
  };
}

export type { OpportunityListItem as Opportunity };

interface OpportunityManagementListProps extends ManagementListProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  filters: {
    status: string;
    type: string;
    department: string;
    is_remote: string;
  };
  onEdit: (opportunity: OpportunityListItem) => void;
  onView: (opportunity: OpportunityListItem) => void;
  onRefresh: () => void;
}

export function OpportunityManagementList({ 
  viewMode, 
  searchTerm, 
  selectedItems,
  onSelectedItemsChange,
  filters,
  onEdit,
  onView,
  onRefresh 
}: OpportunityManagementListProps) {
  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading, withLoading } = useUnifiedLoading({
    component: 'OpportunityManagementList',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({
    component: 'OpportunityManagementList',
    showToast: true,
    logError: true
  });
  
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityListItem | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();

  useEffect(() => {
    fetchOpportunities();
  }, [filters, searchTerm]);

  const fetchOpportunities = () => {
    return withLoading('fetch-opportunities', async () => {
      // Fetch from opportunities table - remove department relation for now
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        debugLog.error('Error fetching opportunities:', { component: 'OpportunityManagementList' }, error);
        setOpportunities([]);
        return;
      }

      // Transform data to match interface using correct column names
      const transformedOpportunities = (data || []).map(item => ({
        id: item.id,
        title: item.title_ar || item.title_en || 'غير محدد',
        description: item.description_ar || item.description_en || '',
        type: (item.opportunity_type || 'job') as 'job' | 'internship' | 'volunteer' | 'partnership' | 'grant' | 'competition',
        status: (item.status === 'published' ? 'open' : 
                 item.status === 'draft' ? 'closed' : 
                 item.status || 'closed') as 'open' | 'closed' | 'on_hold' | 'cancelled',
        department_id: item.department_id,
        contact_person: item.contact_person || '',
        contact_email: item.contact_email || '',
        application_deadline: item.deadline, // Database uses 'deadline'
        start_date: undefined, // Column doesn't exist in current schema
        end_date: undefined, // Column doesn't exist in current schema
        location: item.location || '',
        is_remote: false, // Column doesn't exist, defaulting to false
        salary_min: item.budget_min,
        salary_max: item.budget_max,
        currency: 'SAR',
        application_count: 0,
        view_count: 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        department: undefined
      }));

      setOpportunities(transformedOpportunities);
      return true;
    }, {
      errorMessage: "فشل في تحميل الفرص",
      logContext: { action: 'fetch_opportunities' }
    });
  };

  const filteredOpportunities = opportunities.filter(opportunity =>
    !searchTerm || 
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'closed': return 'status-closed';
      case 'on_hold': return 'status-on-hold';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-closed';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return t('status.open', 'مفتوح');
      case 'closed': return t('status.closed', 'مغلق');
      case 'on_hold': return t('status.on_hold', 'معلق');
      case 'cancelled': return t('status.cancelled', 'ملغي');
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'job': return t('opportunity_type.job', 'وظيفة');
      case 'internship': return t('opportunity_type.internship', 'تدريب');
      case 'volunteer': return t('opportunity_type.volunteer', 'تطوع');
      case 'partnership': return t('opportunity_type.partnership', 'شراكة');
      case 'grant': return t('opportunity_type.grant', 'منحة');
      case 'competition': return t('opportunity_type.competition', 'مسابقة');
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job': return <Briefcase className="w-4 h-4" />;
      case 'internship': return <Users className="w-4 h-4" />;
      case 'volunteer': return <Users className="w-4 h-4" />;
      case 'partnership': return <Users className="w-4 h-4" />;
      case 'grant': return <DollarSign className="w-4 h-4" />;
      case 'competition': return <Briefcase className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const handleSelectOpportunity = (opportunityId: string, checked: boolean) => {
    if (checked) {
      onSelectedItemsChange([...selectedItems, opportunityId]);
    } else {
      onSelectedItemsChange(selectedItems.filter(id => id !== opportunityId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedItemsChange(opportunities.map(opp => opp.id));
    } else {
      onSelectedItemsChange([]);
    }
  };

  const handleEdit = (opportunity: OpportunityListItem) => {
    setSelectedOpportunity(opportunity);
    setShowWizard(true);
    onEdit(opportunity);
  };

  const handleView = (opportunity: OpportunityListItem) => {
    onView(opportunity);
  };

  const renderOpportunityCard = (opportunity: OpportunityListItem) => (
    <ManagementCard
      id={opportunity.id}
      key={opportunity.id}
      title={opportunity.title}
      description={opportunity.description}
      metadata={[
        {
          icon: getTypeIcon(opportunity.type),
          label: getTypeLabel(opportunity.type),
          value: ""
        },
        {
          icon: <Calendar className="w-4 h-4" />,
          label: "موعد انتهاء التقديم",
          value: dateHandler.formatDate(new Date(opportunity.application_deadline))
        },
        {
          icon: <MapPin className="w-4 h-4" />,
          label: "الموقع",
          value: opportunity.is_remote ? t('location.remote', 'عن بُعد') : (opportunity.location || t('location.not_specified', 'غير محدد'))
        },
        {
          icon: <Users className="w-4 h-4" />,
          label: "عدد المتقدمين",
          value: `${opportunity.application_count || 0}`
        }
      ]}
      actions={[
        {
          type: "view",
          label: "عرض",
          onClick: () => handleView(opportunity)
        },
        {
          type: "edit",
          label: "تعديل", 
          onClick: () => handleEdit(opportunity)
        }
      ]}
    />
  );

  if (isLoading('fetch-opportunities')) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (filteredOpportunities.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="w-12 h-12 text-muted-foreground" />}
        title="لا توجد فرص"
        description="لم يتم العثور على أي فرص تطابق معايير البحث"
        action={{
          label: "إضافة فرصة جديدة",
          onClick: () => setShowWizard(true)
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الفرص..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 w-64"
              dir="rtl"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            فرصة جديدة
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <Badge variant="secondary">
              {selectedItems.length} {t('ui.selected', 'محدد')}
            </Badge>
          )}
          
          <Checkbox
            checked={selectedItems.length === filteredOpportunities.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">{t('ui.select_all', 'تحديد الكل')}</span>
        </div>
      </div>

      {/* Opportunities List */}
      <div className={`grid gap-4 ${
        viewMode === 'cards' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' :
        'grid-cols-1'
      }`}>
        {filteredOpportunities.map(renderOpportunityCard)}
      </div>

      {/* Wizard Dialog */}
      <OpportunityWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setSelectedOpportunity(null);
        }}
        onSave={() => {
          fetchOpportunities();
          setShowWizard(false);
          setSelectedOpportunity(null);
        }}
        opportunity={selectedOpportunity as any} // TODO: Fix type compatibility in next iteration
      />
    </div>
  );
}