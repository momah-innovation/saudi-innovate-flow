import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  action: string;
  ideaId?: string;
  data?: any;
  status?: string;
  reason?: string;
  assignee?: string;
  dueDate?: string;
  priority?: string;
  assignmentType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ideaId, data, status, reason, assignee, dueDate, priority, assignmentType }: WorkflowRequest = await req.json();

    console.log('Idea workflow action:', { action, ideaId, status });

    let result: any = {};

    switch (action) {
      case 'get_workflow_state':
        result = await getWorkflowState(supabaseClient, ideaId!);
        break;
      
      case 'change_status':
        result = await changeIdeaStatus(supabaseClient, ideaId!, status!, reason);
        break;
      
      case 'assign_for_review':
        result = await assignForReview(supabaseClient, ideaId!, assignee!, dueDate, priority, assignmentType);
        break;
      
      case 'create_milestones':
        result = await createMilestones(supabaseClient, ideaId!);
        break;
      
      case 'bulk_status_change':
        result = await bulkStatusChange(supabaseClient, data.ideaIds, data.newStatus, data.reason);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in idea-workflow-manager:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

async function getWorkflowState(supabase: any, ideaId: string) {
  // Get workflow states
  const { data: workflowStates, error: workflowError } = await supabase
    .from('idea_workflow_states')
    .select('*')
    .eq('idea_id', ideaId)
    .order('created_at', { ascending: false });

  if (workflowError) throw workflowError;

  // Get assignments
  const { data: assignments, error: assignmentError } = await supabase
    .from('team_assignments')
    .select(`
      *,
      innovation_team_members(
        user_id,
        profiles(display_name, profile_image_url)
      )
    `)
    .eq('assignment_type', 'idea')
    .eq('assignment_id', ideaId);

  if (assignmentError) throw assignmentError;

  // Get milestones
  const { data: milestones, error: milestonesError } = await supabase
    .from('idea_lifecycle_milestones')
    .select('*')
    .eq('idea_id', ideaId)
    .order('target_date', { ascending: true });

  if (milestonesError) throw milestonesError;

  return {
    workflowStates: workflowStates || [],
    assignments: assignments || [],
    milestones: milestones || []
  };
}

async function changeIdeaStatus(supabase: any, ideaId: string, newStatus: string, reason?: string) {
  // Get current idea
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('status')
    .eq('id', ideaId)
    .single();

  if (ideaError) throw ideaError;

  const oldStatus = idea.status;

  // Update idea status
  const { error: updateError } = await supabase
    .from('ideas')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', ideaId);

  if (updateError) throw updateError;

  // Log workflow state change
  const { error: workflowError } = await supabase
    .from('idea_workflow_states')
    .insert({
      idea_id: ideaId,
      from_status: oldStatus,
      to_status: newStatus,
      triggered_by: null, // System action
      reason: reason || `Status changed to ${newStatus}`,
      metadata: {
        automated: true,
        timestamp: new Date().toISOString()
      }
    });

  if (workflowError) throw workflowError;

  // Send notifications
  await sendStatusChangeNotifications(supabase, ideaId, oldStatus, newStatus);

  return {
    ideaId,
    oldStatus,
    newStatus,
    message: 'Status updated successfully'
  };
}

async function assignForReview(supabase: any, ideaId: string, assigneeId: string, dueDate?: string, priority?: string, assignmentType?: string) {
  // Get team member
  const { data: teamMember, error: memberError } = await supabase
    .from('innovation_team_members')
    .select('id')
    .eq('user_id', assigneeId)
    .single();

  if (memberError) throw memberError;

  // Create assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('team_assignments')
    .insert({
      team_member_id: teamMember.id,
      assignment_type: 'idea',
      assignment_id: ideaId,
      role_in_assignment: assignmentType || 'reviewer',
      status: 'active',
      assigned_date: new Date().toISOString(),
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      priority: priority || 'medium',
      workload_percentage: 10
    })
    .select()
    .single();

  if (assignmentError) throw assignmentError;

  // Send assignment notification
  await sendAssignmentNotification(supabase, ideaId, assigneeId, assignmentType || 'reviewer');

  return {
    assignmentId: assignment.id,
    message: 'Assignment created successfully'
  };
}

async function createMilestones(supabase: any, ideaId: string) {
  // Get idea details
  const { data: idea, error: ideaError } = await supabase
    .from('ideas')
    .select('title_ar, status')
    .eq('id', ideaId)
    .single();

  if (ideaError) throw ideaError;

  // Define default milestones based on status
  const defaultMilestones = [
    {
      milestone_name: 'مراجعة أولية',
      milestone_name_en: 'Initial Review',
      description: 'مراجعة الفكرة والتحقق من اكتمال المتطلبات',
      target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      milestone_type: 'review',
      is_critical: true
    },
    {
      milestone_name: 'تقييم تقني',
      milestone_name_en: 'Technical Evaluation',
      description: 'تقييم الجدوى التقنية والتنفيذية للفكرة',
      target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      milestone_type: 'evaluation',
      is_critical: true
    },
    {
      milestone_name: 'قرار نهائي',
      milestone_name_en: 'Final Decision',
      description: 'اتخاذ القرار النهائي بشأن قبول أو رفض الفكرة',
      target_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      milestone_type: 'decision',
      is_critical: true
    }
  ];

  // Insert milestones
  const milestonesToInsert = defaultMilestones.map(milestone => ({
    ...milestone,
    idea_id: ideaId,
    created_by: null, // System created
    status: 'pending'
  }));

  const { data: milestones, error: milestonesError } = await supabase
    .from('idea_lifecycle_milestones')
    .insert(milestonesToInsert)
    .select();

  if (milestonesError) throw milestonesError;

  return {
    milestonesCreated: milestones.length,
    milestones
  };
}

async function bulkStatusChange(supabase: any, ideaIds: string[], newStatus: string, reason?: string) {
  const results = [];

  for (const ideaId of ideaIds) {
    try {
      const result = await changeIdeaStatus(supabase, ideaId, newStatus, reason);
      results.push({ ideaId, success: true, result });
    } catch (error) {
      results.push({ ideaId, success: false, error: error.message });
    }
  }

  return {
    totalProcessed: ideaIds.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

async function sendStatusChangeNotifications(supabase: any, ideaId: string, oldStatus: string, newStatus: string) {
  try {
    // Get idea details and innovator
    const { data: idea, error } = await supabase
      .from('ideas')
      .select(`
        title_ar,
        innovators(user_id)
      `)
      .eq('id', ideaId)
      .single();

    if (error || !idea) return;

    const notificationTitle = getStatusChangeTitle(newStatus);
    const notificationMessage = `تم تغيير حالة فكرة "${idea.title_ar}" من ${oldStatus} إلى ${newStatus}`;

    // Send notification to innovator
    await supabase.functions.invoke('send-idea-notification', {
      body: {
        ideaId,
        recipientId: idea.innovators.user_id,
        notificationType: 'status_change',
        title: notificationTitle,
        message: notificationMessage,
        metadata: { oldStatus, newStatus }
      }
    });
  } catch (error) {
    console.error('Error sending status change notifications:', error);
  }
}

async function sendAssignmentNotification(supabase: any, ideaId: string, assigneeId: string, assignmentType: string) {
  try {
    // Get idea details
    const { data: idea, error } = await supabase
      .from('ideas')
      .select('title_ar')
      .eq('id', ideaId)
      .single();

    if (error || !idea) return;

    const notificationTitle = 'مهمة جديدة مُسندة إليك';
    const notificationMessage = `تم إسناد مراجعة فكرة "${idea.title_ar}" إليك كـ ${assignmentType}`;

    // Send notification to assignee
    await supabase.functions.invoke('send-idea-notification', {
      body: {
        ideaId,
        recipientId: assigneeId,
        notificationType: 'assignment',
        title: notificationTitle,
        message: notificationMessage,
        metadata: { assignmentType }
      }
    });
  } catch (error) {
    console.error('Error sending assignment notification:', error);
  }
}

function getStatusChangeTitle(status: string): string {
  const titles: Record<string, string> = {
    'draft': 'الفكرة في حالة مسودة',
    'submitted': 'تم تقديم الفكرة',
    'under_review': 'الفكرة قيد المراجعة',
    'approved': 'تم قبول الفكرة',
    'rejected': 'تم رفض الفكرة',
    'in_development': 'الفكرة قيد التطوير',
    'implemented': 'تم تنفيذ الفكرة'
  };
  return titles[status] || 'تم تحديث حالة الفكرة';
}

serve(handler);