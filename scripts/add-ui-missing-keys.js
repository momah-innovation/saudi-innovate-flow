#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Complete list of missing translation keys from the UI
const missingKeys = [
  // System header and navigation
  { key: 'system.name', ar: 'نظام رواد للابتكار', en: 'Innovation Pioneers System', category: 'ui' },
  { key: 'language.toggle', ar: 'تبديل اللغة', en: 'Toggle Language', category: 'ui' },
  { key: 'system.settings.title', ar: 'إعدادات النظام', en: 'System Settings', category: 'settings' },
  { key: 'system.settings.description', ar: 'تكوين إعدادات النظام العامة', en: 'Configure general system settings', category: 'settings' },
  { key: 'settings.management.title', ar: 'إدارة إعدادات النظام', en: 'System Settings Management', category: 'settings' },
  { key: 'translations.management.title', ar: 'إدارة الترجمات', en: 'Translation Management', category: 'admin' },
  
  // Filter categories
  { key: 'filter.all', ar: 'الكل', en: 'All', category: 'ui' },
  { key: 'filter.general', ar: 'عام', en: 'General', category: 'ui' },
  { key: 'filter.challenges', ar: 'التحديات', en: 'Challenges', category: 'ui' },
  { key: 'filter.ideas', ar: 'الأفكار', en: 'Ideas', category: 'ui' },
  { key: 'filter.events', ar: 'الفعاليات', en: 'Events', category: 'ui' },
  { key: 'filter.campaigns', ar: 'الحملات', en: 'Campaigns', category: 'ui' },
  { key: 'filter.partners', ar: 'الشركاء', en: 'Partners', category: 'ui' },
  { key: 'filter.opportunities', ar: 'الفرص', en: 'Opportunities', category: 'ui' },
  { key: 'filter.analytics', ar: 'التحليلات', en: 'Analytics', category: 'ui' },
  { key: 'filter.security', ar: 'الأمان', en: 'Security', category: 'ui' },
  { key: 'filter.ai', ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence', category: 'ui' },
  { key: 'filter.ui', ar: 'واجهة المستخدم', en: 'User Interface', category: 'ui' },
  { key: 'filter.performance', ar: 'الأداء', en: 'Performance', category: 'ui' },
  
  // AI Settings Category
  { key: 'ai.title', ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence', category: 'settings' },
  { key: 'ai.description', ar: 'إعدادات ميزات الذكاء الاصطناعي والذكاء', en: 'AI features and intelligence settings', category: 'settings' },
  
  // Analytics Category
  { key: 'analytics.title', ar: 'التحليلات', en: 'Analytics', category: 'settings' },
  { key: 'analytics.description', ar: 'إعدادات التحليلات والتقارير', en: 'Analytics and reporting settings', category: 'settings' },
  
  // API Settings
  { key: 'api.title', ar: 'إعدادات واجهة البرمجة', en: 'API Settings', category: 'settings' },
  { key: 'api.description', ar: 'إعدادات واجهة برمجة التطبيقات والحدود', en: 'API configuration and limits', category: 'settings' },
  
  // Assignment Settings
  { key: 'assignment.title', ar: 'إعدادات التكليف', en: 'Assignment Settings', category: 'settings' },
  { key: 'assignment.description', ar: 'إعدادات تكليف الخبراء والمقيمين', en: 'Expert and evaluator assignment settings', category: 'settings' },
  
  // Authentication Settings
  { key: 'authentication.title', ar: 'إعدادات المصادقة', en: 'Authentication Settings', category: 'settings' },
  { key: 'authentication.description', ar: 'إعدادات الأمان والمصادقة', en: 'Security and authentication settings', category: 'settings' },

  // Settings categories with missing translations
  { key: 'settings.category.campaigns', ar: 'إعدادات الحملات والأنشطة', en: 'Campaign and Activity Settings', category: 'settings' },
  { key: 'settings.category.challenge', ar: 'إعدادات التحديات', en: 'Challenge Settings', category: 'settings' },
  { key: 'settings.category.challenge.description', ar: 'تكوين إعدادات التحديات والمسابقات', en: 'Configure challenge and competition settings', category: 'settings' },
  { key: 'settings.category.Challenge Management', ar: 'إدارة التحديات', en: 'Challenge Management', category: 'settings' },
  { key: 'settings.category.Challenge Management.description', ar: 'إعدادات إدارة التحديات المتقدمة', en: 'Advanced challenge management settings', category: 'settings' },
  { key: 'settings.category.challenge_management', ar: 'إدارة التحديات', en: 'Challenge Management', category: 'settings' },
  { key: 'settings.category.challenge_management.description', ar: 'إعدادات إدارة التحديات والمسابقات', en: 'Challenge and competition management settings', category: 'settings' },
  { key: 'settings.category.challenges', ar: 'التحديات', en: 'Challenges', category: 'settings' },
  { key: 'settings.category.challenges.description', ar: 'إعدادات عامة للتحديات', en: 'General challenge settings', category: 'settings' },
  { key: 'settings.category.data', ar: 'البيانات', en: 'Data', category: 'settings' },
  { key: 'settings.category.data.description', ar: 'إعدادات إدارة البيانات', en: 'Data management settings', category: 'settings' },
  { key: 'settings.category.evaluations', ar: 'التقييمات', en: 'Evaluations', category: 'settings' },
  { key: 'settings.category.evaluations.description', ar: 'إعدادات التقييم والمراجعة', en: 'Evaluation and review settings', category: 'settings' },
  { key: 'settings.category.event', ar: 'الفعاليات', en: 'Events', category: 'settings' },
  { key: 'settings.category.event.description', ar: 'إعدادات الفعاليات والأنشطة', en: 'Event and activity settings', category: 'settings' },
  { key: 'settings.category.events', ar: 'الفعاليات', en: 'Events', category: 'settings' },
  { key: 'settings.category.events.description', ar: 'إعدادات إدارة الفعاليات', en: 'Event management settings', category: 'settings' },
  { key: 'settings.category.expert', ar: 'الخبراء', en: 'Experts', category: 'settings' },
  { key: 'settings.category.expert.description', ar: 'إعدادات إدارة الخبراء', en: 'Expert management settings', category: 'settings' },
  { key: 'settings.category.Expert Management', ar: 'إدارة الخبراء', en: 'Expert Management', category: 'settings' },
  { key: 'settings.category.Expert Management.description', ar: 'إعدادات إدارة الخبراء المتقدمة', en: 'Advanced expert management settings', category: 'settings' },
  { key: 'settings.category.expert_management', ar: 'إدارة الخبراء', en: 'Expert Management', category: 'settings' },
  { key: 'settings.category.expert_management.description', ar: 'إعدادات إدارة الخبراء والمقيمين', en: 'Expert and evaluator management settings', category: 'settings' },
  { key: 'settings.category.focus_question', ar: 'الأسئلة المحورية', en: 'Focus Questions', category: 'settings' },
  { key: 'settings.category.focus_question.description', ar: 'إعدادات الأسئلة المحورية', en: 'Focus question settings', category: 'settings' },
  { key: 'settings.category.focus_questions', ar: 'الأسئلة المحورية', en: 'Focus Questions', category: 'settings' },
  { key: 'settings.category.focus_questions.description', ar: 'إعدادات إدارة الأسئلة المحورية', en: 'Focus question management settings', category: 'settings' },
  { key: 'settings.category.form_validation', ar: 'التحقق من النماذج', en: 'Form Validation', category: 'settings' },
  { key: 'settings.category.form_validation.description', ar: 'إعدادات التحقق من النماذج', en: 'Form validation settings', category: 'settings' },
  { key: 'settings.category.general', ar: 'عام', en: 'General', category: 'settings' },
  { key: 'settings.category.general.description', ar: 'الإعدادات العامة للنظام', en: 'General system settings', category: 'settings' },
  { key: 'settings.category.global_lists', ar: 'القوائم العامة', en: 'Global Lists', category: 'settings' },
  { key: 'settings.category.global_lists.description', ar: 'إعدادات القوائم العامة', en: 'Global list settings', category: 'settings' },
  { key: 'settings.category.ideas', ar: 'الأفكار', en: 'Ideas', category: 'settings' },
  { key: 'settings.category.ideas.description', ar: 'إعدادات إدارة الأفكار', en: 'Idea management settings', category: 'settings' },
  { key: 'settings.category.integration', ar: 'التكامل', en: 'Integration', category: 'settings' },
  { key: 'settings.category.integration.description', ar: 'إعدادات التكامل مع الأنظمة الخارجية', en: 'External system integration settings', category: 'settings' },
  { key: 'settings.category.integrations', ar: 'التكاملات', en: 'Integrations', category: 'settings' },
  { key: 'settings.category.integrations.description', ar: 'إعدادات التكامل والربط', en: 'Integration and connectivity settings', category: 'settings' },
  { key: 'settings.category.Lists', ar: 'القوائم', en: 'Lists', category: 'settings' },
  { key: 'settings.category.Lists.description', ar: 'إعدادات القوائم والخيارات', en: 'List and option settings', category: 'settings' },
  { key: 'settings.category.navigation', ar: 'التنقل', en: 'Navigation', category: 'settings' },
  { key: 'settings.category.navigation.description', ar: 'إعدادات التنقل والقوائم', en: 'Navigation and menu settings', category: 'settings' },
  { key: 'settings.category.notification', ar: 'الإشعارات', en: 'Notifications', category: 'settings' },
  { key: 'settings.category.notification.description', ar: 'إعدادات الإشعارات والتنبيهات', en: 'Notification and alert settings', category: 'settings' },
  { key: 'settings.category.notifications', ar: 'الإشعارات', en: 'Notifications', category: 'settings' },
  { key: 'settings.category.notifications.description', ar: 'إعدادات إدارة الإشعارات', en: 'Notification management settings', category: 'settings' },
  { key: 'settings.category.opportunities', ar: 'الفرص', en: 'Opportunities', category: 'settings' },
  { key: 'settings.category.opportunities.description', ar: 'إعدادات إدارة الفرص', en: 'Opportunity management settings', category: 'settings' },
  { key: 'settings.category.organizational', ar: 'التنظيمي', en: 'Organizational', category: 'settings' },
  { key: 'settings.category.organizational.description', ar: 'الإعدادات التنظيمية', en: 'Organizational settings', category: 'settings' },
  { key: 'settings.category.partner', ar: 'الشراكات', en: 'Partnerships', category: 'settings' },
  { key: 'settings.category.partner.description', ar: 'إعدادات إدارة الشراكات', en: 'Partnership management settings', category: 'settings' },
  { key: 'settings.category.partners', ar: 'الشركاء', en: 'Partners', category: 'settings' },
  { key: 'settings.category.partners.description', ar: 'إعدادات إدارة الشركاء', en: 'Partner management settings', category: 'settings' },
  { key: 'settings.category.performance', ar: 'الأداء', en: 'Performance', category: 'settings' },
  { key: 'settings.category.performance.description', ar: 'إعدادات الأداء والتحسين', en: 'Performance and optimization settings', category: 'settings' },
  { key: 'settings.category.role', ar: 'الأدوار', en: 'Roles', category: 'settings' },
  { key: 'settings.category.role.description', ar: 'إعدادات إدارة الأدوار', en: 'Role management settings', category: 'settings' },
  { key: 'settings.category.role_management', ar: 'إدارة الأدوار', en: 'Role Management', category: 'settings' },
  { key: 'settings.category.role_management.description', ar: 'إعدادات إدارة أدوار المستخدمين', en: 'User role management settings', category: 'settings' },
  { key: 'settings.category.security', ar: 'الأمان', en: 'Security', category: 'settings' },
  { key: 'settings.category.security.description', ar: 'إعدادات الأمان والحماية', en: 'Security and protection settings', category: 'settings' },
  { key: 'settings.category.stakeholder', ar: 'أصحاب المصلحة', en: 'Stakeholders', category: 'settings' },
  { key: 'settings.category.stakeholder.description', ar: 'إعدادات إدارة أصحاب المصلحة', en: 'Stakeholder management settings', category: 'settings' },
  { key: 'settings.category.stakeholders', ar: 'أصحاب المصلحة', en: 'Stakeholders', category: 'settings' },
  { key: 'settings.category.stakeholders.description', ar: 'إعدادات أصحاب المصلحة', en: 'Stakeholder settings', category: 'settings' },
  { key: 'settings.category.system', ar: 'النظام', en: 'System', category: 'settings' },
  { key: 'settings.category.system.description', ar: 'إعدادات النظام الأساسية', en: 'Core system settings', category: 'settings' },
  { key: 'settings.category.team', ar: 'الفريق', en: 'Team', category: 'settings' },
  { key: 'settings.category.team.description', ar: 'إعدادات إدارة الفريق', en: 'Team management settings', category: 'settings' },
  { key: 'settings.category.Team Management', ar: 'إدارة الفريق', en: 'Team Management', category: 'settings' },
  { key: 'settings.category.Team Management.description', ar: 'إعدادات إدارة الفريق المتقدمة', en: 'Advanced team management settings', category: 'settings' },
  { key: 'settings.category.team_management', ar: 'إدارة الفريق', en: 'Team Management', category: 'settings' },
  { key: 'settings.category.team_management.description', ar: 'إعدادات إدارة فرق العمل', en: 'Work team management settings', category: 'settings' },
  { key: 'settings.category.teams', ar: 'الفرق', en: 'Teams', category: 'settings' },
  { key: 'settings.category.teams.description', ar: 'إعدادات الفرق والمجموعات', en: 'Team and group settings', category: 'settings' },
  { key: 'settings.category.ui', ar: 'واجهة المستخدم', en: 'User Interface', category: 'settings' },
  { key: 'settings.category.ui.description', ar: 'إعدادات واجهة المستخدم', en: 'User interface settings', category: 'settings' },
  { key: 'settings.category.UI & Form', ar: 'واجهة المستخدم والنماذج', en: 'UI & Forms', category: 'settings' },
  { key: 'settings.category.UI & Form.description', ar: 'إعدادات واجهة المستخدم والنماذج', en: 'User interface and form settings', category: 'settings' },
  { key: 'settings.category.ui_defaults', ar: 'افتراضيات الواجهة', en: 'UI Defaults', category: 'settings' },
  { key: 'settings.category.ui_defaults.description', ar: 'الإعدادات الافتراضية لواجهة المستخدم', en: 'Default user interface settings', category: 'settings' },
  { key: 'settings.category.ui_settings', ar: 'إعدادات الواجهة', en: 'UI Settings', category: 'settings' },
  { key: 'settings.category.ui_settings.description', ar: 'إعدادات تخصيص واجهة المستخدم', en: 'User interface customization settings', category: 'settings' },
  { key: 'settings.category.user', ar: 'المستخدم', en: 'User', category: 'settings' },
  { key: 'settings.category.user.description', ar: 'إعدادات المستخدمين', en: 'User settings', category: 'settings' },
  { key: 'settings.category.User Profile', ar: 'ملف المستخدم', en: 'User Profile', category: 'settings' },
  { key: 'settings.category.User Profile.description', ar: 'إعدادات ملف المستخدم الشخصي', en: 'User profile settings', category: 'settings' },
  { key: 'settings.category.user_management', ar: 'إدارة المستخدمين', en: 'User Management', category: 'settings' },
  { key: 'settings.category.user_management.description', ar: 'إعدادات إدارة المستخدمين', en: 'User management settings', category: 'settings' },
  { key: 'settings.category.user_profile', ar: 'ملف المستخدم', en: 'User Profile', category: 'settings' },
  { key: 'settings.category.user_profile.description', ar: 'إعدادات الملف الشخصي للمستخدم', en: 'User personal profile settings', category: 'settings' },

  // Shared settings category
  { key: 'shared_settings.title', ar: 'الإعدادات المشتركة', en: 'Shared Settings', category: 'settings' },
  { key: 'shared_settings.description', ar: 'الإعدادات التي تؤثر على أنظمة متعددة ويتم توحيدها لضمان الاتساق', en: 'Settings that affect multiple systems and are unified to ensure consistency', category: 'settings' },
  { key: 'no_settings_found', ar: 'لم يتم العثور على إعدادات للمعايير المحددة', en: 'No settings found for the specified criteria', category: 'ui' },

  // Array editor
  { key: 'array_editor.title', ar: 'محرر المصفوفة', en: 'Array Editor', category: 'ui' },
  { key: 'array_editor.open', ar: 'فتح المحرر', en: 'Open Editor', category: 'ui' },
  { key: 'object_editor.title', ar: 'محرر الكائن', en: 'Object Editor', category: 'ui' },
  { key: 'object_editor.open', ar: 'فتح المحرر', en: 'Open Editor', category: 'ui' },
  { key: 'items_count', ar: 'عناصر', en: 'items', category: 'ui' },
  { key: 'properties_count', ar: 'خصائص', en: 'properties', category: 'ui' },
  { key: 'enabled', ar: 'مفعل', en: 'Enabled', category: 'ui' },
  { key: 'disabled', ar: 'غير مفعل', en: 'Disabled', category: 'ui' }
];

async function getExistingKeys() {
  console.log('🔍 Fetching existing translation keys...');
  
  const { data, error } = await supabase
    .from('system_translations')
    .select('translation_key');
    
  if (error) {
    throw new Error(`Failed to fetch existing keys: ${error.message}`);
  }
  
  const existingKeys = new Set(data.map(row => row.translation_key));
  console.log(`   ✓ Found ${existingKeys.size} existing keys in database`);
  
  return existingKeys;
}

async function uploadMissingKeys(missingKeys, existingKeys) {
  const newKeys = missingKeys.filter(item => !existingKeys.has(item.key));
  
  if (newKeys.length === 0) {
    console.log('✅ All keys already exist in database');
    return { uploaded: 0, errors: 0 };
  }
  
  console.log(`📤 Found ${newKeys.length} new keys to upload`);
  
  // Prepare data for insertion
  const insertData = newKeys.map(item => ({
    translation_key: item.key,
    text_ar: item.ar,
    text_en: item.en,
    category: item.category
  }));
  
  const batchSize = 50;
  let uploaded = 0;
  let errors = 0;
  
  for (let i = 0; i < insertData.length; i += batchSize) {
    const batch = insertData.slice(i, i + batchSize);
    
    try {
      const { error } = await supabase
        .from('system_translations')
        .insert(batch);
        
      if (error) {
        console.error(`❌ Batch upload error (${i}-${i + batch.length}):`, error.message);
        errors += batch.length;
      } else {
        uploaded += batch.length;
        process.stdout.write(`   Progress: ${uploaded}/${insertData.length} uploaded\r`);
      }
    } catch (err) {
      console.error(`❌ Batch error:`, err.message);
      errors += batch.length;
    }
  }
  
  console.log(`\n   ✓ Upload complete: ${uploaded} uploaded, ${errors} errors`);
  return { uploaded, errors };
}

async function main() {
  try {
    console.log('🚀 Adding missing translation keys from UI...\n');
    
    const existingKeys = await getExistingKeys();
    const result = await uploadMissingKeys(missingKeys, existingKeys);
    
    console.log('\n📊 Summary:');
    console.log(`   📋 Total missing keys identified: ${missingKeys.length}`);
    console.log(`   💾 Existing keys in database: ${existingKeys.size}`);
    console.log(`   ➕ New keys uploaded: ${result.uploaded}`);
    
    if (result.errors > 0) {
      console.log(`   ⚠️  Errors encountered: ${result.errors}`);
    }
    
    console.log('\n✅ Missing keys upload completed!');
    
  } catch (error) {
    console.error('\n❌ Upload failed:');
    console.error(error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}