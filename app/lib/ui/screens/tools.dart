import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/format.dart';
import '../../core/i18n.dart';
import '../../core/logic/course.dart';
import '../../core/logic/listings.dart';
import '../../core/logic/permit.dart' show daysUntil, dateOnly;
import '../../core/logic/prices.dart';
import '../../core/logic/share_text.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';
import '../widgets/service_widgets.dart';
import 'services.dart' show NotFoundScreen;

/// Tools and guides: help that works without an account or the database.
class ToolsScreen extends StatelessWidget {
  const ToolsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return AppPage(
      title: s.t('tools.title'),
      children: [
        Text(s.t('tools.intro'), style: const TextStyle(color: C.inkSoft)),
        const SizedBox(height: 16),
        for (final tool in context.bundle.tools) ToolTile(tool: tool),
        ToolTile(tool: Tool('safety', 'check', _same(s.t('nav.safety')), _same(s.t('safety.intro')))),
      ],
    );
  }
}

/// A text already in the current language, shown as a Loc.
Loc _same(String text) => Loc({'tr': text, 'en': text, 'ar': text});

class SafetyScreen extends StatelessWidget {
  const SafetyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return AppPage(title: s.t('safety.title'), children: [
      Text(s.t('safety.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 12),
      OutlinedButton.icon(
        onPressed: () => context.push('/emergency'),
        style: OutlinedButton.styleFrom(foregroundColor: C.alert),
        icon: const Icon(Icons.emergency_outlined),
        label: Text('${s.t('emergency.title')} · 155 · 112 · 199'),
      ),
      const SizedBox(height: 12),
      for (final tip in s.list('safety.tips'))
        Padding(padding: const EdgeInsets.only(bottom: 8), child: Panel(padding: const EdgeInsets.all(14), child: Text(tip, style: const TextStyle(fontWeight: FontWeight.w500)))),
      SectionHeader(s.t('safety.meetTitle')),
      for (final place in s.list('safety.meetPlaces')) ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.place_outlined, color: C.sea), title: Text(place)),
      SectionHeader(s.t('safety.scamTitle')),
      Notice(s.t('safety.scamBody'), alert: true),
    ]);
  }
}

/// Numbers to call, big enough to tap in a hurry.
class EmergencyScreen extends StatelessWidget {
  const EmergencyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return AppPage(title: s.t('emergency.title'), children: [
      Text(s.t('emergency.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      for (final e in context.bundle.emergency)
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Panel(
            onTap: () => openExternal('tel:${e.number}'),
            child: Row(children: [
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(e.name.of(s.lang), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                  Text(s.t('emergency.call'), style: Theme.of(context).textTheme.bodySmall),
                ]),
              ),
              Text(e.number, textDirection: TextDirection.ltr, style: const TextStyle(color: C.alert, fontSize: 32, fontWeight: FontWeight.w700)),
            ]),
          ),
        ),
      Text(s.t('emergency.fallback'), style: Theme.of(context).textTheme.bodySmall),
      const SizedBox(height: 14),
      Panel(child: _titled(context, s.t('emergency.pharmacyTitle'), s.t('emergency.pharmacyBody'))),
      const SizedBox(height: 8),
      Panel(child: _titled(context, s.t('emergency.embassyTitle'), s.t('emergency.embassyBody'))),
    ]);
  }
}

Widget _titled(BuildContext context, String title, String body) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: 4),
      Text(body, style: const TextStyle(color: C.inkSoft)),
    ]);

/// Student questions: banks, deposits, visas and permits; anything else goes to a person.
class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final team = AppBundle.teamWhatsapp;
    return AppPage(title: s.t('help.title'), children: [
      Text(s.t('help.intro'), style: const TextStyle(color: C.inkSoft, fontSize: 15.5, height: 1.45)),
      for (final topic in context.bundle.help) ...[
        Padding(
          padding: const EdgeInsets.only(top: 24, bottom: 10),
          child: Row(children: [
            IconBadge(iconFor(topic.icon), size: 36),
            const SizedBox(width: 10),
            Expanded(child: Text(topic.title.of(s.lang), style: Theme.of(context).textTheme.titleLarge)),
          ]),
        ),
        for (final answer in topic.answers)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Panel(
              padding: EdgeInsets.zero,
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  title: Text(answer.q.of(s.lang), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                  childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
                  expandedCrossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(answer.a.of(s.lang), style: const TextStyle(height: 1.5)),
                    if (answer.link != null)
                      TextButton(style: TextButton.styleFrom(padding: EdgeInsets.zero), onPressed: () => openPage(context, answer.link!), child: Text(s.t('help.more'))),
                  ],
                ),
              ),
            ),
          ),
      ],
      const SizedBox(height: 16),
      Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: C.ink, borderRadius: BorderRadius.circular(16)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(s.t('help.notHere'), style: const TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(s.t('help.notHereBody'), style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 14),
          if (team.isNotEmpty)
            WaButton(label: s.t('help.ask'), onPressed: () => openExternal(whatsappLink(team, s.t('help.askMessage'))))
          else
            Text(s.t('request.noTeam'), style: const TextStyle(color: Colors.white60)),
        ]),
      ),
      const SizedBox(height: 14),
      Notice(s.t('help.disclaimer')),
    ]);
  }
}

class GuidesScreen extends StatelessWidget {
  const GuidesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return AppPage(title: s.t('guides.title'), children: [
      Text(s.t('guides.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      for (final g in context.bundle.guides)
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Panel(
            onTap: () => context.push('/guides/${g.slug}'),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              IconBadge(iconFor(g.icon), size: 40),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(g.title.of(s.lang), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                  const SizedBox(height: 2),
                  Text(g.intro.of(s.lang), style: Theme.of(context).textTheme.bodySmall),
                ]),
              ),
            ]),
          ),
        ),
    ]);
  }
}

class GuideScreen extends StatelessWidget {
  const GuideScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final guide = context.bundle.guide(slug);
    if (guide == null) return const NotFoundScreen();
    return AppPage(title: guide.title.of(s.lang), children: [
      Heading(guide.title.of(s.lang), intro: guide.intro.of(s.lang)),
      for (final (i, step) in guide.steps.indexed)
        StepRow(n: i + 1, text: step.text.of(s.lang), onTap: step.link == null ? null : () => openPage(context, step.link!)),
      if (guide.example != null) ...[
        const SizedBox(height: 8),
        Text(s.t('guides.example').toUpperCase(), style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600, letterSpacing: 0.6)),
        const SizedBox(height: 6),
        Panel(child: Directionality(textDirection: TextDirection.ltr, child: SelectableText(guide.example!, style: const TextStyle(fontSize: 15, height: 1.5)))),
      ],
      const SizedBox(height: 16),
      Notice(s.t('guides.disclaimer')),
      SectionHeader(s.t('guides.more')),
      Wrap(spacing: 8, runSpacing: 8, children: [
        for (final g in context.bundle.guides.where((x) => x.slug != slug))
          ActionChip(label: Text(g.title.of(s.lang)), onPressed: () => context.push('/guides/${g.slug}')),
      ]),
    ]);
  }
}

/// Typical prices from the live ads (ENH-31).
class PricesScreen extends StatelessWidget {
  const PricesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    return AppPage(title: s.t('prices.title'), children: [
      Text(s.t('prices.intro'), style: const TextStyle(color: C.inkSoft)),
      Loaded<List<Listing>>(
        future: bundle.repo.search(const ListingFilter(), DateTime.now()),
        builder: (context, all) {
          final rows = priceIndex(all);
          if (rows.isEmpty) return Padding(padding: const EdgeInsets.only(top: 16), child: Notice(s.t('prices.empty')));
          return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            for (final group in ['rent', 'dorm', 'car'])
              if (rows.any((r) => r.group == group)) ...[
                SectionHeader(s.t('prices.$group')),
                Panel(
                  padding: EdgeInsets.zero,
                  child: Column(children: [
                    for (final r in rows.where((r) => r.group == group))
                      ListTile(
                        tileColor: r.city == null ? C.paper : null,
                        title: Text(r.city == null ? s.t('prices.island') : bundle.cityName(r.city!, s.lang), style: TextStyle(fontWeight: r.city == null ? FontWeight.w700 : FontWeight.w400)),
                        subtitle: Text('${formatMoney(r.low, r.currency, s.lang)} – ${formatMoney(r.high, r.currency, s.lang)} · ${r.count} ${s.t('prices.count')}'),
                        trailing: Text(formatMoney(r.median, r.currency, s.lang), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
                      ),
                  ]),
                ),
              ],
            const SizedBox(height: 12),
            Text(s.t('prices.note'), style: Theme.of(context).textTheme.bodySmall),
          ]);
        },
      ),
    ]);
  }
}

/// Books and notes by course code (BUY-06).
class BooksScreen extends StatefulWidget {
  const BooksScreen({super.key, this.initialCourse});

  final String? initialCourse;

  @override
  State<BooksScreen> createState() => _BooksScreenState();
}

class _BooksScreenState extends State<BooksScreen> {
  late final _input = TextEditingController(text: widget.initialCourse ?? '');
  late String _course = normalizeCourse(widget.initialCourse ?? '');

  @override
  void dispose() {
    _input.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final repo = context.bundle.repo;
    final now = DateTime.now();
    return AppPage(title: s.t('books.title'), children: [
      Text(s.t('books.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      TextField(
        controller: _input,
        textCapitalization: TextCapitalization.characters,
        textInputAction: TextInputAction.search,
        onSubmitted: (v) => setState(() => _course = normalizeCourse(v)),
        decoration: InputDecoration(hintText: s.t('books.placeholder'), prefixIcon: const Icon(Icons.search)),
      ),
      Loaded<List<Listing>>(
        key: ValueKey(_course),
        future: repo.search(const ListingFilter(), now),
        builder: (context, all) {
          final known = {for (final l in all) ...courseCodesIn('${l.title} ${l.description}')}.toList()..sort();
          final found = _course.isEmpty ? <Listing>[] : all.where((l) => courseCodesIn('${l.title} ${l.description}').contains(_course)).toList();
          return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            const SizedBox(height: 14),
            Text(s.t('books.courses').toUpperCase(), style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (final code in known)
                ChoiceChip(
                  label: Text(code),
                  selected: code == _course,
                  onSelected: (_) => setState(() {
                    _course = code;
                    _input.text = code;
                  }),
                ),
            ]),
            const SizedBox(height: 16),
            if (_course.isNotEmpty && found.isEmpty)
              Panel(child: Column(children: [
                Text(s.t('books.none', {'code': _course}), textAlign: TextAlign.center),
                const SizedBox(height: 12),
                FilledButton(onPressed: () => context.go('/post?kind=wanted&category=books'), child: Text(s.t('search.postWanted'))),
              ]))
            else if (found.isNotEmpty) ...[
              Text(s.plural('search.results', found.length), style: const TextStyle(color: C.inkSoft)),
              const SizedBox(height: 10),
              ListingGrid(listings: found, now: now),
            ],
          ]);
        },
      ),
    ]);
  }
}

/// A new arrival's plan from today's real ads (ARR-06).
class PlanScreen extends StatefulWidget {
  const PlanScreen({super.key});

  @override
  State<PlanScreen> createState() => _PlanScreenState();
}

class _PlanScreenState extends State<PlanScreen> {
  String _city = 'famagusta';
  final _budget = TextEditingController(text: '300');
  DateTime? _date;
  bool _made = false;

  @override
  void dispose() {
    _budget.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final now = DateTime.now();
    final budget = int.tryParse(_budget.text);
    final days = _date == null ? null : daysUntil(dateOnly(_date!), dateOnly(now));
    return AppPage(title: s.t('plan.title'), children: [
      Text(s.t('plan.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          DropdownButtonFormField<String>(
            initialValue: _city,
            decoration: InputDecoration(labelText: s.t('plan.city')),
            items: [for (final c in bundle.cities) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
            onChanged: (v) => setState(() => _city = v!),
          ),
          const SizedBox(height: 10),
          TextField(controller: _budget, keyboardType: TextInputType.number, decoration: InputDecoration(labelText: s.t('plan.budget'))),
          const SizedBox(height: 10),
          OutlinedButton.icon(
            icon: const Icon(Icons.event_outlined),
            label: Text(_date == null ? s.t('plan.date') : formatDay(_date!, s.lang)),
            onPressed: () async {
              final picked = await showDatePicker(context: context, firstDate: now, lastDate: now.add(const Duration(days: 730)), initialDate: _date ?? now.add(const Duration(days: 30)));
              if (picked != null) setState(() => _date = picked);
            },
          ),
          const SizedBox(height: 12),
          FilledButton(onPressed: () => setState(() => _made = true), child: Text(s.t('plan.make'))),
        ]),
      ),
      if (_made && budget != null) ...[
        if (days != null && days > 0)
          Padding(
            padding: const EdgeInsets.only(top: 16),
            child: Align(
              alignment: AlignmentDirectional.centerStart,
              child: Chip(label: Text(s.t('plan.daysLeft', {'n': days}), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600)), backgroundColor: C.ink),
            ),
          ),
        SectionHeader(s.t('plan.rooms')),
        Loaded<List<Listing>>(
          key: ValueKey('$_city$budget'),
          future: bundle.repo.search(ListingFilter(categories: const ['rooms', 'roommates', 'dorms'], city: _city, kind: 'offer', currency: 'GBP', max: budget, sort: 'cheapest'), now),
          builder: (context, rooms) => rooms.isEmpty
              ? Panel(child: Column(children: [
                  Text(s.t('plan.none'), textAlign: TextAlign.center),
                  const SizedBox(height: 12),
                  FilledButton(onPressed: () => context.go('/post?kind=wanted&category=rooms'), child: Text(s.t('search.postWanted'))),
                ]))
              : ListingGrid(listings: rooms.take(8).toList(), now: now),
        ),
        Loaded<List<Listing>>(
          future: bundle.repo.search(const ListingFilter(categories: ['arrival']), now),
          builder: (context, help) => help.isEmpty
              ? const SizedBox.shrink()
              : Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [SectionHeader(s.t('plan.help')), ListingGrid(listings: help.take(4).toList(), now: now)]),
        ),
        SectionHeader(s.t('plan.checklist')),
        for (final (i, step) in bundle.guide('arrival')!.steps.indexed)
          StepRow(n: i + 1, text: step.text.of(s.lang), onTap: step.link == null ? null : () => openPage(context, step.link!)),
      ],
    ]);
  }
}
