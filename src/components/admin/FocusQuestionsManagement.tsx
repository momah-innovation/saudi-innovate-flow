import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FocusQuestionWizard } from './FocusQuestionWizard';

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
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
          challenges!challenge_id(id, title_ar, status, sensitivity_level)
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

  const handleEdit = (question: FocusQuestion) => {
    setEditingQuestion(question);
    setIsWizardOpen(true);
  };

  const handleWizardSave = () => {
    setIsWizardOpen(false);
    setEditingQuestion(null);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال المحوري؟')) return;
    
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
    <AppShell>
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">إدارة الأسئلة المحورية</h1>
              <p className="text-muted-foreground">إدارة الأسئلة المحورية للتحديات</p>
            </div>
            <Button onClick={() => { setEditingQuestion(null); setIsWizardOpen(true); }}>
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

          {/* Focus Question Wizard */}
          <FocusQuestionWizard
            isOpen={isWizardOpen}
            onClose={() => {
              setIsWizardOpen(false);
              setEditingQuestion(null);
            }}
            question={editingQuestion}
            onSave={handleWizardSave}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default FocusQuestionsManagement;