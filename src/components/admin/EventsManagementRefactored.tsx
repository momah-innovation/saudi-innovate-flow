import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable, Column } from '@/components/shared/DataTable';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { Pagination } from '@/components/shared/Pagination';
import { ActionPanel } from '@/components/shared/ActionPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventWizard } from '@/components/events/EventWizard';
import { ComprehensiveEventDialog } from '@/components/events/ComprehensiveEventDialog';
import type { BadgeVariant } from '@/types';
import { Calendar, Clock, MapPin, Users, Edit, Eye, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface EventData {
  id: string;
  title_ar: string;
  status: string;
  event_type?: string;
  image_url?: string;
  registered_participants?: number;
  budget?: number;
  description_ar?: string;
  event_category?: string;
  event_visibility?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  format?: string;
  actual_participants?: number;
  is_recurring?: boolean;
  target_stakeholder_groups?: string[];
  partner_organizations?: string[];
  related_focus_questions?: string[];
  inherit_from_campaign?: boolean;
  created_at: string;
  updated_at: string;
}

interface EventsManagementRefactoredProps {
  viewMode: 'cards' | 'list' | 'grid';
  searchTerm: string;
  showAddDialog: boolean;
  onAddDialogChange: (open: boolean) => void;
}

export function EventsManagementRefactored({ 
  viewMode, 
  searchTerm, 
  showAddDialog, 
  onAddDialogChange 
}: EventsManagementRefactoredProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [viewEvent, setViewEvent] = useState<EventData | null>(null);
  const { toast } = useToast();
  const { t, language } = useUnifiedTranslation();

  // Configure data table
  const statusOptions = [
    { value: 'draft', label: t('status.draft') },
    { value: 'published', label: t('status.published') },
    { value: 'ongoing', label: t('status.ongoing') },
    { value: 'completed', label: t('status.completed') },
    { value: 'cancelled', label: t('status.cancelled') }
  ];

  const typeOptions = [
    { value: 'workshop', label: t('event.type.workshop') },
    { value: 'conference', label: t('event.type.conference') },
    { value: 'seminar', label: t('event.type.seminar') },
    { value: 'hackathon', label: t('event.type.hackathon') },
    { value: 'competition', label: t('event.type.competition') }
  ];

  const dataTableConfig = {
    searchFields: ['title_ar', 'description_ar'],
    statusOptions,
    typeOptions,
    bulkActions: {
      actions: [
        {
          id: 'delete',
          label: t('action.delete'),
          icon: Trash2,
          variant: 'destructive' as const,
          requiresConfirmation: true,
          confirmationMessage: t('confirm.bulk_delete_events')
        },
        {
          id: 'publish',
          label: t('action.publish'),
          icon: Eye,
          variant: 'default' as const
        }
      ],
      onAction: handleBulkAction,
      getItemId: (event: EventData) => event.id
    }
  };

  const dataTable = useDataTable(events, dataTableConfig);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    dataTable.setSearchTerm(searchTerm);
  }, [searchTerm]);

  async function loadEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      logger.error('Error loading events', { component: 'EventsManagement', action: 'loadEvents' }, error as Error);
      toast({
        title: t('error.title'),
        description: t('error.load_events'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleBulkAction(actionId: string, selectedItems: EventData[]) {
    if (actionId === 'delete') {
      await Promise.all(
        selectedItems.map(event => handleDelete(event))
      );
      await loadEvents();
    } else if (actionId === 'publish') {
      await Promise.all(
        selectedItems.map(event => handleStatusChange(event, 'published'))
      );
      await loadEvents();
    }
  }

  const handleEdit = (event: EventData) => {
    logger.info('Editing event', { component: 'EventsManagement', action: 'handleEdit', data: { eventId: event.id } });
    setSelectedEvent(event);
  };

  const handleView = (event: EventData) => {
    logger.info('Viewing event', { component: 'EventsManagement', action: 'handleView', data: { eventId: event.id } });
    setViewEvent(event);
  };

  const handleDelete = async (event: EventData) => {
    try {
      logger.info('Deleting event', { component: 'EventsManagement', action: 'handleDelete', data: { eventId: event.id } });
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.event_deleted')
      });
    } catch (error) {
      logger.error('Error deleting event', { component: 'EventsManagement', action: 'handleDelete' }, error as Error);
      toast({
        title: t('error.title'),
        description: t('error.delete_event'),
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleStatusChange = async (event: EventData, newStatus: string) => {
    try {
      logger.info('Changing event status', { component: 'EventsManagement', action: 'handleStatusChange', data: { eventId: event.id, newStatus } });
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: t('success.title'),
        description: t('success.event_status_updated')
      });
    } catch (error) {
      logger.error('Error updating event status', { component: 'EventsManagement', action: 'handleStatusChange' }, error as Error);
      toast({
        title: t('error.title'),
        description: t('error.update_event_status'),
        variant: "destructive"
      });
      throw error;
    }
  };

  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'default';
      case 'ongoing': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const columns: Column<EventData>[] = [
    {
      key: 'title_ar',
      label: t('event.title'),
      sortable: true,
      render: (event) => (
        <div>
          <div className="font-medium">{event.title_ar}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {event.description_ar}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: t('event.status'),
      sortable: true,
      render: (event) => (
        <Badge variant={getStatusColor(event.status)}>
          {statusOptions.find(s => s.value === event.status)?.label || event.status}
        </Badge>
      )
    },
    {
      key: 'event_type',
      label: t('event.type'),
      sortable: true,
      render: (event) => event.event_type ? (
        <Badge variant="outline">
          {typeOptions.find(t => t.value === event.event_type)?.label || event.event_type}
        </Badge>
      ) : '-'
    },
    {
      key: 'event_date',
      label: t('event.date'),
      sortable: true,
      render: (event) => event.event_date 
        ? format(new Date(event.event_date), 'PPP')
        : '-'
    },
    {
      key: 'registered_participants',
      label: t('event.participants'),
      sortable: true,
      render: (event) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {event.registered_participants || 0}
        </div>
      )
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (event) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(event)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(event)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(t('confirm.delete_event', { name: event.title_ar }))) {
                handleDelete(event);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-8 bg-muted rounded w-1/3" />
        <div className="animate-pulse h-64 bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('event.management.title')}</h2>
          <p className="text-muted-foreground">
            {t('event.management.description', { count: dataTable.totalItems })}
          </p>
        </div>
        <Button onClick={() => onAddDialogChange(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('event.add_new')}
        </Button>
      </div>

      {/* Filters */}
      <FilterPanel
        searchTerm={dataTable.searchTerm}
        onSearchChange={dataTable.setSearchTerm}
        statusFilter={dataTable.statusFilter}
        onStatusChange={dataTable.setStatusFilter}
        typeFilter={dataTable.typeFilter}
        onTypeChange={dataTable.setTypeFilter}
        onClearFilters={dataTable.clearFilters}
        hasActiveFilters={dataTable.hasActiveFilters}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
      />

      {/* Bulk Actions */}
      {dataTable.bulkActions?.hasSelection && (
        <ActionPanel
          selectedCount={dataTable.bulkActions.selectedCount}
          actions={dataTableConfig.bulkActions.actions}
          onAction={handleBulkAction}
          data={events}
          onClearSelection={dataTable.bulkActions.clearSelection}
        />
      )}

      {/* Data Table */}
      <DataTable
        data={dataTable.data}
        columns={columns}
        sortConfig={dataTable.sortConfig}
        onSort={dataTable.handleSort}
        onRowClick={handleView}
        bulkSelection={dataTable.bulkActions ? {
          selectedItems: dataTable.bulkActions.selectedItems,
          onToggleItem: dataTable.bulkActions.toggleItem,
          onToggleAll: dataTable.bulkActions.toggleAll,
          getItemId: (event) => event.id,
          isAllSelected: dataTable.bulkActions.isAllSelected,
          isIndeterminate: dataTable.bulkActions.isIndeterminate
        } : undefined}
        emptyState={
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('event.empty.title')}</h3>
            <p className="text-muted-foreground mb-4">{t('event.empty.description')}</p>
            <Button onClick={() => onAddDialogChange(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('event.add_new')}
            </Button>
          </div>
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={dataTable.currentPage}
        totalPages={dataTable.totalPages}
        totalItems={dataTable.totalItems}
        pageSize={dataTable.pageSize}
        onPageChange={dataTable.setCurrentPage}
        hasNextPage={dataTable.hasNextPage}
        hasPreviousPage={dataTable.hasPreviousPage}
      />

      {/* Dialogs */}
      <EventWizard
        isOpen={showAddDialog || !!selectedEvent}
        onClose={() => {
          onAddDialogChange(false);
          setSelectedEvent(null);
        }}
        onSuccess={() => {
          loadEvents();
          onAddDialogChange(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />

      <ComprehensiveEventDialog
        event={viewEvent}
        isOpen={!!viewEvent}
        onClose={() => setViewEvent(null)}
        onEdit={handleEdit}
        onRefresh={loadEvents}
      />
    </div>
  );
}