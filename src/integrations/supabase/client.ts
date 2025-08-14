import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use Vite env in browser; fall back to process for SSR/tools
const nodeEnv = (globalThis as any)?.process?.env || {};
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL ?? nodeEnv.SUPABASE_URL ?? 'https://jxpbiljkoibvqxzdkgod.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY ?? nodeEnv.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEzMDksImV4cCI6MjA2OTA0NzMwOX0.ls7b6Dh5Go0nQYP6Sjv1c_IxPXEv8MC5RQEpH91Z_V8';

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  import('@/utils/debugLogger').then(({ debugLog }) => {
    debugLog.warn('[supabase] Missing SUPABASE_URL or anon key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  });
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});