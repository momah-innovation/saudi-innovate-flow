import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { AppSidebar } from "@/components/layout/Sidebar";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title_ar: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
  order_sequence: number;
  challenge_id?: string;
  challenges?: Challenge;
}

const FocusQuestionsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [newQuestion, setNewQuestion] = useState<Partial<FocusQuestion>>({
    question_text_ar: '',
    question_type: 'open_ended',
    is_sensitive: false,
    order_sequence: 0,
    challenge_id: ''
  });

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "dashboard":
        navigate("/");
        break;
      case "challenge-management":
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab: 'challenge-management' } }));
        }, 100);
        break;
      default:
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: { tab } }));
        }, 100);
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('id, title_ar, status, sensitivity_level')
        .order('title_ar');

      if (challengesError) throw challengesError;

      // Fetch focus questions with challenge data
      const { data: questionsData, error: questionsError } = await supabase
        .from('focus_questions')
        .select(`
          *,
          challenges!challenge_id(title_ar, status)
        `)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;

      setChallenges(challengesData || []);
      setFocusQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!newQuestion.question_text_ar?.trim()) {
        toast({
          title: "خطأ",
          description: "يرجى إدخال نص السؤال",
          variant: "destructive",
        });
        return;
      }

      if (editingQuestion) {
        const { error } = await supabase
          .from('focus_questions')
          .update(newQuestion)
          .eq('id', editingQuestion.id);

        if (error) throw error;

        toast({
          title: "نجح",
          description: "تم تحديث السؤال المحوري بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('focus_questions')
          .insert([newQuestion]);

        if (error) throw error;

        toast({
          title: "نجح",
          description: "تم إضافة السؤال المحوري بنجاح",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving focus question:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ السؤال المحوري",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewQuestion({
      question_text_ar: '',
      question_type: 'open_ended',
      is_sensitive: false,
      order_sequence: 0,
      challenge_id: ''
    });
    setEditingQuestion(null);
  };

  const handleEdit = (question: FocusQuestion) => {
    setEditingQuestion(question);
    setNewQuestion(question);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "نجح",
        description: "تم حذف السؤال المحوري بنجاح",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting focus question:', error);
      toast({
        title: "خطأ",
        description: "فشل في حذف السؤال المحوري",
        variant: "destructive",
      });
    }
  };

  const filteredQuestions = focusQuestions.filter(question =>
    question.question_text_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.challenges?.title_ar?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar activeTab="focus-questions" onTabChange={handleTabChange} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <div className="flex items-center gap-4 px-6 py-3 border-b bg-background/95">
            <SidebarTrigger />
            <BreadcrumbNav activeTab="focus-questions" />
          </div>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">إدارة الأسئلة المحورية</h1>
                  <p className="text-muted-foreground">إدارة الأسئلة المحورية للتحديات</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة سؤال محوري
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الأسئلة المحورية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-lg">{question.question_text_ar}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{question.question_type}</Badge>
                            {question.is_sensitive && (
                              <Badge variant="destructive">حساس</Badge>
                            )}
                            {question.challenges && (
                              <Badge variant="secondary">{question.challenges.title_ar}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Create/Edit Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? 'تعديل السؤال المحوري' : 'إضافة سؤال محوري جديد'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>نص السؤال *</Label>
                      <Textarea
                        value={newQuestion.question_text_ar || ''}
                        onChange={(e) => setNewQuestion({...newQuestion, question_text_ar: e.target.value})}
                        placeholder="أدخل نص السؤال المحوري"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>نوع السؤال</Label>
                        <Select 
                          value={newQuestion.question_type || 'open_ended'} 
                          onValueChange={(value) => setNewQuestion({...newQuestion, question_type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open_ended">مفتوح</SelectItem>
                            <SelectItem value="multiple_choice">متعدد الخيارات</SelectItem>
                            <SelectItem value="yes_no">نعم/لا</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>التحدي المرتبط</Label>
                        <Select 
                          value={newQuestion.challenge_id || ''} 
                          onValueChange={(value) => setNewQuestion({...newQuestion, challenge_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر التحدي" />
                          </SelectTrigger>
                          <SelectContent>
                            {challenges.map((challenge) => (
                              <SelectItem key={challenge.id} value={challenge.id}>
                                {challenge.title_ar}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>ترتيب السؤال</Label>
                      <Input
                        type="number"
                        value={newQuestion.order_sequence || 0}
                        onChange={(e) => setNewQuestion({...newQuestion, order_sequence: parseInt(e.target.value) || 0})}
                        placeholder="ترتيب السؤال"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_sensitive"
                        checked={newQuestion.is_sensitive || false}
                        onCheckedChange={(checked) => setNewQuestion({...newQuestion, is_sensitive: !!checked})}
                      />
                      <Label htmlFor="is_sensitive">سؤال حساس</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}>
                        إلغاء
                      </Button>
                      <Button onClick={handleSubmit}>
                        {editingQuestion ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FocusQuestionsManagement;