import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Clock,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

interface ChallengeSubmission {
  id: string;
  title: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  lastUpdated: string;
  completionPercentage?: number;
  author: string;
  timeAgo: string;
}
interface ChallengeSubmissionHubProps {
  challengeId: string;
}

export const ChallengeSubmissionHub: React.FC<ChallengeSubmissionHubProps> = ({
  challengeId
}) => {
  const { user } = useAuth();
  const { metrics } = useAdminDashboardMetrics();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [userSubmission, setUserSubmission] = useState<ChallengeSubmission | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      draft: 'مسودة',
      submitted: 'مقدم',
      under_review: 'قيد المراجعة',
      approved: 'مقبول',
      rejected: 'مرفوض'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="space-y-6">
      {/* User's Submission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            مقترحك
          </CardTitle>
          <CardDescription>
            {userSubmission ? 'إدارة مقترحك للتحدي' : 'قدم مقترحك للتحدي'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSubmission ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{userSubmission.title}</h3>
                  <p className="text-sm text-muted-foreground">آخر تحديث: {userSubmission.lastUpdated}</p>
                </div>
                <Badge className={getStatusColor(userSubmission.status)}>
                  {getStatusText(userSubmission.status)}
                </Badge>
              </div>
              
              {userSubmission.status === 'draft' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>مستوى الإكمال</span>
                    <span>{userSubmission.completionPercentage}%</span>
                  </div>
                  <Progress value={userSubmission.completionPercentage} />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  معاينة
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">لم تقدم مقترحاً بعد</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ في إعداد مقترحك للمشاركة في التحدي
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إنشاء مقترح جديد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-muted-foreground">إجمالي المقترحات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{metrics?.challenges?.submissions || 0}</p>
                <p className="text-sm text-muted-foreground">مقترحات مقبولة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">مقترحات متميزة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المقترحات الحديثة</CardTitle>
            <Button variant="outline" size="sm">
              عرض الكل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مقترحات بعد</h3>
              <p className="text-muted-foreground">كن أول من يقدم مقترحاً لهذا التحدي</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{submission.title}</h4>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>بواسطة {submission.author}</span>
                        <Clock className="h-4 w-4" />
                        <span>منذ {submission.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusText(submission.status)}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};