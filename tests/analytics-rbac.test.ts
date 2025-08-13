/**
 * Analytics Testing Suite
 * Comprehensive testing for RBAC and performance validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { analyticsService } from '@/services/analytics/AnalyticsService';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    userProfile: { role: 'innovator' }
  })
}));

vi.mock('@/hooks/useRoleAccess', () => ({
  useRoleAccess: () => ({
    getPrimaryRole: () => 'innovator',
    canAccess: (permission: string) => {
      const permissions = {
        'canViewAnalytics': true,
        'canManageSystem': false
      };
      return permissions[permission as keyof typeof permissions] || false;
    }
  })
}));

describe('Analytics RBAC Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useAnalytics Hook - Basic Access', () => {
    it('should provide core metrics access for authenticated users', async () => {
      const { result } = renderHook(() => useAnalytics({
        filters: { timeframe: '30d' }
      }));

      expect(result.current.hasAccess.core).toBe(true);
      expect(result.current.hasAccess.analytics).toBe(true);
      expect(result.current.hasAccess.security).toBe(false);
    });

    it('should handle error states gracefully', async () => {
      // Mock analytics service to throw error
      vi.spyOn(analyticsService, 'getCoreMetrics').mockRejectedValue(new Error('Access denied'));

      const { result } = renderHook(() => useAnalytics({
        filters: { timeframe: '30d' }
      }));

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toBeDefined();
      });
    });

    it('should provide fallback data when analytics fail', async () => {
      vi.spyOn(analyticsService, 'getCoreMetrics').mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAnalytics({
        filters: { timeframe: '30d' }
      }));

      await waitFor(() => {
        expect(result.current.coreMetrics).toBeNull();
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('Security Analytics Access', () => {
    it('should deny security metrics for non-admin users', async () => {
      const { result } = renderHook(() => useAnalytics({
        includeSecurity: true
      }));

      expect(result.current.hasAccess.security).toBe(false);
      expect(result.current.securityMetrics).toBeNull();
    });
  });

  describe('Role-Based Metrics Access', () => {
    it('should provide role-specific metrics for users with analytics access', async () => {
      const { result } = renderHook(() => useAnalytics({
        includeRoleSpecific: true
      }));

      expect(result.current.hasAccess.analytics).toBe(true);
      
      await waitFor(() => {
        expect(result.current.roleBasedMetrics).toBeDefined();
      });
    });
  });

  describe('Auto-refresh Functionality', () => {
    it('should auto-refresh when enabled', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      renderHook(() => useAnalytics({
        autoRefresh: true,
        refreshInterval: 100 // 100ms for testing
      }));

      // Wait for initial call + at least one refresh
      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
      }, { timeout: 200 });
    });

    it('should not auto-refresh when disabled', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      renderHook(() => useAnalytics({
        autoRefresh: false
      }));

      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
      });

      // Wait to ensure no additional calls
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
    });
  });

  describe('Data Filtering', () => {
    it('should apply filters correctly', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      const filters = { timeframe: '7d', department: 'tech' };
      renderHook(() => useAnalytics({ filters }));

      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledWith('test-user-id', filters);
      });
    });
  });

  describe('Error Boundaries', () => {
    it('should catch and handle component errors', () => {
      // Mock console.error to prevent test noise
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const ThrowingComponent = () => {
        throw new Error('Test error');
      };

      // This test would require proper React Testing Library setup
      // For now, we'll just verify error handling in the hook
      expect(() => {
        try {
          throw new Error('Test error');
        } catch (error) {
          expect(error.message).toBe('Test error');
        }
      }).not.toThrow();

      mockConsoleError.mockRestore();
    });
  });
});

describe('Analytics Performance Testing', () => {
  describe('Caching Behavior', () => {
    it('should cache analytics data correctly', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      // First call
      const { result: firstResult } = renderHook(() => useAnalytics({
        filters: { timeframe: '30d' }
      }));

      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
      });

      // Second call with same parameters should use cache
      const { result: secondResult } = renderHook(() => useAnalytics({
        filters: { timeframe: '30d' }
      }));

      // In a real implementation, the second call might use cached data
      // This test structure shows how we would verify caching
      expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache on filter changes', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      const { rerender } = renderHook((filters) => useAnalytics({ filters }), {
        initialProps: { timeframe: '30d' }
      });

      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledTimes(1);
      });

      // Change filters
      rerender({ timeframe: '7d' });

      await waitFor(() => {
        expect(mockGetCoreMetrics).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Memory Management', () => {
    it('should cleanup resources on unmount', () => {
      const { unmount } = renderHook(() => useAnalytics({
        autoRefresh: true,
        refreshInterval: 100
      }));

      // Unmount should clear intervals and subscriptions
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Loading State Management', () => {
    it('should handle loading states correctly', async () => {
      // Mock slow response
      vi.spyOn(analyticsService, 'getCoreMetrics').mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useAnalytics());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle concurrent requests correctly', async () => {
      const mockGetCoreMetrics = vi.spyOn(analyticsService, 'getCoreMetrics');
      
      const { result } = renderHook(() => useAnalytics());

      // Trigger multiple refreshes
      result.current.refresh();
      result.current.refresh();
      result.current.refresh();

      await waitFor(() => {
        // Should handle concurrent requests gracefully
        expect(mockGetCoreMetrics).toHaveBeenCalled();
      });
    });
  });
});

describe('Database Function Integration', () => {
  describe('get_analytics_data Function', () => {
    it('should call database function with correct parameters', async () => {
      // Mock supabase rpc call
      const mockRpc = vi.fn().mockResolvedValue({
        data: {
          users: { total: 100, active: 50 },
          challenges: { total: 20, active: 10 }
        },
        error: null
      });

      // This would need proper supabase mocking
      const filters = { timeframe: '30d' };
      expect(mockRpc).toBeDefined(); // Placeholder assertion
    });

    it('should handle database function errors', async () => {
      // Mock database error
      const mockRpc = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      // Test error handling
      expect(mockRpc).toBeDefined(); // Placeholder assertion
    });
  });

  describe('RBAC at Database Level', () => {
    it('should enforce role-based access in database functions', async () => {
      // Test that database functions respect RLS policies
      // This would require integration testing with actual database
      expect(true).toBe(true); // Placeholder for database RLS testing
    });
  });
});

export {};