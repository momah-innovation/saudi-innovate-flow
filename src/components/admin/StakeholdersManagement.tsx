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
import { PageLayout } from "@/components/layout/PageLayout";

interface Stakeholder {
  id: string;
  name: string;
  name_ar?: string;
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
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [influenceFilter, setInfluenceFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const { toast } = useToast();

  // Hardcoded options for now
  const stakeholderTypes = ["government", "private_sector", "academic", "ngo", "community", "international"];
  const influenceLevels = ["high", "medium", "low"];
  const interestLevels = ["high", "medium", "low"];
  const engagementStatuses = ["active", "passive", "neutral", "resistant", "supporter"];

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

  // Filter stakeholders based on search and filters
  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      stakeholder.name.toLowerCase().includes(searchLower) ||
      (stakeholder.name_ar && stakeholder.name_ar.toLowerCase().includes(searchLower)) ||
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
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getEngagementColor = (status: string) => {
    switch (status) {
      case "supporter": return "bg-green-100 text-green-700";
      case "active": return "bg-blue-100 text-blue-700";
      case "neutral": return "bg-gray-100 text-gray-700";
      case "passive": return "bg-yellow-100 text-yellow-700";
      case "resistant": return "bg-red-100 text-red-700";
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

  // Create filters for PageLayout
  const filters = (
    <>
      <div className="min-w-[140px]">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="جميع الأنواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {stakeholderTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px]">
        <Select value={influenceFilter} onValueChange={setInfluenceFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="جميع مستويات التأثير" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع مستويات التأثير</SelectItem>
            {influenceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px]">
        <Select value={engagementFilter} onValueChange={setEngagementFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="جميع حالات المشاركة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع حالات المشاركة</SelectItem>
            {engagementStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

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
      <PageLayout 
        title="إدارة أصحاب المصلحة"
        description="تتبع وإدارة علاقات أصحاب المصلحة ومستويات التأثير واستراتيجيات المشاركة"
        itemCount={filteredStakeholders.length}
        primaryAction={{
          label: "إضافة صاحب مصلحة",
          onClick: () => { setEditingStakeholder(null); setIsWizardOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="البحث في أصحاب المصلحة..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                    {stakeholder.name_ar && (
                      <p className="text-sm text-muted-foreground" dir="rtl">{stakeholder.name_ar}</p>
                    )}
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
                        {stakeholder.stakeholder_type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                      <Badge variant="outline" className={getInfluenceColor(stakeholder.influence_level)}>
                        {stakeholder.influence_level.charAt(0).toUpperCase() + stakeholder.influence_level.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getEngagementColor(stakeholder.engagement_status)}>
                        {stakeholder.engagement_status.charAt(0).toUpperCase() + stakeholder.engagement_status.slice(1)}
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
          ))}
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
      </PageLayout>

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
                  {viewingStakeholder.name_ar && (
                    <p className="text-lg text-muted-foreground" dir="rtl">{viewingStakeholder.name_ar}</p>
                  )}
                  <p className="text-muted-foreground">{viewingStakeholder.position} - {viewingStakeholder.organization}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {viewingStakeholder.stakeholder_type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
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
                        {viewingStakeholder.influence_level.charAt(0).toUpperCase() + viewingStakeholder.influence_level.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">مستوى الاهتمام: </span>
                      <Badge variant="outline">
                        {viewingStakeholder.interest_level.charAt(0).toUpperCase() + viewingStakeholder.interest_level.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">حالة المشاركة: </span>
                      <Badge variant="outline" className={getEngagementColor(viewingStakeholder.engagement_status)}>
                        {viewingStakeholder.engagement_status.charAt(0).toUpperCase() + viewingStakeholder.engagement_status.slice(1)}
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