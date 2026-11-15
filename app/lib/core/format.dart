import 'i18n.dart';

const _symbol = {'TRY': '₺', 'GBP': '£', 'EUR': '€', 'USD': '\$'};

/// "£45", "₺1.500". The symbol always comes first, as on the website.
String formatMoney(num amount, String currency, Lang lang) => '${_symbol[currency] ?? ''}${groupDigits(amount, lang)}';

const _months = {
  Lang.en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  Lang.tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  Lang.ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
};

/// A short day and month: "Nov 12", "12 Kas", "12 نوفمبر".
String formatDay(DateTime date, Lang lang) {
  final month = _months[lang]![date.month - 1];
  return lang == Lang.en ? '$month ${date.day}' : '${date.day} $month';
}

const _relative = {
  Lang.en: {
    'minute': {'one': '{n} min. ago', 'other': '{n} min. ago'},
    'hour': {'one': '{n} hr. ago', 'other': '{n} hr. ago'},
    'day': {'one': '{n} day ago', 'other': '{n} days ago'},
  },
  Lang.tr: {
    'minute': {'other': '{n} dk. önce'},
    'hour': {'other': '{n} sa. önce'},
    'day': {'other': '{n} gün önce'},
  },
  Lang.ar: {
    'minute': {'zero': 'الآن', 'one': 'قبل دقيقة واحدة', 'two': 'قبل دقيقتين', 'few': 'قبل {n} دقائق', 'other': 'قبل {n} دقيقة'},
    'hour': {'one': 'قبل ساعة واحدة', 'two': 'قبل ساعتين', 'few': 'قبل {n} ساعات', 'other': 'قبل {n} ساعة'},
    'day': {'one': 'قبل يوم واحد', 'two': 'قبل يومين', 'few': 'قبل {n} أيام', 'other': 'قبل {n} يومًا'},
  },
};

String _ago(Lang lang, String unit, int n) {
  final forms = _relative[lang]![unit]!;
  final category = pluralCategory(lang, n);
  return (forms[category] ?? forms['other']!).replaceAll('{n}', '$n');
}

/// "5 min. ago", "2 sa. önce". After a week it becomes the date.
String timeAgo(DateTime created, DateTime now, Lang lang) {
  final elapsed = now.difference(created);
  if (elapsed.inDays >= 7) return formatDay(created.toLocal(), lang);
  if (elapsed.inDays >= 1) return _ago(lang, 'day', elapsed.inDays);
  if (elapsed.inHours >= 1) return _ago(lang, 'hour', elapsed.inHours);
  return _ago(lang, 'minute', elapsed.inMinutes < 1 ? 1 : elapsed.inMinutes);
}
