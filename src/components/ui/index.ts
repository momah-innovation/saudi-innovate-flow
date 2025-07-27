// Core Layout Components
export { PageHeader } from './page-header';
export { LayoutSelector } from './layout-selector';
export { SearchAndFilters } from './search-and-filters';
export { ViewLayouts } from './view-layouts';
export { EmptyState } from './empty-state';

// Action Components
export { ActionMenu, getViewEditDeleteActions, getExtendedActions } from './action-menu';
export { DeleteConfirmation } from './delete-confirmation';
export { BulkActions } from './bulk-actions';

// Status & Display Components
export { StatusBadge } from './status-badge';
export { MetricCard } from './metric-card';
export { StateMessage, LoadingState, ErrorState, SuccessState } from './state-message';

// Modal & Form Components
export { DetailModal } from './detail-modal';
export { MultiStepForm } from './multi-step-form';

// List & Detail Components
export { ListItemCard } from './list-item-card';
export { DetailView } from './detail-view';

// Re-export all existing shadcn components for consistency
export * from './accordion';
export * from './alert';
export * from './alert-dialog';
export * from './avatar';
export * from './badge';
export * from './breadcrumb';
export * from './button';
export * from './calendar';
export * from './card';
export * from './carousel';
export * from './chart';
export * from './checkbox';
export * from './collapsible';
export * from './command';
export * from './context-menu';
export * from './dialog';
export * from './drawer';
export * from './dropdown-menu';
export * from './form';
export * from './hover-card';
export * from './input';
export * from './input-otp';
export * from './label';
export * from './menubar';
export * from './navigation-menu';
export * from './pagination';
export * from './popover';
export * from './progress';
export * from './radio-group';
export * from './resizable';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './sidebar';
export * from './skeleton';
export * from './slider';
export { Toaster as SonnerToaster, toast as sonnerToast } from './sonner';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';
export * from './toast';
export * from './toggle';
export * from './toggle-group';
export * from './tooltip';
export { useToast, toast } from './use-toast';

// Type definitions for theming
export type ThemeVariant = 'default' | 'modern' | 'minimal' | 'vibrant';
export type ColorScheme = 'light' | 'dark' | 'auto';