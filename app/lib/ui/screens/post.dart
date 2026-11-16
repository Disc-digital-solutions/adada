import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/format.dart';
import '../../core/logic/parse_post.dart';
import '../../core/logic/share_text.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';
import '../widgets/motion.dart';

const _housing = ['rooms', 'roommates', 'dorms'];
const _maxPhotos = 8;

/// A photo picked from the phone, with its bytes ready to show.
class _Picked {
  _Picked(this.file, this.bytes);
  final XFile file;
  final Uint8List bytes;
}

/// Post an ad, one step at a time: start fast by pasting a group post, then what it is, the price,
/// where, photos, and a preview exactly as buyers will see it. Until the database is connected the
/// ad goes to the team's WhatsApp line, as text, or with the photos through the phone's share menu.
class PostScreen extends StatefulWidget {
  const PostScreen({super.key, this.initialKind, this.initialCategory});

  final String? initialKind;
  final String? initialCategory;

  @override
  State<PostScreen> createState() => _PostScreenState();
}

class _PostScreenState extends State<PostScreen> {
  static const _steps = ['app.stepPaste', 'app.stepWhat', 'app.stepPrice', 'app.stepWhere', 'app.stepPhotos', 'app.stepPreview'];

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
  final _photos = <_Picked>[];
  int _step = 0;
  int _direction = 1;
  bool _tried = false;

  @override
  void dispose() {
    for (final c in [_paste, _title, _price, _description]) {
      c.dispose();
    }
    super.dispose();
  }

  void _goTo(int step) {
    setState(() {
      _direction = step > _step ? 1 : -1;
      _step = step;
      _tried = false;
    });
  }

  /// What is missing on the current step, if anything.
  bool get _stepValid => switch (_step) {
        1 => _title.text.trim().isNotEmpty && _category != null,
        _ => true,
      };

  void _next() {
    if (!_stepValid) {
      setState(() => _tried = true);
      HapticFeedback.mediumImpact();
      return;
    }
    _goTo(_step + 1);
  }

  void _fill() {
    final bundle = context.bundle;
    final found = parsePost(_paste.text, bundle.parseWords, categories: [for (final c in bundle.repo.categories) c.slug]);
    if (found.title.isEmpty) {
      setState(() => _pasteStatus = 'post.pasteNothing');
      return;
    }
    HapticFeedback.lightImpact();
    setState(() {
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
    _goTo(1);
  }

  Future<void> _pick(ImageSource source) async {
    final picker = ImagePicker();
    final files = source == ImageSource.camera
        ? [if (await picker.pickImage(source: source, maxWidth: 1600, imageQuality: 82) case final XFile f) f]
        : await picker.pickMultiImage(maxWidth: 1600, imageQuality: 82, limit: _maxPhotos - _photos.length);
    final picked = [for (final f in files) _Picked(f, await f.readAsBytes())];
    if (!mounted) return;
    setState(() => _photos.addAll(picked.take(_maxPhotos - _photos.length)));
  }

  String? get _priceText {
    final s = context.s;
    if (_free) return s.t('listing.free');
    final amount = int.tryParse(_price.text);
    return amount == null ? null : formatMoney(amount, _currency, s.lang);
  }

  String _message() {
    final s = context.s;
    final bundle = context.bundle;
    return teamAdMessage(
      intro: s.t('post.teamIntro', {'site': bundle.siteName}),
      kindLabel: s.t('post.teamKind'),
      kindValue: s.t(_kind == 'offer' ? 'post.selling' : 'post.looking'),
      titleLabel: s.t('post.titleLabel'),
      title: _title.text,
      priceLabel: s.t(_kind == 'wanted' ? 'listing.budget' : 'post.price'),
      price: _priceText,
      categoryLabel: s.t('post.category'),
      category: bundle.repo.categories.where((c) => c.slug == _category).firstOrNull?.name.of(s.lang) ?? '',
      cityLabel: s.t('post.city'),
      city: bundle.cityName(_city, s.lang),
      descriptionLabel: s.t('post.description'),
      description: _description.text,
      photosLine: s.t('post.teamPhotos'),
      hasPhotos: _kind == 'offer' && _photos.isEmpty,
      womenOnly: _housing.contains(_category) && _womenOnly ? s.t('trust.womenOnly') : null,
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final last = _step == _steps.length - 1;
    final rtl = s.direction == TextDirection.rtl;
    return AppPage(
      title: s.t('post.title'),
      bottomBar: Material(
        color: C.card,
        elevation: 8,
        shadowColor: Colors.black26,
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
            child: Row(children: [
              if (_step > 0) OutlinedButton(onPressed: () => _goTo(_step - 1), child: Text(s.t('app.back'))),
              const Spacer(),
              if (_step == 0)
                TextButton(onPressed: () => _goTo(1), child: Text(s.t('app.skipPaste')))
              else if (!last)
                FilledButton(onPressed: _next, child: Text(s.t('app.next'))),
            ]),
          ),
        ),
      ),
      children: [
        Text(s.t('app.stepOf', {'n': _step + 1, 'total': _steps.length}), style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 4),
        Text(s.t(_steps[_step]), style: Theme.of(context).textTheme.headlineMedium),
        const SizedBox(height: 10),
        // The bar fills smoothly from one step to the next.
        TweenAnimationBuilder<double>(
          tween: Tween(end: (_step + 1) / _steps.length),
          duration: Duration(milliseconds: reduceMotion(context) ? 0 : 350),
          curve: Curves.easeOutCubic,
          builder: (context, value, _) => ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(value: value, minHeight: 6, backgroundColor: C.line, color: C.sea),
          ),
        ),
        const SizedBox(height: 18),
        // Each step slides in from the side the person is moving towards.
        AnimatedSwitcher(
          duration: Duration(milliseconds: reduceMotion(context) ? 0 : 280),
          transitionBuilder: (child, animation) {
            final fromRight = (_direction > 0) != rtl;
            final offset = Tween(begin: Offset(fromRight ? 0.12 : -0.12, 0), end: Offset.zero).animate(animation);
            return FadeTransition(opacity: animation, child: SlideTransition(position: offset, child: child));
          },
          layoutBuilder: (current, previous) => Stack(alignment: Alignment.topCenter, children: [...previous, ?current]),
          child: KeyedSubtree(key: ValueKey(_step), child: _stepBody(context)),
        ),
      ],
    );
  }

  Widget _stepBody(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final team = AppBundle.teamWhatsapp.isNotEmpty;
    switch (_step) {
      case 0:
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Panel(
            color: C.seaWash.withValues(alpha: 0.5),
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(s.t('post.pasteTitle'), style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 4),
              Text(s.t('post.pasteHint'), style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(height: 10),
              TextField(controller: _paste, minLines: 4, maxLines: 8, onChanged: (_) => setState(() => _pasteStatus = null)),
              const SizedBox(height: 10),
              FilledButton.icon(onPressed: _paste.text.trim().isEmpty ? null : _fill, icon: const Icon(Icons.auto_fix_high, size: 18), label: Text(s.t('post.pasteButton'))),
              if (_pasteStatus != null) Padding(padding: const EdgeInsets.only(top: 8), child: Text(s.t(_pasteStatus!), style: Theme.of(context).textTheme.bodySmall)),
            ]),
          ),
          const SizedBox(height: 14),
          Notice(s.t(team ? 'post.whatsappNote' : 'post.notConnected')),
        ]);
      case 1:
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          if (_pasteStatus == 'post.pasteDone') Padding(padding: const EdgeInsets.only(bottom: 12), child: Notice(s.t('post.pasteDone'))),
          SegmentedButton<String>(
            segments: [ButtonSegment(value: 'offer', label: Text(s.t('post.selling'))), ButtonSegment(value: 'wanted', label: Text(s.t('post.looking')))],
            selected: {_kind},
            showSelectedIcon: false,
            onSelectionChanged: (v) => setState(() => _kind = v.first),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _title,
            maxLength: 80,
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              labelText: s.t('post.titleLabel'),
              hintText: s.t('post.titleHint'),
              errorText: _tried && _title.text.trim().isEmpty ? s.t('post.titleLabel') : null,
            ),
          ),
          DropdownButtonFormField<String>(
            key: ValueKey(_category),
            initialValue: _category,
            isExpanded: true,
            decoration: InputDecoration(labelText: s.t('post.category'), errorText: _tried && _category == null ? s.t('post.category') : null),
            items: [for (final c in bundle.repo.categories) DropdownMenuItem(value: c.slug, child: Text(c.name.of(s.lang)))],
            onChanged: (v) => setState(() => _category = v),
          ),
        ]);
      case 2:
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            Expanded(
              child: TextField(
                controller: _price,
                enabled: !_free,
                keyboardType: TextInputType.number,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
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
        ]);
      case 3:
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
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
          TextField(
            controller: _description,
            minLines: 5,
            maxLines: 10,
            maxLength: 1500,
            decoration: InputDecoration(labelText: s.t('post.description'), hintText: s.t('post.descriptionHint'), alignLabelWithHint: true),
          ),
          Text(s.t('post.banned'), style: Theme.of(context).textTheme.bodySmall),
        ]);
      case 4:
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(s.t('app.photosNote'), style: const TextStyle(color: C.inkSoft)),
          const SizedBox(height: 12),
          if (_photos.isNotEmpty)
            SizedBox(
              height: 112,
              // Hold and drag to change the order; the first photo is the cover.
              child: ReorderableListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _photos.length,
                onReorderItem: (from, to) => setState(() => _photos.insert(to, _photos.removeAt(from))),
                itemBuilder: (context, i) => Padding(
                  key: ObjectKey(_photos[i]),
                  padding: const EdgeInsetsDirectional.only(end: 8),
                  child: Stack(children: [
                    ClipRRect(borderRadius: BorderRadius.circular(10), child: Image.memory(_photos[i].bytes, width: 112, height: 112, fit: BoxFit.cover)),
                    if (i == 0)
                      PositionedDirectional(
                        bottom: 6,
                        start: 6,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: C.ink, borderRadius: BorderRadius.circular(5)),
                          child: const Icon(Icons.star, size: 12, color: C.tag),
                        ),
                      ),
                    PositionedDirectional(
                      top: 4,
                      end: 4,
                      child: GestureDetector(
                        onTap: () => setState(() => _photos.removeAt(i)),
                        child: const CircleAvatar(radius: 12, backgroundColor: Colors.white, child: Icon(Icons.close, size: 15, color: C.ink)),
                      ),
                    ),
                  ]),
                ),
              ),
            ),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _photos.length >= _maxPhotos ? null : () => _pick(ImageSource.gallery),
                icon: const Icon(Icons.photo_library_outlined),
                label: Text(s.t('app.addPhotos')),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _photos.length >= _maxPhotos ? null : () => _pick(ImageSource.camera),
                icon: const Icon(Icons.photo_camera_outlined),
                label: Text(s.t('app.takePhoto')),
              ),
            ),
          ]),
        ]);
      default:
        return _preview(context);
    }
  }

  /// The ad exactly as a buyer will see it in a list, then the ways to send it.
  Widget _preview(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final team = AppBundle.teamWhatsapp;
    final price = _priceText;
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(s.t('app.previewNote'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 12),
      Center(
        child: SizedBox(
          width: 240,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            AspectRatio(
              aspectRatio: 4 / 3,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: _photos.isNotEmpty
                    ? Image.memory(_photos.first.bytes, fit: BoxFit.cover)
                    : _kind == 'wanted'
                        ? Container(color: C.seaWash, padding: const EdgeInsets.all(12), alignment: AlignmentDirectional.centerStart, child: Text('“${_title.text}”', style: const TextStyle(color: C.seaDeep, fontWeight: FontWeight.w600)))
                        : ServiceArt(category: _category ?? 'other'),
              ),
            ),
            const SizedBox(height: 8),
            if (price != null) Text(price, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700)),
            Text(_title.text, maxLines: 2, overflow: TextOverflow.ellipsis),
            Text(bundle.cityName(_city, s.lang), style: Theme.of(context).textTheme.bodySmall),
          ]),
        ),
      ),
      const SizedBox(height: 22),
      if (team.isEmpty) ...[
        Notice(s.t('post.notConnected')),
      ] else ...[
        WaButton(label: s.t('post.submitWhatsapp'), onPressed: () => openExternal(whatsappLink(team, _message()))),
        if (_photos.isNotEmpty) ...[
          const SizedBox(height: 8),
          OutlinedButton.icon(
            icon: const Icon(Icons.ios_share),
            label: Text(s.t('app.sendWithPhotos')),
            onPressed: () => SharePlus.instance.share(ShareParams(text: _message(), files: [for (final p in _photos) p.file])),
          ),
          const SizedBox(height: 6),
          Text(s.t('app.sendWithPhotosNote'), style: Theme.of(context).textTheme.bodySmall),
        ],
      ],
    ]);
  }
}
