// UI Migration Helper
// This file provides consistent patterns for migrating existing components to use the new UI library

import { ReactNode } from "react";
import { 
  PageHeader, 
  LayoutSelector, 
  SearchAndFilters, 
  EmptyState, 
  DataCard,
  DataTable,
  AdvancedFilters,
  FormLayout,
  ActionMenu,
  MetricCard,
  StatusBadge,
  Typography,
  Heading1,
  Heading2,
  Heading3,
  BodyText,
  Icon,
  List,
  LoadingSpinner
} from "@/components/ui";

// Migration patterns for common UI elements

export const migratePageHeader = (
  title: string,
  description?: string,
  itemCount?: number,
  actionButton?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  }
) => {
  return (
    <PageHeader
      title={title}
      description={description}
      itemCount={itemCount}
      actionButton={actionButton}
    />
  );
};

export const migrateSearchAndFilters = (
  searchTerm: string,
  onSearchChange: (value: string) => void,
  filtersOpen: boolean,
  onFiltersOpenChange: (open: boolean) => void,
  hasActiveFilters: boolean,
  onClearFilters?: () => void,
  children?: ReactNode
) => {
  return (
    <SearchAndFilters
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filtersOpen={filtersOpen}
      onFiltersOpenChange={onFiltersOpenChange}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={onClearFilters}
    >
      {children}
    </SearchAndFilters>
  );
};

export const migrateEmptyState = (
  icon: ReactNode,
  title: string,
  description: string,
  action?: {
    label: string;
    onClick: () => void;
  }
) => {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={action}
    />
  );
};

// Typography migration helpers
export const migrateHeading1 = (text: string, className?: string) => (
  <Heading1 className={className}>{text}</Heading1>
);

export const migrateHeading2 = (text: string, className?: string) => (
  <Heading2 className={className}>{text}</Heading2>
);

export const migrateHeading3 = (text: string, className?: string) => (
  <Heading3 className={className}>{text}</Heading3>
);

export const migrateBodyText = (text: string, className?: string) => (
  <BodyText className={className}>{text}</BodyText>
);

// Common patterns used across admin components
export const AdminPageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="space-y-6">
    {children}
  </div>
);

export const AdminContentGrid = ({ 
  children,
  viewMode = 'cards'
}: { 
  children: ReactNode;
  viewMode?: 'cards' | 'list' | 'grid';
}) => {
  const gridClasses = {
    cards: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", 
    list: "space-y-3"
  };

  return (
    <div className={gridClasses[viewMode]}>
      {children}
    </div>
  );
};

// Utility to replace old class patterns
export const replaceOldClasses = (className: string) => {
  return className
    .replace(/text-white/g, 'text-primary-foreground')
    .replace(/bg-white/g, 'bg-background')
    .replace(/text-black/g, 'text-foreground')
    .replace(/bg-black/g, 'bg-foreground')
    .replace(/text-3xl/g, 'text-heading-1')
    .replace(/text-2xl/g, 'text-heading-2')
    .replace(/text-xl/g, 'text-heading-3');
};