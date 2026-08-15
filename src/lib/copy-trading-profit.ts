/** Notification title that triggers the copy-trading profit overlay on the user dashboard. */
export const COPY_TRADING_PROFIT_NOTIFICATION_TITLE = "Copy trading profit";

export type CopyTradingProfitEvent = {
  id: string;
  traderName: string;
  amount: number;
  message: string;
};

export function parseCopyTradingProfitNotification(
  title: string,
  message: string,
  id: string
): CopyTradingProfitEvent | null {
  if (title !== COPY_TRADING_PROFIT_NOTIFICATION_TITLE) return null;

  const traderMatch = message.match(/^(.+?) copied a winning trade/);
  const amountMatch = message.match(/\+\$([\d,]+\.\d{2})/);

  const traderName = traderMatch?.[1]?.trim() || "Your trader";
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, "")) : 0;

  if (!Number.isFinite(amount) || amount <= 0) return null;

  return { id, traderName, amount, message };
}
