# Salooote Frontend — CLAUDE.md

> Public-facing site for Salooote.am — Armenia's event-planning marketplace.
> Customers browse vendors / products / events, plan with the AI assistant
> (Sali), and place orders. Sister projects: `salooote-admin` (port 3001,
> admin + vendor + user portals) and `salooote-back` (Go API).

---

## Stack

| Layer       | Tech                                        |
|-------------|---------------------------------------------|
| Framework   | Next.js 14.2 — App Router                   |
| Styling     | Tailwind CSS 3                              |
| Animation   | Framer Motion 12                            |
| Icons       | Lucide React                                |
| Language    | JavaScript (no TypeScript)                  |
| i18n        | App Router `[lang]` segment, custom dict    |
| Auth        | Bearer tokens in `localStorage`, refresh    |

```bash
npm run dev    # http://localhost:3000
npm run build  # next build
npm run start  # next start
npm run lint   # next lint
```

`NEXT_PUBLIC_API_URL` overrides the backend base (default `http://localhost:8080/api/v1`).

---

## i18n model

Three locales: **`en` / `hy` / `ru`**. Flow:

1. **`src/middleware.js`** — every incoming URL without a locale prefix is
   redirected to `/<locale>/...` based on `NEXT_LOCALE` cookie → `Accept-Language`
   → fallback `en`.
2. **`src/app/[lang]/layout.js`** — root layout reads `params.lang`, loads the
   dictionary, wraps children in `DictionaryContext`.
3. **`src/lib/getDictionary.js`** — async loader that imports
   `src/dictionaries/{en,hy,ru}.json` on demand.
4. **`generateStaticParams()`** is always `[{ lang: "en" }, { lang: "hy" }, { lang: "ru" }]`
   on every page that ships SSG.

### Local T-table pattern (preferred over central dict)

For most components, **don't add to `dictionaries/*.json`** — those files are
huge and noisy. Instead, define a small `T` constant at the top of the
component:

```js
const T = {
  en: { title: "Hello", cta: "Buy now" },
  hy: { title: "Բարև",  cta: "Գնել" },
  ru: { title: "Привет", cta: "Купить" },
};

export default function Thing({ lang }) {
  const t = T[lang] || T.en;
  return <h1>{t.title}</h1>;
}
```

Use the central dictionary only for shared UI (header nav, footer links,
hero copy that's referenced from many places).

### Locale-aware product/category names

Backend returns `{ name, translations: [{ locale, name, description, ... }] }`.
Helper used everywhere:

```js
function getLocName(item, locale) {
  if (!item) return "";
  if (locale === "en") return item.name || "";
  const tr = (item.translations || []).find(t => t.locale === locale);
  return tr?.name || item.name || "";
}
```

---

## Folder structure

```
src/
├── app/
│   ├── layout.js, page.js          # Root shell + redirect to /[lang]
│   ├── middleware.js               # Locale redirect (in src/, not app/)
│   ├── robots.js, sitemap.js       # SEO routes
│   │
│   ├── [lang]/                     # All localized pages
│   │   ├── layout.js               # Header + Footer + DictionaryContext + AIAssistantV2Client
│   │   ├── page.js                 # Homepage (renders AIAssistantV2Client landing)
│   │   ├── about, faq, help, ...   # Static pages (each: server wrapper + client component)
│   │   ├── account/                # User account (logged-in)
│   │   │   ├── orders, inquiries, reviews, saved, settings, ...
│   │   ├── cart, checkout          # Cart + checkout flow
│   │   ├── category/[slug]/[subslug]  # Category browse, multi-level
│   │   ├── events, events/[type]   # Event types (wedding, birthday, etc.)
│   │   ├── login, signup, forgot-password
│   │   ├── product/[id]            # Product page (UUID-based fallback)
│   │   ├── products                # Catalog
│   │   ├── vendor, vendor/[slug], vendor/[slug]/product/[productSlug]
│   │   ├── [vendor]/[product]      # Vendor-scoped slug-based product page
│   │   └── planner                 # AI planner full-page
│   │
│   ├── cart/page.js                # Shared cart client (rendered from [lang]/cart)
│   ├── category/page.js            # Shared category client (rendered from [lang]/category/[slug])
│   └── api/                        # Next.js API routes (proxies / SSR helpers)
│
├── components/                     # All "use client" components
│   ├── Header.js                   # Top nav with mega-search dropdown + user menu
│   ├── Footer.js                   # Site footer
│   ├── HomePageClient.js           # Legacy homepage (mostly unused)
│   ├── AIAssistantV2Client.js      # **MAIN** AI landing + chat (~3000 lines)
│   ├── ProductCard.js              # Reusable product card (used everywhere)
│   ├── ProductsPageClient.js       # /products list page
│   ├── LoginPageClient.js, SignupPageClient.js
│   ├── LanguageSwitcher.js         # Lang dropdown in Header
│   ├── CountUp.js, MagneticButton.js, ScrollProgress.js, ScrollReveal.js
│   └── ...PageClient.js            # One per static page (about, faq, help, apply, etc.)
│
├── dictionaries/                   # en.json, hy.json, ru.json — central i18n strings
├── lib/
│   ├── api.js                      # ALL backend calls grouped by namespace
│   ├── getDictionary.js            # Locale loader + LOCALES const
│   ├── DictionaryContext.js        # React context for dict in client components
│   ├── cart-context.js             # Cart state (localStorage backed)
│   ├── saved-context.js            # Wishlist state
│   ├── data.js                     # Static lists (categories, blog, etc.)
│   └── blogPosts.js                # Blog content
└── middleware.js                   # Locale redirect (top-level, not src/middleware)
```

### Server-wrapper / client-component pattern

Every localized page follows this two-file pattern:

```js
// src/app/[lang]/about/page.js  (server)
import AboutPageClient from "@/components/AboutPageClient";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "hy" }, { lang: "ru" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: "About — Salooote.am", alternates: { canonical: `https://salooote.am/${lang}/about` } };
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  return <AboutPageClient lang={lang} />;
}
```

```js
// src/components/AboutPageClient.js  ("use client")
"use client";
const T = { en: {...}, hy: {...}, ru: {...} };
export default function AboutPageClient({ lang = "en" }) { ... }
```

**Always** pass `lang` (and sometimes `dict`) as props from server → client.
Never call `useParams()` for `lang` if it's available as a prop — props avoid
hydration churn.

---

## Design tokens (Tailwind)

### Brand pink (primary)
```
brand-50  #fff5f7
brand-100 #ffe4ec
brand-500 #f43f7a
brand-600 #e11d5c   ← PRIMARY — buttons, accents, focus rings
brand-700 #be1850   ← hover
```

### Surface (slate-ish neutrals)
```
surface-0   #ffffff
surface-50  #f9fafb
surface-100 #f3f4f6
surface-200 #e5e7eb   ← borders
surface-400 #9ca3af   ← placeholder text
surface-500 #6b7280   ← secondary text
surface-700 #374151   ← body text
surface-900 #111827   ← headings
```

### Other palettes
- `accent-*` (orange) — secondary CTAs
- `warm-*` (amber/gold) — star ratings (`fill-warm-400 text-warm-400`)
- `sage-*` (green) — success / verified states
- `rose-*` (Tailwind default) — used in some hero gradients alongside `brand-*`

### Typography
- `font-display` → Inter / SF Pro Display fallback chain
- Use `font-display` for headings, default sans for body

### Layout helpers
- `max-w-container` — main page width container (set in `tailwind.config.js`)
- `hide-scrollbar` — utility class to hide scroll bars on overflow strips

### Common patterns
```jsx
{/* Primary button */}
<button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors">

{/* Secondary button */}
<button className="border border-surface-200 text-surface-700 hover:bg-surface-50 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors">

{/* Card */}
<div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">

{/* Section eyebrow */}
<p className="text-brand-600 text-xs font-semibold uppercase tracking-widest mb-3">
```

---

## Backend API (`src/lib/api.js`)

Single file, namespaced exports:

```js
import {
  authAPI,         // login, signup, refresh, forgotPassword, ...
  productsAPI,     // list, getById, getBySlug
  vendorsAPI,      // list, getBySlug, getById
  categoriesAPI,   // list (with locale)
  userAPI,         // profile, orders, inquiries, reviews, saved, notifications
  plannerAPI,      // AI planner chat, sessions
  isLoggedIn, getToken, getUser, saveUser, saveTokens, clearAuth,
} from "@/lib/api";
```

- All requests go through a single `request()` helper that auto-injects
  `Authorization: Bearer <token>` and **transparently retries once on 401**
  by hitting `/auth/refresh`.
- On refresh failure, `localStorage` is cleared and the user is redirected
  to `/<lang>/login?redirect=<currentPath>`.
- Tokens live in `localStorage` (`access_token`, `refresh_token`) — there's
  no SSR-side auth.

Backend response shape: `{ success: true, data: ..., pagination?: {...} }`.
`request()` returns the parsed JSON; consumers usually do `res.data`.

### Common gotchas
- Always pass `?locale=<lang>` to product/category list calls so backend can
  hydrate `translations[]` correctly.
- `productsAPI.list({ search, category, locale, limit, page })` — the
  `category` param accepts the **slug**, not UUID. The backend resolves it.
- Orders are created **per vendor** — group cart items by `vendor_id` and
  POST one order per group. See `src/app/[lang]/checkout/page.js`.
- Some legacy products lack `vendor_slug` — the slug-based product URL
  (`/<lang>/<vendor-slug>/<product-slug>`) falls back to
  `/<lang>/product/<uuid>` when missing. ProductCard handles this.

---

## Cart & checkout

- **`src/lib/cart-context.js`** — React context, localStorage-persisted.
  Exposes `cartItems`, `addToCart`, `removeFromCart`, `updateQuantity`,
  `cartTotal`, `itemsByVendor` (auto-grouped), `clearCart`, `hydrated`.
- Items are added with shape: `{ product_id, vendor_id, vendor_name, name, price, image, qty }`.
- Checkout requires `delivery_date` (min: tomorrow) and a delivery address.
- Delivery fee is **Yerevan-free, 1500 AMD elsewhere** — see
  `DELIVERY_FEES_AMD` constant in `src/app/[lang]/checkout/page.js`.

---

## AI Assistant (`AIAssistantV2Client.js`)

The single most important component. ~3000 lines, handles:

1. **Landing hero** — rotating word headline, search bar, quick chips, marquee
2. **Browse Moments grid**, Trending Now, Browse by Category, How it works
3. **Chat phase** — message list, typing dots, message blocks (product/vendor cards)
4. **History sidebar** — previous chat sessions
5. **Floating launcher (FAB)** — draggable, dismissable, hidden on `/planner`

Key state:
- `phase` — `"landing" | "chat"`
- `messages` — chat history for current session
- `chatState` — extracted event details (event_type, deadline, city, guest_count, budget, style)
- `sessionId` — current chat session UUID
- `fabPos`, `fabDismissed` — persisted FAB UX preferences

Common edits:
- **Strings** are in the giant `T` const at the top (not in dictionaries/)
- **CSS** is inline `<style jsx>` near the bottom — class prefix `v2-`
- `onAIDestination` controls FAB visibility (currently only `/planner`
  hides it; the homepage shows it)

---

## Routes — quick reference

```
/                       → middleware redirect to /<lang>
/<lang>                 Homepage (AI landing)
/<lang>/about           Static — about us
/<lang>/account/*       Logged-in account: orders, inquiries, reviews, saved, settings
/<lang>/blog, /blog/[slug]
/<lang>/cart, /checkout
/<lang>/category, /category/<slug>, /category/<slug>/<subslug>
/<lang>/contact, /faq, /help, /apply, /careers, /press
/<lang>/events, /events/<type>     # type = wedding | birthday | engagement | ...
/<lang>/login, /signup, /forgot-password
/<lang>/planner                    # AI planner full-page
/<lang>/product/<uuid>             # Fallback product page
/<lang>/products                   # Catalog with search + filters
/<lang>/<vendor-slug>              # Vendor profile
/<lang>/<vendor-slug>/<product-slug>  # Vendor-scoped product page (preferred)
/<lang>/track-order, /returns, /partner-policy, /vendor-resources
```

---

## Deployment

- **Dev**: `https://development.salooote.am` (server alias `newserver`)
  - Path: `/var/www/salooote-front`
  - Service: `salooote-front` (systemd)
- **Prod**: `https://salooote.am` (when ready)

### Standard deploy from local

```bash
cd ~/Desktop/salooote-nextjs
git add -A && git commit -m "..."
git push origin main

ssh newserver "cd /var/www/salooote-front && git pull origin main && npm run build && systemctl restart salooote-front && systemctl is-active salooote-front"
```

After every deploy, smoke-test at least one URL per locale (`/en`, `/hy`,
`/ru`) and the page you actually changed.

---

## Working agreements / gotchas

1. **Don't add to `dictionaries/*.json` for component-local strings** — use
   a local `T` table. Keeps the central dict scannable.
2. **Always pass `lang` as a prop** from server → client; never read it from
   `usePathname()` if avoidable.
3. **Product images use Next `<Image>` with `fill`** inside an
   `aspect-[4/5]` container. Do not set fixed `h-XX` heights — they crop badly.
4. **Brand color is pink (`brand-600` / `#e11d5c`)** — never use violet
   (`#7c3aed`) for primary UI. Some legacy data may have it; coerce in code.
5. **`overflow-x-clip`** on root wrappers prevents the Armenian-text
   horizontal-scroll bug (hy text is wider than en/ru).
6. **Cart-aware buttons must `e.preventDefault()`** — they sit inside
   `<Link>` wrappers in product cards.
7. **AI assistant FAB is draggable** — clicks fire only when pointer
   movement was < 4px during drag.
8. **Orders are per-vendor** — never POST a single order for a multi-vendor
   cart. Use `itemsByVendor` from cart context.
9. **`generateStaticParams` MUST return all 3 locales** on every SSG page,
   even if you forgot — or the page 404s in two of them.
10. **Auth-gated pages (account, checkout)** must guard with
    `if (!isLoggedIn()) router.replace(\`/${lang}/login?redirect=...\`)` in
    a `useEffect`.

---

## Sister projects (for context)

- **`salooote-admin`** (`/Users/yesayan/Desktop/salooote-admin`) —
  Separate Next.js project on port 3001. Admin + vendor + user portals.
  No i18n. Lives at `https://admin-dev.salooote.am`.
  Service: `salooote-admin`.
- **`salooote-back`** (`/Users/yesayan/Desktop/salooote-back`) — Go API
  (Gin + pgx + Postgres). Lives at `https://back.salooote.am/api/v1`.
  Service: `salooote-back`.

---

## When asking Claude to work on this codebase

Good prompts include:
- "translate /<page>" → expect a local T table, not dict edits
- "fix the X bug in <route>" → name the file, not just the URL
- "match the /login style" → reference an existing page as the design source
- "rebuild <component> with <pattern>" → e.g. "rebuild ProductCard with the
  new aspect-[4/5] image"

Skip prompts include:
- "make it look better" without a reference
- "translate everything" — too broad, ask for specific routes
- Anything touching `next.config.js`, `tailwind.config.js`, or `middleware.js`
  without saying so explicitly — those are config-load-bearing
