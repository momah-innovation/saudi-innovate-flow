import { useState, useEffect } from "react";
import { ManagementCard } from "@/components/ui/management-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
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
import { format } from "date-fns";
import { ManagementListProps } from "@/types";

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
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityListItem | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const { toast } = useToast();
  const { t, isRTL } = useUnifiedTranslation();

  // Mock data for opportunities
  const mockOpportunities: OpportunityListItem[] = [
    {
      id: '1',
      title: 'مطور تطبيقات موبايل',
      description: 'نبحث عن مطور تطبيقات موبايل متمرس للانضمام إلى فريق التكنولوجيا',
      type: 'job',
      status: 'open',
      department_id: '1',
      contact_person: 'أحمد محمد',
      contact_email: 'ahmed@example.com',
      application_deadline: '2024-02-15',
      start_date: '2024-03-01',
      location: 'الرياض',
      is_remote: false,
      salary_min: 8000,
      salary_max: 12000,
      currency: 'SAR',
      application_count: 15,
      view_count: 120,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      department: {
        id: '1',
        name: 'Technology Department',
        name_ar: 'قسم التكنولوجيا'
      }
    },
    {
      id: '2',
      title: 'برنامج تدريب صيفي',
      description: 'برنامج تدريب صيفي للطلاب المتفوقين في مجال الابتكار',
      type: 'internship',
      status: 'open',
      department_id: '2',
      contact_person: 'فاطمة علي',
      contact_email: 'fatima@example.com',
      application_deadline: '2024-03-31',
      start_date: '2024-06-01',
      end_date: '2024-08-31',
      location: 'جدة',
      is_remote: true,
      application_count: 45,
      view_count: 280,
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z',
      department: {
        id: '2',
        name: 'Innovation Department',
        name_ar: 'قسم الابتكار'
      }
    },
    {
      id: '3',
      title: 'مسابقة الابتكار التقني',
      description: 'مسابقة سنوية لأفضل الحلول التقنية المبتكرة',
      type: 'competition',
      status: 'open',
      department_id: '1',
      contact_person: 'خالد الأحمد',
      contact_email: 'khalid@example.com',
      application_deadline: '2024-04-30',
      start_date: '2024-05-15',
      end_date: '2024-06-15',
      location: 'الدمام',
      is_remote: false,
      application_count: 32,
      view_count: 450,
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-25T10:00:00Z',
      department: {
        id: '1',
        name: 'Technology Department',
        name_ar: 'قسم التكنولوجيا'
      }
    }
  ];

  useEffect(() => {
    fetchOpportunities();
  }, [filters, searchTerm]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      // Simulate API call with filtering
      let filteredOpportunities = [...mockOpportunities];
      
      // Apply filters
      if (filters.status !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.status === filters.status);
      }
      
      if (filters.type !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.type === filters.type);
      }
      
      if (filters.department !== 'all') {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.department_id === filters.department);
      }
      
      if (filters.is_remote !== 'all') {
        const isRemote = filters.is_remote === 'true';
        filteredOpportunities = filteredOpportunities.filter(opp => opp.is_remote === isRemote);
      }
      
      // Apply search
      if (searchTerm) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setOpportunities(filteredOpportunities);
    } catch (error) {
      logger.error('Failed to fetch opportunities list', { 
        component: 'OpportunityManagementList', 
        action: 'fetchOpportunities',
        filters 
      }, error as Error);
      toast({
        title: t('error', 'Error'),
        description: t('opportunities.fetch_error', 'Failed to fetch opportunities list'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          value: format(new Date(opportunity.application_deadline), 'dd/MM/yyyy')
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (opportunities.length === 0) {
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
            checked={selectedItems.length === opportunities.length}
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
        {opportunities.map(renderOpportunityCard)}
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