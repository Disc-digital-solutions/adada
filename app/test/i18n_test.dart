import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:island_market/core/i18n.dart';

import 'support.dart';

/// Every text the app asks for by name exists in Turkish, English and Arabic.
void main() {
  test('no missing words in any language', () {
    final bundle = loadBundle();
    final call = RegExp(r"""s\.(?:t|list|plural)\(\s*'([a-zA-Z]+\.[a-zA-Z.]+)'""");
    final keys = <String>{};
    for (final file in Directory('lib').listSync(recursive: true).whereType<File>().where((f) => f.path.endsWith('.dart'))) {
      for (final m in call.allMatches(file.readAsStringSync())) {
        keys.add(m[1]!);
      }
    }
    expect(keys.length, greaterThan(100));
    final missing = [
      for (final lang in Lang.values)
        for (final key in keys)
          if (!bundle.strings(lang).has(key)) '${lang.name}: $key',
    ];
    expect(missing, isEmpty);
  });
}
