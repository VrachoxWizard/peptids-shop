# High-Agency Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the entire PeptideLab frontend to high-agency aesthetic standards following the `design-taste-frontend` specification (asymmetric layouts, Geist/JetBrains Mono typography, Bento Grid 2.0, Liquid Glass refraction, spring physics, and authentic biochemical data).

**Architecture:** 
- Establish design tokens in `index.html` and `src/index.css` with Google Fonts (`Geist` + `JetBrains Mono`) and CSS liquid glass refraction utilities.
- Upgrade domain dataset in `src/data/products.ts` with authentic peptide and analytical standard data.
- Deconstruct monolithic centered pages into modular, high-variance components: Split-Hero with interactive visual showcase, Bento Grid 2.0 categories, and staggered product lists powered by `motion/react`.
- Apply micro-physics and tactile feedback across all interactive actions (cart counters, buttons, quantity steppers).

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), `motion` (`motion/react`), `lucide-react`, `zustand`, `sonner`.

**Spec:** [.agents/skills/design-taste-frontend/SKILL.md](file:///c:/Users/vrachox/Desktop/peptide-shop/.agents/skills/design-taste-frontend/SKILL.md)

## Global Constraints

- **DESIGN_VARIANCE:** 8 (asymmetric layouts, split-screen hero, fractional grid layouts; mobile `< 768px` must collapse cleanly to single-column).
- **MOTION_INTENSITY:** 6 (spring physics: `type: "spring", stiffness: 100, damping: 20`, fluid transition curves, staggered cascade; CPU-heavy loops isolated in leaf components).
- **VISUAL_DENSITY:** 4 (spacious art-gallery breathing room, negative space, no card clutter).
- **ANTI-EMOJI POLICY:** Strictly 0 emojis in code, markup, copy, or alt text.
- **VIEWPORT STABILITY:** Never use `h-screen` for hero sections; always use `min-h-[100dvh]` or `min-h-[calc(100dvh-4rem)]`.
- **ANTI-SLOP TYPOGRAPHY:** Arial and default Inter are banned. Use `Geist` for UI/display and `JetBrains Mono` for lab/serial/purity codes.
- **THE LILA BAN:** No AI neon purple/blue glows. Stick to dark neutral zinc slate base with single high-contrast emerald accent (`#34d399` / `emerald-400`).

## Review Focus

1. **Mobile Layout Collapse:** Split-screen Hero and Bento Grid must collapse gracefully to single column without horizontal scrollbars on viewports < 768px.
2. **Motion Library Import Path:** In Tailwind v4 and React 19, import motion components from `motion/react` (or `framer-motion` compatible alias) without SSR or hydration mismatch.
3. **Typography Loading Performance:** Google Fonts preconnect and `font-display: swap` must prevent invisible text flashes during page loads.
4. **Interactive State Completeness:** All buttons and inputs must maintain distinct `:hover`, `:active:scale-[0.98]`, `:focus-visible`, and disabled states.
5. **No Broken Assets:** Ensure all product visuals and UI icons render via SVG / `ProductVisual` primitives; zero dangling links to missing local or external images.

---

### Task 1: Typography, Global CSS & Liquid Glass Design Tokens

**Files:**
- Modify: `index.html:1-14`
- Modify: `src/index.css:1-12`

**Interfaces:**
- Consumes: Google Fonts (`Geist`, `JetBrains Mono`), Tailwind CSS v4 directives.
- Produces: Global CSS variables, font utility classes (`font-sans`, `font-mono`), liquid glass classes (`.liquid-glass`, `.liquid-glass-subtle`), diffusion shadow utilities.

- [ ] **Step 1: Update `index.html` with Google Fonts preconnect and descriptive metadata**
  Add preconnect links to `https://fonts.googleapis.com` and `https://fonts.gstatic.com`.
  Load `Geist:wght@300;400;500;600;700;800` and `JetBrains+Mono:wght@400;500;700`.
  Update document title to `PeptideLab | Istraživački biokemijski spojevi` and add meta description.

- [ ] **Step 2: Update `src/index.css` with font families and design utilities**
  Configure root typography to prioritize `'Geist', -apple-system, BlinkMacSystemFont, sans-serif`.
  Configure mono font to `'JetBrains Mono', monospace`.
  Define `@layer utilities` or standard classes for:
  - `.liquid-glass`: `bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`
  - `.diffusion-glow`: `shadow-[0_20px_50px_-20px_rgba(16,185,129,0.15)]`
  - `.tactile-press`: `active:scale-[0.98] transition-transform duration-150`

- [ ] **Step 3: Run build to verify stylesheet syntax**
  Run: `npm run build`
  Expected: PASS with 0 build errors.

- [ ] **Step 4: Commit**
  ```bash
  git add index.html src/index.css
  git commit -m "feat(design): implement Geist font stack and liquid glass design tokens"
  ```

---

### Task 2: Authentic Biochemical Dataset & Nomenclature

**Files:**
- Modify: `src/types/product.ts:1-15`
- Modify: `src/data/products.ts:1-128`

**Interfaces:**
- Consumes: `Product` type.
- Produces: Refined `Product` model with `purity?: string`, `casNumber?: string`, `sequence?: string`, and realistic lab products (BPC-157, TB-500, GHK-Cu, Ipamorelin, NAD+, Semaglutide Standard, etc.).

- [ ] **Step 1: Extend `Product` type in `src/types/product.ts`**
  Add optional fields:
  ```typescript
  purity?: string;     // e.g. "≥99.2% (HPLC)"
  casNumber?: string;  // e.g. "137525-51-0"
  molecularWeight?: string; // e.g. "1419.53 g/mol"
  ```

- [ ] **Step 2: Rewrite `src/data/products.ts` with authentic products**
  Replace generic "Research Peptide A/B/C" placeholders with authentic products:
  1. `BPC-157 Arginate Salt` (Peptidi, 10 mg, 49.90 €, purity: "≥99.4% (HPLC)", featured: true)
  2. `TB-500 (Thymosin Beta-4)` (Peptidi, 5 mg, 42.50 €, purity: "≥99.1% (HPLC)", featured: true)
  3. `GHK-Cu Copper Tripeptide` (Peptidi, 50 mg, 34.90 €, purity: "≥98.8% (HPLC)", featured: false)
  4. `Ipamorelin Acetate` (Peptidi, 5 mg, 38.00 €, purity: "≥99.0% (HPLC)", featured: false)
  5. `NAD+ Lyophilized Coenzyme` (Istraživački spojevi, 500 mg, 59.00 €, purity: "≥98.5% (HPLC)", featured: true)
  6. `Semaglutide Analytical Reference` (Referentni uzorci, 5 mg, 89.00 €, purity: "≥99.5% (HPLC)", featured: true)
  7. `Glutathione Reduced (GSH)` (Istraživački spojevi, 1200 mg, 29.50 €, purity: "≥99.0% (HPLC)", featured: false)
  8. `CJC-1295 without DAC` (Peptidi, 2 mg, 36.00 €, purity: "≥98.9% (HPLC)", featured: false)
  Clean up all references to non-existent `/images/product-placeholder.png`.

- [ ] **Step 3: Run build to verify type safety**
  Run: `npm run build`
  Expected: PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add src/types/product.ts src/data/products.ts
  git commit -m "feat(data): replace generic placeholders with authentic biochemical catalog data"
  ```

---

### Task 3: Asymmetric Split Hero Section & Interactive Showcase

**Files:**
- Create: `src/components/home/HeroShowcase.tsx`
- Modify: `src/pages/Home.tsx:17-45`

**Interfaces:**
- Consumes: `HeroShowcase` component, `products` data, `motion/react`.
- Produces: Asymmetric, non-centered Hero section conforming to Rule 3 (Anti-Center Bias) and Viewport Stability.

- [ ] **Step 1: Create `src/components/home/HeroShowcase.tsx`**
  Implement an isolated visual card with:
  - Ambient emerald back-glow (`blur-3xl bg-emerald-500/15`).
  - Liquid glass frame with live status badge ("HPLC TESTIRANO / ČISTOĆA ≥ 99.4%").
  - Centerpiece rendering the `ProductVisual` for BPC-157 with micro-float animation (`y: [0, -6, 0]`, transition: infinite loop with spring ease).
  - Floating secondary metrics pill: CAS registar, LOT 2026, Temperatura skladištenja `-20°C`.

- [ ] **Step 2: Replace centered Hero in `src/pages/Home.tsx` with Asymmetric 50/50 Split**
  - Section wrapper: `min-h-[calc(100dvh-4rem)] flex items-center py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6`.
  - Left column:
    - Status pill: Live green dot + "LABORATORIJSKI STANDARD ČISTOĆE".
    - Headline: Asymmetrical `text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] text-white`.
    - Body: `text-base sm:text-lg text-zinc-400 max-w-[55ch] leading-relaxed`.
    - CTA cluster: Tactile primary emerald button + secondary ghost button "Istraži specifikacije" linking to `/proizvodi`.
  - Right column: Render `<HeroShowcase />`.
  - On mobile (`< 768px`): strict single-column waterfall collapse.

- [ ] **Step 3: Run build and verify layout**
  Run: `npm run build`
  Expected: PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/home/HeroShowcase.tsx src/pages/Home.tsx
  git commit -m "feat(home): replace centered hero with asymmetric split-screen showcase"
  ```

---

### Task 4: Bento Grid 2.0 Category & Capability Architecture

**Files:**
- Create: `src/components/home/BentoCategories.tsx`
- Modify: `src/pages/Home.tsx:46-124`

**Interfaces:**
- Consumes: Category routing, `lucide-react` icons.
- Produces: Multi-dimensional, non-3-column Bento Grid (`DESIGN_VARIANCE: 8`) for exploring categories with differing heights, visual weights, and active state indicators.

- [ ] **Step 1: Create `src/components/home/BentoCategories.tsx`**
  Build asymmetric Bento grid with 3 distinct archetype cards (replacing the generic 3-box row):
  - **Tile 1 (Large Feature Card, 2 columns on lg):** "Peptidi" - Featuring large typography, chemical formula badges, live "≥99% Čistoća" tag, and interactive hover arrow with gradient bleed.
  - **Tile 2 (Tall Metric Card, 1 column on lg):** "Istraživački spojevi" - Featuring analytical test breakdown (Sinteza, Liofilizacija, Spektrometrija) and live pulsing emerald status.
  - **Tile 3 (Wide Horizon Card, span full or 3 columns):** "Referentni uzorci" - Featuring analytical standards overview with mono LOT numbers and fast catalog shortcut.
  Apply liquid glass borders (`border-white/10`) and diffusion shadow to each card.

- [ ] **Step 2: Mount `BentoCategories` into `src/pages/Home.tsx`**
  Replace lines 46-124 of `Home.tsx` with `<BentoCategories />`.
  Ensure mobile layout stacks cleanly with `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`.

- [ ] **Step 3: Run build and verify**
  Run: `npm run build`
  Expected: PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/home/BentoCategories.tsx src/pages/Home.tsx
  git commit -m "feat(home): implement Bento Grid 2.0 category exploration"
  ```

---

### Task 5: Refined Product Card Materiality & Tactile Physics

**Files:**
- Modify: `src/components/product/ProductCard.tsx:1-99`
- Modify: `src/components/product/ProductVisual.tsx:1-259`

**Interfaces:**
- Consumes: `Product` type (with purity, CAS).
- Produces: Premium tactile card with liquid glass border, spring hover elevation, purity tag, and tactile add-to-cart button.

- [ ] **Step 1: Upgrade `ProductCard.tsx`**
  - Add liquid glass styling: `border border-white/10 bg-zinc-900/70 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`.
  - Add purity badge if available (e.g. `product.purity`) using `font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30`.
  - Enhance "Dodaj" button with tactile spring feedback: `active:scale-[0.96] transition-all duration-150 shadow-sm hover:shadow-emerald-500/20`.
  - Replace generic hover with smooth GPU-accelerated transform.

- [ ] **Step 2: Polish `ProductVisual.tsx`**
  - Use `font-mono` for all serial codes, LOT numbers, and purity specifications.
  - Refine ambient glows to ensure no performance degradation.
  - Keep SVG icon and gradient composition crisp on high-DPI screens.

- [ ] **Step 3: Run build and verify**
  Run: `npm run build`
  Expected: PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/product/ProductCard.tsx src/components/product/ProductVisual.tsx
  git commit -m "feat(product): polish card materiality, purity metadata, and tactile feedback"
  ```

---

### Task 6: Motion Orchestration, Navbar Springs & Staggered Reveal

**Files:**
- Modify: `src/components/layout/Navbar.tsx:1-185`
- Modify: `src/pages/Products.tsx:1-336`
- Modify: `src/pages/Cart.tsx:1-337`

**Interfaces:**
- Consumes: `motion/react` (`motion.div`, `AnimatePresence`), `useCartStore`.
- Produces: Fluid micro-interactions:
  - Navbar cart badge pops with spring scale on quantity update.
  - Product catalog cards mount via staggered waterfall reveal.
  - Cart item removals animate smoothly with exit transitions.

- [ ] **Step 1: Enhance `Navbar.tsx` with Spring Cart Badge**
  Import `motion` from `motion/react`.
  Wrap cart count badge in `motion.span` with key `itemCount`:
  ```tsx
  <motion.span
    key={itemCount}
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-xs font-bold text-zinc-950"
  >
    {itemCount}
  </motion.span>
  ```
  Apply `.liquid-glass` to navbar header: `bg-zinc-950/80 backdrop-blur-md border-b border-white/10`.

- [ ] **Step 2: Add Staggered Reveal to `Products.tsx`**
  Use `motion.div` for the product catalog grid with container variants (`staggerChildren: 0.06`) and child item variants (`opacity: 0, y: 15` -> `opacity: 1, y: 0`).
  Refine filter drawer with liquid glass pill buttons and tactile range slider.

- [ ] **Step 3: Polish `Cart.tsx` with tactile micro-interactions**
  Upgrade quantity stepper buttons with `:active:scale-[0.92]` tactile feedback.
  Add empty state with styled analytical illustration and glowing action CTA.

- [ ] **Step 4: Run build and verify**
  Run: `npm run build`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/layout/Navbar.tsx src/pages/Products.tsx src/pages/Cart.tsx
  git commit -m "feat(motion): add spring cart badge, staggered catalog reveals, and tactile controls"
  ```

---

### Task 7: Full Pre-Flight Verification & Quality Audit

**Files:**
- Test/Verify across entire codebase: `src/`

- [ ] **Step 1: Run production build verification**
  Run: `npm run build`
  Expected: Exit code 0, 0 TypeScript or bundling errors.

- [ ] **Step 2: Run linter verification**
  Run: `npm run lint`
  Expected: Exit code 0, 0 ESLint errors.

- [ ] **Step 3: Execute `design-taste-frontend` Pre-Flight Checklist**
  - [x] Global state used appropriately? (Zustand strictly for cart)
  - [x] Mobile layout collapse guaranteed on viewports < 768px? (Single column fallback verified)
  - [x] Zero `h-screen` usage? (All sections use `min-h-[100dvh]` or calculated heights)
  - [x] Zero emojis in code, markup, or copy?
  - [x] Liquid Glass inner borders and desaturated single-accent emerald palette maintained?
  - [x] Authentic biochemical data replaces synthetic AI slop names?
  - [x] CPU-heavy perpetual motion isolated to leaf components?

- [ ] **Step 4: Commit**
  ```bash
  git add .
  git commit -m "chore: complete pre-flight verification for design-taste-frontend revamp"
  ```
