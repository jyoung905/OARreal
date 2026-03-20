import { createClient } from '@supabase/supabase-js';

let cachedClient;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseAdminClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = requireEnv('SUPABASE_URL');
  const supabaseServiceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return cachedClient;
}

export function getIntakeTableName() {
  return process.env.SUPABASE_INTAKE_TABLE || 'intake_submissions';
}
