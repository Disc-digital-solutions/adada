import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:island_market/app.dart';
import 'package:island_market/core/i18n.dart';

import 'support.dart';

/// Every screen, in every language, at phone size: it must build without an error,
/// including no text overflowing its box.
const routes = [
  '/', '/services', '/c/flats', '/c/dorms', '/c/viewing', '/c/rides', '/c/cars', '/search', '/search?q=desk',
  '/search?kind=wanted', '/l/d01', '/l/d05', '/l/d07', '/l/d13', '/l/d25', '/l/d63', '/l/d14', '/s/ahmad',
  '/s/sakarya-yurdu', '/post', '/post?category=rooms', '/safety', '/emergency', '/help', '/guides',
  '/guides/address', '/guides/bank', '/prices', '/books?course=MATH101', '/plan', '/tools', '/tools/split',
  '/tools/deposit', '/tools/receipt', '/tools/permit', '/no-such-page',
];

void main() {
  for (final lang in Lang.values) {
    for (final route in routes) {
      testWidgets('$route in ${lang.name}', (tester) async {
        tester.view.physicalSize = const Size(390 * 3, 844 * 3);
        tester.view.devicePixelRatio = 3;
        addTearDown(tester.view.reset);
        final state = await loadState(lang);
        await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: route));
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
        expect(find.byType(Scaffold), findsWidgets);
      });
    }
  }

  testWidgets('pasting a group post fills the form', (tester) async {
    tester.view.physicalSize = const Size(390 * 3, 844 * 3);
    tester.view.devicePixelRatio = 3;
    addTearDown(tester.view.reset);
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/post'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField).first, '🔥 SATILIK Çalışma masası\nÇok temiz, 1.500 TL\nMagosa #masa');
    await tester.pump();
    await tester.tap(find.text('Fill in the form'));
    await tester.pumpAndSettle();
    expect(find.text('Çalışma masası'), findsOneWidget);
    expect(find.text('1500'), findsOneWidget);
    expect(find.text('Furniture'), findsOneWidget);
    expect(find.text('Filled in. Check each field.'), findsOneWidget);
  });

  testWidgets('changing the language turns the layout right to left', (tester) async {
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state));
    await tester.pumpAndSettle();
    expect(find.text('What do you need?'), findsOneWidget);
    state.setLang(Lang.ar);
    await tester.pumpAndSettle();
    expect(find.text('ماذا تحتاج؟'), findsOneWidget);
    expect(Directionality.of(tester.element(find.text('ماذا تحتاج؟'))), TextDirection.rtl);
  });
}
