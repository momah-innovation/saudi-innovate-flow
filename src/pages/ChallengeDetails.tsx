import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle
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
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [focusQuestions, setFocusQuestions] = useState<FocusQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (challengeId) {
      fetchChallengeDetails();
    }
  }, [challengeId]);

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true);
      
      // Use sample data for demo
      setChallenge({
        id: challengeId || '1',
        title: 'Digital Government Services Enhancement',
        title_ar: 'تطوير الخدمات الحكومية الرقمية',
        description: 'Develop innovative solutions to improve citizen digital services experience and accessibility. This challenge focuses on creating user-centric digital platforms that enhance government service delivery while ensuring security, privacy, and inclusivity.',
        description_ar: 'تطوير حلول مبتكرة لتحسين تجربة المواطنين مع الخدمات الرقمية وإمكانية الوصول إليها.',
        status: 'published',
        priority_level: 'high',
        sensitivity_level: 'normal',
        challenge_type: 'technology',
        start_date: '2025-01-01',
        end_date: '2025-03-31',
        estimated_budget: 500000,
        actual_budget: 0,
        kpi_alignment: 'Improve citizen satisfaction scores by 25%, reduce service delivery time by 40%',
        vision_2030_goal: 'Digital Government Program - Enhance government efficiency and improve citizen experience',
        created_at: '2025-01-20T00:00:00.000Z',
        updated_at: '2025-01-20T00:00:00.000Z'
      });

      // Use sample questions for demo
      setFocusQuestions([
        {
          id: '1',
          question_text: 'What are the main barriers that prevent citizens from using current digital government services?',
          question_text_ar: 'ما هي الحواجز الرئيسية التي تمنع المواطنين من استخدام الخدمات الحكومية الرقمية الحالية؟',
          question_type: 'problem_identification',
          order_sequence: 1,
          is_sensitive: false
        },
        {
          id: '2',
          question_text: 'How can we ensure that digital services are accessible to all segments of society?',
          question_text_ar: 'كيف يمكننا ضمان أن الخدمات الرقمية متاحة لجميع شرائح المجتمع؟',
          question_type: 'accessibility',
          order_sequence: 2,
          is_sensitive: false
        }
      ]);

    } catch (error) {
      console.error('Error in fetchChallengeDetails:', error);
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
          <div>
            <h1 className="text-2xl font-bold">{challenge.title}</h1>
            {challenge.title_ar && (
              <p className="text-lg text-muted-foreground" dir="rtl">
                {challenge.title_ar}
              </p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmitIdea} size="lg">
          <Lightbulb className="h-4 w-4 mr-2" />
          Submit Idea
        </Button>
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
                    <h4 className="font-medium mb-2">English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>
                  {challenge.description_ar && (
                    <div>
                      <h4 className="font-medium mb-2">العربية</h4>
                      <p className="text-muted-foreground leading-relaxed" dir="rtl">
                        {challenge.description_ar}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {challenge.vision_2030_goal && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Vision 2030 Alignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{challenge.vision_2030_goal}</p>
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
                  {focusQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1">
                          {index + 1}
                        </Badge>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">{question.question_text}</p>
                          {question.question_text_ar && (
                            <p className="text-sm text-muted-foreground" dir="rtl">
                              {question.question_text_ar}
                            </p>
                          )}
                        </div>
                      </div>
                      {index < focusQuestions.length - 1 && <Separator />}
                    </div>
                  ))}
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
                <Badge variant={getPriorityColor(challenge.priority_level)}>
                  {challenge.priority_level}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="outline">
                  {challenge.challenge_type}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-muted-foreground">{formatDate(challenge.start_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-muted-foreground">{formatDate(challenge.end_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-muted-foreground">{formatBudget(challenge.estimated_budget)}</p>
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