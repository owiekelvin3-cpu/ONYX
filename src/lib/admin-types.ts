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
}

export type AdminModerationUiAction = "suspend" | "unsuspend" | "reset_kyc" | "note";
export type AdminBalanceDirection = "credit" | "debit";

export interface AdminUserDetails {
  profile: Profile;
  balance: number;
  outstanding_fees_total: number;
  stats: {
    deposits_count: number;
    deposits_total: number;
    withdrawals_count: number;
    withdrawals_total: number;
    trades_count: number;
  };
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
