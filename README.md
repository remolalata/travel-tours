# Travel & Tours Website

Marketing website for **Travel & Tours** built with **Next.js (App Router)**.

## Stack

- Next.js 16
- React 19
- Swiper (carousels)
- AOS (scroll animations)
- Bootstrap 5
- Google Maps (`@react-google-maps/api`)

## Main Pages

- `/` -> Homepage (hero search, featured sections, testimonials, FAQ, promo CTA)
- `/tours` -> Tour listing page (cards + filters + map)
- `/tour/[id]` -> Dynamic tour details page
- `/contact` -> Contact page with map, locations, and form

## Key Features

- Global header/footer layout
- Floating chat/contact group (Messenger, WhatsApp, Viber)
- First-time visitor promo modal (shows once, after 5 seconds)
- Scroll-to-top control
- Shared FAQ component used on homepage and tour detail pages
- Basic accessibility improvements for icon-only buttons

## First-Time Promo Logic

- Hook: `components/common/hooks/useFirstVisitPromo.js`
- Modal: `components/common/FirstVisitPromoModal.jsx`
- Storage key: `travel-tours:first-visit-promo-seen`
- Behavior: opens after 5 seconds for first-time visitors only

To test it again in browser devtools:

```js
localStorage.removeItem('travel-tours:first-visit-promo-seen');
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required public variables (used by floating chat buttons):

- `NEXT_PUBLIC_FB_PAGE_ID`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_VIBER_NUMBER`
- `NEXT_PUBLIC_SITE_URL` (for canonical URLs, `robots.txt`, and sitemap)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open:

`http://localhost:3000`

## Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix lint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting

## Content/Data Sources

Primary static content lives in:

- `data/tours.js`
- `data/tourSingleContent.js`
- `data/destinations.js`
- `data/testimonials.js`
- `data/tourFilteringOptions.js`

Homepage composition:

- `app/(homes)/home-1/page.jsx`

Tour detail composition:

- `components/tourSingle/pages/TourDetailsContent.jsx`

## Deployment

Standard Next.js deployment flow:

```bash
npm run build
npm run start
```

Can be deployed to Vercel or any Node-compatible hosting platform.
