import React, { useState, useEffect } from 'react';
import { Search, Command as CommandIcon, ArrowRight, Clock } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { Input } from './input';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  keywords?: string[];
  category?: string;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
  placeholder?: string;
  recentActions?: string[];
  onRecentUpdate?: (actionId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  actions,
  placeholder,
  recentActions = [],
  onRecentUpdate
}: CommandPaletteProps) {
  const { t } = useUnifiedTranslation();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredActions = React.useMemo(() => {
    if (!search) {
      // Show recent actions first, then all actions
      const recent = actions.filter(action => recentActions.includes(action.id));
      const others = actions.filter(action => !recentActions.includes(action.id));
      return [...recent, ...others];
    }

    return actions.filter(action => {
      const searchLower = search.toLowerCase();
      return (
        action.title.toLowerCase().includes(searchLower) ||
        action.description?.toLowerCase().includes(searchLower) ||
        action.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
        action.category?.toLowerCase().includes(searchLower)
      );
    });
  }, [search, actions, recentActions]);

  const groupedActions = React.useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    
    filteredActions.forEach(action => {
      const category = action.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(action);
    });

    return groups;
  }, [filteredActions]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          handleActionSelect(filteredActions[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleActionSelect = (action: CommandAction) => {
    action.onSelect();
    onRecentUpdate?.(action.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder || t('ui.command_palette.placeholder')}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Badge variant="outline" className="ml-3 text-xs">
            <CommandIcon className="w-3 h-3 mr-1" />
            ⌘K
          </Badge>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedActions).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>{t('ui.command_palette.no_commands_found')}</p>
              <p className="text-sm">{t('ui.command_palette.try_different_search')}</p>
            </div>
          ) : (
            <div className="p-2">
              {Object.entries(groupedActions).map(([category, categoryActions]) => (
                <div key={category}>
                  {/* Category Header */}
                  {Object.keys(groupedActions).length > 1 && (
                     <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                       {category === 'General' && !search && recentActions.length > 0 && categoryActions.some(a => recentActions.includes(a.id))
                         ? t('ui.command_palette.recent')
                         : category
                       }
                    </div>
                  )}

                  {/* Actions */}
                  {categoryActions.map((action, actionIndex) => {
                    const globalIndex = filteredActions.findIndex(a => a.id === action.id);
                    const isSelected = globalIndex === selectedIndex;
                    const Icon = action.icon;
                    const isRecent = recentActions.includes(action.id);

                    return (
                      <div
                        key={action.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
                          isSelected && "bg-primary/10 text-primary"
                        )}
                        onClick={() => handleActionSelect(action)}
                      >
                        {Icon ? (
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <div className="w-5 h-5" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {action.title}
                            </p>
                            {isRecent && !search && (
                              <Clock className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          {action.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {action.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {action.shortcut && (
                            <Badge variant="outline" className="text-xs">
                              {action.shortcut}
                            </Badge>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredActions.length > 0 && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            {t('ui.command_palette.navigation_help')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Hook to manage command palette state and keyboard shortcuts
export function useCommandPalette(actions: CommandAction[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [recentActions, setRecentActions] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateRecent = (actionId: string) => {
    setRecentActions(prev => {
      const filtered = prev.filter(id => id !== actionId);
      return [actionId, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    recentActions,
    updateRecent
  };
}