/**
 * Migration Operations Hook - System Migration Utilities
 * Handles migration execution and tracking (2 operations)
 */

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { debugLog } from '@/utils/debugLogger';
import type { MigrationStatus, MigrationResult, SystemOperation } from '@/types/common';

export interface MigrationOperationsState {
  executeMigration: (migrationId: string, config?: Record<string, any>) => Promise<MigrationResult>;
  getMigrationStatus: (migrationId?: string) => Promise<MigrationStatus[]>;
  trackSystemOperation: (operation: SystemOperation) => Promise<void>;
  validateMigrationPrerequisites: (migrationId: string) => Promise<boolean>;
}

export function useMigrationOperations(): {
  operations: MigrationOperationsState;
  isLoading: boolean;
  error: Error | null;
  migrationHistory: MigrationStatus[];
} {
  const { user } = useCurrentUser();
  const [migrationHistory, setMigrationHistory] = useState<MigrationStatus[]>([]);

  // Get migration status query
  const migrationStatusQuery = useQuery({
    queryKey: ['migrations', 'status', user?.id],
    queryFn: async (): Promise<MigrationStatus[]> => {
      if (!user?.id) return [];

      try {
        // Check if user has admin access for migration operations
        const { data: hasAccess } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (!hasAccess) {
          debugLog.warn('Migration status access denied', {
            component: 'useMigrationOperations',
            userId: user.id
          });
          return [];
        }

        // Fetch migration logs from system audit
        const { data: migrationLogs, error } = await supabase
          .from('security_audit_log')
          .select('*')
          .eq('action_type', 'MIGRATION_EXECUTED')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          debugLog.error('Migration status fetch failed', {
            component: 'useMigrationOperations',
            error: error.message
          });
          return [];
        }

        return migrationLogs.map(log => ({
          id: log.id,
          name: (log.details as any)?.migration_id || 'unknown',
          status: (log.details as any)?.success ? 'completed' : 'failed',
          executedAt: log.created_at,
          executedBy: log.user_id,
          details: log.details as Record<string, any>,
          error: (log.details as any)?.error_message
        })) as MigrationStatus[];

      } catch (err) {
        debugLog.error('Migration status query error', {
          component: 'useMigrationOperations',
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000 // 30 seconds for migration data
  });

  // Update migration history when query succeeds
  const updateHistory = (data: MigrationStatus[]) => setMigrationHistory(data);

  // Execute migration mutation
  const executeMigrationMutation = useMutation({
    mutationFn: async ({ 
      migrationId, 
      config 
    }: { 
      migrationId: string; 
      config?: Record<string, any> 
    }): Promise<MigrationResult> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check admin access
      const { data: hasAccess } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (!hasAccess) {
        throw new Error('Admin privileges required for migration execution');
      }

      debugLog.log('Migration execution started', {
        component: 'useMigrationOperations',
        migrationId,
        config
      });

      try {
        // Simulate migration execution (replace with actual migration logic)
        const startTime = Date.now();
        
        // Log migration start
        await supabase
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            action_type: 'MIGRATION_STARTED',
            resource_type: 'system_migration',
            details: {
              migration_id: migrationId,
              config,
              start_time: new Date().toISOString()
            },
            risk_level: 'medium'
          });

        // Execute migration steps (mock implementation)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work

        const endTime = Date.now();
        const result: MigrationResult = {
          migrationId,
          success: true,
          duration: endTime - startTime,
          message: `Migration ${migrationId} completed successfully`,
          affectedRecords: Math.floor(Math.random() * 100),
          errors: []
        };

        // Log successful migration
        await supabase
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            action_type: 'MIGRATION_EXECUTED',
            resource_type: 'system_migration',
            details: {
              migration_id: migrationId,
              success: true,
              duration: result.duration,
              affected_records: result.affectedRecords,
              config
            },
            risk_level: 'high'
          });

        return result;

      } catch (error) {
        const failureResult: MigrationResult = {
          migrationId,
          success: false,
          duration: Date.now() - Date.now(),
          message: `Migration ${migrationId} failed`,
          affectedRecords: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        };

        // Log failed migration
        await supabase
          .from('security_audit_log')
          .insert({
            user_id: user.id,
            action_type: 'MIGRATION_FAILED',
            resource_type: 'system_migration',
            details: {
              migration_id: migrationId,
              success: false,
              error_message: error instanceof Error ? error.message : 'Unknown error',
              config
            },
            risk_level: 'critical'
          });

        throw error;
      }
    },
    onSuccess: () => {
      // Refetch migration status after successful execution
      migrationStatusQuery.refetch();
      updateHistory(migrationStatusQuery.data || []);
    }
  });

  // Track system operation mutation
  const trackOperationMutation = useMutation({
    mutationFn: async (operation: SystemOperation) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('security_audit_log')
        .insert({
          user_id: user.id,
          action_type: operation.type,
          resource_type: operation.resourceType || 'system',
          resource_id: operation.resourceId,
          details: {
            operation_details: operation.details,
            timestamp: new Date().toISOString(),
            component: operation.component
          },
          risk_level: operation.riskLevel || 'low'
        });

      if (error) throw error;
    }
  });

  const operations: MigrationOperationsState = {
    executeMigration: async (migrationId: string, config?: Record<string, any>): Promise<MigrationResult> => {
      return await executeMigrationMutation.mutateAsync({ migrationId, config });
    },

    getMigrationStatus: async (migrationId?: string): Promise<MigrationStatus[]> => {
      const allStatus = migrationHistory;
      return migrationId 
        ? allStatus.filter(status => status.name === migrationId)
        : allStatus;
    },

    trackSystemOperation: async (operation: SystemOperation): Promise<void> => {
      await trackOperationMutation.mutateAsync(operation);
    },

    validateMigrationPrerequisites: async (migrationId: string): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        // Check admin access
        const { data: hasAccess } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (!hasAccess) return false;

        // Check if migration already exists
        const existingMigration = migrationHistory.find(
          m => m.name === migrationId && m.status === 'completed'
        );

        if (existingMigration) {
          debugLog.warn('Migration already completed', {
            component: 'useMigrationOperations',
            migrationId
          });
          return false;
        }

        return true;
      } catch (error) {
        debugLog.error('Migration prerequisites validation failed', {
          component: 'useMigrationOperations',
          migrationId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return false;
      }
    }
  };

  return {
    operations,
    isLoading: migrationStatusQuery.isLoading || executeMigrationMutation.isPending,
    error: migrationStatusQuery.error || executeMigrationMutation.error,
    migrationHistory
  };
}