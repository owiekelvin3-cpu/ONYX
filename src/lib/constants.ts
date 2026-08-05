export const BRAND = {
  name: "ONYX",
  fullName: "Onyx Exchange",
  tagline: "Markets move fast. Your exchange shouldn't slow you down.",
  description:
    "Trade crypto, stocks, and forex from one dashboard — live prices, clear fees, no clutter.",
  domain: "onyx.exchange",
} as const;

export const NAV = {
  BuyCrypto: ["Express Buy", "P2P Trading", "Convert"],
  Markets: ["Spot", "Futures", "Options", "Stocks", "Forex"],
  Trade: ["Spot Trading", "Margin", "Futures", "Copy Trading"],
  Earn: ["Staking", "Savings", "Dual Investment", "Launchpool"],
  More: ["API", "Institutional", "Affiliate", "Referral"],
} as const;

export const FOOTER = {
  About: ["About Us", "Careers", "Press", "Blog", "Community"],
  Products: ["Exchange", "Futures", "Copy Trading", "Earn", "Institutional"],
  Service: ["Fees", "Trading Rules", "API Documentation"],
  Support: ["Help Center", "Submit a Request", "Law Enforcement", "Bug Bounty"],
  Legal: ["Terms of Use", "Privacy", "Cookie Preferences"],
} as const;

export const PRODUCTS = [
  {
    title: "Spot Trading",
    desc: "Market and limit orders with a book that updates in real time. 0.10% fees, shown upfront.",
    cta: "Open trade desk",
    href: "/dashboard/trade",
  },
  {
    title: "Futures",
    desc: "Perpetuals and contracts when you want more than spot — with the same clean interface.",
    cta: "View futures",
    href: "/dashboard/trade",
  },
  {
    title: "Copy Trading",
    desc: "Pick a trader, set how much to allocate, and mirror their moves. Pause or stop anytime.",
    cta: "Browse traders",
    href: "/dashboard/copy-trading",
  },
  {
    title: "AI Bots",
    desc: "Define your rules once and let automation handle the repetitive entries and exits.",
    cta: "See strategies",
    href: "/dashboard/ai-trading",
  },
] as const;

export const PLATFORM_HIGHLIGHTS = [
  {
    title: "Secure by default",
    desc: "Two-factor auth, encrypted sessions, and account alerts.",
  },
  {
    title: "Fees you can read",
    desc: "0.10% spot trading. What you see is what you pay.",
  },
  {
    title: "One dashboard",
    desc: "Crypto, stocks, and forex without switching platforms.",
  },
  {
    title: "Markets stay open",
    desc: "Place orders any time — weekends and holidays included.",
  },
] as const;

export const STEPS = [
  { step: "01", title: "Sign up", desc: "Email, password, done — no lengthy forms." },
  { step: "02", title: "Verify", desc: "Quick KYC so withdrawals stay secure." },
  { step: "03", title: "Fund & trade", desc: "Deposit crypto and place your first order." },
] as const;
