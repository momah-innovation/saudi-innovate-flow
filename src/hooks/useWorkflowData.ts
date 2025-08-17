import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'automation' | 'condition' | 'action';
  status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
  assignee?: string;
  due_date?: string;
  configuration: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'approval' | 'notification' | 'automation' | 'integration';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  trigger: {
    type: 'manual' | 'scheduled' | 'event' | 'webhook';
    configuration: Record<string, any>;
  };
  steps: WorkflowStep[];
  created_by: string;
  created_at: string;
  updated_at: string;
  last_run?: string;
  run_count: number;
  success_rate: number;
}

interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  triggered_by: string;
  context: Record<string, any>;
  current_step?: string;
  error_message?: string;
}

export const useWorkflowData = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useWorkflowData' });

  // Mock data for workflows
  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'User Approval Workflow',
      description: 'Approve new user registrations',
      category: 'approval',
      status: 'active',
      trigger: {
        type: 'event',
        configuration: { event: 'user_registration' }
      },
      steps: [
        {
          id: 'step1',
          name: 'Review Application',
          type: 'approval',
          status: 'active',
          assignee: 'admin@example.com',
          configuration: { approval_required: true },
          position: { x: 100, y: 100 }
        },
        {
          id: 'step2',
          name: 'Send Welcome Email',
          type: 'notification',
          status: 'pending',
          configuration: { template: 'welcome_email' },
          position: { x: 300, y: 100 }
        }
      ],
      created_by: 'admin@example.com',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      last_run: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      run_count: 45,
      success_rate: 96.5
    },
    {
      id: '2',
      name: 'Daily Report Generation',
      description: 'Generate and send daily analytics reports',
      category: 'automation',
      status: 'active',
      trigger: {
        type: 'scheduled',
        configuration: { cron: '0 9 * * *' }
      },
      steps: [
        {
          id: 'step1',
          name: 'Generate Report',
          type: 'automation',
          status: 'active',
          configuration: { report_type: 'daily_analytics' },
          position: { x: 100, y: 100 }
        },
        {
          id: 'step2',
          name: 'Send to Managers',
          type: 'notification',
          status: 'active',
          configuration: { recipients: ['manager@example.com'] },
          position: { x: 300, y: 100 }
        }
      ],
      created_by: 'system@example.com',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      last_run: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      run_count: 60,
      success_rate: 100
    }
  ];

  const mockExecutions: WorkflowExecution[] = [
    {
      id: '1',
      workflow_id: '1',
      status: 'running',
      started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      triggered_by: 'user123@example.com',
      context: { user_id: 'user123', application_type: 'standard' },
      current_step: 'step1'
    },
    {
      id: '2',
      workflow_id: '2',
      status: 'completed',
      started_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 11.5 * 60 * 60 * 1000).toISOString(),
      triggered_by: 'system',
      context: { date: new Date().toISOString().split('T')[0] }
    }
  ];

  const refreshWorkflowData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setWorkflows(mockWorkflows);
      setExecutions(mockExecutions);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshWorkflowData');
      toast({
        title: 'خطأ في جلب بيانات سير العمل',
        description: 'حدث خطأ أثناء جلب بيانات سير العمل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createWorkflow = useCallback(async (workflowData: Partial<Workflow>) => {
    try {
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: workflowData.name || '',
        description: workflowData.description || '',
        category: workflowData.category || 'automation',
        status: 'draft',
        trigger: workflowData.trigger || { type: 'manual', configuration: {} },
        steps: workflowData.steps || [],
        created_by: 'current_user@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        run_count: 0,
        success_rate: 0,
        ...workflowData
      };

      setWorkflows(prev => [newWorkflow, ...prev]);
      toast({
        title: 'تم إنشاء سير العمل',
        description: 'تم إنشاء سير العمل الجديد بنجاح',
      });
      return newWorkflow;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createWorkflow');
      throw error;
    }
  }, [errorHandler, toast]);

  const updateWorkflow = useCallback(async (id: string, updates: Partial<Workflow>) => {
    try {
      setWorkflows(prev => prev.map(workflow => 
        workflow.id === id ? { ...workflow, ...updates, updated_at: new Date().toISOString() } : workflow
      ));
      toast({
        title: 'تم تحديث سير العمل',
        description: 'تم تحديث سير العمل بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateWorkflow');
      throw error;
    }
  }, [errorHandler, toast]);

  const executeWorkflow = useCallback(async (id: string, context: Record<string, any> = {}) => {
    try {
      const newExecution: WorkflowExecution = {
        id: Date.now().toString(),
        workflow_id: id,
        status: 'running',
        started_at: new Date().toISOString(),
        triggered_by: 'current_user',
        context,
        current_step: workflows.find(w => w.id === id)?.steps[0]?.id
      };

      setExecutions(prev => [newExecution, ...prev]);
      
      // Simulate workflow execution
      setTimeout(() => {
        setExecutions(prev => prev.map(exec => 
          exec.id === newExecution.id ? { 
            ...exec, 
            status: 'completed' as const,
            completed_at: new Date().toISOString()
          } : exec
        ));
      }, 5000);

      toast({
        title: 'بدأ تنفيذ سير العمل',
        description: 'تم بدء تنفيذ سير العمل بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'executeWorkflow');
      throw error;
    }
  }, [workflows, errorHandler, toast]);

  const toggleWorkflow = useCallback(async (id: string) => {
    try {
      const workflow = workflows.find(w => w.id === id);
      if (workflow) {
        const newStatus = workflow.status === 'active' ? 'paused' : 'active';
        await updateWorkflow(id, { status: newStatus });
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'toggleWorkflow');
      throw error;
    }
  }, [workflows, updateWorkflow, errorHandler, toast]);

  return {
    workflows,
    executions,
    loading,
    refreshWorkflowData,
    createWorkflow,
    updateWorkflow,
    executeWorkflow,
    toggleWorkflow,
  };
};