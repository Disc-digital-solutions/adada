#!/usr/bin/env bash
# Builds the web demo of the app into ../docs for GitHub Pages.
# Usage (from app/):  tool/build_pages.sh [base-href]
# base-href is the repository name between slashes (default /adada/).
# For a custom domain, pass "/".
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${1:-/adada/}"
flutter build web --release --no-web-resources-cdn --no-source-maps --base-href "$BASE" \
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
cp "$OUT/index.html" "$OUT/404.html"
echo "Built into docs/ with base $BASE"
