import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface SystemListSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function SystemListSettings({ settings, onSettingChange }: SystemListSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [editingList, setEditingList] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");

  const systemLists = {
    // Core system lists
    challenge_types: settings.challenge_types || ["تقنية", "استدامة", "صحة", "تعليم", "حوكمة"],
    priority_levels: settings.priority_levels || ["منخفض", "متوسط", "عالي", "عاجل"],
    status_options: settings.status_options || ["نشط", "غير نشط", "معلق", "مكتمل", "ملغي"],
    
    // Event lists
    event_types: settings.event_types || ["ورشة عمل", "ندوة", "مؤتمر", "شبكات تواصل", "هاكاثون"],
    event_categories: settings.event_categories || ["حدث مستقل", "حدث حملة", "تدريب", "ورشة عمل"],
    
    // Stakeholder lists
    stakeholder_categories: settings.stakeholder_categories || ["حكومي", "خاص", "أكاديمي", "مجتمع مدني"],
    relationship_types: settings.relationship_types || ["مباشر", "غير مباشر", "تعاوني", "تنافسي"],
    
    // Team and role lists
    team_specializations: settings.team_specializations || ["استراتيجية", "تنفيذ", "بحث", "تحليل"],
    expert_roles: settings.expert_roles || ["خبير رئيسي", "مقيم", "مراجع", "مستشار"],
    
    // Idea and evaluation lists
    idea_assignment_types: settings.idea_assignment_types || ["مراجع", "مقيم", "منفذ", "مراقب"],
    evaluator_types: settings.evaluator_types || ["خبير رئيسي", "مقيم", "مراجع", "مستشار خارجي"],
    
    // Campaign and analytics lists
    campaign_themes: settings.campaign_themes || ["تحول رقمي", "استدامة", "مدن ذكية", "صحة"],
    analytics_metrics: settings.analytics_metrics || ["مشاهدات", "مشاركات", "تقييمات", "تعليقات"]
  };

  const listLabels = {
    challenge_types: isRTL ? "أنواع التحديات" : "Challenge Types",
    priority_levels: isRTL ? "مستويات الأولوية" : "Priority Levels",
    status_options: isRTL ? "خيارات الحالة" : "Status Options",
    event_types: isRTL ? "أنواع الفعاليات" : "Event Types",
    event_categories: isRTL ? "فئات الفعاليات" : "Event Categories",
    stakeholder_categories: isRTL ? "فئات المعنيين" : "Stakeholder Categories",
    relationship_types: isRTL ? "أنواع العلاقات" : "Relationship Types",
    team_specializations: isRTL ? "تخصصات الفريق" : "Team Specializations",
    expert_roles: isRTL ? "أدوار الخبراء" : "Expert Roles",
    idea_assignment_types: isRTL ? "أنواع تكليف الأفكار" : "Idea Assignment Types",
    evaluator_types: isRTL ? "أنواع المقيمين" : "Evaluator Types",
    campaign_themes: isRTL ? "مواضيع الحملات" : "Campaign Themes",
    analytics_metrics: isRTL ? "مقاييس التحليلات" : "Analytics Metrics"
  };

  const addItem = (listKey: string) => {
    if (!newItem.trim()) {
      toast({
        title: t('error'),
        description: isRTL ? "يرجى إدخال عنصر صحيح" : "Please enter a valid item",
        variant: "destructive"
      });
      return;
    }

    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    if (currentList.includes(newItem.trim())) {
      toast({
        title: t('error'),
        description: isRTL ? "هذا العنصر موجود بالفعل" : "This item already exists",
        variant: "destructive"
      });
      return;
    }

    const updatedList = [...currentList, newItem.trim()];
    onSettingChange(listKey, updatedList);
    setNewItem("");
    setEditingList(null);
    
    toast({
      title: t('success'),
      description: t('itemAddedSuccessfully')
    });
  };

  const removeItem = (listKey: string, itemIndex: number) => {
    const currentList = systemLists[listKey as keyof typeof systemLists] || [];
    const updatedList = currentList.filter((_, index) => index !== itemIndex);
    onSettingChange(listKey, updatedList);
    
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const renderList = (listKey: string, items: string[]) => (
    <Card key={listKey}>
      <CardHeader>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="text-lg">{listLabels[listKey as keyof typeof listLabels]}</CardTitle>
            <CardDescription>
              {isRTL ? `إدارة قائمة ${listLabels[listKey as keyof typeof listLabels]}` : `Manage ${listLabels[listKey as keyof typeof listLabels]} list`}
            </CardDescription>
          </div>
          <Badge variant="outline">{items.length} {isRTL ? 'عنصر' : 'items'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className={`flex items-center justify-between p-2 bg-muted rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="flex-1">{item}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(listKey, index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {editingList === listKey ? (
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={isRTL ? "أدخل عنصر جديد..." : "Enter new item..."}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(listKey);
                } else if (e.key === 'Escape') {
                  setEditingList(null);
                  setNewItem("");
                }
              }}
              autoFocus
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={() => addItem(listKey)} size="sm">
              {isRTL ? 'إضافة' : 'Add'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setEditingList(null);
                setNewItem("");
              }}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditingList(listKey)}
            className="w-full"
          >
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة عنصر جديد' : 'Add New Item'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{isRTL ? 'إدارة قوائم النظام' : 'System Lists Management'}</CardTitle>
          <CardDescription>
            {isRTL 
              ? 'إدارة جميع القوائم والخيارات المتاحة في النظام'
              : 'Manage all system lists and options available throughout the platform'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="challenge-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم التحديات والأولوية' : 'Challenge & Priority Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('challenge_types', systemLists.challenge_types)}
                {renderList('priority_levels', systemLists.priority_levels)}
                {renderList('status_options', systemLists.status_options)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="event-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم الفعاليات' : 'Event Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('event_types', systemLists.event_types)}
                {renderList('event_categories', systemLists.event_categories)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="stakeholder-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم المعنيين' : 'Stakeholder Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('stakeholder_categories', systemLists.stakeholder_categories)}
                {renderList('relationship_types', systemLists.relationship_types)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="team-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم الفريق والخبراء' : 'Team & Expert Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('team_specializations', systemLists.team_specializations)}
                {renderList('expert_roles', systemLists.expert_roles)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="evaluation-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم التقييم والأفكار' : 'Evaluation & Idea Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('idea_assignment_types', systemLists.idea_assignment_types)}
                {renderList('evaluator_types', systemLists.evaluator_types)}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="campaign-lists">
              <AccordionTrigger className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'قوائم الحملات والتحليلات' : 'Campaign & Analytics Lists'}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderList('campaign_themes', systemLists.campaign_themes)}
                {renderList('analytics_metrics', systemLists.analytics_metrics)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}