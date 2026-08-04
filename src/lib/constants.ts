export const BRAND = {
  name: "ONYX",
  fullName: "Onyx Exchange",
  tagline: "Trade crypto, stocks & forex in one place",
  description:
    "A multi-asset exchange with clear fees, live charts, and the tools you need to buy, sell, and manage a portfolio.",
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
  { step: "01", title: "Create Account", desc: "Sign up with email in under 60 seconds." },
  { step: "02", title: "Verify Identity", desc: "Complete KYC to unlock full platform access." },
  { step: "03", title: "Fund & Trade", desc: "Deposit via crypto, card, or bank transfer." },
] as const;
