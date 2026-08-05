/**
 * Set up a fresh Supabase project for ONYX (separate from BROKER/Velion).
 *
 * Prerequisites:
 *   1. Log into your OTHER Supabase account at https://supabase.com/dashboard
 *   2. Create a new project (e.g. name: "ONYX Exchange")
 *   3. Create an access token: https://supabase.com/dashboard/account/tokens
 *
 * Usage:
 *   set SUPABASE_ACCESS_TOKEN=your_token
 *   set PROJECT_REF=your_new_project_ref
 *   node scripts/setup-new-supabase.mjs
 *
 * Or link via CLI:
 *   npx supabase login
 *   npx supabase link --project-ref YOUR_PROJECT_REF
 *   npx supabase db push
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const migrationsDir = resolve(root, "supabase/migrations");
const API = "https://api.supabase.com/v1";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.PROJECT_REF;

if (!token || !projectRef) {
  console.error(`
ONYX — New Supabase setup
=========================

This script applies all migrations to a NEW Supabase project
(in your other account — not the BROKER backend).

Step 1 — Create the project manually
  • Open https://supabase.com/dashboard (your other account)
  • New project → name it "ONYX Exchange" (or similar)
  • Copy the project ref from Settings → General (e.g. abcdefghijklmnop)

Step 2 — Create a personal access token
  • https://supabase.com/dashboard/account/tokens

Step 3 — Run this script
  PowerShell:
    $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
    $env:PROJECT_REF = "your_new_project_ref"
    node scripts/setup-new-supabase.mjs

  Or use Supabase CLI instead:
    npx supabase login
    npx supabase link --project-ref YOUR_PROJECT_REF
    npx supabase db push

Step 4 — Update ONYX env
  Copy Project URL + anon key from Dashboard → Settings → API
  into .env.local and Vercel environment variables.
`);
  process.exit(1);
}

async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(data?.message ?? text ?? res.statusText);
  }
  return data;
}

async function runSql(query) {
  return api(`/projects/${projectRef}/database/query`, {
    method: "POST",
    body: { query },
  });
}

function migrationFiles() {
  return readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function main() {
  const project = await api(`/projects/${projectRef}`);
  console.log(`Linked project: ${project.name} (${projectRef})`);
  console.log(`URL: https://${projectRef}.supabase.co\n`);

  const files = migrationFiles();
  console.log(`Applying ${files.length} migrations...\n`);

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`  ${file} ... `);
    try {
      await runSql(sql);
      console.log("ok");
    } catch (err) {
      console.log("FAILED");
      console.error(`\nMigration failed: ${file}\n${err.message}`);
      process.exit(1);
    }
  }

  const keys = await api(`/projects/${projectRef}/api-keys`);
  const anon = keys.find((k) => k.name === "anon")?.api_key ?? keys[0]?.api_key;

  const envBlock = `# ONYX Exchange — new Supabase project (${projectRef})
NEXT_PUBLIC_SUPABASE_URL=https://${projectRef}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}
NEXT_PUBLIC_APP_NAME=ONYX
NEXT_PUBLIC_APP_URL=https://meridian-markets-kohl.vercel.app
`;

  const envPath = resolve(root, ".env.local");
  writeFileSync(envPath, envBlock, "utf8");

  console.log(`
Done! Migrations applied.

.env.local updated with new credentials.

Next:
  1. In Supabase → Authentication → URL Configuration, add:
     Site URL: https://meridian-markets-kohl.vercel.app
     Redirect URLs: http://localhost:3000/**, https://meridian-markets-kohl.vercel.app/**
  2. Update the same env vars on Vercel (Production)
  3. npm run dev — test register/login
  4. git push + vercel deploy --prod
`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
