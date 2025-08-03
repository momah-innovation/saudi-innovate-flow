import { 
  Target, Zap, Calendar, X, Clock, Users, Award, 
  TrendingUp, Star, Sparkles, CheckCircle, AlertCircle,
  PlayCircle, XCircle, PauseCircle, Heart, Lightbulb,
  Leaf, Code, Briefcase, MessageSquare, FileText, Activity,
  Info, Trophy
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

  // Badge colors for special features
  badges: {
    new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    trending: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    featured: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  },

  // Status, Priority, Difficulty, and Category Mappings
  mappings: {
    status: [
      {
        value: 'active',
        label: 'Active',
        labelAr: 'نشط',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle
      },
      {
        value: 'published',
        label: 'Active',
        labelAr: 'نشط',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
        icon: CheckCircle
      },
      {
        value: 'upcoming',
        label: 'Upcoming',
        labelAr: 'قريباً',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
        icon: PlayCircle
      },
      {
        value: 'planning',
        label: 'Upcoming',
        labelAr: 'قريباً',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
        icon: PlayCircle
      },
      {
        value: 'draft',
        label: 'Draft',
        labelAr: 'مسودة',
        color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
        icon: AlertCircle
      },
      {
        value: 'closed',
        label: 'Closed',
        labelAr: 'مغلق',
        color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
        icon: XCircle
      },
      {
        value: 'completed',
        label: 'Completed',
        labelAr: 'مكتمل',
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
        icon: CheckCircle
      },
      {
        value: 'cancelled',
        label: 'Cancelled',
        labelAr: 'ملغي',
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400',
        icon: XCircle
      }
    ],

    priority: [
      {
        value: 'عالي',
        label: 'High',
        labelAr: 'عالي',
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400'
      },
      {
        value: 'High',
        label: 'High',
        labelAr: 'عالي',
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400'
      },
      {
        value: 'متوسط',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
      },
      {
        value: 'Medium',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
      },
      {
        value: 'منخفض',
        label: 'Low',
        labelAr: 'منخفض',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400'
      },
      {
        value: 'Low',
        label: 'Low',
        labelAr: 'منخفض',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400'
      }
    ],

    difficulty: [
      {
        value: 'صعب',
        label: 'Hard',
        labelAr: 'صعب',
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      {
        value: 'Hard',
        label: 'Hard',
        labelAr: 'صعب',
        color: 'bg-red-100 text-red-800 border-red-200'
      },
      {
        value: 'متوسط',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      {
        value: 'Medium',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      {
        value: 'سهل',
        label: 'Easy',
        labelAr: 'سهل',
        color: 'bg-green-100 text-green-800 border-green-200'
      },
      {
        value: 'Easy',
        label: 'Easy',
        labelAr: 'سهل',
        color: 'bg-green-100 text-green-800 border-green-200'
      }
    ],

    categories: [
      {
        value: 'health',
        label: 'Health',
        labelAr: 'صحة',
        icon: Heart
      },
      {
        value: 'educational',
        label: 'Educational',
        labelAr: 'تعليمي',
        icon: Lightbulb
      },
      {
        value: 'environmental',
        label: 'Environmental',
        labelAr: 'بيئي',
        icon: Leaf
      },
      {
        value: 'technical',
        label: 'Technical',
        labelAr: 'تقني',
        icon: Code
      },
      {
        value: 'business',
        label: 'Business',
        labelAr: 'أعمال',
        icon: Briefcase
      }
    ],

    notificationTypes: [
      {
        value: 'status_change',
        label: 'Status Change',
        labelAr: 'تغيير الحالة',
        icon: AlertCircle,
        color: 'text-blue-500'
      },
      {
        value: 'new_participant',
        label: 'New Participant',
        labelAr: 'مشارك جديد',
        icon: Users,
        color: 'text-green-500'
      },
      {
        value: 'new_submission',
        label: 'New Submission',
        labelAr: 'مقترح جديد',
        icon: Trophy,
        color: 'text-yellow-500'
      },
      {
        value: 'comment',
        label: 'Comment',
        labelAr: 'تعليق',
        icon: MessageSquare,
        color: 'text-purple-500'
      },
      {
        value: 'deadline_reminder',
        label: 'Deadline Reminder',
        labelAr: 'تذكير بالموعد النهائي',
        icon: Clock,
        color: 'text-red-500'
      },
      {
        value: 'trending',
        label: 'Trending',
        labelAr: 'رائج',
        icon: TrendingUp,
        color: 'text-orange-500'
      }
    ],

    activityTypes: [
      {
        value: 'participation',
        label: 'Participation',
        labelAr: 'مشاركة',
        icon: Users,
        color: 'text-green-500'
      },
      {
        value: 'comment',
        label: 'Comment',
        labelAr: 'تعليق',
        icon: MessageSquare,
        color: 'text-blue-500'
      },
      {
        value: 'submission',
        label: 'Submission',
        labelAr: 'مقترح',
        icon: FileText,
        color: 'text-purple-500'
      },
      {
        value: 'status_change',
        label: 'Status Change',
        labelAr: 'تغيير الحالة',
        icon: AlertCircle,
        color: 'text-orange-500'
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
      scaleIn: 'animate-scale-in',
      enter: 'animate-enter',
      exit: 'animate-exit',
      slideInRight: 'animate-slide-in-right'
    },
    gradients: {
      // Hero section gradients - dark, vibrant theme
      hero: 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600',
      heroOverlay: 'bg-gradient-to-r from-black/50 via-black/30 to-black/40',
      
      // Button gradients matching hero
      button: 'bg-gradient-to-r from-purple-500 to-blue-500',
      buttonHover: 'hover:from-purple-600 hover:to-blue-600',
      
      // Text highlight gradients
      textHighlight: 'bg-gradient-to-r from-yellow-300 to-orange-300',
      
      // Card gradients - consistent with hero theme
      card: 'bg-gradient-to-r from-violet-500/10 to-purple-500/10',
      cardHover: 'hover:from-violet-500/20 hover:to-purple-500/20',
      
      // Filter section gradients
      filter: 'bg-gradient-to-r from-violet-500 to-purple-600',
      filterLight: 'bg-gradient-to-r from-violet-50/90 via-purple-50/90 to-blue-50/90',
      
      // Featured content gradients
      featured: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20',
      
      // Status gradients
      success: 'bg-gradient-to-r from-green-500 to-emerald-500',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      danger: 'bg-gradient-to-r from-red-500 to-pink-500',
      info: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    glassMorphism: {
      // Glass morphism patterns from hero
      light: 'bg-white/5 backdrop-blur-sm border-white/10',
      medium: 'bg-white/10 backdrop-blur-sm border-white/20',
      heavy: 'bg-white/10 backdrop-blur-xl border-white/20',
      
      // Card glass effects
      card: 'bg-white/5 backdrop-blur-sm border-white/10',
      cardHover: 'hover:bg-white/10 transition-all duration-300',
      cardActive: 'bg-white/10 border-white/20 scale-105',
      
      // Badge glass effects
      badge: 'bg-white/10 text-white border-white/20 backdrop-blur-sm'
    },
    colors: {
      // Animation and icon colors consistent with hero
      stats: {
        blue: 'text-blue-400',
        green: 'text-green-400', 
        purple: 'text-purple-400',
        yellow: 'text-yellow-400',
        orange: 'text-orange-400',
        red: 'text-red-400'
      },
      
      // Text colors for dark theme
      text: {
        primary: 'text-white',
        secondary: 'text-white/80',
        muted: 'text-white/60',
        accent: 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300'
      },
      
      // Background variations
      background: {
        primary: 'bg-white/5',
        secondary: 'bg-white/10',
        accent: 'bg-white/20',
        overlay: 'bg-black/60'
      }
    },
    effects: {
      // Animated background elements
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      
      // Hover effects
      hoverScale: 'hover:scale-105 transition-transform duration-300',
      hoverGlow: 'hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300',
      
      // Focus effects
      focus: 'focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500',
      
      // Interactive states
      interactive: 'transition-all duration-300 hover:bg-white/10 cursor-pointer'
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

// Mapping helper functions
export const getStatusMapping = (status: string) => {
  return challengesPageConfig.mappings.status.find(s => s.value === status) || challengesPageConfig.mappings.status[0];
};

export const getPriorityMapping = (priority: string) => {
  return challengesPageConfig.mappings.priority.find(p => p.value === priority) || challengesPageConfig.mappings.priority[0];
};

export const getDifficultyMapping = (difficulty: string) => {
  return challengesPageConfig.mappings.difficulty.find(d => d.value === difficulty) || challengesPageConfig.mappings.difficulty[0];
};

export const getCategoryMapping = (category: string) => {
  return challengesPageConfig.mappings.categories.find(c => c.value === category) || challengesPageConfig.mappings.categories[0];
};

export const getNotificationTypeMapping = (type: string) => {
  return challengesPageConfig.mappings.notificationTypes.find(n => n.value === type) || challengesPageConfig.mappings.notificationTypes[0];
};

export const getActivityTypeMapping = (type: string) => {
  return challengesPageConfig.mappings.activityTypes.find(a => a.value === type) || challengesPageConfig.mappings.activityTypes[0];
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