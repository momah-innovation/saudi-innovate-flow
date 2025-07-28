import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { IdeasManagement } from '@/components/admin/IdeasManagement';
import { useTranslation } from '@/hooks/useTranslation';

export default function IdeasManagementPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <PageLayout
      title="Ideas Management"
      description="Manage and track ideas from innovators"
    >
      <IdeasManagement
        viewMode={viewMode}
        searchTerm={searchTerm}
        showAddDialog={showAddDialog}
        onAddDialogChange={setShowAddDialog}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
        filters={{
          status: '',
          challenge: '',
          innovator: '',
          maturityLevel: '',
          scoreRange: [0, 100] as [number, number]
        }}
      />
    </PageLayout>
  );
}