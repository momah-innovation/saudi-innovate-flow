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
    download: 'تحميل', 
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
    download: 'Download',
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