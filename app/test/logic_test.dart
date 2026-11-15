import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:island_market/core/format.dart';
import 'package:island_market/core/i18n.dart';
import 'package:island_market/core/logic/course.dart';
import 'package:island_market/core/logic/listings.dart';
import 'package:island_market/core/logic/parse_post.dart';
import 'package:island_market/core/logic/permit.dart';
import 'package:island_market/core/logic/prices.dart';
import 'package:island_market/core/logic/share_text.dart';
import 'package:island_market/core/logic/split.dart';
import 'package:island_market/core/models.dart';

// The same cases as the website's tests, so the app and the website behave alike.
final words = ParseWords.fromJson(
  (jsonDecode(File('assets/data/catalog.json').readAsStringSync()) as Map<String, dynamic>)['parseWords'],
);
ParsedPost p(String text, [List<String>? categories]) => parsePost(text, words, categories: categories);

var _n = 0;
Listing ad({String category = 'rooms', int? price = 400, String currency = 'GBP', String city = 'famagusta', String title = 'Flat', bool womenOnly = false, String status = 'live', DateTime? soldAt}) =>
    Listing(
      id: 'p${++_n}', kind: 'offer', title: title, description: '', price: price, currency: currency, category: category, city: city,
      status: status, soldAt: soldAt, photos: const [], views: 0, createdAt: DateTime.utc(2026, 11, 1),
      seller: Seller(name: 'S', shopSlug: 's', city: 'famagusta'), womenOnly: womenOnly,
    );

void main() {
  group('parsePost', () {
    test('reads prices in every way they are written', () {
      expect((p('Çalışma masası\nTemiz, 1.500 TL').price, p('Çalışma masası\nTemiz, 1.500 TL').currency), (1500, 'TRY'));
      expect(p('Buzdolabı ₺6.500').price, 6500);
      expect((p('Flat for rent £450 a month').price, p('Flat for rent £450 a month').currency), (450, 'GBP'));
      expect(p('2+1 daire 400stg aylık').currency, 'GBP');
      expect(p('Bike 80 euro').currency, 'EUR');
      expect((p('iPhone 12 \$220').price, p('iPhone 12 \$220').currency), (220, 'USD'));
      expect((p('غرفة مفروشة 180 جنيه شهرياً').price, p('غرفة مفروشة 180 جنيه شهرياً').currency), (180, 'GBP'));
      expect(p('Araba 15 bin TL').price, 15000);
      expect(p('Scooter 2.5k tl').price, 2500);
      expect(p('Sofa 1,200 TL').price, 1200);
    });

    test('never takes a room count or model number for a price', () {
      expect(p('2+1 daire, iPhone 12 hediye').price, isNull);
    });

    test('understands free, wanted, city, category and women only', () {
      expect(p('Bedava kitaplar, gelip alın').price, 0);
      expect(p('Ev arkadaşı arıyorum, Mağusa').kind, 'wanted');
      expect(p('مطلوب غرفة قرب الجامعة').kind, 'wanted');
      expect(p("Magosa'da oda").city, 'famagusta');
      expect(p('Lefkoşa merkez').city, 'nicosia');
      expect(p('شقة في نيقوسيا').city, 'nicosia');
      expect(p('Arçelik buzdolabı').category, 'appliances');
      expect(p('Looking for a flatmate, room in 3+1 flat').category, 'roommates');
      expect(p('Bedava').category, isNull);
      expect(p('Masa', ['books']).category, isNull);
      expect(p('Kız öğrenciye kiralık oda').womenOnly, isTrue);
    });

    test('cleans the title and keeps the rest as the description', () {
      final parsed = p('🔥🔥 SATILIK #masa Çalışma masası 🔥\nÇok temiz, 1.500 TL\n#magosa');
      expect(parsed.title, 'Çalışma masası');
      expect(parsed.description, 'Çok temiz, 1.500 TL');
      expect(p('Acil satılık: iPhone 12').title, 'iPhone 12');
      expect(p('Salesforce book').title, 'Salesforce book');
      expect(p('   ').title, '');
    });
  });

  group('search', () {
    test('folds Turkish dotted and dotless i', () => expect(fold('ISITICI'), fold('ısıtıcı')));

    test('finds course codes in any spelling, and women-only places', () {
      final notes = ad(title: 'Notes for math-101');
      final room = ad(womenOnly: true);
      final now = DateTime.utc(2026, 11, 2);
      expect(filterListings([ad(), notes], const ListingFilter(q: 'MATH 101'), now).map((l) => l.id), [notes.id]);
      expect(filterListings([ad(), room], const ListingFilter(women: true), now).map((l) => l.id), [room.id]);
    });

    test('keeps sold ads for a week only', () {
      final now = DateTime.utc(2026, 11, 20);
      expect(isListed(ad(status: 'sold', soldAt: now.subtract(const Duration(days: 2))), now), isTrue);
      expect(isListed(ad(status: 'sold', soldAt: now.subtract(const Duration(days: 8))), now), isFalse);
      expect(isListed(ad(status: 'removed'), now), isFalse);
    });

    test('course codes', () {
      expect(normalizeCourse('math-101'), 'MATH101');
      expect(courseCodesIn('Notes for MATH 101 and phys-102, iPhone 128 GB, 500 TL'), ['MATH101', 'PHYS102']);
    });
  });

  group('prices', () {
    final usual = [ad(price: 400), ad(price: 420), ad(price: 380)];
    test('warns about a rent under half the usual one', () {
      final bait = ad(price: 150);
      expect(tooLowComparedWith(bait, [...usual, bait]), 400);
      expect(tooLowComparedWith(ad(price: 350), usual), isNull);
      expect(tooLowComparedWith(ad(price: 150, currency: 'TRY'), usual), isNull);
      expect(tooLowComparedWith(ad(price: 10), usual.sublist(0, 2)), isNull);
    });
    test('typical prices per city and for the island', () {
      final rows = priceIndex([...usual, ad(price: 900, city: 'kyrenia')]);
      final city = rows.firstWhere((r) => r.city == 'famagusta');
      expect((city.median, city.low, city.high, city.count), (400, 380, 420, 3));
      expect(rows.firstWhere((r) => r.city == null).median, 410);
    });
  });

  group('bills', () {
    test('shares exactly and settles in few payments', () {
      expect(balances(3, [Bill('Water', 2, 100)]), [-33.34, -33.33, 66.67]);
      final t = settle(3, [Bill('Electricity', 0, 120), Bill('Internet', 1, 60)]);
      expect(t.map((x) => (x.from, x.to, x.amount)), [(2, 0, 60.0)]);
    });
  });

  group('permit', () {
    test('dates and calendar', () {
      expect(daysUntil('2027-09-30', '2027-09-01'), 29);
      expect(minusDays('2027-01-10', 45), '2026-11-26');
      expect(isDate('2027-02-30'), isFalse);
      final ics = permitCalendar(expiry: '2027-09-30', leadDays: 45, startTitle: 'a', lastWeekTitle: 'b; c, d', note: '', stamp: 'x', today: '2027-09-01');
      expect(ics, contains('DTSTART;VALUE=DATE:20270901'));
      expect(ics, contains(r'SUMMARY:b\; c\, d'));
      expect(ics.endsWith('END:VCALENDAR\r\n'), isTrue);
    });
  });

  group('texts', () {
    test('WhatsApp links and group posts', () {
      expect(whatsappLink('+90 533 111 22 33', 'Desk & chair #2?'), 'https://wa.me/905331112233?text=Desk%20%26%20chair%20%232%3F');
      expect(groupPost(title: 'Desk', city: 'Nicosia', lines: ['See:'], url: 'u'), 'Desk\nNicosia\n\nSee:\nu');
      final letter = depositLetter(landlord: 'Mehmet Bey', amount: '£450');
      expect(letter, contains('Dear Mehmet Bey,'));
      expect('£450'.allMatches(letter).length, 2);
    });
  });

  group('language', () {
    test('plurals, digits and dates as on the website', () {
      expect(pluralCategory(Lang.ar, 2), 'two');
      expect(pluralCategory(Lang.ar, 11), 'many');
      expect(groupDigits(1500, Lang.tr), '1.500');
      expect(formatMoney(1500, 'TRY', Lang.en), '₺1,500');
      expect(formatDay(DateTime(2026, 11, 12), Lang.tr), '12 Kas');
      expect(timeAgo(DateTime.utc(2026, 11, 1, 10), DateTime.utc(2026, 11, 1, 12), Lang.tr), '2 sa. önce');
    });
  });
}
