import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/data/bundle.dart';
import '../../core/format.dart';
import '../../core/i18n.dart';
import '../../core/logic/listings.dart';
import '../../core/logic/prices.dart';
import '../../core/logic/share_text.dart';
import '../../core/models.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';
import '../widgets/motion.dart';

/// One ad: photos to swipe, price, where and when, the price warning, WhatsApp, share, copy for
/// groups, the seller, and report.
class ListingScreen extends StatelessWidget {
  const ListingScreen({super.key, required this.id, this.heroTag});

  final String id;
  /// The tag of the card that was tapped, so its picture flies into this page.
  final String? heroTag;

  @override
  Widget build(BuildContext context) {
    final repo = context.bundle.repo;
    final now = DateTime.now();
    Future<(Listing?, List<Listing>)> load() async => (await repo.listing(id, now), await repo.search(const ListingFilter(), now));
    return Loaded<(Listing?, List<Listing>)>(
      future: load(),
      builder: (context, data) {
        final (listing, all) = data;
        if (listing == null || listing.status == 'removed') {
          return AppPage(children: [Notice(context.s.t(listing == null ? 'notFound.title' : 'listing.removedNotice'), alert: true)]);
        }
        return _ListingView(listing: listing, all: all, now: now, heroTag: heroTag ?? 'ad-grid-$id');
      },
    );
  }
}

class _ListingView extends StatelessWidget {
  const _ListingView({required this.listing, required this.all, required this.now, required this.heroTag});

  final Listing listing;
  final List<Listing> all;
  final DateTime now;
  final String heroTag;

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    final bundle = context.bundle;
    final price = priceText(listing, s);
    final usual = listing.isSold ? null : tooLowComparedWith(listing, all);
    final link = '${bundle.siteUrl}/l/${listing.id}';
    final team = AppBundle.teamWhatsapp;

    // The group post: the reader's language first, then the others; one link without a language.
    final groupText = groupPost(
      title: listing.isWanted ? '${s.t('listing.wanted')}: ${listing.title}' : listing.title,
      price: price,
      city: bundle.cityName(listing.city, s.lang),
      lines: [
        for (final lang in [s.lang, ...Lang.values.where((l) => l != s.lang)])
          bundle.strings(lang).t(listing.isWanted ? 'listing.groupLineWanted' : 'listing.groupLine'),
      ],
      url: link,
    );

    return AppPage(
      padding: const EdgeInsets.only(bottom: 32),
      // The contact bar stays in reach while reading; sold ads have nothing to contact.
      bottomBar: listing.isSold ? null : _ContactBar(listing: listing, price: price),
      children: [
        AspectRatio(
          aspectRatio: listing.photos.isEmpty ? 16 / 10 : 1,
          child: listing.photos.isEmpty
              ? Hero(tag: heroTag, child: listing.isWanted ? const ColoredBox(color: C.seaWash) : ServiceArt(category: listing.category, label: true))
              : PageView(children: [
                  for (final (i, photo) in listing.photos.indexed)
                    Stack(fit: StackFit.expand, children: [
                      i == 0 ? Hero(tag: heroTag, child: Photo(photo, dim: listing.isSold)) : Photo(photo, dim: listing.isSold),
                      if (listing.photos.length > 1)
                        PositionedDirectional(
                          bottom: 12,
                          end: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(color: C.ink.withValues(alpha: 0.8), borderRadius: BorderRadius.circular(20)),
                            child: Text('${i + 1} / ${listing.photos.length}', textDirection: TextDirection.ltr, style: const TextStyle(color: Colors.white, fontSize: 13)),
                          ),
                        ),
                    ]),
                ]),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (listing.isWanted) Text(s.t('listing.wanted'), style: const TextStyle(color: C.seaDeep, fontWeight: FontWeight.w600)),
              Text(listing.title, style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 10),
              Row(children: [
                if (listing.isWanted && price != null) Text('${s.t('listing.budget')} ', style: const TextStyle(color: C.inkSoft)),
                if (price != null) Text(price, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w700)),
                if (listing.isSold) ...[
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(border: Border.all(color: C.alert, width: 2), borderRadius: BorderRadius.circular(5)),
                    child: Text(s.t('listing.sold'), style: const TextStyle(color: C.alert, fontWeight: FontWeight.w700)),
                  ),
                ],
              ]),
              const SizedBox(height: 6),
              Wrap(spacing: 14, children: [
                Text(bundle.cityName(listing.city, s.lang), style: const TextStyle(color: C.inkSoft)),
                Text(timeAgo(listing.createdAt, now, s.lang), style: const TextStyle(color: C.inkSoft)),
                Text(s.plural('listing.seenBy', listing.views), style: const TextStyle(color: C.inkSoft)),
              ]),
              if (listing.womenOnly) const Padding(padding: EdgeInsets.only(top: 10), child: Align(alignment: AlignmentDirectional.centerStart, child: WomenOnlyBadge())),
              // The commonest rental scam starts with a price far below the usual one (ACC-20).
              if (usual != null) Padding(padding: const EdgeInsets.only(top: 14), child: Notice(s.t('trust.priceWarn', {'price': formatMoney(usual, listing.currency, s.lang)}), alert: true)),
              if (listing.isSold) Padding(padding: const EdgeInsets.only(top: 14), child: Notice(s.t('listing.soldNotice'), alert: true)),
              if (!listing.isSold) ...[
                const SizedBox(height: 16),
                Row(children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => shareText('${listing.title}\n$link'), icon: const Icon(Icons.share_outlined, size: 18), label: Text(s.t('listing.share')))),
                  const SizedBox(width: 8),
                  Expanded(flex: 2, child: OutlinedButton.icon(onPressed: () => copyText(context, groupText, s.t('listing.copiedForGroups')), icon: const Icon(Icons.copy, size: 18), label: Text(s.t('listing.copyForGroups'), overflow: TextOverflow.ellipsis))),
                ]),
                const SizedBox(height: 6),
                Text(s.t('listing.safetyNote'), style: Theme.of(context).textTheme.bodySmall),
              ],
              const SizedBox(height: 18),
              Text(listing.description, style: Theme.of(context).textTheme.bodyLarge),
              const SizedBox(height: 18),
              Panel(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(s.t('listing.seller'), style: Theme.of(context).textTheme.bodySmall),
                  const SizedBox(height: 2),
                  Wrap(spacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [
                    Text(listing.seller.name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600)),
                    if (listing.seller.verified) const VerifiedBadge(),
                  ]),
                  TextButton(
                    style: TextButton.styleFrom(padding: EdgeInsets.zero),
                    onPressed: () => context.push('/s/${listing.seller.shopSlug}'),
                    child: Text(s.t('listing.viewShop')),
                  ),
                ]),
              ),
              if (team.isNotEmpty)
                Align(
                  alignment: AlignmentDirectional.centerStart,
                  child: TextButton.icon(
                    onPressed: () => openExternal(whatsappLink(team, s.t('listing.reportMessage', {'url': link}))),
                    icon: const Icon(Icons.flag_outlined, size: 18, color: C.inkSoft),
                    label: Text(s.t('listing.report'), style: const TextStyle(color: C.inkSoft)),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Fixed at the bottom of an ad: the price, the heart, and WhatsApp, always in reach.
class _ContactBar extends StatelessWidget {
  const _ContactBar({required this.listing, required this.price});

  final Listing listing;
  final String? price;

  @override
  Widget build(BuildContext context) {
    final s = context.s;
    return Material(
      color: C.card,
      elevation: 8,
      shadowColor: Colors.black26,
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 8, 10),
          child: Row(children: [
            if (price != null)
              Padding(
                padding: const EdgeInsetsDirectional.only(end: 10),
                child: Text(price!, style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w700)),
              ),
            Expanded(
              child: WaButton(
                label: s.t('listing.whatsapp'),
                // Sample ads have no seller; once the database is connected this opens the seller's chat.
                onPressed: () => ScaffoldMessenger.of(context).showSnackBar(SnackBar(behavior: SnackBarBehavior.floating, content: Text(s.t('demo.noSeller')))),
              ),
            ),
            const SizedBox(width: 4),
            SaveHeart(id: listing.id, size: 26),
          ]),
        ),
      ),
    );
  }
}
