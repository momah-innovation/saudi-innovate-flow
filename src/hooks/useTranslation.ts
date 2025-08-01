import { useDirection } from '@/components/ui/direction-provider';

// Enhanced translation dictionary
const translations = {
  ar: {
    // Navigation
    'dashboard': 'لوحة التحكم',
    'admin_dashboard': 'لوحة التحكم الإدارية',
    'storage_management': 'إدارة التخزين',
    'storage_policies': 'سياسات التخزين',
    'users': 'المستخدمون',
    'settings': 'الإعدادات',
    'analytics': 'التحليلات',
    'security': 'الأمان',
    'relationships': 'العلاقات',
    'evaluations': 'التقييمات',
    'overview': 'نظرة عامة',
    'system_administration': 'إدارة النظام',
    'management_tools': 'أدوات الإدارة',
    
    // Storage specific
    'monitor_manage_storage': 'مراقبة وإدارة تخزين الملفات عبر جميع المجموعات',
    'monitor_manage_policies': 'مراقبة وإدارة سياسات الوصول لمجموعات التخزين',
    'bucket_access_policies': 'سياسات الوصول للمجموعات',
    'security_recommendations': 'توصيات الأمان',
    'total_buckets': 'إجمالي المجموعات',
    'public_buckets': 'المجموعات العامة',
    'protected_buckets': 'المجموعات المحمية',
    'unprotected_buckets': 'المجموعات غير المحمية',
    'total_policies': 'إجمالي السياسات',
    'security_score': 'نقاط الأمان',
    'last_review': 'آخر مراجعة',
    'critical_issues': 'المشاكل الحرجة',
    'no_policies': 'لا توجد سياسات',
    'public_access': 'وصول عام',
    'accessible': 'قابل للوصول',
    'restricted': 'مقيد',
    'secure': 'آمن',
    'attention_required': 'يتطلب انتباه',
    'system_health': 'صحة النظام',
    
    // Common actions
    'search': 'البحث...',
    'refresh': 'تحديث',
    'upload': 'رفع',
    'download': 'تحميل',
    'delete': 'حذف',
    'edit': 'تحرير',
    'view': 'عرض',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'submit': 'إرسال',
    'close': 'إغلاق',
    
    // Status
    'active': 'نشط',
    'inactive': 'غير نشط',
    'enabled': 'مفعل',
    'disabled': 'معطل',
    'public': 'عام',
    'private': 'خاص',
    'protected': 'محمي',
    'loading': 'جاري التحميل...',
    'error': 'خطأ',
    'success': 'نجح',
    'warning': 'تحذير',
    
    // Storage
    'files': 'الملفات',
    'buckets': 'المجموعات',
    'storage_used': 'المساحة المستخدمة',
    'total_files': 'إجمالي الملفات',
    'recent_uploads': 'الرفعات الحديثة',
    
    // User interface
    'system_header_title': 'نظام رواد للابتكار',
    'language': 'اللغة',
    'theme': 'المظهر',
    'notifications': 'الإشعارات',
    'profile': 'الملف الشخصي',
    'logout': 'تسجيل الخروج',
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'admin_dashboard': 'Admin Dashboard',
    'storage_management': 'Storage Management',
    'storage_policies': 'Storage Policies',
    'users': 'Users',
    'settings': 'Settings',
    'analytics': 'Analytics',
    'security': 'Security',
    'relationships': 'Relationships',
    'evaluations': 'Evaluations',
    'overview': 'Overview',
    'system_administration': 'System Administration',
    'management_tools': 'Management Tools',
    
    // Storage specific
    'monitor_manage_storage': 'Monitor and manage file storage across all buckets',
    'monitor_manage_policies': 'Monitor and manage storage bucket access policies',
    'bucket_access_policies': 'Bucket Access Policies',
    'security_recommendations': 'Security Recommendations',
    'total_buckets': 'Total Buckets',
    'public_buckets': 'Public Buckets',
    'protected_buckets': 'Protected Buckets',
    'unprotected_buckets': 'Unprotected Buckets',
    'total_policies': 'Total Policies',
    'security_score': 'Security Score',
    'last_review': 'Last Review',
    'critical_issues': 'Critical Issues',
    'no_policies': 'No Policies',
    'public_access': 'Public Access',
    'accessible': 'Accessible',
    'restricted': 'Restricted',
    'secure': 'Secure',
    'attention_required': 'Attention Required',
    'system_health': 'System Health',
    
    // Common actions
    'search': 'Search...',
    'refresh': 'Refresh',
    'upload': 'Upload',
    'download': 'Download',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'close': 'Close',
    
    // Status
    'active': 'Active',
    'inactive': 'Inactive',
    'enabled': 'Enabled',
    'disabled': 'Disabled',
    'public': 'Public',
    'private': 'Private',
    'protected': 'Protected',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    
    // Storage
    'files': 'Files',
    'buckets': 'Buckets',
    'storage_used': 'Storage Used',
    'total_files': 'Total Files',
    'recent_uploads': 'Recent Uploads',
    
    // User interface
    'system_header_title': 'Ruwād Innovation System',
    'language': 'Language',
    'theme': 'Theme',
    'notifications': 'Notifications',
    'profile': 'Profile',
    'logout': 'Logout',
  }
} as const;

export function useTranslation() {
  const { language } = useDirection();
  
  const t = (key: string, fallback?: string): string => {
    // Handle both strict keys and fallback for any string
    const translation = translations[language]?.[key as keyof typeof translations.en] || 
                       translations.en[key as keyof typeof translations.en];
    return translation || fallback || key;
  };

  // Backward compatibility method
  const getDynamicText = (textAr: string, textEn?: string | null): string => {
    if (language === 'en' && textEn) {
      return textEn;
    }
    return textAr;
  };

  // Number formatting for different locales
  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      // Arabic number formatting
      return new Intl.NumberFormat('ar-SA').format(num);
    }
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Relative time formatting
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return language === 'ar' ? 'منذ قليل' : 'Just now';
    } else if (diffInHours < 24) {
      return language === 'ar' ? `منذ ${diffInHours} ساعة` : `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`;
    } else {
      return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
    }
  };

  return { 
    t, 
    getDynamicText,
    formatNumber, 
    formatRelativeTime,
    language,
    isRTL: language === 'ar'
  };
}