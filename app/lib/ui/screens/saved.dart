import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';

/// The ads the person saved with the heart, newest first. Kept on the phone until accounts exist.
class SavedScreen extends StatelessWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.app;
    final s = app.s;
    final now = DateTime.now();
    Future<List<Listing>> load() async => [
          for (final id in app.saved) await app.bundle.repo.listing(id, now),
        ].whereType<Listing>().where((l) => l.status != 'removed').toList();
    return AppPage(title: s.t('app.saved'), children: [
      Loaded<List<Listing>>(
        key: ValueKey(app.saved.join(',')),
        future: load(),
        builder: (context, listings) => listings.isEmpty
            ? Padding(
                padding: const EdgeInsets.only(top: 48),
                child: Column(children: [
                  Container(
                    width: 96,
                    height: 96,
                    decoration: const BoxDecoration(color: C.coralWash, shape: BoxShape.circle),
                    child: const Icon(Icons.favorite_border, size: 46, color: C.coral),
                  ),
                  const SizedBox(height: 18),
                  Text(s.t('app.savedEmpty'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 16, color: C.inkSoft, height: 1.45)),
                  const SizedBox(height: 18),
                  FilledButton(onPressed: () => context.go('/search'), child: Text(s.t('nav.search'))),
                ]),
              )
            : ListingGrid(listings: listings, now: now),
      ),
    ]);
  }
}
