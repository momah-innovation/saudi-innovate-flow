import { 
  Target, Zap, Calendar, X, Clock, Users, Award, 
  TrendingUp, Star, Sparkles 
} from 'lucide-react';
import { ChallengesPageConfig } from '@/types/challengesConfig';

export const challengesPageConfig: ChallengesPageConfig = {
  // View Modes Configuration
  viewModes: [
    {
      key: 'cards',
      label: 'Cards',
      labelAr: 'بطاقات',
      gridConfig: {
        className: 'grid gap-6',
        gap: 'gap-6',
        cols: {
          mobile: 1,
          tablet: 2,
          desktop: 3
        }
      },
      variant: 'enhanced'
    },
    {
      key: 'grid',
      label: 'Grid',
      labelAr: 'شبكة',
      gridConfig: {
        className: 'grid gap-4',
        gap: 'gap-4',
        cols: {
          mobile: 1,
          tablet: 3,
          desktop: 4,
          xl: 5
        }
      },
      variant: 'compact'
    },
    {
      key: 'list',
      label: 'List',
      labelAr: 'قائمة',
      gridConfig: {
        className: 'space-y-3',
        gap: 'space-y-3',
        cols: {
          mobile: 1,
          tablet: 1,
          desktop: 1
        }
      },
      variant: 'enhanced'
    }
  ],
  defaultViewMode: 'cards',

  // Tabs Configuration
  tabs: [
    {
      key: 'all',
      label: 'All Challenges',
      labelAr: 'جميع التحديات'
    },
    {
      key: 'active',
      label: 'Active',
      labelAr: 'نشط',
      filterFn: (challenge) => challenge.status === 'active'
    },
    {
      key: 'upcoming',
      label: 'Upcoming',
      labelAr: 'قريباً',
      filterFn: (challenge) => challenge.status === 'planning' || challenge.status === 'upcoming'
    },
    {
      key: 'trending',
      label: 'Trending',
      labelAr: 'رائج',
      filterFn: (challenge) => challenge.priority_level === 'عالي' || (challenge.participants || 0) > 50
    }
  ],
  defaultTab: 'all',

  // Filters Configuration
  filters: {
    status: [
      { value: 'all', label: 'All Status', labelAr: 'جميع الحالات', icon: Target },
      { value: 'active', label: 'Active', labelAr: 'نشط', icon: Zap },
      { value: 'upcoming', label: 'Upcoming', labelAr: 'قريباً', icon: Calendar },
      { value: 'closed', label: 'Closed', labelAr: 'مغلق', icon: X }
    ],
    
    category: [
      { value: 'all', label: 'All Categories', labelAr: 'جميع الفئات' },
      { value: 'technical', label: 'Technical', labelAr: 'تقني' },
      { value: 'business', label: 'Business', labelAr: 'أعمال' },
      { value: 'health', label: 'Health', labelAr: 'صحة' },
      { value: 'educational', label: 'Educational', labelAr: 'تعليمي' },
      { value: 'environmental', label: 'Environmental', labelAr: 'بيئي' }
    ],
    
    difficulty: [
      { value: 'all', label: 'All Levels', labelAr: 'جميع المستويات' },
      { value: 'سهل', label: 'Easy', labelAr: 'سهل' },
      { value: 'متوسط', label: 'Medium', labelAr: 'متوسط' },
      { value: 'صعب', label: 'Hard', labelAr: 'صعب' }
    ],
    
    sortOptions: [
      { value: 'deadline', label: 'Deadline', labelAr: 'الموعد النهائي', icon: Clock },
      { value: 'participants', label: 'Participants', labelAr: 'عدد المشاركين', icon: Users },
      { value: 'prize', label: 'Prize Amount', labelAr: 'قيمة الجائزة', icon: Award },
      { value: 'submissions', label: 'Submissions', labelAr: 'عدد المساهمات', icon: Target }
    ],
    
    features: [
      { 
        value: 'trending', 
        label: 'Trending', 
        labelAr: 'رائج', 
        icon: TrendingUp,
        color: 'orange'
      },
      { 
        value: 'featured', 
        label: 'Featured', 
        labelAr: 'مميز', 
        icon: Star,
        color: 'yellow'
      },
      { 
        value: 'new', 
        label: 'New', 
        labelAr: 'جديد', 
        icon: Sparkles,
        color: 'blue'
      },
      { 
        value: 'ending-soon', 
        label: 'Ending Soon', 
        labelAr: 'ينتهي قريباً', 
        icon: Clock,
        color: 'red'
      }
    ]
  },

  // Default Filter State
  defaultFilters: {
    search: '',
    status: 'all',
    category: 'all',
    difficulty: 'all',
    prizeRange: [0, 10000000], // Will be overridden by dynamic values
    participantRange: [0, 1000], // Will be overridden by dynamic values
    deadline: 'all',
    features: [],
    sortBy: 'deadline',
    sortOrder: 'desc'
  },

  // UI Configuration
  ui: {
    animations: {
      fadeIn: 'animate-fade-in',
      pulseGlow: 'animate-pulse-glow',
      scaleIn: 'animate-scale-in'
    },
    gradients: {
      hero: 'bg-gradient-to-r from-violet-50/90 via-purple-50/90 to-blue-50/90',
      card: 'bg-gradient-to-r from-violet-100 to-purple-100',
      filter: 'bg-gradient-to-r from-violet-500 to-purple-600'
    },
    breakpoints: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      xl: '1280px'
    }
  }
};

// Helper functions for configuration
export const getViewModeConfig = (viewMode: string) => {
  return challengesPageConfig.viewModes.find(vm => vm.key === viewMode) || challengesPageConfig.viewModes[0];
};

export const getTabConfig = (tabKey: string) => {
  return challengesPageConfig.tabs.find(tab => tab.key === tabKey) || challengesPageConfig.tabs[0];
};

export const getFilterOptions = (filterType: keyof typeof challengesPageConfig.filters) => {
  return challengesPageConfig.filters[filterType] || [];
};

export const createGridClassName = (viewMode: string) => {
  const config = getViewModeConfig(viewMode);
  const { cols } = config.gridConfig;
  
  if (viewMode === 'list') {
    return 'space-y-3';
  }
  
  let className = 'grid ';
  className += `grid-cols-${cols.mobile} `;
  if (cols.tablet) className += `md:grid-cols-${cols.tablet} `;
  if (cols.desktop) className += `lg:grid-cols-${cols.desktop} `;
  if (cols.xl) className += `xl:grid-cols-${cols.xl} `;
  className += config.gridConfig.gap;
  
  return className;
};