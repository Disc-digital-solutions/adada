import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/app_state.dart';
import 'screens/home.dart';
import 'screens/listing.dart';
import 'screens/post.dart';
import 'screens/search.dart';
import 'screens/services.dart';
import 'screens/shop.dart';
import 'screens/tools.dart';
import 'screens/tool_forms.dart';
import 'theme.dart';

/// The same addresses as the website (without the language, which is a setting in the app),
/// so a website link can later open the same screen in the app.
GoRouter buildRouter({String initialLocation = '/'}) => GoRouter(
      initialLocation: initialLocation,
      routes: [
        ShellRoute(
          builder: (context, state, child) => _Shell(location: state.uri.path, child: child),
          routes: [
            GoRoute(path: '/', builder: (_, _) => const HomeScreen()),
            GoRoute(path: '/services', builder: (_, _) => const ServicesScreen()),
            GoRoute(path: '/c/:slug', builder: (_, s) => ServiceScreen(slug: s.pathParameters['slug']!)),
            GoRoute(
              path: '/search',
              builder: (_, s) => SearchScreen(
                key: ValueKey(s.uri.query),
                initialQuery: s.uri.queryParameters['q'],
                initialKind: s.uri.queryParameters['kind'],
                initialCategory: s.uri.queryParameters['category'],
                initialWomen: s.uri.queryParameters['women'] == '1',
              ),
            ),
            GoRoute(path: '/l/:id', builder: (_, s) => ListingScreen(id: s.pathParameters['id']!)),
            GoRoute(path: '/s/:slug', builder: (_, s) => ShopScreen(slug: s.pathParameters['slug']!)),
            GoRoute(
              path: '/post',
              builder: (_, s) => PostScreen(
                key: ValueKey(s.uri.query),
                initialKind: s.uri.queryParameters['kind'],
                initialCategory: s.uri.queryParameters['category'],
              ),
            ),
            GoRoute(path: '/safety', builder: (_, _) => const SafetyScreen()),
            GoRoute(path: '/emergency', builder: (_, _) => const EmergencyScreen()),
            GoRoute(path: '/help', builder: (_, _) => const HelpScreen()),
            GoRoute(path: '/guides', builder: (_, _) => const GuidesScreen()),
            GoRoute(path: '/guides/:slug', builder: (_, s) => GuideScreen(slug: s.pathParameters['slug']!)),
            GoRoute(path: '/prices', builder: (_, _) => const PricesScreen()),
            GoRoute(path: '/books', builder: (_, s) => BooksScreen(initialCourse: s.uri.queryParameters['course'])),
            GoRoute(path: '/plan', builder: (_, _) => const PlanScreen()),
            GoRoute(
              path: '/tools',
              builder: (_, _) => const ToolsScreen(),
              routes: [
                GoRoute(path: 'split', builder: (_, _) => const SplitScreen()),
                GoRoute(path: 'deposit', builder: (_, _) => const DepositScreen()),
                GoRoute(path: 'receipt', builder: (_, _) => const ReceiptScreen()),
                GoRoute(path: 'permit', builder: (_, _) => const PermitScreen()),
              ],
            ),
          ],
        ),
      ],
      errorBuilder: (context, state) => const NotFoundScreen(),
    );

const _tabs = ['/', '/services', '/post', '/search', '/tools'];

/// The bottom bar under every screen, with "Post" standing out in the middle.
class _Shell extends StatelessWidget {
  const _Shell({required this.location, required this.child});

  final String location;
  final Widget child;

  int get _index {
    for (var i = _tabs.length - 1; i > 0; i--) {
      if (location == _tabs[i] || location.startsWith('${_tabs[i]}/')) return i;
    }
    if (location.startsWith('/c/') || location == '/services') return 1;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return Directionality(
      textDirection: s.direction,
      child: Scaffold(
        body: child,
        bottomNavigationBar: NavigationBar(
          selectedIndex: _index,
          height: 68,
          onDestinationSelected: (i) => context.go(_tabs[i]),
          destinations: [
            NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: s.t('nav.home')),
            NavigationDestination(icon: const Icon(Icons.grid_view_outlined), selectedIcon: const Icon(Icons.grid_view), label: s.t('nav.services')),
            NavigationDestination(
              icon: const CircleAvatar(radius: 16, backgroundColor: C.sea, child: Icon(Icons.add, color: Colors.white, size: 22)),
              label: s.t('nav.post'),
            ),
            NavigationDestination(icon: const Icon(Icons.search), label: s.t('nav.search')),
            NavigationDestination(icon: const Icon(Icons.handyman_outlined), selectedIcon: const Icon(Icons.handyman), label: s.t('tools.title').split(' ').first),
          ],
        ),
      ),
    );
  }
}
