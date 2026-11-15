import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/app_state.dart';
import '../../core/models.dart';
import '../theme.dart';
import 'common.dart';

class ServiceBadge extends StatelessWidget {
  const ServiceBadge({super.key, required this.service, this.size = 44});

  final Service service;
  final double size;

  @override
  Widget build(BuildContext context) {
    final group = context.bundle.groupOf(service);
    return IconBadge(iconFor(service.icon), bg: Color(group.bg), fg: Color(group.fg), size: size);
  }
}

/// One service in a grid: the badge, the name under it.
class ServiceTile extends StatelessWidget {
  const ServiceTile({super.key, required this.service});

  final Service service;

  @override
  Widget build(BuildContext context) => Panel(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 12),
        onTap: () => context.push('/c/${service.slug}'),
        child: Column(
          children: [
            ServiceBadge(service: service),
            const SizedBox(height: 8),
            Text(service.name.of(context.lang), textAlign: TextAlign.center, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w500, height: 1.2)),
          ],
        ),
      );
}

/// A wide row: badge, name, what it covers, and how many ads.
class ServiceRow extends StatelessWidget {
  const ServiceRow({super.key, required this.service, this.count = 0});

  final Service service;
  final int count;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Panel(
          padding: const EdgeInsets.all(12),
          onTap: () => context.push('/c/${service.slug}'),
          child: Row(
            children: [
              ServiceBadge(service: service),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(service.name.of(context.lang), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                    Text(service.blurb.of(context.lang), maxLines: 1, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
              if (count > 0)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 2),
                  decoration: BoxDecoration(color: C.paper, borderRadius: BorderRadius.circular(20)),
                  child: Text('$count', style: const TextStyle(fontWeight: FontWeight.w600, color: C.inkSoft)),
                ),
            ],
          ),
        ),
      );
}

/// One tool or guide: an icon on dark, the name and one line on what it does.
class ToolTile extends StatelessWidget {
  const ToolTile({super.key, required this.tool});

  final Tool tool;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Panel(
          padding: const EdgeInsets.all(14),
          onTap: () => openPage(context, tool.href),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IconBadge(iconFor(tool.icon), bg: C.ink, fg: Colors.white, size: 40),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tool.name.of(context.lang), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                    const SizedBox(height: 2),
                    Text(tool.blurb.of(context.lang), style: Theme.of(context).textTheme.bodySmall),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
}

/// A grid with a fixed number of columns that sizes to its content, for use inside a list.
class TileGrid extends StatelessWidget {
  const TileGrid({super.key, required this.children, this.columns = 4, this.wideColumns = 6, this.height = 132});

  final List<Widget> children;
  final int columns;
  final int wideColumns;
  /// Every tile the same height, so a name on two lines does not make its row uneven.
  final double height;

  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (context, box) {
        const gap = 8.0;
        final n = box.maxWidth >= 600 ? wideColumns : columns;
        final width = (box.maxWidth - gap * (n - 1)) / n;
        return Wrap(spacing: gap, runSpacing: gap, children: [for (final c in children) SizedBox(width: width, height: height, child: c)]);
      });
}
