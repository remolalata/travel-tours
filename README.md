# Travel & Tours

Travel booking and marketing platform built with Next.js App Router, React 19, Supabase, and PayMongo.

## Current Status

Audit date: 2026-03-12

Verified checks:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Current result: all three checks pass.

## Audit Summary

The app is in a workable state for development, but there are a few important production risks:

1. Admin route protection is incomplete.
   `proxy.ts` only checks whether a user is signed in before allowing `/admin` access. It does not verify that the user has the `admin` role. Database RLS reduces the blast radius, but the route-level authorization is still too weak.

2. Public FAQ content is rendered as raw HTML.
   `components/common/accordion/AppFaqAccordion.tsx` renders `item.answer` with `dangerouslySetInnerHTML`, and `services/faqs/mutations/faqApi.ts` stores FAQ answers without sanitizing them. If unsafe markup reaches the database, it can be served back to users.

3. Dynamic tour URLs are missing from the sitemap.
   `app/sitemap.ts` filters tours with `is_active`, but the schema in `supabase/migrations/20260220230700_create_tours.sql` uses `status`. In practice this means tour detail pages can be omitted from the sitemap.

4. Regression coverage is missing.
   There is no test suite in the repository right now, so confidence depends on linting, type-checking, and manual validation.

## Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- TanStack Query
- PayMongo
- Bootstrap 5
- MUI Data Grid / Date Pickers
- Swiper
- Framer Motion

## Product Surface

- Public marketing pages
- Tour listing and dynamic tour detail pages
- Authentication and profile management
- Quote request flow
- Customer bookings area
- Admin dashboard, tours, bookings, destinations, FAQ/help center, and quotes inbox
- PayMongo checkout, return, and webhook handlers

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Public variables:

- `NEXT_PUBLIC_FB_PAGE_ID`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_VIBER_NUMBER`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Server-only variables:

- `NEXT_SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PAYMONGO_SECRET_KEY`
- `NEXT_PAYMONGO_WEBHOOK_SECRET`
- `PAYMONGO_API_BASE_URL` (optional override, defaults to `https://api.paymongo.com/v1`)

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` starts the local dev server
- `npm run build` builds the production app
- `npm run start` serves the production build
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting
- `npm run check` runs lint plus type-check
- `npm run lint:fix` auto-fixes lint issues
- `npm run format` formats the repo with Prettier
- `npm run format:check` checks formatting

## Supabase

Schema and seed data live under [`supabase/migrations`](/Users/remolalata/Workspace/travel-tours/supabase/migrations).

Recommended workflow:

```bash
npx supabase init
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Useful reset commands:

```bash
npx supabase db reset
npx supabase db reset --linked
```

`db reset --linked` is destructive and should only be used intentionally.

## Deployment Notes

- `NEXT_PUBLIC_SITE_URL` should be set correctly for canonical URLs, `robots.txt`, and `sitemap.xml`.
- Payments are only enabled on the tour detail page when both `NEXT_PAYMONGO_SECRET_KEY` and `NEXT_PAYMONGO_WEBHOOK_SECRET` are present.
- Supabase storage is used for profile photos and tour photos.

## Recommended Next Fixes

1. Enforce admin role checks in `proxy.ts` and on any server-side admin entry points.
2. Sanitize FAQ rich text before storage or before render.
3. Fix `app/sitemap.ts` to query the real tour status field.
4. Add at least smoke tests for auth, booking checkout, admin access, and sitemap generation.
