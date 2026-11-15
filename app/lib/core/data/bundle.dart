import 'dart:convert';

import 'package:flutter/services.dart';

import '../i18n.dart';
import '../logic/parse_post.dart';
import '../models.dart';
import 'demo_repo.dart';
import 'repo.dart';

/// Everything the app loads at start: the words in three languages, the catalogue (services,
/// guides, answers, tools, cities) and the data store. All of it is exported from the website.
class AppBundle {
  AppBundle({
    required this.dictionaries,
    required this.siteName,
    required this.siteUrl,
    required this.cities,
    required this.groups,
    required this.services,
    required this.tools,
    required this.guides,
    required this.emergency,
    required this.help,
    required this.repo,
    required this.parseWords,
  });

  final Map<Lang, Map<String, dynamic>> dictionaries;
  final String siteName;
  final String siteUrl;
  final List<City> cities;
  final List<ServiceGroup> groups;
  final List<Service> services;
  final List<Tool> tools;
  final List<Guide> guides;
  final List<EmergencyNumber> emergency;
  final List<HelpTopic> help;
  final Repo repo;
  final ParseWords parseWords;

  /// The team's WhatsApp line: `flutter run --dart-define=TEAM_WHATSAPP=+90533...`. Empty = off.
  static const teamWhatsapp = String.fromEnvironment('TEAM_WHATSAPP');

  /// The website's address, used in shared links and the group post.
  static const publicUrl = String.fromEnvironment('SITE_URL', defaultValue: 'https://example.com');

  Strings strings(Lang lang) => Strings(lang, dictionaries[lang]!);

  String cityName(String slug, Lang lang) {
    for (final c in cities) {
      if (c.slug == slug) return c.name.of(lang);
    }
    return slug;
  }

  Service? service(String slug) {
    for (final s in services) {
      if (s.slug == slug) return s;
    }
    return null;
  }

  Service? serviceOfCategory(String category) {
    for (final s in services) {
      if (s.categories.contains(category)) return s;
    }
    return null;
  }

  ServiceGroup groupOf(Service service) => groups.firstWhere((g) => g.slug == service.group, orElse: () => groups.first);

  Guide? guide(String slug) {
    for (final g in guides) {
      if (g.slug == slug) return g;
    }
    return null;
  }

  static Future<AppBundle> load(AssetBundle assets) async {
    Future<Map<String, dynamic>> json(String name) async =>
        jsonDecode(await assets.loadString('assets/data/$name')) as Map<String, dynamic>;
    final i18n = await json('i18n.json');
    final catalog = await json('catalog.json');
    final demo = await json('demo.json');
    return fromJson(i18n, catalog, demo);
  }

  static AppBundle fromJson(Map<String, dynamic> i18n, Map<String, dynamic> catalog, Map<String, dynamic> demo) {
    List<T> each<T>(String key, T Function(Map<String, dynamic>) make) =>
        [for (final item in catalog[key] as List) make(item as Map<String, dynamic>)];
    return AppBundle(
      dictionaries: {for (final lang in Lang.values) lang: i18n[lang.name] as Map<String, dynamic>},
      siteName: catalog['site']['name'] as String,
      siteUrl: publicUrl,
      cities: each('cities', City.fromJson),
      groups: each('groups', ServiceGroup.fromJson),
      services: each('services', Service.fromJson),
      tools: each('tools', Tool.fromJson),
      guides: each('guides', Guide.fromJson),
      emergency: each('emergency', (j) => EmergencyNumber(j['number'], Loc.fromJson(j['name']))),
      help: each('help', HelpTopic.fromJson),
      repo: DemoRepo.fromJson(demo),
      parseWords: ParseWords.fromJson(catalog['parseWords'] as Map<String, dynamic>),
    );
  }
}
