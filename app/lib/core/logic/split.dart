/// Splitting a shared flat's bills, in whole cents so totals never disagree. Same as the website.
class Bill {
  Bill(this.label, this.paidBy, this.amount);
  String label;
  int paidBy;
  double amount;
}

class Transfer {
  Transfer(this.from, this.to, this.amount);
  final int from;
  final int to;
  final double amount;
}

/// Each person's balance: positive = is owed, negative = owes. Bills are shared equally.
List<double> balances(int people, List<Bill> bills) {
  final cents = List<int>.filled(people, 0);
  for (final bill in bills) {
    if (people == 0 || !(bill.amount > 0) || bill.paidBy < 0 || bill.paidBy >= people) continue;
    final total = (bill.amount * 100).round();
    final share = total ~/ people;
    var remainder = total - share * people;
    cents[bill.paidBy] += total;
    for (var i = 0; i < people; i++) {
      // The leftover cents go one each to the first people, so the shares add up exactly.
      cents[i] -= share + (remainder-- > 0 ? 1 : 0);
    }
  }
  return [for (final c in cents) c / 100];
}

/// The payments that settle everyone: the biggest debtor pays the biggest creditor, repeatedly.
List<Transfer> settle(int people, List<Bill> bills) {
  final cents = [for (final b in balances(people, bills)) (b * 100).round()];
  final transfers = <Transfer>[];
  while (cents.isNotEmpty) {
    var debtor = 0, creditor = 0;
    for (var i = 0; i < cents.length; i++) {
      if (cents[i] < cents[debtor]) debtor = i;
      if (cents[i] > cents[creditor]) creditor = i;
    }
    if (cents[debtor] >= 0 || cents[creditor] <= 0) break;
    final amount = -cents[debtor] < cents[creditor] ? -cents[debtor] : cents[creditor];
    cents[debtor] += amount;
    cents[creditor] -= amount;
    transfers.add(Transfer(debtor, creditor, amount / 100));
  }
  return transfers;
}
