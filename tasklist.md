# Task List: SauceDemo E2E Automation Testing Framework

> **Status Proyek:** In Progress  
> **Target Aplikasi:** [SauceDemo](https://www.saucedemo.com)  
> **Framework:** Node.js Playwright (Latest) + TypeScript + POM  
> **Panduan Arsitektur:** `plan.md`  

---

## 📌 Progress Tracker Ringkas
- [x] **Fase 0: Integrasi Skill QA Automation**
- [x] **Fase 1: Setup Proyek & Konfigurasi Lingkungan (Node Playwright Latest)**
- [x] **Fase 2: Eksplorasi DOM SauceDemo & Analisis Skenario via MCP Browser**
- [x] **Fase 3: Penyusunan & Ekspor Dokumen Matriks SIT (.xlsx)**
- [x] **Fase 4: Pengembangan Arsitektur Page Object Model (POM) & Fixtures**
- [x] **Fase 5: Implementasi Skenario Uji E2E (Positif & Negatif)**
- [x] **Fase 6: Eksekusi Test Headless, Validasi Laporan, & Finalisasi**

---

## 📋 Rincian Task Berdasarkan Fase

### Fase 0: Integrasi Skill QA Automation (Completed)
- [x] **Task 0.1:** Cari dan unduh skill `thetestingacademy/playwright-e2e` dari `qaskills.sh` via `@qaskills/cli`.
- [x] **Task 0.2:** Pasang skill khusus di level local project pada direktori `.agent/skills/playwright-e2e`.
- [x] **Task 0.3:** Validasi kesiapan panduan `SKILL.md` (Best practices POM, auto-waiting, dynamic locators).

---

### Fase 1: Setup Proyek & Konfigurasi Lingkungan (Node Playwright Latest) (Completed)
- [x] **Task 1.1:** Inisialisasi `package.json` dengan dependensi Playwright terbaru (`@playwright/test`), `typescript`, `@types/node`, dan `exceljs`.
- [x] **Task 1.2:** Konfigurasi TypeScript (`tsconfig.json`) dengan target ES2022, module resolution NodeNext/bundler, dan path mapping.
- [x] **Task 1.3:** Konfigurasi `playwright.config.ts`:
  - Setting default browser: Google Chrome / Chromium
  - Setting default `headless: true`
  - Konfigurasi `baseURL: 'https://www.saucedemo.com'`
  - Timeout, retry policy, dan artifact captures (trace, screenshot on failure).
- [x] **Task 1.4:** Instalasi browser binaries Playwright (`npx playwright install chromium`).
- [x] **Task 1.5:** Buat struktur folder proyek standar industri (`src/pages`, `src/fixtures`, `src/utils`, `src/config`, `src/data`, `tests/e2e`, `docs`).

---

### Fase 2: Eksplorasi DOM SauceDemo & Analisis Skenario via MCP Browser (Completed)
- [x] **Task 2.1:** Analisis halaman Login (`/`):
  - Identifikasi selector `data-test="username"`, `data-test="password"`, `data-test="login-button"`.
  - Tangkap elemen dan pesan error saat invalid login / locked-out user (`data-test="error"`).
- [x] **Task 2.2:** Analisis halaman Inventory (`/inventory.html`):
  - Identifikasi list produk (`.inventory_item`), item title (`data-test="inventory-item-name"`), price (`data-test="inventory-item-price"`), tombol "Add to cart" / "Remove".
  - Identifikasi dropdown sorting (`data-test="product-sort-container"`) dan opsi (az, za, lohi, hilo).
  - Identifikasi shopping cart badge (`data-test="shopping-cart-badge"`).
- [x] **Task 2.3:** Analisis halaman Cart (`/cart.html`):
  - Identifikasi list item keranjang, tombol "Continue Shopping", "Checkout", dan "Remove".
- [x] **Task 2.4:** Analisis alur Checkout (`/checkout-step-one.html`, `/checkout-step-two.html`, `/checkout-complete.html`):
  - Form field Step 1: `firstName`, `lastName`, `postalCode`, tombol "Continue", "Cancel", dan validasi error banner.
  - Review Step 2: kalkulasi Subtotal, Tax, Total, tombol "Finish" dan "Cancel".
  - Complete Step 3: container konfirmasi `"Thank you for your order!"`, tombol "Back Home".
- [x] **Task 2.5:** Analisis Header & Sidebar (`react-burger-menu-btn`):
  - Tombol Logout (`data-test="logout-sidebar-link"`), All Items, Reset App State.

---

### Fase 3: Penyusunan & Ekspor Dokumen Matriks SIT (.xlsx) (Completed)
- [x] **Task 3.1:** Rancang skenario pengujian System Integration Testing (SIT) terstruktur:
  - Skenario Positif: Login valid, sorting produk, add-to-cart tunggal/multi, PDP navigation, checkout end-to-end, cart persistence, logout.
  - Skenario Negatif: Password salah, user terkunci, field login kosong, checkout info kosong (First Name, Last Name, Postal Code kosong), akses route ilegal tanpa login.
- [x] **Task 3.2:** Buat script generator Excel (`src/utils/excel-generator.ts`) menggunakan `exceljs` dengan format styling profesional:
  - Header berwana dengan font tebal dan alignment rapi.
  - Kolom lengkap: Test ID, Module, Scenario, Type (Positive/Negative), Priority, Pre-condition, Steps, Test Data, Expected Result, Status.
  - Format status badges (PASS / FAIL / PENDING) dan border tabel rapi.
- [x] **Task 3.3:** Eksekusi script generator untuk menghasilkan file `docs/SIT_SauceDemo_TestScenarios.xlsx`.
- [x] **Task 3.4:** Validasi file Excel berhasil dibuat dan memuat seluruh skenario positif & negatif.

---

### Fase 4: Pengembangan Arsitektur Page Object Model (POM) & Fixtures (Completed)
- [x] **Task 4.1:** Buat `BasePage` (`src/pages/base.page.ts`) yang membungkus fungsi navigasi, wait helper, safe clicks, dan standard assertions.
- [x] **Task 4.2:** Buat komponen modular:
  - `HeaderComponent` (`src/pages/components/header.component.ts`) - Cart icon, counter badge, menu trigger.
  - `SidebarComponent` (`src/pages/components/sidebar.component.ts`) - Logout, All Items, Reset App.
- [x] **Task 4.3:** Buat Page Objects inti:
  - `LoginPage` (`src/pages/login.page.ts`)
  - `InventoryPage` (`src/pages/inventory.page.ts`)
  - `ProductDetailPage` (`src/pages/product-detail.page.ts`)
  - `CartPage` (`src/pages/cart.page.ts`)
  - `CheckoutInfoPage` (`src/pages/checkout-info.page.ts`)
  - `CheckoutOverviewPage` (`src/pages/checkout-overview.page.ts`)
  - `CheckoutCompletePage` (`src/pages/checkout-complete.page.ts`)
- [x] **Task 4.4:** Buat custom Playwright Fixtures (`src/fixtures/base.fixture.ts`) untuk menginjeksi page objects langsung ke dalam test suite tanpa instansiasi manual berulang.
- [x] **Task 4.5:** Buat utilitas pembantu (`src/utils/test-helpers.ts`) untuk pembersihan angka harga string menjadi number (misal: `"$29.99"` -> `29.99`) dan validasi kalkulasi pajak.

---

### Fase 5: Implementasi Skenario Uji E2E (Positif & Negatif) (Completed)
- [x] **Task 5.1:** Modul Autentikasi:
  - `tests/e2e/auth/login.positive.spec.ts` (Login standard user, verifikasi redirect & logout)
  - `tests/e2e/auth/login.negative.spec.ts` (Locked user, wrong password, empty username, empty password, unauthorized direct access)
- [x] **Task 5.2:** Modul Katalog & Produk:
  - `tests/e2e/inventory/catalog-display.spec.ts` (Verifikasi item catalog, gambar, harga, detail PDP)
  - `tests/e2e/inventory/catalog-sorting.spec.ts` (A-Z, Z-A, Low to High, High to Low)
- [x] **Task 5.3:** Modul Keranjang Belanja:
  - `tests/e2e/cart/cart-actions.spec.ts` (Add item, badge count update, remove item from catalog & cart)
  - `tests/e2e/cart/cart-persistence.spec.ts` (Cart state persistence antar halaman, navigasi Continue Shopping)
- [x] **Task 5.4:** Modul Checkout Alur Lengkap:
  - `tests/e2e/checkout/checkout-flow.positive.spec.ts` (End-to-End order flow, validasi item total, tax 8%, order completion confirmation)
  - `tests/e2e/checkout/checkout-validation.negative.spec.ts` (Field validation: First Name, Last Name, Postal Code required error messages, cancel buttons)

---

### Fase 6: Eksekusi Test Headless, Validasi Laporan, & Finalisasi (Completed)
- [x] **Task 6.1:** Jalankan seluruh E2E test suite dengan mode default Chrome headless (`npx playwright test`).
- [x] **Task 6.2:** Pastikan 100% test scenario lulus (Green pass) tanpa flakiness (50/50 PASSED).
- [x] **Task 6.3:** Generate dan verifikasi Playwright HTML Report (`playwright-report/index.html`).
- [x] **Task 6.4:** Perbarui dokumen SIT Excel (`SIT_SauceDemo_TestScenarios.xlsx`) dengan status eksekusi aktual.
- [x] **Task 6.5:** Final review code cleanliness, dokumentasi `README.md`, dan serah terima ke user.

