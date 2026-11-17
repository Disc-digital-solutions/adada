import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/logic/listings.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';
import '../widgets/service_widgets.dart';

/// The services on the home grid, and the order of the rows of ads, for each kind of person.
/// The rest are one tap away under "All services".
const featuredFor = {
  null: ['flats', 'dorms', 'buy-sell', 'cars', 'car-rental', 'towing', 'cleaning', 'construction', 'arrival', 'education', 'jobs'],
  'student': ['flats', 'dorms', 'buy-sell', 'arrival', 'education', 'jobs', 'shifts', 'furniture-rental', 'viewing', 'storage', 'language-exchange'],
  'resident': ['buy-sell', 'cars', 'cleaning', 'construction', 'towing', 'car-services', 'tech-repair', 'childcare', 'pets', 'deals', 'notices'],
  'business': ['jobs', 'shifts', 'internships', 'supplies', 'coworking', 'agencies', 'professionals', 'construction', 'cleaning', 'staff-housing', 'cars'],
  'visitor': ['experiences', 'car-rental', 'restaurants', 'events', 'rides', 'airport-board', 'clinics', 'flats', 'deals', 'towing', 'shop-turkey'],
};
const railsFor = {
  null: ['housing', 'buy', 'vehicles', 'students', 'home', 'work', 'outing'],
  'student': ['housing', 'students', 'buy', 'work', 'outing', 'vehicles', 'home'],
  'resident': ['buy', 'home', 'vehicles', 'housing', 'outing', 'work', 'community'],
  'business': ['work', 'home', 'housing', 'vehicles', 'buy', 'outing'],
  'visitor': ['outing', 'vehicles', 'housing', 'buy', 'work'],
};
/// The home grid for no particular person.
final featured = featuredFor[null]!;

/// Home is the hub: one search for everything, every service as a tile, then the newest ads
/// from each part of the island's life, the tools, and how to post.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final now = DateTime.now();
    final persona = context.app.persona;
    final services = [for (final slug in featuredFor[persona] ?? featured) bundle.service(slug)].whereType<Service>();
    final rails = railsFor[persona] ?? railsFor[null]!;
    return AppPage(
      padding: EdgeInsets.zero,
      children: [
        if (bundle.repo.isDemo)
          Container(
            color: C.notice,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Text(s.t('demo.banner'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: C.noticeInk, fontWeight: FontWeight.w500)),
          ),
        _Hero(),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SectionHeader(
                s.t('home.whatNeed'),
                hint: persona == null ? null : '${s.t('app.forYou')}: ${s.t('app.$persona')}',
                action: s.t('home.allServices'),
                onAction: () => context.go('/services'),
              ),
              TileGrid(children: [
                for (final service in services) ServiceTile(service: service),
                Panel(
                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 12),
                  onTap: () => context.go('/services'),
                  child: Column(children: [
                    const IconBadge(Icons.grid_view, bg: C.paper, fg: C.seaDeep),
                    const SizedBox(height: 8),
                    Text(s.t('home.allServices'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: C.seaDeep)),
                  ]),
                ),
              ]),
              Loaded<List<Listing>>(
                future: bundle.repo.search(const ListingFilter(), now),
                builder: (context, all) {
                  List<Listing> inGroup(String group) {
                    final categories = {for (final sv in bundle.services.where((x) => x.group == group)) ...sv.categories};
                    return all.where((l) => categories.contains(l.category) && l.kind == 'offer').take(10).toList();
                  }

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (final group in rails)
                        ListingRail(
                          title: bundle.groups.firstWhere((g) => g.slug == group).name.of(s.lang),
                          listings: inGroup(group),
                          now: now,
                          onSeeAll: () => context.go('/services'),
                        ),
                      ListingRail(
                        title: s.t('home.wantedNow'),
                        hint: s.t('home.wantedNowHint'),
                        listings: all.where((l) => l.isWanted).take(10).toList(),
                        now: now,
                        onSeeAll: () => context.go('/search?kind=wanted'),
                      ),
                    ],
                  );
                },
              ),
              SectionHeader(s.t('tools.title'), action: s.t('home.seeAllShort'), onAction: () => context.go('/tools')),
              for (final tool in bundle.tools.take(4)) ToolTile(tool: tool),
              const SizedBox(height: 24),
              _PostBand(),
              const SizedBox(height: 12),
              _TrustCard(),
            ],
          ),
        ),
      ],
    );
  }
}

class _Hero extends StatefulWidget {
  @override
  State<_Hero> createState() => _HeroState();
}

class _HeroState extends State<_Hero> {
  final _query = TextEditingController();

  @override
  void dispose() {
    _query.dispose();
    super.dispose();
  }

  void _search() => context.go('/search?q=${Uri.encodeQueryComponent(_query.text.trim())}');

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final facts = [
      (Icons.add, s.t('home.statFree')),
      (Icons.grid_view, '${context.bundle.services.length} · ${s.t('nav.services')}'),
      (Icons.chat_bubble_outline, 'WhatsApp'),
      (Icons.translate, '${s.t('home.statCities')} · ${s.t('home.statLangs')}'),
    ];
    return Container(
      color: C.ink,
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 26),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('NORTH CYPRUS · KKTC · شمال قبرص', style: TextStyle(color: Colors.white60, fontSize: 11.5, fontWeight: FontWeight.w600, letterSpacing: 0.8)),
          const SizedBox(height: 8),
          Text(s.t('home.heroTitle'), style: const TextStyle(color: Colors.white, fontSize: 27, fontWeight: FontWeight.w700, height: 1.15)),
          const SizedBox(height: 8),
          Text(s.t('home.heroIntro'), style: const TextStyle(color: Colors.white70, fontSize: 15, height: 1.45)),
          const SizedBox(height: 18),
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(color: C.card, borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              Expanded(
                child: TextField(
                  controller: _query,
                  textInputAction: TextInputAction.search,
                  onSubmitted: (_) => _search(),
                  decoration: InputDecoration(
                    hintText: s.t('search.placeholder'),
                    prefixIcon: const Icon(Icons.search),
                    fillColor: C.paper,
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              FilledButton(onPressed: _search, child: Text(s.t('search.submit'))),
            ]),
          ),
          const SizedBox(height: 14),
          Wrap(spacing: 16, runSpacing: 6, children: [
            for (final (icon, text) in facts)
              Row(mainAxisSize: MainAxisSize.min, children: [
                Icon(icon, size: 15, color: Colors.white54),
                const SizedBox(width: 5),
                Text(text, style: const TextStyle(color: Colors.white70, fontSize: 13)),
              ]),
          ]),
        ],
      ),
    );
  }
}

class _PostBand extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(color: C.seaDeep, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(s.t('home.ctaTitle'), style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w700, height: 1.2)),
          const SizedBox(height: 6),
          Text(s.t('home.ctaBody'), style: const TextStyle(color: Colors.white70, height: 1.45)),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () => context.go('/post'),
            style: FilledButton.styleFrom(backgroundColor: C.coral, foregroundColor: Colors.white),
            icon: const Icon(Icons.add, size: 18),
            label: Text(s.t('home.ctaButton')),
          ),
        ],
      ),
    );
  }
}

class _TrustCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return Panel(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            const Icon(Icons.shield_outlined, color: C.sea),
            const SizedBox(width: 8),
            Text(s.t('home.trustTitle'), style: Theme.of(context).textTheme.titleMedium),
          ]),
          const SizedBox(height: 10),
          for (final tip in s.list('safety.tips').take(3))
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Padding(padding: EdgeInsets.only(top: 8), child: CircleAvatar(radius: 3, backgroundColor: C.sea)),
                const SizedBox(width: 10),
                Expanded(child: Text(tip)),
              ]),
            ),
          TextButton(onPressed: () => context.push('/safety'), child: Text(s.t('nav.safety'))),
        ],
      ),
    );
  }
}
