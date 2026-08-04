export const BRAND = {
  name: "ONYX",
  fullName: "Onyx Exchange",
  tagline: "Buy, Trade & Hold 500+ Assets",
  description:
    "The world's leading multi-asset exchange. Trade crypto, stocks, forex, and derivatives with deep liquidity and institutional-grade infrastructure.",
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
  Service: ["Downloads", "Fees", "Trading Rules", "API Documentation"],
  Support: ["Help Center", "Submit a Request", "Law Enforcement", "Bug Bounty"],
  Legal: ["Terms of Use", "Privacy", "Risk Warning", "Cookie Preferences"],
} as const;

export const PRODUCTS = [
  {
    title: "Spot Trading",
    desc: "500+ trading pairs with industry-leading liquidity. Maker fees from 0.1%.",
    cta: "Trade Now",
    href: "/dashboard/trade",
  },
  {
    title: "Futures & Derivatives",
    desc: "Up to 125x leverage on crypto futures. Perpetual and quarterly contracts.",
    cta: "Explore Futures",
    href: "/dashboard/trade",
  },
  {
    title: "Copy Trading",
    desc: "Follow elite traders. Mirror strategies automatically with full transparency.",
    cta: "Start Copying",
    href: "/dashboard/copy-trading",
  },
  {
    title: "AI Trading Bots",
    desc: "Automated strategies powered by quantitative models. Set and forget.",
    cta: "View Bots",
    href: "/dashboard/ai-trading",
  },
] as const;

export const TRUST_ITEMS = [
  { value: "$38B+", label: "Daily Trading Volume" },
  { value: "12M+", label: "Registered Users" },
  { value: "500+", label: "Trading Pairs" },
  { value: "99.99%", label: "Platform Uptime" },
] as const;

export const STEPS = [
  { step: "01", title: "Create Account", desc: "Sign up with email in under 60 seconds." },
  { step: "02", title: "Verify Identity", desc: "Complete KYC to unlock full platform access." },
  { step: "03", title: "Fund & Trade", desc: "Deposit via crypto, card, or bank transfer." },
] as const;
