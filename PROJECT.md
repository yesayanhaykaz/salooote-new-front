# Salooote.am — Project Architecture Reference

> Paste this file at the start of any new conversation so Claude has full context without reading every file.
> GitHub: https://github.com/yesayanhaykaz/salooote-new-front
> Production: https://salooote.am (Next.js behind nginx reverse proxy on port 3001)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14.2 — App Router |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React 0.263 |
| Language | JavaScript (no TypeScript) |
| Deploy | Node.js `next start` behind nginx (port 3001) |

---

## Folder Structure

```
src/
├── app/
│   ├── layout.js                  # Root layout — minimal HTML shell only (html, body, globals.css). NO providers/header/footer here
│   ├── page.js                    # redirect("/en")
│   ├── robots.js                  # Next.js metadata robots
│   ├── sitemap.js                 # Next.js metadata sitemap (all routes × 3 locales)
│   ├── [lang]/                    # i18n routing — all real pages live here
│   │   ├── layout.js              # Lang layout: DictionaryProvider > CartProvider > ScrollProgress > Header > main > Footer > JSON-LD
│   │   ├── page.js                # Home → renders HomePageClient
│   │   ├── blog/
│   │   │   ├── page.js            # Blog listing → renders BlogClient
│   │   │   └── [slug]/page.js     # Blog post → renders BlogPostClient
│   │   ├── products/page.js       # → ProductsPageClient
│   │   ├── product/page.js        # Single product page
│   │   ├── category/page.js       # Category page
│   │   ├── vendor/page.js         # Vendor profile
│   │   ├── vendor/catalog/page.js # Vendor catalog
│   │   ├── vendor-service/page.js # Vendor service detail
│   │   ├── cart/page.js           # Cart
│   │   ├── login/page.js          # → LoginPageClient
│   │   ├── signup/page.js         # → SignupPageClient
│   │   ├── payment/page.js        # Checkout/payment
│   │   ├── reviews/page.js        # Reviews
│   │   ├── about/page.js          # Our Story → AboutPageClient
│   │   ├── careers/page.js        # Careers (inline, no hooks)
│   │   ├── press/page.js          # Press (inline, no hooks)
│   │   ├── blog/page.js           # Blog listing
│   │   ├── contact/page.js        # → ContactPageClient
│   │   ├── faq/page.js            # → FAQPageClient
│   │   ├── help/page.js           # → HelpPageClient
│   │   ├── track-order/page.js    # → TrackOrderPageClient
│   │   ├── returns/page.js        # Return Policy (inline, no hooks)
│   │   ├── partner-policy/page.js # Partner Policy (inline, no hooks)
│   │   ├── apply/page.js          # → ApplyPageClient (3-step wizard)
│   │   └── vendor-resources/page.js # Vendor Resources (inline, no hooks)
│   │
│   └── [legacy routes]            # Old non-[lang] pages still exist (app/login, app/products etc)
│                                  # These are NOT used — middleware redirects to /[lang]/...
│
├── components/
│   ├── Header.js                  # "use client" — sticky header, logo (logo.png), search, cart, LanguageSwitcher, mobile drawer + bottom nav
│   ├── Footer.js                  # "use client" — dark footer, 4 columns with real links, newsletter, socials, payment badges
│   ├── ScrollProgress.js          # "use client" — brand gradient progress bar at page top (useScroll + useSpring)
│   ├── ScrollReveal.js            # "use client" — NAMED EXPORTS: { ScrollReveal }, { StaggerContainer }, { StaggerItem }
│   ├── CountUp.js                 # default export — animated number counter triggered by useInView
│   ├── MagneticButton.js          # default export — spring-physics cursor-following button wrapper
│   ├── LanguageSwitcher.js        # "use client" — flag+code pill, animated dropdown, sets NEXT_LOCALE cookie
│   ├── JsonLd.js                  # Server-safe — OrganizationJsonLd, WebsiteJsonLd, LocalBusinessJsonLd, ProductJsonLd, BreadcrumbJsonLd
│   ├── ProductCard.js             # "use client" — 3D tilt card, wishlist toggle, add to cart
│   ├── ProductPopup.js            # "use client" — quick view modal
│   ├── HomePageClient.js          # "use client" — full homepage: parallax hero, category cards, product tabs, testimonials, AI planner, partner form
│   ├── ProductsPageClient.js      # "use client" — products listing with filters
│   ├── LoginPageClient.js         # "use client" — login form with Google/Facebook
│   ├── SignupPageClient.js        # "use client" — signup form with password strength meter
│   ├── BlogClient.js              # "use client" — blog listing with filter tabs + animated grid
│   ├── BlogPostClient.js          # "use client" — blog post with sidebar, newsletter CTA, related posts
│   ├── AboutPageClient.js         # "use client" — Our Story page with CountUp stats + timeline
│   ├── ApplyPageClient.js         # "use client" — 3-step vendor application wizard
│   ├── ContactPageClient.js       # "use client" — contact form + info cards
│   ├── FAQPageClient.js           # "use client" — tabbed FAQ accordion
│   ├── HelpPageClient.js          # "use client" — help center with topic cards + FAQ accordion
│   └── TrackOrderPageClient.js    # "use client" — order tracking form + status timeline
│
├── lib/
│   ├── getDictionary.js           # getDictionary(locale), LOCALES, DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_FLAGS
│   ├── DictionaryContext.js       # DictionaryProvider + useDictionary() hook
│   ├── cart-context.js            # CartProvider + useCart() hook — cartItems, addToCart, removeFromCart, updateQty, cartCount, cartTotal
│   ├── data.js                    # PRODUCTS[], VENDORS[], CATEGORIES[], REVIEWS[], TESTIMONIALS[]
│   └── blogPosts.js               # BLOG_POSTS[] — 6 sample posts (slug, title, excerpt, content, category, author, date, readTime, image, featured)
│
├── dictionaries/
│   ├── en.json                    # ~150 keys: meta, nav, hero, trust, categories, trending, about, aiPlanner, testimonials, destinations, partner, footer, product, vendor, auth, cart
│   ├── hy.json                    # Armenian translations (same structure)
│   └── ru.json                    # Russian translations (same structure)
│
├── styles/
│   └── globals.css                # Tailwind directives + custom: .gradient-text-animated, .mesh-bg, .card-glow-strong, .noise, .spotlight, .scroll-progress, .glass-strong, .hide-scrollbar, .mobile-bottom-nav
│
└── middleware.js                  # Locale detection: NEXT_LOCALE cookie → Accept-Language header → "en". Redirects /path → /en/path. Reads x-forwarded-host/proto for correct redirect behind nginx proxy.
```

---

## Design System (Tailwind tokens)

### Brand colors (rose)
```
brand-50   #fff5f7    (very light pink bg)
brand-100  #ffe4ec    (light pink)
brand-500  #f43f7a    (medium rose)
brand-600  #e11d5c    (PRIMARY — buttons, accents, links)
brand-700  #be1850    (hover state)
```

### Surface (grays)
```
surface-50   #f9fafb   (page backgrounds)
surface-100  #f3f4f6   (card backgrounds)
surface-200  #e5e7eb   (borders)
surface-400  #9ca3af   (placeholder/muted text)
surface-500  #6b7280   (secondary text)
surface-700  #374151   (body text)
surface-900  #111827   (headings, footer bg)
```

### Layout
```
max-w-container = 1200px
px-4 md:px-8 = standard horizontal padding
```

### Key class patterns
- Buttons primary: `bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4 py-2 font-semibold`
- Cards: `bg-white border border-surface-100 rounded-2xl`
- Section headers: `text-3xl font-bold text-surface-900`
- Muted text: `text-surface-400 text-sm`
- Focus ring: `focus:border-brand-500 focus:ring-2 focus:ring-brand-100`

---

## i18n Architecture

- **Routing:** `src/app/[lang]/` segment — URLs are `/en/`, `/hy/`, `/ru/`
- **Locales:** `en` (English), `hy` (Armenian), `ru` (Russian)
- **Middleware** (`src/middleware.js`): intercepts bare `/path` → redirects to `/en/path`. Reads `NEXT_LOCALE` cookie first, then `Accept-Language` header. Behind nginx, reads `x-forwarded-host` + `x-forwarded-proto` headers.
- **Dictionary loading:** Server components call `getDictionary(lang)` → returns JSON object. Passed to `DictionaryProvider`. Client components read via `useDictionary()`.
- **Pattern for all [lang] pages:**
  ```js
  // Server page wrapper (no "use client")
  export function generateStaticParams() { return [{lang:"en"},{lang:"hy"},{lang:"ru"}] }
  export async function generateMetadata({ params }) { ... }
  export default async function Page({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <ClientComponent dict={dict} lang={lang} />;
  }
  ```
- **IMPORTANT:** Never put `"use client"` and `generateStaticParams` in the same file. Always split into server page + client component.

---

## Framer Motion Patterns Used

```js
// Named exports from ScrollReveal.js
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";
// ScrollReveal wraps any section for fade-in on scroll
// StaggerContainer + StaggerItem for staggered grid animations

// variants available: fadeUp, fadeIn, scaleUp, slideLeft, slideRight

// 3D tilt on ProductCard
const mouseX = useMotionValue(0);
const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
style={{ perspective: "900px" }} on parent, style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} on card

// Tab pill sliding indicator
<AnimatePresence>
  {activeTab === tab && <motion.div layoutId="tab-pill" ... />}
</AnimatePresence>

// Scroll progress bar
const { scrollYProgress } = useScroll();
const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
```

---

## SEO Setup

- `src/app/sitemap.js` — generates all routes × 3 locales with `alternates.languages`
- `src/app/robots.js` — allows all, disallows `/api/` and `/admin/`
- `src/components/JsonLd.js` — 5 schema types:
  - `OrganizationJsonLd` — company info
  - `WebsiteJsonLd` — with SearchAction
  - `LocalBusinessJsonLd` — Yerevan location
  - `ProductJsonLd({ product })` — product schema
  - `BreadcrumbJsonLd({ items })` — breadcrumb schema
- Every `[lang]` page has `generateMetadata` with: title, description, OG (title/desc/url/image/locale), Twitter card, `alternates.canonical` + `alternates.languages`
- `metadataBase: new URL("https://salooote.am")` set in `[lang]/layout.js`

---

## Key Rules & Gotchas

1. **ScrollReveal is a NAMED export:** `import { ScrollReveal } from "@/components/ScrollReveal"` — NOT default import
2. **CountUp is a DEFAULT export:** `import CountUp from "@/components/CountUp"`
3. **All internal links must be `/{lang}/...`** — never hardcode `/products`, always `/${lang}/products`
4. **Footer and Header both accept `lang` prop** — passed from `[lang]/layout.js`
5. **No "use client" + generateStaticParams in same file** — always split
6. **`[lang]/layout.js` must NOT have `<html>/<body>`** — root `layout.js` handles that
7. **Behind nginx:** middleware reads `x-forwarded-host` and `x-forwarded-proto` headers for correct redirect. Nginx must set: `proxy_set_header X-Forwarded-Host $host; proxy_set_header X-Forwarded-Proto $scheme;`
8. **Logo:** `/public/images/logo.png` — used in Header via `<Image>` component

---

## All Routes (107 static pages = 35 routes × 3 langs + a few extras)

```
/[lang]/                    Home
/[lang]/products            Products listing
/[lang]/product             Single product
/[lang]/category            Category browse
/[lang]/vendor              Vendor profile
/[lang]/vendor/catalog      Vendor catalog
/[lang]/vendor-service      Vendor service detail
/[lang]/cart                Shopping cart
/[lang]/login               Login
/[lang]/signup              Sign up
/[lang]/payment             Checkout
/[lang]/reviews             Reviews
/[lang]/blog                Blog listing
/[lang]/blog/[slug]         Blog post (6 posts × 3 langs = 18 routes)
/[lang]/about               Our Story
/[lang]/careers             Careers
/[lang]/press               Press & Media
/[lang]/contact             Contact Us
/[lang]/faq                 FAQ
/[lang]/help                Help Center
/[lang]/track-order         Track Order
/[lang]/returns             Return Policy
/[lang]/partner-policy      Partner Policy
/[lang]/apply               Apply as Vendor
/[lang]/vendor-resources    Vendor Resources
```

---

## Images in /public/images/

```
logo.png              — brand logo (used in Header)
hero-dj.jpg           — hero section background
cupcakes.jpg          — products hero
wedding-cake.jpg      — wedding cake product
wedding-cake2.jpg     — wedding cake variant
wedding-arch-beach.jpg
wedding-beach.jpg
wedding-ceremony.jpg
wedding-dance.jpg
flowers-roses.jpg
catering-buffet.jpg
catering-setup.jpg
event-dinner.jpg
cookies-box.jpg
cookies-box2.jpg
balloons-blue.jpg
party-balloons.jpg
party-balloons2.jpg
party-hats.jpg
vendor-woman.jpg
```

---

## Git / GitHub

- Repo: `https://github.com/yesayanhaykaz/salooote-new-front`
- Branch: `main`
- Git user: `h.yesayan`
