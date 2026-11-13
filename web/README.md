# The website (and app)

This is the code for Level 1 of the plan. The exact scope is in `../LEVEL-1-SPEC.md`.

"Island Market" is a **working name**. It lives in one place, `src/site.config.ts`.

## Run it

In a terminal in this folder (use `npm.cmd`, because PowerShell blocks plain `npm` on this PC):

```bash
npm.cmd run dev
```

Then open http://localhost:3240. The site sends you to `/tr`, `/en` or `/ar` by your browser's language.

Other commands:

```bash
npm.cmd test
```

```bash
npm.cmd run check
```

```bash
npm.cmd run build
```

`test` runs the 80 checks of the logic. `check` runs lint, types and tests together. `build` makes the
version that would go online, and fails if a page breaks the framework's rules.

## What works today (13 Nov 2026)

Everything below runs on **sample ads**. The dark bar at the top of the site says so.

| Part | State |
|---|---|
| Three languages, with Arabic right to left | Works |
| Home: newest ads, categories that have ads | Works |
| Search: words, category, city, type, currency, price range, sort | Works |
| Ad page: photos to swipe, price tag, share, sold and removed states | Works |
| WhatsApp button | Built and tested as logic. Sample ads have no seller, so it shows a note instead of opening WhatsApp |
| Shop page with QR code | Works. The QR points at the address in `NEXT_PUBLIC_SITE_URL` |
| Safety page | Works |
| "Page does not exist" in each language | Works |
| Add to phone home screen (opens like an app) | Manifest and icons are in place. **Not yet tried on a real phone** |
| Post an ad | The form is there. **It cannot publish yet** |
| Sign in, my ads, favourites, reports, admin, tap counting | **Not built**. They need the database |

## What is needed next

A database. The plan uses Supabase (login, database, photo storage).

1. Create a new Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the two values from the project's API settings.
3. Then the next build step adds sign-in, real posting with photos, and the rest of the table above.

## How the code is laid out

| Folder | What is in it |
|---|---|
| `src/app/[lang]/` | The pages. One folder per address: `search`, `l/[id]` (an ad), `s/[slug]` (a shop), `post`, `safety` |
| `src/components/` | Pieces of pages: the ad card, the price tag, the header, the filter form |
| `src/lib/` | The logic, with a test file beside each: prices and dates (`format`), search (`listings`), WhatsApp links (`whatsapp`) |
| `src/lib/data/` | Where ads come from. `repo.ts` lists the questions pages may ask; `demo-repo.ts` answers them from sample data |
| `src/i18n/` | Languages: which exist, the words in each (`dictionaries/`), plurals |
| `src/proxy.ts` | Runs before every page: adds the language to an address that has none |
| `src/site.config.ts` | The name, the public address, the six cities |

## Rules for this code

- **Tests first.** New logic gets its test before its code. Run `npm.cmd test` and watch it fail, then make it pass.
- **Read the framework's own docs first.** This Next.js version differs from older ones. Its docs are in
  `node_modules/next/dist/docs/`. See `AGENTS.md`.
- **No money code** until Level 4.
- **No phone numbers in sample data.** A made-up number can belong to a real person.

## Things this version of Next.js does differently

Found while building; each cost a failed build to learn.

- Every page is prepared ahead of time unless it reads something only known per visit (the address's
  `?q=…`, which ad, the clock). Those parts must sit inside `<Suspense>`. That is why each page is a
  small frame plus one inner part that fetches.
- The current time is read in one place, `src/lib/now.ts`, never inside a component.
- `middleware.ts` is now called `proxy.ts`.
- `usePathname()` in the header broke the build for ad pages. The language switch reads the address at
  the moment of the click instead.
