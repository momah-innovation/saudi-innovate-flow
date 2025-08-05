import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelatedChallenge, RelatedFocusQuestion, CampaignInfo } from "@/hooks/useEventDetails";

interface RelatedItemsTabProps {
  relatedChallenges: RelatedChallenge[];
  focusQuestions: RelatedFocusQuestion[];
  campaignInfo: CampaignInfo | null;
}

export const RelatedItemsTab = ({ relatedChallenges, focusQuestions, campaignInfo }: RelatedItemsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'draft': return 'bg-warning/10 text-warning';
      case 'completed': return 'bg-primary/10 text-primary';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-accent/10 text-accent';
      case 'operational': return 'bg-primary/10 text-primary';
      case 'technical': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Campaign Info Section */}
      {campaignInfo && (
        <div>
          <h3 className="text-lg font-semibold mb-4">معلومات الحملة</h3>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{campaignInfo.title_ar}</span>
                <Badge className={getStatusColor(campaignInfo.status)}>
                  {campaignInfo.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">{campaignInfo.description_ar}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">تاريخ البداية:</span>
                    <div className="text-muted-foreground">{campaignInfo.start_date}</div>
                  </div>
                  <div>
                    <span className="font-medium">تاريخ النهاية:</span>
                    <div className="text-muted-foreground">{campaignInfo.end_date}</div>
                  </div>
                  {campaignInfo.budget && (
                    <div>
                      <span className="font-medium">الميزانية:</span>
                      <div className="text-muted-foreground">{campaignInfo.budget.toLocaleString()} ريال</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Related Challenges Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">التحديات المرتبطة</h3>
        {relatedChallenges.length > 0 ? (
          <div className="grid gap-4">
            {relatedChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{challenge.title_ar}</span>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(challenge.priority_level)}>
                        {challenge.priority_level}
                      </Badge>
                      <Badge className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{challenge.description_ar}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {challenge.start_date && (
                        <div>
                          <span className="font-medium">تاريخ البداية:</span>
                          <div className="text-muted-foreground">{challenge.start_date}</div>
                        </div>
                      )}
                      {challenge.end_date && (
                        <div>
                          <span className="font-medium">تاريخ النهاية:</span>
                          <div className="text-muted-foreground">{challenge.end_date}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد تحديات مرتبطة بهذه الفعالية
          </div>
        )}
      </div>

      {/* Focus Questions Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">الأسئلة المحورية</h3>
        {focusQuestions.length > 0 ? (
          <div className="grid gap-4">
            {focusQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">{question.question_ar}</span>
                    <div className="flex gap-2">
                      <Badge className={getQuestionTypeColor(question.question_type)}>
                        {question.question_type}
                      </Badge>
                      <Badge className={getPriorityColor(question.priority)}>
                        {question.priority}
                      </Badge>
                      <Badge className={getStatusColor(question.status)}>
                        {question.status}
                      </Badge>
                      {question.is_sensitive && (
                        <Badge variant="destructive">حساس</Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.question_text_ar && (
                    <p className="text-sm text-muted-foreground">{question.question_text_ar}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد أسئلة محورية مرتبطة بهذه الفعالية
          </div>
        )}
      </div>
    </div>
  );
};