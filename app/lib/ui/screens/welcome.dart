import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/i18n.dart';
import '../theme.dart';
import '../widgets/motion.dart';

/// The first launch: choose the language, then what brings you here. The home screen then
/// shows what fits first. Both can be changed later in settings.
class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

const personas = [
  ('student', Icons.school_outlined),
  ('resident', Icons.home_outlined),
  ('business', Icons.storefront_outlined),
  ('visitor', Icons.luggage_outlined),
];

class _WelcomeScreenState extends State<WelcomeScreen> {
  final _pages = PageController();
  int _page = 0;

  @override
  void dispose() {
    _pages.dispose();
    super.dispose();
  }

  void _go(int page) {
    setState(() => _page = page);
    _pages.animateToPage(page, duration: Duration(milliseconds: reduceMotion(context) ? 1 : 420), curve: Curves.easeOutCubic);
  }

  @override
  Widget build(BuildContext context) {
    final app = context.app;
    final s = app.s;
    return Directionality(
      textDirection: s.direction,
      child: Scaffold(
        backgroundColor: C.ink,
        body: SafeArea(
          child: Column(children: [
            Expanded(
              child: PageView(
                controller: _pages,
                physics: const NeverScrollableScrollPhysics(),
                children: [_language(context), _who(context)],
              ),
            ),
            // Where you are: two dots, the current one stretched.
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              for (var i = 0; i < 2; i++)
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.all(4),
                  width: i == _page ? 22 : 8,
                  height: 8,
                  decoration: BoxDecoration(color: i == _page ? Colors.white : Colors.white24, borderRadius: BorderRadius.circular(4)),
                ),
            ]),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
              child: Row(children: [
                if (_page == 1)
                  TextButton(onPressed: () => _go(0), child: Text(s.t('app.back'), style: const TextStyle(color: Colors.white70))),
                const Spacer(),
                FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: C.ink, minimumSize: const Size(140, 52)),
                  onPressed: _page == 0
                      ? () => _go(1)
                      : () {
                          app.finishWelcome();
                          context.go('/');
                        },
                  child: Text(s.t(_page == 0 ? 'app.next' : 'app.start')),
                ),
              ]),
            ),
          ]),
        ),
      ),
    );
  }

  Widget _language(BuildContext context) {
    final app = context.app;
    final s = app.s;
    return ListView(padding: const EdgeInsets.fromLTRB(24, 40, 24, 24), children: [
      const Icon(Icons.sell, color: C.tag, size: 52),
      const SizedBox(height: 22),
      Text(s.t('app.welcome'), style: const TextStyle(color: Colors.white, fontSize: 34, fontWeight: FontWeight.w700)),
      const SizedBox(height: 8),
      Text(s.t('app.welcomeBody'), style: const TextStyle(color: Colors.white70, fontSize: 17, height: 1.45)),
      const SizedBox(height: 32),
      Text(s.t('app.chooseLang'), style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w600)),
      const SizedBox(height: 12),
      for (final lang in Lang.values)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: _Choice(
            selected: app.lang == lang,
            onTap: () => app.setLang(lang),
            leading: Text(lang.name.toUpperCase(), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
            label: langNames[lang]!,
          ),
        ),
    ]);
  }

  Widget _who(BuildContext context) {
    final app = context.app;
    final s = app.s;
    return ListView(padding: const EdgeInsets.fromLTRB(24, 40, 24, 24), children: [
      Text(s.t('app.who'), style: const TextStyle(color: Colors.white, fontSize: 30, fontWeight: FontWeight.w700, height: 1.15)),
      const SizedBox(height: 8),
      Text(s.t('app.whoHint'), style: const TextStyle(color: Colors.white70, fontSize: 15.5, height: 1.45)),
      const SizedBox(height: 24),
      for (final (key, icon) in personas)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: _Choice(selected: app.persona == key, onTap: () => app.setPersona(key), leading: Icon(icon, size: 22), label: s.t('app.$key')),
        ),
    ]);
  }
}

/// A large choice that lights up when picked.
class _Choice extends StatelessWidget {
  const _Choice({required this.selected, required this.onTap, required this.leading, required this.label});

  final bool selected;
  final VoidCallback onTap;
  final Widget leading;
  final String label;

  @override
  Widget build(BuildContext context) => AnimatedContainer(
        duration: const Duration(milliseconds: 220),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.white.withValues(alpha: 0.07),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: selected ? Colors.white : Colors.white24, width: 1.5),
        ),
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: IconTheme(
                data: IconThemeData(color: selected ? C.sea : Colors.white70),
                child: DefaultTextStyle.merge(
                  style: TextStyle(color: selected ? C.ink : Colors.white),
                  child: Row(children: [
                    SizedBox(width: 34, child: leading),
                    const SizedBox(width: 8),
                    Expanded(child: Text(label, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600))),
                    AnimatedOpacity(
                      opacity: selected ? 1 : 0,
                      duration: const Duration(milliseconds: 200),
                      child: const Icon(Icons.check_circle, color: C.sea),
                    ),
                  ]),
                ),
              ),
            ),
          ),
        ),
      );
}
