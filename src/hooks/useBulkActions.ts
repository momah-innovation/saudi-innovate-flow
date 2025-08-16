import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/utils/error-handler';

export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'secondary';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface UseBulkActionsConfig<T> {
  actions: BulkAction[];
  onAction: (actionId: string, selectedItems: T[]) => Promise<void>;
  getItemId: (item: T) => string;
  getItemDisplayName?: (item: T) => string;
}

export function useBulkActions<T>(config: UseBulkActionsConfig<T>) {
  const { t } = useUnifiedTranslation();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleItem = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback((items: T[]) => {
    const allIds = items.map(config.getItemId);
    const allSelected = allIds.every(id => selectedItems.has(id));
    
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allIds));
    }
  }, [selectedItems, config.getItemId]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const executeAction = useCallback(async (actionId: string, items: T[]) => {
    const action = config.actions.find(a => a.id === actionId);
    if (!action) return;

    const selectedItemObjects = items.filter(item => 
      selectedItems.has(config.getItemId(item))
    );

    if (selectedItemObjects.length === 0) {
      toast.error(t('validation.no_items_selected', 'Please select items to perform this action'));
      return;
    }

    if (action.requiresConfirmation) {
      const confirmMessage = action.confirmationMessage || 
        t('confirm.bulk_action', `Are you sure you want to ${action.label.toLowerCase()} ${selectedItemObjects.length} item(s)?`);
      
      if (!confirm(confirmMessage)) {
        return;
      }
    }

    try {
      setIsProcessing(true);
      await config.onAction(actionId, selectedItemObjects);
      
      toast.success(t('success.bulk_action_completed', `${action.label} completed successfully for ${selectedItemObjects.length} item(s)`));
      clearSelection();
    } catch (error) {
      errorHandler.handleError(error, 'BulkActions.executeBulkAction');
      toast.error(t('error.bulk_action_failed', `Failed to ${action.label.toLowerCase()}. Please try again.`));
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, config, t, clearSelection]);

  const isSelected = useCallback((itemId: string) => {
    return selectedItems.has(itemId);
  }, [selectedItems]);

  const isAllSelected = useCallback((items: T[]) => {
    if (items.length === 0) return false;
    return items.every(item => selectedItems.has(config.getItemId(item)));
  }, [selectedItems, config.getItemId]);

  const isIndeterminate = useCallback((items: T[]) => {
    const selectedCount = items.filter(item => 
      selectedItems.has(config.getItemId(item))
    ).length;
    return selectedCount > 0 && selectedCount < items.length;
  }, [selectedItems, config.getItemId]);

  return {
    // State
    selectedItems,
    selectedCount: selectedItems.size,
    isProcessing,
    
    // Actions
    toggleItem,
    toggleAll,
    clearSelection,
    executeAction,
    
    // Queries
    isSelected,
    isAllSelected,
    isIndeterminate,
    
    // Computed
    hasSelection: selectedItems.size > 0,
    availableActions: config.actions
  };
}