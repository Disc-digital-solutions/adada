/// University course codes ("MATH101", "Math 101", "math-101") written one way, as on the website.
final _code = RegExp(r'\b([A-Za-z]{2,4})[\s-]?(\d{3})\b');
final _single = RegExp(r'^\s*([A-Za-z]{2,4})[\s-]?(\d{3})\s*$');
final _notCourse = RegExp(r'^(TL|TRY|GB|MB|KM|CM|MM|USD|EUR|GBP|STG)$');

/// "math 101" → "MATH101". "" when the text is not a course code.
String normalizeCourse(String text) {
  final m = _single.firstMatch(text);
  return m == null ? '' : '${m[1]}${m[2]}'.toUpperCase();
}

/// Every course code in a text, normalized, without repeats, in order.
List<String> courseCodesIn(String text) {
  final found = <String>[];
  for (final m in _code.allMatches(text)) {
    if (_notCourse.hasMatch(m[1]!.toUpperCase())) continue;
    final code = '${m[1]}${m[2]}'.toUpperCase();
    if (!found.contains(code)) found.add(code);
  }
  return found;
}
