import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { Target, HelpCircle, ExternalLink, AlertTriangle } from 'lucide-react';

interface RelatedChallenge {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  priority_level: string;
}

interface RelatedFocusQuestion {
  id: string;
  question_text_ar: string;
  question_type: string;
  is_sensitive: boolean;
}

interface CampaignInfo {
  id: string;
  title_ar: string;
  description_ar?: string;
  status: string;
}

interface RelatedItemsTabProps {
  relatedChallenges: RelatedChallenge[];
  focusQuestions: RelatedFocusQuestion[];
  campaignInfo: CampaignInfo | null;
}

export const RelatedItemsTab = ({ 
  relatedChallenges, 
  focusQuestions,
  campaignInfo 
}: RelatedItemsTabProps) => {
  const { isRTL } = useDirection();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'نشط': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
      case 'مسودة': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
      case 'مكتمل': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'cancelled':
      case 'ملغي': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي':
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'متوسط':
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'منخفض':
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'strategic': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400';
      case 'operational': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'financial': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Info Section */}
      {campaignInfo && (
        <div>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {isRTL ? 'الحملة المرتبطة' : 'Related Campaign'}
          </h4>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-foreground mb-2">
                  {campaignInfo.title_ar}
                </h5>
                {campaignInfo.description_ar && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {campaignInfo.description_ar}
                  </p>
                )}
                <Badge className={getStatusColor(campaignInfo.status)}>
                  {campaignInfo.status}
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                {isRTL ? 'عرض الحملة' : 'View Campaign'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Related Challenges Section */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4" />
          {isRTL ? 'التحديات المرتبطة' : 'Related Challenges'}
          {relatedChallenges.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {relatedChallenges.length}
            </Badge>
          )}
        </h4>
        
        {relatedChallenges.length > 0 ? (
          <div className="grid gap-4">
            {relatedChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-foreground mb-2">
                      {challenge.title_ar}
                    </h5>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {challenge.description_ar}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                      <Badge className={getPriorityColor(challenge.priority_level)} variant="outline">
                        {isRTL ? 'أولوية: ' : 'Priority: '}{challenge.priority_level}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isRTL ? 'عرض' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isRTL ? 'لا توجد تحديات مرتبطة بهذه الفعالية' : 'No related challenges for this event'}
          </div>
        )}
      </div>

      {/* Focus Questions Section */}
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          {isRTL ? 'الأسئلة المحورية' : 'Focus Questions'}
          {focusQuestions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {focusQuestions.length}
            </Badge>
          )}
        </h4>
        
        {focusQuestions.length > 0 ? (
          <div className="grid gap-4">
            {focusQuestions.map((question) => (
              <div key={question.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-3">
                      {question.is_sensitive && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <p className="text-sm text-foreground leading-relaxed">
                        {question.question_text_ar}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getQuestionTypeColor(question.question_type)}>
                        {question.question_type}
                      </Badge>
                      {question.is_sensitive && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          {isRTL ? 'حساس' : 'Sensitive'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {isRTL ? 'لا توجد أسئلة محورية لهذه الفعالية' : 'No focus questions for this event'}
          </div>
        )}
      </div>
    </div>
  );
};