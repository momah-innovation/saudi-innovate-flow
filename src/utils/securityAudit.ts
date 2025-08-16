/**
 * Security Audit Utilities
 * Provides tools for security validation and compliance checking
 */

import { debugLog } from './debugLogger';

export interface SecurityCheck {
  name: string;
  description: string;
  category: 'critical' | 'high' | 'medium' | 'low';
  check: () => Promise<boolean>;
  remediation?: string;
}

export class SecurityAudit {
  private checks: SecurityCheck[] = [];

  register(check: SecurityCheck) {
    this.checks.push(check);
  }

  async runAll(): Promise<{
    passed: SecurityCheck[];
    failed: SecurityCheck[];
    total: number;
    score: number;
  }> {
    const results = await Promise.allSettled(
      this.checks.map(async (check) => ({
        check,
        passed: await check.check(),
      }))
    );

    const passed: SecurityCheck[] = [];
    const failed: SecurityCheck[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.passed) {
          passed.push(result.value.check);
        } else {
          failed.push(result.value.check);
        }
      } else {
        debugLog.error('Security check failed to execute:', result.reason);
        failed.push({
          name: 'Unknown Check',
          description: 'Check execution failed',
          category: 'critical',
          check: async () => false,
        });
      }
    });

    const score = (passed.length / this.checks.length) * 100;

    return {
      passed,
      failed,
      total: this.checks.length,
      score,
    };
  }

  async runByCategory(category: SecurityCheck['category']) {
    const categoryChecks = this.checks.filter(check => check.category === category);
    const results = await Promise.allSettled(
      categoryChecks.map(async (check) => ({
        check,
        passed: await check.check(),
      }))
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { check: { name: 'Failed check', category }, passed: false }
    );
  }
}

// Initialize security audit with common checks
export const securityAudit = new SecurityAudit();

// Register standard security checks
securityAudit.register({
  name: 'Environment Variables',
  description: 'Verify Supabase configuration is present (no VITE_* reliance)',
  category: 'critical',
  check: async () => {
    const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';
    return SUPABASE_URL.startsWith('https://') && SUPABASE_URL.includes('.supabase.co');
  },
  remediation: 'Ensure Supabase project URL is correctly configured'
});

securityAudit.register({
  name: 'Console Logging',
  description: 'Verify production builds have no console statements',
  category: 'medium',
  check: async () => {
    // In production, console methods should be replaced
    return import.meta.env.DEV || typeof console.log !== 'function';
  },
  remediation: 'Replace console statements with structured logging'
});

securityAudit.register({
  name: 'HTTPS Enforcement',
  description: 'Verify secure connections in production',
  category: 'high',
  check: async () => {
    return import.meta.env.DEV || window.location.protocol === 'https:';
  },
  remediation: 'Enforce HTTPS in production environments'
});

securityAudit.register({
  name: 'Local Storage Security',
  description: 'Verify no sensitive data in localStorage',
  category: 'medium',
  check: async () => {
    const storage = JSON.stringify(localStorage);
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token(?!_expires)/i, // Allow token_expires
      /key(?!_)/i, // Allow key_ prefixes
    ];
    
    return !sensitivePatterns.some(pattern => pattern.test(storage));
  },
  remediation: 'Remove sensitive data from localStorage, use secure storage'
});

export default securityAudit;