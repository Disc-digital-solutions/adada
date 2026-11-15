import '../models.dart';

/// Typical prices from the ads themselves, as on the website: the "price looks wrong" warning,
/// and the open price page. Only inside one currency and one kind of thing, with enough ads.
const priceGroups = {
  'rent': ['rooms', 'agencies'],
  'dorm': ['dorms'],
  'car': ['cars'],
};
const minSample = 3;
const tooLow = 0.5;

int? median(List<int> values) {
  if (values.isEmpty) return null;
  final sorted = [...values]..sort();
  final mid = sorted.length ~/ 2;
  return sorted.length.isOdd ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).round();
}

String? _groupOf(String category) {
  for (final e in priceGroups.entries) {
    if (e.value.contains(category)) return e.key;
  }
  return null;
}

class PriceRow {
  PriceRow(this.group, this.city, this.currency, this.median, this.low, this.high, this.count);
  final String group;
  /// null = the whole island.
  final String? city;
  final String currency;
  final int median;
  final int low;
  final int high;
  final int count;
}

List<PriceRow> priceIndex(List<Listing> listings) {
  final buckets = <String, (String, String?, String, List<int>)>{};
  for (final l in listings) {
    final group = _groupOf(l.category);
    if (group == null || l.kind != 'offer' || (l.price ?? 0) == 0) continue;
    for (final city in [l.city, null]) {
      final key = '$group|${city ?? '*'}|${l.currency}';
      buckets.putIfAbsent(key, () => (group, city, l.currency, <int>[])).$4.add(l.price!);
    }
  }
  final rows = [
    for (final (group, city, currency, prices) in buckets.values)
      if (prices.length >= minSample)
        PriceRow(group, city, currency, median(prices)!, prices.reduce((a, b) => a < b ? a : b), prices.reduce((a, b) => a > b ? a : b), prices.length),
  ];
  rows.sort((a, b) {
    final g = a.group.compareTo(b.group);
    if (g != 0) return g;
    final c = (a.city ?? '').compareTo(b.city ?? '');
    return c != 0 ? c : a.currency.compareTo(b.currency);
  });
  return rows;
}

/// The usual price an ad is compared with, when its own is suspiciously low. City first, else the island.
int? tooLowComparedWith(Listing listing, List<Listing> all) {
  final group = _groupOf(listing.category);
  if (group == null || listing.kind != 'offer' || (listing.price ?? 0) == 0) return null;
  final peers = all.where((l) =>
      l.id != listing.id && l.kind == 'offer' && (l.price ?? 0) > 0 && l.currency == listing.currency && _groupOf(l.category) == group);
  final inCity = [for (final l in peers) if (l.city == listing.city) l.price!];
  final sample = inCity.length >= minSample ? inCity : [for (final l in peers) l.price!];
  if (sample.length < minSample) return null;
  final typical = median(sample)!;
  return listing.price! < typical * tooLow ? typical : null;
}
