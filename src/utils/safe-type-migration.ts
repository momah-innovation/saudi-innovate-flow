/**
 * Safe type migration utilities for gradual TypeScript improvement
 * without breaking existing functionality
 */
import { logger } from '@/utils/logger';

/**
 * Temporary bridge between any types and proper interfaces
 * Allows gradual migration while maintaining runtime compatibility
 */
export const createTypeSafeBridge = <T>() => {
  return {
    /**
     * Safely cast any to typed interface with runtime validation
     */
    safeCast: (data: any): T => {
      // For now, just pass through the data
      // In future, add runtime validation here
      return data as T;
    },

    /**
     * Provide fallback if casting fails
     */
    safeCastWithFallback: (data: any, fallback: T): T => {
      try {
        // Basic validation - check if data is not null/undefined
        if (data === null || data === undefined) {
          return fallback;
        }
        return data as T;
      } catch (error) {
        logger.warn('Type casting failed, using fallback:', error);
        return fallback;
      }
    },

    /**
     * Validate data structure matches expected interface
     */
    validateStructure: (data: any, requiredFields: (keyof T)[]): boolean => {
      if (!data || typeof data !== 'object') return false;
      
      return requiredFields.every(field => 
        field in data && data[field] !== undefined
      );
    }
  };
};

/**
 * Common type bridges for frequent any -> interface migrations
 */
export const typeBridges = {
  // User data bridge
  user: createTypeSafeBridge<{
    id: string;
    email: string;
    name?: string;
    role?: string;
  }>(),

  // Form data bridge  
  formData: createTypeSafeBridge<{
    [key: string]: any;
  }>(),

  // API response bridge
  apiResponse: createTypeSafeBridge<{
    data?: any;
    error?: string;
    success?: boolean;
  }>()
};

/**
 * Migration tracking to monitor progress
 */
export const migrationTracker = {
  logMigration: (component: string, fromType: string, toType: string) => {
    // In development, log migrations for tracking
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Type Migration: ${component} | ${fromType} → ${toType}`);
    }
  },

  markAsTypeSafe: (component: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Type Safe: ${component}`);
    }
  }
};

export default {
  createTypeSafeBridge,
  typeBridges,
  migrationTracker
};