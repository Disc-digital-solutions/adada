# A second look at the idea — what to keep, what to change

**Written 13 November 2026, after reading the whole pack.** The research, the five levels and the
"easy first" rule are sound and stay. This file proposes seven changes. The first three are already
built into the website (see the end). The rest are decisions for the two of us.

---

## The one problem everything else serves

The pack says it plainly: seven sites already tried this, and they are small not for lack of
features, but because **people buy and sell inside Facebook, Instagram and WhatsApp groups.** So
every proposal below answers one question: *does it put more real ads on the site, sooner?*

---

## 1. Work with the groups, not against them

The plan treats the groups as the competitor. They are also the only place the buyers already are.
Instead of asking sellers to leave the groups, make the site **the place a group post links to.**

- A Facebook post sinks in a day and has to be reposted. A link to our ad stays, has every photo,
  shows in each reader's language, and has a WhatsApp button.
- So the habit to teach is not "post here instead". It is **"post here, then paste our text in your groups"**.
  That habit is already in the launch plan; now it is one button (built, see below).
- **Group admins** get the same tool for their group: one page listing their members' ads, with the
  group's name on it. That gives admins a reason to pin our link instead of deleting it as spam.

## 2. Make posting take no typing

Sellers have already written their ad once, for a group. Asking them to type it again is where they
give up. **Paste the group post, and the form fills itself:** price and currency (₺, TL, £, stg,
sterlin, €, $, جنيه, دولار…), city (Magosa, Gazimağusa, Famagusta, فاماغوستا…), category, and
selling or wanted (built). The slice 1 target of "under one minute on a phone" becomes "under
twenty seconds" for anyone who has posted in a group before, and that is every active seller.

## 3. Go live before the database exists

Posting is blocked until sign-in, the database and photo upload are built. The plan's own rule,
*"by hand before by code"*, removes that block:

- The form sends the finished ad to **the team's WhatsApp line**, already written out. The seller
  sends the photos in the same chat, and a person publishes the ad (built).
- "Report this ad" works the same way (built).
- Set one value, `NEXT_PUBLIC_TEAM_WHATSAPP`, and the site can take **real ads from real people this
  month.** The closed test does not have to wait for the build. Every chat is also free research:
  what people sell, what they ask, where they get stuck.

**Proposed change to the roadmap:** do the **February 2027 arrivals launch** for real, by hand, on one
campus. Do not treat it as optional. The May leaving sale then runs on a product that has already
met strangers. The database replaces the hand work when one person can no longer keep up, and that
moment is itself a good sign.

## 4. Say "students" first, "everything" later

"One app for everything in North Cyprus" is the right destination and the wrong first sentence.
Nobody searches for "everything". The pack's own facts point at one group:

- About 100,000 students against 374,275 residents aged 15 and over: roughly one person in four.
- They **arrive and leave every year**, so supply (leavers) and demand (arrivals) refill by themselves.
- They speak many languages, which is exactly where the Turkish-only sites fail.
- They are easy to reach: one campus, a few nationality groups, posters at dorm doors.

So the first promise is **"Everything a student needs on the island, in your language"**: second-hand,
rooms, roommates, dorms, arrival help. Cars, construction and towing come later, on the same site,
once students and the people serving them are there. This is ending B first, as the route to ending A.
It is not a smaller ambition; it is the order of work.

## 5. Make money from trust before visibility

Featured ads only pay once a site has traffic, and the pack's own KKTCar maths shows how small that is
here. Two sources fit the student focus and can start by hand, at Level 0:

| Source | Who pays | Why they would | First version |
|---|---|---|---|
| **Placement fee** | Dorms and landlords, per signed student | They already pay agents per student (the dorm questions in `VALIDATION-KIT.md` ask how much) | A WhatsApp intro; fee agreed in writing beforehand |
| **"Seen by us" viewing** | A student still abroad | Rental scams before each term; they cannot visit themselves | A team member films the flat on a video call, checks the landlord's ID, and gives the ad a badge |

Featured spots for businesses stay as planned at Level 2. Add one question to the supply interviews:
*"Would you pay a fixed fee per student we send you, instead of an agent's fee?"*
Add one to the student questions: *"Would you have paid £15–25 for someone to check your flat before you arrived?"*
Both amounts are guesses for the interviews to correct.

Payments still stay outside the app until Level 4: an invoice or bank transfer is enough for both.

## 6. Watch a second number

The one number stays: the share of ads that get a WhatsApp tap within 7 days. Add one beside it:
**the share of sellers who post a second ad within 30 days.** Taps say buyers came. Returning sellers
say the site was worth it, and they are the ones who tell their friends. While posting runs on
WhatsApp, both can be counted by hand from the chat.

## 7. Small things worth deciding now

- **The team's WhatsApp line is public.** Use a WhatsApp Business number that belongs to the
  company, not either of us personally, and set an away message with the hours it is answered.
- **Hand posting needs a ceiling.** Agree what "same day" means (for example, by 22:00), and when
  the queue is too long to keep that promise. That is the trigger to switch on the database.
- **Languages after the census.** If the Facebook count shows many Russian or Persian posts, add that
  language before adding categories. One more language reaches a whole community; one more category
  does not.
- **The name.** Test it on the paste-and-share text as well: it will appear in thousands of group
  posts, so it must look right next to Turkish, English and Arabic.

---

## What changed in the website

Everything below runs today. It is tested (106 automatic checks, up from 80) and was tried in a
browser in all three languages.

| Change | Where |
|---|---|
| **Paste a group post to fill the form.** Reads price and currency, city, category, selling or wanted, title and description in Turkish, English and Arabic. Drops emoji, hashtags and "SATILIK"-style labels. When unsure, leaves a field empty rather than guessing wrong. | `web/src/lib/parse-post.ts`, the post page |
| **Post through the team's WhatsApp** while the database is not connected. The ad arrives already written; photos follow in the chat. Without a team number set, the button stays off as before. | `web/src/components/PostForm.tsx` |
| **"Copy for your groups"** on every ad and shop: a ready post with one line in each language and one link that opens in each reader's language. | `web/src/lib/share-text.ts`, ad and shop pages |
| **"Report this ad"** opens WhatsApp to the team with the ad's link. | ad page |
| **Fix:** `npm run check` failed on a fresh install, because the page types are generated by Next.js. It now generates them first. | `web/package.json` |
| **Fix:** `.env.example` could be ignored by git along with real secrets. It is now always kept. | `web/.gitignore` |

To switch on the WhatsApp parts, add the company's WhatsApp number to `.env.local`:

```
NEXT_PUBLIC_TEAM_WHATSAPP=+90533XXXXXXX
```

The new Turkish and Arabic wording needs the same native read as the rest.
