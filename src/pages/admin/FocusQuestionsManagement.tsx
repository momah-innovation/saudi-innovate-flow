import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export default function FocusQuestionsManagement() {
  const { t, language } = useUnifiedTranslation();

  const focusQuestions = [
    {
      id: 1,
      question_ar: 'ما هي التحديات الرئيسية التي تواجه قطاع التعليم؟',
      question_en: 'What are the main challenges facing the education sector?',
      category: 'Education',
      priority: 'High',
      status: 'Active'
    },
    {
      id: 2,
      question_ar: 'كيف يمكن تحسين الخدمات الصحية الرقمية؟',
      question_en: 'How can digital health services be improved?',
      category: 'Health',
      priority: 'Medium',
      status: 'Active'
    },
    {
      id: 3,
      question_ar: 'ما هي الحلول المبتكرة للنقل المستدام؟',
      question_en: 'What are innovative solutions for sustainable transport?',
      category: 'Transportation',
      priority: 'High',
      status: 'Draft'
    }
  ];

  return (
    <AdminLayout
      title={language === 'ar' ? 'إدارة الأسئلة المحورية' : 'Focus Questions Management'}
      breadcrumbs={[
        { label: language === 'ar' ? 'لوحة الإدارة' : 'Admin', href: '/admin/dashboard' },
        { label: language === 'ar' ? 'الأسئلة المحورية' : 'Focus Questions' }
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'ar' ? 'إدارة الأسئلة المحورية' : 'Focus Questions Management'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'إدارة الأسئلة التي توجه التحديات والمبادرات'
                  : 'Manage questions that guide challenges and initiatives'
                }
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {language === 'ar' ? 'إضافة سؤال' : 'Add Question'}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions'}
              </CardTitle>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{focusQuestions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'أسئلة نشطة' : 'Active Questions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {focusQuestions.filter(q => q.status === 'Active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'مسودات' : 'Drafts'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {focusQuestions.filter(q => q.status === 'Draft').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'ar' ? 'أولوية عالية' : 'High Priority'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {focusQuestions.filter(q => q.priority === 'High').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'قائمة الأسئلة المحورية' : 'Focus Questions List'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'الأسئلة التي توجه المبادرات والتحديات في النظام'
                : 'Questions that guide initiatives and challenges in the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {focusQuestions.map((question) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">
                        {language === 'ar' ? question.question_ar : question.question_en}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {language === 'ar' ? 'الفئة:' : 'Category:'} {question.category}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          question.priority === 'High' ? 'bg-red-100 text-red-700' :
                          question.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {question.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          question.status === 'Active' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {question.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}