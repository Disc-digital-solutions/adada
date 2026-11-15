import 'listings.dart' show fold;

/// The word lists, exported from the website (catalog.json → parseWords), so both read posts alike.
class ParseWords {
  ParseWords({required this.categories, required this.cities, required this.wanted, required this.women, required this.free});

  /// In order: the first match wins, so the narrower category comes first.
  final List<MapEntry<String, List<String>>> categories;
  final List<MapEntry<String, List<String>>> cities;
  final List<String> wanted;
  final List<String> women;
  final List<String> free;

  static List<MapEntry<String, List<String>>> _table(Object? json) => [
        for (final row in json as List) MapEntry(row[0] as String, (row[1] as List).cast<String>()),
      ];

  factory ParseWords.fromJson(Map<String, dynamic> j) => ParseWords(
        categories: _table(j['categories']),
        cities: _table(j['cities']),
        wanted: (j['wanted'] as List).cast<String>(),
        women: (j['women'] as List).cast<String>(),
        free: (j['free'] as List).cast<String>(),
      );
}

/// What a pasted group post says, as suggestions for the form. When unsure, a field stays empty.
class ParsedPost {
  const ParsedPost({
    this.kind = 'offer',
    this.title = '',
    this.description = '',
    this.price,
    this.currency,
    this.city,
    this.category,
    this.womenOnly = false,
  });

  final String kind;
  final String title;
  final String description;
  /// null = no price found. 0 = free.
  final int? price;
  final String? currency;
  final String? city;
  final String? category;
  final bool womenOnly;
}

const _titleMax = 80;
const _descriptionMax = 1500;

String _latinDigits(String text) =>
    text.replaceAllMapped(RegExp('[٠-٩]'), (m) => '${m[0]!.codeUnitAt(0) - 0x0660}');

/// Lower case, no Turkish accents, single spaces, padded so " word" means "a word starting here".
String _loose(String text) {
  var plain = _latinDigits(fold(text));
  const swap = {'ç': 'c', 'ğ': 'g', 'ş': 's', 'ö': 'o', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u'};
  swap.forEach((from, to) => plain = plain.replaceAll(from, to));
  // Keep "+" so "2+1" (two rooms and a living room) survives as one word.
  return ' ${plain.replaceAll(RegExp(r'[^\p{L}\p{N}+]+', unicode: true), ' ').trim()} ';
}

final _arabic = RegExp('[\u0600-\u06FF]');

bool _hasWord(String text, String keyword) {
  if (_arabic.hasMatch(keyword)) return text.contains(keyword);
  if (keyword.endsWith('*')) return text.contains(' ${keyword.substring(0, keyword.length - 1)}');
  return text.contains(' $keyword ');
}

String? _firstMatch(String text, List<MapEntry<String, List<String>>> table, [List<String>? allowed]) {
  for (final row in table) {
    if (allowed != null && !allowed.contains(row.key)) continue;
    if (row.value.any((w) => _hasWord(text, w))) return row.key;
  }
  return null;
}

const _number = r'(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)';
const _multiplier = r'(?:\s*(k|bin)(?![\p{L}]))?';
const _currencyWord =
    r'(₺|£|€|\$|tl|try|ytl|liras?|lira|gbp|stg|sterlin|sterling|pounds?|eur|euros?|avro|usd|dollars?|dolar|ليرة|جنيه|باوند|استرليني|إسترليني|يورو|دولار)';

/// "1.500 TL", "400stg", "15 bin TL", "180 جنيه". The currency must not be followed by a number.
final _amountThenCurrency = RegExp('(?<![\\p{L}\\p{N}.,])$_number$_multiplier\\s*$_currencyWord(?![\\p{L}])(?!\\s*\\d)', unicode: true);
/// "₺6.500", "£450", "$220", "TL 500".
final _currencyThenAmount = RegExp('(?<![\\p{L}])$_currencyWord\\s*$_number$_multiplier(?![\\p{L}\\p{N}])', unicode: true);

final _currencyOf = [
  (RegExp(r'^(₺|tl|try|ytl|lira|liras?|ليرة)$'), 'TRY'),
  (RegExp(r'^(£|gbp|stg|sterlin|sterling|pounds?|جنيه|باوند|استرليني|إسترليني)$'), 'GBP'),
  (RegExp(r'^(€|eur|euros?|avro|يورو)$'), 'EUR'),
  (RegExp(r'^(\$|usd|dollars?|dolar|دولار)$'), 'USD'),
];

int _toNumber(String written, String? multiplier) {
  // A dot or comma before exactly three digits groups thousands ("1.500"); otherwise it is a decimal ("2.5k").
  final value = RegExp(r'^\d{1,3}([.,]\d{3})+$').hasMatch(written)
      ? double.parse(written.replaceAll(RegExp('[.,]'), ''))
      : double.parse(written.replaceFirst(',', '.'));
  return (multiplier != null ? value * 1000 : value).round();
}

(int, String)? _findPrice(String text) {
  final lower = _latinDigits(fold(text));
  final after = _amountThenCurrency.firstMatch(lower);
  final before = _currencyThenAmount.firstMatch(lower);
  final candidates = <(int, String, String?, String)>[
    if (after != null) (after.start, after[1]!, after[2], after[3]!),
    if (before != null) (before.start, before[2]!, before[3], before[1]!),
  ]..sort((a, b) => a.$1.compareTo(b.$1));
  for (final (_, number, multiplier, word) in candidates) {
    for (final (pattern, currency) in _currencyOf) {
      if (pattern.hasMatch(word)) {
        final price = _toNumber(number, multiplier);
        if (price > 0) return (price, currency);
      }
    }
  }
  return null;
}

// The analyzer checks this pattern without the unicode flag; with it (as here) it is valid and tested.
// ignore: valid_regexps
final _emoji = RegExp(r'[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]', unicode: true);

String _clean(String line) =>
    line.replaceAll(_emoji, ' ').replaceAll(RegExp(r'#[^\s#]+'), ' ').replaceAll(RegExp(r'\s+'), ' ').trim();

final _leadingLabel = RegExp(
  r'^(?:(?:satılık|satilik|acil satılık|acil|kiralık|kiralik|for sale|selling|sale|fs|wts|للبيع|للإيجار|للايجار|بيع)\s*[:\-–!|]*\s*)+',
  caseSensitive: false,
  unicode: true,
);

/// "SATILIK Çalışma masası" → "Çalışma masası": the selling switch already says it.
String _dropLabel(String title) {
  final stripped = title.replaceFirst(_leadingLabel, '');
  final removed = title.substring(0, title.length - stripped.length);
  return stripped.isNotEmpty && stripped != title && RegExp(r'\s|[:\-–!|]').hasMatch(removed) ? stripped : title;
}

/// Cut at the last space before the limit, so no word is cut in half.
String _shorten(String text, int max) {
  if (text.length <= max) return text;
  final cut = text.substring(0, max);
  final space = cut.lastIndexOf(' ');
  return (space > max / 2 ? cut.substring(0, space) : cut).replaceFirst(RegExp(r'[\s,.;:–-]+$'), '');
}

/// Reads an ad written for a Facebook or WhatsApp group and suggests the form's fields.
ParsedPost parsePost(String text, ParseWords words, {List<String>? categories}) {
  final lines = text.split(RegExp(r'\r?\n')).map(_clean).where((l) => l.isNotEmpty).toList();
  final first = _dropLabel(lines.isEmpty ? '' : lines.first);
  final title = _shorten(first, _titleMax);
  // If the first line was too long for a title, keep it whole in the description.
  final rest = title == first ? lines.skip(1) : lines;
  var description = rest.join('\n');
  if (description.length > _descriptionMax) description = description.substring(0, _descriptionMax);

  final loose = _loose(text.replaceAll('#', ' '));
  final found = _findPrice(text);
  final free = found == null && words.free.any((w) => _hasWord(loose, w));

  return ParsedPost(
    kind: words.wanted.any((w) => _hasWord(loose, w)) ? 'wanted' : 'offer',
    title: title,
    description: description,
    price: found?.$1 ?? (free ? 0 : null),
    currency: found?.$2,
    city: _firstMatch(loose, words.cities),
    category: _firstMatch(loose, words.categories, categories),
    womenOnly: words.women.any((w) => _hasWord(loose, w)),
  );
}
