/**
 * Centralized Analytics Service
 * Single source of truth for all analytics and metrics data
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface AnalyticsFilters {
  timeframe?: '7d' | '30d' | '90d' | '1y';
  userRole?: string;
  department?: string;
  sector?: string;
}

export interface CoreMetrics {
  users: {
    total: number;
    active: number;
    new: number;
    growthRate: number;
  };
  challenges: {
    total: number;
    active: number;
    completed: number;
    submissions: number;
    completionRate: number;
  };
  engagement: {
    avgSessionDuration: number;
    pageViews: number;
    interactions: number;
    returnRate: number;
  };
  business: {
    implementedIdeas: number;
    budgetUtilized: number;
    partnershipValue: number;
    roi: number;
  };
}

export interface SecurityMetrics {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  threatCount: number;
  suspiciousActivities: number;
  rateLimitViolations: number;
  failedLogins: number;
}

export interface RoleBasedMetrics {
  userSpecific: Record<string, any>;
  roleSpecific: Record<string, any>;
  departmentSpecific: Record<string, any>;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Check if user has permission to access specific metrics
   */
  private async hasMetricsAccess(userId: string, metricsType: string): Promise<boolean> {
    try {
      // Check admin access for sensitive metrics
      if (metricsType === 'security' || metricsType === 'admin') {
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin'
        });
        return !!isAdmin;
      }

      // Check team member access for analytics
      if (metricsType === 'analytics' || metricsType === 'reporting') {
        const { data: isTeamMember } = await supabase
          .from('innovation_team_members')
          .select('id')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();
        
        if (isTeamMember) return true;

        // Fallback to admin check
        const { data: isAdmin } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin'
        });
        return !!isAdmin;
      }

      return true; // Basic metrics accessible to all authenticated users
    } catch (error) {
      logger.error('Error checking metrics access', { component: 'AnalyticsService', userId, type: metricsType }, error as Error);
      return false;
    }
  }

  /**
   * Get core platform metrics with RBAC
   */
  async getCoreMetrics(userId: string, filters: AnalyticsFilters = {}): Promise<CoreMetrics> {
    if (!await this.hasMetricsAccess(userId, 'basic')) {
      throw new Error('Access denied: Insufficient permissions for metrics');
    }

    const cacheKey = `core_metrics_${userId}_${JSON.stringify(filters)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const timeframe = filters.timeframe || '30d';
      const daysBack = this.parseDaysFromTimeframe(timeframe);
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

      // Use hook-based migration instead of direct supabase calls
      const analyticsService = (window as any).__ANALYTICS_SERVICE_HOOK__;
      if (analyticsService?.getCoreMetrics) {
        return await analyticsService.getCoreMetrics(timeframe);
      }
      
      // Temporary fallback - migrate to useAnalyticsService hook
      const [usersData, challengesData, submissionsData, participantsData] = await Promise.all([
        supabase.from('profiles').select('id, created_at'),
        supabase.from('challenges').select('id, status, created_at'),
        supabase.from('challenge_submissions').select('id, status, created_at'),
        supabase.from('challenge_participants').select('id, created_at')
      ]);

      const metrics: CoreMetrics = {
        users: {
          total: usersData.data?.length || 0,
          active: usersData.data?.filter(u => 
            new Date(u.created_at) >= startDate
          ).length || 0,
          new: usersData.data?.filter(u => 
            new Date(u.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length || 0,
          growthRate: this.calculateGrowthRate(usersData.data || [], daysBack)
        },
        challenges: {
          total: challengesData.data?.length || 0,
          active: challengesData.data?.filter(c => c.status === 'active').length || 0,
          completed: challengesData.data?.filter(c => c.status === 'completed').length || 0,
          submissions: submissionsData.data?.length || 0,
          completionRate: this.calculateCompletionRate(challengesData.data || [])
        },
        engagement: {
          avgSessionDuration: 0, // Would need session tracking
          pageViews: 0, // Would need analytics events
          interactions: participantsData.data?.length || 0,
          returnRate: 0 // Would need user activity tracking
        },
        business: {
          implementedIdeas: submissionsData.data?.filter(s => s.status === 'implemented').length || 0,
          budgetUtilized: 0, // Would need budget tracking
          partnershipValue: 0, // Would need partnership value tracking
          roi: 0 // Would need ROI calculation
        }
      };

      this.setCache(cacheKey, metrics);
      
      // Track metrics access
      await this.trackMetricsAccess(userId, 'core_metrics', filters);
      
      return metrics;
    } catch (error) {
      logger.error('Error fetching core metrics', { component: 'AnalyticsService', userId }, error as Error);
      throw error;
    }
  }

  /**
   * Get security metrics (admin only)
   */
  async getSecurityMetrics(userId: string): Promise<SecurityMetrics> {
    if (!await this.hasMetricsAccess(userId, 'security')) {
      throw new Error('Access denied: Admin privileges required for security metrics');
    }

    const cacheKey = `security_metrics_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Use hook-based migration instead of direct supabase calls
      const analyticsService = (window as any).__ANALYTICS_SERVICE_HOOK__;
      if (analyticsService?.getSecurityMetrics) {
        return await analyticsService.getSecurityMetrics(userId);
      }
      
      // Temporary fallback - migrate to useAnalyticsService hook
      const [rateLimits, suspiciousActivities, auditLogs] = await Promise.all([
        supabase.from('rate_limits').select('*'),
        supabase.from('suspicious_activities').select('*'),
        supabase.from('security_audit_log').select('*').gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const metrics: SecurityMetrics = {
        riskLevel: this.calculateRiskLevel(suspiciousActivities.data || []),
        threatCount: suspiciousActivities.data?.filter(a => a.severity === 'high').length || 0,
        suspiciousActivities: suspiciousActivities.data?.length || 0,
        rateLimitViolations: rateLimits.data?.filter(r => r.request_count > 100).length || 0,
        failedLogins: auditLogs.data?.filter(l => l.action_type === 'FAILED_LOGIN').length || 0
      };

      this.setCache(cacheKey, metrics);
      await this.trackMetricsAccess(userId, 'security_metrics');
      
      return metrics;
    } catch (error) {
      logger.error('Error fetching security metrics', { userId }, error as Error);
      throw error;
    }
  }

  /**
   * Get role-based filtered metrics
   */
  async getRoleBasedMetrics(userId: string, userRole: string, filters: AnalyticsFilters = {}): Promise<RoleBasedMetrics> {
    try {
      const baseMetrics = await this.getCoreMetrics(userId, filters);
      
      // Apply role-based filtering and calculations
      const roleSpecific = await this.calculateRoleSpecificMetrics(userId, userRole, baseMetrics);
      const departmentSpecific = await this.calculateDepartmentSpecificMetrics(userId, filters.department);
      const userSpecific = await this.calculateUserSpecificMetrics(userId);

      return {
        userSpecific,
        roleSpecific,
        departmentSpecific
      };
    } catch (error) {
      logger.error('Error fetching role-based metrics', { component: 'AnalyticsService', userId }, error as Error);
      throw error;
    }
  }

  // Helper methods
  private parseDaysFromTimeframe(timeframe: string): number {
    switch (timeframe) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }

  private calculateGrowthRate(data: any[], daysBack: number): number {
    if (!data.length) return 0;
    const halfwayPoint = new Date(Date.now() - (daysBack / 2) * 24 * 60 * 60 * 1000);
    const firstHalf = data.filter(d => new Date(d.created_at) < halfwayPoint).length;
    const secondHalf = data.filter(d => new Date(d.created_at) >= halfwayPoint).length;
    return firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
  }

  private calculateCompletionRate(challenges: any[]): number {
    if (!challenges.length) return 0;
    const completed = challenges.filter(c => c.status === 'completed').length;
    return (completed / challenges.length) * 100;
  }

  private calculateRiskLevel(activities: any[]): 'low' | 'medium' | 'high' | 'critical' {
    const highSeverity = activities.filter(a => a.severity === 'high').length;
    if (highSeverity >= 5) return 'critical';
    if (highSeverity >= 3) return 'high';
    if (highSeverity >= 1) return 'medium';
    return 'low';
  }

  private async calculateRoleSpecificMetrics(userId: string, userRole: string, baseMetrics: CoreMetrics): Promise<Record<string, any>> {
    // Implementation depends on specific role requirements
    return {};
  }

  private async calculateDepartmentSpecificMetrics(userId: string, department?: string): Promise<Record<string, any>> {
    // Implementation for department-specific metrics
    return {};
  }

  private async calculateUserSpecificMetrics(userId: string): Promise<Record<string, any>> {
    // Implementation for user-specific metrics
    return {};
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.CACHE_TTL
    });
  }

  private trackingCache = new Set<string>();

  private async trackMetricsAccess(userId: string, metricsType: string, filters?: any): Promise<void> {
    try {
      // Prevent duplicate tracking within same minute
      const trackingKey = `${userId}-${metricsType}-${Math.floor(Date.now() / 60000)}`;
      if (this.trackingCache.has(trackingKey)) {
        return; // Already tracked this metric for this user in this minute
      }

      await supabase.from('analytics_events').insert({
        user_id: userId,
        event_type: 'metrics_access',
        event_category: 'analytics',
        properties: {
          metrics_type: metricsType,
          filters,
          timestamp: new Date().toISOString()
        }
      });

      // Add to cache and cleanup old entries
      this.trackingCache.add(trackingKey);
      import('@/utils/timerManager').then(({ default: timerManager }) => {
        timerManager.setTimeout(`analytics-cache-${trackingKey}`, () => this.trackingCache.delete(trackingKey), 60000);
      });
    } catch (error) {
      // Don't throw on tracking errors
      logger.warn('Failed to track metrics access', { component: 'AnalyticsService', userId, type: metricsType });
    }
  }

  /**
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const analyticsService = AnalyticsService.getInstance();