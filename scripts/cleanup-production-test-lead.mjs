import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const evidenceDir = 'evidence/ontario-accident-review-wave-1r-production-verification/raw';
const outPath = `${evidenceDir}/production-intake-cleanup.json`;
const testPath = `${evidenceDir}/production-intake-test-redacted.json`;

function loadDotEnv(path) {
  try {
    const text = readFileSync(path, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!m) continue;
      let value = m[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = value;
    }
  } catch {}
}
loadDotEnv('.env.production.local');
loadDotEnv('.env.local');

const test = JSON.parse(await readFile(testPath, 'utf8'));
const id = test.fullSubmissionIdForCleanup;
if (!id) throw new Error('No submission id available for cleanup');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const table = process.env.SUPABASE_INTAKE_TABLE || 'intake_submissions';
if (!url || !key) {
  const result = { cleanupStatus: 'unproven_no_local_supabase_env', idRedacted: `${id.slice(0, 8)}…${id.slice(-4)}`, table };
  await writeFile(outPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  process.exit(2);
}
const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const before = await supabase.from(table).select('id,status,email,full_name').eq('id', id).maybeSingle();
let cleanupStatus = 'not_found_before_cleanup';
let deleteError = null;
if (before.data) {
  const del = await supabase.from(table).delete().eq('id', id);
  deleteError = del.error?.message || null;
  cleanupStatus = del.error ? 'delete_failed' : 'deleted';
}
const after = await supabase.from(table).select('id').eq('id', id).maybeSingle();
const result = {
  cleanupStatus,
  idRedacted: `${id.slice(0, 8)}…${id.slice(-4)}`,
  table,
  existedBeforeCleanup: Boolean(before.data),
  deleteError,
  existsAfterCleanup: Boolean(after.data),
};
await writeFile(outPath, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (deleteError || after.data) process.exit(1);
