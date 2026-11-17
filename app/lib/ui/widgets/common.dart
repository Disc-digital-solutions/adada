import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/app_state.dart';
import '../theme.dart';
import 'settings_sheet.dart';

/// A screen: the top bar with the name and the settings button, then the content, padded.
class AppPage extends StatelessWidget {
  const AppPage({
    super.key,
    this.title,
    required this.children,
    this.padding = const EdgeInsets.fromLTRB(16, 16, 16, 32),
    this.bottomBar,
  });

  final String? title;
  final List<Widget> children;
  final EdgeInsets padding;

  /// A bar fixed at the bottom of the screen, such as the contact bar on an ad.
  final Widget? bottomBar;

  @override
  Widget build(BuildContext context) {
    // Each screen shows its own messages, above its own bottom bar: a "Saved · Undo" message
    // must never cover the contact bar it came from.
    return ScaffoldMessenger(
      child: Scaffold(
        appBar: AppBar(
          title: title == null ? const Brand() : Text(title!),
          actions: [
            const _SavedButton(),
            IconButton(
              tooltip: context.s.t('display.title'),
              icon: const Icon(Icons.translate),
              onPressed: () => showSettings(context),
            ),
          ],
        ),
        body: ListView(padding: padding, children: children),
        bottomNavigationBar: bottomBar,
      ),
    );
  }
}

/// The heart at the top: opens the saved ads, with how many there are.
class _SavedButton extends StatelessWidget {
  const _SavedButton();

  @override
  Widget build(BuildContext context) {
    final count = context.app.saved.length;
    return IconButton(
      tooltip: context.s.t('app.saved'),
      onPressed: () => context.push('/saved'),
      icon: Badge(
        isLabelVisible: count > 0,
        label: Text('$count'),
        backgroundColor: C.coral,
        textColor: C.ink,
        child: Icon(count > 0 ? Icons.favorite : Icons.favorite_border),
      ),
    );
  }
}

/// The name, with the price-tag mark.
class Brand extends StatelessWidget {
  const Brand({super.key});

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      const Icon(Icons.sell, color: C.tag, size: 24),
      const SizedBox(width: 8),
      Flexible(
        child: Text(
          context.bundle.siteName,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
        ),
      ),
    ],
  );
}

/// The one surface used everywhere: white, a hairline border, a soft shadow.
class Panel extends StatelessWidget {
  const Panel({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.onTap,
    this.color,
  });

  final Widget child;
  final EdgeInsets padding;
  final VoidCallback? onTap;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: color ?? C.card,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: C.line),
      ),
      elevation: 0,
      shadowColor: Colors.black12,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  const SectionHeader(
    this.title, {
    super.key,
    this.action,
    this.onAction,
    this.hint,
  });

  final String title;
  final String? hint;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 28, bottom: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleLarge),
              if (hint != null)
                Text(hint!, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
        if (action != null)
          TextButton.icon(
            onPressed: onAction,
            iconAlignment: IconAlignment.end,
            icon: const Icon(Icons.arrow_forward, size: 16),
            label: Text(
              action!,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
      ],
    ),
  );
}

class Heading extends StatelessWidget {
  const Heading(this.title, {super.key, this.intro});

  final String title;
  final String? intro;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.headlineMedium),
        if (intro != null) ...[
          const SizedBox(height: 6),
          Text(
            intro!,
            style: const TextStyle(
              color: C.inkSoft,
              fontSize: 15.5,
              height: 1.45,
            ),
          ),
        ],
      ],
    ),
  );
}

/// A short message with a coloured edge: information, or (alert) a warning.
class Notice extends StatelessWidget {
  const Notice(this.text, {super.key, this.alert = false});

  final String text;
  final bool alert;

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(
      color: alert ? C.alertWash : C.seaWash,
      borderRadius: BorderRadius.circular(8),
      border: BorderDirectional(
        start: BorderSide(color: alert ? C.alert : C.sea, width: 4),
      ),
    ),
    child: Text(text, style: const TextStyle(fontSize: 14.5, height: 1.4)),
  );
}

/// A square of colour with a drawing in it.
class IconBadge extends StatelessWidget {
  const IconBadge(
    this.icon, {
    super.key,
    this.bg = C.seaWash,
    this.fg = C.seaDeep,
    this.size = 44,
  });

  final IconData icon;
  final Color bg;
  final Color fg;
  final double size;

  @override
  Widget build(BuildContext context) => Container(
    width: size,
    height: size,
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(size * 0.27),
    ),
    child: Icon(icon, color: fg, size: size * 0.52),
  );
}

/// Opens a link outside the app: WhatsApp, a phone call, the share sheet's targets.
Future<void> openExternal(String url) =>
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

Future<void> shareText(String text) =>
    SharePlus.instance.share(ShareParams(text: text));

Future<void> copyText(BuildContext context, String text, String done) async {
  await Clipboard.setData(ClipboardData(text: text));
  HapticFeedback.selectionClick();
  if (context.mounted) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(done), behavior: SnackBarBehavior.floating),
    );
  }
}

/// Opens a page of the app from a website-style address: "c/viewing", "guides/sim", "help".
void openPage(BuildContext context, String href) =>
    context.push('/${href.replaceFirst(RegExp('^/'), '')}');

class WaButton extends StatelessWidget {
  const WaButton({super.key, required this.label, required this.onPressed});

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => FilledButton.icon(
    onPressed: onPressed,
    style: FilledButton.styleFrom(
      backgroundColor: C.wa,
      foregroundColor: C.ink,
    ),
    icon: const Icon(Icons.chat_bubble_outline, size: 20),
    label: Text(label),
  );
}

/// The steps of a list, numbered in a dark circle.
class StepRow extends StatelessWidget {
  const StepRow({super.key, required this.n, required this.text, this.onTap});

  final int n;
  final String text;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Panel(
      onTap: onTap,
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 13,
            backgroundColor: C.ink,
            child: Text(
              '$n',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 15, height: 1.45),
            ),
          ),
          if (onTap != null)
            const Padding(
              padding: EdgeInsetsDirectional.only(start: 8),
              child: Icon(Icons.arrow_forward, size: 18, color: C.sea),
            ),
        ],
      ),
    ),
  );
}
