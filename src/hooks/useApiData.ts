import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: 'active' | 'inactive' | 'deprecated' | 'testing';
  version: string;
  description: string;
  rate_limit: {
    requests_per_minute: number;
    burst_limit: number;
    enabled: boolean;
  };
  authentication: {
    required: boolean;
    type: 'api_key' | 'oauth' | 'jwt' | 'basic_auth';
    roles: string[];
  };
  metrics: {
    total_requests: number;
    requests_today: number;
    success_rate: number;
    avg_response_time_ms: number;
    error_count_today: number;
  };
  documentation_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  usage_count: number;
  last_used: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  created_at: string;
  created_by: string;
}

interface ApiMetrics {
  totalEndpoints: number;
  activeEndpoints: number;
  totalRequests: number;
  requestsToday: number;
  averageResponseTime: number;
  errorRate: number;
}

export const useApiData = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useApiData' });

  // Mock data for API endpoints
  const mockEndpoints: ApiEndpoint[] = [
    {
      id: '1',
      name: 'User Management API',
      path: '/api/v1/users',
      method: 'GET',
      status: 'active',
      version: 'v1',
      description: 'Retrieve user information',
      rate_limit: {
        requests_per_minute: 100,
        burst_limit: 200,
        enabled: true
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['admin', 'user']
      },
      metrics: {
        total_requests: 15420,
        requests_today: 234,
        success_rate: 99.2,
        avg_response_time_ms: 45,
        error_count_today: 2
      },
      documentation_url: '/docs/api/users',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'developer@example.com'
    },
    {
      id: '2',
      name: 'Challenge Submission API',
      path: '/api/v1/challenges/{id}/submit',
      method: 'POST',
      status: 'active',
      version: 'v1',
      description: 'Submit challenge solutions',
      rate_limit: {
        requests_per_minute: 50,
        burst_limit: 100,
        enabled: true
      },
      authentication: {
        required: true,
        type: 'jwt',
        roles: ['innovator', 'admin']
      },
      metrics: {
        total_requests: 8750,
        requests_today: 67,
        success_rate: 97.8,
        avg_response_time_ms: 120,
        error_count_today: 1
      },
      documentation_url: '/docs/api/challenges',
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'api-team@example.com'
    }
  ];

  const mockApiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Mobile App Key',
      key_prefix: 'mk_live_abc123',
      permissions: ['read:users', 'write:challenges'],
      usage_count: 2340,
      last_used: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'mobile-team@example.com'
    },
    {
      id: '2',
      name: 'Analytics Service Key',
      key_prefix: 'ak_live_xyz789',
      permissions: ['read:analytics', 'read:metrics'],
      usage_count: 15600,
      last_used: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'active',
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: 'analytics-team@example.com'
    }
  ];

  const mockMetrics: ApiMetrics = {
    totalEndpoints: 45,
    activeEndpoints: 42,
    totalRequests: 156780,
    requestsToday: 1234,
    averageResponseTime: 67,
    errorRate: 0.8
  };

  const refreshApiData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setEndpoints(mockEndpoints);
      setApiKeys(mockApiKeys);
      setMetrics(mockMetrics);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshApiData');
      toast({
        title: 'خطأ في جلب بيانات API',
        description: 'حدث خطأ أثناء جلب بيانات API',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createEndpoint = useCallback(async (endpointData: Partial<ApiEndpoint>) => {
    try {
      const newEndpoint: ApiEndpoint = {
        id: Date.now().toString(),
        name: endpointData.name || '',
        path: endpointData.path || '',
        method: endpointData.method || 'GET',
        status: 'testing',
        version: endpointData.version || 'v1',
        description: endpointData.description || '',
        rate_limit: {
          requests_per_minute: 100,
          burst_limit: 200,
          enabled: true,
          ...endpointData.rate_limit
        },
        authentication: {
          required: true,
          type: 'jwt',
          roles: ['user'],
          ...endpointData.authentication
        },
        metrics: {
          total_requests: 0,
          requests_today: 0,
          success_rate: 0,
          avg_response_time_ms: 0,
          error_count_today: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user@example.com',
        ...endpointData
      };

      setEndpoints(prev => [newEndpoint, ...prev]);
      toast({
        title: 'تم إنشاء نقطة API',
        description: 'تم إنشاء نقطة API الجديدة بنجاح',
      });
      return newEndpoint;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createEndpoint');
      throw error;
    }
  }, [errorHandler, toast]);

  const updateEndpoint = useCallback(async (id: string, updates: Partial<ApiEndpoint>) => {
    try {
      setEndpoints(prev => prev.map(endpoint => 
        endpoint.id === id ? { ...endpoint, ...updates, updated_at: new Date().toISOString() } : endpoint
      ));
      toast({
        title: 'تم تحديث نقطة API',
        description: 'تم تحديث نقطة API بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateEndpoint');
      throw error;
    }
  }, [errorHandler, toast]);

  const createApiKey = useCallback(async (keyData: Partial<ApiKey>) => {
    try {
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: keyData.name || '',
        key_prefix: `ak_live_${Math.random().toString(36).substring(2, 8)}`,
        permissions: keyData.permissions || ['read:basic'],
        usage_count: 0,
        last_used: new Date().toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
        created_by: 'current_user@example.com',
        ...keyData
      };

      setApiKeys(prev => [newKey, ...prev]);
      toast({
        title: 'تم إنشاء مفتاح API',
        description: 'تم إنشاء مفتاح API الجديد بنجاح',
      });
      return newKey;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createApiKey');
      throw error;
    }
  }, [errorHandler, toast]);

  const revokeApiKey = useCallback(async (id: string) => {
    try {
      setApiKeys(prev => prev.map(key => 
        key.id === id ? { ...key, status: 'revoked' as const } : key
      ));
      toast({
        title: 'تم إلغاء مفتاح API',
        description: 'تم إلغاء مفتاح API بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'revokeApiKey');
      throw error;
    }
  }, [errorHandler, toast]);

  const toggleEndpoint = useCallback(async (id: string) => {
    try {
      const endpoint = endpoints.find(e => e.id === id);
      if (endpoint) {
        const newStatus = endpoint.status === 'active' ? 'inactive' : 'active';
        await updateEndpoint(id, { status: newStatus });
      }
    } catch (error) {
      errorHandler.handleError(error as Error, 'toggleEndpoint');
      throw error;
    }
  }, [endpoints, updateEndpoint, errorHandler, toast]);

  return {
    endpoints,
    apiKeys,
    metrics,
    loading,
    refreshApiData,
    createEndpoint,
    updateEndpoint,
    createApiKey,
    revokeApiKey,
    toggleEndpoint,
  };
};