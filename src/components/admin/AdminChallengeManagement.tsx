import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChallengeSettings } from "./ChallengeSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Target, 
  Calendar,
  DollarSign,
  AlertTriangle,
  Users,
  FileText,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type?: string;
  start_date?: string;
  end_date?: string;
  estimated_budget?: number;
  kpi_alignment?: string;
  vision_2030_goal?: string;
  created_at: string;
}

interface FocusQuestion {
  id: string;
  challenge_id: string;
  question_text: string;
  question_text_ar?: string;
  question_type: string;
  order_sequence: number;
  is_sensitive: boolean;
}

export const AdminChallengeManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("challenges");
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  
  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FocusQuestion | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsChallenge, setSettingsChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    title_ar: "",
    description: "",
    description_ar: "",
    status: "draft",
    priority_level: "medium",
    sensitivity_level: "normal",
    challenge_type: "",
    start_date: "",
    end_date: "",
    estimated_budget: "",
    kpi_alignment: "",
    vision_2030_goal: ""
  });
  
  // Filtering states
  const [challengeFilter, setChallengeFilter] = useState('');
  const [challengeStatusFilter, setChallengeStatusFilter] = useState('all');
  const [challengePriorityFilter, setChallengePriorityFilter] = useState('all');
  const [questionFilter, setQuestionFilter] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState('all');
  const [questionSensitivityFilter, setQuestionSensitivityFilter] = useState('all');
  
  const [questionFormData, setQuestionFormData] = useState({
    question_text: "",
    question_text_ar: "",
    question_type: "general",
    is_sensitive: false,
    order_sequence: 1
  });

  useEffect(() => {
    fetchChallenges();
    if (selectedChallenge) {
      fetchFocusQuestions(selectedChallenge);
    }
  }, [selectedChallenge]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      
      const { data: challengesData, error } = await supabase
        .from('challenges')
        .select(`
          id,
          title,
          title_ar,
          description,
          description_ar,
          status,
          priority_level,
          sensitivity_level,
          challenge_type,
          start_date,
          end_date,
          estimated_budget,
          kpi_alignment,
          vision_2030_goal,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching challenges:', error);
        toast({
          title: "Error",
          description: "Failed to fetch challenges. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setChallenges(challengesData || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast({
        title: "Error",
        description: "Failed to fetch challenges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFocusQuestions = async (challengeId: string) => {
    try {
      const { data: questionsData, error } = await supabase
        .from('focus_questions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('order_sequence', { ascending: true });

      if (error) {
        console.error('Error fetching focus questions:', error);
        return;
      }

      setFocusQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching focus questions:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      title_ar: "",
      description: "",
      description_ar: "",
      status: "draft",
      priority_level: "medium",
      sensitivity_level: "normal",
      challenge_type: "",
      start_date: "",
      end_date: "",
      estimated_budget: "",
      kpi_alignment: "",
      vision_2030_goal: ""
    });
  };

  const handleOpenCreateChallenge = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateChallenge = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const resetQuestionForm = () => {
    setQuestionFormData({
      question_text: "",
      question_text_ar: "",
      question_type: "general",
      is_sensitive: false,
      order_sequence: 1
    });
  };

  const handleOpenAddQuestion = () => {
    resetQuestionForm();
    setIsQuestionDialogOpen(true);
  };

  const handleCloseAddQuestion = () => {
    setIsQuestionDialogOpen(false);
    resetQuestionForm();
  };

  const handleCreateChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .insert([{
          title: formData.title,
          title_ar: formData.title_ar || null,
          description: formData.description,
          description_ar: formData.description_ar || null,
          status: formData.status,
          priority_level: formData.priority_level,
          sensitivity_level: formData.sensitivity_level,
          challenge_type: formData.challenge_type || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          estimated_budget: formData.estimated_budget ? parseFloat(formData.estimated_budget) : null,
          kpi_alignment: formData.kpi_alignment || null,
          vision_2030_goal: formData.vision_2030_goal || null,
          created_by: '8066cfaf-4a91-4985-922b-74f6a286c441',
          challenge_owner_id: '8066cfaf-4a91-4985-922b-74f6a286c441'
        }])
        .select();

      if (error) {
        console.error('Error creating challenge:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create challenge. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Challenge Created",
        description: "New challenge has been successfully created.",
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedChallenge) return;
    
    try {
      const { data, error } = await supabase
        .from('focus_questions')
        .insert([{
          challenge_id: selectedChallenge,
          question_text: questionFormData.question_text,
          question_text_ar: questionFormData.question_text_ar || null,
          question_type: questionFormData.question_type,
          is_sensitive: questionFormData.is_sensitive,
          order_sequence: focusQuestions.length + 1
        }])
        .select();

      if (error) {
        console.error('Error creating focus question:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create focus question. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Focus Question Added",
        description: "Focus question has been successfully added to the challenge.",
      });
      
      setIsQuestionDialogOpen(false);
      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
      resetQuestionForm();
    } catch (error) {
      console.error('Error creating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to create focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (question: FocusQuestion) => {
    resetQuestionForm();
    setEditingQuestion(question);
    setQuestionFormData({
      question_text: question.question_text,
      question_text_ar: question.question_text_ar || "",
      question_type: question.question_type,
      is_sensitive: question.is_sensitive,
      order_sequence: question.order_sequence
    });
    setIsEditQuestionDialogOpen(true);
  };

  const handleCloseEditQuestion = () => {
    setIsEditQuestionDialogOpen(false);
    setEditingQuestion(null);
    resetQuestionForm();
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !questionFormData.question_text) {
      return;
    }

    try {
      const { error } = await supabase
        .from('focus_questions')
        .update({
          question_text: questionFormData.question_text,
          question_text_ar: questionFormData.question_text_ar || null,
          question_type: questionFormData.question_type,
          is_sensitive: questionFormData.is_sensitive,
          order_sequence: questionFormData.order_sequence,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingQuestion.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Focus question updated successfully.",
      });

      setIsEditQuestionDialogOpen(false);
      setEditingQuestion(null);
      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
      resetQuestionForm();

    } catch (error) {
      console.error('Error updating focus question:', error);
      toast({
        title: "Error",
        description: "Failed to update focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'closed': return 'outline';
      case 'archived': return 'destructive';
      default: return 'outline';
    }
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact'
    }).format(budget);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    // First reset the form to clear any previous data
    resetForm();
    
    // Then set the editing challenge data
    setFormData({
      title: challenge.title,
      title_ar: challenge.title_ar || "",
      description: challenge.description,
      description_ar: challenge.description_ar || "",
      status: challenge.status,
      priority_level: challenge.priority_level,
      sensitivity_level: challenge.sensitivity_level,
      challenge_type: challenge.challenge_type || "",
      start_date: challenge.start_date || "",
      end_date: challenge.end_date || "",
      estimated_budget: challenge.estimated_budget?.toString() || "",
      kpi_alignment: challenge.kpi_alignment || "",
      vision_2030_goal: challenge.vision_2030_goal || ""
    });
    setIsCreateDialogOpen(true);
  };

  const handleChallengeSettings = (challenge: Challenge) => {
    setSettingsChallenge(challenge);
    setIsSettingsOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from('focus_questions')
        .delete()
        .eq('id', questionId);

      if (error) {
        console.error('Error deleting focus question:', error);
        toast({
          title: "Error",
          description: "Failed to delete focus question. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Question Deleted",
        description: "Focus question has been successfully deleted.",
      });

      if (selectedChallenge) {
        fetchFocusQuestions(selectedChallenge);
      }
    } catch (error) {
      console.error('Error deleting focus question:', error);
      toast({
        title: "Error",
        description: "Failed to delete focus question. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter functions
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(challengeFilter.toLowerCase()) ||
                         (challenge.title_ar && challenge.title_ar.includes(challengeFilter));
    const matchesStatus = challengeStatusFilter === 'all' || challenge.status === challengeStatusFilter;
    const matchesPriority = challengePriorityFilter === 'all' || challenge.priority_level === challengePriorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredFocusQuestions = focusQuestions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(questionFilter.toLowerCase()) ||
                         (question.question_text_ar && question.question_text_ar.includes(questionFilter));
    const matchesType = questionTypeFilter === 'all' || question.question_type === questionTypeFilter;
    const matchesSensitivity = questionSensitivityFilter === 'all' || 
                              (questionSensitivityFilter === 'sensitive' && question.is_sensitive) ||
                              (questionSensitivityFilter === 'normal' && !question.is_sensitive);
    
    return matchesSearch && matchesType && matchesSensitivity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenge Management</h1>
          <p className="text-muted-foreground">
            Create and manage innovation challenges for your organization
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/focus-questions')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Manage Focus Questions
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            if (open) {
              handleOpenCreateChallenge();
            } else {
              handleCloseCreateChallenge();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreateChallenge}>
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.title ? 'Edit Challenge' : 'Create New Challenge'}</DialogTitle>
              <DialogDescription>
                {formData.title ? 'Update the challenge details.' : 'Create a new innovation challenge for innovators to participate in.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title (English) *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Challenge title in English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                    placeholder="عنوان التحدي بالعربية"
                    dir="rtl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (English) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the challenge"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_ar">Description (Arabic)</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                  placeholder="وصف مفصل للتحدي"
                  rows={4}
                  dir="rtl"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={formData.priority_level} onValueChange={(value) => setFormData({...formData, priority_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sensitivity">Sensitivity Level</Label>
                  <Select value={formData.sensitivity_level} onValueChange={(value) => setFormData({...formData, sensitivity_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="sensitive">Sensitive</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="challenge_type">Challenge Type</Label>
                  <Select value={formData.challenge_type} onValueChange={(value) => setFormData({...formData, challenge_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget (SAR)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.estimated_budget}
                    onChange={(e) => setFormData({...formData, estimated_budget: e.target.value})}
                    placeholder="500000"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vision_2030">Vision 2030 Alignment</Label>
                <Textarea
                  id="vision_2030"
                  value={formData.vision_2030_goal}
                  onChange={(e) => setFormData({...formData, vision_2030_goal: e.target.value})}
                  placeholder="How this challenge aligns with Saudi Vision 2030"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi">Success Metrics & KPIs</Label>
                <Textarea
                  id="kpi"
                  value={formData.kpi_alignment}
                  onChange={(e) => setFormData({...formData, kpi_alignment: e.target.value})}
                  placeholder="Define measurable success criteria and KPIs"
                  rows={2}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseCreateChallenge}>
                  Cancel
                </Button>
                <Button onClick={handleCreateChallenge} disabled={!formData.title || !formData.description}>
                  {formData.title && challenges.some(c => c.title === formData.title) ? 'Update Challenge' : 'Create Challenge'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="questions">Focus Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {/* Challenge Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search challenges..."
                value={challengeFilter}
                onChange={(e) => setChallengeFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={challengeStatusFilter} onValueChange={setChallengeStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={challengePriorityFilter} onValueChange={setChallengePriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Challenges List */}
          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      {challenge.title_ar && (
                        <CardDescription className="text-right" dir="rtl">
                          {challenge.title_ar}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                      <Badge variant={getPriorityColor(challenge.priority_level)}>
                        {challenge.priority_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {challenge.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {challenge.challenge_type && (
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span className="capitalize">{challenge.challenge_type}</span>
                        </div>
                      )}
                      {challenge.estimated_budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatBudget(challenge.estimated_budget)}</span>
                        </div>
                      )}
                      {challenge.end_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {new Date(challenge.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedChallenge(challenge.id);
                          setActiveTab("questions");
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Manage Questions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/challenges/${challenge.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditChallenge(challenge)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChallengeSettings(challenge)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
                <p className="text-muted-foreground">
                  {challengeFilter || challengeStatusFilter !== 'all' || challengePriorityFilter !== 'all' 
                    ? "No challenges match your current filters. Try adjusting your search criteria."
                    : "Create your first challenge to get started."
                  }
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          {selectedChallenge ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Focus Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage focus questions for the selected challenge
                  </p>
                </div>
                
                <Dialog open={isQuestionDialogOpen} onOpenChange={(open) => {
                  if (open) {
                    handleOpenAddQuestion();
                  } else {
                    handleCloseAddQuestion();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenAddQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Focus Question</DialogTitle>
                      <DialogDescription>
                        Add a guiding question to help innovators develop their solutions.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="question_text">Question (English) *</Label>
                        <Textarea
                          id="question_text"
                          value={questionFormData.question_text}
                          onChange={(e) => setQuestionFormData({...questionFormData, question_text: e.target.value})}
                          placeholder="What specific problem should this solution address?"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="question_text_ar">Question (Arabic)</Label>
                        <Textarea
                          id="question_text_ar"
                          value={questionFormData.question_text_ar}
                          onChange={(e) => setQuestionFormData({...questionFormData, question_text_ar: e.target.value})}
                          placeholder="ما هي المشكلة المحددة التي يجب أن يعالجها هذا الحل؟"
                          dir="rtl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="question_type">Question Type</Label>
                        <Select 
                          value={questionFormData.question_type} 
                          onValueChange={(value) => setQuestionFormData({...questionFormData, question_type: value})}
                        >
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
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_sensitive_tab"
                          checked={questionFormData.is_sensitive}
                          onCheckedChange={(checked) => setQuestionFormData({...questionFormData, is_sensitive: checked})}
                        />
                        <Label htmlFor="is_sensitive_tab" className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Sensitive Question
                        </Label>
                      </div>
                    
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={handleCloseAddQuestion}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateQuestion} disabled={!questionFormData.question_text}>
                          Add Question
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Focus Questions Filters */}
              <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Search focus questions..."
                    value={questionFilter}
                    onChange={(e) => setQuestionFilter(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={questionTypeFilter} onValueChange={setQuestionTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="impact">Impact</SelectItem>
                    <SelectItem value="implementation">Implementation</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="ethical">Ethical</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={questionSensitivityFilter} onValueChange={setQuestionSensitivityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by Sensitivity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="sensitive">Sensitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                {filteredFocusQuestions.map((question, index) => (
                  <Card key={question.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <Badge variant="secondary">{question.question_type.replace('_', ' ')}</Badge>
                            {question.is_sensitive && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Sensitive
                              </Badge>
                            )}
                          </div>
                          <p className="font-medium">{question.question_text}</p>
                          {question.question_text_ar && (
                            <p className="text-sm text-muted-foreground" dir="rtl">
                              {question.question_text_ar}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredFocusQuestions.length === 0 && focusQuestions.length > 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No questions match your filter</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters.
                    </p>
                  </div>
                )}
                
                {focusQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No focus questions yet</h3>
                    <p className="text-muted-foreground">
                      Add focus questions to guide innovators in developing their solutions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a challenge</h3>
              <p className="text-muted-foreground">
                Choose a challenge from the Challenges tab to manage its focus questions.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Edit Focus Question Dialog */}
      <Dialog open={isEditQuestionDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseEditQuestion();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Focus Question</DialogTitle>
            <DialogDescription>
              Update the focus question details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_question_text">Question (English) *</Label>
              <Textarea
                id="edit_question_text"
                value={questionFormData.question_text}
                onChange={(e) => setQuestionFormData({...questionFormData, question_text: e.target.value})}
                placeholder="What specific problem should this solution address?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_text_ar">Question (Arabic)</Label>
              <Textarea
                id="edit_question_text_ar"
                value={questionFormData.question_text_ar}
                onChange={(e) => setQuestionFormData({...questionFormData, question_text_ar: e.target.value})}
                placeholder="ما هي المشكلة المحددة التي يجب أن يعالجها هذا الحل؟"
                dir="rtl"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_question_type">Question Type</Label>
              <Select 
                value={questionFormData.question_type} 
                onValueChange={(value) => setQuestionFormData({...questionFormData, question_type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="ethical">Ethical</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="regulatory">Regulatory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_order_sequence">Order</Label>
              <Input
                id="edit_order_sequence"
                type="number"
                value={questionFormData.order_sequence}
                onChange={(e) => setQuestionFormData({...questionFormData, order_sequence: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_sensitive"
                checked={questionFormData.is_sensitive}
                onCheckedChange={(checked) => setQuestionFormData({...questionFormData, is_sensitive: checked})}
              />
              <Label htmlFor="edit_is_sensitive" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Sensitive Question
              </Label>
            </div>
          
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCloseEditQuestion}>
                Cancel
              </Button>
              <Button onClick={handleUpdateQuestion} disabled={!questionFormData.question_text}>
                Update Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Challenge Settings Dialog */}
      {settingsChallenge && (
        <ChallengeSettings
          challenge={settingsChallenge}
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setSettingsChallenge(null);
          }}
          onUpdate={() => {
            fetchChallenges();
            setIsSettingsOpen(false);
            setSettingsChallenge(null);
          }}
        />
      )}
    </div>
  );
};