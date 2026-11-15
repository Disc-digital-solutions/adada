import '../models.dart';
import 'course.dart';

const _soldStaysFor = Duration(days: 7);

/// The filters of a search, as in the website's address (?q=…&city=…).
class ListingFilter {
  const ListingFilter({
    this.q,
    this.category,
    this.categories,
    this.city,
    this.kind,
    this.currency,
    this.min,
    this.max,
    this.women = false,
    this.course,
    this.sort = 'newest',
  });

  final String? q;
  final String? category;
  /// Any of these: a service screen shows several categories at once.
  final List<String>? categories;
  final String? city;
  final String? kind;
  final String? currency;
  final int? min;
  final int? max;
  final bool women;
  final String? course;
  /// "newest", "cheapest" or "dearest".
  final String sort;

  ListingFilter copyWith({String? q, String? category, String? city, String? kind, String? currency, int? min, int? max, bool? women, String? sort, bool clearCategory = false, bool clearCity = false, bool clearKind = false, bool clearCurrency = false, bool clearMin = false, bool clearMax = false}) =>
      ListingFilter(
        q: q ?? this.q,
        category: clearCategory ? null : (category ?? this.category),
        categories: categories,
        city: clearCity ? null : (city ?? this.city),
        kind: clearKind ? null : (kind ?? this.kind),
        currency: clearCurrency ? null : (currency ?? this.currency),
        min: clearMin ? null : (min ?? this.min),
        max: clearMax ? null : (max ?? this.max),
        women: women ?? this.women,
        course: course,
        sort: sort ?? this.sort,
      );
}

/// Lower case, with the Turkish İ / I / ı / i all as a plain "i": "ISITICI" finds "ısıtıcı".
String fold(String text) => text.toLowerCase().replaceAll('̇', '').replaceAll('ı', 'i');

/// Live ads are listed. Sold ones stay a week, marked sold. Removed ones never show.
bool isListed(Listing listing, DateTime now) {
  if (listing.status == 'live') return true;
  if (listing.status == 'sold' && listing.soldAt != null) return now.difference(listing.soldAt!) < _soldStaysFor;
  return false;
}

bool _matches(Listing l, ListingFilter f) {
  final q = f.q?.trim() ?? '';
  if (q.isNotEmpty) {
    final needle = fold(q);
    final course = normalizeCourse(q);
    final found = fold(l.title).contains(needle) ||
        fold(l.description).contains(needle) ||
        (course.isNotEmpty && courseCodesIn('${l.title} ${l.description}').contains(course));
    if (!found) return false;
  }
  if (f.course != null && !courseCodesIn('${l.title} ${l.description}').contains(f.course)) return false;
  if (f.women && !l.womenOnly) return false;
  if (f.category != null && l.category != f.category) return false;
  if (f.categories != null && !f.categories!.contains(l.category)) return false;
  if (f.city != null && l.city != f.city) return false;
  if (f.kind != null && l.kind != f.kind) return false;
  // Prices in different currencies cannot be compared, so a price range works inside one currency.
  if (f.currency != null) {
    if (l.price == null || l.currency != f.currency) return false;
    if (f.min != null && l.price! < f.min!) return false;
    if (f.max != null && l.price! > f.max!) return false;
  }
  return true;
}

/// The ads a visitor should see for this search, in order.
List<Listing> filterListings(List<Listing> listings, ListingFilter filter, DateTime now) {
  final byPrice = filter.currency != null && filter.sort != 'newest';
  final direction = filter.sort == 'cheapest' ? 1 : -1;
  int newestFirst(Listing a, Listing b) => b.createdAt.compareTo(a.createdAt);
  return listings.where((l) => isListed(l, now) && _matches(l, filter)).toList()
    ..sort((a, b) {
      if (!byPrice) return newestFirst(a, b);
      final byAmount = direction * ((a.price ?? 0) - (b.price ?? 0));
      return byAmount != 0 ? byAmount : newestFirst(a, b);
    });
}
