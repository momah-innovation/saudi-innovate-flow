import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useAppTranslation";
import { 
  HelpCircle, 
  Target, 
  Hash,
  Shield,
  Calendar,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  challenge?: Challenge;
  created_at: string;
  updated_at: string;
}

interface FocusQuestionCardProps {
  question: FocusQuestion;
  onEdit: (question: FocusQuestion) => void;
  onView: (question: FocusQuestion) => void;
  onDelete: (question: FocusQuestion) => void;
  compact?: boolean;
}

export function FocusQuestionCard({ 
  question, 
  onEdit, 
  onView, 
  onDelete,
  compact = false 
}: FocusQuestionCardProps) {
  const { t, isRTL, getDynamicText } = useTranslation();

  const getTypeLabel = (type: string) => {
    const labels = {
      general: 'عام',
      technical: 'تقني',
      business: 'أعمال',
      impact: 'تأثير',
      implementation: 'تنفيذ',
      social: 'اجتماعي',
      ethical: 'أخلاقي',
      medical: 'طبي',
      regulatory: 'تنظيمي',
      open_ended: 'سؤال مفتوح',
      multiple_choice: 'متعدد الخيارات',
      yes_no: 'نعم/لا',
      rating: 'تقييم',
      ranking: 'ترتيب'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle 
                className="text-base font-semibold line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
                dir="rtl"
                onClick={() => onView(question)}
              >
                {truncateText(question.question_text_ar, compact ? 80 : 120)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(question.question_type)}
                </Badge>
                {question.is_sensitive && (
                  <Badge variant="destructive" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    حساس
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  <Hash className="w-3 h-3 mr-1" />
                  {question.order_sequence}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(question)}>
                <Eye className="w-4 h-4 mr-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(question)}>
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(question)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Challenge Association */}
            {question.challenge ? (
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                <Target className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" dir="rtl">
                    {question.challenge.title_ar}
                  </p>
                  <p className="text-xs text-muted-foreground">مرتبط بتحدي</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {question.challenge.status}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-muted/10 rounded-lg">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground" dir="rtl">
                    سؤال عام - غير مرتبط بتحدي محدد
                  </p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="w-3 h-3" />
                <span>تم الإنشاء: {format(new Date(question.created_at), 'dd/MM/yyyy')}</span>
              </div>
              {question.updated_at !== question.created_at && (
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>آخر تحديث: {format(new Date(question.updated_at), 'dd/MM/yyyy')}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(question)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                عرض
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(question)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                تعديل
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}