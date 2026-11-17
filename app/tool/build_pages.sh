#!/usr/bin/env bash
# Builds the web demo of the app into ../docs for GitHub Pages.
# Usage (from app/):  tool/build_pages.sh
# The build uses a relative base, so it works whether Pages serves the
# repository root (site at /<repo>/docs/) or the /docs folder (site at /<repo>/).
set -euo pipefail
cd "$(dirname "$0")/.."
flutter build web --release --no-web-resources-cdn --no-source-maps --base-href / \
  ${TEAM_WHATSAPP:+--dart-define=TEAM_WHATSAPP=$TEAM_WHATSAPP} \
  ${SITE_URL:+--dart-define=SITE_URL=$SITE_URL}
OUT=../docs
rm -rf "$OUT"
cp -r build/web "$OUT"
# No service worker: a demo that changes often should never be served stale.
rm -f "$OUT/flutter_service_worker.js"
perl -0pi -e 's/_flutter\.loader\.load\(\{.*?\}\s*\}\);/_flutter.loader.load();/s' "$OUT/flutter_bootstrap.js"
grep -q '_flutter.loader.load();' "$OUT/flutter_bootstrap.js" || { echo "service worker call not removed" >&2; exit 1; }
# This build draws with CanvasKit only; the other renderers and debug symbols are never loaded.
rm -f "$OUT"/canvaskit/skwasm* "$OUT"/canvaskit/wimp* "$OUT"/canvaskit/*.symbols "$OUT"/canvaskit/*/*.symbols
# GitHub Pages: serve files as they are; send unknown addresses to the app.
touch "$OUT/.nojekyll"
# The app uses #/ addresses, so a relative base works from any folder.
sed -i 's#<base href="/">#<base href="./">#' "$OUT/index.html"
grep -q '<base href="./">' "$OUT/index.html" || { echo "base not set" >&2; exit 1; }
# The repository root's page: everyone opens the website (../site, built by web/scripts/build-pages.mjs).
# This app's web demo stays at /docs/.
cat > ../index.html <<'HTML'
<!doctype html><meta charset="utf-8"><title>Adada</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0; url=site/">
<script>location.replace("site/" + location.search + location.hash);</script>
<p><a href="site/">Open Adada</a></p>
HTML
touch ../.nojekyll
echo "Built into docs/"
