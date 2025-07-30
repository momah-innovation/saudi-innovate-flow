import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, X, Plus, FileText, Image, Video, 
  Users, Target, Clock, Award, Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChallengeSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge: any;
}

export function ChallengeSubmissionDialog({ 
  open, 
  onOpenChange, 
  challenge 
}: ChallengeSubmissionDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title_ar: '',
    description_ar: '',
    solution_approach: '',
    implementation_plan: '',
    business_model: '',
    expected_impact: '',
    technical_details: {},
    team_members: [] as any[],
    attachment_urls: [] as string[],
    is_public: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${challenge.id}/${user?.id}/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('challenge-attachments')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('challenge-attachments')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      handleInputChange('attachment_urls', [...formData.attachment_urls, ...uploadedUrls]);
      toast({
        title: "تم رفع الملفات بنجاح",
        description: `تم رفع ${uploadedUrls.length} ملف`,
      });
    } catch (error) {
      toast({
        title: "خطأ في رفع الملفات",
        description: "حدث خطأ أثناء رفع الملفات",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachment_urls.filter((_, i) => i !== index);
    handleInputChange('attachment_urls', newAttachments);
  };

  const addTeamMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      role: '',
      email: '',
      skills: []
    };
    handleInputChange('team_members', [...formData.team_members, newMember]);
  };

  const updateTeamMember = (index: number, field: string, value: any) => {
    const newMembers = formData.team_members.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    handleInputChange('team_members', newMembers);
  };

  const removeTeamMember = (index: number) => {
    const newMembers = formData.team_members.filter((_, i) => i !== index);
    handleInputChange('team_members', newMembers);
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      const submissionData = {
        challenge_id: challenge.id,
        submitted_by: user?.id,
        ...formData,
        status: isDraft ? 'draft' : 'submitted',
        submission_date: isDraft ? null : new Date().toISOString(),
        team_members: JSON.stringify(formData.team_members),
        technical_details: JSON.stringify(formData.technical_details)
      };

      const { error } = await supabase
        .from('challenge_submissions')
        .insert(submissionData);

      if (error) throw error;

      toast({
        title: isDraft ? "تم حفظ المسودة" : "تم إرسال المشاركة",
        description: isDraft ? "تم حفظ مشاركتك كمسودة" : "تم إرسال مشاركتك بنجاح للمراجعة",
      });

      onOpenChange(false);
      // Reset form
      setFormData({
        title_ar: '',
        description_ar: '',
        solution_approach: '',
        implementation_plan: '',
        business_model: '',
        expected_impact: '',
        technical_details: {},
        team_members: [],
        attachment_urls: [],
        is_public: false
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال المشاركة",
        variant: "destructive",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان الحل *</Label>
        <Input
          id="title"
          placeholder="اكتب عنوان مبتكر لحلك"
          value={formData.title_ar}
          onChange={(e) => handleInputChange('title_ar', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">وصف الحل *</Label>
        <Textarea
          id="description"
          placeholder="اشرح حلك بالتفصيل..."
          value={formData.description_ar}
          onChange={(e) => handleInputChange('description_ar', e.target.value)}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="approach">منهجية الحل</Label>
        <Textarea
          id="approach"
          placeholder="اشرح الطريقة التي ستتبعها لحل التحدي..."
          value={formData.solution_approach}
          onChange={(e) => handleInputChange('solution_approach', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="implementation">خطة التنفيذ</Label>
        <Textarea
          id="implementation"
          placeholder="اشرح كيف ستقوم بتنفيذ حلك خطوة بخطوة..."
          value={formData.implementation_plan}
          onChange={(e) => handleInputChange('implementation_plan', e.target.value)}
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business">النموذج التجاري</Label>
        <Textarea
          id="business"
          placeholder="اشرح كيف يمكن تحويل حلك إلى نموذج تجاري مستدام..."
          value={formData.business_model}
          onChange={(e) => handleInputChange('business_model', e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="impact">التأثير المتوقع</Label>
        <Textarea
          id="impact"
          placeholder="ما هو التأثير المتوقع لحلك على المجتمع أو الصناعة؟"
          value={formData.expected_impact}
          onChange={(e) => handleInputChange('expected_impact', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>أعضاء الفريق</Label>
        <Button size="sm" variant="outline" onClick={addTeamMember}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة عضو
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {formData.team_members.map((member, index) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">عضو {index + 1}</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTeamMember(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="الاسم"
                  value={member.name}
                  onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                />
                <Input
                  placeholder="الدور"
                  value={member.role}
                  onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                />
                <Input
                  placeholder="البريد الإلكتروني"
                  type="email"
                  value={member.email}
                  onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                />
                <Input
                  placeholder="المهارات (مفصولة بفواصل)"
                  value={member.skills.join(', ')}
                  onChange={(e) => updateTeamMember(index, 'skills', e.target.value.split(', '))}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {formData.team_members.length === 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">لم تتم إضافة أي أعضاء فريق بعد</p>
            <Button onClick={addTeamMember} className="mt-3">
              <Plus className="h-4 w-4 mr-2" />
              إضافة عضو فريق
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>المرفقات</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              اسحب الملفات هنا أو انقر لاختيارها
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" disabled={uploading} asChild>
                <span>
                  {uploading ? 'جاري الرفع...' : 'اختيار ملفات'}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      {formData.attachment_urls.length > 0 && (
        <div className="space-y-2">
          <Label>الملفات المرفوعة</Label>
          <div className="space-y-2">
            {formData.attachment_urls.map((url, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">ملف {index + 1}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="public"
            checked={formData.is_public}
            onCheckedChange={(checked) => handleInputChange('is_public', checked)}
          />
          <Label htmlFor="public" className="text-sm">
            جعل المشاركة عامة للعرض
          </Label>
        </div>
      </div>
    </div>
  );

  if (!challenge) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            مشاركة في التحدي: {challenge.title_ar}
          </DialogTitle>
          <DialogDescription>
            الخطوة {currentStep} من 4 - {
              currentStep === 1 ? 'وصف الحل' :
              currentStep === 2 ? 'التفاصيل التقنية' :
              currentStep === 3 ? 'الفريق' : 'المرفقات والمراجعة'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === currentStep ? 'bg-primary text-primary-foreground' :
                  step < currentStep ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          {/* Challenge Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">{challenge.title_ar}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">المهلة: {challenge.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">{challenge.prize}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <ScrollArea className="max-h-96">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </ScrollArea>

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                السابق
              </Button>
              <Button 
                variant="ghost"
                onClick={() => handleSubmit(true)}
                disabled={!formData.title_ar || !formData.description_ar}
              >
                حفظ كمسودة
              </Button>
            </div>

            {currentStep < 4 ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  currentStep === 1 && (!formData.title_ar || !formData.description_ar)
                }
              >
                التالي
              </Button>
            ) : (
              <Button 
                onClick={() => handleSubmit(false)}
                disabled={!formData.title_ar || !formData.description_ar}
              >
                <Send className="h-4 w-4 mr-2" />
                إرسال المشاركة
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}