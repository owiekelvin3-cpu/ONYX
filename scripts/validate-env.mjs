const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const recommendedProd = [
  "NEXT_PUBLIC_APP_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET",
];

const optional = ["COINGECKO_API_KEY", "NEXT_PUBLIC_APP_NAME"];

const isProd =
  process.env.VERCEL === "1" ||
  process.env.NODE_ENV === "production";

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(isProd ? 1 : 0);
}

const missingRecommended = recommendedProd.filter((key) => !process.env[key]?.trim());
if (missingRecommended.length > 0) {
  const msg = missingRecommended.map((key) => `  - ${key}`).join("\n");
  if (isProd) {
    console.error("Missing recommended production variables (add in Vercel → Settings → Environment Variables):");
    console.error(msg);
    process.exit(1);
  }
  console.warn("Warning: missing server env vars (needed on Vercel for meme coins + cron):");
  console.warn(msg);
}

const missingOptional = optional.filter((key) => !process.env[key]?.trim());
if (missingOptional.length > 0 && isProd) {
  console.warn("Optional env vars not set:", missingOptional.join(", "));
}

console.log("Environment validation passed.");
