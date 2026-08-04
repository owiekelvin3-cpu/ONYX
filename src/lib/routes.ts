/** Central route map — every nav/footer label resolves here */
export const SITE_ROUTES: Record<string, string> = {
  // Buy Crypto
  "Express Buy": "/register",
  "P2P Trading": "/register",
  Convert: "/register",

  // Markets
  Spot: "/#markets",
  Futures: "/dashboard/trade",
  Options: "/dashboard/trade",
  Stocks: "/#markets",
  Forex: "/#markets",

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

  // Footer — About
  "About Us": "/about",
  Careers: "/about",
  Press: "/about",
  Blog: "/about",
  Community: "/about",

  // Footer — Products
  Exchange: "/dashboard/trade",
  "Copy Trading": "/dashboard/copy-trading",
  Earn: "/dashboard/ai-trading",
  Institutional: "/about",

  // Footer — Service
  Downloads: "/download",
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
      "Onyx Exchange is a global multi-asset trading platform serving over 12 million users across 180+ countries.",
      "We provide institutional-grade infrastructure for trading crypto, stocks, forex, and derivatives with deep liquidity and industry-leading security.",
      "Founded with the mission to make professional trading tools accessible to everyone, ONYX processes over $38 billion in daily trading volume.",
      "Our team consists of veterans from top financial institutions and leading technology companies, united by a commitment to transparency, security, and innovation.",
    ],
  },
  help: {
    title: "Help Center",
    description: "Get support and find answers to common questions.",
    content: [
      "Welcome to the ONYX Help Center. Find answers to the most common questions below.",
      "Account & Registration: Create a free account at onyx.exchange/register. Verification (KYC) is required for withdrawals over $10,000.",
      "Deposits: Navigate to Dashboard → Deposit. Select your asset and send crypto to the displayed wallet address. Deposits typically confirm within 10–30 minutes.",
      "Trading: Go to Dashboard → Trade to access spot markets. Select a pair, enter amount, and click Buy or Sell.",
      "Withdrawals: Dashboard → Withdraw. Enter your external wallet address and amount. Processing takes up to 24 hours.",
      "Security: Enable 2FA in Settings. Never share your password or API keys. ONYX will never ask for your credentials via email.",
      "Need more help? Email support@onyx.exchange — our team is available 24/7.",
    ],
  },
  terms: {
    title: "Terms of Use",
    description: "Terms and conditions for using Onyx Exchange.",
    content: [
      "Last updated: August 2026",
      "By accessing or using Onyx Exchange, you agree to be bound by these Terms of Use.",
      "You must be at least 18 years old and comply with all applicable laws in your jurisdiction to use our services.",
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
      "Trading digital assets involves substantial risk of loss. Past performance is not indicative of future results.",
      "ONYX reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
      "We may modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "How Onyx Exchange collects, uses, and protects your data.",
    content: [
      "Last updated: August 2026",
      "Onyx Exchange is committed to protecting your personal information.",
      "We collect information you provide during registration (name, email, phone) and usage data necessary to operate our services.",
      "Your data is encrypted in transit and at rest. We use industry-standard security measures including cold storage for digital assets.",
      "We do not sell your personal information to third parties.",
      "We may share data with regulatory authorities when required by law.",
      "You may request access to or deletion of your personal data by contacting privacy@onyx.exchange.",
      "Cookie Preferences: We use essential cookies for authentication and optional analytics cookies. You can manage preferences in your browser settings.",
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
  download: {
    title: "Download the ONYX App",
    description: "Trade on the go with the ONYX mobile app.",
    content: [
      "Take your trading anywhere with the ONYX mobile app for iOS and Android.",
      "Features: Full spot trading, portfolio management, price alerts, biometric login, and push notifications.",
      "Download on the App Store or Google Play — search for 'ONYX Exchange'.",
      "Scan the QR code on our homepage or visit your device's app store to get started.",
      "Minimum requirements: iOS 14+ or Android 8+.",
    ],
  },
};

/** Slugs handled by [slug] dynamic route — used to avoid conflicts */
export const INFO_SLUGS = new Set(Object.keys(SITE_PAGES));
