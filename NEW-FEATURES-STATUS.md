# The 67 new features — what is built

**14 November 2026.** The two feature lists, plus "paste a group post", were added to the plan (`build.py`,
now 278 features). This file says, for each one, whether it works in the website today.

In short:

| | Count | What it means |
|---|---|---|
| **Built** | 36 | Works today on the sample ads. Try it in the site. |
| **Built, a person does the work** | 8 | The screen and the WhatsApp request are built; a team member arranges the service. |
| **Screen built, waiting for a check** | 1 | Clinics: the screen exists but stays empty until the rules on health advertising are checked. |
| **Not built yet** | 22 | Each needs something code alone cannot give: the database, the WhatsApp Business API, payments, live data, or a partner. |

Everything built follows the plan's rules: no money moves through the app, no property for sale, no food
delivery or taxis.

---

## Built — works today

| ID | Feature | Where |
|---|---|---|
| LST-21 | Paste a group post, the form fills itself in | Post an ad |
| LST-20 | Voice posting: say the ad; it is written and put in a category | Post an ad → "Speak your ad" (uses the browser's own speech-to-text; works in Chrome, Edge, Safari, Android) |
| ACC-20 | "Price looks wrong" warning on a too-cheap rent | Any ad; see the sample at `/l/d63` |
| ROOM-07 | Women-only filter and badge | Flats, Dorms, Search; the post form has the box |
| BUY-06 | Books and notes by course code | `/books` — "MATH 101", "math101" and "MATH-101" all match |
| ROOM-08 | Flat bill splitter | `/tools/split` |
| ROOM-09 | Deposit-back helper: checklists and a Turkish/English letter | `/tools/deposit` (the mediator is still by hand) |
| ROOM-10 | Rent receipt in two languages, printable | `/tools/receipt` (a receipt only; no money moves) |
| ARR-06 | My arrival plan from real ads | `/plan` |
| ARR-07 | Utilities guide | `/guides/utilities` |
| ARR-08 | SIM and mobile data guide | `/guides/sim` |
| ENH-28 | Official steps: residence permit, work permit, buying a car | `/guides/residence`, `/guides/work-permit`, `/guides/car` |
| ENH-27 | Emergency page | `/emergency`, linked from Safety and the footer |
| ENH-29 | Save-data mode | Footer → Display → Save data |
| ENH-30 | Accessibility: larger text, skip link | Footer → Display → Larger text; "Skip to content" for keyboards |
| ENH-31 | Open price data | `/prices` |
| BIZ-15 | Embed widget for a business's own website | Code box at the bottom of every shop; the widget is at `/<lang>/embed/<shop>` |
| BIZ-19 | Verified business badge | Shop and ad pages (the check itself is done by a person) |
| BUY-08 | Furniture rental | Service screen |
| BUY-10 | Borrow and lend | Service screen |
| CAR-10 | Parking to rent | Service screen |
| CAR-11 | Driving schools | Service screen |
| HOME-09 | Phone and laptop repair | Service screen |
| PRO-05 | Childcare and tutors | Service screen |
| MORE-03 | Pet services | Service screen |
| MORE-04 | Deals of the week | Service screen |
| MORE-05 | Restaurants and cafés (no delivery) | Service screen |
| CON-07 | Business supplies | Service screen |
| JOB-06 | Shift and seasonal work | Service screen |
| JOB-07 | Internships | Service screen |
| RIDE-06 | Airport day board | Service screen |
| RE-13 | Coworking and offices | Service screen |
| TOUR-01 | Tours and experiences | Service screen |
| COM-01 | Neighbourhood notices | Service screen, filtered by city (by neighbourhood needs the database) |
| COM-05 | Language exchange | Service screen |
| COM-08 | What's on this week | Service screen |
| — | 27 new services in all, in two new groups ("Going out and visitors", "Community") | `/services` now lists 43 |
| — | Tools and guides hub | `/tools`, `/guides`, and a row on the home page |
| — | Arrival checklist and address helper (ENH-05, ENH-06 from the original plan) | `/guides/arrival`, `/guides/address` |

## Added 14 Nov (later): student questions

| ID | Feature | Where |
|---|---|---|
| ARR-09 | Student questions: 17 answers on bank accounts, money from home, paying rent, deposits, visas, the residence permit, renewing it, working, crossing to the south and leaving; "ask us on WhatsApp" for anything else | `/help` |
| ARR-10 | Residence-permit reminder: days left, start-renewing date, reminders added to the phone's calendar, papers checklist | `/tools/permit` |
| ARR-11 | Leaving-the-island checklist | `/guides/leaving` |
| ARR-03 | Bank account guide (already in the plan; now built) | `/guides/bank` |

The answers are general and checked with no bank or office yet. They avoid fees, bank names and
nationality rules on purpose and always say who gives the final answer (the university's international
office, or the bank). Check them with an international office before launch.

## Built — a person does the work behind a WhatsApp button

Each has its own screen with "How it works" and "Request on WhatsApp" (it needs `NEXT_PUBLIC_TEAM_WHATSAPP`).

| ID | Feature | Screen |
|---|---|---|
| ROOM-11 | "Seen by us" video viewing | `/c/viewing` |
| RE-12 | Lawyer-checked contract | `/c/contract-check` |
| RE-14 | Staff housing for employers | `/c/staff-housing` |
| HOME-08 | Moving day: van, helpers, cleaner | `/c/moving` |
| ENH-25 | Summer storage | `/c/storage` |
| ENH-26 | Buy from Turkey for me | `/c/shop-turkey` |
| COM-03 | Newcomer buddy | `/c/buddy` |
| BUY-09 | Group buying | `/c/group-buy` |

## Screen built, waiting for a check

| ID | Feature | Waiting for |
|---|---|---|
| MED-01 | Clinics and dentists for visitors | The rules on advertising health services. The screen exists with no clinic ads. |

## Not built yet — and what each one needs

| ID | Feature | Needs |
|---|---|---|
| LST-22 | Holiday mode | Sign-in and the database |
| ACC-21 | Team accounts | Sign-in and the database |
| ADM-09 | Ambassador dashboard | The database (who brought which ad, and its taps) |
| BIZ-18 | Monthly business report | The database (real views and taps) |
| COM-02 | Ask the island (questions and answers) | The database, to store answers |
| COM-06 | Helper badges | The database (reply times, answers) |
| ACC-22 | Scam map | The database (reports) |
| ACC-23 | Trust score | The database (checked IDs, reviews, reply rate) |
| ACC-24 | Scam-ring detection | The database, and enough real ads to compare |
| TALK-10 | The app inside WhatsApp | The WhatsApp Business API (a Meta business account, per-message cost) |
| ENH-23 | Group-admin bot | The WhatsApp Business API, and group admins who agree |
| BIZ-16 | WhatsApp catalogue sync | Meta's catalogue API |
| SRCH-12 | Smart alerts in plain words on WhatsApp | The WhatsApp Business API and an AI service |
| COM-07 | Weekly digest channel | No code: a person can open a WhatsApp or Telegram channel today and post the week's best ads |
| LANG-05 | Best exchange rate nearby | Daily rates from exchange offices (a person, or a data source) |
| BIZ-17 | Lead credits | Payments (Level 4) |
| TOUR-02 | Experience booking | Payments and calendars (Level 4) |
| ENH-24 | University housing pages | An agreement with each university |
| BUY-07 | Safe handover points | Partner shops |
| COM-04 | Community hubs | Real group links, shops and events from each community, with their agreement |
| ADM-10 | Partner data access | Contracts, and enough real data to be worth selling |
| ADM-11 | White-label engine | A decision to go to a second market (ending C) |

## To check before launch

- **Emergency numbers** (155 police, 112 ambulance, 199 fire, 177 forest fire, 158 coast guard) were taken from
  public sources. A person on the island must confirm each one before launch.
- **The guides** (`web/src/lib/guides.ts`) are general help, not checked with any office. Each page says so.
  Check each step and set `GUIDES_CHECKED` to the date.
- **All new Turkish and Arabic wording** needs the same native read as the rest of the site.
- **The sample businesses** (Mavi Tekne Turları, Liman Kafe, FixIt Phone Repair and others) are made up;
  rename any that turn out to be real.
