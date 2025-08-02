// Utility types for enhanced type safety

// Generic utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NonNullable<T> = T extends null | undefined ? never : T;

// Make specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Extract specific properties
export type PickBy<T, K extends keyof T> = Pick<T, K>;

// Omit specific properties
export type OmitBy<T, K extends keyof T> = Omit<T, K>;

// Create types for form data (without system fields)
export type FormData<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

// Create types for API payloads (partial form data)
export type CreatePayload<T> = FormData<T>;
export type UpdatePayload<T> = Partial<FormData<T>> & { id: string };

// Async operation states
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// API result types
export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
};

// Form validation types
export type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

// Component state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type PaginationState = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type FilterState<T> = {
  [K in keyof T]?: T[K] | T[K][];
};

export type SortState<T> = {
  field: keyof T;
  direction: 'asc' | 'desc';
};

// Event handler types
export type ChangeHandler<T> = (value: T) => void;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;
export type ClickHandler = (event: React.MouseEvent) => void;
export type KeyboardHandler = (event: React.KeyboardEvent) => void;

// Component prop types
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
export type ComponentColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// Layout types
export type LayoutMode = 'cards' | 'list' | 'grid' | 'table';
export type ViewMode = 'compact' | 'comfortable' | 'spacious';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';

// Navigation types
export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  badge?: string | number;
  children?: NavigationItem[];
  permission?: string;
};

// Permission types
export type Permission = 
  | 'read:challenges'
  | 'write:challenges'
  | 'delete:challenges'
  | 'read:ideas'
  | 'write:ideas'
  | 'delete:ideas'
  | 'read:experts'
  | 'write:experts'
  | 'delete:experts'
  | 'read:partners'
  | 'write:partners'
  | 'delete:partners'
  | 'read:teams'
  | 'write:teams'
  | 'delete:teams'
  | 'read:assignments'
  | 'write:assignments'
  | 'delete:assignments'
  | 'read:campaigns'
  | 'write:campaigns'
  | 'delete:campaigns'
  | 'read:events'
  | 'write:events'
  | 'delete:events'
  | 'read:evaluations'
  | 'write:evaluations'
  | 'delete:evaluations'
  | 'read:opportunities'
  | 'write:opportunities'
  | 'delete:opportunities'
  | 'read:analytics'
  | 'write:analytics'
  | 'admin:all';

export type RolePermissions = {
  [role: string]: Permission[];
};

// Search and filter types
export type SearchableFields<T> = {
  [K in keyof T]?: boolean;
};

export type FilterableFields<T> = {
  [K in keyof T]?: {
    type: 'select' | 'multiselect' | 'range' | 'date' | 'boolean';
    options?: Array<{ label: string; value: any }>;
  };
};

// Analytics types
export type MetricType = 'count' | 'percentage' | 'average' | 'sum' | 'rate';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'radar';

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export type MetricConfig = {
  id: string;
  label: string;
  type: MetricType;
  format?: 'number' | 'percentage' | 'currency' | 'time';
  chartType?: ChartType;
};

// File upload types
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'other';

export type UploadConfig = {
  maxSize: number; // in bytes
  allowedTypes: string[];
  multiple?: boolean;
  compress?: boolean;
};

export type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
};

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationConfig = {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
};

// Export all utility functions
export const createAsyncState = <T>(initialData: T | null = null): AsyncState<T> => ({
  data: initialData,
  loading: false,
  error: null,
});

export const createPaginationState = (page = 1, limit = 10): PaginationState => ({
  page,
  limit,
  total: 0,
  hasMore: false,
});

export const createApiResult = <T>(success: boolean, data?: T, error?: string): ApiResult<T> => ({
  success,
  data,
  error,
});

// Type predicate helpers
export const isAsyncLoading = <T>(state: AsyncState<T>): boolean => state.loading;
export const isAsyncError = <T>(state: AsyncState<T>): boolean => !!state.error;
export const isAsyncSuccess = <T>(state: AsyncState<T>): boolean => !state.loading && !state.error && state.data !== null;

export const isApiSuccess = <T>(result: ApiResult<T>): result is ApiResult<T> & { data: T } => 
  result.success && result.data !== undefined;

export const isApiError = <T>(result: ApiResult<T>): result is ApiResult<T> & { error: string } => 
  !result.success && result.error !== undefined;