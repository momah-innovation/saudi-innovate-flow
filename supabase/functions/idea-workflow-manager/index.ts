import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkflowRequest {
  action: string;
  ideaId: string;
  status?: string;
  reason?: string;
  assignee?: string;
  dueDate?: string;
  priority?: string;
  assignmentType?: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
      }
    );

    const { action, ideaId, status, reason, assignee, dueDate, priority, assignmentType, data }: WorkflowRequest = await req.json();

    console.log('Processing workflow action:', { action, ideaId, status });

    let result;

    switch (action) {
      case 'change_status':
        result = await changeIdeaStatus(supabaseClient, ideaId, status!, reason);
        break;
      
      case 'assign_for_review':
        result = await assignIdeaForReview(supabaseClient, ideaId, assignee!, dueDate, priority, assignmentType);
        break;
      
      case 'create_milestones':
        result = await createIdeaLifecycleMilestones(supabaseClient, ideaId);
        break;
      
      case 'get_workflow_state':
        result = await getWorkflowState(supabaseClient, ideaId);
        break;
      
      case 'calculate_analytics':
        result = await calculateIdeaAnalytics(supabaseClient, ideaId);
        break;
      
      case 'bulk_status_change':
        result = await bulkStatusChange(supabaseClient, data.ideaIds, data.newStatus, data.reason);
        break;
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in workflow manager:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function changeIdeaStatus(supabase: any, ideaId: string, newStatus: string, reason?: string) {
  console.log('Changing idea status:', { ideaId, newStatus, reason });
  
  // Use the database function for workflow change
  const { data, error } = await supabase.rpc('trigger_idea_workflow_change', {
    p_idea_id: ideaId,
    p_to_status: newStatus,
    p_reason: reason
  });

  if (error) throw error;
  
  return { success: true, data, message: 'تم تغيير حالة الفكرة بنجاح' };
}

async function assignIdeaForReview(supabase: any, ideaId: string, assigneeId: string, dueDate?: string, priority: string = 'medium', assignmentType: string = 'reviewer') {
  console.log('Assigning idea for review:', { ideaId, assigneeId, dueDate, priority, assignmentType });
  
  const { data: authData } = await supabase.auth.getUser();
  const assignedBy = authData?.user?.id;

  if (!assignedBy) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('idea_assignments')
    .insert({
      idea_id: ideaId,
      assigned_to: assigneeId,
      assigned_by: assignedBy,
      assignment_type: assignmentType,
      due_date: dueDate,
      priority: priority,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Send notification to assignee
  await supabase
    .from('idea_notifications')
    .insert({
      idea_id: ideaId,
      recipient_id: assigneeId,
      sender_id: assignedBy,
      notification_type: 'assignment',
      title: 'تم تكليفك بمراجعة فكرة',
      message: `تم تكليفك بمراجعة فكرة جديدة. نوع المهمة: ${assignmentType}`
    });

  return { success: true, data, message: 'تم تكليف المراجع بنجاح' };
}

async function createIdeaLifecycleMilestones(supabase: any, ideaId: string) {
  console.log('Creating lifecycle milestones for idea:', ideaId);
  
  const milestones = [
    {
      milestone_type: 'submission',
      title: 'تقديم الفكرة',
      description: 'تم تقديم الفكرة للنظام',
      order_sequence: 1,
      status: 'achieved',
      achieved_date: new Date().toISOString()
    },
    {
      milestone_type: 'initial_review',
      title: 'المراجعة الأولية',
      description: 'مراجعة أولية للفكرة من قبل الفريق',
      order_sequence: 2,
      status: 'pending'
    },
    {
      milestone_type: 'expert_evaluation',
      title: 'تقييم الخبراء',
      description: 'تقييم مفصل من قبل الخبراء المختصين',
      order_sequence: 3,
      status: 'pending'
    },
    {
      milestone_type: 'decision',
      title: 'اتخاذ القرار',
      description: 'قرار نهائي بقبول أو رفض الفكرة',
      order_sequence: 4,
      status: 'pending'
    },
    {
      milestone_type: 'implementation_planning',
      title: 'تخطيط التنفيذ',
      description: 'وضع خطة تفصيلية لتنفيذ الفكرة',
      order_sequence: 5,
      status: 'pending'
    },
    {
      milestone_type: 'development',
      title: 'التطوير',
      description: 'مرحلة تطوير وتنفيذ الفكرة',
      order_sequence: 6,
      status: 'pending'
    },
    {
      milestone_type: 'launch',
      title: 'الإطلاق',
      description: 'إطلاق الفكرة للجمهور المستهدف',
      order_sequence: 7,
      status: 'pending'
    }
  ];

  const milestonesToInsert = milestones.map(milestone => ({
    ...milestone,
    idea_id: ideaId
  }));

  const { data, error } = await supabase
    .from('idea_lifecycle_milestones')
    .insert(milestonesToInsert)
    .select();

  if (error) throw error;

  return { success: true, data, message: 'تم إنشاء معالم دورة حياة الفكرة بنجاح' };
}

async function getWorkflowState(supabase: any, ideaId: string) {
  console.log('Getting workflow state for idea:', ideaId);
  
  const [
    { data: idea, error: ideaError },
    { data: workflowStates, error: statesError },
    { data: assignments, error: assignmentsError },
    { data: milestones, error: milestonesError },
    { data: comments, error: commentsError }
  ] = await Promise.all([
    supabase.from('ideas').select('*').eq('id', ideaId).single(),
    supabase.from('idea_workflow_states').select('*').eq('idea_id', ideaId).order('created_at', { ascending: false }),
    supabase.from('idea_assignments').select('*').eq('idea_id', ideaId).order('created_at', { ascending: false }),
    supabase.from('idea_lifecycle_milestones').select('*').eq('idea_id', ideaId).order('order_sequence'),
    supabase.from('idea_comments').select('*').eq('idea_id', ideaId).order('created_at', { ascending: false })
  ]);

  if (ideaError) throw ideaError;
  if (statesError) throw statesError;
  if (assignmentsError) throw assignmentsError;
  if (milestonesError) throw milestonesError;
  if (commentsError) throw commentsError;

  return {
    success: true,
    data: {
      idea,
      workflowStates,
      assignments,
      milestones,
      comments,
      summary: {
        currentStatus: idea.status,
        totalStateChanges: workflowStates.length,
        activeAssignments: assignments.filter((a: any) => a.status === 'pending').length,
        completedMilestones: milestones.filter((m: any) => m.status === 'achieved').length,
        totalMilestones: milestones.length,
        commentCount: comments.length
      }
    }
  };
}

async function calculateIdeaAnalytics(supabase: any, ideaId: string) {
  console.log('Calculating analytics for idea:', ideaId);
  
  const { data, error } = await supabase.rpc('calculate_idea_analytics', {
    p_idea_id: ideaId
  });

  if (error) throw error;

  return { success: true, data, message: 'تم حساب تحليلات الفكرة بنجاح' };
}

async function bulkStatusChange(supabase: any, ideaIds: string[], newStatus: string, reason?: string) {
  console.log('Bulk status change:', { ideaIds, newStatus, reason });
  
  const results = [];
  
  for (const ideaId of ideaIds) {
    try {
      const result = await changeIdeaStatus(supabase, ideaId, newStatus, reason);
      results.push({ ideaId, success: true, result });
    } catch (error) {
      results.push({ ideaId, success: false, error: error.message });
    }
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    success: true,
    data: results,
    message: `تم تحديث ${successful} فكرة بنجاح، فشل في ${failed} فكرة`
  };
}

serve(handler);