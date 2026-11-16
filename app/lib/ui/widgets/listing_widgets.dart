import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/format.dart';
import '../../core/i18n.dart';
import '../../core/models.dart';
import '../theme.dart';
import 'common.dart';
import 'motion.dart';

/// "£45", the word for free, or nothing when no price was given.
String? priceText(Listing listing, Strings s) {
  if (listing.price == null) return null;
  if (listing.price == 0) return s.t('listing.free');
  return formatMoney(listing.price!, listing.currency, s.lang);
}

/// A sample picture. With "save data" on, pictures are not drawn.
class Photo extends StatelessWidget {
  const Photo(this.path, {super.key, this.dim = false});

  final String path;
  final bool dim;

  @override
  Widget build(BuildContext context) {
    if (context.app.lowData) return const ColoredBox(color: C.seaWash, child: SizedBox.expand());
    final picture = SvgPicture.asset('assets${path.startsWith('/') ? path : '/$path'}', fit: BoxFit.cover);
    return dim ? ColorFiltered(colorFilter: const ColorFilter.mode(Colors.white60, BlendMode.lighten), child: picture) : picture;
  }
}

/// The picture for an ad without photos (a service, a job): its service's drawing.
class ServiceArt extends StatelessWidget {
  const ServiceArt({super.key, required this.category, this.label = false});

  final String category;
  final bool label;

  @override
  Widget build(BuildContext context) {
    final bundle = context.bundle;
    final service = bundle.serviceOfCategory(category);
    if (service == null) return const ColoredBox(color: C.seaWash);
    final group = bundle.groupOf(service);
    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Colors.white, Color(group.bg)]),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(iconFor(service.icon), color: Color(group.fg), size: label ? 72 : 44),
            if (label) ...[
              const SizedBox(height: 10),
              Text(service.name.of(context.lang).toUpperCase(), style: TextStyle(color: Color(group.fg), fontWeight: FontWeight.w600, letterSpacing: 0.6)),
            ],
          ],
        ),
      ),
    );
  }
}

class WomenOnlyBadge extends StatelessWidget {
  const WomenOnlyBadge({super.key, this.small = false});

  final bool small;

  @override
  Widget build(BuildContext context) => Container(
        padding: EdgeInsets.symmetric(horizontal: small ? 6 : 8, vertical: small ? 2 : 4),
        decoration: BoxDecoration(color: C.womenWash, borderRadius: BorderRadius.circular(6)),
        child: Text(context.s.t('trust.womenOnly'), style: TextStyle(color: C.women, fontWeight: FontWeight.w600, fontSize: small ? 11 : 13)),
      );
}

class VerifiedBadge extends StatelessWidget {
  const VerifiedBadge({super.key});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(color: C.okWash, borderRadius: BorderRadius.circular(6)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.verified_outlined, size: 14, color: C.ok),
            const SizedBox(width: 4),
            Text(context.s.t('trust.verified'), style: const TextStyle(color: C.ok, fontWeight: FontWeight.w600, fontSize: 12)),
          ],
        ),
      );
}

/// One ad: picture, price in bold, title, place and time. Buyers scan prices first.
class ListingCard extends StatelessWidget {
  const ListingCard({super.key, required this.listing, required this.now, this.width, this.scope = 'grid'});

  final Listing listing;
  final DateTime now;
  final double? width;
  /// Where the card is shown; keeps the flying-photo tag unique when one ad appears twice.
  final String scope;

  String get heroTag => 'ad-$scope-${listing.id}';

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final price = priceText(listing, s);
    final cover = listing.photos.isEmpty ? null : listing.photos.first;
    return SizedBox(
      width: width,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => context.push('/l/${listing.id}', extra: heroTag),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 4 / 3,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // The picture flies into the ad page when the card is tapped.
                    Hero(
                      tag: heroTag,
                      child: cover != null
                          ? Photo(cover, dim: listing.isSold)
                          : listing.isWanted
                              ? Container(
                                  color: C.seaWash,
                                  padding: const EdgeInsets.all(12),
                                  alignment: AlignmentDirectional.centerStart,
                                  child: Text('“${listing.title}”', maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(color: C.seaDeep, fontWeight: FontWeight.w600, fontSize: 15)),
                                )
                              : ServiceArt(category: listing.category),
                    ),
                    DecoratedBox(decoration: BoxDecoration(border: Border.all(color: C.line), borderRadius: BorderRadius.circular(12))),
                    if (listing.isWanted)
                      PositionedDirectional(
                        top: 8,
                        start: 8,
                        child: _Label(s.t('listing.wanted').toUpperCase(), C.ink, Colors.white),
                      ),
                    if (listing.isSold) PositionedDirectional(bottom: 8, end: 8, child: _Label(s.t('listing.sold'), Colors.white, C.alert)),
                    PositionedDirectional(top: 6, end: 6, child: SaveHeart(id: listing.id, size: 18, onPhoto: true)),
                    if (listing.womenOnly) const PositionedDirectional(bottom: 8, start: 8, child: WomenOnlyBadge(small: true)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            if (price != null)
              Text.rich(TextSpan(children: [
                if (listing.isWanted) TextSpan(text: '${s.t('listing.budget')} ', style: const TextStyle(color: C.inkSoft, fontWeight: FontWeight.w500)),
                TextSpan(text: price),
              ]), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
            Text(listing.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 14, height: 1.3)),
            const SizedBox(height: 3),
            Row(
              children: [
                Expanded(child: Text(context.bundle.cityName(listing.city, s.lang), maxLines: 1, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.bodySmall)),
                const SizedBox(width: 4),
                Flexible(child: Text(timeAgo(listing.createdAt, now, s.lang), maxLines: 1, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.bodySmall)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Label extends StatelessWidget {
  const _Label(this.text, this.bg, this.fg);

  final String text;
  final Color bg;
  final Color fg;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
        decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6), border: fg == C.alert ? Border.all(color: C.alert, width: 1.5) : null),
        child: Text(text, style: TextStyle(color: fg, fontSize: 11, fontWeight: FontWeight.w700)),
      );
}

/// Ads in columns: two on a phone, more on a tablet.
class ListingGrid extends StatelessWidget {
  const ListingGrid({super.key, required this.listings, required this.now});

  final List<Listing> listings;
  final DateTime now;

  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (context, box) {
        const gap = 12.0;
        final columns = box.maxWidth >= 900 ? 5 : box.maxWidth >= 600 ? 3 : 2;
        final width = (box.maxWidth - gap * (columns - 1)) / columns;
        return Wrap(
          spacing: gap,
          runSpacing: 20,
          children: [for (final l in listings) ListingCard(listing: l, now: now, width: width)],
        );
      });
}

/// A titled row of ads that scrolls sideways, so the home screen can show every part of the app.
class ListingRail extends StatelessWidget {
  const ListingRail({super.key, required this.title, required this.listings, required this.now, this.hint, this.onSeeAll});

  final String title;
  final String? hint;
  final List<Listing> listings;
  final DateTime now;
  final VoidCallback? onSeeAll;

  @override
  Widget build(BuildContext context) {
    if (listings.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SectionHeader(title, hint: hint, action: context.s.t('home.seeAllShort'), onAction: onSeeAll),
        SizedBox(
          height: 244,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: listings.length,
            separatorBuilder: (_, _) => const SizedBox(width: 12),
            itemBuilder: (_, i) => ListingCard(listing: listings[i], now: now, width: 168, scope: title),
          ),
        ),
      ],
    );
  }
}

/// Shows shimmering placeholders while ads load, then fades in the real content.
class Loaded<T> extends StatelessWidget {
  const Loaded({super.key, required this.future, required this.builder, this.skeleton});

  final Future<T> future;
  final Widget Function(BuildContext context, T value) builder;
  /// What shows while loading; by default the shape of ad cards, shimmering.
  final Widget? skeleton;

  @override
  Widget build(BuildContext context) => FutureBuilder<T>(
        future: future,
        builder: (context, snap) => AnimatedSwitcher(
          duration: Duration(milliseconds: reduceMotion(context) ? 0 : 250),
          child: snap.connectionState == ConnectionState.done
              ? KeyedSubtree(key: const ValueKey('done'), child: builder(context, snap.data as T))
              : KeyedSubtree(key: const ValueKey('loading'), child: skeleton ?? const GridSkeleton()),
        ),
      );
}

