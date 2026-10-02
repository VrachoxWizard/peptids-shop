# Pharma Trust Blue Croatian Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the peptide shop UI using the newly installed `ui-design-system` skill to transition from neon green to an authoritative "Pharma Trust Blue" palette, embedding localized trust signals (cash on delivery, fast HR shipping, 100% discrete packaging, and Zagreb customer support) that maximize buyer confidence in Croatia.

**Architecture:** Generate design tokens with `scripts/design_token_generator.py` and integrate them into `src/styles/design-tokens.css` and `src/index.css`. Build dedicated trust components (`TopTrustBar`, `CroatiaTrustBadges`) and integrate them into the layout and pages. Update the cart and checkout experience with preferred Croatian payment methods (Pouzeće, Keks Pay, Aircash, 3D Secure) and update product cards and footer with trust credentials and badges.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React, Zustand, Vitest, Testing Library.

**Spec:** In-chat approved bounded specification for Pharma Trust Blue redesign focusing on Croatian customer confidence.

## Global Constraints

- Preserve all existing functionality (routing, cart state, multilingual switching between HR and EN).
- Use `ui-design-system` token generator (`#0284C7`, modern style) as the canonical design token source.
- Ensure all color contrasts meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
- Localization must support both Croatian (`hr`) as primary and English (`en`) as fallback.
- Strictly adhere to responsive design (mobile-first 320px up to 2xl 1536px).
- All tests must pass via `npm run test` and TypeScript check via `npm run build`.

## Review Focus

1. **Mobile Top Trust Bar Overflow**: On narrow screens (320px-375px), ensure the Top Trust Bar renders cleanly without clipping or broken layout.
2. **Cart Payment Method State**: Toggling between payment methods (Pouzeće, Keks Pay, Kartica, Virman) should update instructions and maintain state without crashing if cart is empty.
3. **Language Switch Consistency**: Switching between HR and EN in the Navbar must translate all trust badges, top bar labels, and cart reassurance cues without missing string keys.
4. **Contrast & Readability on Dark Glass**: Text elements on `liquid-glass` cards must maintain readable contrast using `text-zinc-200` / `text-white` / `text-sky-300` rather than low-contrast dark grays.
5. **ProductCard Badging**: Cards with or without purity/CAS specifications must maintain equal heights and visual alignment in the responsive grid.

---

### Task 1: Generate & Integrate Pharma Trust Blue Design Tokens

**Files:**
- Create: `src/styles/design-tokens.css`
- Modify: `src/index.css:1-51`
- Test: `src/styles/designTokens.test.ts`

**Interfaces:**
- Consumes: `.agents/skills/ui-design-system/scripts/design_token_generator.py`
- Produces: CSS custom properties (`--colors-primary-500: #0284c7`, `--colors-primary-DEFAULT: #0284C7`, `--pharma-blue-glow`, etc.)

- [ ] **Step 1: Write the failing test**

```typescript
// src/styles/designTokens.test.ts
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Pharma Trust Blue Design Tokens", () => {
  it("should have design-tokens.css generated with primary color #0284c7", () => {
    const filePath = path.resolve(__dirname, "./design-tokens.css");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("--colors-primary");
    expect(content.toLowerCase()).toContain("#0284c7");
  });

  it("should include design tokens in index.css", () => {
    const indexPath = path.resolve(__dirname, "../index.css");
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain("design-tokens.css");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/styles/designTokens.test.ts`
Expected: FAIL with missing file or assertions.

- [ ] **Step 3: Generate tokens and update CSS**

Generate tokens using:
```bash
python .agents/skills/ui-design-system/scripts/design_token_generator.py "#0284C7" --style modern --format css > src/styles/design-tokens.css
```
Update `src/index.css` to import `./styles/design-tokens.css` and adjust `.liquid-glass-card:hover` and `.diffusion-glow` to use the Pharma Trust Blue glow (`rgba(2, 132, 199, 0.25)` and `rgba(56, 189, 248, 0.3)`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/styles/designTokens.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/design-tokens.css src/index.css src/styles/designTokens.test.ts
git commit -m "feat(design): generate and integrate Pharma Trust Blue tokens"
```

---

### Task 2: Update Localization with Croatian Trust & Payment Messaging

**Files:**
- Modify: `src/i18n/translations.ts:1-404`
- Test: `src/i18n/translations.test.ts`

**Interfaces:**
- Consumes: `useTranslation` hook
- Produces: `t.trustBar`, `t.croatiaTrust`, `t.payments` dictionary objects in `hr` and `en`.

- [ ] **Step 1: Write the failing test**

```typescript
// src/i18n/translations.test.ts
import { describe, it, expect } from "vitest";
import { translations } from "./translations";

describe("Croatian Trust Translations", () => {
  it("should contain trustBar translations for HR and EN", () => {
    expect(translations.hr.trustBar).toBeDefined();
    expect(translations.hr.trustBar.shipping).toContain("24-48h");
    expect(translations.hr.trustBar.payment).toContain("pouzećem");
    expect(translations.en.trustBar).toBeDefined();
  });

  it("should contain croatiaTrust cards data in HR", () => {
    expect(translations.hr.croatiaTrust).toBeDefined();
    expect(translations.hr.croatiaTrust.title).toBeDefined();
    expect(translations.hr.croatiaTrust.codTitle).toContain("Pouzećem");
    expect(translations.hr.croatiaTrust.deliveryTitle).toContain("24-48h");
    expect(translations.hr.croatiaTrust.discreteTitle).toContain("Diskretno");
    expect(translations.hr.croatiaTrust.supportTitle).toContain("Zagreb");
  });

  it("should contain payment method options in HR", () => {
    expect(translations.hr.payments).toBeDefined();
    expect(translations.hr.payments.cod).toBeDefined();
    expect(translations.hr.payments.keks).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/i18n/translations.test.ts`
Expected: FAIL with properties undefined.

- [ ] **Step 3: Implement translation entries in `src/i18n/translations.ts`**

Add `trustBar`, `croatiaTrust`, and `payments` to both `hr` and `en` blocks in `src/i18n/translations.ts`, ensuring professional Croatian phrasing and corresponding English keys.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/i18n/translations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/i18n/translations.ts src/i18n/translations.test.ts
git commit -m "feat(i18n): add croatian trust and payment translation keys"
```

---

### Task 3: Implement Top Trust Bar Component

**Files:**
- Create: `src/components/layout/TopTrustBar.tsx`
- Modify: `src/components/layout/Navbar.tsx:25-35`
- Test: `src/components/layout/TopTrustBar.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`
- Produces: `<TopTrustBar />` component mounted directly above `<header>` in `Navbar.tsx` or `App.tsx`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/layout/TopTrustBar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TopTrustBar from "./TopTrustBar";

describe("TopTrustBar Component", () => {
  it("renders key trust indicators", () => {
    render(<TopTrustBar />);
    expect(screen.getByText(/24-48h/i)).toBeInTheDocument();
    expect(screen.getByText(/pouzećem/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/components/layout/TopTrustBar.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `TopTrustBar.tsx` and mount in `Navbar.tsx`**

Create `src/components/layout/TopTrustBar.tsx`:
- Thin banner with `bg-zinc-900/90 border-b border-white/5 text-xs text-zinc-300 py-1.5`.
- Contains 4 key indicators with Lucide icons (`Truck`, `Banknote`, `PackageCheck`, `Headphones`).
- Uses responsive scrolling or marquee on mobile (`overflow-x-auto` or flex wrap) so small screens don't wrap awkwardly.
- Update `Navbar.tsx` to render `<TopTrustBar />` at the top of the header.
- Update `Navbar.tsx` brand styling from emerald to `text-sky-400`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/components/layout/TopTrustBar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/TopTrustBar.tsx src/components/layout/Navbar.tsx src/components/layout/TopTrustBar.test.tsx
git commit -m "feat(ui): add TopTrustBar component to layout"
```

---

### Task 4: Implement Croatia Trust Badges Grid on Home Page

**Files:**
- Create: `src/components/home/CroatiaTrustBadges.tsx`
- Modify: `src/pages/Home.tsx:100-110`
- Test: `src/components/home/CroatiaTrustBadges.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`, `src/styles/design-tokens.css`
- Produces: `<CroatiaTrustBadges />` component rendered on the homepage.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/CroatiaTrustBadges.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CroatiaTrustBadges from "./CroatiaTrustBadges";

describe("CroatiaTrustBadges Component", () => {
  it("renders 4 pillars of Croatian buyer trust", () => {
    render(<CroatiaTrustBadges />);
    expect(screen.getByTestId("trust-badge-cod")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-delivery")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-discrete")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-support")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/components/home/CroatiaTrustBadges.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `CroatiaTrustBadges.tsx` and integrate into `Home.tsx`**

Create `src/components/home/CroatiaTrustBadges.tsx`:
- Render 4 cards inside a responsive 1-col (mobile) to 4-col (desktop) grid with `liquid-glass-card` styling and subtle blue glow.
- Pillar 1 (`trust-badge-cod`): **Plaćanje pouzećem i Keks Pay** (Mogućnost plaćanja gotovinom ili karticom pri preuzimanju; bez kartičnog stresa).
- Pillar 2 (`trust-badge-delivery`): **Brza isporuka u RH 24-48h** (GLS / DPD / Paketomati; skladišteno u EU/RH bez carinskih kašnjenja).
- Pillar 3 (`trust-badge-discrete`): **100% Diskretno termo-pakiranje** (Neutralne kutije bez vanjskih oznaka; zaštićeno od topline).
- Pillar 4 (`trust-badge-support`): **Korisnička podrška Zagreb** (Dostupni radnim danom putem WhatsAppa i telefona).
- Mount `<CroatiaTrustBadges />` between Hero section and BentoCategories in `src/pages/Home.tsx`.
- Update `Home.tsx` theme accents from emerald to Pharma Trust Blue (`text-sky-400`, `bg-sky-400`, `border-sky-500/30`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/components/home/CroatiaTrustBadges.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/home/CroatiaTrustBadges.tsx src/pages/Home.tsx src/components/home/CroatiaTrustBadges.test.tsx
git commit -m "feat(ui): add CroatiaTrustBadges section to homepage"
```

---

### Task 5: Update Visuals & Badges on ProductCard and Catalog

**Files:**
- Modify: `src/components/product/ProductCard.tsx:35-125`
- Modify: `src/components/home/HeroShowcase.tsx:1-120`
- Modify: `src/pages/Products.tsx:1-150`
- Test: `src/components/product/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `Product` type, `useTranslation()`
- Produces: Updated `<ProductCard />` with Pharma Blue tokens and local stock / delivery badge.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/product/ProductCard.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";

describe("ProductCard Component", () => {
  it("renders Croatian trust badge for local stock & delivery", () => {
    render(
      <MemoryRouter>
        <ProductCard product={products[0]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/24-48h/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/components/product/ProductCard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Update `ProductCard.tsx`, `HeroShowcase.tsx`, and `Products.tsx`**

- In `ProductCard.tsx`:
  - Replace emerald badges/hover states with Pharma Blue (`border-sky-500/30`, `text-sky-300`, `bg-sky-950/70`, `hover:border-sky-500/40`, `shadow-sky-500/15`).
  - Add micro trust badge on the card: `🚚 Zaliha u RH (24-48h)`.
- In `HeroShowcase.tsx`:
  - Update glowing accents, badges, and HPLC status badge to sky/blue color scheme.
- In `Products.tsx`:
  - Update filter active states, price range sliders, and search input focus to `focus:border-sky-400 focus:ring-sky-400/20`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/components/product/ProductCard.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/product/ProductCard.tsx src/components/home/HeroShowcase.tsx src/pages/Products.tsx src/components/product/ProductCard.test.tsx
git commit -m "feat(ui): update ProductCard and catalog with Pharma Trust Blue and stock badges"
```

---

### Task 6: Update Cart & Checkout with Croatian Payment and Reassurance Badges

**Files:**
- Modify: `src/pages/Cart.tsx:1-250`
- Test: `src/pages/Cart.test.tsx`

**Interfaces:**
- Consumes: `useCartStore`, `useTranslation`
- Produces: Updated Cart checkout with payment method selection and security badges.

- [ ] **Step 1: Write the failing test**

```tsx
// src/pages/Cart.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";
import { useCartStore } from "../store/cartStore";
import { products } from "../data/products";

describe("Cart Component Trust Enhancements", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [{ product: products[0], quantity: 1 }],
    });
  });

  it("renders payment reassurance options (pouzeće, keks pay, kartice)", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByText(/pouzećem/i)).toBeInTheDocument();
    expect(screen.getByText(/keks pay/i)).toBeInTheDocument();
    expect(screen.getByText(/diskretna dostava/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/pages/Cart.test.tsx`
Expected: FAIL with missing elements.

- [ ] **Step 3: Implement Cart trust enhancements**

In `src/pages/Cart.tsx`:
- Add a payment method selector in the order summary:
  1. *Plaćanje pouzećem (kuriru pri preuzimanju)* - preporučeno
  2. *Keks Pay / Aircash*
  3. *Kreditna / Debitna kartica (3D Secure)*
  4. *Opća uplatnica / Virman (2D Barkod)*
- Add a visual trust reassurance box below checkout button:
  - 🔒 256-bit SSL sigurna narudžba
  - 📦 100% neutralno termo-pakiranje bez ikakvih vanjskih oznaka
  - 🚚 Besplatna dostava iznad 70 € (GLS / DPD)
- Update primary buttons and accents to Pharma Blue (`bg-sky-500 hover:bg-sky-400 text-zinc-950`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/pages/Cart.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Cart.tsx src/pages/Cart.test.tsx
git commit -m "feat(cart): add payment methods and security reassurance to cart"
```

---

### Task 7: Update Footer with Legal, Distribution & Payment Partner Badges

**Files:**
- Modify: `src/components/layout/Footer.tsx:1-87`
- Test: `src/components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `useTranslation()`
- Produces: Updated Footer component with Croatian business transparency, courier partners, and payment logos.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/layout/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Trust Elements", () => {
  it("renders Croatian courier and payment badges", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText(/GLS/i)).toBeInTheDocument();
    expect(screen.getByText(/DPD/i)).toBeInTheDocument();
    expect(screen.getByText(/Keks Pay/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test src/components/layout/Footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Update `Footer.tsx`**

- In `src/components/layout/Footer.tsx`:
  - Add a dedicated Trust & Logistics bar in the footer with badges:
    - Dostavni partneri: **GLS Hrvatska**, **DPD Croatia**, **Hrvatska Pošta / Paketomati**
    - Načini plaćanja: **Gotovina / Kartica pouzećem**, **Keks Pay**, **Aircash**, **Visa**, **Mastercard**
  - Add transparent local contact: Zagreb, Hrvatska | Podrška radnim danom 09:00 - 17:00
  - Update flask logo and link hover accents to `text-sky-400`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test src/components/layout/Footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat(footer): add courier, payment, and Zagreb location badges"
```

---

### Task 8: Verification & Quality Audit

**Files:** None (verification step)

- [ ] **Step 1: Run full test suite**

Run: `npm run test`
Expected: All test suites PASS (including existing tests and all new tests).

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: 0 errors, clean output.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: TypeScript check succeeds and Vite build completes without errors.

- [ ] **Step 4: Final visual and accessibility verification**

Verify WCAG AA contrast for text on dark backgrounds and check responsive layout across mobile and desktop.
