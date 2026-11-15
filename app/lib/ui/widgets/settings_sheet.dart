import 'package:flutter/material.dart';

import '../../core/app_state.dart';
import '../../core/i18n.dart';
import '../theme.dart';

/// Language, larger text (ENH-30) and save data (ENH-29), kept on the phone.
Future<void> showSettings(BuildContext context) => showModalBottomSheet(
      context: context,
      showDragHandle: true,
      backgroundColor: C.card,
      builder: (sheetContext) => ListenableBuilder(
        listenable: context.app,
        builder: (_, _) {
          final app = context.app;
          final s = app.s;
          return Directionality(
            textDirection: s.direction,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(s.t('nav.language'), style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 10),
                    SegmentedButton<Lang>(
                      segments: [for (final l in Lang.values) ButtonSegment(value: l, label: Text(langNames[l]!))],
                      selected: {app.lang},
                      showSelectedIcon: false,
                      onSelectionChanged: (v) => app.setLang(v.first),
                    ),
                    const SizedBox(height: 20),
                    Text(s.t('display.title'), style: Theme.of(context).textTheme.titleMedium),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(s.t('display.larger')),
                      value: app.largeText,
                      onChanged: app.setLargeText,
                    ),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text(s.t('display.lowData')),
                      value: app.lowData,
                      onChanged: app.setLowData,
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
