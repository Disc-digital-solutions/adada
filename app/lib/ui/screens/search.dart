import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/logic/listings.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';

/// Search: words, category, city, selling or wanted, women only, price inside one currency, sort.
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
  bool _showFilters = false;

  @override
  void dispose() {
    _query.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final f = _filter;
    DropdownMenuItem<String?> any(String key) => DropdownMenuItem(value: null, child: Text(s.t(key)));

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
              tooltip: s.t('search.category'),
              icon: Icon(_showFilters ? Icons.tune : Icons.tune_outlined, color: _showFilters ? C.sea : null),
              onPressed: () => setState(() => _showFilters = !_showFilters),
            ),
          ),
        ),
        if (_showFilters) ...[
          const SizedBox(height: 12),
          Panel(
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              DropdownButtonFormField<String?>(
                initialValue: f.category,
                isExpanded: true,
                decoration: InputDecoration(labelText: s.t('search.category')),
                items: [any('search.anyCategory'), for (final c in bundle.repo.categories) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
                onChanged: (v) => setState(() => _filter = f.copyWith(category: v, clearCategory: v == null)),
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String?>(
                initialValue: f.city,
                isExpanded: true,
                decoration: InputDecoration(labelText: s.t('search.city')),
                items: [any('search.anyCity'), for (final c in bundle.cities) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
                onChanged: (v) => setState(() => _filter = f.copyWith(city: v, clearCity: v == null)),
              ),
              const SizedBox(height: 10),
              SegmentedButton<String?>(
                segments: [
                  ButtonSegment(value: null, label: Text(s.t('search.anyKind'))),
                  ButtonSegment(value: 'offer', label: Text(s.t('search.offers'))),
                  ButtonSegment(value: 'wanted', label: Text(s.t('search.wanted'))),
                ],
                selected: {f.kind},
                showSelectedIcon: false,
                onSelectionChanged: (v) => setState(() => _filter = f.copyWith(kind: v.first, clearKind: v.first == null)),
              ),
              const SizedBox(height: 10),
              Row(children: [
                Expanded(
                  child: DropdownButtonFormField<String?>(
                    initialValue: f.currency,
                    decoration: InputDecoration(labelText: s.t('search.currency')),
                    items: [any('search.anyCurrency'), for (final c in currencies) DropdownMenuItem(value: c, child: Text(c))],
                    onChanged: (v) => setState(() => _filter = f.copyWith(currency: v, clearCurrency: v == null)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(labelText: s.t('search.min')),
                    onChanged: (v) => setState(() => _filter = f.copyWith(min: int.tryParse(v), clearMin: int.tryParse(v) == null)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(labelText: s.t('search.max')),
                    onChanged: (v) => setState(() => _filter = f.copyWith(max: int.tryParse(v), clearMax: int.tryParse(v) == null)),
                  ),
                ),
              ]),
              Text(s.t('search.priceHint'), style: Theme.of(context).textTheme.bodySmall),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: Text(s.t('trust.womenFilter')),
                value: f.women,
                onChanged: (v) => setState(() => _filter = f.copyWith(women: v)),
              ),
              DropdownButtonFormField<String>(
                initialValue: f.sort,
                decoration: InputDecoration(labelText: s.t('search.sort')),
                items: [
                  for (final key in ['newest', 'cheapest', 'dearest']) DropdownMenuItem(value: key, child: Text(s.t('search.$key'))),
                ],
                onChanged: (v) => setState(() => _filter = f.copyWith(sort: v)),
              ),
              const SizedBox(height: 8),
              OutlinedButton(
                onPressed: () => setState(() {
                  _query.clear();
                  _filter = const ListingFilter();
                }),
                child: Text(s.t('search.clear')),
              ),
            ]),
          ),
        ],
        const SizedBox(height: 16),
        Loaded<List<Listing>>(
          key: ValueKey(Object.hash(f.q, f.category, f.city, f.kind, f.currency, f.min, f.max, f.women, f.sort)),
          future: bundle.repo.search(f, DateTime.now()),
          builder: (context, listings) => listings.isEmpty
              ? Panel(
                  padding: const EdgeInsets.all(24),
                  child: Column(children: [
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
}
