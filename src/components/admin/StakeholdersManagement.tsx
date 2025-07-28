import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit, Trash2, User, Mail, Phone, Building, Search, X, Eye, Download, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StakeholderWizard } from "./StakeholderWizard";
import { StandardPageLayout, ViewMode } from "@/components/layout/StandardPageLayout";

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
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [influenceFilter, setInfluenceFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  
  // Bulk selection states
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
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

  // Export functionality
  const exportStakeholders = (selectedIds: string[]) => {
    const dataToExport = stakeholders.filter(s => selectedIds.length === 0 || selectedIds.includes(s.id));
    
    const csvData = dataToExport.map(stakeholder => ({
      'الاسم': stakeholder.name || '',
      'المؤسسة': stakeholder.organization || '',
      'المنصب': stakeholder.position || '',
      'البريد الإلكتروني': stakeholder.email || '',
      'الهاتف': stakeholder.phone || '',
      'نوع صاحب المصلحة': stakeholder.stakeholder_type || '',
      'مستوى التأثير': stakeholder.influence_level || '',
      'مستوى الاهتمام': stakeholder.interest_level || '',
      'حالة المشاركة': stakeholder.engagement_status || '',
      'الملاحظات': stakeholder.notes || '',
      'تاريخ الإنشاء': new Date(stakeholder.created_at).toLocaleDateString('ar-SA')
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `stakeholders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: "تم التصدير بنجاح",
      description: `تم تصدير ${dataToExport.length} صاحب مصلحة`,
    });
  };

  // Bulk actions
  const bulkActions = [
    {
      id: 'export',
      label: 'تصدير أصحاب المصلحة',
      icon: <Download className="w-4 h-4" />,
      onClick: exportStakeholders,
      variant: 'outline' as const
    },
    {
      id: 'archive',
      label: 'أرشفة أصحاب المصلحة',
      icon: <Archive className="w-4 h-4" />,
      onClick: (ids: string[]) => {
        toast({
          title: "أرشفة أصحاب المصلحة",
          description: "سيتم إضافة وظيفة الأرشفة قريباً",
        });
      },
      variant: 'outline' as const
    }
  ];

  // Bulk selection handlers
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(filteredStakeholders.map(s => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
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

  // Define filters for StandardPageLayout
  const filters = [
    {
      id: 'type',
      label: 'نوع صاحب المصلحة',
      type: 'select' as const,
      value: typeFilter,
      onChange: setTypeFilter,
      placeholder: "جميع الأنواع",
      options: [
        { value: "all", label: "جميع الأنواع" },
        ...stakeholderTypes.map(type => ({ value: type, label: type }))
      ]
    },
    {
      id: 'influence',
      label: 'مستوى التأثير',
      type: 'select' as const,
      value: influenceFilter,
      onChange: setInfluenceFilter,
      placeholder: "جميع مستويات التأثير",
      options: [
        { value: "all", label: "جميع مستويات التأثير" },
        ...influenceLevels.map(level => ({ value: level, label: level }))
      ]
    },
    {
      id: 'engagement',
      label: 'حالة المشاركة',
      type: 'select' as const,
      value: engagementFilter,
      onChange: setEngagementFilter,
      placeholder: "جميع حالات المشاركة",
      options: [
        { value: "all", label: "جميع حالات المشاركة" },
        ...engagementStatuses.map(status => ({ value: status, label: status }))
      ]
    }
  ];

  const emptyStateContent = (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">👥</div>
      <h3 className="text-lg font-semibold mb-2">لا توجد أصحاب مصلحة</h3>
      <p className="text-muted-foreground mb-4">ابدأ بإضافة صاحب مصلحة جديد لبناء شبكة علاقاتك</p>
      <Button onClick={() => { setEditingStakeholder(null); setIsWizardOpen(true); }}>
        <Plus className="w-4 h-4 mr-2" />
        إضافة صاحب مصلحة جديد
      </Button>
    </div>
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
        supportedLayouts={['cards', 'list', 'grid']}
        defaultLayout={viewMode}
        onLayoutChange={setViewMode}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        bulkActions={bulkActions}
        totalItems={filteredStakeholders.length}
        emptyState={filteredStakeholders.length === 0 ? emptyStateContent : undefined}
      >
        <div className={
          viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' :
          viewMode === 'grid' ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'space-y-4'
        }>
        {viewMode === 'list' ? (
          // List View
          filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{stakeholder.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {stakeholder.organization}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {stakeholder.position}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {stakeholder.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                         <Badge variant="outline" className="text-xs">
                           {stakeholder.stakeholder_type}
                         </Badge>
                         <Badge variant="outline" className={`text-xs ${getInfluenceColor(stakeholder.influence_level)}`}>
                           {stakeholder.influence_level}
                         </Badge>
                         <Badge variant="outline" className={`text-xs ${getEngagementColor(stakeholder.engagement_status)}`}>
                           {stakeholder.engagement_status}
                         </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewingStakeholder(stakeholder);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(stakeholder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(stakeholder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Card/Grid View
          filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3" />
                        {stakeholder.organization}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {stakeholder.position}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {stakeholder.email}
                      </div>
                      {stakeholder.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {stakeholder.phone}
                        </div>
                      )}
                    </div>
                     <div className="flex items-center gap-2 flex-wrap">
                       <Badge variant="outline">
                         {stakeholder.stakeholder_type}
                       </Badge>
                       <Badge variant="outline" className={getInfluenceColor(stakeholder.influence_level)}>
                         {stakeholder.influence_level}
                       </Badge>
                       <Badge variant="outline" className={getEngagementColor(stakeholder.engagement_status)}>
                         {stakeholder.engagement_status}
                       </Badge>
                     </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewingStakeholder(stakeholder);
                      setIsDetailOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    عرض
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(stakeholder)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(stakeholder.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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