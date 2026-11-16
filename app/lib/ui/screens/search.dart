import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/i18n.dart';
import '../../core/logic/listings.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';

/// Search: words at the top; filters in a sheet that slides up, with the number of results
/// updating as you choose; the active filters as chips you can remove with one tap.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key, this.initialQuery, this.initialKind, this.initialCategory, this.initialWomen = false});

  final String? initialQuery;
  final String? initialKind;
  final String? initialCategory;
  final bool initialWomen;

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  late final _query = TextEditingController(text: widget.initialQuery ?? '');
  late ListingFilter _filter = ListingFilter(
    q: widget.initialQuery,
    kind: widget.initialKind,
    category: widget.initialCategory,
    women: widget.initialWomen,
  );

  @override
  void dispose() {
    _query.dispose();
    super.dispose();
  }

  Future<void> _openFilters() async {
    final chosen = await showModalBottomSheet<ListingFilter>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: C.card,
      builder: (_) => _FilterSheet(start: _filter, bundle: context.bundle, strings: context.s),
    );
    if (chosen != null) setState(() => _filter = chosen);
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final f = _filter;
    final active = _activeChips(context, f);

    return AppPage(
      title: s.t('search.title'),
      children: [
        TextField(
          controller: _query,
          textInputAction: TextInputAction.search,
          onSubmitted: (v) => setState(() => _filter = f.copyWith(q: v.trim())),
          decoration: InputDecoration(
            hintText: s.t('search.placeholder'),
            prefixIcon: const Icon(Icons.search),
            suffixIcon: IconButton(
              tooltip: s.t('app.filters'),
              icon: Badge(isLabelVisible: active.isNotEmpty, label: Text('${active.length}'), child: const Icon(Icons.tune)),
              onPressed: _openFilters,
            ),
          ),
        ),
        if (active.isNotEmpty) ...[
          const SizedBox(height: 10),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final (label, clear) in active)
              InputChip(label: Text(label), onDeleted: () => setState(() => _filter = clear()), deleteIcon: const Icon(Icons.close, size: 16)),
          ]),
        ],
        const SizedBox(height: 16),
        Loaded<List<Listing>>(
          key: ValueKey(Object.hash(f.q, f.category, f.city, f.kind, f.currency, f.min, f.max, f.women, f.sort)),
          future: bundle.repo.search(f, DateTime.now()),
          builder: (context, listings) => listings.isEmpty
              ? Panel(
                  padding: const EdgeInsets.all(24),
                  child: Column(children: [
                    const Icon(Icons.search_off, size: 44, color: C.inkSoft),
                    const SizedBox(height: 10),
                    Text(s.t('search.emptyTitle'), textAlign: TextAlign.center, style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 6),
                    Text(s.t('search.emptyBody'), textAlign: TextAlign.center, style: const TextStyle(color: C.inkSoft)),
                    const SizedBox(height: 14),
                    FilledButton(onPressed: () => context.go('/post?kind=wanted'), child: Text(s.t('search.postWanted'))),
                  ]),
                )
              : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.plural('search.results', listings.length), style: const TextStyle(color: C.inkSoft)),
                  const SizedBox(height: 10),
                  ListingGrid(listings: listings, now: DateTime.now()),
                ]),
        ),
      ],
    );
  }

  /// Each active filter as a label and how to remove it.
  List<(String, ListingFilter Function())> _activeChips(BuildContext context, ListingFilter f) {
    final s = context.s;
    final bundle = context.bundle;
    String? categoryName(String? slug) => bundle.repo.categories.where((c) => c.slug == slug).firstOrNull?.name.of(s.lang);
    return [
      if (f.category != null) (categoryName(f.category) ?? f.category!, () => f.copyWith(clearCategory: true)),
      if (f.city != null) (bundle.cityName(f.city!, s.lang), () => f.copyWith(clearCity: true)),
      if (f.kind != null) (s.t(f.kind == 'wanted' ? 'search.wanted' : 'search.offers'), () => f.copyWith(clearKind: true)),
      if (f.currency != null)
        (
          [f.currency!, if (f.min != null) '≥ ${f.min}', if (f.max != null) '≤ ${f.max}'].join(' '),
          () => f.copyWith(clearCurrency: true, clearMin: true, clearMax: true),
        ),
      if (f.women) (s.t('trust.womenOnly'), () => f.copyWith(women: false)),
      if (f.sort != 'newest') (s.t('search.${f.sort}'), () => f.copyWith(sort: 'newest')),
    ];
  }
}

/// The filters, as chips in a sheet. The button counts the results live as you choose.
class _FilterSheet extends StatefulWidget {
  const _FilterSheet({required this.start, required this.bundle, required this.strings});

  final ListingFilter start;
  final AppBundle bundle;
  final Strings strings;

  @override
  State<_FilterSheet> createState() => _FilterSheetState();
}

class _FilterSheetState extends State<_FilterSheet> {
  late ListingFilter _f = widget.start;
  /// Categories start folded to the first ten; 41 chips at once is a wall.
  bool _allCategories = false;
  late final _min = TextEditingController(text: widget.start.min?.toString() ?? '');
  late final _max = TextEditingController(text: widget.start.max?.toString() ?? '');

  @override
  void dispose() {
    _min.dispose();
    _max.dispose();
    super.dispose();
  }

  Widget _label(String text) => Padding(
        padding: const EdgeInsets.only(top: 18, bottom: 8),
        child: Text(text, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      );

  @override
  Widget build(BuildContext context) {
    final s = widget.strings;
    final bundle = widget.bundle;
    return Directionality(
      textDirection: s.direction,
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.85,
        maxChildSize: 0.95,
        builder: (context, scroll) => Column(children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(children: [
              Expanded(child: Text(s.t('app.filters'), style: Theme.of(context).textTheme.titleLarge)),
              TextButton(
                onPressed: () => setState(() {
                  _f = ListingFilter(q: _f.q);
                  _min.clear();
                  _max.clear();
                }),
                child: Text(s.t('app.reset')),
              ),
            ]),
          ),
          Expanded(
            child: ListView(controller: scroll, padding: const EdgeInsets.fromLTRB(20, 0, 20, 20), children: [
              _label(s.t('search.kind')),
              Wrap(spacing: 8, children: [
                for (final (value, key) in [(null, 'search.anyKind'), ('offer', 'search.offers'), ('wanted', 'search.wanted')])
                  ChoiceChip(label: Text(s.t(key)), selected: _f.kind == value, onSelected: (_) => setState(() => _f = _f.copyWith(kind: value, clearKind: value == null))),
              ]),
              _label(s.t('search.city')),
              Wrap(spacing: 8, runSpacing: 8, children: [
                ChoiceChip(label: Text(s.t('search.anyCity')), selected: _f.city == null, onSelected: (_) => setState(() => _f = _f.copyWith(clearCity: true))),
                for (final c in bundle.cities)
                  ChoiceChip(label: Text(c.name.of(s.lang)), selected: _f.city == c.slug, onSelected: (_) => setState(() => _f = _f.copyWith(city: c.slug))),
              ]),
              _label(s.t('search.category')),
              AnimatedSize(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeOutCubic,
                alignment: Alignment.topCenter,
                child: Wrap(spacing: 8, runSpacing: 8, children: [
                  ChoiceChip(label: Text(s.t('search.anyCategory')), selected: _f.category == null, onSelected: (_) => setState(() => _f = _f.copyWith(clearCategory: true))),
                  for (final (i, c) in bundle.repo.categories.indexed)
                    if (_allCategories || i < 10 || _f.category == c.slug)
                      ChoiceChip(label: Text(c.name.of(s.lang)), selected: _f.category == c.slug, onSelected: (_) => setState(() => _f = _f.copyWith(category: c.slug))),
                  if (!_allCategories)
                    ActionChip(
                      avatar: const Icon(Icons.expand_more, size: 18),
                      label: Text(s.t('home.seeAllShort')),
                      onPressed: () => setState(() => _allCategories = true),
                    ),
                ]),
              ),
              _label(s.t('search.currency')),
              Wrap(spacing: 8, children: [
                ChoiceChip(label: Text(s.t('search.anyCurrency')), selected: _f.currency == null, onSelected: (_) => setState(() => _f = _f.copyWith(clearCurrency: true))),
                for (final c in currencies) ChoiceChip(label: Text(c), selected: _f.currency == c, onSelected: (_) => setState(() => _f = _f.copyWith(currency: c))),
              ]),
              if (_f.currency != null) ...[
                const SizedBox(height: 10),
                Row(children: [
                  Expanded(
                    child: TextField(
                      controller: _min,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(labelText: s.t('search.min')),
                      onChanged: (v) => setState(() => _f = _f.copyWith(min: int.tryParse(v), clearMin: int.tryParse(v) == null)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _max,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(labelText: s.t('search.max')),
                      onChanged: (v) => setState(() => _f = _f.copyWith(max: int.tryParse(v), clearMax: int.tryParse(v) == null)),
                    ),
                  ),
                ]),
              ] else
                Padding(padding: const EdgeInsets.only(top: 6), child: Text(s.t('search.priceHint'), style: Theme.of(context).textTheme.bodySmall)),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(s.t('trust.womenFilter'), style: const TextStyle(fontWeight: FontWeight.w600)),
                value: _f.women,
                onChanged: (v) => setState(() => _f = _f.copyWith(women: v)),
              ),
              _label(s.t('search.sort')),
              Wrap(spacing: 8, children: [
                for (final key in ['newest', 'cheapest', 'dearest'])
                  ChoiceChip(label: Text(s.t('search.$key')), selected: _f.sort == key, onSelected: (_) => setState(() => _f = _f.copyWith(sort: key))),
              ]),
            ]),
          ),
          // The button says how many ads the chosen filters will show, before applying them.
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
              child: FutureBuilder<List<Listing>>(
                future: bundle.repo.search(_f, DateTime.now()),
                builder: (context, snap) => SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: () => Navigator.pop(context, _f),
                    child: Text(snap.hasData ? s.plural('app.showResults', snap.data!.length) : s.t('search.apply')),
                  ),
                ),
              ),
            ),
          ),
        ]),
      ),
    );
  }
}
