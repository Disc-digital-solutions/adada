import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app.dart';
import 'core/app_state.dart';
import 'core/data/bundle.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final bundle = await AppBundle.load(rootBundle);
  final state = await AppState.load(bundle, deviceLanguage: ui.PlatformDispatcher.instance.locale.languageCode);
  runApp(IslandMarketApp(state: state));
}
