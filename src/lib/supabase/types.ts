/** Core Supabase table shapes used by the ONYX frontend */

export type TradeRow = {
  id: string;
  user_id: string;
  asset: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  status: string;
  profit?: number | null;
  created_at: string;
};

export type HoldingRow = {
  id: string;
  user_id: string;
  asset: string;
  quantity: number;
  updated_at: string;
};

export type BalanceRow = {
  id: string;
  user_id: string;
  currency: string;
  amount: number;
};

export type DepositRow = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  notes?: string | null;
  created_at: string;
};

export type WithdrawalRow = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: string;
  wallet_address?: string | null;
  status: string;
  notes?: string | null;
  created_at: string;
};

export type AiSubscriptionRow = {
  id: string;
  user_id: string;
  bot_name: string;
  allocation: number;
  market: string;
  status: string;
  profit_earned?: number;
  created_at: string;
  expires_at?: string | null;
};

export type CopySubscriptionRow = {
  id: string;
  user_id: string;
  trader_name: string;
  allocation: number;
  status: string;
  created_at: string;
};

export type WithdrawalEligibility = {
  portfolio: Record<string, unknown>;
  pending_fees_count: number;
  can_withdraw: boolean;
};

export type ProfileRow = {
  id: string;
  email: string;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  country?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  kyc_status: string;
  role: string;
};
