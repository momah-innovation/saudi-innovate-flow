import { useState, useCallback, useMemo } from 'react';
import { createErrorHandler } from '@/utils/errorHandler';

// Template interfaces
export interface Template {
  id: string;
  name: string;
  type: 'email' | 'document' | 'report' | 'notification' | 'form';
  category: string;
  description: string;
  content: string;
  variables: TemplateVariable[];
  status: 'draft' | 'active' | 'archived';
  version: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  usage_count: number;
  tags: string[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'object';
  required: boolean;
  default_value?: any;
  description?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  template_count: number;
  icon: string;
}

export interface TemplateVersion {
  id: string;
  template_id: string;
  version: string;
  content: string;
  created_by: string;
  created_at: string;
  changelog?: string;
}

export interface UseTemplateDataReturn {
  templates: Template[];
  categories: TemplateCategory[];
  versions: TemplateVersion[];
  loading: boolean;
  error: string | null;
  refreshTemplates: () => Promise<void>;
  createTemplate: (template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string, newName: string) => Promise<void>;
  previewTemplate: (id: string, variables: Record<string, any>) => string;
  getTemplateVersions: (templateId: string) => Promise<void>;
  createTemplateVersion: (templateId: string, changelog?: string) => Promise<void>;
}

export const useTemplateData = (): UseTemplateDataReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorHandler = createErrorHandler({
    component: 'useTemplateData',
    showToast: true
  });

  // Mock template data
  const mockTemplates: Template[] = useMemo(() => [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      category: 'onboarding',
      description: 'Welcome email for new users',
      content: 'Welcome {{user_name}} to our platform! Your account is ready.',
      variables: [
        { name: 'user_name', type: 'text', required: true, description: 'User\'s full name' },
        { name: 'company_name', type: 'text', required: false, default_value: 'Our Company' }
      ],
      status: 'active',
      version: '1.2',
      created_by: 'Admin User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      usage_count: 1247,
      tags: ['welcome', 'email', 'onboarding']
    },
    {
      id: '2',
      name: 'Monthly Report',
      type: 'report',
      category: 'analytics',
      description: 'Monthly performance report template',
      content: 'Monthly Report for {{month}} {{year}}\n\nTotal Users: {{total_users}}\nRevenue: ${{revenue}}',
      variables: [
        { name: 'month', type: 'text', required: true },
        { name: 'year', type: 'number', required: true },
        { name: 'total_users', type: 'number', required: true },
        { name: 'revenue', type: 'number', required: true }
      ],
      status: 'active',
      version: '2.0',
      created_by: 'Report Manager',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
      usage_count: 52,
      tags: ['report', 'monthly', 'analytics']
    },
    {
      id: '3',
      name: 'Password Reset',
      type: 'email',
      category: 'security',
      description: 'Password reset notification email',
      content: 'Reset your password by clicking: {{reset_link}}\n\nExpires in {{expiry_hours}} hours.',
      variables: [
        { name: 'reset_link', type: 'text', required: true },
        { name: 'expiry_hours', type: 'number', required: true, default_value: 24 }
      ],
      status: 'active',
      version: '1.0',
      created_by: 'Security Team',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
      usage_count: 892,
      tags: ['security', 'password', 'reset']
    }
  ], []);

  // Mock categories data
  const mockCategories: TemplateCategory[] = useMemo(() => [
    {
      id: '1',
      name: 'Email Templates',
      description: 'Email communication templates',
      template_count: 15,
      icon: 'Mail'
    },
    {
      id: '2',
      name: 'Document Templates',
      description: 'Document and contract templates',
      template_count: 8,
      icon: 'FileText'
    },
    {
      id: '3',
      name: 'Report Templates',
      description: 'Automated report templates',
      template_count: 6,
      icon: 'BarChart'
    },
    {
      id: '4',
      name: 'Notification Templates',
      description: 'System notification templates',
      template_count: 12,
      icon: 'Bell'
    }
  ], []);

  // Mock versions data
  const mockVersions: TemplateVersion[] = useMemo(() => [
    {
      id: '1',
      template_id: '1',
      version: '1.2',
      content: 'Welcome {{user_name}} to our platform! Your account is ready.',
      created_by: 'Admin User',
      created_at: new Date().toISOString(),
      changelog: 'Updated welcome message tone'
    },
    {
      id: '2',
      template_id: '1',
      version: '1.1',
      content: 'Welcome {{user_name}}! Your account has been created.',
      created_by: 'Admin User',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      changelog: 'Added user name personalization'
    }
  ], []);

  const refreshTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTemplates(mockTemplates);
      setCategories(mockCategories);
    } catch (err) {
      errorHandler.handleError(err as Error, 'refresh templates');
      setError('Failed to refresh templates');
    } finally {
      setLoading(false);
    }
  }, [mockTemplates, mockCategories, errorHandler]);

  const createTemplate = useCallback(async (
    template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
  ) => {
    try {
      setLoading(true);
      
      const newTemplate: Template = {
        ...template,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0
      };
      
      setTemplates(prev => [newTemplate, ...prev]);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'create template');
    } finally {
      setLoading(false);
    }
  }, [errorHandler]);

  const updateTemplate = useCallback(async (
    id: string,
    updates: Partial<Template>
  ) => {
    try {
      setTemplates(prev =>
        prev.map(template =>
          template.id === id 
            ? { ...template, ...updates, updated_at: new Date().toISOString() }
            : template
        )
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'update template');
    }
  }, [errorHandler]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'delete template');
    }
  }, [errorHandler]);

  const duplicateTemplate = useCallback(async (id: string, newName: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      
      const duplicatedTemplate: Template = {
        ...template,
        id: Date.now().toString(),
        name: newName,
        status: 'draft',
        version: '1.0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        usage_count: 0
      };
      
      setTemplates(prev => [duplicatedTemplate, ...prev]);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'duplicate template');
    }
  }, [templates, errorHandler]);

  const previewTemplate = useCallback((
    id: string,
    variables: Record<string, any>
  ): string => {
    const template = templates.find(t => t.id === id);
    if (!template) return '';
    
    let content = template.content;
    
    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, String(value));
    });
    
    return content;
  }, [templates]);

  const getTemplateVersions = useCallback(async (templateId: string) => {
    try {
      setLoading(true);
      
      // Filter versions for the specific template
      const templateVersions = mockVersions.filter(v => v.template_id === templateId);
      setVersions(templateVersions);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'get template versions');
    } finally {
      setLoading(false);
    }
  }, [mockVersions, errorHandler]);

  const createTemplateVersion = useCallback(async (
    templateId: string,
    changelog?: string
  ) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template not found');
      
      const currentVersion = template.version;
      const versionParts = currentVersion.split('.');
      const newMinorVersion = parseInt(versionParts[1]) + 1;
      const newVersion = `${versionParts[0]}.${newMinorVersion}`;
      
      const newTemplateVersion: TemplateVersion = {
        id: Date.now().toString(),
        template_id: templateId,
        version: newVersion,
        content: template.content,
        created_by: 'Current User',
        created_at: new Date().toISOString(),
        changelog: changelog || 'Version update'
      };
      
      setVersions(prev => [newTemplateVersion, ...prev]);
      
      // Update template version
      await updateTemplate(templateId, { version: newVersion });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      errorHandler.handleError(err as Error, 'create template version');
    }
  }, [templates, updateTemplate, errorHandler]);

  // Initialize data on component mount
  useState(() => {
    refreshTemplates();
  });

  return {
    templates,
    categories,
    versions,
    loading,
    error,
    refreshTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    previewTemplate,
    getTemplateVersions,
    createTemplateVersion
  };
};