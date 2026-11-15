import '../logic/listings.dart';
import '../models.dart';

class Shop {
  Shop(this.seller, this.listings);
  final Seller seller;
  final List<Listing> listings;
}

/// Everything the screens ask the data store, the same questions as the website's Repo.
/// Today it is answered by sample data; once the database is connected, a second implementation
/// (Supabase) answers the same questions and no screen changes.
abstract class Repo {
  /// True while the app runs on sample data.
  bool get isDemo;
  List<Category> get categories;
  Future<List<Listing>> search(ListingFilter filter, DateTime now);
  Future<Listing?> listing(String id, DateTime now);
  Future<Shop?> shop(String slug, DateTime now);
}
