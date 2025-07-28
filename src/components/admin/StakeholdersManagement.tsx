import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit, Trash2, User, Mail, Phone, Building, Search, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StakeholderWizard } from "./StakeholderWizard";
import { StandardPageLayout, ViewMode } from "@/components/layout/StandardPageLayout";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { ManagementCard } from "@/components/ui/management-card";

interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  position: string;
  email: string;
  phone?: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function StakeholdersManagement() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [viewingStakeholder, setViewingStakeholder] = useState<Stakeholder | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  
  const handleLayoutChange = (layout: ViewMode) => {
    if (layout === 'cards' || layout === 'list' || layout === 'grid') {
      setViewMode(layout);
    }
  };
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [influenceFilter, setInfluenceFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const { toast } = useToast();

  // Arabic options from system settings
  const stakeholderTypes = ["حكومي", "خاص", "أكاديمي", "غير ربحي", "مجتمعي", "دولي"];
  const influenceLevels = ["عالي", "متوسط", "منخفض"];
  const interestLevels = ["عالي", "متوسط", "منخفض"];
  const engagementStatuses = ["نشط", "غير نشط", "معلق", "محظور"];

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("stakeholders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stakeholders:", error);
        toast({
          title: "خطأ",
          description: "فشل في جلب أصحاب المصلحة",
          variant: "destructive",
        });
        return;
      }

      setStakeholders(data || []);
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب أصحاب المصلحة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsWizardOpen(true);
  };

  const handleWizardSave = () => {
    setIsWizardOpen(false);
    setEditingStakeholder(null);
    fetchStakeholders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف صاحب المصلحة هذا؟")) return;

    try {
      const { error } = await supabase
        .from("stakeholders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "نجح",
        description: "تم حذف صاحب المصلحة بنجاح",
      });
      
      fetchStakeholders();
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف صاحب المصلحة",
        variant: "destructive",
      });
    }
  };

  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (stakeholder.name && stakeholder.name.toLowerCase().includes(searchLower)) ||
      (stakeholder.organization && stakeholder.organization.toLowerCase().includes(searchLower)) ||
      (stakeholder.position && stakeholder.position.toLowerCase().includes(searchLower)) ||
      (stakeholder.email && stakeholder.email.toLowerCase().includes(searchLower));
    
    const matchesType = typeFilter === "all" || stakeholder.stakeholder_type === typeFilter;
    const matchesInfluence = influenceFilter === "all" || stakeholder.influence_level === influenceFilter;
    const matchesEngagement = engagementFilter === "all" || stakeholder.engagement_status === engagementFilter;
    
    return matchesSearch && matchesType && matchesInfluence && matchesEngagement;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setInfluenceFilter("all");
    setEngagementFilter("all");
  };

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case "عالي": return "bg-red-100 text-red-700";
      case "متوسط": return "bg-yellow-100 text-yellow-700";
      case "منخفض": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getEngagementColor = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-700";
      case "غير نشط": return "bg-blue-100 text-blue-700";
      case "معلق": return "bg-yellow-100 text-yellow-700";
      case "محظور": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">جاري تحميل أصحاب المصلحة...</p>
        </div>
      </div>
    );
  }

  // Create filters for StandardPageLayout
  const filters = [
    {
      id: 'type',
      label: 'نوع أصحاب المصلحة',
      type: 'select' as const,
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'جميع الأنواع', value: 'all' },
        ...stakeholderTypes.map(type => ({ label: type, value: type }))
      ]
    },
    {
      id: 'influence',
      label: 'مستوى التأثير',
      type: 'select' as const,
      value: influenceFilter,
      onChange: setInfluenceFilter,
      options: [
        { label: 'جميع مستويات التأثير', value: 'all' },
        ...influenceLevels.map(level => ({ label: level, value: level }))
      ]
    },
    {
      id: 'engagement',
      label: 'حالة المشاركة',
      type: 'select' as const,
      value: engagementFilter,
      onChange: setEngagementFilter,
      options: [
        { label: 'جميع حالات المشاركة', value: 'all' },
        ...engagementStatuses.map(status => ({ label: status, value: status }))
      ]
    }
  ];

  const secondaryActions = (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "تصدير البيانات",
          description: "سيتم إضافة وظيفة التصدير قريباً",
        });
      }}
    >
      تصدير
    </Button>
  );

  return (
    <>
      <StandardPageLayout 
        title="إدارة أصحاب المصلحة"
        description="تتبع وإدارة علاقات أصحاب المصلحة ومستويات التأثير واستراتيجيات المشاركة"
        itemCount={filteredStakeholders.length}
        addButton={{
          label: "إضافة صاحب مصلحة",
          onClick: () => { setEditingStakeholder(null); setIsWizardOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
        headerActions={secondaryActions}
        supportedLayouts={['cards', 'list', 'grid']}
        defaultLayout={viewMode}
        onLayoutChange={handleLayoutChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
      >
        <ViewLayouts viewMode={viewMode}>
          {filteredStakeholders.map((stakeholder) => (
            <ManagementCard
              key={stakeholder.id}
              id={stakeholder.id}
              title={stakeholder.name}
              subtitle={`${stakeholder.position} - ${stakeholder.organization}`}
              description={stakeholder.notes}
              badges={[
                { label: stakeholder.stakeholder_type, variant: 'outline' },
                { 
                  label: stakeholder.influence_level, 
                  variant: 'outline',
                  className: getInfluenceColor(stakeholder.influence_level)
                },
                { 
                  label: stakeholder.engagement_status, 
                  variant: 'outline',
                  className: getEngagementColor(stakeholder.engagement_status)
                }
              ]}
              metadata={[
                { icon: <Mail className="h-3 w-3" />, label: "البريد", value: stakeholder.email },
                ...(stakeholder.phone ? [{ icon: <Phone className="h-3 w-3" />, label: "الهاتف", value: stakeholder.phone }] : []),
                { icon: <User className="h-3 w-3" />, label: "الاهتمام", value: stakeholder.interest_level }
              ]}
               actions={[
                 { 
                   type: 'edit', 
                   label: 'تعديل',
                   onClick: () => handleEdit(stakeholder)
                 },
                 { 
                   type: 'delete',
                   label: 'حذف',
                   onClick: () => handleDelete(stakeholder.id)
                 }
               ]}
               viewMode={viewMode}
               onClick={() => {
                 setViewingStakeholder(stakeholder);
                 setIsDetailOpen(true);
               }}
            />
          ))}
        </ViewLayouts>

      {(filteredStakeholders.length === 0 && (searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all")) && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            لا توجد أصحاب مصلحة تطابق معايير البحث
          </div>
          <Button variant="outline" onClick={clearFilters}>
            مسح جميع المرشحات
          </Button>
        </div>
      )}

      {(stakeholders.length === 0 && !(searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all")) && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            لا توجد أصحاب مصلحة
          </div>
          <Button onClick={() => { setEditingStakeholder(null); setIsWizardOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة صاحب مصلحة جديد
          </Button>
        </div>
      )}
      </StandardPageLayout>

      {/* Stakeholder Wizard */}
      <StakeholderWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setEditingStakeholder(null);
        }}
        stakeholder={editingStakeholder}
        onSave={handleWizardSave}
      />

      {/* Detail View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل صاحب المصلحة</DialogTitle>
          </DialogHeader>
          {viewingStakeholder && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{viewingStakeholder.name}</h3>
                  <p className="text-muted-foreground">{viewingStakeholder.position} - {viewingStakeholder.organization}</p>
                </div>
                 <div className="flex gap-2">
                   <Badge variant="outline">
                     {viewingStakeholder.stakeholder_type}
                   </Badge>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">معلومات الاتصال</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{viewingStakeholder.email}</span>
                    </div>
                    {viewingStakeholder.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{viewingStakeholder.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">مستويات التأثير والمشاركة</h4>
                  <div className="space-y-2">
                     <div>
                       <span className="text-sm font-medium">مستوى التأثير: </span>
                       <Badge variant="outline" className={getInfluenceColor(viewingStakeholder.influence_level)}>
                         {viewingStakeholder.influence_level}
                       </Badge>
                     </div>
                     <div>
                       <span className="text-sm font-medium">مستوى الاهتمام: </span>
                       <Badge variant="outline">
                         {viewingStakeholder.interest_level}
                       </Badge>
                     </div>
                     <div>
                       <span className="text-sm font-medium">حالة المشاركة: </span>
                       <Badge variant="outline" className={getEngagementColor(viewingStakeholder.engagement_status)}>
                         {viewingStakeholder.engagement_status}
                       </Badge>
                     </div>
                  </div>
                </div>
              </div>

              {viewingStakeholder.notes && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">ملاحظات</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{viewingStakeholder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StakeholdersManagement;