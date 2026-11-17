import 'package:flutter/cupertino.dart' show CupertinoPageTransitionsBuilder;
import 'package:flutter/material.dart';

/// The website's design tokens, so the app and the site look like one product.
/// Mediterranean teal for actions, warm coral for posting and saving, sun yellow for the brand
/// mark, deep ink on warm off-white. The same values as the website's globals.css.
class C {
  static const paper = Color(0xFFF7F6F2);
  static const card = Color(0xFFFFFFFF);
  static const ink = Color(0xFF13232B);
  static const inkSoft = Color(0xFF5B6770);
  static const line = Color(0xFFE6E2DA);
  static const sea = Color(0xFF0E7C74);
  static const seaDeep = Color(0xFF0A5E58);
  static const seaWash = Color(0xFFE1F2EE);
  static const coral = Color(0xFFE8603C);
  static const coralDeep = Color(0xFFCF4D2B);
  static const coralWash = Color(0xFFFDEBE5);
  static const tag = Color(0xFFFFC83D);
  static const wa = Color(0xFF25D366);
  static const alert = Color(0xFFB42318);
  static const alertWash = Color(0xFFFBE9E7);
  static const women = Color(0xFF8A1F55);
  static const womenWash = Color(0xFFFBE8F1);
  static const ok = Color(0xFF1D6A3D);
  static const okWash = Color(0xFFE2F4E9);
}

/// Styles set on their own (buttons, the top bar) do not inherit the theme's font, so they name it.
const _font = 'ReadexPro';

ThemeData buildTheme() {
  final scheme = ColorScheme.fromSeed(seedColor: C.sea, primary: C.sea, surface: C.card, onSurface: C.ink, error: C.alert);
  final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(10));
  OutlineInputBorder border(Color color) =>
      OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide(color: color, width: 1.5));
  return ThemeData(
    useMaterial3: true,
    // The website's typeface: one font for Turkish, English and Arabic.
    fontFamily: _font,
    // Screens fade and slide forward the native way on each platform.
    pageTransitionsTheme: const PageTransitionsTheme(builders: {
      TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
      TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      TargetPlatform.macOS: CupertinoPageTransitionsBuilder(),
    }),
    colorScheme: scheme,
    scaffoldBackgroundColor: C.paper,
    appBarTheme: const AppBarTheme(
      backgroundColor: C.card,
      foregroundColor: C.ink,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(fontFamily: _font, color: C.ink, fontSize: 18, fontWeight: FontWeight.w700),
    ),
    textTheme: const TextTheme(
      headlineMedium: TextStyle(fontSize: 26, fontWeight: FontWeight.w700, color: C.ink, height: 1.15, letterSpacing: -0.3),
      titleLarge: TextStyle(fontSize: 19, fontWeight: FontWeight.w700, color: C.ink),
      titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: C.ink),
      bodyLarge: TextStyle(fontSize: 16, color: C.ink, height: 1.45),
      bodyMedium: TextStyle(fontSize: 14.5, color: C.ink, height: 1.4),
      bodySmall: TextStyle(fontSize: 12.5, color: C.inkSoft),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: C.sea,
        foregroundColor: Colors.white,
        minimumSize: const Size(44, 48),
        shape: shape,
        textStyle: const TextStyle(fontFamily: _font, fontSize: 15, fontWeight: FontWeight.w600),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: C.ink,
        backgroundColor: C.card,
        minimumSize: const Size(44, 48),
        side: const BorderSide(color: C.line, width: 1.5),
        shape: shape,
        textStyle: const TextStyle(fontFamily: _font, fontSize: 15, fontWeight: FontWeight.w600),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: C.card,
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      border: border(C.line),
      enabledBorder: border(C.line),
      focusedBorder: border(C.sea),
      hintStyle: const TextStyle(color: C.inkSoft),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: C.card,
      selectedColor: C.ink,
      side: const BorderSide(color: C.line),
      shape: const StadiumBorder(),
      labelStyle: const TextStyle(fontFamily: _font, fontSize: 14, fontWeight: FontWeight.w500, color: C.ink),
      secondaryLabelStyle: const TextStyle(fontFamily: _font, color: Colors.white),
      checkmarkColor: Colors.white,
    ),
    dividerTheme: const DividerThemeData(color: C.line, space: 1),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: C.card,
      indicatorColor: C.seaWash,
      labelTextStyle: WidgetStateProperty.all(const TextStyle(fontFamily: _font, fontSize: 12, fontWeight: FontWeight.w500)),
    ),
  );
}

/// Service and tool drawings, by the names the website uses.
const icons = <String, IconData>{
  'key': Icons.key_outlined,
  'building': Icons.apartment_outlined,
  'office': Icons.business_outlined,
  'tag': Icons.sell_outlined,
  'car': Icons.directions_car_outlined,
  'carKey': Icons.car_rental_outlined,
  'tow': Icons.car_crash_outlined,
  'wrench': Icons.build_outlined,
  'sparkle': Icons.cleaning_services_outlined,
  'hammer': Icons.handyman_outlined,
  'briefcase': Icons.work_outline,
  'cap': Icons.school_outlined,
  'plane': Icons.flight_land_outlined,
  'badge': Icons.badge_outlined,
  'laptop': Icons.laptop_outlined,
  'route': Icons.route_outlined,
  'video': Icons.videocam_outlined,
  'doc': Icons.description_outlined,
  'users': Icons.groups_outlined,
  'sofa': Icons.weekend_outlined,
  'swap': Icons.swap_horiz,
  'cart': Icons.shopping_cart_outlined,
  'parking': Icons.local_parking,
  'wheel': Icons.time_to_leave_outlined,
  'phone': Icons.phone_iphone,
  'child': Icons.child_care_outlined,
  'paw': Icons.pets_outlined,
  'box': Icons.inventory_2_outlined,
  'store': Icons.storefront_outlined,
  'archive': Icons.archive_outlined,
  'bag': Icons.shopping_bag_outlined,
  'hands': Icons.handshake_outlined,
  'clock': Icons.schedule,
  'desk': Icons.desk_outlined,
  'compass': Icons.explore_outlined,
  'fork': Icons.restaurant_outlined,
  'calendar': Icons.event_outlined,
  'percent': Icons.percent,
  'cross': Icons.local_hospital_outlined,
  'megaphone': Icons.campaign_outlined,
  'chat2': Icons.forum_outlined,
  'mic': Icons.mic_none,
  'calculator': Icons.calculate_outlined,
  'receipt': Icons.receipt_long_outlined,
  'chart': Icons.bar_chart,
  'map': Icons.map_outlined,
  'siren': Icons.emergency_outlined,
  'book': Icons.menu_book_outlined,
  'check': Icons.verified_outlined,
};

IconData iconFor(String name) => icons[name] ?? Icons.sell_outlined;
