import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, Clock, Award, Users, Target, Globe, 
  Eye, EyeOff, AlertTriangle, CheckCircle, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChallengeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChallengeCreated?: () => void;
}

export function ChallengeCreateDialog({ 
  open, 
  onOpenChange, 
  onChallengeCreated 
}: ChallengeCreateDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title_ar: '',
    description_ar: '',
    challenge_type: '',
    priority_level: 'medium',
    sensitivity_level: 'normal',
    status: 'draft',
    start_date: '',
    end_date: '',
    estimated_budget: '',
    vision_2030_goal: '',
    kpi_alignment: '',
    collaboration_details: '',
    internal_team_notes: '',
    sector_id: '',
    deputy_id: '',
    department_id: '',
    domain_id: '',
    sub_domain_id: '',
    service_id: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateChallenge = async () => {
    try {
      const challengeData = {
        ...formData,
        created_by: user?.id,
        estimated_budget: formData.estimated_budget ? parseFloat(formData.estimated_budget) : null
      };

      const { error } = await supabase
        .from('challenges')
        .insert(challengeData);

      if (error) throw error;

      toast({
        title: "تم إنشاء التحدي بنجاح",
        description: `تم إنشاء التحدي "${formData.title_ar}" بنجاح`,
      });

      onOpenChange(false);
      onChallengeCreated?.();
      
      // Reset form
      setFormData({
        title_ar: '',
        description_ar: '',
        challenge_type: '',
        priority_level: 'medium',
        sensitivity_level: 'normal',
        status: 'draft',
        start_date: '',
        end_date: '',
        estimated_budget: '',
        vision_2030_goal: '',
        kpi_alignment: '',
        collaboration_details: '',
        internal_team_notes: '',
        sector_id: '',
        deputy_id: '',
        department_id: '',
        domain_id: '',
        sub_domain_id: '',
        service_id: ''
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التحدي",
        variant: "destructive",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان التحدي *</Label>
        <Input
          id="title"
          placeholder="اكتب عنواناً واضحاً وجذاباً للتحدي"
          value={formData.title_ar}
          onChange={(e) => handleInputChange('title_ar', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف التحدي *</Label>
        <Textarea
          id="description"
          placeholder="اشرح التحدي بالتفصيل، المشكلة المراد حلها، والنتائج المتوقعة..."
          value={formData.description_ar}
          onChange={(e) => handleInputChange('description_ar', e.target.value)}
          rows={6}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نوع التحدي</Label>
          <Select value={formData.challenge_type} onValueChange={(value) => handleInputChange('challenge_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع التحدي" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="innovation">تحدي ابتكار</SelectItem>
              <SelectItem value="improvement">تحسين عمليات</SelectItem>
              <SelectItem value="digital_transformation">تحول رقمي</SelectItem>
              <SelectItem value="sustainability">استدامة</SelectItem>
              <SelectItem value="efficiency">كفاءة</SelectItem>
              <SelectItem value="customer_experience">تجربة العملاء</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>مستوى الأولوية</Label>
          <Select value={formData.priority_level} onValueChange={(value) => handleInputChange('priority_level', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="critical">حرجة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>مستوى الحساسية</Label>
        <Select value={formData.sensitivity_level} onValueChange={(value) => handleInputChange('sensitivity_level', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="normal">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                عام - يمكن للجميع المشاهدة
              </div>
            </SelectItem>
            <SelectItem value="sensitive">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                حساس - فريق الابتكار فقط
              </div>
            </SelectItem>
            <SelectItem value="confidential">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4" />
                سري - الإدارة العليا فقط
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">تاريخ البداية</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">تاريخ النهاية</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">الميزانية المقدرة (ريال سعودي)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="مثال: 100000"
          value={formData.estimated_budget}
          onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vision">ربط برؤية 2030</Label>
        <Textarea
          id="vision"
          placeholder="اشرح كيف يرتبط هذا التحدي بأهداف رؤية المملكة 2030..."
          value={formData.vision_2030_goal}
          onChange={(e) => handleInputChange('vision_2030_goal', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kpi">مؤشرات الأداء الرئيسية</Label>
        <Textarea
          id="kpi"
          placeholder="حدد المؤشرات التي ستقيس نجاح هذا التحدي..."
          value={formData.kpi_alignment}
          onChange={(e) => handleInputChange('kpi_alignment', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="collaboration">تفاصيل التعاون</Label>
        <Textarea
          id="collaboration"
          placeholder="اشرح كيف سيتم التعاون في هذا التحدي، الأدوار المطلوبة، والشراكات..."
          value={formData.collaboration_details}
          onChange={(e) => handleInputChange('collaboration_details', e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات الفريق الداخلي</Label>
        <Textarea
          id="notes"
          placeholder="ملاحظات مخصصة لفريق العمل الداخلي..."
          value={formData.internal_team_notes}
          onChange={(e) => handleInputChange('internal_team_notes', e.target.value)}
          rows={3}
        />
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">ملخص التحدي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>العنوان:</span>
            <span className="font-medium">{formData.title_ar || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span>النوع:</span>
            <span className="font-medium">{formData.challenge_type || 'غير محدد'}</span>
          </div>
          <div className="flex justify-between">
            <span>الأولوية:</span>
            <Badge variant={
              formData.priority_level === 'critical' ? 'destructive' :
              formData.priority_level === 'high' ? 'default' :
              formData.priority_level === 'medium' ? 'secondary' : 'outline'
            }>
              {formData.priority_level === 'critical' ? 'حرجة' :
               formData.priority_level === 'high' ? 'عالية' :
               formData.priority_level === 'medium' ? 'متوسطة' : 'منخفضة'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>الحساسية:</span>
            <Badge variant={
              formData.sensitivity_level === 'confidential' ? 'destructive' :
              formData.sensitivity_level === 'sensitive' ? 'secondary' : 'outline'
            }>
              {formData.sensitivity_level === 'confidential' ? 'سري' :
               formData.sensitivity_level === 'sensitive' ? 'حساس' : 'عام'}
            </Badge>
          </div>
          {formData.start_date && formData.end_date && (
            <div className="flex justify-between">
              <span>المدة:</span>
              <span className="font-medium">
                {formData.start_date} إلى {formData.end_date}
              </span>
            </div>
          )}
          {formData.estimated_budget && (
            <div className="flex justify-between">
              <span>الميزانية:</span>
              <span className="font-medium">{formData.estimated_budget} ريال</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء تحدي جديد
          </DialogTitle>
          <DialogDescription>
            الخطوة {currentStep} من 3 - {
              currentStep === 1 ? 'المعلومات الأساسية' :
              currentStep === 2 ? 'التوقيت والميزانية' : 'التفاصيل النهائية'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep ? 'bg-primary text-primary-foreground' :
                  step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              السابق
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  currentStep === 1 && (!formData.title_ar || !formData.description_ar || !formData.challenge_type)
                }
              >
                التالي
              </Button>
            ) : (
              <Button 
                onClick={handleCreateChallenge}
                disabled={!formData.title_ar || !formData.description_ar || !formData.challenge_type}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                إنشاء التحدي
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}