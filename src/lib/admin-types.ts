export type TransactionStatus = "pending" | "completed" | "rejected" | "approved";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  kyc_status: string;
  is_suspended?: boolean;
  phone?: string | null;
  country?: string | null;
  created_at: string;
  admin_notes?: string | null;
  signal_pct?: number;
}

export type AdminModerationUiAction = "suspend" | "unsuspend" | "reset_kyc" | "note";
export type AdminBalanceDirection = "credit" | "debit";

export interface AdminUserFee {
  id: string;
  fee_type: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  notes: string | null;
  assigned_by: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserDetails {
  profile: Profile;
  balance: number;
  profit_total?: number;
  outstanding_fees_total: number;
  fees?: AdminUserFee[];
  stats: {
    deposits_count: number;
    deposits_total: number;
    withdrawals_count: number;
    withdrawals_total: number;
    trades_count: number;
  };
  profit_adjustments?: Array<{
    id: string;
    amount: number;
    note: string | null;
    balance_before: number;
    balance_after: number;
    created_at: string;
    admin_email?: string | null;
    admin_name?: string | null;
  }>;
  moderation_actions: Array<{
    id: string;
    action_type: string;
    reason: string;
    created_at: string;
  }>;
}

export interface DepositRow {
  id: string;
  user_id: string;
  amount: number;
  method: string;
  status: TransactionStatus;
  notes: string | null;
  created_at: string;
  profiles?: { email: string; full_name: string | null } | null;
}

export interface WithdrawalRow {
  id: string;
  user_id: string;
  amount: number;
  currency?: string;
  method: string;
  status: TransactionStatus;
  wallet_address: string | null;
  notes?: string | null;
  created_at: string;
  profiles?: { email: string; full_name: string | null } | null;
}

export interface KycRow {
  id: string;
  user_id: string;
  document_type: string;
  document_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  profiles?: { email: string; full_name: string | null; kyc_status: string } | null;
}
