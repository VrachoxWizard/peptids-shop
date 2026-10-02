# Frontend Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all bugs, performance bottlenecks, internationalization/accessibility omissions, and testing deficiencies identified during the frontend code review audit.

**Architecture:** Incrementally harden the state and catalog layers using TDD (Vitest), optimize the routing layer with React `lazy` code splitting to eliminate the 600kB monolithic bundle warning, and localize hardcoded strings/labels and accessible scroll behavior.

**Tech Stack:** React 19, TypeScript 6, Vite 6, Tailwind CSS v4, Zustand 5, React Router v7, Vitest, Testing Library.

**Spec:** The code review findings from [.agents/skills/code-review/SKILL.md](file:///c:/Users/vrachox/Desktop/peptide-shop/.agents/skills/code-review/SKILL.md) and the resulting audit verdict.

## Global Constraints

- Must maintain 100% build compatibility with `npm run build` (`tsc -b && vite build`) and `npm run lint`.
- No regressions in existing dark-mode liquid-glass aesthetic or responsive layouts.
- Pure client-side state must remain backwards-compatible with persisted `localStorage` keys (`peptide-shop-cart`, `peptidelab-language`).

## Review Focus

1. `cartStore.addItem` with `NaN`, `0`, or negative quantity — must not corrupt cart state with `NaN`.
2. `Products` page pagination when user is on page 3 and narrows filters to 1 page — must not show an empty page or crash.
3. Fast search input typing — must not trigger synchronous router navigation on every keystroke.
4. Language toggle to English — must not show "Još" or Croatian `aria-label`s on cart or product detail pages.
5. Production bundle size — must split the monolithic 607kB JS chunk into lazy route chunks under 500kB.

---

### Task 1: Setup Testing Infrastructure (Vitest & Testing Library)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: `npm test` script executing Vitest in jsdom environment.

- [ ] **Step 1: Install Vitest and test dependencies**

Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom`:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Create Vitest configuration `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Add test script to `package.json`**

Add `"test": "vitest run"` under `"scripts"`.

- [ ] **Step 5: Verify test runner works with a dummy assertion**

Run `npm test` and verify that Vitest initializes properly without errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts
git commit -m "chore: setup vitest and react testing library"
```

---

### Task 2: Fix Cart Store `NaN` Vulnerability & Quantity Sanitization

**Files:**
- Modify: `src/store/cartStore.ts:29-59`
- Create: `src/store/cartStore.test.ts`

**Interfaces:**
- Consumes: `Product` type from `src/types/product.ts`
- Produces: Hardened `addItem(product: Product, quantity?: number)` function resisting `NaN`, `undefined`, floats, and negative numbers.

- [ ] **Step 1: Write failing tests in `src/store/cartStore.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./cartStore";
import type { Product } from "../types/product";

const mockProduct: Product = {
  id: 99,
  slug: "test-product",
  name: "Test Product",
  category: "Peptidi",
  description: "Test description",
  amount: "10 mg",
  price: 50,
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("safely handles NaN quantity without corrupting cart", () => {
    useCartStore.getState().addItem(mockProduct, NaN);
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(1);
  });

  it("safely handles negative and zero quantities by defaulting to 1", () => {
    useCartStore.getState().addItem(mockProduct, -5);
    expect(useCartStore.getState().items[0].quantity).toBe(1);

    useCartStore.getState().addItem(mockProduct, 0);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("floats are truncated to integers", () => {
    useCartStore.getState().addItem(mockProduct, 2.7);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/store/cartStore.test.ts`
Expected: FAIL because `Math.max(1, NaN)` returns `NaN`.

- [ ] **Step 3: Implement quantity sanitization in `src/store/cartStore.ts`**

Replace line 31:
```ts
const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/store/cartStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store/cartStore.ts src/store/cartStore.test.ts
git commit -m "fix(cart): sanitize addItem quantity against NaN and negative values"
```

---

### Task 3: Fix Catalog Pagination Desync & Add Search Debounce

**Files:**
- Modify: `src/pages/Products.tsx`
- Create: `src/hooks/useDebounce.ts`
- Create: `src/hooks/useDebounce.test.ts`

**Interfaces:**
- Produces: `useDebounce<T>(value: T, delay?: number): T` hook
- Fixes: `effectivePage` calculation in `src/pages/Products.tsx` preventing blank pages when filters shrink `totalPages`.

- [ ] **Step 1: Write failing test for `useDebounce` hook**

```ts
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("delays updating the debounced value", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: "initial" },
    });

    expect(result.current).toBe("initial");

    rerender({ val: "changed" });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe("changed");
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/hooks/useDebounce.test.ts`
Expected: FAIL (file not found).

- [ ] **Step 3: Implement `useDebounce` in `src/hooks/useDebounce.ts`**

```ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/hooks/useDebounce.test.ts`
Expected: PASS

- [ ] **Step 5: Update `src/pages/Products.tsx` with pagination bounds and local search input state**

1. Introduce local input state `[searchInput, setSearchInput]` debounced with `useDebounce(searchInput, 250)` to sync with URL parameter `search` without lagging the input.
2. Clamp pagination:
```ts
const effectivePage = totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
const startIndex = (effectivePage - 1) * PRODUCTS_PER_PAGE;
```
3. Use `effectivePage` in pagination UI active states and display text (`page X of Y`).

- [ ] **Step 6: Run build and lint verification**

Run: `npm run build && npm run lint`
Expected: PASS with 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useDebounce.ts src/hooks/useDebounce.test.ts src/pages/Products.tsx
git commit -m "fix(catalog): debounce search input and clamp pagination bounds"
```

---

### Task 4: Fix Internationalization (I18N) & Accessible Labels

**Files:**
- Modify: `src/i18n/translations.ts`
- Modify: `src/pages/Cart.tsx`
- Modify: `src/pages/ProductDetails.tsx`
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Produces: Localized dictionary entries for free shipping prefix (`remainingPrefix: "Još" | ""`) and localized aria labels.

- [ ] **Step 1: Add missing translation tokens to `src/i18n/translations.ts`**

In `hr`:
```ts
cart: {
  ...
  remainingPrefix: "Još ",
  decreaseQty: "Smanji količinu",
  increaseQty: "Povećaj količinu",
  removeItem: "Ukloni proizvod",
}
nav: {
  ...
  toggleLang: "Promijeni jezik",
}
```

In `en`:
```ts
cart: {
  ...
  remainingPrefix: "",
  decreaseQty: "Decrease quantity",
  increaseQty: "Increase quantity",
  removeItem: "Remove item",
}
nav: {
  ...
  toggleLang: "Switch language",
}
```

- [ ] **Step 2: Update `src/pages/Cart.tsx`**

Replace line 289:
```tsx
<p className="text-xs sm:text-sm font-semibold text-white">
  {t.cart.remainingPrefix}
  <span className="font-mono text-emerald-400">{remainingForFreeShipping.toFixed(2)} €</span>{" "}
  {t.cart.remainingForFree}
</p>
```
Replace all hardcoded `aria-label="Smanji količinu"`, `"Povećaj količinu"`, `"Ukloni proizvod"` with `aria-label={t.cart.decreaseQty}`, `aria-label={t.cart.increaseQty}`, `aria-label={t.cart.removeItem}`.

- [ ] **Step 3: Update `src/pages/ProductDetails.tsx`**

Replace hardcoded `aria-label="Smanji količinu"` and `aria-label="Povećaj količinu"` with localized `t.cart.decreaseQty` and `t.cart.increaseQty`.

- [ ] **Step 4: Update `src/components/layout/Navbar.tsx`**

Replace `aria-label="Promijeni jezik"` with `aria-label={t.nav.toggleLang}`.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/translations.ts src/pages/Cart.tsx src/pages/ProductDetails.tsx src/components/layout/Navbar.tsx
git commit -m "fix(i18n): localize cart free shipping prefix and accessibility aria labels"
```

---

### Task 5: Route Code Splitting (React.lazy & Suspense)

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/common/RouteLoading.tsx`

**Interfaces:**
- Produces: On-demand dynamic imports for all top-level routes reducing initial chunk size below the 500kB Vite threshold.

- [ ] **Step 1: Create `src/components/common/RouteLoading.tsx`**

```tsx
export default function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
    </div>
  );
}
```

- [ ] **Step 2: Refactor `src/App.tsx` to use `lazy` and `<Suspense>`**

```tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import RouteLoading from "./components/common/RouteLoading";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/proizvodi" element={<Products />} />
            <Route path="/proizvod/:slug" element={<ProductDetails />} />
            <Route path="/kosarica" element={<Cart />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors closeButton theme="dark" />
    </div>
  );
}

export default App;
```

- [ ] **Step 3: Run `npm run build` and inspect chunk distribution**

Run: `npm run build`
Expected:
No warning `(!) Some chunks are larger than 500 kB`. Each route outputs a separate `.js` chunk (e.g., `Home-xxx.js`, `Products-xxx.js`, `Cart-xxx.js`), with the main bundle size dropping significantly.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/components/common/RouteLoading.tsx
git commit -m "perf: enable route code splitting with React.lazy and Suspense"
```

---

### Task 6: Dynamic Document Titles (SEO) & Respect Reduced Motion

**Files:**
- Create: `src/hooks/useDocumentTitle.ts`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Products.tsx`
- Modify: `src/pages/ProductDetails.tsx`
- Modify: `src/pages/Cart.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/components/layout/ScrollToTop.tsx`

**Interfaces:**
- Produces: `useDocumentTitle(title?: string): void` hook dynamically setting document `<title>`.
- Fixes: Smooth scroll respecting `prefers-reduced-motion`.

- [ ] **Step 1: Create `src/hooks/useDocumentTitle.ts`**

```ts
import { useEffect } from "react";

const BASE_TITLE = "PeptideLab";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : `${BASE_TITLE} | Istraživački biokemijski spojevi`;
  }, [title]);
}
```

- [ ] **Step 2: Connect `useDocumentTitle` into each page**

- `Home.tsx`: `useDocumentTitle();`
- `Products.tsx`: `useDocumentTitle(t.catalog.title);`
- `ProductDetails.tsx`: `useDocumentTitle(product ? product.name : undefined);`
- `Cart.tsx`: `useDocumentTitle(t.cart.title);`
- `Contact.tsx`: `useDocumentTitle(t.contact.title);`

- [ ] **Step 3: Update `src/components/layout/ScrollToTop.tsx` for accessibility**

```ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "instant" : "auto",
    });
  }, [pathname]);

  return null;
}
```

- [ ] **Step 4: Run full test suite, build, and linter**

Run:
```bash
npm test
npm run lint
npm run build
```
Expected: All tests pass, linter reports 0 errors, build succeeds cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useDocumentTitle.ts src/components/layout/ScrollToTop.tsx src/pages/*.tsx
git commit -m "feat(seo): add dynamic document titles and respect prefers-reduced-motion in ScrollToTop"
```
