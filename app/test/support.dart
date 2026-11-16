import 'dart:convert';
import 'dart:io';

import 'package:island_market/core/app_state.dart';
import 'package:island_market/core/data/bundle.dart';
import 'package:island_market/core/i18n.dart';
import 'package:shared_preferences/shared_preferences.dart';

Map<String, dynamic> readJson(String name) => jsonDecode(File('assets/data/$name').readAsStringSync()) as Map<String, dynamic>;

/// The app's data, read from the same files the app ships with.
AppBundle loadBundle() => AppBundle.fromJson(readJson('i18n.json'), readJson('catalog.json'), readJson('demo.json'));

/// [onboarded]: false starts at the first-run welcome, as a brand-new install does.
Future<AppState> loadState(Lang lang, {bool onboarded = true}) async {
  SharedPreferences.setMockInitialValues({'onboarded': onboarded});
  final state = await AppState.load(loadBundle());
  state.lang = lang;
  return state;
}
