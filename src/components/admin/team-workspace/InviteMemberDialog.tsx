import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Mail, Users, Briefcase, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { toast } = useToast();
  const [inviteMethod, setInviteMethod] = useState<'email' | 'bulk'>('email');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    specialization: '',
    department: '',
    message: '',
    bulkEmails: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendInvite = async () => {
    try {
      if (inviteMethod === 'email') {
        // Send single invite
        toast({
          title: "تم إرسال الدعوة",
          description: `تم إرسال دعوة إلى ${formData.email}`,
        });
      } else {
        // Send bulk invites
        const emails = formData.bulkEmails.split('\n').filter(email => email.trim());
        toast({
          title: "تم إرسال الدعوات",
          description: `تم إرسال ${emails.length} دعوة بنجاح`,
        });
      }
      
      onOpenChange(false);
      // Reset form
      setFormData({
        email: '',
        name: '',
        role: '',
        specialization: '',
        department: '',
        message: '',
        bulkEmails: ''
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إرسال الدعوة",
        variant: "destructive",
      });
    }
  };

  const renderSingleInvite = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني *</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@domain.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            placeholder="اسم العضو الجديد"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الدور في الفريق</Label>
          <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="team_lead">قائد فريق</SelectItem>
              <SelectItem value="senior_member">عضو أول</SelectItem>
              <SelectItem value="member">عضو</SelectItem>
              <SelectItem value="consultant">مستشار</SelectItem>
              <SelectItem value="expert">خبير</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>التخصص</Label>
          <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر التخصص" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="software_development">تطوير البرمجيات</SelectItem>
              <SelectItem value="data_analysis">تحليل البيانات</SelectItem>
              <SelectItem value="ui_ux_design">تصميم واجهات المستخدم</SelectItem>
              <SelectItem value="project_management">إدارة المشاريع</SelectItem>
              <SelectItem value="business_analysis">تحليل الأعمال</SelectItem>
              <SelectItem value="quality_assurance">ضمان الجودة</SelectItem>
              <SelectItem value="cybersecurity">الأمن السيبراني</SelectItem>
              <SelectItem value="artificial_intelligence">الذكاء الاصطناعي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>القسم/الإدارة</Label>
        <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
          <SelectTrigger>
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="innovation">قسم الابتكار</SelectItem>
            <SelectItem value="technology">قسم التقنية</SelectItem>
            <SelectItem value="research">قسم البحث والتطوير</SelectItem>
            <SelectItem value="operations">قسم العمليات</SelectItem>
            <SelectItem value="strategy">قسم الاستراتيجية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">رسالة ترحيبية (اختيارية)</Label>
        <Textarea
          id="message"
          placeholder="اكتب رسالة ترحيبية للعضو الجديد..."
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderBulkInvite = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bulkEmails">قائمة البريد الإلكتروني</Label>
        <Textarea
          id="bulkEmails"
          placeholder="أدخل عدة عناوين بريد إلكتروني، كل عنوان في سطر منفصل..."
          value={formData.bulkEmails}
          onChange={(e) => handleInputChange('bulkEmails', e.target.value)}
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          أدخل كل بريد إلكتروني في سطر منفصل. يمكنك دعوة حتى 50 عضو في المرة الواحدة.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>الدور الافتراضي</Label>
          <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="member">عضو</SelectItem>
              <SelectItem value="consultant">مستشار</SelectItem>
              <SelectItem value="expert">خبير</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>القسم الافتراضي</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="innovation">قسم الابتكار</SelectItem>
              <SelectItem value="technology">قسم التقنية</SelectItem>
              <SelectItem value="research">قسم البحث والتطوير</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bulkMessage">رسالة ترحيبية موحدة</Label>
        <Textarea
          id="bulkMessage"
          placeholder="اكتب رسالة ترحيبية موحدة لجميع الأعضاء الجدد..."
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            دعوة عضو جديد
          </DialogTitle>
          <DialogDescription>
            أضف أعضاء جدد إلى فريق الابتكار لتعزيز التعاون والإنتاجية
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Method Selection */}
          <div className="flex gap-2">
            <Button
              variant={inviteMethod === 'email' ? 'default' : 'outline'}
              onClick={() => setInviteMethod('email')}
              className="flex-1"
            >
              <Mail className="h-4 w-4 me-2" />
              دعوة فردية
            </Button>
            <Button
              variant={inviteMethod === 'bulk' ? 'default' : 'outline'}
              onClick={() => setInviteMethod('bulk')}
              className="flex-1"
            >
              <Users className="h-4 w-4 me-2" />
              دعوة جماعية
            </Button>
          </div>

          <Separator />

          {/* Form Content */}
          {inviteMethod === 'email' ? renderSingleInvite() : renderBulkInvite()}

          {/* Preview/Summary */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">ملخص الدعوة</span>
              </div>
              <div className="text-sm space-y-1">
                {inviteMethod === 'email' ? (
                  <>
                    <p>• دعوة فردية إلى: {formData.email || 'لم يتم تحديده'}</p>
                    <p>• الدور: {formData.role || 'لم يتم تحديده'}</p>
                    <p>• التخصص: {formData.specialization || 'لم يتم تحديده'}</p>
                  </>
                ) : (
                  <>
                    <p>• عدد الدعوات: {formData.bulkEmails.split('\n').filter(email => email.trim()).length}</p>
                    <p>• الدور الافتراضي: {formData.role || 'لم يتم تحديده'}</p>
                    <p>• القسم الافتراضي: {formData.department || 'لم يتم تحديده'}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSendInvite}
              disabled={
                inviteMethod === 'email' 
                  ? !formData.email || !formData.role
                  : !formData.bulkEmails.trim() || !formData.role
              }
            >
              <UserPlus className="h-4 w-4 me-2" />
              {inviteMethod === 'email' ? 'إرسال الدعوة' : 'إرسال الدعوات'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}