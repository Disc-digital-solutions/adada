# One app for everything in North Cyprus — everything so far

**As of 13 November 2026.** This one file holds what is done, what comes next, the roadmap, and where
this can end. Other files named here are in the same pack.

In one line: the market was researched, a full plan was written, and the first part of the website was
built and runs on sample ads. Nothing is online yet.

**Contents**

- Part A — What is done
  1. The idea, and the six ideas the plan rests on
  2. The research
  3. The decisions taken
  4. The plan that was written
  5. The website that was built
  6. What is not done, and what is not sure
- Part B — What comes next
  7. The steps, and who does each
  8. Roadmap and gates
  9. Where this can end
  10. Points to agree in writing

---

# Part A — What is done

## 1. The idea, and the six ideas the plan rests on

One app where anyone in North Cyprus can find, book, buy, rent or hire anything: dorms, an education
agency, cars, car rental and services, towing, tyres, real estate agencies, construction companies,
cleaning, any local service, and freelancing. It is modelled on Yad2 (Israel), Haraj (Saudi Arabia)
and Mzad Qatar.

1. **Easy first.** Five levels, from a simple marketplace to bookings, payments and live dispatch.
   Each level is a working product by itself.
2. **Be the bridge between the language islands.** Sellers post in Turkish groups; foreign students and
   expats search in Arabic, English or Russian groups. One ad shown in every language reaches every
   community. This is our answer to "why post here?".
3. **Every seller gets a free shop link.** One page with all their items, a QR code and WhatsApp
   buttons. Useful to a seller even when the site has no buyers yet.
4. **Finish what can be finished.** All dorms, car rentals, tow trucks and tyre shops can be listed
   completely by hand. A complete list is useful on day one.
5. **Launch on the student calendar.** At the end of the spring term, students leaving the island sell
   everything. In September, new students need everything.
6. **By hand before by code.** Every hard feature starts as a person on WhatsApp behind a button.

## 2. The research

**Who is already in North Cyprus.** Each site was opened and read. Details and links are in `COMPETITORS.md`.

| Area | Who is there | What we learned |
|---|---|---|
| General classifieds | adaPano, Bulkibris, ilanKKTC, KKTCilan, eKibris, gelgezgor, KKTC Bit Pazarı | Seven sites. All are thin. One showed 152 listings in total. Nobody has won. |
| Cars | GalerimPlus (3,500+ listings, 120+ dealers), KKTCar (529 cars), KPazar | The most advanced area. GalerimPlus already has an AI assistant, valuations and live auctions. |
| Property | 101evler, HangiEv | 101evler leads on the web. Its iPhone app has not been updated since 2021. |
| Dorms | Yurthub (16 universities) | It exists, but its booking flow looks thin. |
| Tradesmen | Ada Usta, KKTC USTAM | Directories only. |
| Food delivery, taxis | Feed Me Cyprus, Yemekcim; Kibride, RideCY | Already taken, or tiny. We do not build these. |

**What the big apps actually do**

| App | How it earns | Lesson |
|---|---|---|
| Yad2 (Israel) | About 56% real estate, 27% cars, 15% jobs. Sold for about $950M in December 2025. | Professionals pay. Private users are free and bring the traffic. |
| Haraj (Saudi Arabia) | No payment inside the app for years. Dealer memberships and paid boosts. | Start simple. Add trust and payments later. |
| Mzad Qatar | Free, no commission. Paid featured ads. Timed auctions. | Money comes from visibility, not from the deal. |
| Bazaraki (south Cyprus) | One general site reaching most of a small island. | A small island can be won by one general player. |

**Facts about this market**

| Fact | Source |
|---|---|
| Residents aged 15 and over: 374,275 (official survey, 2025) | TRNC Statistical Institute |
| Students: about 100,000 on paper (108,185 in 2023; 102,455 estimated for 2024). Officials say about 45,000 are from third countries. | [Yeni Düzen](https://www.yeniduzen.com/buyuduk-peki-guclendik-mi-25897yy.htm) |
| New students from Turkey fell from 13,728 (2023) to 11,555 (2026) | [Kıbrıs Gerçek](https://www.kibrisgercek.com/kktc-universitelerinde-doluluk-geriledi-18-bin-kontenjana-11-bin-555-ogrenci) |
| Stripe and PayPal do not serve TRNC companies. Local routes exist: bank virtual POS through Card Plus, MayPay, Creditwest pay-by-link | [Card Plus](https://card-plus.net/en/services/e-commerce/) · [MayPay](https://maypay.net/) |
| Google Play's list of developer countries has no Northern Cyprus. Apple is unclear. | [Google Play Help](https://support.google.com/googleplay/android-developer/answer/9306917) |
| Courts in the Republic of Cyprus jailed people in 2025 for selling Greek-Cypriot-owned property in the north | [Cyprus Mail](https://cyprus-mail.com/2025/05/12/cyprus-real-estate-agents-welcome-jail-terms-over-property-usurpation) |
| Rental scams against students rise before each academic year | [cyprus-faq](https://cyprus-faq.com/en/north/news/v-trsk-uchastilis-sluchai-moshennichestva-s-arendoi-nedvizhimosti-dlya-studentov) |

**The honest read**

- The idea already exists seven times here, and nobody has won. Those sites are not small for lack of
  features. They are small because people buy and sell in Facebook, Instagram and WhatsApp groups.
  **Writing the code is the easy part. Filling the site with ads is the hard part.**
- The market is small. KKTCar charges TRY 249 per 60-day listing and has 529 cars. Even if every one
  paid, that is about TRY 66,000 a month. Fees from private sellers will not carry this. Professionals
  and referrals have to.

## 3. The decisions taken

| Decision | Why |
|---|---|
| **Easy first.** Start as a marketplace like Facebook Marketplace, then grow from easy to hard. | Every big app started this way and added the hard parts years later. |
| **A website first, not a store app.** It installs to a phone's home screen like an app. | Nothing to install, Google can find every ad, and it does not depend on Apple or Google accepting a TRNC company. |
| **Turkish, English and Arabic from the start.** | The existing sites are Turkish first. None of the ones we opened had Arabic. |
| **Private users post free. Professionals pay.** | This is how Yad2 and Haraj earn. |
| **No payment inside the app before Level 4.** | Payments here are not simple, and a mistake with money is costly. |
| **Rentals and dorms only. No property for sale until a lawyer advises.** | The court cases in the south. |
| **Its own brand and company,** separate from any business either of us already has. Ads are never ranked by who posted them. | So that agencies, dorms and dealers can trust it. |
| **No food delivery, no taxi app.** | Others already do them. |
| **The name is "Adada".** | Chosen. Check the .com domain and the Instagram and TikTok names are free. |

## 4. The plan that was written

**211 features, each placed on one of five levels.** The full lists are in `BUILD-LADDER.md` and
`FEATURES.md`. The one-page picture is `FEATURE-MAP.html`.

| Level | What it is | Features |
|---|---|---|
| No code | Things done by people: a WhatsApp helpline, group admins as partners, filming a flat for a student abroad | 5 |
| **1 — Easy** | The marketplace: post an ad with photos, browse, search, contact the seller on WhatsApp, shop link | 28 |
| **2 — Easy to medium** | Every category as a proper list with filters and company pages; ads translated automatically | 79 |
| **3 — Medium** | Chat inside the app with translation, quote requests, reminders, AI helpers | 43 |
| **4 — Hard** | Booking a room or a cleaner for a date, paying online | 41 |
| **5 — Very hard** | Live tow-truck dispatch, payments held until the job is done, live auctions | 15 |

**Seventeen categories are planned,** each with an easy, a medium and a hard version: buy and sell ·
student flats and roommates · dorms · education agency · arrival services · car rental · towing ·
car services and tyres · cleaning and home services · real estate agencies · construction ·
professionals · cars · freelancing · jobs · rides and travel · other local categories.

**Every hard feature has an easy first version.** Booking starts as a "Request" button that opens
WhatsApp. Towing starts as a call list by district. Verified sellers start with a person checking an
ID by hand. So everything can exist in simple form from Level 2.

## 5. The website that was built

The code is in `web/`. Pictures of it are in `screens/`. It runs on **sample ads**; none are real.

| Part | State |
|---|---|
| Three languages, with Arabic running right to left | Works |
| Home page: newest ads, and only the categories that have ads | Works |
| Search: words, category, city, selling or wanted, currency, price range, sort | Works |
| Ad page: photos to swipe, price tag, share, "sold" and "removed" states | Works |
| Shop page: all of one seller's ads on one link, with a QR code | Works |
| Safety page: how to deal safely, and the scam of the week | Works |
| "Page does not exist", in each language | Works |
| WhatsApp button | The link is built and tested. Sample ads have no seller, so for now it shows a note. |
| Add to a phone's home screen | The files are in place. Not yet tried on a real phone. |
| Post an ad | The form is there. **It cannot publish yet.** |
| Sign in, my ads, favourites, reports, admin page, counting WhatsApp taps | **Not built yet.** They need the database. |

**How it was checked**

- 80 automatic tests of the logic pass: prices, dates, search, WhatsApp links, plurals, languages.
- The code checks (lint and types) and the production build pass.
- Every page was opened in a browser at phone width and desktop width, in all three languages.

Small things that are already right:

- A search for "ISITICI" finds "ısıtıcı". Turkish dotted and dotless letters are treated as the same.
- An ad written in Arabic displays correctly inside the Turkish and English pages.
- Prices show as ₺1.500 in Turkish and ₺1,500 in English.
- A shop link has no language in it, so each visitor gets the shop in their own language.

## 6. What is not done, and what is not sure

- **Nothing is online.** The site runs on one computer.
- **No real ads and no real users yet.**
- **Posting does not work yet.** It needs the database, which is the next step.
- **The Turkish and Arabic wording was not read by a native speaker.**
- **Not verified:** whether Apple and Google accept a TRNC company · 101evler's real listing count ·
  the true number of third-country students · how common large upfront rent is for student flats in Famagusta.
- **The numbers in the roadmap are first guesses,** for the two of us to set.

---

# Part B — What comes next

Numbers marked *proposed* are a first guess, for the two of us to set together.

## 7. The steps, and who does each

### Step 1 — Groundwork (no code)

| # | Who | What | Done when |
|---|---|---|---|
| 1 | Both | **One page, written and signed:** who does what, the split, what happens if one of us stops. The points to cover are in section 10. | Both have signed |
| 2 | Both | **The name.** It must work in Turkish, English and Arabic, with a free .com and free Instagram and TikTok names. The name "Adada" is chosen. | Domain bought |
| 3 | Partner and campus team | **The Facebook count.** For seven days, in the ten biggest buy-sell and housing groups, count what is posted, in which language, in which city, and how fast it sells. Note the twenty most active sellers. The sheet is in `VALIDATION-KIT.md`. | The sheet is filled for 7 days |
| 4 | Partner | **Ask for supply.** Ask those twenty sellers: "may we put your items on our site for free?" Ask 10 dorm operators and 20 landlords the same. | Answers written down, yes or no |
| 5 | Partner | **Read the Turkish.** Open the site in Turkish and mark every word that sounds wrong. | List sent to Mustafa |
| 6 | Both | **Use every competitor's app for real:** post something, search, contact a seller. The sheet is in `COMPETITORS.md`. | Sheet filled |
| 7 | Mustafa | **One conversation with a lawyer or accountant** about the company, and about what the site is answerable for. | Notes written |

The Facebook count matters most. It replaces guesses about this market with real numbers. It decides
the category list for Level 1 and which lists we open first in Level 2.

### Step 2 — Build Level 1

Started on 13 November 2026. Mustafa connects the database next, then builds sign-in, posting with
photos, my ads, reports and the admin page. The state of each part is in `LEVEL-1-SPEC.md`.

1. Post a listing with photos
2. Browse and search
3. Listing page with the WhatsApp button and tap counter
4. My listings, mark as sold, shop link, QR
5. Admin and reports
6. Languages

### Step 3 — Closed test

Thirty people from our teams each post three real items. Ninety listings exist before any stranger
sees the site, and thirty people have found the rough edges.

### Step 4 — Launch for the leaving sale

One campus (Famagusta), on a fixed date in mid-May 2027. EMU's spring classes end on 21 May and finals
run from 24 May to 2 June 2027, so students sell their things in late May and June.

- QR stickers and posters on campus and around the dorms
- The admins of the nationality groups, as paid partners
- One habit to teach every seller: **"post it here, share the link in your groups"**
- A person on WhatsApp for anyone who gets stuck

### Step 5 — Complete the first lists by hand over the summer

Dorms, car rentals, tow trucks, tyre shops and arrival guides, each one finished for Famagusta, so
that September's new students land on something complete.

## 8. Roadmap and gates

| Step | What | When (*proposed*) | Move on when (*proposed*) |
|---|---|---|---|
| Groundwork | Step 1 above | now → January 2027 | Agreement signed; Facebook count done |
| Level 1 build | Steps 2–3 | started 13 Nov 2026 → April 2027 | 90 real listings from the closed test |
| Level 1 launch | Leaving sale, Famagusta | mid-May 2027 | 300 live listings · 30% of listings get a WhatsApp tap within 7 days |
| Level 2, complete lists | Dorms, arrival, car rental, towing, tyres; ads translated automatically | summer 2027, ready for September | Each list complete for Famagusta · 1,500 students used the site in September–October |
| Level 2, attracted listings | Agencies, dealers, services, freelancers, jobs; Nicosia and Kyrenia | autumn 2027 → early 2028 | 100 businesses with a page · the first ones paying for a featured spot |
| Level 3 | Chat, chat translation, quotes, reminders, apps | 2028 | Paying businesses cover running costs |
| Level 4 | Bookings and online payment, once a lawyer and a payment provider are in place | after the Level 3 gate | Set then |
| Level 5 | Dispatch, held payments, auctions, AI concierge — one at a time | after | — |

A smaller first launch at the February 2027 arrivals is possible if Level 1 is ready by then.

**The one number to watch:** the share of listings that get at least one WhatsApp tap within seven
days. If sellers get answers, they come back and tell others. If they do not, nothing else matters.

**The date is fixed, the scope is not.** Each level launches on its date with whatever is ready.

**If a gate is missed,** we stop or change direction before building the next level.

## 9. Where this can end

Four endings. All are acceptable. It is worth agreeing which one we are aiming for.

| | Ending | What it looks like |
|---|---|---|
| **A** | The island's default | The place the north goes for homes, cars and services. Professionals pay. A small team runs it. It can be kept, or sold to a classifieds group. |
| **B** | A profitable niche | It owns student landing: housing, arrival, second-hand. It stops there and runs with a few people. |
| **C** | The software, not the marketplace | The marketplace stays small, but the tools for businesses are sold, or the engine is reused in another market. |
| **D** | A clean stop | A gate is missed twice and we close it. What we keep: a launched product, the engine, and what we learned. |

## 10. Points to agree in writing

One page is enough to start. A lawyer can tidy it later.

1. The company owns the code, the brand and the domain — not either of us personally.
2. Who does what: operations and sales, product and code, the WhatsApp line, checking new ads each day.
3. The split, and whether shares are earned over time.
4. Who pays for what, and whether money put in is a loan or buys more shares.
5. Nothing is taken out before running costs are covered.
6. What happens if one of us stops working on it.
7. Whether a third partner or an investor needs both of us to agree.
8. Which missed gate ends it, and who keeps what when it ends.
