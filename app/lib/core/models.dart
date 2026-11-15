import 'i18n.dart';

/// The shapes of the website's data, read from the JSON files it exports.
const currencies = ['TRY', 'GBP', 'EUR', 'USD'];

class City {
  City(this.slug, this.name);
  final String slug;
  final Loc name;
  factory City.fromJson(Map<String, dynamic> j) => City(j['slug'], Loc.fromJson(j['name']));
}

class Category {
  Category(this.slug, this.name, this.sort);
  final String slug;
  final Loc name;
  final int sort;
  factory Category.fromJson(Map<String, dynamic> j) => Category(j['slug'], Loc.fromJson(j['name']), j['sort']);
}

/// What anyone may know about a seller. The phone number is never part of it.
class Seller {
  Seller({required this.name, required this.shopSlug, required this.city, this.verified = false});
  final String name;
  final String shopSlug;
  final String city;
  final bool verified;
  factory Seller.fromJson(Map<String, dynamic> j) =>
      Seller(name: j['name'], shopSlug: j['shopSlug'], city: j['city'], verified: j['verified'] == true);
}

class Listing {
  Listing({
    required this.id,
    required this.kind,
    required this.title,
    required this.description,
    required this.price,
    required this.currency,
    required this.category,
    required this.city,
    required this.status,
    required this.soldAt,
    required this.photos,
    required this.views,
    required this.createdAt,
    required this.seller,
    this.womenOnly = false,
  });

  final String id;
  /// "offer" or "wanted".
  final String kind;
  final String title;
  final String description;
  /// null = no price given. 0 = free.
  final int? price;
  final String currency;
  final String category;
  final String city;
  /// "live", "sold" or "removed".
  final String status;
  final DateTime? soldAt;
  final List<String> photos;
  final int views;
  final DateTime createdAt;
  final Seller seller;
  final bool womenOnly;

  bool get isWanted => kind == 'wanted';
  bool get isSold => status == 'sold';
}

class ServiceGroup {
  ServiceGroup(this.slug, this.name, this.bg, this.fg);
  final String slug;
  final Loc name;
  final int bg;
  final int fg;
  factory ServiceGroup.fromJson(Map<String, dynamic> j) =>
      ServiceGroup(j['slug'], Loc.fromJson(j['name']), _hex(j['tone']['bg']), _hex(j['tone']['fg']));
}

int _hex(String value) => 0xFF000000 | int.parse(value.substring(1), radix: 16);

class Service {
  Service({required this.slug, required this.group, required this.icon, required this.name, required this.blurb, required this.categories, required this.isRequest});
  final String slug;
  final String group;
  final String icon;
  final Loc name;
  final Loc blurb;
  final List<String> categories;
  /// Arranged by a person over WhatsApp instead of a list of ads.
  final bool isRequest;
  factory Service.fromJson(Map<String, dynamic> j) => Service(
        slug: j['slug'],
        group: j['group'],
        icon: j['icon'],
        name: Loc.fromJson(j['name']),
        blurb: Loc.fromJson(j['blurb']),
        categories: (j['categories'] as List).cast<String>(),
        isRequest: j['mode'] == 'request',
      );
}

class Tool {
  Tool(this.href, this.icon, this.name, this.blurb);
  final String href;
  final String icon;
  final Loc name;
  final Loc blurb;
  factory Tool.fromJson(Map<String, dynamic> j) => Tool(j['href'], j['icon'], Loc.fromJson(j['name']), Loc.fromJson(j['blurb']));
}

class GuideStep {
  GuideStep(this.text, this.link);
  final Loc text;
  final String? link;
}

class Guide {
  Guide({required this.slug, required this.icon, required this.title, required this.intro, required this.steps, this.example});
  final String slug;
  final String icon;
  final Loc title;
  final Loc intro;
  final List<GuideStep> steps;
  final String? example;
  factory Guide.fromJson(Map<String, dynamic> j) => Guide(
        slug: j['slug'],
        icon: j['icon'],
        title: Loc.fromJson(j['title']),
        intro: Loc.fromJson(j['intro']),
        steps: [for (final s in j['steps'] as List) GuideStep(Loc.fromJson(s['text']), s['link'])],
        example: j['example'],
      );
}

class Answer {
  Answer(this.q, this.a, this.link);
  final Loc q;
  final Loc a;
  final String? link;
}

class HelpTopic {
  HelpTopic(this.slug, this.icon, this.title, this.answers);
  final String slug;
  final String icon;
  final Loc title;
  final List<Answer> answers;
  factory HelpTopic.fromJson(Map<String, dynamic> j) => HelpTopic(
        j['slug'],
        j['icon'],
        Loc.fromJson(j['title']),
        [for (final a in j['answers'] as List) Answer(Loc.fromJson(a['q']), Loc.fromJson(a['a']), a['link'])],
      );
}

class EmergencyNumber {
  EmergencyNumber(this.number, this.name);
  final String number;
  final Loc name;
}
