import { useState } from "react";
import { StandardPageLayout, BulkAction, FilterConfig } from "./StandardPageLayout";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Trash2, Archive, Edit } from "lucide-react";

// Example usage of StandardPageLayout
export function StandardPageExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Sample data
  const items = [
    { id: '1', title: 'Campaign 1', description: 'Description 1', status: 'active' },
    { id: '2', title: 'Campaign 2', description: 'Description 2', status: 'draft' },
    { id: '3', title: 'Campaign 3', description: 'Description 3', status: 'completed' },
  ];
  
  // Filter configuration
  const filters: FilterConfig[] = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All', value: '' },
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Completed', value: 'completed' }
      ],
      placeholder: 'Select status',
      onChange: (value) => console.log('Status filter:', value)
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange',
      placeholder: 'Select date range',
      onChange: (value) => console.log('Date range:', value)
    }
  ];
  
  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    {
      id: 'edit',
      label: 'Edit Selected',
      icon: <Edit className="w-4 h-4" />,
      onClick: (ids) => console.log('Edit items:', ids),
      variant: 'outline'
    },
    {
      id: 'archive',
      label: 'Archive Selected',
      icon: <Archive className="w-4 h-4" />,
      onClick: (ids) => console.log('Archive items:', ids),
      variant: 'outline'
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ids) => console.log('Delete items:', ids),
      variant: 'destructive'
    }
  ];
  
  // Selection handlers
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(items.map(item => item.id));
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
  
  // Render items as cards
  const renderItems = () => {
    return items.map((item) => (
      <DataCard
        key={item.id}
        item={item}
        title={item.title}
        description={item.description}
        selected={selectedItems.includes(item.id)}
        onSelect={(selected) => handleSelectItem(item.id, selected)}
        badges={[{ label: item.status, variant: 'outline' }]}
        actions={
          <Button variant="outline" size="sm">
            View Details
          </Button>
        }
      />
    ));
  };
  
  return (
    <StandardPageLayout
      title="Example Management"
      description="Manage your example items with advanced features"
      itemCount={items.length}
      
      // Add button
      addButton={{
        label: "Add New Item",
        onClick: () => console.log('Add new item')
      }}
      
      // Layout options
      supportedLayouts={['cards', 'list', 'grid']}
      defaultLayout="cards"
      onLayoutChange={(layout) => console.log('Layout changed:', layout)}
      
      // Search and filters
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filters={filters}
      onClearFilters={() => {
        setSearchTerm('');
        console.log('Clear all filters');
      }}
      
      // Bulk actions
      selectedItems={selectedItems}
      onSelectAll={handleSelectAll}
      onSelectItem={handleSelectItem}
      bulkActions={bulkActions}
      totalItems={items.length}
      
      // Additional header actions
      headerActions={
        <Button variant="outline" size="sm">
          Export
        </Button>
      }
    >
      {renderItems()}
    </StandardPageLayout>
  );
}