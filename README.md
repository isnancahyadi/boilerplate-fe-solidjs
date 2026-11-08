# SolidStart Frontend Boilerplate

> Boilerplate frontend kelas enterprise berbasis **SolidStart v2** (SolidJS 1.9), **Tailwind CSS v4** (OKLCH 3-layer design tokens), **Ark UI** primitives, **TanStack Solid Query v5 & Solid Table v9**, **Formisch + Valibot**, serta **BiomeJS**.
> Dirancang terstruktur, type-safe, dan siap diintegrasikan secara optimal dengan AI Coding Assistant.

---

## 📚 Peta Dokumentasi

| Dokumen | Deskripsi & Tujuan |
| :--- | :--- |
| [`PRD.md`](./PRD.md) | **Spesifikasi Kebutuhan Produk**: Scope MVP (Fase 1), Non-goals (Fase 2), alur pengguna, & kriteria penerimaan. |
| [`AGENTS.md`](./AGENTS.md) | **Tata Tertib & Guardrails AI**: 40 aturan mutlak, konvensi kode, alur `PLAN.md`, pengujian ganda, & Conventional Commits. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | **Arsitektur Sistem**: Tech stack, struktur modular `features/`, pola data 3-lapisan, state management, & ADR. |
| [`API.md`](./API.md) | **Spesifikasi & Kontrak API**: Layanan IAM terpusat (`API_CORE`), template CRUD (`API_APP`), & respon amplop `ArrayData<T>`. |
| [`DESIGN.md`](./DESIGN.md) | **Design System & Styling**: Token warna OKLCH Light-First default, dark mode, tipografi, & panduan Ark UI. |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | **Deployment & CI/CD**: Workflow GitHub Actions, Multi-stage Docker build Google Distroless, & environment flags. |

---

## 🎯 Panduan Inisiasi Proyek Baru dari Boilerplate

Saat Anda membuat repositori baru dari boilerplate ini, ikuti alur **Top-Down** berikut untuk menyelaraskan seluruh dokumen dan konfigurasi dengan proyek riil Anda:

### 1. Urutan Penyesuaian Dokumen

```
[ 1. PRD.md ]  ──────────► Definisikan ruang lingkup produk & batasan MVP Fase 1
      │
      ▼
[ 2. API.md ]  ──────────► Rancang kontrak endpoint domain bisnis (API_APP)
      │
      ▼
[ 3. DESIGN.md ] ────────► Tentukan warna utama brand (--primary) & status entitas
      │
      ▼
[ 4. ARCHITECTURE.md ] ──► Daftarkan modul fitur di src/features/
      │
      ▼
[ 5. DEPLOYMENT.md ] ────► Tentukan domain host & image registry GitHub Actions
      │
      ▼
[ 6. AGENTS.md ] ────────► Tambahkan nama modul ke daftar scope Conventional Commits
```

### 2. Checklist Identitas Proyek di Kode
- [ ] `package.json`: Ganti `"name"` dengan nama proyek Anda.
- [ ] `src/config/app.ts`: Ganti `APP_NAME` dan sesuaikan feature flags `MODULE_ACTIVE_CONFIG`.
- [ ] `.env.example`: Sesuaikan default prefix environment dan cookie key.

---

### 3. Template Prompt Kickoff untuk AI Coding Assistant

Salin prompt di bawah ini ke percakapan pertama Anda dengan AI Assistant saat memulai proyek baru dari boilerplate ini:

````markdown
Saya baru saja membuat repositori baru dari boilerplate SolidStart ini untuk membangun proyek:
- **Nama Proyek**: [Nama Proyek Anda]
- **Deskripsi Singkat**: [Jelaskan apa fungsi aplikasi ini secara singkat]
- **Warna Brand Utama**: [Contoh: Emerald Green oklch(60% 0.18 150) / Biru oklch(55% 0.18 250)]
- **Daftar Fitur MVP (Fase 1)**:
  1. [Fitur A, misal: Manajemen Produk & Stok]
  2. [Fitur B, misal: Manajemen Transaksi Penjualan]
  3. [Fitur C, misal: Laporan Ringkasan Bulanan]
- **Fitur Ditunda (Fase 2 - JANGAN DIKERJAKAN)**:
  1. [Fitur lanjutan yang belum masuk scope awal]

TOLONG LAKUKAN PENYELARASAN DOKUMEN SPESIFIKASI PROYEK:
1. Perbarui `PRD.md` dengan nama proyek, deskripsi, scope Fase 1, dan batasan Fase 2 di atas.
2. Ganti seluruh judul dan metadata "SolidStart Frontend Boilerplate" pada `PRD.md`, `API.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `DESIGN.md`, dan `AGENTS.md` menjadi "[Nama Proyek Anda]".
3. Rancang endpoint bisnis di `API.md` Bab 3 (`API_APP`) sesuai kebutuhan fitur di atas (pertahankan `API_CORE` untuk IAM).
4. Daftarkan modul fitur di `ARCHITECTURE.md` (`src/features/`) dan tambahkan scope commit di `AGENTS.md`.
5. Sesuaikan warna brand primary di `src/assets/styles/variables.css` dan `DESIGN.md`.
6. Jangan membuat kode komponen atau fitur apapun terlebih dahulu, fokus selaraskan dokumen spesifikasi.
````

---

## 🚀 Fitur & Keunggulan Arsitektur

1. **Fine-Grained Reactivity**: Performa rendering secepat Vanilla JS tanpa Virtual DOM berkat SolidJS v1.9.
2. **Desain Sistem Light-First Modern**: Token warna OKLCH 3-layer berbasis CSS variables yang terintegrasi langsung dengan Tailwind CSS v4, mendukung Dark Mode secara native.
3. **Headless & Accessible UI Primitives**: Komponen UI di `src/components/ui/` dibangun menggunakan `@ark-ui/solid` dan Class Variance Authority (CVA), terintegrasi penuh dengan standar **Ark UI LLMs.txt** (`https://ark-ui.com/llms-solid.txt`) untuk AI Coding Assistant.
4. **Pola Data 3-Lapis Terisolasi**:
   - `Layer 1: endpoint/` — Deklarasi URL & parameter generator.
   - `Layer 2: api/` — Fungsi pemanggil HTTP Axios dengan typing eksplisit.
   - `Layer 3: service/` — TanStack Query hooks (`createQuery` & `createMutation`).
5. **Validasi Skema Modular**: Form management type-safe menggunakan Formisch (`@formisch/solid`) dipadukan dengan Valibot (`valibot`).
6. **SSR Middleware Guard**: Proteksi rute server-side cepat menggunakan `src/middleware.ts` untuk validasi auth token cookie.
7. **Pengujian Ganda (Dual-Scenario Testing)**: Kebijakan pengujian wajib berpasangan (*Happy Path* & *Unhappy/Boundary Path*) untuk unit test dan integration test.
8. **Automated Tooling**: BiomeJS untuk linting super cepat dan Git Conventional Commits via Commitizen & Husky.

---

## 🛠️ Panduan Memulai (Quick Start)

### Prasyarat
- Node.js `>= 24`
- pnpm `>= 9` (Wajib, bukan npm atau yarn)

### Instalasi Dependensi
```bash
pnpm install
```

### Menjalankan Server Development
```bash
pnpm dev
```
Aplikasi dapat diakses melalui peramban di `http://localhost:3000`.

### Linting & Formatting (Biome)
```bash
# Memeriksa dan memperbaiki format kode secara otomatis
pnpm check

# Memeriksa linting kode saja
pnpm lint

# Format file kode
pnpm format
```

### Membangun untuk Produksi (Production Build)
```bash
pnpm build
pnpm start
```

### Pengujian (Testing)
```bash
# Menjalankan unit & integration tests (Vitest)
pnpm test

# Menjalankan unit tests dalam mode watch
pnpm test:watch

# Menjalankan browser end-to-end tests (Playwright)
pnpm test:e2e

# Menjalankan Playwright dengan Interactive UI Mode
pnpm test:e2e:ui
```

### Melakukan Git Commit (Wajib via Commitizen)
Commit manual via `git commit` biasa diblokir oleh Husky hook guna menjamin kepatuhan Conventional Commits. Selalu jalankan:
```bash
pnpm git:commit
```

---

## 📁 Struktur Direktori Singkat

```
e2e/                            # Playwright browser end-to-end tests (*.spec.ts)
src/
├── assets/styles/              # Entry index.css, variables.css (OKLCH tokens), global.css
├── components/                 # Reusable UI components
│   ├── ui/                     # Ark UI primitives (button, dialog, input, dll.)
│   ├── common/                 # Shared functional components (table, modal, alert, dll.)
│   └── layouts/                # Atom layout wrappers (Flex, ContentWrapper, CardContainer)
├── config/                     # app.ts, http.ts, cookies.ts, prefix.ts
├── context/                    # Context global (i18n, breadcrumbs)
├── features/                   # Modular business features ([feature]/components, lib, types)
├── hooks/                      # Global reactive SolidJS hooks
├── lib/
│   ├── data/                   # Global shared data layer (dropdowns /all queries)
│   └── utils/                  # Global helpers (cn, permission, form, file, text)
├── locales/                    # en/ & id/ translation dictionaries
├── middleware.ts               # SolidStart SSR Auth Guard
├── routes/                     # File-based routing SolidStart
├── stores/                     # Zustand global session stores
└── types/                      # Shared TypeScript interfaces (api.ts, common.ts)
```

Setiap direktori di atas dilengkapi dokumen internal `README.md` yang memandu peruntukan, konvensi, dan batasan teknisnya secara rinci.
