import { AppShell } from '@/components/layout/AppShell';
import { EventsManagement } from '@/components/admin/EventsManagement';
import { useState } from 'react';

export default function EventsManagementPage() {
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <AppShell>
      <EventsManagement
        viewMode={viewMode}
        searchTerm={searchTerm}
        showAddDialog={showAddDialog}
        onAddDialogChange={setShowAddDialog}
      />
    </AppShell>
  );
}