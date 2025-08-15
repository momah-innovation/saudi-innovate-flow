import { supabase } from '@/integrations/supabase/client';
import { createErrorHandler } from './unified-error-handler';
import { logger } from './logger';

export interface APICallOptions {
  component: string;
  operation: string;
  showErrorToast?: boolean;
  logErrors?: boolean;
  retryCount?: number;
  timeout?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

class UnifiedAPIClient {
  private errorHandler;

  constructor() {
    this.errorHandler = createErrorHandler({
      component: 'APIClient',
      showToast: true,
      logError: true
    });
  }

  // Generic GET operation with simplified typing
  async get<T = any>(
    table: string,
    options: APICallOptions,
    filters?: FilterOptions,
    pagination?: PaginationOptions
  ): Promise<{ data: T[] | null; error: any; count?: number }> {
    try {
      let query = supabase.from(table as any).select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply pagination
      if (pagination) {
        const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to);

        if (sortBy) {
          query = query.order(sortBy, { ascending: sortOrder === 'asc' });
        }
      }

      const { data, error, count } = await query;

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { table, filters, pagination }
        });
        return { data: null, error, count: 0 };
      }

      return { data: data as T[], error: null, count: count || 0 };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { table, filters, pagination }
      });
      return { data: null, error, count: 0 };
    }
  }

  // Generic POST operation
  async create<T = any>(
    table: string,
    data: Partial<T>,
    options: APICallOptions
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from(table as any)
        .insert(data)
        .select()
        .single();

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { table, data }
        });
        return { data: null, error };
      }

      logger.info(`Successfully created record in ${table}`, {
        component: options.component,
        operation: options.operation
      });

      return { data: result as T, error: null };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { table, data }
      });
      return { data: null, error };
    }
  }

  // Generic PUT operation
  async update<T = any>(
    table: string,
    id: string,
    data: Partial<T>,
    options: APICallOptions
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data: result, error } = await supabase
        .from(table as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { table, id, data }
        });
        return { data: null, error };
      }

      logger.info(`Successfully updated record in ${table}`, {
        component: options.component,
        operation: options.operation
      });

      return { data: result as T, error: null };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { table, id, data }
      });
      return { data: null, error };
    }
  }

  // Generic DELETE operation
  async delete(
    table: string,
    id: string,
    options: APICallOptions
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id);

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { table, id }
        });
        return { success: false, error };
      }

      logger.info(`Successfully deleted record from ${table}`, {
        component: options.component,
        operation: options.operation
      });

      return { success: true, error: null };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { table, id }
      });
      return { success: false, error };
    }
  }

  // Get single record by ID
  async getById<T = any>(
    table: string,
    id: string,
    options: APICallOptions
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { table, id }
        });
        return { data: null, error };
      }

      return { data: data as T, error: null };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { table, id }
      });
      return { data: null, error };
    }
  }

  // Execute database function
  async executeFunction<T = any>(
    functionName: string,
    params: Record<string, any>,
    options: APICallOptions
  ): Promise<{ data: T | null; error: any }> {
    try {
      const { data, error } = await supabase.rpc(functionName as any, params);

      if (error) {
        this.errorHandler.handleError(error, {
          component: options.component,
          operation: options.operation,
          metadata: { functionName, params }
        });
        return { data: null, error };
      }

      return { data: data as T, error: null };
    } catch (error) {
      this.errorHandler.handleError(error, {
        component: options.component,
        operation: options.operation,
        metadata: { functionName, params }
      });
      return { data: null, error };
    }
  }
}

export const apiClient = new UnifiedAPIClient();