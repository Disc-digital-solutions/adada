# Screens — every view the app needs

**13 November 2026.** One answer to "how many screens should there be?":

- **20 kinds of screen are built today**, including one screen per service (43 service screens) and 7 guides.
- **29 kinds of screen finish Level 1 and the new features** (the other 9 need sign-in and the database).
- **About 50 kinds of screen for the whole plan**, Levels 1 to 5, after the 67 features added on 14 November.

What each of the 67 new features needs is in `NEW-FEATURES-STATUS.md`.

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
| 10 | **Request service** (×8) | `/c/viewing`, `/c/moving`… | "How it works" and "Request on WhatsApp": a person arranges it |
| 11 | **Tools and guides** | `/tools` | Every tool and guide |
| 12 | **Guides** and **guide** (×7) | `/guides`, `/guides/<name>` | Arrival, address (Mersin 10), utilities, SIM, residence permit, work permit, cars |
| 13 | **Emergency** | `/emergency` | Numbers to tap, duty pharmacy, embassy |
| 14 | **Typical prices** | `/prices` | Rents, dorms and cars by city, from the live ads |
| 15 | **Books by course code** | `/books` | Search MATH101 in any spelling |
| 16 | **My arrival plan** | `/plan` | Rooms in budget, arrival help, checklist, days to go |
| 17 | **Split the bills** | `/tools/split` | Who pays whom in a shared flat |
| 18 | **Get your deposit back** | `/tools/deposit` | Checklists and a Turkish/English letter |
| 19 | **Rent receipt** | `/tools/receipt` | Printable, Turkish and English |
| 20 | **Embed widget** | `/<lang>/embed/<shop>` | A shop's ads on the business's own website |

Every screen has the same frame: header (search, services, safety, language, post), a bottom bar on phones
(home, services, post, search, safety), and a footer with every tool, every service and the display settings
(larger text, save data).

**The 43 services, in 8 groups** (the first 16 are below; the 27 added on 14 November are in `NEW-FEATURES-STATUS.md`)

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
| 21 | Sign in | Email link or Google |
| 22 | First-time profile | Name, WhatsApp number, city, shop name |
| 23 | **My ads** | Each ad with its views and WhatsApp taps; edit, mark sold, delete |
| 24 | Edit ad | The post form, filled in |
| 25 | Favourites | Saved ads |
| 26 | Leaving sale | Several ads under one title and leaving date, one link |
| 27 | Report | Reason and note (until then: WhatsApp to the team, built) |
| 28 | Admin: reports | Open reports beside each ad; remove, ban, dismiss |
| 29 | Admin: numbers | Live ads, new this week, and the one number |


## Level 2 — every service done properly (about 9 more)

30 Company page (logo, hours, all ads, map pin) · 31 Business dashboard (views, taps, featured spot) ·
32 Dorm page (rooms, prices per term, free beds) · 33 Car page with car fields and filters ·
34 Map view for flats, dorms and services · 35 Ad shown translated into the reader's language ·
36 Saved searches and alerts · 37 "Verified" request and badge · 38 Admin: business checks

## Level 3 — live and smart (about 6)

39 Chat inbox · 40 Chat thread with translation · 41 Ask several providers for a quote ·
42 Compare quotes · 43 Notifications · 44 AI helper

## Level 4 — time and money (about 5)

45 Pick a date and book · 46 Pay · 47 My bookings · 48 Provider calendar · 49 Provider payouts

## Level 5 — live money and movement (about 3)

50 Live tow truck on a map · 51 Job with payment held until done · 52 Live auction

---

The order does not change: each level is a working product by itself, and a later screen is built only
when the gate before it is passed (`EVERYTHING-SO-FAR.md`, section 8).
