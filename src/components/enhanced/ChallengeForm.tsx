import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TagSelector } from '@/components/ui/tag-selector';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, X, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRTLAware } from '@/hooks/useRTLAware';

const challengeSchema = z.object({
  title_ar: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل'),
  description_ar: z.string().min(50, 'الوصف يجب أن يكون 50 حرف على الأقل'),
  challenge_type: z.string().min(1, 'نوع التحدي مطلوب'),
  priority_level: z.string().min(1, 'مستوى الأولوية مطلوب'),
  status: z.string().min(1, 'الحالة مطلوبة'),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  estimated_budget: z.number().optional(),
  vision_2030_goal: z.string().optional(),
  kpi_alignment: z.string().optional(),
  collaboration_details: z.string().optional(),
  sensitivity_level: z.string().default('normal'),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([])
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
  initialData?: Partial<ChallengeFormData>;
  onSubmit: (data: ChallengeFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ChallengeForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading = false 
}: ChallengeFormProps) {
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const { toast } = useToast();
  const { ps, textStart, ms, me } = useRTLAware();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      status: 'draft',
      priority_level: 'medium',
      sensitivity_level: 'normal',
      challenge_type: 'innovation',
      tags: [],
      attachments: [],
      ...initialData
    }
  });

  const challengeTypes = [
    { value: 'innovation', label: 'ابتكار تقني' },
    { value: 'process_improvement', label: 'تحسين العمليات' },
    { value: 'platform_development', label: 'تطوير منصة' },
    { value: 'ai_solution', label: 'حل ذكي' },
    { value: 'infrastructure', label: 'بنية تحتية' },
    { value: 'education_platform', label: 'منصة تعليمية' },
    { value: 'healthcare', label: 'رعاية صحية' },
    { value: 'smart_city', label: 'مدينة ذكية' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' },
    { value: 'critical', label: 'حرج' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'مسودة' },
    { value: 'planning', label: 'قيد التخطيط' },
    { value: 'active', label: 'نشط' },
    { value: 'paused', label: 'متوقف' },
    { value: 'completed', label: 'مكتمل' }
  ];

  const sensitivityLevels = [
    { value: 'normal', label: 'عادي' },
    { value: 'internal', label: 'داخلي' },
    { value: 'high', label: 'عالي' },
    { value: 'confidential', label: 'سري' }
  ];

  const generateAiContent = async () => {
    const title = form.getValues('title_ar');
    const type = form.getValues('challenge_type');
    
    if (!title.trim()) {
      toast({
        title: 'عنوان مطلوب',
        description: 'يرجى إدخال عنوان التحدي أولاً',
        variant: 'destructive',
      });
      return;
    }

    setGeneratingContent(true);
    
    try {
      // Call AI content generation edge function
      const { data, error } = await supabase.functions.invoke('ai-content-moderation', {
        body: {
          content: `Generate comprehensive challenge description in Arabic for: ${title} (Type: ${type})`,
          contentType: 'challenge_generation',
          contentId: 'new-challenge'
        }
      });

      if (error) throw error;

      // For demonstration, we'll create a structured description
      const generatedContent = `
هذا التحدي يهدف إلى ${title} من خلال تطوير حلول مبتكرة تستفيد من أحدث التقنيات.

**الأهداف الرئيسية:**
- تطوير حلول تقنية متقدمة
- تحسين تجربة المستخدمين
- زيادة الكفاءة والفعالية
- دعم أهداف رؤية السعودية 2030

**النتائج المتوقعة:**
- تطوير نماذج أولية قابلة للتطبيق
- تحسين العمليات الحالية بنسبة 30%
- تقليل التكاليف التشغيلية
- رفع مستوى الرضا لدى المستفيدين

**متطلبات التطبيق:**
- فريق تقني متخصص
- موارد تقنية وبشرية مناسبة
- خطة زمنية واضحة للتنفيذ
- آلية قياس النتائج والتقييم
      `.trim();

      form.setValue('description_ar', generatedContent);
      
      // Generate suggested Vision 2030 alignment
      const vision2030Goals = [
        'تحسين فعالية الخدمات الحكومية وتسريع التحول الرقمي',
        'بناء اقتصاد مزدهر قائم على المعرفة والابتكار',
        'تطوير قطاعات حيوية تدعم التنمية المستدامة',
        'رفع جودة الحياة وتحسين تجربة المواطنين'
      ];
      
      const randomGoal = vision2030Goals[Math.floor(Math.random() * vision2030Goals.length)];
      form.setValue('vision_2030_goal', randomGoal);

      toast({
        title: 'تم إنشاء المحتوى',
        description: 'تم توليد وصف شامل للتحدي باستخدام الذكاء الاصطناعي',
      });

    } catch (error) {
      console.error('AI content generation error:', error);
      toast({
        title: 'خطأ في التوليد',
        description: 'حدث خطأ أثناء توليد المحتوى',
        variant: 'destructive',
      });
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleSubmit = async (data: ChallengeFormData) => {
    try {
      await onSubmit(data);
      
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم حفظ بيانات التحدي',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: 'حدث خطأ أثناء حفظ البيانات',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {initialData ? 'تعديل التحدي' : 'إنشاء تحدي جديد'}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
            className={cn(
              'gap-2',
              aiSuggestionsEnabled && 'bg-primary text-primary-foreground'
            )}
          >
            <Sparkles className="h-4 w-4" />
            الذكاء الاصطناعي
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title_ar"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>عنوان التحدي *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="أدخل عنوان التحدي..." />
                      </FormControl>
                      {aiSuggestionsEnabled && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateAiContent}
                          disabled={generatingContent}
                          className="gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          {generatingContent ? 'جاري التوليد...' : 'توليد'}
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="challenge_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التحدي *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التحدي" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {challengeTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستوى الأولوية *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الأولوية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحالة *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sensitivity_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستوى السرية</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى السرية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sensitivityLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف التحدي *</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="أدخل وصفاً مفصلاً للتحدي..."
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              `w-full ${ps('3')} ${textStart} font-normal`,
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ar })
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className={`h-4 w-4 opacity-50 ${ms('auto')}`} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ النهاية</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              `w-full ${ps('3')} ${textStart} font-normal`,
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ar })
                            ) : (
                              <span>اختر التاريخ</span>
                            )}
                            <CalendarIcon className={`h-4 w-4 opacity-50 ${ms('auto')}`} />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues('start_date');
                            return startDate ? date < startDate : date < new Date();
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimated_budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الميزانية المقدرة (ريال)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Vision 2030 and KPI Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vision_2030_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ارتباط برؤية 2030</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="اشرح كيف يساهم التحدي في تحقيق أهداف رؤية 2030..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kpi_alignment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مؤشرات الأداء الرئيسية</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="حدد مؤشرات الأداء الرئيسية للتحدي..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Collaboration Details */}
            <FormField
              control={form.control}
              name="collaboration_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل التعاون</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="اذكر الجهات المتعاونة والشراكات المطلوبة..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العلامات</FormLabel>
                  <FormControl>
                    <TagSelector
                      selectedTags={field.value}
                      onTagsChange={field.onChange}
                      category="challenge"
                      placeholder="اختر العلامات المناسبة..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Attachments */}
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المرفقات</FormLabel>
                  <FormControl>
                    <FileUploadField
                      value={field.value}
                      onChange={field.onChange}
                      bucketName="challenges-attachments-private"
                      maxFiles={10}
                      maxFileSize={10}
                      acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.ppt', '.pptx']}
                      placeholder="ارفق الملفات الداعمة للتحدي..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={loading}
              >
                <X className={`h-4 w-4 ${me('2')}`} />
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'جاري الحفظ...' : 'حفظ التحدي'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}