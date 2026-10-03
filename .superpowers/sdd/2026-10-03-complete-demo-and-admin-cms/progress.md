# SDD ledger — plan: docs/superpowers/plans/2026-10-03-complete-demo-and-admin-cms.md

## Pre-flight scan
Pre-flight: no shared interface conflicts between tasks. All interfaces well-defined.
- Task 1.1 produces catalogApi, Task 1.2 consumes it.
- Task 1.3 produces OrderTracking page and orderApi.trackOrder.
- Task 1.4 produces CoAModal.
- Task 1.5 adds admin link to Footer.
- Task 2.1-2.3 produce server admin routes, Task 2.4 consumes in client adminApi, Task 2.5-2.7 consume in Admin UI.

## Progress
- [x] Task 1.1: Servis za dohvat kataloga `src/services/catalogApi.ts` (commits: f1d4c4c, tests: 5/5 pass)
- [x] Task 1.2: Povezivanje stranica na API i prikaz stanja zaliha (Stock Badges) (commits: abb8ba3, tests: 8/8 pass)
- [x] Task 1.3: Javna stranica za praćenje narudžbe kupca (`/prati-posiljku`) (commits: 0a359d0, tests: 3/3 pass)
- [x] Task 1.4: Prikaz i preuzimanje Certifikata Analize (CoA Modal & Ogledni PDF) (commits: 6f2e549, tests: 6/6 pass)
- [x] Task 1.5: Diskretna poveznica na `/admin` u podnožju (commits: 1c0b4d8, tests: 2/2 pass)
- [x] Task 2.1: Poslužiteljski API za upravljanje artiklima (Product CRUD) (commits: 855a52b, tests: 2/2 pass)
- [x] Task 2.2: Poslužiteljski API za upravljanje serijama i skladištem (Batch & Stock) (commits: e2fe4a9, tests: 3/3 pass)
- [x] Task 2.3: Poslužiteljski API za pregled kontakt upita (Inquiries Inbox) (commits: e2fe4a9, tests: 3/3 pass)
- [x] Task 2.4: Proširenje klijentskog servisa `src/services/adminApi.ts` (commits: eb24411)
- [x] Task 2.5: Tab navigacija u Admin sučelju (`src/pages/Admin.tsx`) (commits: 7a1e83e, tests: 2/2 pass)
- [x] Task 2.6: Komponenta za upravljanje artiklima i skladištem (`AdminProductsManager.tsx`) (commits: 7a1e83e)
- [x] Task 2.7: Komponenta za pregled kontakt upita (`AdminInquiriesTable.tsx`) (commits: 7a1e83e)
- [x] Task 3.1: Automatizirana verifikacija cijelog sustava (tests: 94/94 pass, lint: 0 errors/0 warnings, client & server build pass)
