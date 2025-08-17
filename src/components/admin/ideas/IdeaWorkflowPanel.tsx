import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { logger } from "@/utils/logger";
import { useSettingsManager } from "@/hooks/useSettingsManager";
import { supabase } from "@/integrations/supabase/client";
import { 
  GitBranch, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users, 
  Target,
  Calendar,
  Activity,
  ArrowRight
} from "lucide-react";
import { createErrorHandler } from "@/utils/unified-error-handler";
import { dateHandler } from "@/utils/unified-date-handler";

interface WorkflowState {
  id: string;
  from_status: string;
  to_status: string;
  triggered_by: string;
  reason?: string;
  created_at: string;
}

interface Assignment {
  id: string;
  assigned_to: string;
  assigned_by: string;
  assignment_type: string;
  due_date?: string;
  status: string;
  priority: string;
  notes?: string;
  created_at: string;
}

interface Milestone {
  id: string;
  milestone_type: string;
  title: string;
  description?: string;
  achieved_date?: string;
  target_date?: string;
  status: string;
  order_sequence: number;
}

interface TeamMember {
  id: string;
  user_id: string;
  cic_role: string;
  contact_email: string;
  status: string;
}

interface IdeaWorkflowPanelProps {
  ideaId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export function IdeaWorkflowPanel({ ideaId, currentStatus, onStatusChange }: IdeaWorkflowPanelProps) {
  const { toast } = useToast();
  const { t, isRTL, getTranslation } = useUnifiedTranslation();
  const { getSettingValue } = useSettingsManager();
  
  const errorHandler = createErrorHandler({
    component: 'IdeaWorkflowPanel',
    showToast: true,
    logError: true
  });
  
  const [workflowStates, setWorkflowStates] = useState<WorkflowState[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  const [newStatus, setNewStatus] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [assignmentType, setAssignmentType] = useState("reviewer");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  
  const [loading, setLoading] = useState(false);
  const handleError = createErrorHandler({ component: 'IdeaWorkflowPanel' });
  const [activeTab, setActiveTab] = useState("workflow");

  // Status options from settings
  const generalStatusOptions = getSettingValue('workflow_statuses', []) as string[];
  const statusOptions = generalStatusOptions.map(status => ({ 
    value: status, 
    label: getTranslation(`workflowStatuses.${status}`) || status,
    icon: <Clock className="w-4 h-4" />,
    color: 'gray'
  }));

  const ideaAssignmentTypes = getSettingValue('idea_assignment_types', []) as string[];
  const priorityLevels = getSettingValue('priority_levels', []) as string[];
  const assignmentTypes = ideaAssignmentTypes.map(type => ({ 
    value: type, 
    label: getTranslation(`ideaAssignmentTypes.${type}`) || type
  }));

  // Priorities from settings
  const priorities = priorityLevels.map(level => ({ 
    value: level, 
    label: getTranslation(`priorityLevels.${level}`) || level
  }));

  useEffect(() => {
    if (ideaId) {
      fetchWorkflowData();
      fetchTeamMembers();
    }
  }, [ideaId]);

  const fetchWorkflowData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('idea-workflow-manager', {
        body: {
          action: 'get_workflow_state',
          ideaId: ideaId
        }
      });

      if (error) throw error;

      const { workflowStates, assignments, milestones } = data.data;
      setWorkflowStates(workflowStates || []);
      setAssignments(assignments || []);
      setMilestones(milestones || []);
    } catch (error) {
      logger.error('Error fetching workflow data', { component: 'IdeaWorkflowPanel', action: 'fetchWorkflowData', data: { ideaId } }, error as Error);
          toast({
            title: t('common.error', 'خطأ'),
            description: t('idea_workflow.load_workflow_data_failed', 'فشل في تحميل بيانات سير العمل'),
            variant: "destructive"
          });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('innovation_team_members')
        .select('*')
        .eq('status', 'active')
        .order('cic_role');
      
      if (!error) {
        setTeamMembers(data || []);
      }
    } catch (error) {
      logger.error('Error fetching team members', { component: 'IdeaWorkflowPanel', action: 'fetchTeamMembers' }, error as Error);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('idea-workflow-manager', {
        body: {
          action: 'change_status',
          ideaId: ideaId,
          status: newStatus,
          reason: statusReason
        }
      });

      if (error) throw error;

      toast({
        title: t('workflow.status_changed_title', 'تم تغيير الحالة'),
        description: data.message || t('workflow.status_changed_success', 'تم تغيير حالة الفكرة بنجاح')
      });

      setNewStatus("");
      setStatusReason("");
      await fetchWorkflowData();
      onStatusChange();
    } catch (error) {
      logger.error('Error changing status', { component: 'IdeaWorkflowPanel', action: 'handleStatusChange', data: { ideaId, newStatus } }, error as Error);
      toast({
        title: t('common.error', 'خطأ'),
        description: t('workflow.status_change_error', 'فشل في تغيير حالة الفكرة'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async () => {
    if (!assigneeId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('idea-workflow-manager', {
        body: {
          action: 'assign_for_review',
          ideaId: ideaId,
          assignee: assigneeId,
          dueDate: dueDate,
          priority: priority,
          assignmentType: assignmentType
        }
      });

      if (error) throw error;

      toast({
        title: t('idea_workflow.assignment_success', 'تم التكليف'),
        description: data.message || t('idea_workflow.reviewer_assigned_success', 'تم تكليف المراجع بنجاح')
      });

      setAssigneeId("");
      setDueDate("");
      setPriority("medium");
      setAssignmentType("reviewer");
      await fetchWorkflowData();
    } catch (error) {
      logger.error('Error creating assignment', { component: 'IdeaWorkflowPanel', action: 'handleAssignment', data: { ideaId, assigneeId } }, error as Error);
      toast({
        title: t('common.error', 'خطأ'),
        description: t('idea_workflow.assignment_failed', 'فشل في تكليف المراجع'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createMilestones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('idea-workflow-manager', {
        body: {
          action: 'create_milestones',
          ideaId: ideaId
        }
      });

      if (error) throw error;

      toast({
        title: t('idea_workflow.milestones_created', 'تم إنشاء المعالم'),
        description: data.message || t('idea_workflow.milestones_created_success', 'تم إنشاء معالم دورة الحياة بنجاح')
      });

      await fetchWorkflowData();
    } catch (error) {
      logger.error('Error creating milestones', { component: 'IdeaWorkflowPanel', action: 'createMilestones', data: { ideaId } }, error as Error);
      toast({
        title: t('common.error', 'خطأ'),
        description: t('idea_workflow.milestones_creation_failed', 'فشل في إنشاء المعالم'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'default';
      case 'pending': return 'secondary';
      case 'missed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("workflow")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "workflow" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t('idea_workflow.workflow_tab', 'سير العمل')}
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "assignments" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t('idea_workflow.assignments_tab', 'التكليفات')}
        </button>
        <button
          onClick={() => setActiveTab("milestones")}
          className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "milestones" 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t('idea_workflow.milestones_tab', 'المعالم')}
        </button>
      </div>

      {/* Workflow Tab */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          {/* Status Change Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                تغيير حالة الفكرة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('workflow.current_status', 'الحالة الحالية')}</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusInfo(currentStatus).icon}
                  <span>{getStatusInfo(currentStatus).label}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">{t('workflow.new_status', 'الحالة الجديدة')}</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('workflow.select_new_status', 'اختر الحالة الجديدة')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions
                      .filter(status => status.value !== currentStatus)
                      .map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            {status.icon}
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">سبب التغيير (اختياري)</label>
                <Textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="اكتب سبب تغيير الحالة..."
                  dir="rtl"
                />
              </div>

              <Button onClick={handleStatusChange} disabled={!newStatus || loading}>
                {loading ? 'جارٍ التحديث...' : 'تغيير الحالة'}
              </Button>
            </CardContent>
          </Card>

          {/* Workflow History */}
          <Card>
            <CardHeader>
              <CardTitle>تاريخ سير العمل</CardTitle>
            </CardHeader>
            <CardContent>
              {workflowStates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">لا يوجد تاريخ لسير العمل</p>
              ) : (
                <div className="space-y-3">
                  {workflowStates.map((state, index) => (
                    <div key={state.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {state.from_status && `${getStatusInfo(state.from_status).label} ← `}
                            {getStatusInfo(state.to_status).label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {dateHandler.formatDate(state.created_at)}
                          </span>
                        </div>
                        {state.reason && (
                          <p className="text-sm text-muted-foreground" dir="rtl">{state.reason}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          {/* New Assignment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                تكليف جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">المكلف</label>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المكلف" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.user_id}>
                          {member.cic_role} - {member.contact_email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">نوع التكليف</label>
                  <Select value={assignmentType} onValueChange={setAssignmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assignmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">الأولوية</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <Button onClick={handleAssignment} disabled={!assigneeId || loading}>
                {loading ? 'جارٍ التكليف...' : 'إنشاء تكليف'}
              </Button>
            </CardContent>
          </Card>

          {/* Assignments List */}
          <Card>
            <CardHeader>
              <CardTitle>التكليفات الحالية</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">لا توجد تكليفات</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{assignment.assignment_type}</span>
                          <Badge variant={getPriorityColor(assignment.priority)}>
                            {priorities.find(p => p.value === assignment.priority)?.label}
                          </Badge>
                          <Badge variant={getAssignmentStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                        {assignment.due_date && (
                          <span className="text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 inline ml-1" />
                            {dateHandler.formatDate(assignment.due_date)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        تم إنشاؤه في {dateHandler.formatDate(assignment.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          {milestones.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">لم يتم إنشاء معالم دورة الحياة بعد</p>
                <Button onClick={createMilestones} disabled={loading}>
                  {loading ? 'جارٍ الإنشاء...' : 'إنشاء معالم دورة الحياة'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  معالم دورة حياة الفكرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        milestone.status === 'achieved' 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : milestone.status === 'missed'
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-muted bg-background'
                      }`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge variant={getMilestoneStatusColor(milestone.status)}>
                            {milestone.status === 'achieved' ? 'مكتمل' : 
                             milestone.status === 'pending' ? 'في انتظار' :
                             milestone.status === 'missed' ? 'فائت' : 'ملغى'}
                          </Badge>
                        </div>
                        
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2" dir="rtl">
                            {milestone.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {milestone.achieved_date && (
                            <span>
                              <CheckCircle className="w-3 h-3 inline ml-1" />
                              مكتمل في {dateHandler.formatDate(milestone.achieved_date)}
                            </span>
                          )}
                          {milestone.target_date && (
                            <span>
                              <Clock className="w-3 h-3 inline ml-1" />
                              الهدف: {dateHandler.formatDate(milestone.target_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}