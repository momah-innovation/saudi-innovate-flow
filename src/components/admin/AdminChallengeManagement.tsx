import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, Users, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  actual_budget: number;
  vision_2030_goal: string;
  kpi_alignment: string;
  collaboration_details: string;
  internal_team_notes: string;
  challenge_owner_id: string;
  assigned_expert_id: string;
  created_by: string;
  partner_organization_id: string;
  department_id: string;
  deputy_id: string;
  sector_id: string;
  domain_id: string;
  sub_domain_id: string;
  service_id: string;
}

interface FocusQuestion {
  id?: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
}

export function AdminChallengeManagement() {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<FocusQuestion>({
    question_text_ar: '',
    question_type: 'open_ended',
    is_sensitive: false,
    order_sequence: 0
  });

  const [newChallenge, setNewChallenge] = useState<Challenge>({
    id: '',
    title_ar: '',
    description_ar: '',
    status: 'draft',
    priority_level: 'medium',
    sensitivity_level: 'normal',
    challenge_type: '',
    start_date: '',
    end_date: '',
    estimated_budget: 0,
    actual_budget: 0,
    vision_2030_goal: '',
    kpi_alignment: '',
    collaboration_details: '',
    internal_team_notes: '',
    challenge_owner_id: '',
    assigned_expert_id: '',
    created_by: '',
    partner_organization_id: '',
    department_id: '',
    deputy_id: '',
    sector_id: '',
    domain_id: '',
    sub_domain_id: '',
    service_id: ''
  });

  useEffect(() => {
    fetchChallenges();
    fetchFocusQuestions();
  }, []);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحديات",
        variant: "destructive",
      });
    }
  };

  const fetchFocusQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_questions')
        .select('*')
        .order('order_sequence');

      if (error) throw error;
      setFocusQuestions(data || []);
    } catch (error) {
      console.error('Error fetching focus questions:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!newChallenge.title_ar.trim()) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال عنوان التحدي",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('challenges')
        .insert([newChallenge])
        .select();

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم إضافة التحدي بنجاح",
      });

      setIsDialogOpen(false);
      resetForm();
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء التحدي",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewChallenge({
      id: '',
      title_ar: '',
      description_ar: '',
      status: 'draft',
      priority_level: 'medium',
      sensitivity_level: 'normal',
      challenge_type: '',
      start_date: '',
      end_date: '',
      estimated_budget: 0,
      actual_budget: 0,
      vision_2030_goal: '',
      kpi_alignment: '',
      collaboration_details: '',
      internal_team_notes: '',
      challenge_owner_id: '',
      assigned_expert_id: '',
      created_by: '',
      partner_organization_id: '',
      department_id: '',
      deputy_id: '',
      sector_id: '',
      domain_id: '',
      sub_domain_id: '',
      service_id: ''
    });
    setFocusQuestions([]);
  };

  const handleAddQuestion = async () => {
    if (!selectedChallenge || !newQuestion.question_text_ar.trim()) return;

    try {
      const { error } = await supabase
        .from('focus_questions')
        .insert([{
          ...newQuestion,
          challenge_id: selectedChallenge.id
        }]);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم إضافة السؤال المحوري بنجاح",
      });

      setNewQuestion({
        question_text_ar: '',
        question_type: 'open_ended',
        is_sensitive: false,
        order_sequence: 0
      });

      fetchFocusQuestions();
    } catch (error) {
      console.error('Error adding focus question:', error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة السؤال المحوري",
        variant: "destructive",
      });
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description_ar?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || challenge.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditChallenge = (challenge: Challenge) => {
    setNewChallenge({
      ...challenge,
      title_ar: challenge.title_ar,
      description_ar: challenge.description_ar,
    });
    setSelectedChallenge(challenge);
    setIsDialogOpen(true);
  };

  const handleViewChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة التحديات</h1>
          <p className="text-muted-foreground">إدارة التحديات والأسئلة المحورية</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة تحدي جديد
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في التحديات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="فلترة بالحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="closed">مغلق</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle>{challenge.title_ar}</CardTitle>
                  <CardDescription>
                    {challenge.description_ar}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant={challenge.status === 'published' ? 'default' : 'secondary'}>
                      {challenge.status}
                    </Badge>
                    <Badge variant="outline">{challenge.priority_level}</Badge>
                    <Badge variant="outline">{challenge.sensitivity_level}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewChallenge(challenge)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditChallenge(challenge)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Create/Edit Challenge Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedChallenge ? 'تعديل التحدي' : 'إضافة تحدي جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان التحدي *</Label>
              <Input
                value={newChallenge.title_ar}
                onChange={(e) => setNewChallenge({...newChallenge, title_ar: e.target.value})}
                placeholder="أدخل عنوان التحدي باللغة العربية"
              />
            </div>

            <div className="space-y-2">
              <Label>وصف التحدي</Label>
              <Textarea
                value={newChallenge.description_ar}
                onChange={(e) => setNewChallenge({...newChallenge, description_ar: e.target.value})}
                placeholder="أدخل وصف التحدي باللغة العربية"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الحالة</Label>
                <Select 
                  value={newChallenge.status} 
                  onValueChange={(value) => setNewChallenge({...newChallenge, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">مسودة</SelectItem>
                    <SelectItem value="published">منشور</SelectItem>
                    <SelectItem value="closed">مغلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>مستوى الأولوية</Label>
                <Select 
                  value={newChallenge.priority_level} 
                  onValueChange={(value) => setNewChallenge({...newChallenge, priority_level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">منخفض</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">عالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!newChallenge.title_ar.trim()}
              >
                {selectedChallenge ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}