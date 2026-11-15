import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';

import 'core/app_state.dart';
import 'core/i18n.dart';
import 'ui/router.dart';
import 'ui/theme.dart';

class IslandMarketApp extends StatefulWidget {
  const IslandMarketApp({super.key, required this.state, this.initialLocation = '/'});

  final AppState state;
  final String initialLocation;

  @override
  State<IslandMarketApp> createState() => _IslandMarketAppState();
}

class _IslandMarketAppState extends State<IslandMarketApp> {
  late final GoRouter _router = buildRouter(initialLocation: widget.initialLocation);

  @override
  void dispose() {
    _router.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return App(
      state: widget.state,
      child: ListenableBuilder(
        listenable: widget.state,
        builder: (context, _) {
          final state = widget.state;
          return MaterialApp.router(
            title: state.bundle.siteName,
            debugShowCheckedModeBanner: false,
            theme: buildTheme(),
            routerConfig: _router,
            locale: Locale(state.lang.name),
            supportedLocales: [for (final l in Lang.values) Locale(l.name)],
            localizationsDelegates: GlobalMaterialLocalizations.delegates,
            // Larger text (ENH-30) scales every text in the app.
            builder: (context, child) => MediaQuery(
              data: MediaQuery.of(context).copyWith(
                textScaler: state.largeText ? const TextScaler.linear(1.15) : MediaQuery.of(context).textScaler,
              ),
              child: child!,
            ),
          );
        },
      ),
    );
  }
}
