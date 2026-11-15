/// The residence-permit reminder, as on the website: days left, when to start renewing, and a
/// calendar file (.ics) with two reminders. Dates are whole days written YYYY-MM-DD.
DateTime _utc(String date) => DateTime.parse('${date}T00:00:00Z');

bool isDate(String value) {
  if (!RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(value)) return false;
  final parsed = DateTime.tryParse('${value}T00:00:00Z');
  return parsed != null && parsed.toIso8601String().startsWith(value);
}

int daysUntil(String date, String today) => _utc(date).difference(_utc(today)).inDays;

String minusDays(String date, int days) => _utc(date).subtract(Duration(days: days)).toIso8601String().substring(0, 10);

String dateOnly(DateTime d) => d.toIso8601String().substring(0, 10);

String _icsDate(String date) => date.replaceAll('-', '');

String _icsText(String text) =>
    text.replaceAll(r'\', r'\\').replaceAllMapped(RegExp('[,;]'), (m) => '\\${m[0]}').replaceAll('\n', r'\n');

String permitCalendar({
  required String expiry,
  required int leadDays,
  required String startTitle,
  required String lastWeekTitle,
  required String note,
  required String stamp,
  String? today,
}) {
  String atLeastToday(String date) => today != null && date.compareTo(today) < 0 ? today : date;
  final events = [
    ('start', atLeastToday(minusDays(expiry, leadDays)), startTitle),
    ('week', atLeastToday(minusDays(expiry, 7)), lastWeekTitle),
  ];
  final lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Island Market//Permit reminder//EN', 'CALSCALE:GREGORIAN'];
  for (final (id, date, title) in events) {
    lines.addAll([
      'BEGIN:VEVENT',
      'UID:permit-$id-${_icsDate(expiry)}@island-market',
      'DTSTAMP:$stamp',
      'DTSTART;VALUE=DATE:${_icsDate(date)}',
      'DTEND;VALUE=DATE:${_icsDate(minusDays(date, -1))}',
      'SUMMARY:${_icsText(title)}',
      'DESCRIPTION:${_icsText(note)}',
      'BEGIN:VALARM',
      'TRIGGER:PT9H',
      'ACTION:DISPLAY',
      'DESCRIPTION:${_icsText(title)}',
      'END:VALARM',
      'END:VEVENT',
    ]);
  }
  lines.add('END:VCALENDAR');
  return '${lines.join('\r\n')}\r\n';
}
