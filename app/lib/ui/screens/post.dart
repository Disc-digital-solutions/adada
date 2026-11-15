import 'package:flutter/material.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/format.dart';
import '../../core/logic/parse_post.dart';
import '../../core/logic/share_text.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';

const _housing = ['rooms', 'roommates', 'dorms'];

/// Post an ad. Paste the post already written for a group and the form fills itself in.
/// Until the database is connected, the finished ad goes to the team's WhatsApp line and a person
/// publishes it ("by hand before by code"); without a team number, sending stays off.
class PostScreen extends StatefulWidget {
  const PostScreen({super.key, this.initialKind, this.initialCategory});

  final String? initialKind;
  final String? initialCategory;

  @override
  State<PostScreen> createState() => _PostScreenState();
}

class _PostScreenState extends State<PostScreen> {
  final _form = GlobalKey<FormState>();
  final _paste = TextEditingController();
  final _title = TextEditingController();
  final _price = TextEditingController();
  final _description = TextEditingController();
  late String _kind = widget.initialKind == 'wanted' ? 'wanted' : 'offer';
  String _currency = 'TRY';
  bool _free = false;
  late String? _category = widget.initialCategory;
  String _city = 'famagusta';
  bool _womenOnly = false;
  String? _pasteStatus;

  @override
  void dispose() {
    for (final c in [_paste, _title, _price, _description]) {
      c.dispose();
    }
    super.dispose();
  }

  void _fill() {
    final bundle = context.bundle;
    final found = parsePost(_paste.text, bundle.parseWords, categories: [for (final c in bundle.repo.categories) c.slug]);
    setState(() {
      if (found.title.isEmpty) {
        _pasteStatus = 'post.pasteNothing';
        return;
      }
      _kind = found.kind;
      _title.text = found.title;
      _description.text = found.description;
      if (found.price == 0) {
        _free = true;
        _price.clear();
      } else if (found.price != null) {
        _free = false;
        _price.text = '${found.price}';
        if (found.currency != null) _currency = found.currency!;
      }
      if (found.city != null) _city = found.city!;
      if (found.category != null) _category = found.category;
      if (found.womenOnly) _womenOnly = true;
      _pasteStatus = 'post.pasteDone';
    });
  }

  void _send() {
    if (!_form.currentState!.validate()) return;
    final s = context.s;
    final bundle = context.bundle;
    final amount = int.tryParse(_price.text);
    final category = bundle.repo.categories.where((c) => c.slug == _category).firstOrNull;
    final message = teamAdMessage(
      intro: s.t('post.teamIntro', {'site': bundle.siteName}),
      kindLabel: s.t('post.teamKind'),
      kindValue: s.t(_kind == 'offer' ? 'post.selling' : 'post.looking'),
      titleLabel: s.t('post.titleLabel'),
      title: _title.text,
      priceLabel: s.t(_kind == 'wanted' ? 'listing.budget' : 'post.price'),
      price: _free ? s.t('listing.free') : (amount != null ? formatMoney(amount, _currency, s.lang) : null),
      categoryLabel: s.t('post.category'),
      category: category?.name.of(s.lang) ?? '',
      cityLabel: s.t('post.city'),
      city: bundle.cityName(_city, s.lang),
      descriptionLabel: s.t('post.description'),
      description: _description.text,
      photosLine: s.t('post.teamPhotos'),
      hasPhotos: _kind == 'offer',
      womenOnly: _housing.contains(_category) && _womenOnly ? s.t('trust.womenOnly') : null,
    );
    openExternal(whatsappLink(AppBundle.teamWhatsapp, message));
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final team = AppBundle.teamWhatsapp.isNotEmpty;
    return AppPage(
      title: s.t('post.title'),
      children: [
        Panel(
          color: C.seaWash.withValues(alpha: 0.5),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text(s.t('post.pasteTitle'), style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(s.t('post.pasteHint'), style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 10),
            TextField(controller: _paste, minLines: 3, maxLines: 6, onChanged: (_) => setState(() => _pasteStatus = null)),
            const SizedBox(height: 10),
            Row(children: [
              OutlinedButton(onPressed: _paste.text.trim().isEmpty ? null : _fill, child: Text(s.t('post.pasteButton'))),
              const SizedBox(width: 12),
              if (_pasteStatus != null) Expanded(child: Text(s.t(_pasteStatus!), style: Theme.of(context).textTheme.bodySmall)),
            ]),
          ]),
        ),
        const SizedBox(height: 16),
        Notice(s.t(team ? 'post.whatsappNote' : 'post.notConnected')),
        const SizedBox(height: 16),
        Form(
          key: _form,
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            SegmentedButton<String>(
              segments: [
                ButtonSegment(value: 'offer', label: Text(s.t('post.selling'))),
                ButtonSegment(value: 'wanted', label: Text(s.t('post.looking'))),
              ],
              selected: {_kind},
              showSelectedIcon: false,
              onSelectionChanged: (v) => setState(() => _kind = v.first),
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _title,
              maxLength: 80,
              decoration: InputDecoration(labelText: s.t('post.titleLabel'), hintText: s.t('post.titleHint')),
              validator: (v) => (v ?? '').trim().isEmpty ? s.t('post.titleLabel') : null,
            ),
            Row(children: [
              Expanded(
                child: TextFormField(
                  controller: _price,
                  enabled: !_free,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: s.t(_kind == 'wanted' ? 'listing.budget' : 'post.price')),
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(
                width: 110,
                child: DropdownButtonFormField<String>(
                  initialValue: _currency,
                  items: [for (final c in currencies) DropdownMenuItem(value: c, child: Text(c))],
                  onChanged: _free ? null : (v) => setState(() => _currency = v!),
                ),
              ),
            ]),
            if (_kind == 'offer')
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(s.t('post.freeToggle')),
                value: _free,
                onChanged: (v) => setState(() => _free = v ?? false),
              ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              key: ValueKey(_category),
              initialValue: _category,
              isExpanded: true,
              decoration: InputDecoration(labelText: s.t('post.category')),
              items: [for (final c in bundle.repo.categories) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
              onChanged: (v) => setState(() => _category = v),
              validator: (v) => v == null ? s.t('post.category') : null,
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              key: ValueKey(_city),
              initialValue: _city,
              decoration: InputDecoration(labelText: s.t('post.city')),
              items: [for (final c in bundle.cities) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
              onChanged: (v) => setState(() => _city = v!),
            ),
            if (_housing.contains(_category))
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                controlAffinity: ListTileControlAffinity.leading,
                title: Text(s.t('trust.womenFilter')),
                value: _womenOnly,
                onChanged: (v) => setState(() => _womenOnly = v ?? false),
              ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _description,
              minLines: 4,
              maxLines: 8,
              maxLength: 1500,
              decoration: InputDecoration(labelText: s.t('post.description'), hintText: s.t('post.descriptionHint'), alignLabelWithHint: true),
            ),
            Text(s.t('post.banned'), style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 16),
            if (team)
              WaButton(label: s.t('post.submitWhatsapp'), onPressed: _send)
            else
              FilledButton(onPressed: null, child: Text(s.t('post.submit'))),
          ]),
        ),
      ],
    );
  }
}
