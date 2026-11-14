"""Builds BUILD-LADDER.md, FEATURES.md and FEATURE-MAP.html from the lists in this file.

Run:  py build.py

Everything about a feature lives in FEATURES below. To add, move or reword a feature,
edit that list and run this script again. Never edit the three generated files by hand.
The script also runs the checks: unique IDs, valid levels, coverage of the twelve things
named in the original brief, and that LEVEL-1-SPEC.md mentions nothing above L1.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

HERE = Path(__file__).parent

# --------------------------------------------------------------------------- levels
LEVELS = {
    0: ("No code", "Done by people, not software."),
    1: ("Easy", "Forms, lists and photos. Nothing live, no money, little that can go badly wrong."),
    2: ("Easy-to-medium", "The same building blocks as L1, many more of them, plus small outside services."),
    3: ("Medium", "Live messaging and outside AI services: more moving parts, a cost per use, harder to test."),
    4: ("Hard", "A mistake double-books a room or loses real money. Needs a payment provider, refunds, records."),
    5: ("Very hard", "Live location, money held for other people, many providers online at once, legal duties."),
}

LADDER = {
    1: ("Marketplace core", "Post anything with photos and a price, get a shop link, browse, search, and contact the seller on WhatsApp.", "A domain name; free hosting tiers to start"),
    2: ("Categories, directories, translation", "Find dorms, car rentals, tow trucks, cleaners, construction firms, freelancers, cars and flats, each with proper filters and a company page, in their own language.", "Small: a little per SMS and per translated listing"),
    3: ("Live and smart", "Chat inside the app in their own language, ask several providers for quotes, get reminders and AI help.", "Per use: chat translation, AI; app-store fees"),
    4: ("Time and money", "Reserve a dorm room or a cleaner for a date and pay online.", "Payment commissions; an accountant"),
    5: ("Live money and movement", "Call the nearest tow truck and watch it come; pay a freelancer safely; bid in a live auction.", "Staff"),
}

# Why a feature sits at its level.
WHY = {
    "hand": "Done by a person, no code",
    "form": "A form and a list",
    "page": "A page of text",
    "more": "Same blocks as L1, more of them",
    "svc": "Needs a small outside service",
    "flow": "Several steps and states to keep right",
    "live": "Live, real-time",
    "ai": "Uses an outside AI service",
    "data": "Needs a lot of your own data first",
    "cal": "Calendar logic: no double bookings",
    "money": "Real money: a mistake costs someone",
    "sens": "Sensitive documents",
    "frag": "Depends on an outside party that can change or refuse",
    "prod": "A small product of its own",
    "geo": "Map calculations",
    "media": "Heavy media and special viewers",
    "tel": "Needs a phone-network service",
    "law": "Waits for legal advice, not for code",
    "loc": "Live location, many providers online",
    "held": "Money held or moved for other people",
    "bid": "Live bidding",
    "all": "Works across every category at once",
}

# The job a feature does for the marketplace.
JOB = {
    "supply": "Brings listings",
    "demand": "Brings users",
    "trust": "Builds trust",
    "back": "Brings people back",
    "earn": "Earns",
    "ops": "Runs the site",
}

# --------------------------------------------------------------------------- areas
# kind: platform | vertical.  fill (verticals): complete = a list you can finish by hand,
# attract = listings you must attract.  named = the words of the original brief it covers.
AREAS = [
    dict(key="ACC", name="Accounts and trust", kind="platform"),
    dict(key="LST", name="Listings", kind="platform"),
    dict(key="SRCH", name="Search and discovery", kind="platform"),
    dict(key="TALK", name="Talking to each other", kind="platform"),
    dict(key="LANG", name="Language and prices", kind="platform"),
    dict(key="ENG", name="Engines", kind="platform"),
    dict(key="ADM", name="Admin and operations", kind="platform"),
    dict(key="BIZ", name="Tools for businesses", kind="platform"),
    dict(key="ENH", name="Enhancements", kind="platform"),
    dict(key="COM", name="Community", kind="platform"),
    dict(key="BUY", name="Buy and sell", kind="vertical", fill="attract", modes="Contact → Transact", named=[],
         earns="L1–L2: nothing. It is the traffic. L5: a fee on protected payments."),
    dict(key="ROOM", name="Student flats, rooms, roommates", kind="vertical", fill="attract", modes="Contact", named=[],
         earns="L2: referral fees from landlords agreed offline; filmed viewings. L5: a fee on held deposits."),
    dict(key="DORM", name="Dorms", kind="vertical", fill="complete", modes="Contact → Book", named=["dorm registration"],
         earns="L2: a referral fee per placed student, agreed offline. L4: booking commission; dorm tools sold as software."),
    dict(key="EDU", name="Education agency", kind="vertical", fill="complete", modes="Quote", named=["education agency"],
         earns="Agency commission from universities on students placed (the existing business)."),
    dict(key="ARR", name="Arrival services", kind="vertical", fill="complete", modes="Quote → Book", named=[],
         earns="L2: the arrival bundle and filmed viewings, sold by hand. L4: sold in the app."),
    dict(key="RENT", name="Car rental", kind="vertical", fill="complete", modes="Contact → Book", named=["car renting"],
         earns="L2: featured spots. L4: booking commission."),
    dict(key="TOW", name="Towing and roadside", kind="vertical", fill="complete", modes="Contact → Dispatch", named=["towing services"],
         earns="L2: a featured spot per district. L5: a dispatch fee."),
    dict(key="CSRV", name="Car services and tyres", kind="vertical", fill="complete", modes="Contact → Quote → Book", named=["car services", "tyre services"],
         earns="L2: featured spots. L3: a fee per lead. L4: booking commission."),
    dict(key="HOME", name="Cleaning and home services", kind="vertical", fill="complete", modes="Contact → Quote → Book", named=["cleaning services", "any kind of services"],
         earns="L2: featured spots. L3: a fee per lead. L4: booking commission."),
    dict(key="RE", name="Real estate agencies", kind="vertical", fill="complete", modes="Contact → Book", named=["real estate agencies"],
         earns="L2: agency pages and featured listings. L4: subscriptions; management referrals."),
    dict(key="CON", name="Construction and B2B", kind="vertical", fill="complete", modes="Contact → Quote", named=["construction companies"],
         earns="L2: company pages and featured spots. L3: a fee per quote request."),
    dict(key="PRO", name="Professionals", kind="vertical", fill="complete", modes="Contact → Book", named=[],
         earns="L2: featured spots. L4: a booking fee."),
    dict(key="CAR", name="Cars and vehicles", kind="vertical", fill="attract", modes="Contact → Transact", named=["cars"],
         earns="L2: dealer pages and featured cars. L4: dealer subscriptions; loan and insurance referrals. L5: auction commission."),
    dict(key="FREE", name="Freelancing", kind="vertical", fill="attract", modes="Contact → Transact", named=["freelancing like Fiverr"],
         earns="L2: featured gigs. L5: commission on held payments."),
    dict(key="JOB", name="Jobs", kind="vertical", fill="attract", modes="Contact", named=[],
         earns="L2: featured job posts paid by employers."),
    dict(key="RIDE", name="Rides and travel", kind="vertical", fill="attract", modes="Contact → Book", named=[],
         earns="L4: booking commission."),
    dict(key="MORE", name="More local categories", kind="vertical", fill="attract", modes="Contact", named=[],
         earns="L2: featured spots."),
    dict(key="TOUR", name="Tourism and experiences", kind="vertical", fill="attract", modes="Contact → Book", named=[],
         earns="L2: a referral fee per booking from tour and boat operators, agreed offline. L4: booking commission."),
    dict(key="MED", name="Medical and dental visitors", kind="vertical", fill="complete", modes="Contact", named=[],
         earns="L2: a fee per enquiry from clinics, once the rules on health advertising are checked."),
]

# --------------------------------------------------------------------------- features
# (id, level, name, why, job, easy first version)
F = [
    # ---- Accounts and trust
    ("ACC-01", 1, "Sign up and log in with email or Google", "form", "demand", ""),
    ("ACC-02", 1, "WhatsApp number on the profile", "form", "supply", ""),
    ("ACC-03", 1, "Report a listing", "form", "trust", ""),
    ("ACC-04", 1, "Safety tips, safe meeting points and a \"this week's scam\" notice", "page", "trust", ""),
    ("ACC-05", 2, "Sign-up by phone code", "svc", "trust", ""),
    ("ACC-06", 2, "Profile types: person, business, agency, dorm, freelancer", "more", "supply", ""),
    ("ACC-07", 2, "Reviews and ratings", "more", "trust", ""),
    ("ACC-08", 2, "\"Vouched by\": a known member or group admin stands behind a seller", "more", "trust", ""),
    ("ACC-09", 2, "\"Checked\" badge given by an admin after seeing an ID", "hand", "trust", ""),
    ("ACC-10", 2, "Public \"check this number\" list of banned numbers", "more", "trust", ""),
    ("ACC-11", 3, "Block a user", "live", "trust", ""),
    ("ACC-12", 3, "Reply rate and reply time shown on profiles", "live", "trust", ""),
    ("ACC-13", 3, "Warning in chat when someone asks for a deposit before a viewing", "live", "trust", "ACC-04: the safety page"),
    ("ACC-14", 3, "Duplicate-listing detection", "flow", "trust", "Reports plus a human checker"),
    ("ACC-15", 4, "Verification from uploaded documents", "sens", "trust", "ACC-09: an admin checks the ID by hand"),
    ("ACC-16", 4, "Copied-photo and too-cheap-price detection", "data", "trust", "Reports plus a human checker"),
    ("ACC-17", 4, "Dispute handling for bookings and payments", "money", "trust", "A person on WhatsApp"),
    ("ACC-18", 5, "Protected deposits held by the platform", "held", "earn", "A warning never to pay before a viewing"),
    ("ACC-19", 5, "Hidden phone numbers", "tel", "trust", ""),
    # ---- Listings
    ("LST-01", 1, "Post a listing: photos, title, price, category, city, description", "form", "supply", ""),
    ("LST-02", 1, "My listings: edit, delete, mark as sold", "form", "supply", ""),
    ("LST-03", 1, "\"Seen by 240 people\" counter on each listing", "form", "back", ""),
    ("LST-04", 1, "Shop link: one page with all of a person's listings", "form", "supply", ""),
    ("LST-05", 1, "Share link and QR code per listing and per shop", "form", "demand", ""),
    ("LST-06", 1, "\"Wanted\" posts: the buyer posts the need", "form", "demand", ""),
    ("LST-07", 1, "\"Leaving the island\" sale: several items on one page", "form", "supply", ""),
    ("LST-08", 1, "Categories appear only once they have listings", "form", "trust", ""),
    ("LST-09", 2, "Own fields and filters per category", "more", "demand", ""),
    ("LST-10", 2, "Categories and their fields editable from the admin panel", "more", "ops", ""),
    ("LST-11", 2, "Listings translated automatically when saved (Turkish, English, Arabic)", "svc", "demand", ""),
    ("LST-12", 2, "Listings expire; the owner confirms \"still available\" or it is hidden", "more", "trust", ""),
    ("LST-13", 2, "Video on listings", "more", "trust", ""),
    ("LST-14", 2, "Share cards for WhatsApp and Instagram stories", "more", "demand", ""),
    ("LST-15", 3, "Photo → suggested category, title, description and price", "ai", "supply", "A short form that takes under a minute"),
    ("LST-16", 3, "Bulk upload for dealers and agencies", "flow", "supply", "The team uploads their stock for them"),
    ("LST-17", 3, "\"3 people saved this, lower the price to tell them\"", "flow", "back", ""),
    ("LST-18", 4, "Paste an Instagram or Facebook link → draft listing", "frag", "supply", "The team copies the post by hand"),
    ("LST-19", 4, "360° tours", "media", "trust", "LST-13: video"),
    # ---- Search and discovery
    ("SRCH-01", 1, "Home feed, category pages and listing page", "form", "demand", ""),
    ("SRCH-02", 1, "Search with basic filters: category, city, price range", "form", "demand", ""),
    ("SRCH-03", 1, "Favourites", "form", "back", ""),
    ("SRCH-04", 2, "Map with pins", "svc", "demand", ""),
    ("SRCH-05", 2, "Saved searches with alerts by email or Telegram", "svc", "back", ""),
    ("SRCH-06", 2, "Compare and recently viewed", "more", "demand", ""),
    ("SRCH-07", 2, "A page per area and need in each language, so Google brings visitors", "more", "demand", ""),
    ("SRCH-08", 3, "Plain-language search in any language", "ai", "demand", "SRCH-02: filters"),
    ("SRCH-09", 3, "Home screen that changes by who you are: student, resident, newcomer, business", "flow", "back", ""),
    ("SRCH-10", 3, "Price-drop alerts", "flow", "back", ""),
    ("SRCH-11", 4, "Price insight: typical price, \"good price\" badge, price history", "data", "trust", ""),
    # ---- Talking to each other
    ("TALK-01", 1, "WhatsApp button with a ready message that names the app and links the listing; every tap counted", "form", "demand", ""),
    ("TALK-02", 1, "Call button", "form", "demand", ""),
    ("TALK-09", 1, "The site installs to a phone's home screen and opens like an app", "page", "back", ""),
    ("TALK-03", 3, "In-app chat", "live", "back", "TALK-01: the WhatsApp button"),
    ("TALK-04", 3, "Automatic translation inside chat, with \"show original\"", "ai", "demand", "LST-11: translated listings"),
    ("TALK-05", 3, "Notifications", "live", "back", "SRCH-05: alerts by email or Telegram"),
    ("TALK-06", 4, "Offers, counter-offers and viewing appointments inside chat", "flow", "demand", "WhatsApp"),
    ("TALK-07", 4, "Shared business inbox for several staff", "prod", "earn", "One WhatsApp Business number"),
    ("TALK-08", 4, "Voice notes transcribed and translated", "ai", "demand", ""),
    # ---- Language and prices
    ("LANG-01", 1, "Interface in Turkish and English", "form", "demand", ""),
    ("LANG-02", 1, "Interface in Arabic (right-to-left), right after launch", "form", "demand", ""),
    ("LANG-03", 2, "Prices converted to TRY/GBP/EUR/USD at the day's rate", "svc", "demand", ""),
    ("LANG-04", 2, "Interface in Russian, Persian and French", "more", "demand", ""),
    # ---- Engines
    ("ENG-01", 3, "Quote requests: post a need, providers answer with offers", "flow", "demand", "A request form that goes to WhatsApp"),
    ("ENG-02", 3, "\"My Island\": my home, my car, my permit, with reminders", "flow", "back", "Guide pages with the dates to remember"),
    ("ENG-03", 3, "App Store and Google Play apps, if enrolment is possible", "frag", "demand", "TALK-09: the website installs to the home screen"),
    ("ENG-04", 4, "Booking engine: calendar, request or instant booking, cancellation rules", "cal", "earn", "A \"Request\" button that opens WhatsApp"),
    ("ENG-05", 4, "Online payment for featured listings and subscriptions", "money", "earn", "Cash or bank transfer; an admin switches it on"),
    ("ENG-06", 4, "\"My Island\" with full records: a car's service history fills in its listing", "data", "back", "ENG-02"),
    ("ENG-07", 5, "Dispatch engine: live location, nearest provider, arrival time", "loc", "earn", "A call list by district"),
    ("ENG-08", 5, "Held payments, payouts to providers, wallet, instalments", "held", "earn", "Buyer and seller deal directly"),
    ("ENG-09", 5, "Live auctions: timed bidding, reserve price", "bid", "earn", "ENH-12: an auctions board, as listings"),
    # ---- Admin and operations
    ("ADM-01", 1, "Admin: remove a listing, ban a user, see the reports", "form", "ops", ""),
    ("ADM-02", 1, "View and WhatsApp-tap counts per listing: the one number to watch", "form", "ops", ""),
    ("ADM-03", 2, "Checking queue for new listings", "more", "trust", ""),
    ("ADM-04", 2, "Banners, guide pages and promo codes", "more", "ops", ""),
    ("ADM-05", 3, "Health dashboard per category and city, including searches that found nothing", "flow", "ops", "ADM-02 read in a spreadsheet"),
    ("ADM-06", 3, "Staff roles and a record of admin actions", "flow", "ops", ""),
    ("ADM-07", 3, "Support tickets", "flow", "ops", "ENH-01: a person on WhatsApp"),
    ("ADM-08", 0, "Sales list of businesses to sign, kept in a spreadsheet", "hand", "ops", ""),
    # ---- Tools for businesses
    ("BIZ-01", 2, "Full company page: hours, services, prices, photos", "more", "supply", ""),
    ("BIZ-02", 2, "Catalogue on the company page", "more", "supply", ""),
    ("BIZ-03", 2, "Featured spot, paid in cash or by transfer and switched on by an admin", "hand", "earn", ""),
    ("BIZ-04", 3, "List of enquiries with status", "flow", "earn", "The WhatsApp chat list"),
    ("BIZ-05", 3, "Numbers for the business: views and WhatsApp taps", "flow", "earn", "LST-03: the view counter"),
    ("BIZ-06", 3, "Demand map: \"120 people searched 1+1 in Karakol, 9 listings exist\"", "flow", "earn", ""),
    ("BIZ-07", 4, "Dealer tools: stock age and price suggestion", "data", "earn", ""),
    ("BIZ-08", 4, "Agency tools: owners, viewings, contract generator", "prod", "earn", ""),
    ("BIZ-09", 4, "Dorm tools: rooms, applications, term payments", "prod", "earn", ""),
    ("BIZ-10", 4, "Rental tools: fleet calendar", "cal", "earn", ""),
    ("BIZ-11", 4, "WhatsApp auto-reply and FAQ bot", "frag", "earn", ""),
    ("BIZ-12", 4, "Quotes and invoices", "money", "earn", ""),
    ("BIZ-13", 4, "Self-serve promotions with a budget", "money", "earn", "BIZ-03"),
    ("BIZ-14", 4, "Business subscriptions paid online", "money", "earn", "BIZ-03"),
    # ---- Enhancements
    ("ENH-01", 0, "A human on WhatsApp: one number answered by a person", "hand", "trust", ""),
    ("ENH-02", 0, "Group admins as partners: paid checkers and ambassadors", "hand", "demand", ""),
    ("ENH-03", 0, "Viewing on your behalf: a team member films a flat for a student abroad", "hand", "earn", ""),
    ("ENH-04", 0, "Leaving-sale week: a campaign each May–June on every campus", "hand", "supply", ""),
    ("ENH-05", 1, "Arrival guide and checklist pages: admission → pickup → first bed → SIM → permit → flat", "page", "demand", ""),
    ("ENH-06", 1, "Address helper for online orders (the \"Mersin 10\" problem)", "page", "demand", ""),
    ("ENH-07", 2, "Trusted-tenant profile: a student with a checked ID and university", "more", "trust", ""),
    ("ENH-08", 2, "Post-once tool: a ready post and link for Facebook groups and Instagram", "more", "demand", ""),
    ("ENH-09", 2, "Telegram alert channels per city and category, filled by new listings", "svc", "back", ""),
    ("ENH-10", 2, "Student discount card", "more", "supply", ""),
    ("ENH-11", 2, "Daily hub: exchange rates, duty pharmacy, power and water cuts, bus times, entered by an admin", "hand", "back", ""),
    ("ENH-12", 2, "Auctions board: car auctions, bank and court sales, as listings", "more", "demand", ""),
    ("ENH-13", 2, "Insurance, loan and cargo request forms", "more", "earn", ""),
    ("ENH-14", 3, "Contract explainer: photograph a tenancy contract, get it explained in your language", "ai", "trust", "RE-05: the two-language template"),
    ("ENH-15", 3, "Move-in / move-out kit: photo inventory, deposit record, handover checklist", "flow", "trust", "A printable checklist"),
    ("ENH-16", 3, "Portal for education agents abroad", "flow", "demand", "Agents send requests by WhatsApp"),
    ("ENH-17", 4, "North Cyprus price index: a quarterly rent and car-price report", "data", "demand", ""),
    ("ENH-18", 4, "Points earned by reviews and referrals, spent on boosts", "prod", "back", ""),
    ("ENH-19", 4, "Permit assistant with health-test booking and insurance purchase", "money", "earn", "ENH-05 plus ENG-02 reminders"),
    ("ENH-20", 4, "Daily hub fed automatically", "frag", "back", "ENH-11"),
    ("ENH-21", 5, "AI concierge: \"I land on 10 September, EMU, £400 a month\" → a plan from real listings", "all", "demand", "ENH-05 and a person on WhatsApp"),
    ("ENH-22", 5, "Paying bills in the app", "held", "back", "ENG-02 reminders"),
    # ---- Buy and sell
    ("BUY-01", 1, "Second-hand categories: electronics, furniture, appliances, books, clothes", "form", "supply", ""),
    ("BUY-02", 1, "Free items and swap", "form", "supply", ""),
    ("BUY-03", 3, "Alerts when a wanted item appears", "flow", "back", "LST-06: wanted posts"),
    ("BUY-04", 4, "Delivery between cities with a courier partner", "frag", "demand", "A list of couriers to call"),
    ("BUY-05", 5, "Protected payment for goods", "held", "earn", "Meet at a safe meeting point"),
    # ---- Student flats, rooms, roommates
    ("ROOM-01", 1, "Flat and room listings", "form", "supply", ""),
    ("ROOM-02", 1, "Roommate-wanted and lease-take-over posts", "form", "supply", ""),
    ("ROOM-03", 2, "Student fields: accepts students, furnished, bills included, deposit, months upfront", "more", "demand", ""),
    ("ROOM-04", 2, "Two-week \"landing\" stays for new arrivals", "more", "demand", ""),
    ("ROOM-05", 3, "Roommate matching by budget, gender, language and habits", "flow", "demand", "ROOM-02"),
    ("ROOM-06", 5, "Rent deposit held by the platform", "held", "earn", "ENH-15: a deposit record"),
    # ---- Dorms
    ("DORM-01", 2, "Every dorm with room types, price per term, photos, distance to faculty, what is included", "more", "demand", ""),
    ("DORM-02", 2, "Compare dorms side by side", "more", "demand", ""),
    ("DORM-03", 2, "\"Apply\" form that sends a request to the dorm", "more", "earn", ""),
    ("DORM-04", 2, "Dorm reviews by checked students", "more", "trust", ""),
    ("DORM-05", 3, "Application tracking", "flow", "back", "DORM-03"),
    ("DORM-06", 3, "Waitlist", "flow", "demand", ""),
    ("DORM-07", 4, "Real booking with live room availability", "cal", "earn", "DORM-03"),
    ("DORM-08", 5, "Parents view and pay from abroad", "held", "earn", "The dorm's own bank details on its page"),
    # ---- Education agency
    ("EDU-01", 2, "University and programme finder", "more", "demand", ""),
    ("EDU-02", 2, "Tuition comparison", "more", "demand", ""),
    ("EDU-03", 2, "Apply form that feeds the agency's CRM", "more", "earn", ""),
    ("EDU-04", 2, "Document checklist per country", "page", "demand", ""),
    ("EDU-05", 3, "Application tracker", "flow", "back", "Updates by WhatsApp"),
    ("EDU-06", 4, "Full application in the app: documents uploaded, checked and sent to the university", "sens", "earn", "EDU-03"),
    # ---- Arrival services
    ("ARR-01", 2, "Request form for airport pickup", "more", "earn", ""),
    ("ARR-02", 2, "Arrival bundle sold by hand: pickup, SIM, first nights, permit help", "hand", "earn", ""),
    ("ARR-03", 2, "Guides: SIM card, bank account, receiving money from home", "page", "demand", ""),
    ("ARR-04", 3, "Guided arrival checklist that tracks your progress", "flow", "back", "ENH-05"),
    ("ARR-05", 4, "Buying the arrival bundle in the app", "money", "earn", "ARR-02"),
    # ---- Car rental
    ("RENT-01", 2, "Every company with prices, deposit and age rules, airport delivery", "more", "demand", ""),
    ("RENT-02", 2, "Request by WhatsApp with the dates filled in", "more", "earn", ""),
    ("RENT-03", 2, "Monthly student deals and scooters", "more", "demand", ""),
    ("RENT-04", 3, "One request sent to several companies", "flow", "demand", "RENT-02"),
    ("RENT-05", 4, "Live availability and booking", "cal", "earn", "RENT-02"),
    # ---- Towing and roadside
    ("TOW-01", 2, "Call list by district: one tap to call", "more", "demand", ""),
    ("TOW-02", 2, "Services listed per truck: tow, tyre, battery, fuel, lockout", "more", "demand", ""),
    ("TOW-03", 3, "Send my location to providers", "flow", "demand", "TOW-01"),
    ("TOW-04", 5, "True dispatch: nearest truck, live tracking, price estimate", "loc", "earn", "TOW-01"),
    # ---- Car services and tyres
    ("CSRV-01", 2, "Directory by district: garages, tyres, battery, air-con, body and paint, wash, tinting, inspection stations", "more", "demand", ""),
    ("CSRV-02", 3, "\"My car\" reminders: road licence, two-yearly inspection, insurance", "flow", "back", ""),
    ("CSRV-03", 3, "Quote requests to garages and tyre shops", "flow", "demand", "CSRV-01"),
    ("CSRV-04", 4, "Booking a service slot", "cal", "earn", "A call or WhatsApp"),
    # ---- Cleaning and home services
    ("HOME-01", 2, "Directory of checked pros: cleaning, air-con, plumber, electrician, painter, movers, pest control, pool, garden, solar, locksmith, appliance repair", "more", "demand", ""),
    ("HOME-02", 2, "Fixed-price packages shown on the page", "more", "trust", ""),
    ("HOME-03", 2, "One-tap re-order of water tanker, bottled water and gas by WhatsApp", "more", "back", ""),
    ("HOME-04", 2, "Before/after photos on pro pages", "more", "trust", ""),
    ("HOME-05", 3, "Quote requests to several pros", "flow", "demand", "HOME-01"),
    ("HOME-06", 4, "Booking calendar for cleaners and pros", "cal", "earn", "A request by WhatsApp"),
    ("HOME-07", 5, "Redo guarantee backed by held payment", "held", "trust", "HOME-04 and reviews"),
    # ---- Real estate agencies
    ("RE-01", 2, "Agency pages", "more", "supply", ""),
    ("RE-02", 2, "Rental listings with title-deed type, furnished, bills and deposit", "more", "demand", ""),
    ("RE-03", 2, "Daily and holiday rentals, land, commercial and new projects as listing types", "more", "supply", ""),
    ("RE-04", 2, "Move-in cost calculator", "more", "trust", ""),
    ("RE-05", 2, "Two-language tenancy contract template", "page", "trust", ""),
    ("RE-06", 2, "Owner-direct badge", "more", "trust", ""),
    ("RE-07", 3, "Viewing appointments", "flow", "demand", "WhatsApp"),
    ("RE-08", 4, "Draw-an-area search on the map", "geo", "demand", "SRCH-04: map with pins"),
    ("RE-09", 4, "Management for owners living abroad: keys, rent collection, repairs", "money", "earn", "A directory of property managers"),
    ("RE-10", 4, "Property for sale, opened only after a lawyer advises", "law", "earn", ""),
    ("RE-11", 4, "Off-plan progress tracker and foreign-buyer permit guide", "law", "trust", ""),
    # ---- Construction and B2B
    ("CON-01", 2, "Company directory: contractors, architects, engineers, materials, machinery rental", "more", "demand", ""),
    ("CON-02", 2, "Project portfolios", "more", "trust", ""),
    ("CON-03", 2, "Tenders board", "more", "demand", ""),
    ("CON-04", 3, "Request-for-quote board", "flow", "earn", "CON-01"),
    ("CON-05", 4, "Bid management", "prod", "earn", ""),
    ("CON-06", 4, "Materials price data", "data", "demand", ""),
    # ---- Professionals
    ("PRO-01", 2, "Directory: doctors, dentists, vets, lawyers, accountants, sworn translators, insurers", "more", "demand", ""),
    ("PRO-02", 2, "Filter by language spoken", "more", "demand", ""),
    ("PRO-03", 3, "Request a call back", "flow", "demand", "A call"),
    ("PRO-04", 4, "Appointment booking", "cal", "earn", "A call"),
    # ---- Cars and vehicles
    ("CAR-01", 2, "Dealer pages", "more", "supply", ""),
    ("CAR-02", 2, "Listings with car fields: make, model, year, km, duty status, road licence, inspection date, steering side", "more", "demand", ""),
    ("CAR-03", 2, "Motorbikes, vans, machinery, boats and parts as categories", "more", "supply", ""),
    ("CAR-04", 2, "Transfer-cost and import-duty calculators", "more", "trust", ""),
    ("CAR-05", 2, "Wanted cars, swap, instalment listings and \"arriving stock\" pre-orders", "more", "supply", ""),
    ("CAR-06", 3, "Compare a car with similar listings", "flow", "trust", ""),
    ("CAR-07", 4, "Valuation from your own data", "data", "trust", "CAR-06"),
    ("CAR-08", 4, "Inspection booking with partner garages", "cal", "earn", "A list of garages that inspect"),
    ("CAR-09", 5, "Live car auctions", "bid", "earn", "ENH-12"),
    # ---- Freelancing
    ("FREE-01", 2, "Gig listings with packages and a portfolio", "more", "supply", ""),
    ("FREE-02", 2, "Rule shown on every gig: tutoring yes, doing graded work no", "page", "trust", ""),
    ("FREE-03", 3, "Order tracking and reviews after each job", "flow", "trust", ""),
    ("FREE-04", 5, "Orders paid through held payments, Fiverr-style", "held", "earn", "Buyer and freelancer deal directly"),
    # ---- Jobs
    ("JOB-01", 2, "Job posts, part-time student jobs first", "more", "demand", ""),
    ("JOB-02", 2, "Employer pages", "more", "supply", ""),
    ("JOB-03", 2, "Student work-permit guide for employers", "page", "trust", ""),
    ("JOB-04", 3, "CV builder", "flow", "demand", ""),
    ("JOB-05", 3, "Quick apply", "flow", "demand", "Apply by WhatsApp"),
    # ---- Rides and travel
    ("RIDE-01", 2, "Shared-ride board: Famagusta–Nicosia–airport", "more", "back", ""),
    ("RIDE-02", 2, "Transfer directory for Ercan and Larnaca", "more", "demand", ""),
    ("RIDE-03", 2, "Border-crossing information", "page", "demand", ""),
    ("RIDE-04", 4, "Holiday-let booking", "cal", "earn", "A request by WhatsApp"),
    ("RIDE-05", 5, "Events and tickets", "held", "earn", ""),
    # ---- More local categories
    ("MORE-01", 2, "Animals and farm, boats, wedding services, businesses for sale, shops to let", "more", "supply", ""),
    ("MORE-02", 2, "Lost and found; charity", "more", "back", ""),
    # ---- Added 14 Nov 2026 (IDEA-REVIEW and the two feature lists)
    ("LST-20", 3, "Voice posting: say the ad, it is written, priced and put in a category", "ai", "supply", "LST-21"),
    ("LST-21", 1, "Paste a group post and the form fills itself in", "form", "supply", ""),
    ("LST-22", 2, "Holiday mode: pause all my ads with one tap", "more", "back", ""),
    ("SRCH-12", 3, "Smart alerts in plain words, sent on WhatsApp", "ai", "back", "SRCH-05"),
    ("TALK-10", 3, "The app inside WhatsApp: post, search and alerts by chat", "live", "supply", "ENH-01"),
    ("LANG-05", 3, "Best exchange rate nearby, compared across exchange offices", "data", "back", "ENH-11"),
    ("ACC-20", 3, "\"Price looks wrong\" warning when a rent is far below the area's usual price", "data", "trust", "ACC-04"),
    ("ACC-21", 3, "Team accounts: several staff post under one business", "flow", "supply", ""),
    ("ACC-22", 3, "Scam map: reported scams by area and kind", "data", "trust", "ACC-04"),
    ("ACC-23", 3, "Trust score from checked ID, reply rate, reviews and account age", "data", "trust", "ACC-09"),
    ("ACC-24", 4, "Scam-ring detection across accounts: same number, photos or wording", "data", "trust", "ACC-14"),
    ("ADM-09", 2, "Ambassador dashboard: ads brought in, taps, leaderboard, earnings", "more", "supply", "ADM-08"),
    ("ADM-10", 4, "Partner data access under contract for universities, banks and agencies", "data", "earn", ""),
    ("ADM-11", 4, "White-label engine: the same app relaunched in another small market", "prod", "earn", ""),
    ("BIZ-15", 2, "Embed widget: a business shows its ads on its own website", "more", "supply", ""),
    ("BIZ-16", 3, "WhatsApp Business catalogue kept in sync with the shop", "frag", "supply", "LST-04"),
    ("BIZ-17", 4, "Lead credits: a business pays per customer contact", "money", "earn", "BIZ-03"),
    ("BIZ-18", 3, "Monthly business report: views, taps, searches, compared with similar businesses", "flow", "earn", "ADM-02"),
    ("BIZ-19", 2, "Verified business badge after a trade licence is checked", "hand", "trust", ""),
    ("ENH-23", 3, "Group-admin bot: group posts become ads with the seller's OK; weekly best-of post", "live", "supply", "ENH-02"),
    ("ENH-24", 2, "University housing pages run with each international office", "more", "demand", ""),
    ("ENH-25", 2, "Summer storage through a partner instead of selling cheap", "hand", "earn", "ENH-04"),
    ("ENH-26", 2, "\"Buy from Turkey for me\": ordering and Mersin 10 delivery handled for you", "hand", "earn", "ENH-06"),
    ("ENH-27", 1, "Emergency page: police, ambulance, fire, duty pharmacy, embassies, in three languages", "page", "trust", ""),
    ("ENH-28", 2, "Official steps guides: residence permit, work permit, car registration", "page", "trust", ""),
    ("ENH-29", 2, "Low-data mode for weak connections", "all", "demand", ""),
    ("ENH-30", 1, "Accessibility: large text, screen readers, contrast", "all", "trust", ""),
    ("ENH-31", 3, "Open price data: average rents and car prices by area, free to read", "data", "demand", ""),
    ("COM-01", 2, "Neighbourhood boards: notices, recommendations, lost and found per area", "more", "back", ""),
    ("COM-02", 2, "\"Ask the island\": public questions answered by locals and businesses", "more", "demand", ""),
    ("COM-03", 2, "Newcomer buddy: a senior student who speaks your language", "hand", "demand", ""),
    ("COM-04", 2, "Community hubs: one page per community with its shops, groups and events", "more", "demand", ""),
    ("COM-05", 2, "Language exchange partners", "more", "back", ""),
    ("COM-06", 3, "Helper badges: fast responder, trusted seller, top answer", "data", "trust", ""),
    ("COM-07", 2, "Weekly digest per city on a WhatsApp or Telegram channel", "svc", "back", ""),
    ("COM-08", 2, "What's on this week: free events, concerts, festivals", "more", "back", ""),
    ("BUY-06", 2, "Books and notes by course code", "more", "demand", ""),
    ("BUY-07", 2, "Safe handover points at partner shops", "hand", "trust", "ACC-04"),
    ("BUY-08", 2, "Furniture rental packages for a year", "more", "earn", ""),
    ("BUY-09", 3, "Group buying: students pool an order for a better price", "flow", "earn", ""),
    ("BUY-10", 3, "Borrow, don't buy: lend and borrow between people", "flow", "back", "BUY-02"),
    ("ROOM-07", 2, "Women-only filter for flats, roommates and dorm floors", "more", "trust", ""),
    ("ROOM-08", 3, "Flat bill splitter: who paid electricity, water, internet", "flow", "back", ""),
    ("ROOM-09", 3, "Deposit-back helper: move-in photos, move-out checklist, letter, mediator", "flow", "trust", "ENH-03"),
    ("ROOM-10", 4, "Rent paid by transfer with dated receipts in two languages", "money", "trust", "RE-05"),
    ("ROOM-11", 3, "Book and pay for a \"Seen by us\" video viewing; the ad gets a badge", "flow", "earn", "ENH-03"),
    ("ARR-06", 3, "New-arrival plan built from real ads: room, pickup, SIM, permit", "flow", "demand", "ENH-05"),
    ("ARR-07", 2, "Utilities setup helper: electricity, water, internet", "page", "demand", ""),
    ("ARR-08", 2, "SIM and home internet plans compared", "page", "demand", ""),
    ("HOME-08", 3, "Moving-day bundle: van, helpers and cleaner in one request", "flow", "earn", "HOME-01"),
    ("HOME-09", 2, "Phone and laptop repair with prices for common jobs", "more", "demand", ""),
    ("RE-12", 0, "Lawyer-checked tenancy contract for a fixed fee", "hand", "trust", ""),
    ("RE-13", 2, "Coworking desks, offices and meeting rooms", "more", "supply", ""),
    ("RE-14", 3, "Staff housing: employers find many rooms at once", "flow", "earn", "RE-01"),
    ("CON-07", 3, "Business supplies: wholesale and hotel/restaurant suppliers", "flow", "earn", "CON-01"),
    ("CAR-10", 2, "Parking spaces to rent by the month", "more", "supply", ""),
    ("CAR-11", 2, "Driving schools and foreign licence conversion guide", "more", "demand", ""),
    ("JOB-06", 3, "Seasonal shift work for hotels, casinos and cafés", "flow", "demand", "JOB-01"),
    ("JOB-07", 2, "Internships filtered by degree", "more", "demand", ""),
    ("RIDE-06", 3, "Airport day board: who flies in or out today, share a ride or carry a parcel", "flow", "back", "RIDE-01"),
    ("MORE-03", 2, "Pet services: vets, sitting, grooming, adoption", "more", "supply", ""),
    ("MORE-04", 2, "Shop deals and flyers of the week", "more", "back", ""),
    ("MORE-05", 2, "Restaurant and café guide with student deals (no delivery)", "more", "demand", ""),
    ("PRO-05", 2, "Childcare and tutors, by language", "more", "demand", ""),
    ("TOUR-01", 2, "Tourist experiences: boat trips, tours, diving, transfers, in five languages", "more", "earn", ""),
    ("TOUR-02", 4, "Experience booking with dates and group size", "cal", "earn", "TOUR-01"),
    ("ARR-09", 1, "Student questions: bank accounts, money from home, rent deposits, visas and permits, with ask-on-WhatsApp", "page", "demand", ""),
    ("ARR-10", 2, "Residence-permit reminder: days left, calendar reminders, papers checklist", "more", "back", "ARR-09"),
    ("ARR-11", 2, "Leaving-the-island checklist: diploma, deposit, bills, bank, permit", "page", "back", "ENH-04"),
    ("MED-01", 2, "Clinic pages with price ranges and enquiries in the visitor's language", "law", "earn", ""),
]

BY_HAND = [
    ("Booking a dorm or a rental car", "A \"Request\" button that opens WhatsApp with the details filled in"),
    ("Calling a tow truck", "A list of tow trucks by district: one tap to call"),
    ("Verified sellers", "An admin checks the ID over WhatsApp and switches the badge on"),
    ("Paid featured listings", "Paid in cash or by bank transfer; an admin switches it on"),
    ("Fiverr-style freelancing", "Gig listings with prices and a portfolio; buyer and freelancer deal directly"),
    ("Renting a flat unseen from abroad", "A campus team member visits and films it for a small fee"),
]

IDEAS = [
    ("Easy first", "Five levels, each a working product by itself. You can stop at any level and still have something real."),
    ("Bridge the language islands", "Sellers post in Turkish groups; foreign students and expats search in Arabic, English or Russian groups. One listing shown in every language reaches every community."),
    ("Every seller gets a free shop link", "One page with all their items, a QR code and WhatsApp buttons. Useful with zero buyers, and each seller brings their own audience."),
    ("Finish what can be finished", "All dorms, car rentals, tow trucks and tyre shops can be listed completely by hand. A complete list is useful on day one."),
    ("Launch on the student calendar", "May–June: students leaving sell everything, so supply arrives. September: new students need everything, so demand arrives."),
    ("By hand before by code", "Every hard feature starts as a person on WhatsApp behind a simple button."),
]

START = [
    ("Groundwork, no code", "Signed one-page agreement · name and domain · the seven-day Facebook census · ask 20 sellers, 10 dorm operators and 20 landlords · lawyer or accountant"),
    ("Build L1 in six slices", "Post a listing · browse and search · listing page with WhatsApp button · my listings, shop link, QR · admin · languages"),
    ("Closed test", "Thirty people each post three real items: ninety listings before any stranger sees the site"),
    ("Launch for the leaving sale", "One campus, a fixed date in mid-May 2027"),
    ("Complete the first lists by hand", "Dorms, car rentals, tow trucks, arrival guides, ready for September's new students"),
]

ENDINGS = [
    ("A", "The island's default", "The place the north goes for homes, cars and services; professionals pay; a small team runs it."),
    ("B", "A profitable niche", "It owns student landing (housing, arrival, second-hand) and stops there."),
    ("C", "The software, not the marketplace", "The business tools are sold to businesses, or the engine is reused in another market."),
    ("D", "A clean stop", "A gate is missed twice and it closes. Kept: a launched product, the engine, the skills."),
]

NAMED = [
    "dorm registration", "education agency", "cars", "car renting", "car services", "towing services",
    "tyre services", "real estate agencies", "construction companies", "cleaning services",
    "any kind of services", "freelancing like Fiverr",
]


# --------------------------------------------------------------------------- checks
def area_of(fid: str) -> str:
    return fid.rsplit("-", 1)[0]


def band(level: int) -> str:
    return "easy" if level <= 2 else ("medium" if level == 3 else "hard")


def check() -> list[str]:
    problems: list[str] = []
    keys = {a["key"] for a in AREAS}
    ids = [f[0] for f in F]
    for fid, n in Counter(ids).items():
        if n > 1:
            problems.append(f"duplicate id {fid}")
    for fid, level, name, why, job, easy in F:
        if not re.fullmatch(r"[A-Z]+-\d{2}", fid):
            problems.append(f"bad id format {fid}")
        if area_of(fid) not in keys:
            problems.append(f"{fid}: unknown area")
        if level not in LEVELS:
            problems.append(f"{fid}: bad level {level}")
        if why not in WHY:
            problems.append(f"{fid}: unknown why '{why}'")
        if job not in JOB:
            problems.append(f"{fid}: unknown job '{job}'")
        if not name.strip():
            problems.append(f"{fid}: empty name")
        for ref in re.findall(r"[A-Z]+-\d{2}", easy):
            if ref not in ids:
                problems.append(f"{fid}: easy-first refers to missing {ref}")
            elif next(f[1] for f in F if f[0] == ref) >= level:
                problems.append(f"{fid}: easy-first {ref} is not at a lower level")
    # every area has features
    used = {area_of(f[0]) for f in F}
    for a in AREAS:
        if a["key"] not in used:
            problems.append(f"area {a['key']} has no features")
    # coverage of the brief
    covered = {n: a for a in AREAS if a["kind"] == "vertical" for n in a["named"]}
    for n in NAMED:
        if n not in covered:
            problems.append(f"brief item not covered: {n}")
            continue
        bands = {band(f[1]) for f in F if area_of(f[0]) == covered[n]["key"]}
        for b in ("easy", "medium", "hard"):
            if b not in bands:
                problems.append(f"'{n}' ({covered[n]['key']}) has no {b} version")
    # the Level 1 spec may only mention L0/L1 features
    spec = HERE / "LEVEL-1-SPEC.md"
    if spec.exists():
        level_of = {f[0]: f[1] for f in F}
        for ref in sorted(set(re.findall(r"\b[A-Z]{2,5}-\d{2}\b", spec.read_text(encoding="utf-8")))):
            if ref not in level_of:
                problems.append(f"LEVEL-1-SPEC.md mentions unknown {ref}")
            elif level_of[ref] > 1:
                problems.append(f"LEVEL-1-SPEC.md mentions {ref}, which is L{level_of[ref]}")
    return problems


# --------------------------------------------------------------------------- markdown
GENERATED = "*Generated by `py build.py`. Edit the lists in `build.py`, not this file.*"


def md_cell(text: str) -> str:
    return text.replace("|", "\\|")


def lvl(level: int) -> str:
    return "No code" if level == 0 else f"L{level}"


def build_ladder_md() -> str:
    names = {a["key"]: a["name"] for a in AREAS}
    counts = Counter(f[1] for f in F)
    out = ["# Build ladder: every feature, easy → hard", "", GENERATED, ""]
    out += ["Build order = level order. Each level is a working product by itself.", ""]
    out += ["| Level | Name | After this level, a user can… | Why it is this hard | Running cost | Features |", "|---|---|---|---|---|---|"]
    for n in range(1, 6):
        name, after, cost = LADDER[n]
        out.append(f"| **L{n}** | {name} | {after} | {LEVELS[n][1]} | {cost} | {counts[n]} |")
    out += ["", f"Plus **{counts[0]}** things that need no code at all. Total: **{len(F)}** features.", ""]
    out += ["## Do it by hand first", "", "Every hard feature has an easy first version, so everything in the brief can exist from L2.", ""]
    out += ["| Hard feature | Easy first version |", "|---|---|"]
    out += [f"| {a} | {b} |" for a, b in BY_HAND]
    out += ["", "## Why a feature sits at its level", ""]
    out += ["| Reason | Typical level |", "|---|---|"]
    typical = defaultdict(list)
    for f in F:
        typical[f[3]].append(f[1])
    for code, text in WHY.items():
        if typical[code]:
            lo, hi = min(typical[code]), max(typical[code])
            out.append(f"| {text} | {lvl(lo) if lo == hi else lvl(lo) + '–' + lvl(hi)} |")
    for n in range(0, 6):
        rows = [f for f in F if f[1] == n]
        head = "No code" if n == 0 else f"L{n}: {LEVELS[n][0]}"
        out += ["", f"## {head} ({len(rows)})", ""]
        if n:
            out += [f"*{LADDER[n][0]}.* {LEVELS[n][1]}", ""]
        out += ["| ID | Feature | Area | Why here | Easy first version |", "|---|---|---|---|---|"]
        for fid, _, name, why, _, easy in rows:
            out.append(f"| {fid} | {md_cell(name)} | {names[area_of(fid)]} | {WHY[why]} | {md_cell(easy) or '·'} |")
    return "\n".join(out) + "\n"


def build_features_md() -> str:
    out = ["# Feature catalogue, by area", "", GENERATED, ""]
    out += ["Each feature has one level (see `BUILD-LADDER.md`) and one job:", ""]
    out += [f"- **{t}**" for t in JOB.values()]
    out += ["", "Rule for income: **private users list free; professionals pay.**", ""]
    out += ["## Platform", ""]
    for a in AREAS:
        if a["kind"] != "platform":
            continue
        out += [f"### {a['name']}", "", "| ID | Feature | Level | Job |", "|---|---|---|---|"]
        for fid, level, name, _, job, _ in sorted((f for f in F if area_of(f[0]) == a["key"]), key=lambda f: (f[1], f[0])):
            out.append(f"| {fid} | {md_cell(name)} | {lvl(level)} | {JOB[job]} |")
        out.append("")
    out += ["## Verticals, in the order they open", ""]
    out += ["● = a list you can complete by hand (open these first in L2) · ○ = listings you must attract", ""]
    for a in AREAS:
        if a["kind"] != "vertical":
            continue
        mark = "●" if a["fill"] == "complete" else "○"
        out += [f"### {mark} {a['name']}", ""]
        bits = [f"Modes: {a['modes']}"]
        if a["named"]:
            bits.append("Covers from the brief: " + ", ".join(f"\"{n}\"" for n in a["named"]))
        out += [" · ".join(bits), "", f"**How it earns.** {a['earns']}", ""]
        out += ["| ID | Feature | Level | Job | Easy first version |", "|---|---|---|---|---|"]
        for fid, level, name, _, job, easy in sorted((f for f in F if area_of(f[0]) == a["key"]), key=lambda f: (f[1], f[0])):
            out.append(f"| {fid} | {md_cell(name)} | {lvl(level)} | {JOB[job]} | {md_cell(easy) or '·'} |")
        out.append("")
    out += ["## Coverage of the brief", "", "| You named | Vertical | Easy (L1–L2) | Medium (L3) | Hard (L4–L5) |", "|---|---|---|---|---|"]
    covered = {n: a for a in AREAS if a["kind"] == "vertical" for n in a["named"]}
    for n in NAMED:
        a = covered[n]
        c = Counter(band(f[1]) for f in F if area_of(f[0]) == a["key"])
        out.append(f"| {n} | {a['name']} | {c['easy']} | {c['medium']} | {c['hard']} |")
    return "\n".join(out) + "\n"


# --------------------------------------------------------------------------- html
HTML = r"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>North Cyprus everything-app: feature map</title>
<style>
:root[data-theme="light"]{
  --bg:#f7f6f3; --card:#ffffff; --sunk:#efede8; --line:#dcd8cf;
  --tx:#1d1c1a; --tx2:#5c5952; --tx3:#8a867d; --acc:#1f5fbf;
  --l0:#6b6860; --l0b:#eceae5;
  --l1:#1a7f4b; --l1b:#dff3e7;
  --l2:#0f7c86; --l2b:#d9f1f3;
  --l3:#2a5fc4; --l3b:#e0e9fb;
  --l4:#a25a00; --l4b:#fbeccf;
  --l5:#b3261e; --l5b:#fbe1de;
}
:root[data-theme="dark"]{
  --bg:#14151a; --card:#1c1e25; --sunk:#23262f; --line:#343843;
  --tx:#ecebe7; --tx2:#a9a79f; --tx3:#7d7b74; --acc:#7fb0ff;
  --l0:#a9a79f; --l0b:#2a2c33;
  --l1:#5fd08e; --l1b:#143424;
  --l2:#55c9d3; --l2b:#0f3236;
  --l3:#8db2ff; --l3b:#172a4f;
  --l4:#f0b455; --l4b:#3a2a0d;
  --l5:#ff8a80; --l5b:#40191a;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--tx);
  font:15.5px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  padding:28px 18px 80px;max-width:1180px;margin:0 auto}
h1{font-size:28px;line-height:1.2;letter-spacing:-.01em;text-wrap:balance}
h2{font-size:19px;margin:44px 0 6px;letter-spacing:-.005em}
h2+p.lead{color:var(--tx2);margin-bottom:16px;max-width:70ch}
h3{font-size:15px}
p{max-width:74ch}
button{font:inherit;color:inherit}
.top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}
.top p{color:var(--tx2);margin-top:8px}
.btn{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:7px 14px;cursor:pointer;font-size:13.5px;white-space:nowrap}
.btn:hover{border-color:var(--acc);color:var(--acc)}
.btn:focus-visible,.chip:focus-visible,input:focus-visible{outline:2px solid var(--acc);outline-offset:2px}

.ideas{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;counter-reset:idea;list-style:none}
.ideas li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px 15px;counter-increment:idea}
.ideas h3::before{content:counter(idea) ". ";color:var(--tx3);font-variant-numeric:tabular-nums}
.ideas p{color:var(--tx2);font-size:14px;margin-top:5px}

.ladder{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.rung{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--c);border-radius:12px;padding:13px 14px 14px;display:flex;flex-direction:column;gap:7px}
.rung .tag{font-weight:700;color:var(--c);font-size:13px;letter-spacing:.02em}
.rung h3{font-size:15.5px;line-height:1.3}
.rung p{font-size:13.5px;color:var(--tx2)}
.rung .n{margin-top:auto;padding-top:6px;font-size:12.5px;color:var(--tx3);font-variant-numeric:tabular-nums}
.rung dt{font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);margin-top:4px}
.rung dd{font-size:13.5px;color:var(--tx2)}

.bar{position:sticky;top:0;z-index:5;background:var(--bg);padding:12px 0 10px;margin-top:34px;border-bottom:1px solid var(--line);display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.chip{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 12px;font-size:13px;cursor:pointer;display:inline-flex;gap:6px;align-items:center}
.chip i{width:9px;height:9px;border-radius:50%;background:var(--c);display:inline-block}
.chip[aria-pressed="true"]{background:var(--tx);color:var(--bg);border-color:var(--tx)}
.bar input{flex:1 1 180px;min-width:150px;border:1px solid var(--line);background:var(--card);color:var(--tx);border-radius:999px;padding:6px 14px;font:inherit;font-size:13.5px}
.count{font-size:12.5px;color:var(--tx3);font-variant-numeric:tabular-nums;margin-left:auto}

.f{display:flex;gap:8px;align-items:baseline;padding:5px 0;font-size:13.8px;line-height:1.4}
.f b{flex:0 0 auto;font-size:11px;font-weight:700;color:var(--c);background:var(--cb);border-radius:5px;padding:1px 6px;font-variant-numeric:tabular-nums;min-width:27px;text-align:center}
.f span{overflow-wrap:anywhere}
.f small{display:block;color:var(--tx3);font-size:12px;margin-top:1px}
.f.off{display:none}
.empty{color:var(--tx3);font-size:13px;padding:5px 0}

.vert{background:var(--card);border:1px solid var(--line);border-radius:12px;margin-bottom:10px;overflow:hidden}
.vert header{padding:12px 16px 10px;display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;border-bottom:1px solid var(--line)}
.vert header h3{font-size:16px}
.vert header .meta{font-size:12.5px;color:var(--tx3)}
.vert header .named{font-size:12px;background:var(--sunk);border-radius:999px;padding:1px 9px;color:var(--tx2)}
.vert .cols{display:grid;grid-template-columns:repeat(3,1fr)}
.vert .col{padding:10px 16px 12px;min-width:0}
.vert .col+.col{border-left:1px solid var(--line)}
.vert .col h4{font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);margin-bottom:3px;font-weight:600}
.vert .earn{padding:9px 16px 11px;border-top:1px solid var(--line);font-size:13px;color:var(--tx2);background:var(--sunk)}
.vert.off{display:none}

.plat{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:10px}
.plat .box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px 12px;min-width:0}
.plat .box h3{margin-bottom:4px}
.plat .box.off{display:none}

.steps{list-style:none;counter-reset:s;display:grid;gap:8px}
.steps li{counter-increment:s;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px 12px 52px;position:relative}
.steps li::before{content:counter(s);position:absolute;left:16px;top:12px;width:24px;height:24px;border-radius:50%;background:var(--sunk);color:var(--tx2);font-size:13px;font-weight:700;display:grid;place-items:center}
.steps p{color:var(--tx2);font-size:14px;margin-top:2px}
.ends{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px}
.ends div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:13px 16px}
.ends b{color:var(--tx3);margin-right:6px}
.ends p{color:var(--tx2);font-size:14px;margin-top:4px}
.hand{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
.hand th,.hand td{text-align:left;padding:9px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.hand th{font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--tx3);font-weight:600;background:var(--sunk)}
.hand tr:last-child td{border-bottom:0}
footer{margin-top:44px;color:var(--tx3);font-size:12.5px}

@media (max-width:900px){.ladder{grid-template-columns:1fr 1fr}}
@media (max-width:720px){
  body{padding:20px 14px 70px}
  h1{font-size:23px}
  .ladder{grid-template-columns:1fr}
  .vert .cols{grid-template-columns:1fr}
  .vert .col+.col{border-left:0;border-top:1px solid var(--line)}
  .plat{grid-template-columns:1fr}
  .count{margin-left:0;flex-basis:100%}
}
@media print{.bar,.btn{display:none}body{max-width:none}}
</style>
</head>
<body>

<div class="top">
  <div>
    <h1>One app for everything in North Cyprus</h1>
    <p><span id="total"></span> features, placed from easy to hard. Build order follows the levels.</p>
  </div>
  <button class="btn" id="theme" type="button">Dark</button>
</div>

<h2>The six ideas</h2>
<p class="lead">Why this one can work where six local sites have stayed small.</p>
<ol class="ideas" id="ideas"></ol>

<h2>The build ladder</h2>
<p class="lead">Each level is a working product by itself. Tap a level to show only its features below.</p>
<div class="ladder" id="ladder"></div>

<h2>By hand before by code</h2>
<p class="lead">Every hard feature has an easy first version, so everything in the brief can exist from level 2.</p>
<table class="hand" id="hand"><thead><tr><th>Hard feature</th><th>Easy first version</th></tr></thead><tbody></tbody></table>

<div class="bar" id="bar" role="group" aria-label="Filter features"></div>

<h2>Each vertical, from easy to hard</h2>
<p class="lead">● a list that can be completed by hand: open these first. ○ listings that must be attracted.</p>
<div id="verts"></div>

<h2>Platform features</h2>
<p class="lead">What every vertical shares.</p>
<div class="plat" id="plat"></div>

<h2>How to start</h2>
<ol class="steps" id="start"></ol>

<h2>How it ends</h2>
<p class="lead">Four endings, all acceptable. Checkpoints: June 2027, December 2027, June 2028.</p>
<div class="ends" id="ends"></div>

<footer>Working name: trnc-app · generated __DATE__ from build.py · planning document, nothing here is built yet</footer>

<script>
const D = __DATA__;
const $ = s => document.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tag = l => l === 0 ? '–' : 'L' + l;
const lv = l => `--c:var(--l${l});--cb:var(--l${l}b)`;

$('#total').textContent = D.features.length;

D.ideas.forEach(([t, d]) => $('#ideas').append(el('li', '', `<h3>${esc(t)}</h3><p>${esc(d)}</p>`)));

const counts = {};
D.features.forEach(f => counts[f.level] = (counts[f.level] || 0) + 1);

[1,2,3,4,5].forEach(n => {
  const r = D.ladder[n];
  const b = el('button', 'rung', `<span class="tag">L${n} · ${esc(D.levels[n][0])}</span><h3>${esc(r[0])}</h3>
    <dl><dt>After this level</dt><dd>${esc(r[1])}</dd><dt>Why it is this hard</dt><dd>${esc(D.levels[n][1])}</dd><dt>Running cost</dt><dd>${esc(r[2])}</dd></dl>
    <span class="n">${counts[n]} features</span>`);
  b.type = 'button'; b.style.cssText = lv(n) + ';text-align:left;cursor:pointer';
  b.onclick = () => { setLevel(state.level === n ? null : n); $('#bar').scrollIntoView({block:'start'}); };
  $('#ladder').append(b);
});

D.byHand.forEach(([a, b]) => $('#hand tbody').append(el('tr', '', `<td>${esc(a)}</td><td>${esc(b)}</td>`)));

const state = { level: null, q: '' };
const bar = $('#bar');
const chips = [];
[null,0,1,2,3,4,5].forEach(n => {
  const c = el('button', 'chip', n === null ? 'All' : `<i></i>${n === 0 ? 'No code' : 'L' + n}`);
  c.type = 'button'; if (n !== null) c.style.cssText = lv(n);
  c.setAttribute('aria-pressed', n === null);
  c.onclick = () => setLevel(n);
  chips.push([n, c]); bar.append(c);
});
const q = el('input'); q.type = 'search'; q.placeholder = 'Find a feature…'; q.setAttribute('aria-label', 'Find a feature');
q.oninput = () => { state.q = q.value.trim().toLowerCase(); apply(); };
bar.append(q);
const count = el('span', 'count'); bar.append(count);

const row = f => {
  const d = el('div', 'f', `<b>${tag(f.level)}</b><span>${esc(f.name)}${f.easy ? `<small>First: ${esc(f.easy)}</small>` : ''}</span>`);
  d.style.cssText = lv(f.level); d.dataset.level = f.level; d.dataset.text = (f.id + ' ' + f.name + ' ' + f.easy).toLowerCase(); d.title = f.id + ' · ' + f.why + ' · ' + f.job;
  return d;
};
const ofArea = k => D.features.filter(f => f.area === k).sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));

D.areas.filter(a => a.kind === 'vertical').forEach(a => {
  const v = el('section', 'vert');
  v.append(el('header', '', `<h3>${a.fill === 'complete' ? '●' : '○'} ${esc(a.name)}</h3><span class="meta">${esc(a.modes)}</span>` + a.named.map(n => `<span class="named">${esc(n)}</span>`).join('')));
  const cols = el('div', 'cols');
  [['Easy · L1–L2', f => f.level <= 2], ['Medium · L3', f => f.level === 3], ['Hard · L4–L5', f => f.level >= 4]].forEach(([title, test]) => {
    const c = el('div', 'col', `<h4>${title}</h4>`);
    ofArea(a.key).filter(test).forEach(f => c.append(row(f)));
    c.append(el('div', 'empty', 'Nothing at this level'));
    cols.append(c);
  });
  v.append(cols, el('div', 'earn', `<strong>How it earns.</strong> ${esc(a.earns)}`));
  $('#verts').append(v);
});

D.areas.filter(a => a.kind === 'platform').forEach(a => {
  const b = el('section', 'box', `<h3>${esc(a.name)}</h3>`);
  ofArea(a.key).forEach(f => b.append(row(f)));
  $('#plat').append(b);
});

D.start.forEach(([t, d]) => $('#start').append(el('li', '', `<h3>${esc(t)}</h3><p>${esc(d)}</p>`)));
D.endings.forEach(([k, t, d]) => $('#ends').append(el('div', '', `<h3><b>${k}</b>${esc(t)}</h3><p>${esc(d)}</p>`)));

function setLevel(n) { state.level = n; chips.forEach(([k, c]) => c.setAttribute('aria-pressed', k === n)); apply(); }
function apply() {
  let shown = 0;
  document.querySelectorAll('.f').forEach(d => {
    const ok = (state.level === null || +d.dataset.level === state.level) && (!state.q || d.dataset.text.includes(state.q));
    d.classList.toggle('off', !ok); if (ok) shown++;
  });
  document.querySelectorAll('.vert .col').forEach(c => c.querySelector('.empty').style.display = c.querySelector('.f:not(.off)') ? 'none' : '');
  document.querySelectorAll('.vert, .plat .box').forEach(s => s.classList.toggle('off', !s.querySelector('.f:not(.off)')));
  count.textContent = shown + ' of ' + D.features.length / 1 + ' shown';
}
apply();

const root = document.documentElement, tb = $('#theme');
const setTheme = t => { root.dataset.theme = t; tb.textContent = t === 'dark' ? 'Light' : 'Dark'; try { localStorage.setItem('trnc-app-theme', t); } catch (e) {} };
let saved = null; try { saved = localStorage.getItem('trnc-app-theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
tb.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
</script>
</body>
</html>
"""


def build_html() -> str:
    data = dict(
        levels={n: list(v) for n, v in LEVELS.items()},
        ladder={n: list(v) for n, v in LADDER.items()},
        areas=[dict(key=a["key"], name=a["name"], kind=a["kind"], fill=a.get("fill", ""), modes=a.get("modes", ""),
                    named=a.get("named", []), earns=a.get("earns", "")) for a in AREAS],
        features=[dict(id=f[0], area=area_of(f[0]), level=f[1], name=f[2], why=WHY[f[3]], job=JOB[f[4]], easy=f[5]) for f in F],
        byHand=BY_HAND, ideas=IDEAS, start=START, endings=ENDINGS,
    )
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    return HTML.replace("__DATA__", blob).replace("__DATE__", date.today().isoformat())


# --------------------------------------------------------------------------- main
def main() -> int:
    problems = check()
    if problems:
        print("CHECKS FAILED:")
        for p in problems:
            print("  -", p)
        return 1
    (HERE / "BUILD-LADDER.md").write_text(build_ladder_md(), encoding="utf-8")
    (HERE / "FEATURES.md").write_text(build_features_md(), encoding="utf-8")
    (HERE / "FEATURE-MAP.html").write_text(build_html(), encoding="utf-8")
    counts = Counter(f[1] for f in F)
    print(f"OK: {len(F)} features, " + ", ".join(f"{lvl(n)}={counts[n]}" for n in range(6)))
    print("Checks passed: unique IDs, valid levels, easy-first references, brief coverage, Level 1 spec.")
    print("Wrote BUILD-LADDER.md, FEATURES.md, FEATURE-MAP.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
