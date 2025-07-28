import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { IdeasManagement } from "@/components/admin/IdeasManagement";
import { Button } from "@/components/ui/button";
import { LayoutSelector } from "@/components/ui/layout-selector";
import { SearchAndFilters } from "@/components/ui/search-and-filters";
import { BulkActions } from "@/components/ui/bulk-actions";
import { Plus, FileDown, FileUp, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

export default function IdeasManagementPage() {
  const { toast } = useToast();
  const { t, isRTL } = useTranslation();
  
  // State management
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    challenge: '',
    innovator: '',
    maturityLevel: '',
    scoreRange: [0, 100] as [number, number]
  });

  // Mock data for counts - will be replaced with real data
  const totalIdeas = 156;

  // Filter options
  const statusOptions = [
    { value: 'submitted', label: 'مُرسلة' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'موافق عليها' },
    { value: 'rejected', label: 'مرفوضة' },
    { value: 'in_development', label: 'قيد التطوير' },
    { value: 'implemented', label: 'منفذة' }
  ];

  const maturityOptions = [
    { value: 'concept', label: 'مفهوم' },
    { value: 'prototype', label: 'نموذج أولي' },
    { value: 'pilot', label: 'تجريبي' },
    { value: 'scaled', label: 'قابل للتوسع' }
  ];

  // Export functions
  const handleExportPDF = async () => {
    toast({
      title: "جاري التصدير",
      description: "يتم تصدير الأفكار إلى PDF...",
    });
  };

  const handleExportExcel = async () => {
    toast({
      title: "جاري التصدير", 
      description: "يتم تصدير الأفكار إلى Excel...",
    });
  };

  const handleImport = async () => {
    toast({
      title: "جاري الاستيراد",
      description: "يتم استيراد الأفكار...",
    });
  };

  // Bulk actions
  const bulkActions = [
    {
      id: 'approve',
      label: 'الموافقة على الأفكار المحددة',
      action: () => {
        toast({
          title: "تم بنجاح",
          description: `تم الموافقة على ${selectedItems.length} فكرة`,
        });
        setSelectedItems([]);
      }
    },
    {
      id: 'reject',
      label: 'رفض الأفكار المحددة',
      action: () => {
        toast({
          title: "تم بنجاح",
          description: `تم رفض ${selectedItems.length} فكرة`,
        });
        setSelectedItems([]);
      },
      variant: 'destructive' as const
    },
    {
      id: 'assign-evaluator',
      label: 'تعيين مقيم',
      action: () => {
        toast({
          title: "تم بنجاح",
          description: `تم تعيين مقيم لـ ${selectedItems.length} فكرة`,
        });
        setSelectedItems([]);
      }
    }
  ];

  // Advanced filters
  const advancedFilterOptions = [
    {
      key: 'status',
      label: 'الحالة',
      type: 'select' as const,
      options: statusOptions
    },
    {
      key: 'maturityLevel', 
      label: 'مستوى النضج',
      type: 'select' as const,
      options: maturityOptions
    },
    {
      key: 'scoreRange',
      label: 'نطاق النقاط',
      type: 'range' as const,
      min: 0,
      max: 100
    }
  ];

  return (
    <PageLayout
      title="إدارة الأفكار"
      description="إدارة ومتابعة الأفكار المقدمة من المبتكرين"
      
      primaryAction={{
        label: "إضافة فكرة جديدة",
        onClick: () => setShowAddDialog(true),
        icon: Plus
      }}
      
      secondaryActions={[
        {
          label: "تصدير PDF",
          onClick: handleExportPDF,
          icon: FileDown
        },
        {
          label: "تصدير Excel", 
          onClick: handleExportExcel,
          icon: FileDown
        },
        {
          label: "استيراد",
          onClick: handleImport,
          icon: FileUp
        }
      ]}

      headerContent={
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            المجموع: {totalIdeas} فكرة
          </div>
        </div>
      }

      tools={
        <div className="flex items-center gap-4">
          <LayoutSelector
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'cards', label: 'بطاقات', icon: 'grid' },
              { value: 'list', label: 'قائمة', icon: 'list' },
              { value: 'grid', label: 'شبكة', icon: 'grid-3x3' }
            ]}
          />
          
          <SearchAndFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="البحث في الأفكار..."
            showAdvancedFilters={showAdvancedFilters}
            onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            advancedFilters={advancedFilterOptions}
            filterValues={filters}
            onFilterChange={setFilters}
          />

          {selectedItems.length > 0 && (
            <BulkActions
              selectedCount={selectedItems.length}
              actions={bulkActions}
              onClearSelection={() => setSelectedItems([])}
            />
          )}
        </div>
      }
    >
      <IdeasManagement
        viewMode={viewMode}
        searchTerm={searchTerm}
        showAddDialog={showAddDialog}
        onAddDialogChange={setShowAddDialog}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        filters={filters}
      />
    </PageLayout>
  );
}