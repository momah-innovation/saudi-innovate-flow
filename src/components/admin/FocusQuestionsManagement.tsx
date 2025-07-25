import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Copy,
  Eye,
  EyeOff,
  Target,
  Users,
  Shield
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  title_ar?: string;
  status: string;
  sensitivity_level: string;
}

interface FocusQuestion {
  id: string;
  challenge_id: string;
  question_text: string;
  question_text_ar?: string;
  question_type: string;
  order_sequence: number;
  is_sensitive: boolean;
  created_at: string;
  challenges?: {
    title: string;
    status: string;
  };
}

export const FocusQuestionsManagement = () => {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all');
  const [sensitivityFilter, setSensitivityFilter] = useState('all');
  
  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [formData, setFormData] = useState({
    challenge_id: "",
    question_text: "",
    question_text_ar: "",
    question_type: "general",
    is_sensitive: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [focusQuestions, selectedChallenge, searchTerm, questionTypeFilter, sensitivityFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenges')
        .select('id, title, title_ar, status, sensitivity_level')
        .order('title', { ascending: true });

      if (challengesError) throw challengesError;

      // Fetch focus questions with challenge info
      const { data: questionsData, error: questionsError } = await supabase
        .from('focus_questions')
        .select(`
          *,
          challenges!challenge_id(title, status)
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

  const applyFilters = () => {
    let filtered = [...focusQuestions];

    // Challenge filter
    if (selectedChallenge !== 'all') {
      filtered = filtered.filter(q => q.challenge_id === selectedChallenge);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.question_text_ar && q.question_text_ar.includes(searchTerm))
      );
    }

    // Question type filter
    if (questionTypeFilter !== 'all') {
      filtered = filtered.filter(q => q.question_type === questionTypeFilter);
    }

    // Sensitivity filter
    if (sensitivityFilter !== 'all') {
      const isSensitive = sensitivityFilter === 'sensitive';
      filtered = filtered.filter(q => q.is_sensitive === isSensitive);
    }

    setFilteredQuestions(filtered);
  };

  const handleCreateQuestion = async () => {
    try {
      // Get the max order sequence for this challenge
      const { data: maxOrderData } = await supabase
        .from('focus_questions')
        .select('order_sequence')
        .eq('challenge_id', formData.challenge_id)
        .order('order_sequence', { ascending: false })
        .limit(1);

      const nextOrder = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_sequence + 1 
        : 1;

      const { data, error } = await supabase
        .from('focus_questions')
        .insert([{
          challenge_id: formData.challenge_id,
          question_text: formData.question_text,
          question_text_ar: formData.question_text_ar || null,
          question_type: formData.question_type,
          is_sensitive: formData.is_sensitive,
          order_sequence: nextOrder
        }])
        .select();

      if (error) throw error;

      toast({
        title: "Question Created",
        description: "Focus question has been successfully created.",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to create focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const { error } = await supabase
        .from('focus_questions')
        .update({
          challenge_id: formData.challenge_id,
          question_text: formData.question_text,
          question_text_ar: formData.question_text_ar || null,
          question_type: formData.question_type,
          is_sensitive: formData.is_sensitive
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;

      toast({
        title: "Question Updated",
        description: "Focus question has been successfully updated.",
      });
      
      setIsEditDialogOpen(false);
      setEditingQuestion(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to update focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Question Deleted",
        description: "Focus question has been successfully deleted.",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error deleting focus question:', error);
      toast({
        title: "Error",
        description: "Failed to delete focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReorderQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const question = focusQuestions.find(q => q.id === questionId);
    if (!question) return;

    const challengeQuestions = focusQuestions
      .filter(q => q.challenge_id === question.challenge_id)
      .sort((a, b) => a.order_sequence - b.order_sequence);

    const currentIndex = challengeQuestions.findIndex(q => q.id === questionId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= challengeQuestions.length) return;

    const targetQuestion = challengeQuestions[targetIndex];

    try {
      // Swap order sequences
      await supabase
        .from('focus_questions')
        .update({ order_sequence: targetQuestion.order_sequence })
        .eq('id', question.id);

      await supabase
        .from('focus_questions')
        .update({ order_sequence: question.order_sequence })
        .eq('id', targetQuestion.id);

      fetchData();
    } catch (error) {
      console.error('Error reordering questions:', error);
      toast({
        title: "Error",
        description: "Failed to reorder questions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateQuestion = async (question: FocusQuestion) => {
    try {
      const { data: maxOrderData } = await supabase
        .from('focus_questions')
        .select('order_sequence')
        .eq('challenge_id', question.challenge_id)
        .order('order_sequence', { ascending: false })
        .limit(1);

      const nextOrder = maxOrderData && maxOrderData.length > 0 
        ? maxOrderData[0].order_sequence + 1 
        : 1;

      const { error } = await supabase
        .from('focus_questions')
        .insert([{
          challenge_id: question.challenge_id,
          question_text: `${question.question_text} (Copy)`,
          question_text_ar: question.question_text_ar ? `${question.question_text_ar} (نسخة)` : null,
          question_type: question.question_type,
          is_sensitive: question.is_sensitive,
          order_sequence: nextOrder
        }]);

      if (error) throw error;

      toast({
        title: "Question Duplicated",
        description: "Focus question has been successfully duplicated.",
      });
      
      fetchData();
    } catch (error) {
      console.error('Error duplicating question:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (question: FocusQuestion) => {
    setEditingQuestion(question);
    setFormData({
      challenge_id: question.challenge_id,
      question_text: question.question_text,
      question_text_ar: question.question_text_ar || "",
      question_type: question.question_type,
      is_sensitive: question.is_sensitive
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      challenge_id: "",
      question_text: "",
      question_text_ar: "",
      question_type: "general",
      is_sensitive: false
    });
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'general': return <HelpCircle className="h-4 w-4" />;
      case 'technical': return <Target className="h-4 w-4" />;
      case 'business': return <Users className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getQuestionTypeBadge = (type: string) => {
    switch (type) {
      case 'general': return 'default';
      case 'technical': return 'secondary';
      case 'business': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Focus Questions Management</h1>
          <p className="text-muted-foreground">
            Manage focus questions across all innovation challenges
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Focus Question</DialogTitle>
              <DialogDescription>
                Add a new focus question to guide innovators in their submissions.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="challenge">Challenge *</Label>
                <Select value={formData.challenge_id} onValueChange={(value) => setFormData({...formData, challenge_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question_text">Question (English) *</Label>
                <Textarea
                  id="question_text"
                  value={formData.question_text}
                  onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                  placeholder="What specific aspect should innovators focus on?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question_text_ar">Question (Arabic)</Label>
                <Textarea
                  id="question_text_ar"
                  value={formData.question_text_ar}
                  onChange={(e) => setFormData({...formData, question_text_ar: e.target.value})}
                  placeholder="ما الجانب المحدد الذي يجب على المبتكرين التركيز عليه؟"
                  rows={3}
                  dir="rtl"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="question_type">Question Type</Label>
                  <Select value={formData.question_type} onValueChange={(value) => setFormData({...formData, question_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="impact">Impact</SelectItem>
                      <SelectItem value="implementation">Implementation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_sensitive"
                    checked={formData.is_sensitive}
                    onCheckedChange={(checked) => setFormData({...formData, is_sensitive: checked})}
                  />
                  <Label htmlFor="is_sensitive" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Sensitive Question
                  </Label>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion} disabled={!formData.challenge_id || !formData.question_text}>
                  Create Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Search Questions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Challenge</Label>
              <Select value={selectedChallenge} onValueChange={setSelectedChallenge}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Challenges</SelectItem>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select value={questionTypeFilter} onValueChange={setQuestionTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Sensitivity</Label>
              <Select value={sensitivityFilter} onValueChange={setSensitivityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Questions</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Focus Questions ({filteredQuestions.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                No focus questions match your current filters.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((question) => (
              <Card key={question.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getQuestionTypeIcon(question.question_type)}
                        <Badge variant={getQuestionTypeBadge(question.question_type)}>
                          {question.question_type}
                        </Badge>
                        {question.is_sensitive && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Sensitive
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Order: {question.order_sequence}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="font-medium">{question.question_text}</p>
                        {question.question_text_ar && (
                          <p className="text-muted-foreground" dir="rtl">
                            {question.question_text_ar}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        Challenge: {question.challenges?.title || "No challenge linked"}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderQuestion(question.id, 'up')}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorderQuestion(question.id, 'down')}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicateQuestion(question)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(question)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Focus Question</DialogTitle>
            <DialogDescription>
              Update the focus question details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_challenge">Challenge *</Label>
              <Select value={formData.challenge_id} onValueChange={(value) => setFormData({...formData, challenge_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a challenge" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge.id} value={challenge.id}>
                      {challenge.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_text">Question (English) *</Label>
              <Textarea
                id="edit_question_text"
                value={formData.question_text}
                onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                placeholder="What specific aspect should innovators focus on?"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_text_ar">Question (Arabic)</Label>
              <Textarea
                id="edit_question_text_ar"
                value={formData.question_text_ar}
                onChange={(e) => setFormData({...formData, question_text_ar: e.target.value})}
                placeholder="ما الجانب المحدد الذي يجب على المبتكرين التركيز عليه؟"
                rows={3}
                dir="rtl"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_question_type">Question Type</Label>
                <Select value={formData.question_type} onValueChange={(value) => setFormData({...formData, question_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                    <SelectItem value="implementation">Implementation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="edit_is_sensitive"
                  checked={formData.is_sensitive}
                  onCheckedChange={(checked) => setFormData({...formData, is_sensitive: checked})}
                />
                <Label htmlFor="edit_is_sensitive" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Sensitive Question
                </Label>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
                <Button onClick={handleEditQuestion} disabled={!formData.challenge_id || !formData.question_text}>
                  Update Question
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};