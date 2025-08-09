import { AppShell } from '@/components/layout/AppShell';
import { CampaignsManagement } from '@/components/admin/CampaignsManagement';
import { useState } from 'react';

export default function CampaignsManagementPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <AppShell>
      <CampaignsManagement
        viewMode={viewMode}
        searchTerm={searchTerm}
        showAddDialog={showAddDialog}
        onAddDialogChange={setShowAddDialog}
      />
    </AppShell>
  );
}