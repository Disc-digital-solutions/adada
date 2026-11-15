import '../logic/listings.dart';
import '../models.dart';
import 'repo.dart';

/// The data store while there is no database: the website's sample ads, read-only.
/// Ages are kept relative ("posted 12 minutes ago"), so the samples always look fresh.
class DemoRepo implements Repo {
  DemoRepo(this.categories, this._sellers, this._samples);

  @override
  final List<Category> categories;
  final Map<String, Seller> _sellers;
  final List<Map<String, dynamic>> _samples;

  factory DemoRepo.fromJson(Map<String, dynamic> json) => DemoRepo(
        [for (final c in json['categories'] as List) Category.fromJson(c)]..sort((a, b) => a.sort.compareTo(b.sort)),
        (json['sellers'] as Map).map((k, v) => MapEntry(k as String, Seller.fromJson(v))),
        (json['listings'] as List).cast<Map<String, dynamic>>(),
      );

  @override
  bool get isDemo => true;

  List<Listing> _all(DateTime now) => [
        for (final s in _samples)
          Listing(
            id: s['id'],
            kind: s['kind'],
            title: s['title'],
            description: s['description'],
            price: s['price'],
            currency: s['currency'],
            category: s['category'],
            city: s['city'],
            status: s['status'],
            soldAt: s['soldAgeMin'] == null ? null : now.subtract(Duration(minutes: s['soldAgeMin'])),
            photos: (s['photos'] as List).cast<String>(),
            views: s['views'],
            createdAt: now.subtract(Duration(minutes: s['ageMin'])),
            seller: _sellers[s['seller']]!,
            womenOnly: s['womenOnly'] == true,
          ),
      ];

  @override
  Future<List<Listing>> search(ListingFilter filter, DateTime now) async => filterListings(_all(now), filter, now);

  @override
  Future<Listing?> listing(String id, DateTime now) async {
    for (final l in _all(now)) {
      if (l.id == id) return l;
    }
    return null;
  }

  @override
  Future<Shop?> shop(String slug, DateTime now) async {
    final seller = _sellers.values.where((s) => s.shopSlug == slug).firstOrNull;
    if (seller == null) return null;
    final listings = filterListings(_all(now), const ListingFilter(), now).where((l) => l.seller.shopSlug == slug).toList();
    return Shop(seller, listings);
  }
}
