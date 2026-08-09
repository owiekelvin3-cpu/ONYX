/** Central route map — every nav/footer label resolves here */
export const SITE_ROUTES: Record<string, string> = {
  // Buy Crypto
  "Express Buy": "/register",
  "P2P Trading": "/register",
  Convert: "/register",

  // Markets
  Spot: "/markets",
  Futures: "/dashboard/trade",
  Options: "/dashboard/trade",
  Stocks: "/markets",
  Forex: "/markets",

  // Trade nav
  "Spot Trading": "/dashboard/trade",
  Margin: "/dashboard/trade",

  // Earn
  Staking: "/dashboard/ai-trading",
  Savings: "/dashboard/deposit",
  "Dual Investment": "/dashboard/ai-trading",
  Launchpool: "/register",

  // More
  API: "/help",
  Affiliate: "/register",
  Referral: "/register",
  Features: "/features",
  Pricing: "/fees",

  // Footer — About
  "About Us": "/about",
  Careers: "/about",
  Press: "/about",
  Blog: "/about",
  Community: "/community",

  // Footer — Products
  Exchange: "/products",
  "Copy Trading": "/dashboard/copy-trading",
  Earn: "/dashboard/ai-trading",
  Institutional: "/about",
  Products: "/products",
  Markets: "/markets",
  Trading: "/trading",

  // Footer — Service
  Fees: "/fees",
  "Trading Rules": "/fees",
  "API Documentation": "/help",

  // Footer — Support
  "Help Center": "/help",
  "Submit a Request": "/help",
  "Law Enforcement": "/help",
  "Bug Bounty": "/help",

  // Footer — Legal
  "Terms of Use": "/terms",
  Terms: "/terms",
  Privacy: "/privacy",
  "Privacy Policy": "/privacy",
  "Cookie Preferences": "/privacy",
};

export function siteRoute(label: string): string {
  return SITE_ROUTES[label] ?? "/help";
}

export const SITE_PAGES: Record<
  string,
  { title: string; description: string; content: string[] }
> = {
  about: {
    title: "About ONYX",
    description: "Learn about Onyx Exchange — our mission, team, and vision.",
    content: [
      "Onyx Exchange is a multi-asset trading platform for crypto, stocks, forex, and derivatives.",
      "We built ONYX to keep trading straightforward: clear fees, a single dashboard, and tools that work on desktop and mobile web.",
      "Security comes first — encrypted sessions, optional two-factor authentication, and careful handling of account data.",
      "We're a growing team focused on shipping useful features, listening to feedback, and improving the platform over time.",
    ],
  },
  help: {
    title: "Help Center",
    description: "Get support and find answers to common questions.",
    content: [
      "Welcome to the ONYX Help Center. Find answers to the most common questions below.",
      "Account & Registration: Create a free account at onyx.exchange/register. Verification (KYC) is required for withdrawals over $10,000.",
      "Deposits: Navigate to Dashboard → Deposit. Select your asset and send crypto to the displayed wallet address. Deposits typically confirm within 10–30 minutes after team approval.",
      "Trading: Go to Dashboard → Trade to access spot markets. Select a pair, enter amount, and click Buy or Sell.",
      "Withdrawals: Dashboard → Withdraw. Choose crypto wallet, bank transfer, international wire, or PayPal/e-wallet. Enter payout details and amount — our team processes requests within 1–5 business days depending on method.",
      "Security: Enable 2FA in Settings. Never share your password or API keys. ONYX will never ask for your credentials via email.",
      "Need more help? Open Dashboard → Support for live chat with our team, or email support@onyx.exchange — available 24/7.",
    ],
  },
  terms: {
    title: "Terms of Use",
    description:
      "The rules, rights, and responsibilities that govern your use of Onyx Exchange.",
    content: [
      "Last updated: August 2026",
      "See the full Terms of Use for eligibility, trading rules, risk disclosures, and legal contact information.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "How Onyx Exchange collects, uses, shares, and protects your personal information.",
    content: [
      "Last updated: August 2026",
      "See the full Privacy Policy for data collection, security measures, your rights, and cookie preferences.",
    ],
  },
  fees: {
    title: "Fees & Trading Rules",
    description: "Transparent fee schedule and trading rules.",
    content: [
      "Spot Trading Fees: Maker 0.10% | Taker 0.10%. VIP tiers available with reduced fees based on 30-day volume.",
      "Withdrawal Fees: Vary by asset. BTC ~0.0005 BTC | ETH ~0.005 ETH | USDT ~$1.00 network fee.",
      "Deposit Fees: Free for all crypto deposits.",
      "Minimum Trade: $10 USD equivalent.",
      "Minimum Withdrawal: $50 USD equivalent.",
      "Trading Rules: All orders are executed at market price for market orders. Limit orders execute when price reaches your specified level.",
      "Market manipulation, wash trading, and abusive order patterns are prohibited and may result in account suspension.",
    ],
  },
};

/** Slugs handled by [slug] dynamic route — used to avoid conflicts */
export const INFO_SLUGS = new Set(Object.keys(SITE_PAGES));
