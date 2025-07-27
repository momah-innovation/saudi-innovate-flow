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
export { StateMessage, ErrorState, SuccessState } from './state-message';

// Modal & Form Components
export { DetailModal } from './detail-modal';
export { MultiStepForm } from './multi-step-form';

// List & Detail Components
export { ListItemCard } from './list-item-card';
export { DetailView } from './detail-view';

// Data Components
export { DataTable, badgeRenderer, dateRenderer, truncateRenderer } from './data-table';
export { DataCard, UserCard, ProjectCard } from './data-card';

// Form Components
export { FormLayout, FormField, FormFieldGroup } from './form-layout';
export { AdvancedFilters } from './advanced-filters';

// Theme Components
export { ThemeProvider, useTheme, themePresets } from './theme-provider';
export { ThemeCustomizer } from './theme-customizer';

// Direction & Internationalization Components
export { DirectionProvider, useDirection, directionUtils } from './direction-provider';
export { LayoutGrid, Container, FlexLayout, CardGrid } from './layout-grid';
export { DirectionalDropdownMenu, DirectionalContextMenu, ActionDropdownMenu } from './directional-menu';

// Typography Components
export { Typography, Heading1, Heading2, Heading3, BodyText, Lead, Caption, MutedText } from './typography';

// Icon Components
export { Icon, IconButton, IconWithBadge } from './icon';

// List Components
export { List, GroupedList, SimpleList, DefinitionList } from './list';

// Toast System
export { toastService, useToastService, showSuccessToast, showErrorToast, showWarningToast, showInfoToast, showLoadingToast, TOAST_MESSAGES } from './toast-service';

// Font Management
export { fontManager, useFontLoader, FontSelector, injectFontStyles, FONT_CONFIGS } from './font-manager';

// Loading Components
export { LoadingSpinner, LoadingDots, LoadingPulse, ProgressBar, CardSkeleton, TableSkeleton, ListSkeleton, FormSkeleton, LoadingOverlay, LoadingState } from './loading';

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