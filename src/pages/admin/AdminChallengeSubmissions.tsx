import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Filter, Search, Eye, MessageSquare, Star } from "lucide-react";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { useDirection } from "@/components/ui/direction-provider";

interface Challenge {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  status: string;
}

interface Submission {
  id: string;
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  submitted_by: string;
  submission_date: string;
  score?: number;
  solution_approach?: string;
  implementation_plan?: string;
  expected_impact?: string;
  business_model?: string;
  submitted_by_profile?: {
    full_name_ar?: string;
    full_name_en?: string;
    email?: string;
  };
}

const STATUS_OPTIONS = [
  { value: 'all', label_ar: 'جميع الحالات', label_en: 'All Status' },
  { value: 'draft', label_ar: 'مسودة', label_en: 'Draft' },
  { value: 'submitted', label_ar: 'مقدمة', label_en: 'Submitted' },
  { value: 'under_review', label_ar: 'قيد المراجعة', label_en: 'Under Review' },
  { value: 'approved', label_ar: 'مقبولة', label_en: 'Approved' },
  { value: 'rejected', label_ar: 'مرفوضة', label_en: 'Rejected' },
];

export default function AdminChallengeSubmissions() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (challengeId) {
      Promise.all([fetchChallenge(), fetchSubmissions()]);
    }
  }, [challengeId]);

  const fetchChallenge = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title_ar, title_en, description_ar, status')
        .eq('id', challengeId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setChallenge(data);
      } else {
        toast({
          title: "غير موجود",
          description: "التحدي غير موجود",
          variant: "destructive",
        });
        navigate('/admin/challenges');
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل التحدي",
        variant: "destructive",
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_submissions')
        .select(`
          id,
          title_ar,
          title_en,
          description_ar,
          description_en,
          status,
          submitted_by,
          submission_date,
          score,
          solution_approach,
          implementation_plan,
          expected_impact,
          business_model,
          profiles!challenge_submissions_submitted_by_fkey (
            full_name_ar,
            full_name_en,
            email
          )
        `)
        .eq('challenge_id', challengeId)
        .order('submission_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedSubmissions = data?.map(submission => ({
        ...submission,
        submitted_by_profile: Array.isArray(submission.profiles) 
          ? submission.profiles[0] 
          : submission.profiles
      })) || [];

      setSubmissions(formattedSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المشاريع المقدمة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('challenge_submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) {
        throw error;
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة المشروع بنجاح",
      });

      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة المشروع",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'under_review':
        return 'secondary';
      case 'submitted':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return isRTL ? statusOption?.label_ar : statusOption?.label_en;
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = !searchTerm || 
      submission.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submitted_by_profile?.full_name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.submitted_by_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-muted rounded animate-pulse mb-6" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">التحدي غير موجود</h3>
          <Button onClick={() => navigate('/admin/challenges')}>العودة للتحديات</Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "لوحة التحكم", href: "/dashboard" },
    { label: "التحديات", href: "/admin/challenges" },
    { label: challenge.title_ar, href: `/admin/challenges/${challengeId}` },
    { label: "المشاريع المقدمة" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/challenges')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة للتحديات
            </Button>
            <div>
              <h1 className="text-2xl font-bold">المشاريع المقدمة للتحدي</h1>
              <p className="text-muted-foreground">{challenge.title_ar}</p>
            </div>
          </div>
          <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
            {challenge.status}
          </Badge>
        </div>

        {/* Challenge Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تفاصيل التحدي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" dir="rtl">{challenge.description_ar}</p>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المشاريع أو أسماء المقدمين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {isRTL ? option.label_ar : option.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد مشاريع مقدمة</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'لا توجد مشاريع تطابق المعايير المحددة'
                      : 'لم يتم تقديم أي مشاريع لهذا التحدي بعد'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredSubmissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{submission.title_ar}</CardTitle>
                      {submission.title_en && (
                        <CardDescription>{submission.title_en}</CardDescription>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          المقدم: {submission.submitted_by_profile?.full_name_ar || submission.submitted_by_profile?.email || 'غير محدد'}
                        </span>
                        <span>
                          تاريخ التقديم: {new Date(submission.submission_date).toLocaleDateString('ar-SA')}
                        </span>
                        {submission.score && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{submission.score}/100</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(submission.status)}>
                        {getStatusLabel(submission.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4" dir="rtl">
                    {submission.description_ar}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        إضافة تعليق
                      </Button>
                    </div>
                    
                    <Select
                      value={submission.status}
                      onValueChange={(value) => handleStatusUpdate(submission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.filter(option => option.value !== 'all').map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {isRTL ? option.label_ar : option.label_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}