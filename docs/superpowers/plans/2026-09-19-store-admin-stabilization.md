# PILAR Storefront and Admin Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the PILAR public store and admin panel consistent, secure, live-synchronized, and verifiably reliable without changing the approved visual design.

**Architecture:** Supabase remains the single source of truth. Public pages load all operational settings from `public.settings`; Supabase Realtime propagates product, image, category, inventory, and settings changes; the admin refresh control performs a real database reload. Data-integrity and security fixes are applied in PostgreSQL, while focused browser-side modules keep UI behavior isolated.

**Tech Stack:** Static HTML/CSS/ES modules, supabase-js v2, Supabase Postgres/Auth/Storage/Realtime, Cloudflare Pages, GitHub Actions.

**Spec:** User request in chat on 2026-09-19: exhaustive functional and synchronization repair of storefront and admin.

## Global Constraints
- Keep the approved PILAR visual design and hero unchanged.
- Do not restore the public Android/PWA install button.
- Supabase remains the authoritative store for products, stock, images, categories, sales and settings.
- Public clients may only read public catalog/configuration data.
- Only authenticated administrators may mutate catalog, inventory, images, categories or settings.
- Production URL is `https://pilar-relojes.pages.dev`.

## Review Focus
- A customer with the catalog already open sees a product/price/stock/visibility/image/settings change without manual refresh.
- An admin editing a product is not kicked out of the modal by an unrelated realtime event.
- An out-of-stock product cannot be presented as available in product detail.
- Store configuration values never silently fall back to stale hard-coded WhatsApp/location/hours when valid database settings exist.
- Realtime and SECURITY DEFINER changes do not weaken RLS or anonymous read boundaries.

---

### Task 1: Database security and Realtime publication
**Files:** Supabase schema/migration state.

- [ ] Write and run a verification query that currently fails the desired contract: five operational tables in `supabase_realtime`, no anonymous execution of inventory mutation, fixed function search paths.
- [ ] Apply one reviewed migration that publishes `products`, `product_images`, `categories`, `settings`, and `inventory_movements`; makes `adjust_inventory` SECURITY INVOKER; moves admin-role checking to a private helper; revokes direct trigger-function execution; fixes slug-function search_path; adds the missing inventory creator index.
- [ ] Re-run database verification and Supabase security/performance advisors.
- [ ] Verify authenticated admin inventory RPC works in a rolled-back transaction and anonymous mutation does not.

### Task 2: Store settings and product truth
**Files:**
- Create: `storefront-state.js`
- Modify: `storefront.js`
- Modify: `store-pro.js`

- [ ] Write failing tests for settings normalization, WhatsApp formatting, stock labels and dynamic public-store contract.
- [ ] Implement pure state helpers.
- [ ] Load `settings` before rendering public pages and use database-backed WhatsApp, location, hours, delivery/shipping and stock-display settings everywhere.
- [ ] Put real stock on product/detail DOM and remove heuristic availability logic.
- [ ] Add explicit loading/error fallback that preserves browsing if the settings row is temporarily unavailable.

### Task 3: Realtime synchronization
**Files:**
- Create: `storefront-realtime.js`
- Create: `admin-realtime.js`
- Modify: `router.js`

- [ ] Write failing source-contract tests for all required realtime table subscriptions and router integration.
- [ ] Public store: debounce database events and refresh current route data automatically.
- [ ] Admin: refresh the current tab automatically when no edit modal is open; defer refresh while an edit modal is active and apply immediately after it closes.
- [ ] Report subscription failures in the console without breaking browsing/editing.

### Task 4: Admin correctness and validation
**Files:**
- Modify: `admin-v2.js`
- Modify: `admin-product-save-v2.js`

- [ ] Make “Actualizar” perform a real database reload.
- [ ] Add previous-price editing and validate offer pricing.
- [ ] Validate non-negative price/stock, low-stock threshold >= 1 and required product identity fields.
- [ ] Make settings panel manage hours, delivery text and shipping text already present in the database.
- [ ] Ensure image primary/delete operations surface errors and refresh from database after success.

### Task 5: SEO and stale platform references
**Files:**
- Modify: `store-seo.js`
- Modify: `robots.txt`
- Modify: `api/sitemap.js`
- Modify: `functions/api/sitemap.js` if needed.

- [ ] Write failing checks for stale `pilar-relojes.vercel.app` references.
- [ ] Use the Cloudflare production origin for canonical, Open Graph, JSON-LD, robots and sitemap.
- [ ] Verify product metadata continues to use live product/image/stock values.

### Task 6: Safe data cleanup and regression coverage
**Files:**
- Modify: `.github/workflows/feature-check.yml`
- Create: `tests/storefront-admin-sync.mjs`

- [ ] Correct only unambiguous gender mistakes inferred from explicit product names (“Varón/Varonil” => `varon`); do not guess unknown classifications.
- [ ] Delete only truly orphaned image rows whose parent product no longer exists; keep images belonging to soft-deleted products unless intentionally purged.
- [ ] Add regression checks for realtime wiring, dynamic settings, real stock, Cloudflare SEO and removal of the public install CTA.
- [ ] Run every repository `tests/*.mjs` check plus syntax checks on changed JavaScript.
- [ ] Perform final Supabase advisor/database integrity verification and document any external/manual-only setting that cannot be changed through available APIs.
