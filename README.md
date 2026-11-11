# SauceDemo Playwright E2E Automation Framework

Framework otomasi pengujian Web End-to-End (E2E) standar industri untuk [SauceDemo (Swag Labs)](https://www.saucedemo.com) menggunakan **Node.js Playwright (Latest)**, **TypeScript**, **Page Object Model (POM)**, dan integrasi skill [`thetestingacademy/playwright-e2e`](https://qaskills.sh).

---

## 🎯 Fitur & Keunggulan
- **Arsitektur Standar Industri:** Pemisahan *Concerns* menggunakan Page Object Model (POM) dan Custom Fixtures Playwright.
- **Chrome Default Headless:** Dikonfigurasi default `headless: true` untuk eksekusi cepat dan ramah CI/CD.
- **SIT Excel Matrix (`.xlsx`):** Dokumentasi otomatis matriks skenario pengujian System Integration Testing lengkap dengan styling profesional.
- **Cakupan Skenario Positif & Negatif:**
  - **Auth:** Login sukses, logout menu sidebar, locked-out user, wrong password, empty username/password, route protection.
  - **Inventory:** 6 item display verification, sorting A-Z, Z-A, Price Low-High, Price High-Low, PDP navigation.
  - **Cart:** Add single/multi item, badge counter, remove item catalog/cart, continue shopping persistence.
  - **Checkout:** E2E transaction, kalkulasi matematis presisi (Subtotal + Tax 8% = Total), validasi mandatory input (First/Last Name, Postal Code), tombol Cancel.
- **Auto-Waiting & Resilient Locators:** Berbasis atribut `data-test` tanpa hardcoded delays (`waitForTimeout`).

---

## 📁 Struktur Direktori
```text
playwright-testingweb/
├── .agent/skills/playwright-e2e/  # QASkills Playwright Skillset
├── docs/
│   ├── SIT_SauceDemo_TestScenarios.xlsx  # Dokumen SIT Excel Skenario Positif & Negatif
│   └── exploration-results.json          # Hasil pemetaan DOM SauceDemo live
├── src/
│   ├── config/                           # Environment & user credentials
│   ├── data/                             # Mock checkout & SIT scenario data
│   ├── fixtures/base.fixture.ts          # Custom Playwright Fixtures
│   ├── pages/                            # Page Object Model & Components
│   └── utils/
│       ├── excel-generator.ts            # SIT Matrix Excel Generator (ExcelJS)
│       └── test-helpers.ts               # Price parser & math assertions
├── tests/e2e/                            # Spec files (Auth, Inventory, Cart, Checkout)
├── playwright.config.ts                  # Playwright Headless Configuration
├── plan.md                               # Master Automation Plan
└── tasklist.md                           # Phased Implementation Tracker
```

---

## 🚀 Perintah Menjalankan Pengujian

### 1. Menjalankan Seluruh Test Suite (Headless)
```bash
npm test
```

### 2. Menjalankan Test dengan Browser Terbuka (Headed)
```bash
npm run test:headed
```

### 3. Menjalankan Khusus Google Chrome
```bash
npm run test:chrome
```

### 4. Membuka Laporan Interaktif Playwright HTML
```bash
npm run test:report
```

### 5. Generate / Refresh Dokumen SIT Excel
```bash
npm run generate:sit
```

---

## 📊 Hasil Eksekusi Uji Terakhir
- **Total Test Executed:** 50 Tests (25 Google Chrome + 25 Chromium)
- **Status:** **50 Passed / 0 Failed (100% Pass Rate)**
- **Report File:** [`playwright-report/index.html`](file:///c:/TUGASKKu/sqa-batch-31/playwright-testingweb/playwright-report/index.html)
- **SIT Document:** [`docs/SIT_SauceDemo_TestScenarios.xlsx`](file:///c:/TUGASKKu/sqa-batch-31/playwright-testingweb/docs/SIT_SauceDemo_TestScenarios.xlsx)

