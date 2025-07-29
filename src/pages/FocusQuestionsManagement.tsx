import { FocusQuestionManagement } from "@/components/admin/FocusQuestionManagement";
import { AppShell } from "@/components/layout/AppShell";
import { PageLayout } from "@/components/layout/PageLayout";
import { useState } from "react";
import { Plus, HelpCircle, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSystemLists } from "@/hooks/useSystemLists";

const FocusQuestionsManagement = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchValue, setSearchValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { questionTypeOptions } = useSystemLists();
  
  const secondaryActions = (
    <>
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="تصدير" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pdf">PDF</SelectItem>
          <SelectItem value="excel">Excel</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2">
        <HelpCircle className="w-4 h-4" />
        الإجراءات المجمعة
      </Button>
    </>
  );

  const filters = (
    <>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {questionTypeOptions.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'open_ended' ? 'سؤال مفتوح' : 
                 type === 'multiple_choice' ? 'متعدد الخيارات' :
                 type === 'yes_no' ? 'نعم/لا' :
                 type === 'rating' ? 'تقييم' :
                 type === 'ranking' ? 'ترتيب' : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب الحساسية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            {['normal', 'sensitive'].map(level => (
              <SelectItem key={level} value={level}>
                {level === 'normal' ? 'عادي' : 'حساس'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[120px]">
        <Select>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="تصفية حسب الارتباط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأسئلة</SelectItem>
            <SelectItem value="challenge_linked">مرتبط بتحدي</SelectItem>
            <SelectItem value="general">سؤال عام</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <AppShell>
      <PageLayout 
        title="إدارة الأسئلة المحورية"
        description="إنشاء وإدارة الأسئلة المحورية للتحديات"
        itemCount={12}
        primaryAction={{
          label: "إنشاء سؤال محوري جديد",
          onClick: () => setShowAddDialog(true),
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="بحث في الأسئلة المحورية..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <FocusQuestionManagement 
          viewMode={viewMode} 
          searchTerm={searchValue} 
          showAddDialog={showAddDialog}
          onAddDialogChange={setShowAddDialog}
        />
      </PageLayout>
    </AppShell>
  );
};

export default FocusQuestionsManagement;