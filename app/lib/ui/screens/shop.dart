import 'package:flutter/material.dart';

import '../../core/app_state.dart';
import '../../core/data/repo.dart';
import '../../core/i18n.dart';
import '../../core/logic/share_text.dart';
import '../theme.dart';
import '../widgets/common.dart';
import '../widgets/listing_widgets.dart';

/// A seller's shop: every ad on one page and one link.
class ShopScreen extends StatelessWidget {
  const ShopScreen({super.key, required this.slug});

  final String slug;

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    return Loaded<Shop?>(
      future: context.bundle.repo.shop(slug, now),
      builder: (context, shop) {
        final s = context.s;
        if (shop == null) return AppPage(children: [Notice(s.t('notFound.title'), alert: true)]);
        final bundle = context.bundle;
        final link = '${bundle.siteUrl}/s/${shop.seller.shopSlug}';
        final text = groupPost(
          title: shop.seller.name,
          city: bundle.cityName(shop.seller.city, s.lang),
          lines: [for (final lang in [s.lang, ...Lang.values.where((l) => l != s.lang)]) bundle.strings(lang).t('shop.groupLine')],
          url: link,
        );
        return AppPage(
          title: shop.seller.name,
          children: [
            Panel(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Wrap(spacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [
                  Text(shop.seller.name, style: Theme.of(context).textTheme.headlineMedium),
                  if (shop.seller.verified) const VerifiedBadge(),
                ]),
                const SizedBox(height: 4),
                Text('${bundle.cityName(shop.seller.city, s.lang)}, ${s.plural('shop.ads', shop.listings.length)}', style: const TextStyle(color: C.inkSoft)),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () => shareText('${shop.seller.name}\n$link'), icon: const Icon(Icons.share_outlined, size: 18), label: Text(s.t('shop.share'), overflow: TextOverflow.ellipsis))),
                  const SizedBox(width: 8),
                  Expanded(child: OutlinedButton.icon(onPressed: () => copyText(context, text, s.t('listing.copiedForGroups')), icon: const Icon(Icons.copy, size: 18), label: Text(s.t('listing.copyForGroups'), overflow: TextOverflow.ellipsis))),
                ]),
              ]),
            ),
            const SizedBox(height: 18),
            if (shop.listings.isEmpty) Text(s.t('shop.empty')) else ListingGrid(listings: shop.listings, now: now),
          ],
        );
      },
    );
  }
}
