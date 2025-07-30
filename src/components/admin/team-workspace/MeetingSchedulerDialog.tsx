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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, Clock, Users, Video, MapPin, Plus, X, 
  Bell, Link, Settings, Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MeetingSchedulerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: any[];
}

export function MeetingSchedulerDialog({ open, onOpenChange, teamMembers }: MeetingSchedulerDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'virtual',
    location: '',
    meetingLink: '',
    agenda: [''],
    attendees: [] as string[],
    isRecurring: false,
    recurrenceType: 'weekly',
    reminder: '15',
    allowRecording: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAttendee = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter(id => id !== memberId)
        : [...prev.attendees, memberId]
    }));
  };

  const addAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const updateAgendaItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const handleScheduleMeeting = async () => {
    try {
      toast({
        title: "تم جدولة الاجتماع بنجاح",
        description: `اجتماع "${formData.title}" تم جدولته مع ${formData.attendees.length} عضو`,
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'virtual',
        location: '',
        meetingLink: '',
        agenda: [''],
        attendees: [],
        isRecurring: false,
        recurrenceType: 'weekly',
        reminder: '15',
        allowRecording: false
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جدولة الاجتماع",
        variant: "destructive",
      });
    }
  };

  const getAvailableTimeSlots = () => {
    // Mock available time slots based on team availability
    return [
      { time: '09:00', available: 8, total: 10 },
      { time: '10:00', available: 10, total: 10 },
      { time: '11:00', available: 7, total: 10 },
      { time: '14:00', available: 9, total: 10 },
      { time: '15:00', available: 6, total: 10 },
      { time: '16:00', available: 8, total: 10 }
    ];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            جدولة اجتماع جديد
          </DialogTitle>
          <DialogDescription>
            قم بجدولة اجتماع جديد مع أعضاء الفريق
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meeting Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الاجتماع *</Label>
                <Input
                  id="title"
                  placeholder="اكتب عنوان الاجتماع"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الاجتماع</Label>
                <Textarea
                  id="description"
                  placeholder="اكتب وصفاً مختصراً للاجتماع..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="font-medium">التاريخ والوقت</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">وقت البداية</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">وقت النهاية</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Time Availability */}
              {formData.date && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">توفر الفريق في هذا اليوم</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getAvailableTimeSlots().map((slot) => (
                        <Button
                          key={slot.time}
                          variant={formData.startTime === slot.time ? 'default' : 'outline'}
                          size="sm"
                          className="flex flex-col h-auto p-2"
                          onClick={() => handleInputChange('startTime', slot.time)}
                        >
                          <span className="font-medium">{slot.time}</span>
                          <span className="text-xs">
                            {slot.available}/{slot.total} متوفر
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Meeting Type and Location */}
            <div className="space-y-4">
              <h3 className="font-medium">نوع الاجتماع والموقع</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الاجتماع</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="virtual">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          اجتماع افتراضي
                        </div>
                      </SelectItem>
                      <SelectItem value="physical">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          اجتماع حضوري
                        </div>
                      </SelectItem>
                      <SelectItem value="hybrid">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          اجتماع مختلط
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'virtual' || formData.type === 'hybrid' ? (
                  <div className="space-y-2">
                    <Label htmlFor="meetingLink">رابط الاجتماع</Label>
                    <Input
                      id="meetingLink"
                      placeholder="https://meet.google.com/..."
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="location">الموقع</Label>
                    <Input
                      id="location"
                      placeholder="قاعة الاجتماعات الرئيسية"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Agenda */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">جدول الأعمال</h3>
                <Button size="sm" variant="outline" onClick={addAgendaItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة عنصر
                </Button>
              </div>
              <div className="space-y-2">
                {formData.agenda.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`عنصر ${index + 1} في جدول الأعمال`}
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                    />
                    {formData.agenda.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAgendaItem(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Options */}
            <div className="space-y-4">
              <h3 className="font-medium">خيارات الاجتماع</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
                  />
                  <Label htmlFor="recurring">اجتماع متكرر</Label>
                </div>

                {formData.isRecurring && (
                  <div className="mr-6">
                    <Select value={formData.recurrenceType} onValueChange={(value) => handleInputChange('recurrenceType', value)}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="daily">يومياً</SelectItem>
                        <SelectItem value="weekly">أسبوعياً</SelectItem>
                        <SelectItem value="monthly">شهرياً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recording"
                    checked={formData.allowRecording}
                    onCheckedChange={(checked) => handleInputChange('allowRecording', checked)}
                  />
                  <Label htmlFor="recording">السماح بتسجيل الاجتماع</Label>
                </div>

                <div className="flex items-center gap-4">
                  <Label>تذكير قبل:</Label>
                  <Select value={formData.reminder} onValueChange={(value) => handleInputChange('reminder', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="5">5 دقائق</SelectItem>
                      <SelectItem value="15">15 دقيقة</SelectItem>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">ساعة واحدة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">المدعوون</h3>
              <Badge variant="secondary">
                {formData.attendees.length} محدد
              </Badge>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {teamMembers.map((member) => (
                <Card 
                  key={member.id}
                  className={`cursor-pointer transition-all ${
                    formData.attendees.includes(member.id) 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => toggleAttendee(member.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profiles?.avatar_url} />
                          <AvatarFallback>
                            {member.profiles?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.profiles?.display_name || 'مستخدم'}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      {formData.attendees.includes(member.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meeting Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">ملخص الاجتماع</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{formData.date || 'لم يتم تحديده'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{formData.startTime} - {formData.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{formData.attendees.length} مدعو</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.type === 'virtual' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                    <span>{formData.type === 'virtual' ? 'اجتماع افتراضي' : 'اجتماع حضوري'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button 
            onClick={handleScheduleMeeting}
            disabled={!formData.title || !formData.date || !formData.startTime || formData.attendees.length === 0}
          >
            <Calendar className="h-4 w-4 mr-2" />
            جدولة الاجتماع
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}