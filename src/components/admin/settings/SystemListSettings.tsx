import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SystemListSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function SystemListSettings({ settings, onSettingChange }: SystemListSettingsProps) {
  const { toast } = useToast();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  const systemLists = {
    // Challenge-related lists
    challengePriorityLevels: settings.challengePriorityLevels || ['منخفض', 'متوسط', 'عالي'],
    challengeSensitivityLevels: settings.challengeSensitivityLevels || ['عادي', 'حساس', 'سري'],
    challengeTypes: settings.challengeTypes || ['تقنية', 'استدامة', 'صحة', 'تعليم', 'حوكمة'],
    challengeStatusOptions: settings.challengeStatusOptions || ['مسودة', 'منشور', 'نشط', 'مغلق', 'مؤرشف', 'مكتمل'],
    
    // Partner-related lists
    partnerStatusOptions: settings.partnerStatusOptions || ['نشط', 'غير نشط', 'معلق', 'محظور'],
    partnerTypeOptions: settings.partnerTypeOptions || ['حكومي', 'خاص', 'أكاديمي', 'غير ربحي', 'دولي'],
    partnershipTypeOptions: settings.partnershipTypeOptions || ['متعاون', 'راعي', 'شريك تقني', 'شريك استراتيجي', 'شريك تنفيذ'],
    
    // Expert-related lists
    expertStatusOptions: settings.expertStatusOptions || ['نشط', 'غير نشط', 'متاح', 'مشغول', 'غير متاح'],
    assignmentStatusOptions: settings.assignmentStatusOptions || ['نشط', 'غير نشط', 'معلق', 'مكتمل', 'ملغي'],
    expertRoleTypes: settings.expertRoleTypes || ['خبير رئيسي', 'مقيم', 'مراجع', 'خبير موضوع', 'مستشار خارجي'],
    experienceLevels: settings.experienceLevels || ['مبتدئ', 'متوسط', 'متقدم', 'خبير'],
    
    // User & Role-related lists
    roleRequestStatusOptions: settings.roleRequestStatusOptions || ['معلق', 'موافق عليه', 'مرفوض', 'مسحوب'],
    userStatusOptions: settings.userStatusOptions || ['نشط', 'غير نشط', 'محظور', 'معلق', 'ملغي'],
    generalStatusOptions: settings.generalStatusOptions || ['نشط', 'غير نشط', 'معلق', 'مكتمل', 'ملغي', 'مسودة', 'منشور', 'مؤرشف'],
    
    // Team-related lists
    teamRoleOptions: settings.teamRoleOptions || ['مدير الابتكار', 'محلل البيانات', 'منشئ المحتوى', 'مدير المشروع', 'محلل الأبحاث'],
    teamSpecializationOptions: settings.teamSpecializationOptions || ['استراتيجية وتخطيط الابتكار', 'إدارة وتنفيذ المشاريع', 'البحث وتحليل السوق', 'إشراك أصحاب المصلحة', 'إدارة التغيير'],
    
    // Focus Question-related lists
    focusQuestionTypes: settings.focusQuestionTypes || ['عام', 'تقني', 'تجاري', 'تأثير', 'تنفيذ', 'اجتماعي', 'أخلاقي', 'طبي', 'تنظيمي'],
    
    // Event-related lists
    eventTypes: settings.eventTypes || ['ورشة عمل', 'ندوة', 'مؤتمر', 'شبكات تواصل', 'هاكاثون', 'جلسة عرض', 'تدريب'],
    eventFormats: settings.eventFormats || ['حضوري', 'افتراضي', 'مختلط'],
    eventCategories: settings.eventCategories || ['حدث مستقل', 'حدث حملة', 'تدريب', 'ورشة عمل'],
    eventVisibilityOptions: settings.eventVisibilityOptions || ['عام', 'خاص', 'داخلي'],
    
    // Stakeholder-related lists (new)
    stakeholderInfluenceLevels: settings.stakeholderInfluenceLevels || ['عالي', 'متوسط', 'منخفض'],
    stakeholderInterestLevels: settings.stakeholderInterestLevels || ['عالي', 'متوسط', 'منخفض'],
    
    // Idea-related lists (new)
    ideaAssignmentTypes: settings.ideaAssignmentTypes || ['reviewer', 'evaluator', 'implementer', 'observer'],
    priorityLevels: settings.priorityLevels || ['low', 'medium', 'high', 'urgent'],
    ideaMaturityLevels: settings.ideaMaturityLevels || ['concept', 'prototype', 'pilot', 'scaling'],
    
    // Campaign-related lists (new)
    campaignThemeOptions: settings.campaignThemeOptions || ['digital_transformation', 'sustainability', 'smart_cities', 'healthcare', 'education', 'fintech', 'energy', 'transportation'],
    
    // Event attendance lists (new)
    attendanceStatusOptions: settings.attendanceStatusOptions || ['registered', 'attended', 'absent', 'cancelled', 'confirmed'],
    
    // Evaluation lists (new)
    evaluatorTypes: settings.evaluatorTypes || ['lead_expert', 'evaluator', 'reviewer', 'subject_matter_expert', 'external_consultant'],
    
    // Relationship lists (new)
    relationshipTypes: settings.relationshipTypes || ['direct', 'indirect', 'collaborative', 'competitive', 'supportive'],
    organizationTypes: settings.organizationTypes || ['operational', 'strategic', 'administrative', 'technical', 'support'],
    
    // Assignment and workflow lists (new)
    assignmentTypes: settings.assignmentTypes || ['campaign', 'event', 'project', 'content', 'analysis'],
    extendedStatusOptions: settings.extendedStatusOptions || ['planning', 'scheduled', 'ongoing', 'postponed', 'draft', 'published'],
    
    // Classification lists (new)
    sectorTypes: settings.sectorTypes || ['health', 'education', 'transport', 'environment', 'economy', 'technology', 'finance', 'defense', 'social'],
    tagCategories: settings.tagCategories || ['innovation', 'digital', 'sustainability', 'efficiency', 'technology', 'business', 'social', 'environmental'],
    sensitivityLevels: settings.sensitivityLevels || ['normal', 'sensitive', 'confidential'],
    
    // Frequency and time options
    frequencyOptions: settings.frequencyOptions || ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    backupFrequencyOptions: settings.backupFrequencyOptions || ['hourly', 'daily', 'weekly', 'monthly'],
    reportFrequencyOptions: settings.reportFrequencyOptions || ['daily', 'weekly', 'monthly'],
    reminderFrequencyOptions: settings.reminderFrequencyOptions || ['daily', 'weekly', 'monthly'],
    recurrencePatternOptions: settings.recurrencePatternOptions || ['daily', 'weekly', 'monthly', 'yearly'],
    questionTypeOptions: settings.questionTypeOptions || ['open_ended', 'multiple_choice', 'yes_no', 'rating', 'ranking'],
    timeRangeOptions: settings.timeRangeOptions || ['all', 'last_30', 'last_90', 'last_year'],
    roleRequestJustifications: settings.roleRequestJustifications || ['domain_expertise', 'evaluation_experience', 'academic_background', 'industry_experience', 'certification', 'volunteer_contribution'],
    uiLanguageOptions: settings.uiLanguageOptions || ['en', 'ar'],
    stakeholderCategories: settings.stakeholderCategories || ['government', 'private_sector', 'academic', 'civil_society', 'international', 'media', 'experts'],
    engagementLevels: settings.engagementLevels || ['high', 'medium', 'low'],
    chartColorPalette: settings.chartColorPalette || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#ff7c7c', '#8dd9cc'],
    
    // New UI and system lists
    themeVariants: settings.themeVariants || ['modern', 'minimal', 'vibrant'],
    themeColorSchemes: settings.themeColorSchemes || ['light', 'dark', 'auto'],
    themeBorderRadiusOptions: settings.themeBorderRadiusOptions || ['none', 'sm', 'md', 'lg', 'xl'],
    challengeFilterStatusOptions: settings.challengeFilterStatusOptions || ['all', 'draft', 'published', 'active', 'closed', 'archived'],
    navigationMenuVisibilityRoles: settings.navigationMenuVisibilityRoles || ['admin', 'super_admin', 'team_member', 'evaluator', 'domain_expert'],
    dataExportFormats: settings.dataExportFormats || ['csv', 'excel', 'pdf', 'json'],
    chartVisualizationColors: settings.chartVisualizationColors || ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'],
    
    // Language settings
    supportedLanguages: settings.supportedLanguages || [
      {code: 'en', label: 'English', nativeLabel: 'English'},
      {code: 'ar', label: 'Arabic', nativeLabel: 'العربية'},
      {code: 'he', label: 'Hebrew', nativeLabel: 'עברית'},
      {code: 'fa', label: 'Persian', nativeLabel: 'فارسی'}
    ],
    
    // Stakeholder-related lists
    stakeholderTypeOptions: settings.stakeholderTypeOptions || ['حكومي', 'خاص', 'أكاديمي', 'غير ربحي', 'دولي'],
    stakeholderStatusOptions: settings.stakeholderStatusOptions || ['نشط', 'غير نشط', 'معلق', 'محظور'],
    stakeholderRoleOptions: settings.stakeholderRoleOptions || ['شريك استراتيجي', 'مطور', 'مقدم خدمات', 'مستشار', 'مطبق'],
    influenceLevelOptions: settings.influenceLevelOptions || ['عالي', 'متوسط', 'منخفض'],
    engagementLevelOptions: settings.engagementLevelOptions || ['عالي', 'متوسط', 'منخفض', 'معدوم']
  };

  const listLabels = {
    // Challenge-related lists
    challengePriorityLevels: 'مستويات أولوية التحديات',
    challengeSensitivityLevels: 'مستويات حساسية التحديات',
    challengeTypes: 'أنواع التحديات',
    challengeStatusOptions: 'خيارات حالة التحديات',
    
    // Partner-related lists
    partnerStatusOptions: 'خيارات حالة الشركاء',
    partnerTypeOptions: 'أنواع الشركاء',
    partnershipTypeOptions: 'أنواع الشراكات',
    
    // Expert-related lists
    expertStatusOptions: 'خيارات حالة الخبراء',
    assignmentStatusOptions: 'خيارات حالة المهام',
    expertRoleTypes: 'أنواع أدوار الخبراء',
    experienceLevels: 'مستويات الخبرة',
    
    // User & Role-related lists
    roleRequestStatusOptions: 'خيارات حالة طلبات الأدوار',
    userStatusOptions: 'خيارات حالة المستخدمين',
    generalStatusOptions: 'خيارات الحالة العامة',
    
    // Team-related lists
    teamRoleOptions: 'أدوار فريق الابتكار',
    teamSpecializationOptions: 'تخصصات فريق الابتكار',
    
    // Focus Question-related lists
    focusQuestionTypes: 'أنواع الأسئلة المحورية',
    
    // Event-related lists
    eventTypes: 'أنواع الفعاليات',
    eventFormats: 'تنسيقات الفعاليات',
    eventCategories: 'فئات الفعاليات',
    eventVisibilityOptions: 'خيارات رؤية الفعاليات',
    
    // Stakeholder-related lists (new)
    stakeholderInfluenceLevels: 'مستويات تأثير أصحاب المصلحة',
    stakeholderInterestLevels: 'مستويات اهتمام أصحاب المصلحة',
    
    // Idea-related lists (new)
    ideaAssignmentTypes: 'أنواع تكليف الأفكار',
    priorityLevels: 'مستويات الأولوية',
    ideaMaturityLevels: 'مستويات نضج الأفكار',
    
    // Campaign-related lists (new)
    campaignThemeOptions: 'خيارات موضوع الحملة',
    
    // Event attendance lists (new)
    attendanceStatusOptions: 'خيارات حالة الحضور',
    
    // Evaluation lists (new)
    evaluatorTypes: 'أنواع المقيمين',
    
    // Relationship lists (new)
    relationshipTypes: 'أنواع العلاقات',
    organizationTypes: 'أنواع المنظمات',
    
    // Assignment and workflow lists (new)
    assignmentTypes: 'أنواع التكليفات',
    extendedStatusOptions: 'خيارات الحالة الموسعة',
    
    // Classification lists (new)
    sectorTypes: 'أنواع القطاعات',
    tagCategories: 'فئات العلامات',
    sensitivityLevels: 'مستويات الحساسية',
    
    // Frequency and time options
    frequencyOptions: 'خيارات التكرار',
    backupFrequencyOptions: 'خيارات تكرار النسخ الاحتياطي',
    reportFrequencyOptions: 'خيارات تكرار التقارير',
    reminderFrequencyOptions: 'خيارات تكرار التذكيرات',
    recurrencePatternOptions: 'خيارات نمط التكرار',
    questionTypeOptions: 'خيارات نوع السؤال',
    timeRangeOptions: 'خيارات النطاق الزمني',
    roleRequestJustifications: 'مبررات طلب الدور',
    uiLanguageOptions: 'خيارات لغة الواجهة',
    stakeholderCategories: 'فئات أصحاب المصلحة',
    engagementLevels: 'مستويات التفاعل',
    chartColorPalette: 'لوحة ألوان الرسوم البيانية',
    
    // New UI and system lists
    themeVariants: 'متغيرات الواجهة',
    themeColorSchemes: 'أنظمة ألوان الواجهة',
    themeBorderRadiusOptions: 'خيارات دائرية الحواف',
    challengeFilterStatusOptions: 'خيارات تصفية حالة التحديات',
    navigationMenuVisibilityRoles: 'أدوار رؤية قائمة التنقل',
    dataExportFormats: 'تنسيقات تصدير البيانات',
    chartVisualizationColors: 'ألوان تصور الرسوم البيانية',
    
    // Language settings
    supportedLanguages: 'اللغات المدعومة',
    
    // Stakeholder-related lists
    stakeholderTypeOptions: 'أنواع أصحاب المصلحة',
    stakeholderStatusOptions: 'خيارات حالة أصحاب المصلحة',
    stakeholderRoleOptions: 'أدوار أصحاب المصلحة',
    influenceLevelOptions: 'مستويات التأثير',
    engagementLevelOptions: 'مستويات المشاركة'
  };

  const addItem = (listKey: string) => {
    if (!newItem.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنصر صحيح",
        variant: "destructive"
      });
      return;
    }

    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    if (currentList.includes(newItem.trim())) {
      toast({
        title: "خطأ",
        description: "هذا العنصر موجود بالفعل",
        variant: "destructive"
      });
      return;
    }

    const updatedList = [...currentList, newItem.trim()];
    onSettingChange(listKey, updatedList);
    setNewItem("");
    setEditingList(null);
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة العنصر بنجاح"
    });
  };

  const removeItem = (listKey: string, itemIndex: number) => {
    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    const updatedList = currentList.filter((_, index) => index !== itemIndex);
    onSettingChange(listKey, updatedList);
    
    toast({
      title: "تم بنجاح",
      description: "تم حذف العنصر بنجاح"
    });
  };

  const renderList = (listKey: string, items: string[]) => (
    <Card key={listKey}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{listLabels[listKey as keyof typeof listLabels]}</CardTitle>
            <CardDescription>إدارة قائمة {listLabels[listKey as keyof typeof listLabels]}</CardDescription>
          </div>
          <Badge variant="outline">{items.length} عنصر</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listKey, index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {editingList === listKey ? (
          <div className="flex gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="أدخل عنصر جديد..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(listKey);
                } else if (e.key === 'Escape') {
                  setEditingList(null);
                  setNewItem("");
                }
              }}
              autoFocus
            />
            <Button onClick={() => addItem(listKey)} size="sm">
              إضافة
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEditingList(null);
                setNewItem("");
              }}
            >
              إلغاء
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingList(listKey)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            إضافة عنصر جديد
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      {/* Collapsible Lists Section */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>قوائم النظام</CardTitle>
          <CardDescription>إدارة القوائم المستخدمة في النظام - اضغط على أي قائمة لتوسيعها</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(systemLists).map(([listKey, items]) => (
              <AccordionItem key={listKey} value={listKey} className="border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full rtl:flex-row-reverse">
                    <div className="flex items-center gap-3 rtl:flex-row-reverse">
                      <span className="font-medium rtl:text-right ltr:text-left">
                        {listLabels[listKey as keyof typeof listLabels]}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {items.length} عنصر
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md rtl:flex-row-reverse">
                          <span className="flex-1 text-sm rtl:text-right ltr:text-left">{item}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(listKey, index)}
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Item */}
                    {editingList === listKey ? (
                      <div className="flex gap-2 rtl:flex-row-reverse">
                        <Input
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          placeholder="أدخل عنصر جديد..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addItem(listKey);
                            } else if (e.key === 'Escape') {
                              setEditingList(null);
                              setNewItem("");
                            }
                          }}
                          autoFocus
                          className="rtl:text-right ltr:text-left text-sm"
                          size={undefined}
                        />
                        <Button onClick={() => addItem(listKey)} size="sm">
                          إضافة
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingList(null);
                            setNewItem("");
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingList(listKey)}
                        className="w-full h-8"
                      >
                        <Plus className="w-3 h-3 rtl:ml-2 ltr:mr-2" />
                        إضافة عنصر جديد
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات القوائم المتقدمة</CardTitle>
          <CardDescription>خيارات متقدمة لإدارة القوائم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">السماح بالقيم المخصصة</Label>
              <p className="text-sm text-muted-foreground">السماح للمستخدمين بإدخال قيم جديدة غير موجودة في القوائم</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4"
              checked={settings.allowCustomValues !== false}
              onChange={(e) => onSettingChange('allowCustomValues', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">ترتيب القوائم أبجدياً</Label>
              <p className="text-sm text-muted-foreground">ترتيب عناصر القوائم حسب الترتيب الأبجدي</p>
            </div>
            <input 
              type="checkbox" 
              className="h-4 w-4"
              checked={settings.sortListsAlphabetically || false}
              onChange={(e) => onSettingChange('sortListsAlphabetically', e.target.checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}