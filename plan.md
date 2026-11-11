# Master Test Automation Plan - SauceDemo (Swag Labs)

> **Dokumen Versi:** 1.0.0  
> **Target Aplikasi:** [SauceDemo (Swag Labs)](https://www.saucedemo.com)  
> **Framework:** Node.js Playwright (Latest) with TypeScript  
> **Skillset:** `thetestingacademy/playwright-e2e` (QASkills.sh)  
> **Browser Engine:** Chromium / Google Chrome (`headless: true` by default)  
> **Exploration Tool:** MCP Browser ([browsermcp/mcp](https://github.com/browsermcp/mcp)) / Agentic Chrome DevTools Protocol  
> **Output Artefak:** E2E Automation Suite, SIT Test Matrix (`.xlsx`), Allure / HTML Report  

---

## 1. Ringkasan Eksekutif & Tujuan Proyek

Tujuan dari proyek ini adalah membangun framework otomasi pengujian Web End-to-End (E2E) standar industri untuk aplikasi e-commerce demo **SauceDemo (`saucedemo.com`)**. Framework dirancang menggunakan **Node.js Playwright terbaru (TypeScript)** dengan menerapkan pola arsitektur **Page Object Model (POM)**, modular fixtures, konfigurasi multi-environment, serta pencatatan terstruktur seluruh skenario pengujian System Integration Testing (SIT) positif dan negatif ke dalam dokumen Microsoft Excel (`.xlsx`).

### Sasaran Utama:
1. **Standar Industri & Clean Architecture:** Mengadopsi struktur berbasis *Separation of Concerns*, POM, custom fixtures, auto-waiting, dynamic locators (`getByRole`, `getByTestId`), dan robust error handling.
2. **Kecepatan & Keandalan (Headless First):** Default browser execution menggunakan Chrome headless (`headless: true`), parallel execution, dan fully isolated browser contexts.
3. **Eksplorasi Pintar Berbasis MCP Browser:** Memanfaatkan arsitektur Browser MCP (`browsermcp/mcp`) untuk inspeksi DOM mendalam, identifikasi visual state, validasi error state dinamis, serta navigasi flow pengguna yang realistis.
4. **Dokumentasi SIT Komprehensif:** Menyusun matriks pengujian SIT positif dan negatif yang terekam dalam format spreadsheet `.xlsx` standar QA Enterprise.
5. **Kesiapan CI/CD:** Mendukung pelaporan interaktif (Playwright HTML & Allure Reporter), trace viewer, video, dan screenshot capturing saat failure.

---

## 2. Analisis Ruang Lingkup Sistem (SauceDemo.com)

Aplikasi SauceDemo memiliki beberapa modul kritis dan personas pengguna unik untuk pengujian skenario fungsional dan non-fungsional:

### 2.1 User Personas (Test Accounts)
- `standard_user`: Pengguna umum tanpa anomali.
- `locked_out_user`: Pengguna yang diblokir sistem (skenario negatif login).
- `problem_user`: Pengguna yang mengalami bug UI (misal gambar produk tertukar atau aksi form tertentu terhambat).
- `performance_glitch_user`: Pengguna dengan latensi response lambat (pengujian timeout & network resilience).
- `error_user`: Pengguna yang memicu error internal pada saat submit checkout.
- `visual_user`: Pengguna yang memiliki layout visual glitch (pengujian visual regression).

### 2.2 Modul Pengujian
1. **Autentikasi & Otorisasi:**
   - Positif: Login dengan kredensial valid, persistensi sesi, logout bersih.
   - Negatif: Password salah, username kosong, password kosong, locked-out user, proteksi route (akses direct URL tanpa login).
2. **Katalog Produk (Inventory):**
   - Positif: Tampilan daftar produk lengkap (6 item), sorting (A-Z, Z-A, Price Low-High, Price High-Low), navigasi ke detail produk (PDP).
   - Negatif/Edge Cases: Anomali gambar produk, verifikasi persistensi urutan dan badge cart.
3. **Keranjang Belanja (Cart Management):**
   - Positif: Tambah 1 atau multi-item dari katalog/PDP, update badge counter, hapus item dari katalog atau cart page, navigasi balik "Continue Shopping".
   - Negatif: Membuka keranjang kosong dan validasi behavior checkout.
4. **Alur Checkout (Multi-Step Order):**
   - **Step 1 (Information):** Validasi First Name, Last Name, Postal Code (positif & negatif: validasi error message per field kosong).
   - **Step 2 (Overview):** Kalkulasi subtotal, tax calculation (8%), total harga, rincian shipping & payment info.
   - **Step 3 (Complete):** Konfirmasi pesanan "Thank you for your order!", dispatch tombol "Back Home".
5. **Navigasi & Menu Samping (Sidebar / Header):**
   - Reset App State, Logout, All Items, About link redirection.

---

## 3. Arsitektur Framework & Struktur Proyek Standar Industri

Framework dibangun berdasarkan pedoman resmi `thetestingacademy/playwright-e2e`:

```text
playwright-testingweb/
├── .agent/
│   └── skills/
│       └── playwright-e2e/          # Installed skill guidance & best practices
├── docs/
│   ├── SIT_SauceDemo_TestScenarios.xlsx  # Dokumen SIT Excel skenario positif & negatif
│   └── architecture.md              # Dokumentasi teknis arsitektur
├── src/
│   ├── config/
│   │   ├── env.config.ts            # Manajemen environment (Base URL, timeouts)
│   │   └── user-credentials.ts      # Kredensial akun uji SauceDemo
│   ├── data/
│   │   ├── checkout-data.json       # Mock data form checkout (valid & invalid)
│   │   └── sit-matrix-data.json     # Data sumber mapping skenario SIT
│   ├── fixtures/
│   │   └── base.fixture.ts          # Custom Playwright test fixture (injeksi pages & helpers)
│   ├── pages/
│   │   ├── base.page.ts             # Base Page Object (common actions, wait, log, assert)
│   │   ├── login.page.ts            # Page Object: Login screen & validasi error banner
│   │   ├── inventory.page.ts        # Page Object: Product catalog, sort dropdown, badge
│   │   ├── product-detail.page.ts   # Page Object: PDP detail view & add-to-cart
│   │   ├── cart.page.ts             # Page Object: Keranjang belanja & item list
│   │   ├── checkout-info.page.ts    # Page Object: Checkout Step 1 (form pembeli)
│   │   ├── checkout-overview.page.ts# Page Object: Checkout Step 2 (item & harga summary)
│   │   ├── checkout-complete.page.ts# Page Object: Checkout Step 3 (order confirmation)
│   │   └── components/
│   │       ├── header.component.ts  # Component: Header, cart icon, title
│   │       └── sidebar.component.ts # Component: Hamburger menu & links
│   └── utils/
│       ├── excel-generator.ts       # Script otomatis penghasil SIT .xlsx (ExcelJS)
│       ├── test-helpers.ts          # Parser string harga, currency validator, randomizer
│       └── logger.ts                # Structured console / file logging
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.positive.spec.ts
│   │   │   └── login.negative.spec.ts
│   │   ├── inventory/
│   │   │   ├── catalog-display.spec.ts
│   │   │   └── catalog-sorting.spec.ts
│   │   ├── cart/
│   │   │   ├── cart-actions.spec.ts
│   │   │   └── cart-persistence.spec.ts
│   │   └── checkout/
│   │       ├── checkout-flow.positive.spec.ts
│   │       └── checkout-validation.negative.spec.ts
├── .gitignore
├── package.json
├── playwright.config.ts             # Konfigurasi utama Playwright (headless: true)
├── plan.md                          # Master Test Automation Plan
├── tasklist.md                      # Pelacakan status pengerjaan bertahap
└── tsconfig.json                    # Konfigurasi TypeScript
```

---

## 4. Konfigurasi Browser & Runtime

Sesuai instruksi, Google Chrome / Chromium akan berjalan dalam mode **Headless True** secara default untuk performa tinggi dan kompatibilitas server CI/CD.

### Cuplikan Konfigurasi `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true, // Default Chrome headless
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: true,
      },
    },
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],
});
```

---

## 5. Strategi Eksplorasi Menggunakan MCP Browser (`browsermcp/mcp`)

Model Context Protocol (MCP) Browser menghubungkan LLM/Agent langsung ke instance browser aktif melalui Chrome DevTools Protocol (CDP). Pada SauceDemo, eksplorasi MCP Browser digunakan untuk:

1. **Mapping Selector yang Resilient:** Menemukan atribut `data-test` baku pada SauceDemo (`data-test="username"`, `data-test="password"`, `data-test="login-button"`, `data-test="inventory-item-name"`, `data-test="error"`) sehingga locator tidak rentan terhadap perubahan styling CSS.
2. **Pemeriksaan Dinamika Perilaku Akun Khusus:**
   - Meneliti respons visual `locked_out_user` untuk menangkap selector error toast yang akurat.
   - Mengamati behavior `problem_user` dalam kegagalan pengisian form last name atau kegagalan penghapusan item keranjang.
3. **Validasi Alur Checkout Lengkap:** Menginspeksi payload DOM pada kalkulasi `Item total`, `Tax`, dan `Total` untuk formula verifikasi matematika pada assertion.
4. **Pengambilan Bukti Visual (Snapshot DOM):** Menguji state transisi antar halaman (Login -> Inventory -> Cart -> Checkout Step 1 -> Checkout Step 2 -> Checkout Complete) sebelum diimplementasikan ke dalam Page Object Model.

---

## 6. Spesifikasi Dokumen SIT (System Integration Testing) XLSX

Skenario pengujian dicatat dan diekspor ke dalam berkas Excel (`docs/SIT_SauceDemo_TestScenarios.xlsx`) menggunakan script otomatis berbasis `exceljs` atau modul spreadsheet.

### 6.1 Struktur Kolom SIT Matrix:
| Header Kolom | Deskripsi |
| :--- | :--- |
| **Test Case ID** | Format kode standar: `TC_AUTH_001`, `TC_CHECKOUT_NEG_002`, dst. |
| **Module** | Kategori modul: `Authentication`, `Inventory`, `Cart`, `Checkout`, `Sidebar` |
| **Test Scenario** | Deskripsi singkat tujuan pengujian |
| **Test Type** | `Positive` atau `Negative` |
| **Priority** | `P1 (Critical)`, `P2 (High)`, `P3 (Medium)` |
| **Pre-Condition** | Keadaan awal sistem sebelum pengujian dimulai |
| **Test Steps** | Langkah-langkah detail pengeksekusian |
| **Test Data** | Input payload / data pengujian (username, form data, item name) |
| **Expected Result** | Hasil yang diharapkan dari sistem |
| **Automated?** | Status otomatisasi (`Yes` / `In Progress` / `Planned`) |
| **Automation Spec File** | Path ke file spesifikasi pengujian Playwright |

### 6.2 Matriks Skenario Pengujian (High-Level Overview)

#### A. Authentication & Session
- `TC_AUTH_POS_001`: Login dengan `standard_user` & valid password -> Diarahkan ke `/inventory.html`.
- `TC_AUTH_POS_002`: Logout sukses melalui sidebar menu -> Session berakhir, kembali ke login page.
- `TC_AUTH_NEG_001`: Login dengan username valid dan password salah -> Muncul pesan error "Username and password do not match".
- `TC_AUTH_NEG_002`: Login dengan `locked_out_user` -> Muncul pesan "Epic sadface: Sorry, this user has been locked out.".
- `TC_AUTH_NEG_003`: Login tanpa mengisi username -> Muncul pesan "Epic sadface: Username is required".
- `TC_AUTH_NEG_004`: Login tanpa mengisi password -> Muncul pesan "Epic sadface: Password is required".
- `TC_AUTH_NEG_005`: Akses URL terproteksi `/inventory.html` tanpa autentikasi -> Di-redirect ke login page dengan pesan akses ditolak.

#### B. Inventory & Product Catalog
- `TC_INV_POS_001`: Verifikasi 6 produk katalog tampil lengkap beserta judul, deskripsi, gambar, dan harga.
- `TC_INV_POS_002`: Pengurutan produk A ke Z (Default).
- `TC_INV_POS_003`: Pengurutan produk Z ke A.
- `TC_INV_POS_004`: Pengurutan harga Low to High.
- `TC_INV_POS_005`: Pengurutan harga High to Low.
- `TC_INV_POS_006`: Klik produk untuk membuka Product Details Page (PDP) dan verifikasi konsistensi data.
- `TC_INV_NEG_001`: Observasi `problem_user` saat memuat katalog produk (identifikasi broken image).

#### C. Shopping Cart Management
- `TC_CART_POS_001`: Tambah 1 produk dari katalog -> Badge cart bertambah menjadi `1`, tombol berubah menjadi "Remove".
- `TC_CART_POS_002`: Tambah multi-produk (3 item) -> Badge cart bertambah menjadi `3`.
- `TC_CART_POS_003`: Hapus produk langsung dari katalog -> Badge cart berkurang.
- `TC_CART_POS_004`: Buka halaman Cart -> Verifikasi nama, harga, dan kuantitas produk yang ditambahkan.
- `TC_CART_POS_005`: Hapus produk dari halaman Cart -> Item terhapus dari daftar.
- `TC_CART_POS_006`: Klik tombol "Continue Shopping" -> Navigasi kembali ke `/inventory.html` dengan state tetap terjaga.
- `TC_CART_NEG_001`: Validasi alur Cart saat tidak ada produk yang dipilih.

#### D. Checkout Flow (Step 1, 2, 3)
- `TC_CHK_POS_001`: Alur checkout End-to-End lengkap (Pilih produk -> Cart -> Isi info valid -> Overview -> Finish).
- `TC_CHK_POS_002`: Verifikasi kalkulasi matematis pada Step 2 (Item total + Tax 8% = Total).
- `TC_CHK_POS_003`: Verifikasi konfirmasi pesanan pada Step 3 dan kembali ke katalog melalui tombol "Back Home".
- `TC_CHK_NEG_001`: Step 1 - Submit info dengan First Name kosong -> Error "Error: First Name is required".
- `TC_CHK_NEG_002`: Step 1 - Submit info dengan Last Name kosong -> Error "Error: Last Name is required".
- `TC_CHK_NEG_003`: Step 1 - Submit info dengan Postal Code kosong -> Error "Error: Postal Code is required".
- `TC_CHK_NEG_004`: Step 1 - Klik tombol "Cancel" -> Kembali ke keranjang belanja tanpa submit data.
- `TC_CHK_NEG_005`: Step 2 - Klik tombol "Cancel" -> Kembali ke katalog produk.

---

## 7. Standar Coding & Best Practices (QASkills Playwright)

1. **Locator Strategy:** Selalu mengutamakan `getByTestId()` atau `locator('[data-test="..."]')` dan `getByRole()`. Hindari selector CSS dinamis atau absolute XPath.
2. **Auto-Waiting:** Tidak diperkenankan menggunakan arbitrary delay seperti `page.waitForTimeout()`. Manfaatkan Playwright auto-wait (`toBeVisible()`, `toHaveText()`, `toHaveURL()`).
3. **Independence:** Tiap test suite mandiri (`test.beforeEach` melakukan setup sendiri, tidak mewarisi state test sebelumnya).
4. **Strong Typing:** Semua data, page elements, dan fungsi pembantu ditulis dengan tipe data TypeScript yang ketat.
5. **Clean Reporting:** Format penamaan test yang deskriptif:
   ```typescript
   test.describe('Authentication - Positive Scenarios', () => {
     test('TC_AUTH_POS_001 - Should successfully login with standard user credentials', async ({ loginPage, inventoryPage }) => {
       // test logic
     });
   });
   ```

---

## 8. Jadwal Pelaksanaan & Milestone

| Fase | Durasi Estimasi | Deliverable Utama |
| :--- | :--- | :--- |
| **Fase 1** | Inisiasi | Inisialisasi package.json, Playwright latest, TypeScript, konfigurasi headless |
| **Fase 2** | Desain & SIT | Eksplorasi DOM via browser MCP, penyusunan matriks SIT Excel (`.xlsx`) |
| **Fase 3** | Arsitektur POM | Pembuatan BasePage, Page Objects, Components, Custom Fixtures |
| **Fase 4** | Implementasi E2E | Penulisan test spec positif dan negatif (Auth, Inventory, Cart, Checkout) |
| **Fase 5** | Eksekusi & Laporan | Menjalankan headless test suite, validasi cross-browser, pembuatan laporan HTML |

