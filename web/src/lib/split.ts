/**
 * Splitting a shared flat's bills: who paid what, and the fewest payments that settle everyone.
 * Amounts are worked in whole cents so that rounding never makes the totals disagree.
 */
export interface Bill {
  label: string;
  /** Index of the person who paid it. */
  paidBy: number;
  amount: number;
}

export interface Transfer {
  from: number;
  to: number;
  amount: number;
}

/** Each person's balance: positive = is owed money, negative = owes money. Bills are shared equally. */
export function balances(people: number, bills: Bill[]): number[] {
  const cents = Array.from({ length: people }, () => 0);
  for (const bill of bills) {
    if (people === 0 || !(bill.amount > 0) || bill.paidBy < 0 || bill.paidBy >= people) continue;
    const total = Math.round(bill.amount * 100);
    const share = Math.floor(total / people);
    let remainder = total - share * people;
    cents[bill.paidBy] += total;
    for (let i = 0; i < people; i++) {
      // The leftover cents go one each to the first people, so the shares add up exactly.
      cents[i] -= share + (remainder-- > 0 ? 1 : 0);
    }
  }
  return cents.map((c) => c / 100);
}

/** The payments that settle all balances: the biggest debtor pays the biggest creditor, repeatedly. */
export function settle(people: number, bills: Bill[]): Transfer[] {
  const cents = balances(people, bills).map((b) => Math.round(b * 100));
  const transfers: Transfer[] = [];
  for (;;) {
    const debtor = cents.indexOf(Math.min(...cents));
    const creditor = cents.indexOf(Math.max(...cents));
    if (debtor < 0 || cents[debtor] >= 0 || cents[creditor] <= 0) break;
    const amount = Math.min(-cents[debtor], cents[creditor]);
    cents[debtor] += amount;
    cents[creditor] -= amount;
    transfers.push({ from: debtor, to: creditor, amount: amount / 100 });
  }
  return transfers;
}

/** Western digits for Arabic-Indic and Persian ones, so "٤٥٠" reads as 450. */
function westernDigits(text: string): string {
  return text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export type AmountResult = { ok: true; amount: number } | { ok: false; error: "blank" | "number" };

/**
 * Reads an amount as typed: "450", "12.50", "12,50", "٤٥٠". It must be a finite number above 0;
 * it is rounded to whole cents, the unit the splitter works in.
 */
export function parseAmount(raw: string): AmountResult {
  const text = westernDigits(raw).trim().replace(/\s/g, "").replace("٫", ".");
  if (!text) return { ok: false, error: "blank" };
  // One decimal mark, comma or point, with up to two decimals.
  if (!/^\d+([.,]\d{1,2})?$/.test(text)) return { ok: false, error: "number" };
  const amount = Math.round(Number(text.replace(",", ".")) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "number" };
  return { ok: true, amount };
}

/** How many people pay one extra cent so the equal shares add up to the total exactly. */
export function extraCents(people: number, total: number): number {
  if (people <= 0) return 0;
  return Math.round(total * 100) % people;
}
