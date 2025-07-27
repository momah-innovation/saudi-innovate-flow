export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Common UI - Arabic as primary
    search: 'بحث',
    filters: 'المرشحات',
    actions: 'الإجراءات',
    bulkActions: 'الإجراءات المجمعة',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    create: 'إنشاء',
    update: 'تحديث',
    loading: 'جاري التحميل...',
    noResults: 'لا توجد نتائج',
    selectAll: 'تحديد الكل',
    selected: 'محدد',
    
    // Toast messages
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    
    // Form actions
    submit: 'إرسال',
    close: 'إغلاق',
    open: 'فتح',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    yes: 'نعم',
    no: 'لا',
    all: 'الكل',
    none: 'لا شيء',
    
    // Empty states
    noData: 'لا توجد بيانات متاحة',
    emptyList: 'لا توجد عناصر للعرض',
    noItemsFound: 'لم يتم العثور على عناصر',
    
    // Placeholders
    searchPlaceholder: 'البحث...',
    selectOption: 'اختر خيار',
    addNew: 'إضافة جديد',
    
    // Navigation & Pages
    dashboard: 'لوحة التحكم',
    admin: 'المدير',
    administration: 'الإدارة',
    management: 'الإدارة',
    userManagement: 'إدارة المستخدمين',
    teamManagement: 'إدارة الفريق',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    users: 'المستخدمون',
    team: 'الفريق',
    
    // Navigation Sections
    workspace: 'مساحة العمل',
    ideas: 'الأفكار',
    challenges: 'التحديات',
    evaluations: 'التقييمات',
    expertise: 'الخبرة',
    events: 'الأحداث',
    innovationTeams: 'فرق الابتكار',
    stakeholders: 'أصحاب المصلحة',
    analytics: 'التحليلات',
    trends: 'الاتجاهات والرؤى',
    reports: 'التقارير',
    challengeManagement: 'إدارة التحديات',
    focusQuestions: 'أسئلة التركيز',
    partners: 'الشركاء',
    sectors: 'القطاعات',
    organizationalStructure: 'الهيكل التنظيمي',
    expertAssignments: 'مهام الخبراء',
    relationshipOverview: 'نظرة عامة على العلاقات',
    systemSettings: 'إعدادات النظام',
    systemAnalytics: 'تحليلات النظام',
    systemDocumentation: 'وثائق النظام',
    
    // Authentication
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    
    // Common Actions
    export: 'تصدير',
    import: 'استيراد',
    download: 'تحميل',
    upload: 'رفع',
    send: 'إرسال',
    notification: 'إشعار',
    notifications: 'الإشعارات',
    
    // Status & States
    registered: 'مسجل',
    registering: 'جاري التسجيل',
    registerForEvent: 'التسجيل في الحدث',
    
    // Campaigns
    campaigns: 'الحملات',
    campaign: 'حملة',
    campaignManagement: 'إدارة الحملات',
    campaignManagementDesc: 'إنشاء وإدارة حملات الابتكار',
    createCampaign: 'إنشاء حملة',
    editCampaign: 'تعديل الحملة',
    archiveCampaigns: 'أرشفة المحدد',
    exportCampaigns: 'تصدير المحدد',
    deleteCampaigns: 'حذف المحدد',
    
    // Campaign fields
    title: 'العنوان',
    description: 'الوصف',
    status: 'الحالة',
    startDate: 'تاريخ البداية',
    endDate: 'تاريخ النهاية',
    theme: 'الموضوع',
    budget: 'الميزانية',
    targetParticipants: 'المشاركون المستهدفون',
    targetIdeas: 'الأفكار المستهدفة',
    period: 'الفترة',
    target: 'الهدف',
    participants: 'مشاركين',
    
    // Status values
    statusPlanning: 'تخطيط',
    statusActive: 'نشط',
    statusCompleted: 'مكتمل',
    statusArchived: 'مؤرشف',
    statusOnHold: 'معلق',
    
    // Theme values
    themeDigitalTransformation: 'التحول الرقمي',
    themeSustainability: 'الاستدامة',
    themeSmartCities: 'المدن الذكية',
    themeHealthcare: 'ابتكار الرعاية الصحية',
    themeEducation: 'تكنولوجيا التعليم',
    themeFintech: 'التكنولوجيا المالية',
    
    // Filters
    filterByStatus: 'تصفية حسب الحالة',
    filterByTheme: 'تصفية حسب الموضوع',
    clearFilters: 'مسح المرشحات',
    
    // Layout and UI
    items: 'عناصر',
    item: 'عنصر',
    selectAllItems: 'تحديد الكل ({{count}} عناصر)',
    selectedCount: '({{count}} محدد)',
    copy: 'نسخ',
    share: 'مشاركة',
    
    // Actions
    viewDetails: 'عرض التفاصيل',
    editDetails: 'تعديل التفاصيل',
    manageChallenges: 'إدارة التحديات',
    viewParticipants: 'عرض المشاركين',
  },
  en: {
    // Common UI - English as secondary/fallback
    search: 'Search',
    filters: 'Filters',
    actions: 'Actions',
    bulkActions: 'Bulk Actions',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    loading: 'Loading...',
    noResults: 'No results found',
    selectAll: 'Select all',
    selected: 'selected',
    
    // Toast messages
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    
    // Form actions
    submit: 'Submit',
    close: 'Close',
    open: 'Open',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    
    // Empty states
    noData: 'No data available',
    emptyList: 'No items to display',
    noItemsFound: 'No items found',
    
    // Placeholders
    searchPlaceholder: 'Search...',
    selectOption: 'Select option',
    addNew: 'Add new',
    
    // Navigation & Pages
    dashboard: 'Dashboard',
    admin: 'Admin',
    administration: 'Administration',
    management: 'Management',
    userManagement: 'User Management',
    teamManagement: 'Team Management',
    settings: 'Settings',
    profile: 'Profile',
    users: 'Users',
    team: 'Team',
    
    // Navigation Sections
    workspace: 'Workspace',
    ideas: 'Ideas',
    challenges: 'Challenges',
    evaluations: 'Evaluations',
    expertise: 'Expertise',
    events: 'Events',
    innovationTeams: 'Innovation Teams',
    stakeholders: 'Stakeholders',
    analytics: 'Analytics',
    trends: 'Trends & Insights',
    reports: 'Reports',
    challengeManagement: 'Challenge Management',
    focusQuestions: 'Focus Questions',
    partners: 'Partners',
    sectors: 'Sectors',
    organizationalStructure: 'Organizational Structure',
    expertAssignments: 'Expert Assignments',
    relationshipOverview: 'Relationship Overview',
    systemSettings: 'System Settings',
    systemAnalytics: 'System Analytics',
    systemDocumentation: 'System Documentation',
    
    // Authentication
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    
    // Common Actions
    export: 'Export',
    import: 'Import',
    download: 'Download',
    upload: 'Upload',
    send: 'Send',
    notification: 'Notification',
    notifications: 'Notifications',
    
    // Status & States
    registered: 'Registered',
    registering: 'Registering...',
    registerForEvent: 'Register for Event',
    
    // Campaigns
    campaigns: 'Campaigns',
    campaign: 'Campaign',
    campaignManagement: 'Campaign Management',
    campaignManagementDesc: 'Create and manage innovation campaigns',
    createCampaign: 'Create Campaign',
    editCampaign: 'Edit Campaign',
    archiveCampaigns: 'Archive Selected',
    exportCampaigns: 'Export Selected',
    deleteCampaigns: 'Delete Selected',
    
    // Campaign fields
    title: 'Title',
    description: 'Description',
    status: 'Status',
    startDate: 'Start Date',
    endDate: 'End Date',
    theme: 'Theme',
    budget: 'Budget',
    targetParticipants: 'Target Participants',
    targetIdeas: 'Target Ideas',
    period: 'Period',
    target: 'Target',
    participants: 'participants',
    
    // Status values
    statusPlanning: 'Planning',
    statusActive: 'Active',
    statusCompleted: 'Completed',
    statusArchived: 'Archived',
    statusOnHold: 'On Hold',
    
    // Theme values
    themeDigitalTransformation: 'Digital Transformation',
    themeSustainability: 'Sustainability',
    themeSmartCities: 'Smart Cities',
    themeHealthcare: 'Healthcare Innovation',
    themeEducation: 'Education Technology',
    themeFintech: 'Financial Technology',
    
    // Filters
    filterByStatus: 'Filter by Status',
    filterByTheme: 'Filter by Theme',
    clearFilters: 'Clear Filters',
    
    // Layout and UI
    items: 'Items',
    item: 'item',
    selectAllItems: 'Select all ({{count}} items)',
    selectedCount: '({{count}} selected)',
    copy: 'Copy',
    share: 'Share',
    
    // Actions
    viewDetails: 'View Details',
    editDetails: 'Edit Details',
    manageChallenges: 'Manage Challenges',
    viewParticipants: 'View Participants',
  }
};

export function interpolate(text: string, params: Record<string, string | number>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}