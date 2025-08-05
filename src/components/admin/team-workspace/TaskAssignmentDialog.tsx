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
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Target, Flag, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useAppTranslation';

interface TaskAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: any[];
  selectedMember?: any;
}

export function TaskAssignmentDialog({ 
  open, 
  onOpenChange, 
  teamMembers, 
  selectedMember 
}: TaskAssignmentDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: selectedMember?.id || '',
    priority: 'medium',
    deadline: '',
    estimatedHours: '',
    projectId: '',
    tags: [] as string[],
    attachments: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateTask = async () => {
    try {
      const assignee = teamMembers.find(m => m.id === formData.assigneeId);
      toast({
        title: t('task_created_successfully'),
        description: t('task_assigned_to_member', { name: assignee?.profiles?.display_name, title: formData.title }),
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        priority: 'medium',
        deadline: '',
        estimatedHours: '',
        projectId: '',
        tags: [],
        attachments: []
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failed_to_create_task'),
        variant: "destructive",
      });
    }
  };

  const getSelectedMember = () => teamMembers.find(m => m.id === formData.assigneeId);
  const selectedMemberData = getSelectedMember();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('assign_new_task')}
          </DialogTitle>
          <DialogDescription>
            {t('create_assign_task_description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Details Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان المهمة *</Label>
              <Input
                id="title"
                placeholder="أدخل عنوان المهمة"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المهمة</Label>
              <Textarea
                id="description"
                placeholder="اكتب وصفاً مفصلاً للمهمة والمتطلبات..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الأولوية</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full indicator-online" />
                        منخفضة
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full indicator-busy" />
                        متوسطة
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-warning" />
                        عالية
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        عاجلة
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">الوقت المقدر (ساعات)</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  placeholder="عدد الساعات"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">الموعد النهائي</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>المشروع المرتبط</Label>
                <Select value={formData.projectId} onValueChange={(value) => handleInputChange('projectId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مشروع (اختياري)" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="project1">مشروع تطوير التطبيق</SelectItem>
                    <SelectItem value="project2">مشروع تحليل البيانات</SelectItem>
                    <SelectItem value="project3">مشروع تحسين العمليات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Task Preview */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">معاينة المهمة</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(formData.priority)}`} />
                    <span className="font-medium">{formData.title || 'عنوان المهمة'}</span>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {formData.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(formData.deadline).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                    {formData.estimatedHours && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formData.estimatedHours} ساعة
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignee Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>تكليف إلى *</Label>
              <Select value={formData.assigneeId} onValueChange={(value) => handleInputChange('assigneeId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عضو الفريق" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.profiles?.profile_image_url} />
                          <AvatarFallback className="text-xs">
                            {member.profiles?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {member.profiles?.display_name || 'مستخدم'}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Member Info */}
            {selectedMemberData && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedMemberData.profiles?.profile_image_url} />
                      <AvatarFallback>
                        {selectedMemberData.profiles?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedMemberData.profiles?.display_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMemberData.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>السعة الحالية</span>
                        <span className={
                          (selectedMemberData.current_workload || 0) > 80 ? 'workload-text-critical' :
                          (selectedMemberData.current_workload || 0) > 60 ? 'workload-text-high' : 'workload-text-normal'
                        }>
                          {selectedMemberData.current_workload || 65}%
                        </span>
                      </div>
                      <Progress 
                        value={selectedMemberData.current_workload || 65} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <Badge variant="outline" className="text-xs">
                        {selectedMemberData.specialization}
                      </Badge>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>المهام النشطة:</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>معدل الإنجاز:</span>
                        <span className="font-medium workload-text-normal">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>التقييم:</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Workload Warning */}
            {selectedMemberData && (selectedMemberData.current_workload || 65) > 80 && (
              <Card className="border-warning/20 bg-warning/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-warning">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('workload_warning')}</span>
                  </div>
                  <p className="text-sm text-warning mt-1">
                    {t('high_workload_warning')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleCreateTask}
            disabled={!formData.title || !formData.assigneeId}
          >
            <Target className="h-4 w-4 me-2" />
            {t('create_task')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}