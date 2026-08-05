/**
 * Create the first ONYX admin user.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (Dashboard → Settings → API → service_role)
 *
 * Usage:
 *   set SUPABASE_SERVICE_ROLE_KEY=sbp_...
 *   npm run create-admin
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@onyx.exchange";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Onyx@Admin2026!";
const ADMIN_NAME = process.env.ADMIN_NAME || "ONYX Admin";

if (!url || !serviceKey) {
  console.error(`
Missing credentials. Add to .env.local:
  NEXT_PUBLIC_SUPABASE_URL=...
  SUPABASE_SERVICE_ROLE_KEY=...   (service_role key from Supabase Dashboard)
`);
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`Creating admin: ${ADMIN_EMAIL}`);

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("email", ADMIN_EMAIL)
    .maybeSingle();

  if (existing) {
    if (existing.role !== "admin") {
      await supabase.from("profiles").update({ role: "admin", full_name: ADMIN_NAME }).eq("id", existing.id);
      console.log("Existing user promoted to admin.");
    } else {
      console.log("Admin already exists.");
    }
  } else {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    });
    if (error) throw error;

    await supabase
      .from("profiles")
      .update({ role: "admin", full_name: ADMIN_NAME, email: ADMIN_EMAIL })
      .eq("id", created.user.id);
    console.log("Admin user created.");
  }

  console.log(`
Login at: /admin/login
Email:    ${ADMIN_EMAIL}
Password: ${ADMIN_PASSWORD}

Change the password after your first sign-in.
`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
