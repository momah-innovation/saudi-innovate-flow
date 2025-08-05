import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Target, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useAppTranslation';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: any[];
}

export function CreateProjectDialog({ open, onOpenChange, teamMembers }: CreateProjectDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'medium',
    deadline: '',
    budget: '',
    selectedMembers: [] as string[]
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId]
    }));
  };

  const handleCreateProject = async () => {
    try {
      // Here you would create the project in the database
      toast({
        title: t('project_created_successfully'),
        description: t('project_ready_with_members', { title: formData.title, count: formData.selectedMembers.length }),
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        priority: 'medium',
        deadline: '',
        budget: '',
        selectedMembers: []
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_create_project'),
        variant: "destructive",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان المشروع</Label>
        <Input
          id="title"
          placeholder="أدخل عنوان المشروع"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف المشروع</Label>
        <Textarea
          id="description"
          placeholder="اكتب وصفاً مفصلاً للمشروع..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>نوع المشروع</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع المشروع" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="innovation">مشروع ابتكار</SelectItem>
              <SelectItem value="research">بحث وتطوير</SelectItem>
              <SelectItem value="implementation">تنفيذ حل</SelectItem>
              <SelectItem value="improvement">تحسين عمليات</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الأولوية</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="urgent">عاجلة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deadline">الموعد النهائي</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">الميزانية المقدرة</Label>
          <Input
            id="budget"
            placeholder="المبلغ بالريال"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">اختيار أعضاء الفريق</h3>
        <Badge variant="secondary">
          {formData.selectedMembers.length} محدد
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
        {teamMembers.map((member) => (
          <Card 
            key={member.id}
            className={`cursor-pointer transition-all ${
              formData.selectedMembers.includes(member.id) 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => toggleMember(member.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profiles?.profile_image_url} />
                    <AvatarFallback>
                      {member.profiles?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.profiles?.display_name || 'مستخدم'}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{member.specialization}</Badge>
                  <div className={`w-3 h-3 rounded-full ${
                    (member.current_workload || 0) > 80 ? 'workload-critical' :
                    (member.current_workload || 0) > 60 ? 'workload-high' : 'workload-normal'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.selectedMembers.length > 0 && (
        <div className="space-y-2">
          <Label>الأعضاء المحددون:</Label>
          <div className="flex flex-wrap gap-2">
            {formData.selectedMembers.map((memberId) => {
              const member = teamMembers.find(m => m.id === memberId);
              return (
                <Badge key={memberId} variant="secondary" className="gap-1">
                  {member?.profiles?.display_name || 'مستخدم'}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleMember(memberId)}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="font-medium">مراجعة تفاصيل المشروع</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">عنوان المشروع</Label>
            <p className="font-medium">{formData.title}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">نوع المشروع</Label>
            <p className="font-medium">{formData.type}</p>
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">الوصف</Label>
          <p className="text-sm">{formData.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-muted-foreground">الأولوية</Label>
            <Badge variant={
              formData.priority === 'urgent' ? 'destructive' :
              formData.priority === 'high' ? 'default' :
              formData.priority === 'medium' ? 'secondary' : 'outline'
            }>
              {formData.priority === 'urgent' ? 'عاجلة' :
               formData.priority === 'high' ? 'عالية' :
               formData.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
            </Badge>
          </div>
          <div>
            <Label className="text-muted-foreground">الموعد النهائي</Label>
            <p className="font-medium">{formData.deadline}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">الميزانية</Label>
            <p className="font-medium">{formData.budget} ر.س</p>
          </div>
        </div>

        <div>
          <Label className="text-muted-foreground">أعضاء الفريق ({formData.selectedMembers.length})</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.selectedMembers.map((memberId) => {
              const member = teamMembers.find(m => m.id === memberId);
              return (
                <div key={memberId} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member?.profiles?.profile_image_url} />
                    <AvatarFallback className="text-xs">
                      {member?.profiles?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member?.profiles?.display_name || 'مستخدم'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء مشروع جديد
          </DialogTitle>
          <DialogDescription>
            الخطوة {currentStep} من 3 - {
              currentStep === 1 ? 'التفاصيل الأساسية' :
              currentStep === 2 ? 'اختيار الفريق' : 'المراجعة النهائية'
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
                  step < currentStep ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-success' : 'bg-muted'}`} />}
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
                  (currentStep === 1 && (!formData.title || !formData.type)) ||
                  (currentStep === 2 && formData.selectedMembers.length === 0)
                }
              >
                التالي
              </Button>
            ) : (
              <Button onClick={handleCreateProject}>
                إنشاء المشروع
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}