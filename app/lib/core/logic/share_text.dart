// Texts that leave the app: the post for a seller's groups, the message to the team, the deposit
// letter, and WhatsApp links. Same wording rules as the website.

/// "wa.me" wants digits only, country code first, no plus sign and no 00.
String whatsappLink(String phone, String message) {
  final digits = phone.replaceAll(RegExp(r'\D'), '').replaceFirst(RegExp(r'^00'), '');
  return 'https://wa.me/$digits?text=${Uri.encodeComponent(message)}';
}

/// Title, then price and city, then one line per language and ONE link without a language in it.
String groupPost({required String title, String? price, required String city, required List<String> lines, required String url}) {
  final facts = [if (price != null && price.isNotEmpty) price, if (city.isNotEmpty) city].join(' · ');
  return [title, if (facts.isNotEmpty) facts, '', ...lines, url].join('\n');
}

/// The ad, written out for the team's WhatsApp line while the database is not connected.
String teamAdMessage({
  required String intro,
  required String kindLabel,
  required String kindValue,
  required String titleLabel,
  required String title,
  required String priceLabel,
  String? price,
  required String categoryLabel,
  required String category,
  required String cityLabel,
  required String city,
  required String descriptionLabel,
  required String description,
  required String photosLine,
  required bool hasPhotos,
  String? womenOnly,
}) {
  final rows = <String>[
    intro,
    '',
    '$kindLabel: $kindValue',
    '$titleLabel: ${title.trim()}',
    if (price != null) '$priceLabel: $price',
    if (category.isNotEmpty) '$categoryLabel: $category',
    '$cityLabel: $city',
    if (womenOnly != null) '✓ $womenOnly',
  ];
  if (description.trim().isNotEmpty) rows.addAll(['', '$descriptionLabel:', description.trim()]);
  if (hasPhotos) rows.addAll(['', photosLine]);
  return rows.join('\n');
}

/// The letter asking for a deposit back, in Turkish and English so both sides can read it.
String depositLetter({String tenant = '', String landlord = '', String address = '', String amount = '', String left = ''}) {
  String d(String x) => x.trim().isEmpty ? '…' : x.trim();
  return [
    'Sayın ${d(landlord)},',
    '${d(left)} tarihinde ${d(address)} adresindeki evden çıktım ve anahtarları teslim ettim. Ev temiz ve teslim aldığım durumda bırakıldı; giriş ve çıkış fotoğrafları bende mevcuttur.',
    '${d(amount)} tutarındaki depozitomun 14 gün içinde iadesini rica ederim. Bir kesinti yapılacaksa, lütfen gerekçesini ve makbuzlarını yazılı olarak iletiniz.',
    'Saygılarımla,\n${d(tenant)}',
    '',
    '———',
    '',
    'Dear ${d(landlord)},',
    'I moved out of the flat at ${d(address)} on ${d(left)} and returned the keys. The flat was left clean and in the condition I received it; I have photos from moving in and moving out.',
    'Please return my deposit of ${d(amount)} within 14 days. If you plan to deduct anything, please tell me in writing, with the reason and the receipts.',
    'Kind regards,\n${d(tenant)}',
  ].join('\n\n');
}
