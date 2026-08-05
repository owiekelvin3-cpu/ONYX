const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const isProd =
  process.env.VERCEL === "1" ||
  process.env.NODE_ENV === "production";

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  console.error("Missing required environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(isProd ? 1 : 0);
}

if (isProd && !process.env.NEXT_PUBLIC_APP_URL?.trim()) {
  console.warn(
    "Warning: NEXT_PUBLIC_APP_URL is not set. Canonical URLs may fall back to VERCEL_URL."
  );
}

console.log("Environment validation passed.");
