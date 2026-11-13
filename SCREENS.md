# Screens — every view the app needs

**13 November 2026.** One answer to "how many screens should there be?":

- **9 kinds of screen are built today**, including one screen per service (16 service screens).
- **20 kinds of screen finish Level 1** (the other 11 need sign-in and the database).
- **About 43 kinds of screen for the whole plan**, Levels 1 to 5.

A "kind of screen" is one design. "Service" is one kind of screen, shown 16 times, once per service.

---

## Built (runs today on sample ads)

| # | Screen | Address | What is on it |
|---|---|---|---|
| 1 | **Home hub** | `/tr` `/en` `/ar` | Search with city · 12 service tiles with counts · a row of the newest ads for each part of life (housing, buy and sell, vehicles, students, home services, work) · "wanted right now" · post band · safety band |
| 2 | **All services** | `/services` | All 16 services in 6 groups, each with what it covers and how many ads it has |
| 3 | **Service** (×16) | `/c/<service>` | The service's colour and mark · city filter · its ads · "post here" · when empty: "we are completing this list by hand, ask us on WhatsApp" · "do you offer this? list free" · related services |
| 4 | **Search** | `/search` | Words, category, city, selling or wanted, currency, price range, sort |
| 5 | **Ad** | `/l/<id>` | Photos (or the service's picture), price, WhatsApp, share, copy for groups, report, seller |
| 6 | **Shop** | `/s/<name>` | All of one seller's ads, QR code, share, copy for groups |
| 7 | **Post** | `/post` | Paste a group post to fill the form · selling or wanted · opens on the right category from a service screen · sends to the team's WhatsApp until the database exists |
| 8 | **Safety** | `/safety` | Rules, safe meeting places, this week's scam |
| 9 | **Not found** | any wrong address | In each language |

Every screen has the same frame: header (search, services, safety, language, post), a bottom bar on phones
(home, services, post, search, safety), and a footer listing all 16 services.

**The 16 services, in 6 groups**

| Group | Services |
|---|---|
| Housing | Flats and rooms · Dorms · Real estate agencies (rentals only) |
| Buy and sell | Second-hand |
| Vehicles | Cars · Car rental · Towing · Car service and tyres |
| Home and business | Cleaning and home help · Building and repairs · Professionals |
| Students | Education agents · Arrival help |
| Work and travel | Jobs · Freelance · Rides and travel |

Food delivery and taxis stay out, as the plan decided.

## Still to build for Level 1 (needs sign-in and the database)

| # | Screen | Why it matters |
|---|---|---|
| 10 | Sign in | Email link or Google |
| 11 | First-time profile | Name, WhatsApp number, city, shop name |
| 12 | **My ads** | Each ad with its views and WhatsApp taps; edit, mark sold, delete |
| 13 | Edit ad | The post form, filled in |
| 14 | Favourites | Saved ads |
| 15 | Leaving sale | Several ads under one title and leaving date, one link |
| 16 | Report | Reason and note (until then: WhatsApp to the team, built) |
| 17 | Admin: reports | Open reports beside each ad; remove, ban, dismiss |
| 18 | Admin: numbers | Live ads, new this week, and the one number |
| 19 | Arrival guide | Admission → airport → first bed → SIM → permit → flat |
| 20 | Address helper | How to write a North Cyprus address for online orders |

## Level 2 — every service done properly (about 9 more)

21 Company page (logo, hours, all ads, map pin) · 22 Business dashboard (views, taps, featured spot) ·
23 Dorm page (rooms, prices per term, free beds) · 24 Car page with car fields and filters ·
25 Map view for flats, dorms and services · 26 Ad shown translated into the reader's language ·
27 Saved searches and alerts · 28 "Verified" request and badge · 29 Admin: business checks

## Level 3 — live and smart (about 6)

30 Chat inbox · 31 Chat thread with translation · 32 Ask several providers for a quote ·
33 Compare quotes · 34 Notifications · 35 AI helper

## Level 4 — time and money (about 5)

36 Pick a date and book · 37 Pay · 38 My bookings · 39 Provider calendar · 40 Provider payouts

## Level 5 — live money and movement (about 3)

41 Live tow truck on a map · 42 Job with payment held until done · 43 Live auction

---

The order does not change: each level is a working product by itself, and a later screen is built only
when the gate before it is passed (`EVERYTHING-SO-FAR.md`, section 8).
