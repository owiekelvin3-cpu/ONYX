/**
 * Push server-only env vars from .env.local to Vercel (Production + Preview).
 *
 * 1. Add keys to .env.local first (see .env.example)
 * 2. Run: npm run sync-vercel-env
 *
 * Requires: vercel CLI logged in, SUPABASE_SERVICE_ROLE_KEY + CRON_SECRET in .env.local
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const KEYS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET",
  "COINGECKO_API_KEY",
];

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("Missing .env.local — copy from .env.example and fill in values.");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function addToVercel(key, value, target) {
  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, target, "--value", value, "--sensitive", "--yes", "--force"],
    { cwd: root, stdio: "inherit", shell: true }
  );
  return result.status === 0;
}

const env = loadEnvLocal();
let ok = true;

for (const key of KEYS) {
  const value = env[key]?.trim();
  if (!value) {
    if (key === "COINGECKO_API_KEY") continue;
    console.error(`Missing ${key} in .env.local`);
    ok = false;
    continue;
  }
  console.log(`Adding ${key} to Vercel (production + preview)...`);
  if (!addToVercel(key, value, "production")) ok = false;
  if (!addToVercel(key, value, "preview")) ok = false;
}

if (!ok) {
  console.error("\nSome variables failed. Run `npx vercel login` and retry.");
  process.exit(1);
}

console.log("\nDone. Redeploy production for changes to take effect:");
console.log("  npx vercel deploy --prod --yes");
