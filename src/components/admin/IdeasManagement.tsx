import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IdeasManagementList } from "./ideas/IdeasManagementList";
import { IdeaAnalytics } from "./ideas/IdeaAnalytics";
import { IdeaWizard } from "./IdeaWizard";
import { useTranslation } from "@/hooks/useTranslation";

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level: string;
  overall_score: number;
  innovator_id: string;
  challenge_id?: string;
  focus_question_id?: string;
  created_at: string;
  updated_at: string;
  innovator?: {
    user_id: string;
    innovation_score: number;
  };
  challenge?: {
    id: string;
    title_ar: string;
    status: string;
  };
  focus_question?: {
    id: string;
    question_text_ar: string;
  };
}

interface IdeasManagementProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  filters: {
    status: string;
    challenge: string;
    innovator: string;
    maturityLevel: string;
    scoreRange: [number, number];
  };
}

export function IdeasManagement({ 
  viewMode, 
  searchTerm, 
  showAddDialog, 
  onAddDialogChange,
  selectedItems,
  onSelectedItemsChange,
  filters 
}: IdeasManagementProps) {
  const { t } = useTranslation();
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    onAddDialogChange(true);
  };

  const handleView = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDetailView(true);
  };

  const handleRefresh = () => {
    // Refresh ideas list
    console.log('Refreshing ideas...');
  };

  return (
    <>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">قائمة الأفكار</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات والإحصائيات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <IdeasManagementList
            viewMode={viewMode}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
            filters={filters}
            onEdit={handleEdit}
            onView={handleView}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <IdeaAnalytics />
        </TabsContent>
      </Tabs>

      <IdeaWizard
        isOpen={showAddDialog}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedIdea(null);
        }}
        onSave={() => {
          handleRefresh();
          onAddDialogChange(false);
          setSelectedIdea(null);
        }}
        idea={selectedIdea}
      />
    </>
  );
}