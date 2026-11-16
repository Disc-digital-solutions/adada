import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../core/app_state.dart';
import '../theme.dart';

/// True when the phone asks for less motion (accessibility setting): animations then stop.
bool reduceMotion(BuildContext context) => MediaQuery.maybeDisableAnimationsOf(context) ?? false;

/// A soft light that sweeps across grey shapes while ads load: feels faster than a spinner.
class Shimmer extends StatefulWidget {
  const Shimmer({super.key, required this.child});

  final Widget child;

  @override
  State<Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<Shimmer> with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1300));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (reduceMotion(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _controller,
        child: widget.child,
        builder: (context, child) => ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) => LinearGradient(
            begin: Alignment(-1.6 + 3.2 * _controller.value, -0.3),
            end: Alignment(-0.6 + 3.2 * _controller.value, 0.3),
            colors: const [Color(0xFFE6ECEF), Color(0xFFF5F8F9), Color(0xFFE6ECEF)],
          ).createShader(bounds),
          child: child,
        ),
      );
}

/// A grey block in the shape of what will appear.
class Bone extends StatelessWidget {
  const Bone({super.key, this.width, this.height = 14, this.radius = 6, this.aspect});

  final double? width;
  final double height;
  final double radius;
  final double? aspect;

  @override
  Widget build(BuildContext context) {
    final box = Container(width: width, height: aspect == null ? height : null, decoration: BoxDecoration(color: C.line, borderRadius: BorderRadius.circular(radius)));
    return aspect == null ? box : AspectRatio(aspectRatio: aspect!, child: box);
  }
}

/// The shape of a grid of ad cards, shown while they load.
class GridSkeleton extends StatelessWidget {
  const GridSkeleton({super.key, this.count = 4});

  final int count;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(top: 12),
        child: Shimmer(
          child: LayoutBuilder(builder: (context, box) {
            final width = (box.maxWidth - 12) / 2;
            return Wrap(spacing: 12, runSpacing: 20, children: [
              for (var i = 0; i < count; i++)
                SizedBox(
                  width: width,
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    const Bone(aspect: 4 / 3, radius: 12),
                    const SizedBox(height: 10),
                    Bone(width: width * 0.4, height: 15),
                    const SizedBox(height: 6),
                    Bone(width: width * 0.85),
                    const SizedBox(height: 6),
                    Bone(width: width * 0.55, height: 11),
                  ]),
                ),
            ]);
          }),
        ),
      );
}

/// The heart: saves an ad on the phone, with a small pop and a tap felt in the hand.
/// Unsaving shows "Removed from saved · Undo".
class SaveHeart extends StatelessWidget {
  const SaveHeart({super.key, required this.id, this.size = 22, this.onPhoto = false});

  final String id;
  final double size;
  /// Drawn on a picture: a white round backing so it stays visible.
  final bool onPhoto;

  @override
  Widget build(BuildContext context) {
    final app = context.app;
    final saved = app.isSaved(id);
    final s = app.s;
    final heart = TweenAnimationBuilder<double>(
      key: ValueKey(saved),
      tween: Tween(begin: saved && !reduceMotion(context) ? 1.45 : 1, end: 1),
      duration: const Duration(milliseconds: 380),
      curve: Curves.elasticOut,
      builder: (context, scale, child) => Transform.scale(scale: scale, child: child),
      child: Icon(saved ? Icons.favorite : Icons.favorite_border, size: size, color: saved ? C.alert : (onPhoto ? C.ink : C.inkSoft)),
    );
    void toggle() {
      HapticFeedback.lightImpact();
      final at = app.savedIndex(id);
      final nowSaved = app.toggleSaved(id);
      final messenger = ScaffoldMessenger.of(context)..hideCurrentSnackBar();
      messenger.showSnackBar(SnackBar(
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        content: Text(s.t(nowSaved ? 'app.savedDone' : 'app.removed')),
        action: nowSaved ? null : SnackBarAction(label: s.t('app.undo'), onPressed: () => app.toggleSaved(id, at: at)),
      ));
    }

    return Semantics(
      button: true,
      label: s.t(saved ? 'app.unsave' : 'app.save'),
      child: onPhoto
          ? Material(
              color: Colors.white.withValues(alpha: 0.92),
              shape: const CircleBorder(),
              child: InkWell(customBorder: const CircleBorder(), onTap: toggle, child: Padding(padding: const EdgeInsets.all(7), child: heart)),
            )
          : IconButton(onPressed: toggle, icon: heart, tooltip: s.t(saved ? 'app.unsave' : 'app.save')),
    );
  }
}
