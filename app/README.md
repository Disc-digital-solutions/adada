# The mobile app (Flutter)

The Island Market app for Android and iPhone. It sits next to the website (`../web`); it does not replace it.

**Why both.** The whole growth plan runs on links that open without installing anything: ads pasted in
Facebook and WhatsApp groups, shop QR codes, Google search. The website answers those links; the app is for
people who come back every day. Both show the same data and the same words.

## What is in it

Every screen of the website, built natively:

| Tab | Screens |
|---|---|
| Home | Search, the services grid, a row of the newest ads for each part of life, "wanted right now", tools, post and safety bands |
| Services | All 43 services in 8 groups; one screen per service (ads with a city and women-only filter, or "how it works" and a WhatsApp request) |
| Post an ad | Paste a group post and the form fills itself in; sends the ad to the team's WhatsApp line until the database exists |
| Search | Words, category, city, selling or wanted, price inside one currency, women only, sort |
| Tools | Student questions, residence-permit reminder (with calendar reminders), emergency, arrival plan, books by course code, typical prices, bill splitter, deposit letter, rent receipt, 9 guides, safety |

Plus the ad page (photos to swipe, the "price looks wrong" warning, WhatsApp, share, copy for groups, report),
shops, and settings (language, larger text, save data) behind the translate button at the top.

**Feel and motion (added 16 Nov):** a first-run welcome (language, then "what brings you here?", which
reorders the home screen for students, residents, businesses or visitors); a heart on every ad with a
Saved list and Undo; the photo flies from the card into the ad; the ad's price, heart and WhatsApp stay
fixed at the bottom; filters slide up as chips with a live "Show N results"; posting in six steps with a
progress bar, photos from the gallery or camera (drag to reorder) and a preview; shimmering placeholders
while loading; native page transitions; small vibrations on save and copy. Animations stop when the phone
asks for reduced motion. The Readex Pro font (Turkish, English and Arabic), an app icon and a launch screen
are built in; the icon is a placeholder until the real logo exists (`dart run flutter_launcher_icons`).

The app follows the phone's language the first time (Turkish, English or Arabic; Turkish otherwise), and
Arabic runs right to left.

## One source of truth

The words, services, guides, answers, tools, sample ads and the paste-reader's word lists all come from the
website's code. After changing any of them there, run, in `web/`:

```bash
npm run export:app
```

It rewrites `app/assets/data/*.json` and copies the sample pictures. Never edit those files by hand.

The logic (reading a pasted post, search filters, price warning, bill splitting, permit dates, the texts that
leave the app) is written again in Dart in `lib/core/logic/`, with the same test cases as the website.

## Run it

Install Flutter (stable) from flutter.dev, then in this folder:

```bash
flutter pub get
flutter run
```

Optional settings, given at build time:

```bash
flutter run --dart-define=TEAM_WHATSAPP=+90533XXXXXXX --dart-define=SITE_URL=https://your-domain
```

`TEAM_WHATSAPP` switches on posting by WhatsApp, reports, requests and "ask us". Use the company's WhatsApp
Business number. `SITE_URL` is the website address used in shared links.

## Check it

```bash
flutter analyze
flutter test
```

`flutter test` runs 135 tests: the logic, every screen in all three languages at phone size (any error or text
overflowing its box fails the test), filling the form from a pasted post, switching to Arabic, and a check that
every text the app uses exists in all three languages.

## Build for the stores

**Android:** `flutter build apk --release` (or `appbundle` for Google Play). This needs the Android SDK;
installing it asks you to accept Google's Android SDK licence (`flutter doctor --android-licenses`). That is a
legal agreement, so accept it yourself.

**iPhone:** needs a Mac with Xcode: `flutter build ipa`.

**Before publishing:**

- **Store accounts.** Google Play's list of developer countries does not include Northern Cyprus, and Apple's
  position is unclear (see `../EVERYTHING-SO-FAR.md`). The developer account may need to be held by a company
  registered elsewhere, for example in Turkey. Settle this before planning a store launch date.
- **App name and icon.** "Island Market" is a working name; the icon is Flutter's default.
- **Package name.** `com.islandmarket.island_market`; change it to the real company domain before the first
  upload, because it cannot be changed afterwards.
- **Links into the app.** The routes match the website's addresses (`/l/<id>`, `/s/<shop>`, `/c/<service>`),
  so Android App Links and iOS Universal Links can open website links in the app once the domain exists.

## What is not in the app yet

- **The database.** Like the website, the app runs on the sample ads. `lib/core/data/repo.dart` is the one
  place a Supabase version plugs in; no screen changes.
- **Sending photos straight to the team.** With photos, the ad goes through the phone's share menu (WhatsApp, then the team's chat), because a WhatsApp link can carry text only.
- **Voice posting.** The website uses the browser's speech-to-text; the app needs a speech plugin, tested on
  real phones.
- **Printing the receipt.** The app shares the receipt as text; printing to PDF needs a printing plugin.
- **The shop QR code and the embed widget** stay on the website, where they are used.
- **Tested on a real phone.** The app was tested with Flutter's tests and in a phone-sized browser, not yet on
  an Android phone or an iPhone.

## How the code is laid out

| Folder | What is in it |
|---|---|
| `lib/core/` | Words (`i18n.dart`), prices and dates (`format.dart`), the data shapes (`models.dart`), settings (`app_state.dart`) |
| `lib/core/data/` | Loading the exported data (`bundle.dart`); the data store (`repo.dart`, `demo_repo.dart`) |
| `lib/core/logic/` | The logic ported from the website, one file per subject |
| `lib/ui/` | Theme (the website's colours), navigation (`router.dart`), widgets and screens |
| `assets/data/` | Exported from the website. Do not edit |
| `test/` | Logic, screens and language tests |
