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
        color: 'text-warning'
      },
      { 
        value: 'featured', 
        label: 'Featured', 
        labelAr: 'مميز', 
        icon: Star,
        color: 'text-expert'
      },
      { 
        value: 'new', 
        label: 'New', 
        labelAr: 'جديد', 
        icon: Sparkles,
        color: 'text-accent'
      },
      { 
        value: 'ending-soon', 
        label: 'Ending Soon', 
        labelAr: 'ينتهي قريباً', 
        icon: Clock,
        color: 'text-destructive'
      }
    ]
  },

  // Badge colors for special features - hero theme aligned
  badges: {
    new: 'bg-accent text-accent-foreground border-0',
    trending: 'bg-warning text-warning-foreground border-0 animate-pulse',
    urgent: 'bg-destructive text-destructive-foreground border-0 animate-pulse',
    featured: 'bg-expert text-expert-foreground border-0'
  },

  // Status, Priority, Difficulty, and Category Mappings
  mappings: {
    status: [
      {
        value: 'active',
        label: 'Active',
        labelAr: 'نشط',
        color: 'bg-success text-success-foreground border-success/20',
        icon: CheckCircle
      },
      {
        value: 'published',
        label: 'Active',
        labelAr: 'نشط',
        color: 'bg-success text-success-foreground border-success/20',
        icon: CheckCircle
      },
      {
        value: 'upcoming',
        label: 'Upcoming',
        labelAr: 'قريباً',
        color: 'bg-accent text-accent-foreground border-accent/20',
        icon: PlayCircle
      },
      {
        value: 'planning',
        label: 'Upcoming',
        labelAr: 'قريباً',
        color: 'bg-accent text-accent-foreground border-accent/20',
        icon: PlayCircle
      },
      {
        value: 'draft',
        label: 'Draft',
        labelAr: 'مسودة',
        color: 'bg-muted text-muted-foreground border-muted/20',
        icon: AlertCircle
      },
      {
        value: 'closed',
        label: 'Closed',
        labelAr: 'مغلق',
        color: 'bg-muted text-muted-foreground border-muted/20',
        icon: XCircle
      },
      {
        value: 'completed',
        label: 'Completed',
        labelAr: 'مكتمل',
        color: 'bg-innovation text-innovation-foreground border-innovation/20',
        icon: CheckCircle
      },
      {
        value: 'cancelled',
        label: 'Cancelled',
        labelAr: 'ملغي',
        color: 'bg-destructive text-destructive-foreground border-destructive/20',
        icon: XCircle
      }
    ],

    priority: [
      {
        value: 'عالي',
        label: 'High',
        labelAr: 'عالي',
        color: 'bg-destructive text-destructive-foreground border-destructive/20'
      },
      {
        value: 'High',
        label: 'High',
        labelAr: 'عالي',
        color: 'bg-destructive text-destructive-foreground border-destructive/20'
      },
      {
        value: 'متوسط',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-warning text-warning-foreground border-warning/20'
      },
      {
        value: 'Medium',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-warning text-warning-foreground border-warning/20'
      },
      {
        value: 'منخفض',
        label: 'Low',
        labelAr: 'منخفض',
        color: 'bg-success text-success-foreground border-success/20'
      },
      {
        value: 'Low',
        label: 'Low',
        labelAr: 'منخفض',
        color: 'bg-success text-success-foreground border-success/20'
      }
    ],

    difficulty: [
      {
        value: 'صعب',
        label: 'Hard',
        labelAr: 'صعب',
        color: 'bg-destructive text-destructive-foreground border-destructive/20'
      },
      {
        value: 'Hard',
        label: 'Hard',
        labelAr: 'صعب',
        color: 'bg-destructive text-destructive-foreground border-destructive/20'
      },
      {
        value: 'متوسط',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-warning text-warning-foreground border-warning/20'
      },
      {
        value: 'Medium',
        label: 'Medium',
        labelAr: 'متوسط',
        color: 'bg-warning text-warning-foreground border-warning/20'
      },
      {
        value: 'سهل',
        label: 'Easy',
        labelAr: 'سهل',
        color: 'bg-success text-success-foreground border-success/20'
      },
      {
        value: 'Easy',
        label: 'Easy',
        labelAr: 'سهل',
        color: 'bg-success text-success-foreground border-success/20'
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
        color: 'text-accent'
      },
      {
        value: 'new_participant',
        label: 'New Participant',
        labelAr: 'مشارك جديد',
        icon: Users,
        color: 'text-success'
      },
      {
        value: 'new_submission',
        label: 'New Submission',
        labelAr: 'مقترح جديد',
        icon: Trophy,
        color: 'text-expert'
      },
      {
        value: 'comment',
        label: 'Comment',
        labelAr: 'تعليق',
        icon: MessageSquare,
        color: 'text-innovation'
      },
      {
        value: 'deadline_reminder',
        label: 'Deadline Reminder',
        labelAr: 'تذكير بالموعد النهائي',
        icon: Clock,
        color: 'text-destructive'
      },
      {
        value: 'trending',
        label: 'Trending',
        labelAr: 'رائج',
        icon: TrendingUp,
        color: 'text-warning'
      }
    ],

    activityTypes: [
      {
        value: 'participation',
        label: 'Participation',
        labelAr: 'مشاركة',
        icon: Users,
        color: 'text-success'
      },
      {
        value: 'comment',
        label: 'Comment',
        labelAr: 'تعليق',
        icon: MessageSquare,
        color: 'text-accent'
      },
      {
        value: 'submission',
        label: 'Submission',
        labelAr: 'مقترح',
        icon: FileText,
        color: 'text-innovation'
      },
      {
        value: 'status_change',
        label: 'Status Change',
        labelAr: 'تغيير الحالة',
        icon: AlertCircle,
        color: 'text-warning'
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
      // Hero section gradients using semantic tokens
      hero: 'bg-gradient-to-r from-primary via-accent to-innovation',
      heroOverlay: 'bg-gradient-to-r from-background/80 via-background/60 to-background/70',
      
      // Button gradients matching hero
      button: 'bg-gradient-to-r from-primary to-accent',
      buttonHover: 'hover:from-primary-dark hover:to-accent',
      
      // Text highlight gradients
      textHighlight: 'bg-gradient-to-r from-expert to-warning',
      
      // Card gradients - consistent with hero theme
      card: 'bg-gradient-to-r from-primary/10 to-accent/10',
      cardHover: 'hover:from-primary/20 hover:to-accent/20',
      
      // Filter section gradients
      filter: 'bg-gradient-to-r from-primary to-innovation',
      filterLight: 'bg-gradient-to-r from-primary/5 via-accent/5 to-innovation/5',
      
      // Featured content gradients
      featured: 'bg-gradient-to-br from-innovation/20 to-accent/20',
      
      // Status gradients
      success: 'bg-gradient-to-r from-success to-success',
      warning: 'bg-gradient-to-r from-warning to-expert',
      danger: 'bg-gradient-to-r from-destructive to-destructive',
      info: 'bg-gradient-to-r from-accent to-partner'
    },
    glassMorphism: {
      // Glass morphism patterns using semantic tokens
      light: 'bg-background/5 backdrop-blur-sm border-border/10',
      medium: 'bg-background/10 backdrop-blur-sm border-border/20',
      heavy: 'bg-background/10 backdrop-blur-xl border-border/20',
      
      // Card glass effects
      card: 'bg-card/5 backdrop-blur-sm border-border/10',
      cardHover: 'hover:bg-card/10 transition-all duration-300',
      cardActive: 'bg-card/10 border-border/20 scale-105',
      
      // Badge glass effects
      badge: 'bg-background/10 text-foreground border-border/20 backdrop-blur-sm'
    },
    colors: {
      // Animation and icon colors using semantic tokens
      stats: {
        blue: 'text-accent',
        green: 'text-success', 
        purple: 'text-innovation',
        yellow: 'text-expert',
        orange: 'text-warning',
        red: 'text-destructive'
      },
      
      // Text colors using semantic tokens
      text: {
        primary: 'text-foreground',
        secondary: 'text-foreground/80',
        muted: 'text-muted-foreground',
        accent: 'text-transparent bg-clip-text bg-gradient-to-r from-expert to-warning'
      },
      
      // Background variations using semantic tokens
      background: {
        primary: 'bg-background/5',
        secondary: 'bg-background/10',
        accent: 'bg-accent/20',
        overlay: 'bg-background/60'
      }
    },
    effects: {
      // Animated background elements
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
      
      // Hover effects
      hoverScale: 'hover:scale-105 transition-transform duration-300',
      hoverGlow: 'hover:shadow-lg hover:shadow-primary/25 transition-all duration-300',
      
      // Focus effects
      focus: 'focus:ring-2 focus:ring-primary/50 focus:border-primary',
      
      // Interactive states
      interactive: 'transition-all duration-300 hover:bg-background/10 cursor-pointer'
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