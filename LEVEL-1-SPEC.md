# Level 1 spec — the marketplace core

This is everything in L1 and nothing above it. It is written to be handed to a **build session**.
No code is written in a planning session.

Feature IDs refer to `BUILD-LADDER.md`. `py build.py` fails if this file mentions a feature above L1.

---

## Build status (13 Nov 2026)

The code is in `web/`. It runs on sample ads.

| Slice | State |
|---|---|
| 1 Post a listing | Form built, and a pasted group post fills it in. Until sign-in and the database exist, it sends the ad to the team's WhatsApp line for a person to publish (see `IDEA-REVIEW.md`) |
| 2 Browse and search | Built, except favourites (needs sign-in) |
| 3 Listing page | Built. The view counter and tap counter show sample numbers until the database exists |
| 4 My listings, shop, QR | Shop page and QR built; my listings, mark as sold and leaving sale not built |
| 5 Admin and reports | Safety page built; reports and admin not built |
| 6 Languages | Turkish, English, Arabic built; the two guide pages not built |

Differences from the text below, decided while building:

- A shop's address is `/s/<shop-name>`, not `/<shop-name>`, so it can never clash with a page.
- There is no "Free" category. A free item is any ad with the price set to free.
- The Call button is not built yet (it is first on the cut list).

---

## What L1 is

A person can post anything with photos and a price, get a shop link, browse, search, and contact the
seller on WhatsApp. That is the whole product.

## What L1 is not

Leave all of these for later levels, even if they look quick:

- In-app chat (people talk on WhatsApp)
- Sign-up by phone code (email or Google only)
- Special fields per category (a car and a sofa use the same form)
- Automatic translation of listings (the interface is translated; the seller's text is shown as written)
- Map, reviews, ratings, company pages
- Any payment, featured listing or subscription
- A store app (it is a website that works well on a phone)

## Built with

Next.js + Supabase + Vercel. Supabase provides the login, the
database and the photo storage. Check the current documentation for each at the start of the build
session; do not rely on memory for versions or limits.

---

## Data

Eight tables. Each row below says what it holds, who may read it and who may change it. In Supabase
those last two columns become row-level security rules; they are part of the feature, not an extra.

| Table | Holds | Who can read | Who can change |
|---|---|---|---|
| `profiles` | One per person: display name, WhatsApp number, city, interface language, shop slug, `is_admin`, `is_banned` | Everyone (name, city, shop slug); the WhatsApp number only through a listing's contact button | The person themself; admins for `is_banned` |
| `categories` | Slug, name in Turkish / English / Arabic, sort order | Everyone | Admins |
| `listings` | Owner, kind (`offer` or `wanted`), title, description, price, currency, category, city, status (`live`, `sold`, `removed`), sale group (optional), view count, created and updated times | Everyone, when status is `live` or `sold`; the owner and admins always | The owner; admins for `removed` |
| `listing_photos` | Listing, file path, order | Same as the listing | The listing's owner |
| `sales` | A "leaving the island" sale: owner, title, note, leaving date | Everyone | The owner |
| `favourites` | Person, listing | The person | The person |
| `contact_taps` | Listing, kind (`whatsapp` or `call`), time | Admins; the owner sees only a count | Written by the app on each tap |
| `reports` | Listing, reporter, reason, note, status, time | Admins | Anyone signed in creates; admins update |

`sales` can be left out of slice 4 if time is short — see "If the date is close".

**Fixed lists for L1**

- **Cities:** Famagusta, Nicosia, Kyrenia, İskele, Güzelyurt, Lefke. Launch is Famagusta, but any city can be chosen.
- **Currencies:** TRY, GBP, EUR, USD. Shown as entered. No conversion in L1.
- **Starting categories** (final list comes from the Facebook census in `VALIDATION-KIT.md`): Electronics · Furniture · Home appliances · Books and study · Clothes · Rooms and flats · Roommate or lease take-over · Other.

**Limits (my defaults — change them in the build session if the census says otherwise)**

- Up to 8 photos per listing, shrunk in the browser before upload
- Up to 10 new listings per person per day
- Title up to 80 characters; description up to 1,500

---

## The six slices

Build them in order. Each one is usable when it is finished.

### Slice 1 — Post a listing with photos
Features: ACC-01, ACC-02, LST-01, LST-06, BUY-01, BUY-02, ROOM-01, ROOM-02

Screens
- **Sign in:** email link or Google.
- **First time only:** display name, WhatsApp number (with country code), city.
- **New listing:** photos → title → price and currency (or "Free") → category → city → description. A switch at the top: *I am selling* / *I am looking for* (a "wanted" post).

Done when
- [ ] A new person can go from the home page to a published listing in under one minute on a phone
- [ ] A listing with no photo is allowed only for "wanted" posts
- [ ] A signed-out visitor who taps "Post" is asked to sign in and then lands back on the form
- [ ] A person cannot edit someone else's listing, even by changing the address in the browser
- [ ] Photos larger than a phone photo still upload, because they are shrunk first

### Slice 2 — Browse and search
Features: SRCH-01, SRCH-02, SRCH-03, LST-08

Screens
- **Home:** newest listings as a photo grid; a row of categories; a search box.
- **Category page** and **search results:** filters for category, city, price range, and *selling / wanted*; sort by newest or price.
- **Favourites:** the listings a person has saved.

Done when
- [ ] The home page shows only categories that have at least one live listing
- [ ] Search finds a word in the title or the description
- [ ] Filters can be combined, and the address in the browser changes so a filtered page can be shared
- [ ] Sold listings stay visible for 7 days marked "Sold", then leave the lists
- [ ] The pages load with their listings already in them, so Google can read them
- [ ] With no results, the page says so and offers "Post a wanted ad"

### Slice 3 — Listing page with the WhatsApp button and tap counter
Features: TALK-01, TALK-02, LST-03, ADM-02

Screens
- **Listing page:** photos, title, price, city, time posted, description, seller's name with a link to their shop, "Seen by N people", buttons: **WhatsApp**, **Call**, **Save**, **Share**, **Report**.

The WhatsApp button opens `https://wa.me/<number>?text=<message>`. The message is written in the
buyer's interface language, names the app and carries the link, for example:
*"Hi, I saw 'Study desk, like new' on <AppName>: <link>"*

Done when
- [ ] Tapping WhatsApp opens WhatsApp with the message filled in, on Android and on iPhone
- [ ] Every tap on WhatsApp or Call adds one row to `contact_taps`
- [ ] The view counter goes up once per visitor per day, not on every refresh, and not for the owner
- [ ] A shared link shows the photo, title and price as a preview card in WhatsApp
- [ ] A sold or removed listing shows that clearly and hides the contact buttons

### Slice 4 — My listings, mark as sold, shop link, QR
Features: LST-02, LST-04, LST-05, LST-07

Screens
- **My listings:** each with its views and taps, and buttons: edit, mark as sold, delete.
- **My shop:** a public page at `/s/<shop-name>` with the person's name, city and all their live listings — the link to put in an Instagram bio.
- **Leaving the island sale:** group several of my listings under one title and leaving date; one link shows them all.
- **QR:** on the shop and on each listing, a QR code to download or print.

Done when
- [ ] A person chooses their shop name once; it is unique and safe to use in an address
- [ ] The shop page works for a visitor who is not signed in
- [ ] "Mark as sold" takes one tap and can be undone
- [ ] The QR code, scanned from a printed page, opens the right page
- [ ] A leaving sale shows its date and all its items on one page

### Slice 5 — Admin and reports
Features: ACC-03, ACC-04, ADM-01, ADM-02

Screens
- **Report:** a reason (scam, wrong category, banned item, already sold, other) and a note.
- **Safety page:** how to deal safely, safe meeting points on campus, and "this week's scam".
- **Admin — reports:** the open reports, newest first, with the listing beside each; buttons: remove listing, ban user, dismiss.
- **Admin — numbers:** live listings, new listings this week, and **the one number**.

**The one number:** of the listings posted 7 to 14 days ago, the share that got at least one WhatsApp
or Call tap in their first 7 days. L1's gate is 30%.

Done when
- [ ] Only people marked `is_admin` can open the admin pages — tested by trying as a normal user
- [ ] A removed listing disappears from every list and its page says it was removed
- [ ] A banned person cannot post, and their live listings are hidden
- [ ] The one number on the admin page matches a count done by hand in the database
- [ ] The list of banned items is shown on the new-listing form

**Banned from day one:** weapons · drugs and prescription medicine · alcohol and tobacco · counterfeit
goods · live animals (until there are rules for them) · doing a student's graded work · adult services ·
"permits", "sponsorship" or documents for sale · property for sale (rentals only — legal advice pending).

### Slice 6 — Languages
Features: LANG-01, LANG-02, TALK-09, ENH-05, ENH-06

Screens
- **Language switch** in the header: Türkçe · English · العربية.
- **Arrival guide:** a checklist page — admission → airport pickup → first bed → SIM → permit → flat.
- **Address helper:** how to write a North Cyprus address for online orders (the "Mersin 10" problem).

Done when
- [ ] Every button, label and message exists in Turkish and English; no English shows through in Turkish
- [ ] In Arabic the whole layout runs right to left, and prices and phone numbers still read left to right
- [ ] The chosen language is remembered and is part of the address, so a shared link opens in the same language
- [ ] A listing written in Arabic displays correctly inside the Turkish and English interfaces
- [ ] The two guide pages exist in all three languages
- [ ] On an Android phone and an iPhone, "Add to home screen" gives an icon that opens the site without browser bars

Arabic may ship a few days after launch if the date is close. Turkish and English may not.

---

## L1 is finished when

- [ ] All six slices pass their lists above
- [ ] **The closed test is done:** thirty people from the campus teams each posted three real items
- [ ] The site is on its real domain
- [ ] One person has the admin job each day and knows it

## If the date is close

The launch date is fixed; the scope is not. Cut in this order, last thing first:

1. Arabic at launch (ship it the week after)
2. The leaving-sale group page (people can still post the items one by one)
3. Call button and "wanted" filter
4. Favourites

Never cut: posting, search, the WhatsApp button with its tap counter, mark as sold, the shop link,
reports and the admin page.

## Questions the build session must have answered first

- The name and the domain
- The category list, from the census
- Who the admins are
- The written agreement between the partners
