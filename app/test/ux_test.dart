import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:island_market/app.dart';
import 'package:island_market/core/i18n.dart';

import 'support.dart';

Future<void> phone(WidgetTester tester) async {
  tester.view.physicalSize = const Size(390 * 3, 844 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
}

void main() {
  testWidgets('the heart saves an ad; the saved list shows it; undo brings it back', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/l/d01'));
    await tester.pumpAndSettle();

    // The contact bar is fixed at the bottom, with the heart in it.
    final heart = find.byTooltip('Save');
    expect(heart, findsWidgets);
    await tester.tap(heart.last);
    await tester.pumpAndSettle();
    expect(state.isSaved('d01'), isTrue);
    expect(find.text('Saved'), findsWidgets);

    await tester.tap(find.byTooltip('Remove from saved').last);
    await tester.pumpAndSettle();
    expect(state.isSaved('d01'), isFalse);
    await tester.tap(find.text('Undo'));
    await tester.pumpAndSettle();
    expect(state.isSaved('d01'), isTrue);

    expect(state.prefs.getStringList('saved'), ['d01']);
  });

  testWidgets('saved ads appear on the saved screen', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en);
    state.toggleSaved('d05');
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/saved'));
    await tester.pumpAndSettle();
    expect(find.textContaining('Karakol'), findsWidgets);
    expect(find.textContaining('Nothing saved yet'), findsNothing);
  });

  testWidgets('first run: language, then who you are; the home screen follows', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en, onboarded: false);
    await tester.pumpWidget(IslandMarketApp(state: state));
    await tester.pumpAndSettle();
    expect(find.text('Welcome'), findsOneWidget);

    await tester.tap(find.text('العربية'));
    await tester.pumpAndSettle();
    expect(find.text('أهلاً بك'), findsOneWidget);
    await tester.tap(find.text('التالي'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('أنا طالب'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('ابدأ'));
    await tester.pumpAndSettle();

    expect(state.onboarded, isTrue);
    expect(state.persona, 'student');
    expect(state.lang, Lang.ar);
    expect(find.text('ماذا تحتاج؟'), findsOneWidget);
    expect(find.textContaining('أنا طالب'), findsOneWidget); // "For you: I am a student"
  });

  testWidgets('the welcome never shows again once finished', (tester) async {
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/welcome'));
    await tester.pumpAndSettle();
    expect(find.text('Welcome'), findsNothing);
    expect(find.text('What do you need?'), findsOneWidget);
  });

  testWidgets('filters: the sheet counts results live, and active filters become chips', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/search'));
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Filters'));
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(ChoiceChip, 'Kyrenia'));
    await tester.pumpAndSettle();
    final button = find.textContaining(RegExp(r'^Show \d+ results?$'));
    expect(button, findsOneWidget);
    final count = int.parse(RegExp(r'\d+').firstMatch(tester.widget<Text>(button).data!)!.group(0)!);
    await tester.tap(button);
    await tester.pumpAndSettle();
    expect(find.widgetWithText(InputChip, 'Kyrenia'), findsOneWidget);
    expect(find.text('$count ads'), findsOneWidget);

    await tester.tap(find.descendant(of: find.widgetWithText(InputChip, 'Kyrenia'), matching: find.byIcon(Icons.close)));
    await tester.pumpAndSettle();
    expect(find.widgetWithText(InputChip, 'Kyrenia'), findsNothing);
  });

  testWidgets('posting steps: Next waits for a title, and the bar moves forward', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/post'));
    await tester.pumpAndSettle();
    expect(find.text('Step 1 of 6'), findsOneWidget);
    await tester.tap(find.text('Start without pasting'));
    await tester.pumpAndSettle();
    expect(find.text('Step 2 of 6'), findsOneWidget);
    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    expect(find.text('Step 2 of 6'), findsOneWidget); // no title yet: it stays
    await tester.enterText(find.byType(TextField).first, 'Desk');
    await tester.tap(find.byType(DropdownButtonFormField<String>));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Furniture').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Next'));
    await tester.pumpAndSettle();
    expect(find.text('Step 3 of 6'), findsOneWidget);
  });

  testWidgets('tapping a card opens its ad, the photo flying across', (tester) async {
    await phone(tester);
    final state = await loadState(Lang.en);
    await tester.pumpWidget(IslandMarketApp(state: state, initialLocation: '/search?q=desk'));
    await tester.pumpAndSettle();
    // The card's picture carries a tag; the ad page's photo carries the same one, so it flies across.
    expect(find.byWidgetPredicate((w) => w is Hero && w.tag == 'ad-grid-d01'), findsOneWidget);
    await tester.tap(find.text('Study desk, like new'));
    await tester.pumpAndSettle();
    expect(find.text('Message on WhatsApp'), findsOneWidget);
    expect(find.byWidgetPredicate((w) => w is Hero && w.tag == 'ad-grid-d01'), findsOneWidget);
  });
}
