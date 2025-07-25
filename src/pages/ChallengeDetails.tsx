import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  AlertTriangle,
  Clock,
  FileText,
  Lightbulb,
  CheckCircle,
  Edit,
  Save,
  X,
  Eye,
  EyeOff
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
  actual_budget?: number;
  kpi_alignment?: string;
  vision_2030_goal?: string;
  created_at: string;
  updated_at: string;
}

interface FocusQuestion {
  id: string;
  question_text: string;
  question_text_ar?: string;
  question_type: string;
  order_sequence: number;
  is_sensitive: boolean;
}

const ChallengeDetails = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<{[key: string]: boolean}>({});
  const [editValues, setEditValues] = useState<{[key: string]: any}>({});
  const [saving, setSaving] = useState(false);
  
  // Check if user can edit
  const canEdit = hasRole('admin') || hasRole('super_admin');

  useEffect(() => {
    if (challengeId) {
      fetchChallengeDetails();
    }
  }, [challengeId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!challengeId) return;

    const challengeChannel = supabase
      .channel('challenge-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'challenges',
          filter: `id=eq.${challengeId}`,
        },
        (payload) => {
          setChallenge(payload.new as Challenge);
          setEditValues(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'focus_questions',
          filter: `challenge_id=eq.${challengeId}`,
        },
        () => {
          // Refetch focus questions when they change
          fetchFocusQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(challengeChannel);
    };
  }, [challengeId]);

  const fetchFocusQuestions = async () => {
    if (!challengeId) return;
    
    const { data, error } = await supabase
      .from('focus_questions')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('order_sequence');

    if (!error && data) {
      setFocusQuestions(data);
    }
  };

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch challenge data from Supabase
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (challengeError) {
        console.error('Error fetching challenge:', challengeError);
        toast({
          title: "Error",
          description: "Failed to load challenge details",
          variant: "destructive",
        });
        return;
      }

      if (challengeData) {
        setChallenge(challengeData);
        setEditValues(challengeData);
      }

      // Fetch focus questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('focus_questions')
        .select('*')
        .eq('challenge_id', challengeId)
        .order('order_sequence');

      if (questionsError) {
        console.error('Error fetching focus questions:', questionsError);
      } else {
        setFocusQuestions(questionsData || []);
      }

    } catch (error) {
      console.error('Error in fetchChallengeDetails:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIdea = () => {
    navigate(`/challenges/${challengeId}/submit-idea`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const startEdit = (field: string, value: any) => {
    setEditMode({ ...editMode, [field]: true });
    setEditValues({ ...editValues, [field]: value });
  };

  const cancelEdit = (field: string) => {
    setEditMode({ ...editMode, [field]: false });
    if (challenge) {
      setEditValues({ ...editValues, [field]: (challenge as any)[field] });
    }
  };

  const saveField = async (field: string) => {
    if (!challenge || !challengeId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ [field]: editValues[field] })
        .eq('id', challengeId);

      if (error) {
        throw error;
      }

      setChallenge({ ...challenge, [field]: editValues[field] });
      setEditMode({ ...editMode, [field]: false });
      
      toast({
        title: "Success",
        description: "Challenge updated successfully",
      });
    } catch (error) {
      console.error('Error saving field:', error);
      toast({
        title: "Error", 
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSensitivity = async () => {
    if (!challenge || !challengeId || !canEdit) return;
    
    const newSensitivity = challenge.sensitivity_level === 'normal' ? 'sensitive' : 'normal';
    
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ sensitivity_level: newSensitivity })
        .eq('id', challengeId);

      if (error) throw error;

      setChallenge({ ...challenge, sensitivity_level: newSensitivity });
      toast({
        title: "Success",
        description: `Challenge marked as ${newSensitivity}`,
      });
    } catch (error) {
      console.error('Error updating sensitivity:', error);
      toast({
        title: "Error",
        description: "Failed to update sensitivity level",
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

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR',
      notation: 'compact'
    }).format(budget);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Challenge not found</h3>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            {editMode.title ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={editValues.title || ''}
                    onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                    className="text-2xl font-bold"
                  />
                  <Button size="sm" onClick={() => saveField('title')} disabled={saving}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => cancelEdit('title')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {editMode.title_ar && (
                  <Input
                    value={editValues.title_ar || ''}
                    onChange={(e) => setEditValues({ ...editValues, title_ar: e.target.value })}
                    className="text-lg"
                    placeholder="Arabic title"
                    dir="rtl"
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{challenge.title}</h1>
                  {challenge.title_ar && (
                    <p className="text-lg text-muted-foreground" dir="rtl">
                      {challenge.title_ar}
                    </p>
                  )}
                </div>
                {canEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit('title', challenge.title)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              onClick={toggleSensitivity}
              className="flex items-center gap-2"
            >
              {challenge.sensitivity_level === 'normal' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {challenge.sensitivity_level === 'normal' ? 'Public' : 'Sensitive'}
            </Button>
          )}
          <Button onClick={handleSubmitIdea} size="lg">
            <Lightbulb className="h-4 w-4 mr-2" />
            Submit Idea
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Focus Questions</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">English</h4>
                      {canEdit && !editMode.description && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit('description', challenge.description)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {editMode.description ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editValues.description || ''}
                          onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveField('description')} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => cancelEdit('description')}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {challenge.description}
                      </p>
                    )}
                  </div>
                  {(challenge.description_ar || canEdit) && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">العربية</h4>
                        {canEdit && !editMode.description_ar && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit('description_ar', challenge.description_ar)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {editMode.description_ar ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editValues.description_ar || ''}
                            onChange={(e) => setEditValues({ ...editValues, description_ar: e.target.value })}
                            rows={4}
                            dir="rtl"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveField('description_ar')} disabled={saving}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => cancelEdit('description_ar')}>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        challenge.description_ar && (
                          <p className="text-muted-foreground leading-relaxed" dir="rtl">
                            {challenge.description_ar}
                          </p>
                        )
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {(challenge.vision_2030_goal || canEdit) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Vision 2030 Alignment
                      </div>
                      {canEdit && !editMode.vision_2030_goal && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit('vision_2030_goal', challenge.vision_2030_goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editMode.vision_2030_goal ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editValues.vision_2030_goal || ''}
                          onChange={(e) => setEditValues({ ...editValues, vision_2030_goal: e.target.value })}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveField('vision_2030_goal')} disabled={saving}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => cancelEdit('vision_2030_goal')}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        {challenge.vision_2030_goal || (canEdit ? "Click edit to add Vision 2030 alignment" : "")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Questions</CardTitle>
                  <CardDescription>
                    Key questions to guide your solution development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {focusQuestions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No focus questions have been added to this challenge yet.
                    </p>
                  ) : (
                    focusQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-2">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            {index + 1}
                          </Badge>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{question.question_text}</p>
                                {question.question_text_ar && (
                                  <p className="text-sm text-muted-foreground" dir="rtl">
                                    {question.question_text_ar}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {question.question_type}
                                </Badge>
                                {question.is_sensitive && (
                                  <Badge variant="destructive" className="text-xs">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Sensitive
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < focusQuestions.length - 1 && <Separator />}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Required Documents</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Solution overview and methodology</li>
                        <li>• Technical implementation plan</li>
                        <li>• Budget breakdown and timeline</li>
                        <li>• Team composition and expertise</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Evaluation Criteria</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Innovation and creativity (25%)</li>
                        <li>• Technical feasibility (25%)</li>
                        <li>• Impact potential (25%)</li>
                        <li>• Implementation plan (25%)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority</span>
                {editMode.priority_level ? (
                  <div className="flex items-center gap-1">
                    <Select 
                      value={editValues.priority_level} 
                      onValueChange={(value) => setEditValues({ ...editValues, priority_level: value })}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => saveField('priority_level')} disabled={saving}>
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => cancelEdit('priority_level')}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Badge variant={getPriorityColor(challenge.priority_level)}>
                      {challenge.priority_level}
                    </Badge>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit('priority_level', challenge.priority_level)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                {editMode.challenge_type ? (
                  <div className="flex items-center gap-1">
                    <Select 
                      value={editValues.challenge_type} 
                      onValueChange={(value) => setEditValues({ ...editValues, challenge_type: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="process">Process</SelectItem>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => saveField('challenge_type')} disabled={saving}>
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => cancelEdit('challenge_type')}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline">
                      {challenge.challenge_type}
                    </Badge>
                    {canEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit('challenge_type', challenge.challenge_type)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Start Date</p>
                    {editMode.start_date ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={editValues.start_date || ''}
                          onChange={(e) => setEditValues({ ...editValues, start_date: e.target.value })}
                          className="h-8 text-xs"
                        />
                        <Button size="sm" onClick={() => saveField('start_date')} disabled={saving}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => cancelEdit('start_date')}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <p className="text-muted-foreground">{formatDate(challenge.start_date)}</p>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit('start_date', challenge.start_date)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Deadline</p>
                    {editMode.end_date ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={editValues.end_date || ''}
                          onChange={(e) => setEditValues({ ...editValues, end_date: e.target.value })}
                          className="h-8 text-xs"
                        />
                        <Button size="sm" onClick={() => saveField('end_date')} disabled={saving}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => cancelEdit('end_date')}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <p className="text-muted-foreground">{formatDate(challenge.end_date)}</p>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit('end_date', challenge.end_date)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">Budget</p>
                    {editMode.estimated_budget ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editValues.estimated_budget || ''}
                          onChange={(e) => setEditValues({ ...editValues, estimated_budget: parseFloat(e.target.value) })}
                          className="h-8 text-xs"
                        />
                        <Button size="sm" onClick={() => saveField('estimated_budget')} disabled={saving}>
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => cancelEdit('estimated_budget')}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <p className="text-muted-foreground">{formatBudget(challenge.estimated_budget)}</p>
                        {canEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit('estimated_budget', challenge.estimated_budget)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={handleSubmitIdea} className="w-full">
                <Lightbulb className="h-4 w-4 mr-2" />
                Submit Your Idea
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Download Brief
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;