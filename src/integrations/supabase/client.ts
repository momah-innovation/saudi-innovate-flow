import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { logger } from '@/utils/logger';
// Use Vite env in browser; fall back to process for SSR/tools
const nodeEnv = (globalThis as any)?.process?.env || {};
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL ?? nodeEnv.SUPABASE_URL ?? 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY ?? nodeEnv.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  import('@/utils/debugLogger').then(({ debugLog }) => {
    debugLog.warn('[supabase] Missing SUPABASE_URL or anon key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  });
}

// Instrumented fetch to log Supabase requests
const instrumentedFetch: typeof fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const start = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  const toUrl = (i: any) => {
    try {
      if (typeof i === 'string') return i;
      if (i instanceof URL) return i.toString();
      if (i && typeof i === 'object' && 'url' in i) return (i as Request).url;
    } catch {}
    return String(i);
  };

  const url = toUrl(input);
  try {
    const res = await fetch(input as any, init);
    const duration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - start;
    if (url?.startsWith(SUPABASE_URL)) {
      logger.info('Supabase request', {
        component: 'Supabase',
        endpoint: url.replace(SUPABASE_URL, ''),
        responseTime: Math.round(duration),
        status: String(res.status),
      });
    }
    return res;
  } catch (error) {
    const duration = ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) - start;
    logger.error('Supabase request error', {
      component: 'Supabase',
      endpoint: url?.startsWith(SUPABASE_URL) ? url.replace(SUPABASE_URL, '') : url,
      responseTime: Math.round(duration),
    }, error as Error);
    throw error;
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: instrumentedFetch,
  }
});