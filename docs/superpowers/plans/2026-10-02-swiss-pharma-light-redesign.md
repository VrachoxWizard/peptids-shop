# Švicarski Farmaceutski Minimalizam (Swiss Pharma Light) Redizajn Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Redizajnirati webshop iz tamne "AI-slop / generic tech" teme u autoritativni, pristupačni i kristalno čisti **Swiss Pharma Light** stil (svijetla klinička tema) s prestižnim analitičkim serifom za naslove, strogim linijama, nultim dekorativnim kičem i naglašenim regionalnim signalima povjerenja (plaćanje pouzećem, brza dostava 24–48h iz Zagreba, diskretno termo-pakiranje i lokalna telefonska podrška) u skladu s Hallmark pravilima.

**Architecture:** 
1. Uspostaviti nove svijetle CSS tokene u `src/styles/design-tokens.css` i `src/index.css` (baza: kirurški čista bijela `#ffffff` i neutralna `#f8fafc`, duboka klinička mornarsko plava/grafitna `#09090b` / `#0f172a` za tekst, kirurški plavi akcent `#0284c7`, uklanjanje svih tamnih radial-glow/aurora orba).
2. Uvesti Google Fonts (`Playfair Display` ili `Newsreader` za naslove + `Inter` za UI/body + `JetBrains Mono` s `tabular-nums` za kemijske podatke).
3. Redizajnirati navigaciju (`Navbar.tsx`, `TopTrustBar.tsx`) u čisti Swiss masthead s hairline obrubima i jasnom hijerarhijom.
4. Preurediti `Home.tsx` i `HeroShowcase.tsx`: asimetrični specimeni, stvarni mjerljivi podaci, uklanjanje nested card-in-card okvira i uklanjanje lažnih dubina/sjajeva.
5. Zamijeniti 4 generičke kartice u `CroatiaTrustBadges.tsx` modernim Swiss horizontalnim stripom s vertikalnim razdjelnicima (Plaćanje pouzećem, 24–48h dostava iz Zagreba, termo-zaštita, telefonska podrška 01 4828 111).
6. Očistiti `BentoCategories.tsx` i `ProductCard.tsx` (uklanjanje unutrašnjih suvišnih kartica, prelazak sa skočnih success toastova na suptilne taktilne promjene stanja gumba).
7. Redizajnirati `Footer.tsx` u analitički Dense Colophon (Ft4) s jasnom pravnom istraživačkom napomenom, domaćim dostavnim službama i načinima plaćanja.
8. Prilagoditi `Cart.tsx`, `Products.tsx`, `ProductDetails.tsx`, `Contact.tsx` i `NotFound.tsx` na novu svijetlu paletu.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion), Lucide React, Zustand, Vitest, Testing Library.

**Spec:** Hallmark audit ispravci + korisnički odabir "Swiss Pharma svijetla tema + analitički serif + lokalno povjerenje za HR/regiju".

---

## Global Constraints

- **Svijetla tema (Light Mode):** Glavna podloga je `#ffffff` i `#f8fafc`, tekst je visokokontrastna tamna tinta `#09090b` / `#0f172a`.
- **Hallmark Stamp:** Svaki glavni CSS i layout ima pečat: `/* Hallmark · macrostructure: catalogue · theme: swiss-pharma · genre: modern-minimal */`.
- **Zabrana AI-slop elemenata:** Bez blur-3xl glow orba, bez aurora pozadina, bez card-in-card ugnježđivanja, bez ljubičastih gradijenata, bez generičkih `Sparkles` ikona.
- **Tipografija:** Naslovi koriste autoritativni serif (`var(--font-display)`), tijelo teksta čist sans-serif (`var(--font-sans)`), a specifikacije monospace (`var(--font-mono)` s `tabular-nums`).
- **Jezična podrška (i18n):** Očuvati besprijekoran preklop hrvatskog (`hr`) i engleskog (`en`) jezika za sve elemente.
- **Domaći trust signali:** Istaknuti: Pouzeće (gotovina/kartica), 24–48h isporuka iz Zagreba, 100% diskretno termo-pakiranje, telefon 01 4828 111.
- **Tipografska pravila:** En-dash (`–`, U+2013) za sve raspone (`9–17h`, `24–48h`), ravni navodnici zamijenjeni tipografskim po potrebi.
- **Testovi:** Svaki zadatak mora imati zelene testove (`npm test`) i proći `npm run build`.

---

## Review Focus

1. **Kontrast i čitljivost teksta na svijetloj podlozi:** Svi tekstualni elementi moraju imati omjer kontrasta minimalno 4.5:1 (WCAG AA). Nema blijedo-sivog teksta na bijeloj podlozi.
2. **Responzivnost na uskim ekranima (320px–375px):** Nijedan gumb, link ili tablica ne smije prelaziti u 2 reda na silu niti uzrokovati vodoravni scroll (`overflow-x: clip`).
3. **Usklađenost i18n prijevoda:** Provjeriti da novi tekstovi za dostavu, plaćanje i podršku imaju ekvivalentne i točne prijevode na hrvatskom i engleskom.
4. **Taktilni odziv bez nametljivih toastova:** Dodavanje u košaricu mora imati čist mikro-odgovor na samom gumbu bez iskakanja bučnih skočnih prozora.
5. **Cjelovitost komponenti košarice i narudžbe:** Provjeriti da opcija plaćanja pouzećem (Cash on Delivery) u `Cart.tsx` jasno komunicira preuzimanje bez rizika.

---

### Task 1: Novi Swiss Pharma Light dizajn sustav i tipografski tokeni

**Files:**
- Modify: `index.html` (učitavanje Google Fonta: `Playfair Display` ili `Newsreader`)
- Modify: `src/styles/design-tokens.css`
- Modify: `src/index.css`
- Test: `src/styles/designTokens.test.ts`

- [x] **Step 1: Napiši test za svijetle Swiss Pharma tokene**

```typescript
// src/styles/designTokens.test.ts
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Swiss Pharma Light Design Tokens", () => {
  it("should have light theme tokens defined in design-tokens.css", () => {
    const filePath = path.resolve(__dirname, "./design-tokens.css");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("--color-bg-base: #ffffff");
    expect(content).toContain("--color-text-primary: #09090b");
    expect(content).toContain("--color-accent-pharma: #0284c7");
    expect(content).toContain("--color-border-hairline");
  });

  it("should configure display serif and sans fonts in index.css", () => {
    const indexPath = path.resolve(__dirname, "../index.css");
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain("Playfair Display");
    expect(content).toContain("swiss-pharma");
  });
});
```

- [x] **Step 2: Pokreni test da potvrdiš pad**

Run: `npm test src/styles/designTokens.test.ts`

- [x] **Step 3: Implementiraj fontove u `index.html`, ažuriraj tokene i `index.css`**

U `index.html` dodaj `preconnect` i link za `Playfair Display:ital,wght@0,500;0,600;0,700;1,600` i `Inter:wght@400;500;600;700`.
U `src/styles/design-tokens.css` definiraj:
```css
/* Hallmark · macrostructure: catalogue · theme: swiss-pharma · genre: modern-minimal */
:root {
  --color-bg-base: #ffffff;
  --color-bg-subtle: #f8fafc;
  --color-bg-surface: #ffffff;
  --color-text-primary: #09090b;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-accent-pharma: #0284c7;
  --color-accent-pharma-hover: #0369a1;
  --color-accent-dark: #0f172a;
  --color-border-hairline: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --shadow-swiss: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
  --shadow-swiss-lift: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04);
}
```
U `src/index.css` ukloni tamne `.liquid-glass-card`, zamijeni s čistim `.swiss-card`, postavi `body` na bijelu pozadinu i taman tekst, te dodaj `font-variant-numeric: tabular-nums` za numeričke tablice.

- [x] **Step 4: Pokreni test da potvrdiš prolaz**

Run: `npm test src/styles/designTokens.test.ts`

- [x] **Step 5: Git Commit**

```bash
git add index.html src/styles/design-tokens.css src/index.css src/styles/designTokens.test.ts
git commit -m "feat(design): implement Swiss Pharma Light tokens and serif typography"
```

---

### Task 2: Redizajn navigacije (`Navbar.tsx` i `TopTrustBar.tsx`) u Swiss klinički stil

**Files:**
- Modify: `src/components/layout/TopTrustBar.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify/Update Test: `src/components/layout/TopTrustBar.test.tsx`

- [x] **Step 1: Napiši test za novu svijetlu Swiss navigaciju**

Testirati da `TopTrustBar` i `Navbar` renderiraju svijetlu kliničku podlogu (`bg-white` ili `bg-slate-50`), s jasnim domaćim oznakama (Zagreb, Pouzeće, 24–48h).

- [x] **Step 2: Pokreni test i zabilježi rezultat**

Run: `npm test src/components/layout/TopTrustBar.test.tsx`

- [x] **Step 3: Implementiraj čistu svijetlu navigaciju**

1. `TopTrustBar.tsx`:
   - Svijetla diskretna traka (`bg-slate-100 border-b border-slate-200 text-slate-700`).
   - Prikazuje ključne signale: "GLS/DPD isporuka iz Zagreba (24–48h)", "Plaćanje pouzećem (gotovina/kartica)", "Podrška: 01 4828 111".
2. `Navbar.tsx`:
   - Bijela podloga (`bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs`).
   - Logotip: Čista medicinska tipografija s prepoznatljivim plavim laboratorijskim znakom.
   - Linkovi: Oštra tamna slova (`text-slate-700 hover:text-sky-700 font-medium`), bez neonskih sjena.
   - Košarica i birač jezika: Oštre linije, profinjeni minimalizam.

- [x] **Step 4: Verificiraj testove**

Run: `npm test src/components/layout/TopTrustBar.test.tsx`

- [x] **Step 5: Git Commit**

```bash
git add src/components/layout/TopTrustBar.tsx src/components/layout/Navbar.tsx src/components/layout/TopTrustBar.test.tsx
git commit -m "feat(nav): redesign Navbar and TopTrustBar into Swiss Pharma light layout"
```

---

### Task 3: Redizajn `CroatiaTrustBadges.tsx` — uklanjanje 4-column AI grid cardova i prelazak na analitički strip

**Files:**
- Modify: `src/components/home/CroatiaTrustBadges.tsx`
- Modify/Update Test: `src/components/home/CroatiaTrustBadges.test.tsx`
- Modify: `src/i18n/translations.ts`

- [x] **Step 1: Napiši test za novi horizontalni strip povjerenja**

Potvrditi da sekcija ima elemente s točnim podacima za Hrvatsku i susjedne zemlje, bez AI generic orba i bez card-in-card strukture.

- [x] **Step 2: Pokreni test**

Run: `npm test src/components/home/CroatiaTrustBadges.test.tsx`

- [x] **Step 3: Implementiraj Swiss analitički strip povjerenja**

- Ukloniti: `<div className="pointer-events-none absolute ... bg-sky-500/10 blur-[120px]" />` i `.liquid-glass-card`.
- Implementirati:
  - Čistu sekciju s podlogom `bg-slate-50 border-y border-slate-200`.
  - Zaglavlje s autoritativnim serifom: *"Pouzdana nabava peptida u Republici Hrvatskoj i regiji"*.
  - 4 stupa organizirana kao čist analitički strip s tankim vertikalnim razdjelnicima:
    1. **Plaćanje pouzećem:** Naručite bez online kartičnog rizika, platite gotovinom ili karticom kuriru.
    2. **24–48h Isporuka iz Zagreba:** Skladište u RH, GLS/DPD dostava na adresu ili paketomate bez carinskih kašnjenja.
    3. **100% Diskretno termo-pakiranje:** Neutralno vanjsko pakiranje s izolacijom koja čuva stabilnost lanca.
    4. **Domaća korisnička podrška:** Fiksni telefon u Zagrebu (01 4828 111) i brza stručna podrška.

- [x] **Step 4: Pokreni test da potvrdiš prolaz**

Run: `npm test src/components/home/CroatiaTrustBadges.test.tsx`

- [x] **Step 5: Git Commit**

```bash
git add src/components/home/CroatiaTrustBadges.tsx src/components/home/CroatiaTrustBadges.test.tsx src/i18n/translations.ts
git commit -m "feat(home): replace AI card grid with Swiss analytical trust strip"
```

---

### Task 4: Redizajn Hero sekcije i HeroShowcase u `Home.tsx`

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/components/home/HeroShowcase.tsx`

- [x] **Step 1: Provjeri postojeće stanje i pripremi specifikaciju**

- Ukloniti tamni gradijent `bg-gradient-to-b from-slate-950...`.
- Ukloniti pulsirajući ping-dot badge (`01 / BADGE`).
- Naslov prebaciti u autoritativni analitički serif (`font-display text-slate-900`).
- Ukloniti `Sparkles` ikonu i zamijeniti je s čistim kemijskim/analitičkim opisom.
- U `HeroShowcase.tsx`: ukloniti ambient blur orbove (`blur-3xl`), ukloniti ugniježđene kartice (card-in-card), oblikovati čisti laboratorijski specifikacijski list s bijelom podlogom, jasnom slikom bočice, CAS brojem i HPLC čistoćom.

- [x] **Step 2: Implementiraj svijetlu Hero sekciju**

Podloga: Čista bijela s finom mrežastom ili suptilnom linijskom strukturom.
Akcijski gumbi:
- Primarni: Visokokontrastni tamni medicinski gumb (`bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-6 py-3.5`).
- Sekundarni: Čisti obrubljeni gumb (`border border-slate-300 text-slate-700 bg-white hover:bg-slate-50`).
Metrika povjerenja u dnu heroja: Čisti monospace brojevi s `tabular-nums` i preciznim laboratorijskim opisom.

- [x] **Step 3: Pokreni build i vizualnu provjeru**

Run: `npm run build`

- [x] **Step 4: Git Commit**

```bash
git add src/pages/Home.tsx src/components/home/HeroShowcase.tsx
git commit -m "feat(home): redesign Hero and HeroShowcase into Swiss Pharma light layout"
```

---

### Task 5: Redizajn `BentoCategories.tsx` i `ProductCard.tsx` (uklanjanje Card-in-card i zamjena Toast skočnih prozora)

**Files:**
- Modify: `src/components/home/BentoCategories.tsx`
- Modify: `src/components/product/ProductCard.tsx`
- Modify: `src/components/product/ProductVisual.tsx`
- Modify/Update Test: `src/components/product/ProductCard.test.tsx`

- [x] **Step 1: Ažuriraj test za `ProductCard`**

Testirati novo taktilno stanje dodavanja u košaricu na samom gumbu i čist prikaz specifikacija (čistoća, CAS, zaliha u RH).

- [x] **Step 2: Pokreni test**

Run: `npm test src/components/product/ProductCard.test.tsx`

- [x] **Step 3: Implementiraj redizajn kartica i kategorija**

1. `BentoCategories.tsx`:
   - Ukloniti sve obojene ambient blur orbove (`bg-violet-500/10 blur-3xl`, `bg-sky-500/10`).
   - Kartice postaviti na svijetlu podlogu (`bg-white border border-slate-200 shadow-xs hover:border-sky-500 hover:shadow-md`).
   - Tipografija: Serif naslovi kategorija, čisti sans opisi, precizni brojevi dostupnih peptida.
2. `ProductCard.tsx`:
   - Ukloniti unutrašnje ugniježđene kartice: oznaka za zalihu u RH postaje čisti inline redak s ikonom kamiona i en-dashom (`24–48h`), a ne kartica unutar kartice.
   - Zamijeniti nametljivi `toast.success` elegantnom mikro-promjenom na samom gumbu: pri kliku gumb na 1.5 sekundu prikazuje kvačicu i tekst *"Dodano"*, dok se broj u zaglavlju animira.

- [x] **Step 4: Pokreni testove**

Run: `npm test src/components/product/ProductCard.test.tsx`

- [x] **Step 5: Git Commit**

```bash
git add src/components/home/BentoCategories.tsx src/components/product/ProductCard.tsx src/components/product/ProductVisual.tsx src/components/product/ProductCard.test.tsx
git commit -m "feat(products): polish BentoCategories and ProductCard with light Swiss aesthetics"
```

---

### Task 6: Redizajn `Footer.tsx` u analitički Dense Colophon (Ft4)

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify/Update Test: `src/components/layout/Footer.test.tsx`
- Modify: `src/i18n/translations.ts`

- [x] **Step 1: Napiši test za novi Colophon footer**

Provjeriti da footer prikazuje verificirane podatke: distribucijski centar Zagreb, domaće dostavljače (GLS, DPD, Paketomati), načine plaćanja (Pouzeće, Keks Pay, Aircash) i jasnu istraživačku napomenu.

- [x] **Step 2: Pokreni test**

Run: `npm test src/components/layout/Footer.test.tsx`

- [x] **Step 3: Implementiraj Dense Colophon Footer**

- Podloga: `bg-slate-100 border-t border-slate-200 text-slate-600`.
- Zamijeniti generički 3-stupčani SaaS layout formatom profesionalnog laboratorijskog kolofona:
  - Zaglavlje: Puni naziv subjekta, adresa logističkog skladišta u Zagrebu, radno vrijeme i fiksni telefon.
  - Središnji dio: Certificirani bedževi partnera (GLS, DPD, Pouzeće, Keks Pay, Aircash, 2D Barkod) u čistom monokromatskom/swiss stilu.
  - Podnožje: Obavezna zakonska napomena o namjeni isključivo za laboratorijska istraživanja i analitiku (in vitro).

- [x] **Step 4: Pokreni testove**

Run: `npm test src/components/layout/Footer.test.tsx`

- [x] **Step 5: Git Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx src/i18n/translations.ts
git commit -m "feat(layout): redesign Footer into Swiss Pharma dense colophon"
```

---

### Task 7: Usklađivanje ostalih stranica (`Products.tsx`, `ProductDetails.tsx`, `Cart.tsx`, `Contact.tsx`, `NotFound.tsx`)

**Files:**
- Modify: `src/pages/Products.tsx`
- Modify: `src/pages/ProductDetails.tsx`
- Modify: `src/pages/Cart.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/NotFound.tsx`
- Modify/Update Test: `src/pages/Cart.test.tsx`

- [x] **Step 1: Pokreni postojeći Cart test**

Run: `npm test src/pages/Cart.test.tsx`

- [x] **Step 2: Prilagodi stranice svijetloj temi i ukloni centrirane AI blokove**

- `Cart.tsx`: Svijetle kartice narudžbe, jasno istaknuta opcija *Plaćanje pouzećem (gotovinom ili karticom kuriru)* s ikonom štita i bez naknade.
- `Products.tsx`: Čisti filteri s neutralnim svijetlim tipkama i preciznim brojčanim oznakama kategorija.
- `ProductDetails.tsx`: Pregledan prikaz specifikacija (CAS, sekvenca, molarna masa, COA certifikat za preuzimanje).
- `NotFound.tsx`: Asimetrični raspored umjesto jednoličnog centriranog bloka.

- [x] **Step 3: Pokreni sve testove i provjeri build**

Run: `npm test`
Run: `npm run build`

- [x] **Step 4: Git Commit**

```bash
git add src/pages/Products.tsx src/pages/ProductDetails.tsx src/pages/Cart.tsx src/pages/Contact.tsx src/pages/NotFound.tsx src/pages/Cart.test.tsx
git commit -m "feat(pages): harmonize all remaining pages with Swiss Pharma light design"
```

---

### Task 8: Završni Hallmark Audit i Verifikacija

**Files:**
- Audit: Svi promijenjeni frontend fileovi
- Verification: `npm test`, `npm run build`, `npm run dev`

- [x] **Step 1: Pokreni sve testove suitea**

Run: `npm test -- --run`
Expected: 100% testova prolazi (16+ testova).

- [x] **Step 2: Pokreni TypeScript type-check i build**

Run: `npm run build`
Expected: Uspješan build bez ijedne pogreške.

- [x] **Step 3: Pokreni Hallmark Audit nad novim kodom**

Provjeriti da su sve ranije uočene točke otklonjene:
- Nema AI nav-a (čista Swiss navigacija).
- Nema AI footera (Ft4 Dense colophon).
- Nema "Inter-everywhere" (prestižni serif + sans + mono).
- Nema ambient glow/aurora orba.
- Nema card-in-card ugnježđivanja.
- Nema jednoličnih 4-column feature cardova s ikonama u kvadratićima.
- Nema nametljivih success toastova.
- Svi rasponi koriste en-dash (`–`).
- Hallmark stamp je prisutan.
Result: 0 critical, 0 major.

- [x] **Step 4: Završni Git Commit**

```bash
git commit -m "chore: complete Swiss Pharma light redesign and verify Hallmark compliance"
```
