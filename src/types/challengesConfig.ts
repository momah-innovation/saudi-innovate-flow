export interface ViewModeConfig {
  key: 'cards' | 'list' | 'grid';
  label: string;
  labelAr: string;
  gridConfig: {
    className: string;
    gap: string;
    cols: {
      mobile: number;
      tablet: number;
      desktop: number;
      xl?: number;
    };
  };
  variant: 'basic' | 'enhanced' | 'compact';
}

export interface FilterOption {
  value: string;
  label: string;
  labelAr: string;
  icon?: any;
  color?: string;
}

export interface StatusMapping {
  value: string;
  label: string;
  labelAr: string;
  color: string;
  icon: any;
}

export interface PriorityMapping {
  value: string;
  label: string;
  labelAr: string;
  color: string;
}

export interface DifficultyMapping {
  value: string;
  label: string;
  labelAr: string;
  color: string;
}

export interface CategoryMapping {
  value: string;
  label: string;
  labelAr: string;
  icon: any;
}

export interface TabConfig {
  key: string;
  label: string;
  labelAr: string;
  filterFn?: (challenge: any) => boolean;
}

export interface ChallengesPageConfig {
  viewModes: ViewModeConfig[];
  defaultViewMode: 'cards' | 'list' | 'grid';
  
  tabs: TabConfig[];
  defaultTab: string;
  
  filters: {
    status: FilterOption[];
    category: FilterOption[];
    difficulty: FilterOption[];
    sortOptions: FilterOption[];
    features: FilterOption[];
  };

  badges: {
    new: string;
    trending: string;
    urgent: string;
    featured: string;
  };

  mappings: {
    status: StatusMapping[];
    priority: PriorityMapping[];
    difficulty: DifficultyMapping[];
    categories: CategoryMapping[];
  };
  
  defaultFilters: {
    search: string;
    status: string;
    category: string;
    difficulty: string;
    prizeRange: [number, number];
    participantRange: [number, number];
    deadline: string;
    features: string[];
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  
  ui: {
    animations: {
      fadeIn: string;
      pulseGlow: string;
      scaleIn: string;
    };
    gradients: {
      hero: string;
      card: string;
      filter: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      xl: string;
    };
  };
}