import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/logic/listings.dart';
import '../../core/logic/share_text.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';
import '../widgets/service_widgets.dart';

/// Every service, in its groups, with how many ads each has; then the tools.
class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    return AppPage(
      title: s.t('services.title'),
      children: [
        Text(s.t('services.intro'), style: const TextStyle(color: C.inkSoft)),
        Loaded<List<Listing>>(
          future: bundle.repo.search(const ListingFilter(), DateTime.now()),
          builder: (context, all) {
            int count(Service sv) => all.where((l) => sv.categories.contains(l.category)).length;
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (final group in bundle.groups) ...[
                  Padding(
                    padding: const EdgeInsets.only(top: 24, bottom: 10),
                    child: Row(children: [
                      CircleAvatar(radius: 5, backgroundColor: Color(group.fg)),
                      const SizedBox(width: 8),
                      Expanded(child: Text(group.name.of(s.lang), style: Theme.of(context).textTheme.titleLarge)),
                    ]),
                  ),
                  for (final sv in bundle.services.where((x) => x.group == group.slug)) ServiceRow(service: sv, count: count(sv)),
                ],
              ],
            );
          },
        ),
        SectionHeader(s.t('tools.title')),
        for (final tool in bundle.tools) ToolTile(tool: tool),
      ],
    );
  }
}

const _housingCategories = ['rooms', 'roommates', 'dorms'];

/// One screen per service: its ads with a city filter and "post here", or, for a service a person
/// arranges, how it works and the WhatsApp request.
class ServiceScreen extends StatefulWidget {
  const ServiceScreen({super.key, required this.slug});

  final String slug;

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  String? _city;
  bool _women = false;

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final service = bundle.service(widget.slug);
    if (service == null) return const NotFoundScreen();
    final group = bundle.groupOf(service);
    final housing = service.categories.any(_housingCategories.contains);
    final team = AppBundle.teamWhatsapp;
    final request = team.isEmpty ? null : whatsappLink(team, s.t('request.message', {'service': service.name.of(s.lang)}));

    return AppPage(
      title: service.name.of(s.lang),
      children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          ServiceBadge(service: service, size: 56),
          const SizedBox(width: 14),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(group.name.of(s.lang).toUpperCase(), style: TextStyle(color: Color(group.fg), fontSize: 11.5, fontWeight: FontWeight.w700, letterSpacing: 0.6)),
              const SizedBox(height: 2),
              Text(service.name.of(s.lang), style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 4),
              Text(service.blurb.of(s.lang), style: const TextStyle(color: C.inkSoft)),
            ]),
          ),
        ]),
        const SizedBox(height: 16),
        if (service.isRequest) ...[
          Panel(
            padding: const EdgeInsets.all(18),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(s.t('request.howTitle'), style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              for (final (i, step) in s.list('request.how').indexed)
                Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: C.paper, borderRadius: BorderRadius.circular(10)),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    CircleAvatar(radius: 13, backgroundColor: C.sea, child: Text('${i + 1}', style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700))),
                    const SizedBox(width: 10),
                    Expanded(child: Text(step, style: const TextStyle(fontSize: 15))),
                  ]),
                ),
              const SizedBox(height: 8),
              if (request != null) WaButton(label: s.t('request.button'), onPressed: () => openExternal(request)) else Notice(s.t('request.noTeam')),
            ]),
          ),
        ] else ...[
          FilledButton.icon(
            onPressed: () => context.push('/post?category=${service.categories.first}'),
            icon: const Icon(Icons.add, size: 18),
            label: Text(s.t('services.postHere')),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 40,
            child: ListView(scrollDirection: Axis.horizontal, children: [
              if (housing) ...[
                FilterChip(label: Text(s.t('trust.womenFilter')), selected: _women, onSelected: (v) => setState(() => _women = v)),
                const SizedBox(width: 8),
              ],
              ChoiceChip(label: Text(s.t('services.allCities')), selected: _city == null, onSelected: (_) => setState(() => _city = null)),
              for (final c in bundle.cities) ...[
                const SizedBox(width: 8),
                ChoiceChip(label: Text(c.name.of(s.lang)), selected: _city == c.slug, onSelected: (_) => setState(() => _city = c.slug)),
              ],
            ]),
          ),
          const SizedBox(height: 14),
          Loaded<List<Listing>>(
            key: ValueKey('$_city$_women'),
            future: bundle.repo.search(ListingFilter(categories: service.categories, city: _city, women: _women), DateTime.now()),
            builder: (context, listings) => listings.isEmpty
                ? Panel(
                    padding: const EdgeInsets.all(22),
                    child: Column(children: [
                      Text(s.t('services.emptyTitle'), textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 6),
                      Text(s.t('services.emptyBody'), textAlign: TextAlign.center, style: const TextStyle(color: C.inkSoft)),
                      if (team.isNotEmpty) ...[
                        const SizedBox(height: 14),
                        WaButton(label: s.t('services.askUs'), onPressed: () => openExternal(whatsappLink(team, s.t('services.askMessage', {'service': service.name.of(s.lang)})))),
                      ],
                    ]),
                  )
                : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(s.plural('search.results', listings.length), style: const TextStyle(color: C.inkSoft)),
                    const SizedBox(height: 10),
                    ListingGrid(listings: listings, now: DateTime.now()),
                  ]),
          ),
          const SizedBox(height: 20),
          Panel(
            child: Row(children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.t('services.providerTitle'), style: Theme.of(context).textTheme.titleMedium),
                  Text(s.t('services.providerBody'), style: Theme.of(context).textTheme.bodySmall),
                ]),
              ),
              const SizedBox(width: 10),
              OutlinedButton(onPressed: () => context.push('/post?category=${service.categories.first}'), child: Text(s.t('services.listFree'))),
            ]),
          ),
        ],
        SectionHeader(s.t('services.related')),
        for (final other in bundle.services.where((x) => x.group == service.group && x.slug != service.slug)) ServiceRow(service: other),
      ],
    );
  }
}

class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return AppPage(children: [
      const SizedBox(height: 40),
      Text(s.t('notFound.title'), textAlign: TextAlign.center, style: Theme.of(context).textTheme.headlineMedium),
      const SizedBox(height: 8),
      Text(s.t('notFound.body'), textAlign: TextAlign.center, style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 20),
      Center(child: FilledButton(onPressed: () => context.go('/'), child: Text(s.t('notFound.home')))),
    ]);
  }
}
