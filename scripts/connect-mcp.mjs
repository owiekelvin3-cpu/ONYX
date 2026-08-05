/**
 * Reconnect Cursor Supabase MCP to your kelvinlucky026 (or other) account.
 *
 * Usage:
 *   node scripts/connect-mcp.mjs <access-token> <project-ref>
 *
 * Get token (while logged in as kelvinlucky026@gmail.com):
 *   https://supabase.com/dashboard/account/tokens
 *
 * Get project ref:
 *   Project → Settings → General → Reference ID
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const token = process.argv[2]?.trim();
const projectRef = process.argv[3]?.trim();

const globalMcpPath = resolve(homedir(), ".cursor", "mcp.json");
const projectMcpPath = resolve(root, ".cursor", "mcp.json");

if (!token || !projectRef) {
  console.error(`
Reconnect Supabase MCP for ONYX
================================

MCP is currently linked to the OLD BROKER project (lcqzpvhiuaynqxarzvsk).
To use your kelvinlucky026@gmail.com account:

1. Log in at https://supabase.com/dashboard as kelvinlucky026@gmail.com
2. Create a project (e.g. "ONYX Exchange") if needed
3. Create token: https://supabase.com/dashboard/account/tokens
4. Copy project ref from Settings → General

Then run:
  node scripts/connect-mcp.mjs sbp_your_token your_project_ref

Reload Cursor after: Ctrl+Shift+P → Developer: Reload Window
`);
  process.exit(1);
}

async function verify(token, projectRef) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message ?? `Could not access project ${projectRef}`);
  }
  return data;
}

function buildMcpConfig(projectRef, token) {
  return {
    mcpServers: {
      supabase: {
        command: "cmd",
        args: [
          "/c",
          "npx",
          "-y",
          "-p",
          "@supabase/mcp-server-supabase@latest",
          "-p",
          "openapi-fetch",
          "mcp-server-supabase",
          `--project-ref=${projectRef}`,
        ],
        env: {
          SUPABASE_ACCESS_TOKEN: token,
        },
      },
    },
  };
}

const mcp = buildMcpConfig(projectRef, token);

mkdirSync(dirname(globalMcpPath), { recursive: true });
writeFileSync(globalMcpPath, JSON.stringify(mcp, null, 2) + "\n", "utf8");

mkdirSync(dirname(projectMcpPath), { recursive: true });
writeFileSync(projectMcpPath, JSON.stringify(mcp, null, 2) + "\n", "utf8");

const project = await verify(token, projectRef);
console.log(`MCP updated for: ${project.name} (${projectRef})`);
console.log(`URL: https://${projectRef}.supabase.co`);
console.log(`Config: ${globalMcpPath}`);
console.log("\nNext:");
console.log("  1. Reload Cursor (Ctrl+Shift+P → Developer: Reload Window)");
console.log("  2. npm run setup-supabase  (applies ONYX migrations)");
console.log("  3. Update Vercel env vars");
