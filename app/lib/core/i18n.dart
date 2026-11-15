import 'package:flutter/widgets.dart';

/// The three interface languages. Turkish is the default, as on the website.
enum Lang { tr, en, ar }

Lang langFromCode(String? code) => Lang.values.firstWhere((l) => l.name == code, orElse: () => Lang.tr);

/// What each language calls itself, for the language switch.
const langNames = {Lang.tr: 'Türkçe', Lang.en: 'English', Lang.ar: 'العربية'};

/// A text written once per language, as it comes from the website's data.
class Loc {
  const Loc(this._values);
  final Map<String, String> _values;

  factory Loc.fromJson(Object? json) =>
      Loc((json as Map).map((key, value) => MapEntry(key as String, value as String)));

  String of(Lang lang) => _values[lang.name] ?? _values['en'] ?? '';
  String get en => _values['en'] ?? '';
}

/// Every word the app shows, read from i18n.json, which is exported from the website's dictionaries.
/// Keys are dotted paths into the website's dictionary: `post.title`, `listing.whatsapp`.
class Strings {
  Strings(this.lang, this._dictionary);

  final Lang lang;
  final Map<String, dynamic> _dictionary;

  TextDirection get direction => lang == Lang.ar ? TextDirection.rtl : TextDirection.ltr;

  Object? _find(String key) {
    Object? node = _dictionary;
    for (final part in key.split('.')) {
      if (node is Map && node.containsKey(part)) {
        node = node[part];
      } else {
        return null;
      }
    }
    return node;
  }

  bool has(String key) => _find(key) != null;

  /// One text. A missing key shows itself, so it is noticed (and a test checks none are missing).
  String t(String key, [Map<String, Object> values = const {}]) {
    final found = _find(key);
    var text = found is String ? found : key;
    values.forEach((name, value) => text = text.replaceAll('{$name}', '$value'));
    return text;
  }

  List<String> list(String key) {
    final found = _find(key);
    return found is List ? found.cast<String>() : const [];
  }

  /// The right sentence for a number: English two forms, Turkish two, Arabic six.
  String plural(String key, int n) {
    final forms = _find(key);
    if (forms is! Map) return key;
    final sentence = (forms[pluralCategory(lang, n)] ?? forms['other']) as String;
    return sentence.replaceAll('{n}', groupDigits(n, lang));
  }
}

/// The CLDR plural category for whole numbers, as the website's Intl.PluralRules gives it.
String pluralCategory(Lang lang, int n) {
  switch (lang) {
    case Lang.ar:
      if (n == 0) return 'zero';
      if (n == 1) return 'one';
      if (n == 2) return 'two';
      final r = n % 100;
      if (r >= 3 && r <= 10) return 'few';
      if (r >= 11 && r <= 99) return 'many';
      return 'other';
    case Lang.en:
    case Lang.tr:
      return n == 1 ? 'one' : 'other';
  }
}

/// "1.500" in Turkish, "1,500" otherwise. Latin digits everywhere, as on the website.
String groupDigits(num value, Lang lang) {
  final whole = value.round().abs().toString();
  final separator = lang == Lang.tr ? '.' : ',';
  final buffer = StringBuffer();
  for (var i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 == 0) buffer.write(separator);
    buffer.write(whole[i]);
  }
  return (value < 0 ? '-' : '') + buffer.toString();
}
