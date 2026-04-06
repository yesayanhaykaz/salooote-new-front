# Salooote.am — Multi-Vendor E-Commerce Platform

A full-featured Next.js e-commerce platform for event planning, gifts, cakes, balloons, and more.

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## 📁 Project Structure

```
salooote-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.js           # Root layout (header, footer, cart provider)
│   │   ├── page.js             # Homepage
│   │   ├── products/page.js    # All Products page
│   │   ├── category/page.js    # Category listing (products + vendors)
│   │   ├── vendor/page.js      # Vendor storefront (products, about, reviews)
│   │   ├── product/page.js     # Product detail page
│   │   ├── cart/page.js        # Shopping cart
│   │   └── payment/page.js     # Payment / checkout
│   ├── components/             # Reusable components
│   │   ├── Header.js           # Sticky header with nav
│   │   ├── Footer.js           # Site footer with newsletter
│   │   └── ProductCard.js      # Product card component
│   ├── lib/                    # Utilities & context
│   │   ├── data.js             # Shared data constants
│   │   └── cart-context.js     # Cart state management (React Context)
│   └── styles/
│       └── globals.css         # Global styles + Tailwind
├── tailwind.config.js
├── next.config.js
├── package.json
└── README.md
```

## 📄 Pages

| Route       | Page                | Description                                         |
|-------------|---------------------|-----------------------------------------------------|
| `/`         | Homepage            | Hero, categories, product tabs, testimonials, CTA   |
| `/products` | All Products        | Event types, categories, section-based listings     |
| `/category` | Category            | Filters sidebar, products/vendors toggle            |
| `/vendor`   | Vendor Storefront   | Banner, tabs, reviews/location/gallery modals       |
| `/product`  | Product Detail      | Image gallery, add-ons, reviews, related products   |
| `/cart`     | Cart                | Items, quantity controls, order summary              |
| `/payment`  | Payment             | Credit card form, order summary, pay now             |

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **React 18** with Hooks
- **Tailwind CSS** for styling
- **React Context** for cart state management

## 🎨 Design System

- **Primary:** `#7B2FF2` (Purple)
- **Accent:** `#D63384` (Pink)
- **Gold:** `#f5a623`
- **Fonts:** DM Sans (body), Playfair Display (headings)

## 📝 Notes

- Emoji placeholders are used for product/vendor images — replace with real images
- Cart state is managed via React Context and persists during the session
- All pages are client-side rendered (`"use client"`) for interactivity
- Responsive design foundations are in place but mobile optimization can be enhanced
