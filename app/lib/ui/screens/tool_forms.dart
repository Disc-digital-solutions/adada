import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

import '../../core/app_state.dart';
import '../../core/format.dart';
import '../../core/logic/permit.dart';
import '../../core/logic/share_text.dart';
import '../../core/logic/split.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';

String _money(double n) => n == n.roundToDouble() ? n.toStringAsFixed(0) : n.toStringAsFixed(2);

/// Who pays whom in a shared flat (ROOM-08). Nothing is stored.
class SplitScreen extends StatefulWidget {
  const SplitScreen({super.key});

  @override
  State<SplitScreen> createState() => _SplitScreenState();
}

class _SplitScreenState extends State<SplitScreen> {
  final _people = <TextEditingController>[for (final n in ['A', 'B', 'C']) TextEditingController(text: n)];
  List<Bill>? _bills;

  @override
  void dispose() {
    for (final c in _people) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final examples = s.list('split.examples');
    final bills = _bills ??= [Bill(examples[0], 0, 900), Bill(examples[1], 1, 240), Bill(examples[2], 0, 450)];
    final names = [for (final (i, c) in _people.indexed) c.text.trim().isEmpty ? '#${i + 1}' : c.text.trim()];
    final transfers = settle(_people.length, bills);
    final total = bills.fold<double>(0, (sum, b) => sum + (b.amount > 0 ? b.amount : 0));
    final share = _people.isEmpty ? 0.0 : total / _people.length;
    final text = [
      s.t('split.title'),
      for (final b in bills.where((b) => b.amount > 0)) '• ${b.label}: ${_money(b.amount)} (${names[b.paidBy]})',
      '${s.t('split.share')}: ${_money(share)}',
      '',
      if (transfers.isEmpty) s.t('split.even'),
      for (final x in transfers) '→ ${s.t('split.pays', {'from': names[x.from], 'to': names[x.to]})}: ${_money(x.amount)}',
    ].join('\n');

    return AppPage(title: s.t('split.title'), children: [
      Text(s.t('split.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(s.t('split.people'), style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          for (final (i, c) in _people.indexed)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(children: [
                Expanded(child: TextField(controller: c, onChanged: (_) => setState(() {}), decoration: InputDecoration(labelText: s.t('split.name')))),
                if (_people.length > 2)
                  IconButton(
                    tooltip: s.t('split.remove'),
                    icon: const Icon(Icons.close),
                    onPressed: () => setState(() {
                      _people.removeAt(i).dispose();
                      for (final b in bills) {
                        b.paidBy = b.paidBy == i ? 0 : (b.paidBy > i ? b.paidBy - 1 : b.paidBy);
                      }
                    }),
                  ),
              ]),
            ),
          OutlinedButton.icon(onPressed: () => setState(() => _people.add(TextEditingController())), icon: const Icon(Icons.person_add_alt), label: Text(s.t('split.addPerson'))),
        ]),
      ),
      const SizedBox(height: 12),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(s.t('split.bills'), style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          for (final (i, b) in bills.indexed)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(children: [
                Row(children: [
                  Expanded(flex: 3, child: TextFormField(initialValue: b.label, onChanged: (v) => b.label = v, decoration: InputDecoration(labelText: s.t('split.what')))),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 2,
                    child: TextFormField(
                      initialValue: _money(b.amount),
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      onChanged: (v) => setState(() => b.amount = double.tryParse(v.replaceAll(',', '.')) ?? 0),
                      decoration: InputDecoration(labelText: s.t('split.amount')),
                    ),
                  ),
                  IconButton(tooltip: s.t('split.remove'), icon: const Icon(Icons.close), onPressed: () => setState(() => bills.removeAt(i))),
                ]),
                const SizedBox(height: 6),
                DropdownButtonFormField<int>(
                  initialValue: b.paidBy.clamp(0, _people.length - 1),
                  decoration: InputDecoration(labelText: s.t('split.paidBy')),
                  items: [for (final (j, n) in names.indexed) DropdownMenuItem(value: j, child: Text(n))],
                  onChanged: (v) => setState(() => b.paidBy = v ?? 0),
                ),
              ]),
            ),
          OutlinedButton.icon(onPressed: () => setState(() => bills.add(Bill('', 0, 0))), icon: const Icon(Icons.add), label: Text(s.t('split.addBill'))),
        ]),
      ),
      const SizedBox(height: 12),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(s.t('split.result'), style: Theme.of(context).textTheme.titleLarge),
          Text('${s.t('split.share')}: ${_money(share)}', style: const TextStyle(color: C.inkSoft)),
          const SizedBox(height: 10),
          if (transfers.isEmpty) Notice(s.t('split.even')),
          for (final x in transfers)
            Container(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(color: C.paper, borderRadius: BorderRadius.circular(8)),
              child: Row(children: [
                Expanded(child: Text(s.t('split.pays', {'from': names[x.from], 'to': names[x.to]}))),
                Text(_money(x.amount), style: const TextStyle(fontWeight: FontWeight.w700)),
              ]),
            ),
          const SizedBox(height: 8),
          OutlinedButton.icon(onPressed: () => copyText(context, text, s.t('split.copied')), icon: const Icon(Icons.copy, size: 18), label: Text(s.t('split.copy'))),
        ]),
      ),
    ]);
  }
}

/// Checklists and the Turkish/English letter asking for a deposit back (ROOM-09).
class DepositScreen extends StatefulWidget {
  const DepositScreen({super.key});

  @override
  State<DepositScreen> createState() => _DepositScreenState();
}

class _DepositScreenState extends State<DepositScreen> {
  final _fields = {for (final k in ['tenant', 'landlord', 'address', 'amountLabel', 'left']) k: TextEditingController()};
  final _done = <String>{};

  @override
  void dispose() {
    for (final c in _fields.values) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final letter = depositLetter(
      tenant: _fields['tenant']!.text,
      landlord: _fields['landlord']!.text,
      address: _fields['address']!.text,
      amount: _fields['amountLabel']!.text,
      left: _fields['left']!.text,
    );
    Widget checklist(String title, List<String> steps) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Panel(
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              for (final step in steps)
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  controlAffinity: ListTileControlAffinity.leading,
                  value: _done.contains(step),
                  onChanged: (v) => setState(() => v == true ? _done.add(step) : _done.remove(step)),
                  title: Text(step, style: const TextStyle(fontSize: 14.5)),
                ),
            ]),
          ),
        );
    return AppPage(title: s.t('deposit.title'), children: [
      Text(s.t('deposit.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      checklist(s.t('deposit.moveIn'), s.list('deposit.inSteps')),
      checklist(s.t('deposit.moveOut'), s.list('deposit.outSteps')),
      OutlinedButton(onPressed: () => openPage(context, 'c/cleaning'), child: Text(s.t('deposit.clean'))),
      SectionHeader(s.t('deposit.letter'), hint: s.t('deposit.letterNote')),
      for (final e in _fields.entries)
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: TextField(controller: e.value, onChanged: (_) => setState(() {}), decoration: InputDecoration(labelText: s.t('deposit.${e.key}'))),
        ),
      const SizedBox(height: 4),
      Panel(color: C.paper, child: Directionality(textDirection: TextDirection.ltr, child: SelectableText(letter, style: const TextStyle(height: 1.5)))),
      const SizedBox(height: 10),
      FilledButton.icon(onPressed: () => copyText(context, letter, s.t('deposit.copied')), icon: const Icon(Icons.copy, size: 18), label: Text(s.t('deposit.copy'))),
    ]);
  }
}

/// A rent receipt in Turkish and English (ROOM-10, easy version: no money moves).
class ReceiptScreen extends StatefulWidget {
  const ReceiptScreen({super.key});

  @override
  State<ReceiptScreen> createState() => _ReceiptScreenState();
}

class _ReceiptScreenState extends State<ReceiptScreen> {
  final _f = {for (final k in ['landlord', 'tenant', 'address', 'amount', 'period']) k: TextEditingController()};
  String _currency = 'GBP';
  String _method = 'transfer';
  final DateTime _paid = DateTime.now();

  @override
  void dispose() {
    for (final c in _f.values) {
      c.dispose();
    }
    super.dispose();
  }

  String _v(String key) => _f[key]!.text.trim().isEmpty ? '—' : _f[key]!.text.trim();

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final method = _method == 'cash' ? 'Nakit / Cash' : 'Banka havalesi / Bank transfer';
    final rows = [
      ('Ev sahibi', 'Landlord', _v('landlord')),
      ('Kiracı', 'Tenant', _v('tenant')),
      ('Adres', 'Address', _v('address')),
      ('Ait olduğu ay', 'For the month of', _v('period')),
      ('Ödeme tarihi', 'Date paid', dateOnly(_paid)),
      ('Ödeme şekli', 'Paid by', method),
    ];
    final amount = '${_f['amount']!.text.trim().isEmpty ? '0' : _f['amount']!.text.trim()} $_currency';
    final asText = ['KİRA MAKBUZU / RENT RECEIPT', amount, '', for (final (tr, en, v) in rows) '$tr / $en: $v', '', 'Ev sahibi imza / Landlord signature: ________', 'Kiracı imza / Tenant signature: ________'].join('\n');

    return AppPage(title: s.t('receipt.title'), children: [
      Text(s.t('receipt.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      for (final k in ['landlord', 'tenant', 'address'])
        Padding(padding: const EdgeInsets.only(bottom: 8), child: TextField(controller: _f[k], onChanged: (_) => setState(() {}), decoration: InputDecoration(labelText: s.t('receipt.$k')))),
      Row(children: [
        Expanded(child: TextField(controller: _f['amount'], keyboardType: TextInputType.number, onChanged: (_) => setState(() {}), decoration: InputDecoration(labelText: s.t('receipt.amount')))),
        const SizedBox(width: 8),
        SizedBox(
          width: 110,
          child: DropdownButtonFormField<String>(initialValue: _currency, items: [for (final c in currencies) DropdownMenuItem(value: c, child: Text(c))], onChanged: (v) => setState(() => _currency = v!)),
        ),
      ]),
      const SizedBox(height: 8),
      TextField(controller: _f['period'], onChanged: (_) => setState(() {}), decoration: InputDecoration(labelText: s.t('receipt.period'))),
      const SizedBox(height: 8),
      SegmentedButton<String>(
        segments: [ButtonSegment(value: 'transfer', label: Text(s.t('receipt.transfer'))), ButtonSegment(value: 'cash', label: Text(s.t('receipt.cash')))],
        selected: {_method},
        showSelectedIcon: false,
        onSelectionChanged: (v) => setState(() => _method = v.first),
      ),
      const SizedBox(height: 16),
      // The receipt itself, always in Turkish and English.
      Directionality(
        textDirection: TextDirection.ltr,
        child: Panel(
          padding: const EdgeInsets.all(20),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('KİRA MAKBUZU', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                  Text('Rent receipt', style: TextStyle(color: C.inkSoft)),
                ]),
              ),
              Text(amount, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
            ]),
            const Divider(thickness: 2, color: C.ink, height: 24),
            for (final (tr, en, v) in rows)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  SizedBox(
                    width: 120,
                    child: Text('$tr\n$en', style: const TextStyle(fontSize: 12.5, color: C.inkSoft, height: 1.3)),
                  ),
                  Expanded(child: Text(v, style: const TextStyle(fontSize: 15))),
                ]),
              ),
            const SizedBox(height: 28),
            const Row(children: [
              Expanded(child: Text('Ev sahibi imza / Landlord signature', style: TextStyle(fontSize: 12, color: C.inkSoft))),
              SizedBox(width: 16),
              Expanded(child: Text('Kiracı imza / Tenant signature', style: TextStyle(fontSize: 12, color: C.inkSoft))),
            ]),
          ]),
        ),
      ),
      const SizedBox(height: 12),
      FilledButton.icon(onPressed: () => shareText(asText), icon: const Icon(Icons.share_outlined, size: 18), label: Text(s.t('listing.share'))),
    ]);
  }
}

/// The residence-permit reminder (ARR-10): days left, reminders in the phone's calendar, papers.
/// Kept on this phone only.
class PermitScreen extends StatefulWidget {
  const PermitScreen({super.key});

  @override
  State<PermitScreen> createState() => _PermitScreenState();
}

class _PermitScreenState extends State<PermitScreen> {
  static const _key = 'permit';
  static const _leads = [30, 45, 60, 90];
  String _expiry = '';
  int _lead = 45;
  List<bool> _done = [];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_done.isNotEmpty) return;
    final items = context.s.list('permit.items');
    _done = List.filled(items.length, false);
    final raw = context.app.prefs.getString(_key);
    if (raw == null) return;
    try {
      final saved = jsonDecode(raw) as Map<String, dynamic>;
      _expiry = saved['expiry'] as String? ?? '';
      _lead = saved['lead'] as int? ?? 45;
      final done = (saved['done'] as List?)?.cast<bool>() ?? const [];
      for (var i = 0; i < _done.length && i < done.length; i++) {
        _done[i] = done[i];
      }
    } catch (_) {
      // A damaged saved value: start empty.
    }
  }

  void _save() => context.app.prefs.setString(_key, jsonEncode({'expiry': _expiry, 'lead': _lead, 'done': _done}));

  Future<void> _calendar() async {
    final s = context.s;
    final stamp = '${DateTime.now().toUtc().toIso8601String().replaceAll(RegExp(r'[-:]'), '').split('.').first}Z';
    final ics = permitCalendar(
      expiry: _expiry,
      leadDays: _lead,
      startTitle: s.t('permit.calStart'),
      lastWeekTitle: s.t('permit.calWeek'),
      note: s.t('permit.calNote'),
      stamp: stamp,
      today: dateOnly(DateTime.now()),
    );
    // On a phone, the share sheet offers the calendar app.
    await SharePlus.instance.share(ShareParams(
      files: [XFile.fromData(utf8.encode(ics), mimeType: 'text/calendar', name: 'residence-permit-reminders.ics')],
      fileNameOverrides: const ['residence-permit-reminders.ics'],
    ));
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final today = dateOnly(DateTime.now());
    final valid = isDate(_expiry);
    final left = valid ? daysUntil(_expiry, today) : null;
    final start = valid ? minusDays(_expiry, _lead) : null;
    final startLeft = start == null ? null : daysUntil(start, today);
    final items = s.list('permit.items');
    final (bg, fg) = left == null ? (C.ink, Colors.white) : left < 0 ? (C.alert, Colors.white) : left <= _lead ? (C.notice, C.noticeInk) : (C.ink, Colors.white);

    return AppPage(title: s.t('permit.title'), children: [
      Text(s.t('permit.intro'), style: const TextStyle(color: C.inkSoft)),
      const SizedBox(height: 14),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          OutlinedButton.icon(
            icon: const Icon(Icons.event_outlined),
            label: Text(valid ? '${formatDay(DateTime.parse(_expiry), s.lang)} ${_expiry.substring(0, 4)}' : s.t('permit.expiry')),
            onPressed: () async {
              final now = DateTime.now();
              final picked = await showDatePicker(
                context: context,
                firstDate: now.subtract(const Duration(days: 365)),
                lastDate: now.add(const Duration(days: 365 * 5)),
                initialDate: valid ? DateTime.parse(_expiry) : now.add(const Duration(days: 180)),
              );
              if (picked != null) {
                setState(() => _expiry = dateOnly(picked));
                _save();
              }
            },
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<int>(
            initialValue: _lead,
            decoration: InputDecoration(labelText: s.t('permit.lead')),
            items: [for (final n in _leads) DropdownMenuItem(value: n, child: Text(s.t('permit.daysBefore', {'n': n})))],
            onChanged: (v) {
              setState(() => _lead = v ?? 45);
              _save();
            },
          ),
          if (left != null) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(12)),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(left < 0 ? '0' : s.t('permit.daysLeft', {'n': left}), style: TextStyle(color: fg, fontSize: 30, fontWeight: FontWeight.w700)),
                const SizedBox(height: 4),
                Text(
                  left < 0 ? s.t('permit.expired') : (startLeft! <= 0 ? s.t('permit.startNow') : s.t('permit.startOn', {'date': formatDay(DateTime.parse(start!), s.lang)})),
                  style: TextStyle(color: fg),
                ),
              ]),
            ),
          ],
          const SizedBox(height: 14),
          FilledButton.icon(onPressed: valid && (left ?? -1) >= 0 ? _calendar : null, icon: const Icon(Icons.event_available_outlined), label: Text(s.t('permit.calendar'))),
        ]),
      ),
      const SizedBox(height: 12),
      Panel(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            Expanded(child: Text(s.t('permit.papers'), style: Theme.of(context).textTheme.titleMedium)),
            Text(s.t('permit.ready', {'done': _done.where((d) => d).length, 'total': items.length}), style: const TextStyle(color: C.seaDeep, fontWeight: FontWeight.w600)),
          ]),
          for (final (i, item) in items.indexed)
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              controlAffinity: ListTileControlAffinity.leading,
              value: _done[i],
              onChanged: (v) {
                setState(() => _done[i] = v ?? false);
                _save();
              },
              title: Text(item, style: const TextStyle(fontSize: 14.5)),
            ),
          Text(s.t('permit.papersNote'), style: Theme.of(context).textTheme.bodySmall),
        ]),
      ),
      const SizedBox(height: 14),
      Notice(s.t('help.disclaimer')),
    ]);
  }
}
