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

export interface NotificationTypeMapping {
  value: string;
  label: string;
  labelAr: string;
  icon: any;
  color: string;
}

export interface ActivityTypeMapping {
  value: string;
  label: string;
  labelAr: string;
  icon: any;
  color: string;
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
    notificationTypes: NotificationTypeMapping[];
    activityTypes: ActivityTypeMapping[];
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
      enter: string;
      exit: string;
      slideInRight: string;
    };
    gradients: {
      hero: string;
      heroOverlay: string;
      button: string;
      buttonHover: string;
      textHighlight: string;
      card: string;
      cardHover: string;
      filter: string;
      filterLight: string;
      featured: string;
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
    glassMorphism: {
      light: string;
      medium: string;
      heavy: string;
      card: string;
      cardHover: string;
      cardActive: string;
      badge: string;
    };
    colors: {
      stats: {
        blue: string;
        green: string;
        purple: string;
        yellow: string;
        orange: string;
        red: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
        accent: string;
      };
      background: {
        primary: string;
        secondary: string;
        accent: string;
        overlay: string;
      };
    };
    effects: {
      pulse: string;
      bounce: string;
      hoverScale: string;
      hoverGlow: string;
      focus: string;
      interactive: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      xl: string;
    };
  };
}