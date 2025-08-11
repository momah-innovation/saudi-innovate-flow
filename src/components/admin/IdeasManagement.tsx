import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, BarChart3 } from "lucide-react";
import { IdeasManagementList, Idea } from "./ideas/IdeasManagementList";
import { IdeaAnalytics } from "./ideas/IdeaAnalytics";
import { IdeaWizard } from "./IdeaWizard";
import { PageLayout } from "@/components/layout/PageLayout";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export function IdeasManagement() {
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState("ideas");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [filters] = useState({
    status: 'all',
    challenge: 'all',
    innovator: 'all',
    maturityLevel: 'all',
    scoreRange: [0, 10] as [number, number]
  });
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowAddDialog(true);
  };

  const handleView = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDetailView(true);
  };

  const handleRefresh = () => {
    // Refresh ideas list
    // Refreshing ideas data
  };

  return (
    <PageLayout
      title={t('ideas_management.title')}
      description={t('ideas_management.description')}
      className="space-y-6"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            الأفكار
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            التحليلات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ideas">
          <IdeasManagementList
            data={[]} // Empty data prop - component manages its own data
            viewMode={viewMode}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            onSelectedItemsChange={setSelectedItems}
            filters={filters}
            onEdit={handleEdit}
            onView={handleView}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="analytics">
          <IdeaAnalytics />
        </TabsContent>
      </Tabs>

      <IdeaWizard
        isOpen={showAddDialog}
        onClose={() => {
          setShowAddDialog(false);
          setSelectedIdea(null);
        }}
        onSave={() => {
          handleRefresh();
          setShowAddDialog(false);
          setSelectedIdea(null);
        }}
        idea={selectedIdea}
      />
    </PageLayout>
  );
}