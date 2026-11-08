# SolidStart Frontend Boilerplate — Architecture

> **Versi Dokumen**: 1.0.6 (Modular 3-Tier Permissions & General Authentication Model)
> **Tanggal Efektif**: 6 November 2026
> **Status**: Active Baseline — Living Document (Adaptif & Updatable via Protokol §11)
> **Dokumen Terkait**: [`PRD.md`](./PRD.md) · [`DESIGN.md`](./DESIGN.md) · [`AGENTS.md`](./AGENTS.md) · [`API.md`](./API.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
> **Pemilik / Maintainer**: Developer (Personal / Team Project)
> **Audience**: Developer & AI Coding Assistant
>
> Dokumen ini menjawab: **"Sistemnya berjalan seperti apa, dan kenapa dibangun begitu?"**
> Sumber kebenaran tunggal (_single source of truth_) untuk tech stack, struktur folder, alur data, dan keputusan teknis arsitektur.

---

## Daftar Isi

1. [Gambaran Sistem](#1-gambaran-sistem)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Direktori](#3-struktur-direktori)
4. [Alur Data — Pola 3 Lapisan](#4-alur-data--pola-3-lapisan)
5. [State Management](#5-state-management)
6. [Forms & Validasi](#6-forms--validasi)
7. [i18n](#7-i18n)
8. [Autentikasi & Permission](#8-autentikasi--permission)
9. [Strategi Pengujian (Testing Architecture)](#9-strategi-pengujian-testing-architecture)
10. [Keputusan Teknis (ADR Ringkas)](#10-keputusan-teknis-adr-ringkas)
11. [Tata Kelola Perubahan Arsitektur (Living Document Protocol)](#11-tata-kelola-perubahan-arsitektur-living-document-protocol)
12. [Document Revision History](#12-document-revision-history)

---

## 1. Gambaran Sistem

```
Browser ── SolidStart (CSR + hydration) ── middleware.ts (cek cookie token)
              │
              ├─ routes/        → compose halaman
              ├─ features/*     → komponen + hooks + API per domain (dan sub-fitur)
              ├─ components/    → ui/ (Ark UI primitives) + common/ (bersama) + layouts/ (layout wrappers)
              └─ stores/ context/ → state global
              │  HTTPS (axios, Bearer token, auto-refresh 401)
              ▼
        Backend:       /api/core (Layanan IAM terpusat: auth, user, role, permission, menu)
                       /api/v1   (Layanan Domain Bisnis Aplikasi)
```

Frontend berlapis: **UI** (routes, components) → **Logic** (hooks, stores, context, validation, utils) → **Data** (endpoint, api, query keys, service).
Detail endpoint backend: lihat [`API.md`](./API.md).

---

## 2. Tech Stack

| Layer              | Library / Tool                                                | Keterangan                                                                                 |
| ------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Framework          | SolidJS + SolidStart v2                                       | CSR + file-based routing                                                                   |
| Bahasa             | TypeScript                                                    | **Strict mode**                                                                            |
| Styling            | TailwindCSS v4                                                | CSS-first, design tokens di `src/assets/styles/variables.css` (entry: `index.css`)         |
| UI Components      | Ark UI (`@ark-ui/solid`) + CVA                                | Headless, accessible primitives di `src/components/ui/` styled dengan Tailwind v4          |
| Tabel              | @tanstack/solid-table                                         | Sorting & pagination                                                                       |
| Data Fetching      | @tanstack/solid-query v5                                      | `createQuery` / `createMutation`                                                           |
| Forms              | Formisch (`@formisch/solid`)                                  | `createForm()` + `<Form>` + `<Field>`                                                      |
| Validasi           | Valibot (`v`)                                                 | **Bukan Zod**                                                                              |
| HTTP Client        | axios + axios-auth-refresh                                    | Class `Http` di `src/config/http.ts`                                                       |
| State Global       | solid-zustand + Solid Context                                 | Lihat [§5](#5-state-management)                                                            |
| Date               | dayjs                                                         |                                                                                            |
| Icons              | lucide-solid                                                  | **Satu-satunya** icon library                                                              |
| i18n               | @solid-primitives/i18n                                        | EN/ID via `TranslationContext` (`translation-context.tsx`)                                 |
| Linter & Formatter | BiomeJS (+ Prettier terbatas)                                 | Biome = lint + format; Prettier hanya sorting class Tailwind & JSON                        |
| Unit Testing       | Vitest (`vitest`)                                             | Test runner cepat berbasis Vite untuk unit test utility, schema, dan data layer            |
| E2E Testing        | Playwright (`@playwright/test`)                               | Pengujian browser end-to-end otomatis untuk alur kritis (auth, guard, form CRUD)           |
| Package Manager    | pnpm                                                          | **Wajib** (bukan npm/yarn)                                                                 |
| Git Hooks & Commit | husky + commitlint + commitizen (`cz-conventional-changelog`) | Enforce Conventional Commits lokal via `pnpm git:commit` & verifikasi di GitHub Actions CI |

Versi pasti: lihat [`package.json`](./package.json) (satu-satunya sumber kebenaran versi).

---

## 3. Struktur Direktori

```
src/
├── assets/                            ← Aset statis & styling aplikasi yang di-bundle oleh Vite
│   ├── styles/                        ← Konfigurasi styling Tailwind CSS v4 & design tokens OKLCH
│   │   ├── index.css                  ← Entry point styling utama (mengimpor font, tailwind, variables, global)
│   │   ├── variables.css              ← ⭐ Sumber kebenaran design tokens (:root OKLCH CSS variables)
│   │   └── global.css                 ← Base reset HTML, box-sizing, antialiasing font, dan scrollbar
│   ├── images/                        ← Gambar statis, logo aplikasi, ilustrasi antarmuka (opsional)
│   ├── icons/                         ← Custom SVG icons khusus di luar pustaka lucide-solid (opsional)
│   └── fonts/                         ← Local web fonts (.woff2/.woff) untuk kebutuhan intranet/offline (opsional)
├── components/                        ← Komponen antarmuka pengguna (UI components) reusable lintas modul/fitur
│   ├── ui/                            ← Komponen atomik primitif headless (Ark UI @ark-ui/solid + CVA + Tailwind: Button, Dialog, Input, dll.)
│   ├── common/                        ← Komponen fungsional & presentasional bersama tingkat menengah (DataTable, Modal, AlertDialog, EmptyData, dll.)
│   └── layouts/                       ← Komponen pembungkus struktur layout atomik aplikasi (Flex, ContentWrapper, CardContainer)
├── config/                            ← Konfigurasi global aplikasi, instance HTTP client (Axios), interceptor auth, cookie wrapper, dan feature flags
├── context/                           ← Solid Context providers untuk event broadcast & state sharing reaktif lintas hirarki komponen (i18n, breadcrumbs)
├── features/                          ← ⭐ Inti modul bisnis aplikasi berbasis domain fungsional (feature-based & modular)
│   └── [fitur]/                       ← Modul fitur mandiri (misal: auth, user-management, dashboard, product)
│       ├── components/                ← Komponen antarmuka spesifik fitur & sub-komponen partisi tampilan
│       │   ├── [KomponenUtama].tsx    ← Komponen tampilan utama fitur (list table, overview card, detail page)
│       │   ├── form/                  ← Komponen form create/update terintegrasi & skema validasi Valibot (.validation.ts)
│       │   └── [sub-komponen]/        ← Partisi UI pendukung yang diekstrak khusus untuk kebutuhan fitur ini
│       ├── hooks/                     ← Custom hooks reaktif lokal yang hanya relevan dan digunakan pada fitur ini
│       ├── lib/                       ← Logika bisnis lokal fitur, konstanta domain, utilitas, dan data layer
│       │   ├── constant.ts            ← Konstanta, enum, dan opsi konfigurasi khusus fitur
│       │   ├── utils.ts               ← Helper transformer dan formatting data khusus fitur
│       │   └── data/                  ← Pola arsitektur 3 lapis data API (TanStack Solid Query)
│       │       ├── endpoint/          ← Layer 1: Definisi konstanta URL & path generator endpoint
│       │       ├── api/               ← Layer 2: Fungsi HTTP pemanggil API (Axios) strictly-typed
│       │       ├── query-keys/        ← Query key factory untuk TanStack Query cache invalidation
│       │       ├── mock/              ← Generator data dummy & hook mock (fase prototipe UI sebelum endpoint siap)
│       │       └── service/           ← Layer 3: Query & Mutation hooks untuk konsumsi komponen
│       ├── types/                     ← Kontrak tipe data lokal (model detail, response mutasi, inferred form type)
│       ├── sub-feature/               ← Sub-modul bersarang yang memiliki siklus data dan antarmuka mandiri
│       │   └── [sub-fitur]/           ← Sub-entitas bisnis (misal: roles, permissions) berstruktur simetris dengan fitur utama
│       │       ├── components/        ← Komponen antarmuka & form khusus sub-fitur
│       │       ├── hooks/             ← Custom hooks lokal khusus sub-fitur
│       │       ├── lib/               ← constant.ts, utils.ts, dan data 3-lapis khusus sub-fitur
│       │       ├── types/             ← Model data & DTO response khusus sub-fitur
│       │       └── index.tsx          ← Entry point export publik sub-fitur
│       └── index.tsx                  ← Entry point export publik modul fitur utama
├── hooks/                             ← Custom hooks SolidJS global yang reusable lintas modul aplikasi (misal: clipboard, media query)
├── layouts/                           ← Template shell/layout tingkat halaman & rute (shell dashboard ber-sidebar, shell auth minimalis)
├── lib/                               ← Utilitas bersama dan data layer global tingkat aplikasi
│   ├── data/                          ← Layer API bersama untuk shared options, dropdown master (/all/), dan utilitas API global
│   └── utils/                         ← Kumpulan pure helper functions global (manipulasi teks, download file, FormData, izin akses)
├── locales/                           ← Kamus kamus lokalisasi multi-bahasa (i18n) terstruktur dalam berbagai kategori (en & id)
├── middleware.ts                      ← SSR interceptor SolidStart untuk proteksi sesi, auth guard, dan pengalihan rute
├── routes/                            ← File-based routing SolidStart (halaman dashboard terproteksi, alur auth publik, API routes)
├── stores/                            ← Client state management sesi global berbasis Zustand (autentikasi, navigasi menu, hak akses)
└── types/                             ← Definisi tipe TypeScript global (amplop API ArrayData, PaginationMeta, FilterParams, Base[Entity]Type)
```

### 3.1 Penjelasan Detail Direktori & Prinsip Arsitektur

1. **Aset Statis & Styling (`src/assets/`)**:
   - Direktori `src/assets/` menampung seluruh berkas aset statis yang diproses, dioptimasi, dan di-bundle langsung oleh bundler Vite (berbeda dari folder `/public` yang menyajikan file mentah tanpa proses build).
   - **`styles/` (Design Tokens & CSS Layers)**:
     - `variables.css` adalah **sumber kebenaran tunggal (single source of truth)** untuk seluruh design tokens aplikasi. Semua token warna semantik (`--primary`, `--surface-*`, `--background`, `--foreground`, `--border`, dll.) didefinisikan menggunakan format OKLCH di dalam selector `:root` (Light-First default) dan `.dark` (Dark Mode), yang di-mapping ke `@theme inline` Tailwind v4.
     - `global.css` menangani konfigurasi base reset HTML, box-sizing, antialiasing font, dan native scrollbar browser.
     - `index.css` bertindak sebagai entry point utama yang mengimpor Tailwind CSS v4 (`@import "tailwindcss";`), `variables.css`, dan `global.css`.
   - **Aset Lainnya (`images/`, `icons/`, `fonts/`)**:
     - `images/`: Gambar statis raster/vektor lokal (`.png`, `.webp`, `.svg`), logo aplikasi, serta ilustrasi (_empty state_, _error page_). Berkas ini diimpor langsung dalam kode komponen (`import logo from "~/assets/images/logo.svg"`) sehingga Vite dapat melakukan kompresi, inlining otomatis untuk file kecil, dan _cache busting_ via content hash.
     - `icons/`: Custom SVG icons khusus yang tidak tersedia di library bawaan `lucide-solid`.
     - `fonts/`: Berkas font lokal (`.woff2`, `.woff`) jika aplikasi dirancang berjalan di lingkungan _offline/on-premise_ tanpa akses CDN.
   - Dokumentasi lengkap tersedia di [`src/assets/README.md`](./src/assets/README.md) dan [`src/assets/styles/README.md`](./src/assets/styles/README.md).

2. **Komponen Reusable Lintas Domain (`src/components/`)**:
   - `ui/`: Komponen primitif dari **Ark UI** (`@ark-ui/solid`) (misal `Button`, `Input`, `Dialog`, `Badge`, `Card`, dll.). Bersifat headless/styled dasar dengan kepemilikan kode penuh (copy-paste).
   - `common/`: Komponen fungsional dan presentasional tingkat menengah yang dipakai bersama lintas fitur, seperti `DataTable`, `PaginationTable`, `Modal`, `AlertDialog`, `DeleteConfirmation`, `EmptyData`, `InputFile`, `date-picker/`, `header-nav/`, `side-nav/`, `input-form/`, `select-form/`, `Tooltip`, `Logo`, dan `typography/`.
   - `layouts/`: Komponen pembungkus tata letak (layout wrapper) atomik, seperti `ContentWrapper`, `CardContainer`, dan `Flex`.

3. **Struktur Fitur & Sub-fitur Modular (`src/features/`)**:
   Setiap domain fungsional dibungkus dalam folder fitur tersendiri. Fitur modular yang menaungi banyak entitas (seperti `master-data` dan `user-management`) memiliki sub-direktori `sub-feature/[nama-sub-fitur]/`. Baik fitur utama maupun sub-fitur menganut struktur yang **identik dan simetris**:
   - **`components/`**: Menampung komponen-komponen antarmuka yang spesifik untuk fitur tersebut (misal tabel list, card grid, CUD wrapper). Selain itu, **sub-komponen partisi yang digunakan pada komponen tersebut diletakkan di dalam folder ini** (misalnya sub-folder `form/` yang memisahkan form `.form.tsx` dan skema validasi `.validation.ts`, atau kartu parsial seperti `UserCard.tsx` di dalam `user-grid/`).
   - **`lib/`**: Memiliki peran dan arsitektur yang **sama dengan `src/lib/` global**:
     - `constant.ts`: Konstanta spesifik fitur (opsi status, tab, key modal, dll.).
     - `utils.ts`: Helper, formatter, atau transformer data yang spesifik untuk fitur.
     - `data/`: Arsitektur 3 lapis data API + query keys + mock (`endpoint/`, `api/`, `query-keys/`, `mock/`, `service/`).
   - **`types/`**: Memiliki peran yang **sama seperti `src/types/` global**, berisi interface data model, DTO response, type alias, dan inferensi skema Valibot (`schema.ts`, `common.ts`) khusus untuk fitur/sub-fitur tersebut.
   - **`hooks/`**: Khusus menampung custom SolidJS hooks/primitives yang **hanya digunakan untuk fitur/sub-fitur itu sendiri** (misal hook state form multi-step lokal, sinkronisasi filter tabel khusus, kalkulasi dinamis matriks). Jika suatu hook digunakan lintas domain/fitur, letakkan di `src/hooks/` global.
   - **`sub-feature/`**: Sub-modul bersarang yang memiliki siklus data dan antarmuka mandiri (contoh: `user-management/sub-feature/roles/`). Struktur di dalamnya **sama persis** dengan struktur fitur (`components/`, `hooks/`, `lib/`, `types/`, `index.tsx`).

4. **Penjelasan Modul & Direktori Global Pendukung**:
   - `src/config/`: Konfigurasi global runtime aplikasi, inisialisasi instance Axios HTTP client dengan interceptor refresh token otomatis (`http.ts`), utilitas pembacaan cookie sesi (`cookies.ts`), konstanta prefix API (`API_CORE`, `API_APP`), serta objek pembaca feature flags modular `.env` (`MODULE_ACTIVE_CONFIG`).
   - `src/context/`: State berbasis Solid Context untuk broadcast event dan state sharing reaktif lintas hirarki komponen (misal: `translation-context.tsx` untuk lokalisasi bahasa aktif, `breadcrumb-page-context.tsx` untuk navigasi breadcrumb halaman dinamis).
   - `src/hooks/`: Kumpulan custom SolidJS hooks reaktif tingkat global yang dapat digunakan kembali lintas modul fitur (misal: `create-clipboard.ts` untuk aksi salin clipboard, deteksi media query, dsb.).
   - `src/layouts/`: Shell layout struktural tingkat rute dan aplikasi (`app-layout.tsx` untuk dashboard utama ber-sidebar dan header navigasi, serta `auth-layout.tsx` untuk alur autentikasi minimalis).
   - `src/lib/data/`: Data layer API bersama tingkat global/aplikasi (khusus mengelola query referensi bersama untuk kebutuhan opsi dropdown atau endpoint `/all/` seperti daftar role, permission, category, department, serta fungsi utilitas API global seperti upload file bersama).
   - `src/lib/utils/`: Kumpulan fungsi pembantu (_pure helper functions_) global yang bebas dari dependensi UI dan dapat diakses lintas domain (`cn.ts` untuk manipulasi class styling, `permission.ts` untuk otorisasi hak akses, `form.ts` untuk penanganan `FormData` & error API, `file.ts` untuk unduh & format ukuran berkas, `text.ts` untuk formatting teks).
   - `src/locales/`: Kamus lokalisasi multi-bahasa (i18n) terstruktur dalam dua bahasa (Bahasa Inggris `en/` dan Bahasa Indonesia `id/`) yang dikelompokkan modular per kategori kosakata (kata umum, kalimat pesan, label tombol, placeholder input).
   - `src/middleware.ts`: Interceptor SSR SolidStart yang bertindak sebagai auth guard di level server untuk memeriksa token cookie sebelum merender rute terproteksi.
   - `src/routes/`: Sistem perutean berbasis berkas (_file-based routing_) bawaan SolidStart. Memetakan struktur file ke URL aplikasi (`/app/*` untuk area terproteksi dashboard, `/auth/*` untuk alur login/otentikasi publik, dan endpoint API server).
   - `src/stores/`: Client state management sesi global berbasis Zustand (`solid-zustand`), menyimpan state per-sesi pengguna seperti profil login, daftar navigasi menu aktif, dan izin akses pengguna.
   - `src/types/`: Definisi tipe data TypeScript global dan universal (`common.ts` untuk pagination metadata, parameter query filter, status umum `CommonStatusType`; `api.ts` untuk standar amplop respons `ArrayData<T>`, `CountType`, dan `MutationProps`).

**Fitur/modul utama (arsitektur modular):** `auth` (autentikasi & sesi pengguna), `dashboard` (ringkasan & visualisasi metrik), `user-management` (sub-feature: `user`, `role`, `permission`), `settings` (pengaturan & preferensi sistem), serta modul domain bisnis utama lainnya sesuai kebutuhan PRD.

**Path Alias Wajib:** Semua import internal **wajib** menggunakan path alias `~` (= `src/`). Dilarang keras menggunakan relative import bertingkat (`../` atau `../../`), baik dalam kode fitur, komponen, data layer, utilitas, maupun pengujian.

**Aturan kepemilikan:**

- `src/components/ui/` dan `src/hooks/` adalah kode milik proyek (copy-paste), boleh dimodifikasi, tapi ubah dengan hati-hati karena dipakai lintas fitur.
- Logic API **tidak boleh** di luar folder fitur masing-masing (kecuali shared option/dropdown queries dan upload utility yang berada di `src/lib/data/`).

---

## 4. Alur Data — Pola 3 Lapisan

> [!IMPORTANT]
> **Pemisahan Data Fitur vs Shared Option (Global Data Layer)**:
>
> - Query dan mutasi yang spesifik untuk domain fitur tertentu (List terpaginasi, Detail by ID, Create, Update, Delete, Count, Export) **wajib berada di `features/[fitur]/lib/data/`**.
> - Query yang menyediakan data referensi bersama untuk kebutuhan dropdown / pilihan opsi lintas form (terutama endpoint `/all/` yang mengembalikan `Array<T>`) **wajib ditempatkan di `src/lib/data/`** (`endpoint/`, `api/`, `query-keys/`, `service/`). Hal ini mencegah ketergantungan silang (_cross-feature imports_) dan _circular dependencies_.

Setiap fitur punya folder `lib/data/` berisi **3 lapisan inti** + **2 folder pendukung** (`query-keys/`, `mock/`):

```
Komponen / Page
   ↓ memanggil hook dari
features/[fitur]/lib/data/service/      ← Layer 3: TanStack Query hooks
   ↓ memanggil fungsi dari                   ↘ memakai keys dari
features/[fitur]/lib/data/api/            features/[fitur]/lib/data/query-keys/  ← key factory TanStack Query
   ↓ memakai path dari
features/[fitur]/lib/data/endpoint/     ← Layer 1: URL constants saja

features/[fitur]/lib/data/mock/         ← data dummy + hook `*Mock` (sementara, selama API backend belum ada)
```

| Folder        | Isi                                                         | Wajib?                    |
| ------------- | ----------------------------------------------------------- | ------------------------- |
| `endpoint/`   | URL constants                                               | Ya                        |
| `api/`        | Fungsi HTTP (satu-satunya yang memanggil `http`)            | Ya                        |
| `query-keys/` | Key factory untuk `queryKey` TanStack Query                 | Ya                        |
| `service/`    | Hook `useGet…` / `useCreate…` / `useUpdate…` / `useDelete…` | Ya                        |
| `mock/`       | Data dummy + hook `useGet…Mock` untuk pengembangan UI       | Hanya jika API belum siap |

**Komponen tidak boleh memanggil `http` langsung.**

### 4.1 Layer 1 — endpoint

```typescript
// features/product/lib/data/endpoint/index.ts
export const PRODUCT_ENDPOINT = {
  LIST: "/product/",
  CREATE: "/product/",
  DETAIL: (id: string) => `/product/detail/?id=${id}`,
  UPDATE: (id: string) => `/product/?id=${id}`,
  DELETE: (id: string) => `/product/?id=${id}`,
  EXPORT: "/product/export/",
  COUNT: "/product/count/",
} as const;
```

### 4.2 Layer 2 — api

Hanya berisi fungsi HTTP. Key TanStack Query **tidak** didefinisikan di sini (lihat [§4.3](#43-query-keys)).

```typescript
// features/product/lib/data/api/index.ts
import { http } from "~/config/http";
import { API_APP } from "~/config/prefix";
import { PRODUCT_ENDPOINT } from "~/features/product/lib/data/endpoint";
import type { ProductType } from "~/features/product/types/schema";
import type { ArrayData } from "~/types/api";
import type { FilterParams } from "~/types/common";

export const getProductList = (params?: Omit<FilterParams, "limit">) =>
  http.get<ArrayData<ProductType>>(`${API_APP}${PRODUCT_ENDPOINT.LIST}`, {
    params,
  });

export const createProduct = (payload: FormData) =>
  http.post<FormData, ProductType>(
    `${API_APP}${PRODUCT_ENDPOINT.CREATE}`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
```

Semua fungsi API **wajib** punya return type eksplisit.

### 4.3 Query Keys

Folder `query-keys/` menyimpan **key factory** — satu objek per entitas yang menghasilkan `queryKey` untuk TanStack Query. Dipisah dari `api/` agar key bisa dipakai bersama oleh hook `service/` (dan nanti untuk invalidasi cache) tanpa mengimpor fungsi HTTP.

```typescript
// features/product/lib/data/query-keys/index.ts
import { API_APP } from "~/config/prefix";
import { PRODUCT_ENDPOINT } from "~/features/product/lib/data/endpoint";
import type { CountParams, FilterParams } from "~/types/common";

export const productQueryKeys = {
  list: (params?: Omit<FilterParams, "limit">) =>
    [`${API_APP}${PRODUCT_ENDPOINT.LIST}`, params] as const,
  detail: (id: string) =>
    [`${API_APP}${PRODUCT_ENDPOINT.DETAIL(id)}`] as const,
  count: (params?: CountParams) =>
    [`${API_APP}${PRODUCT_ENDPOINT.COUNT}`, params] as const,
};
```

Aturan:

- Elemen pertama key = URL lengkap (`API_APP` + endpoint), elemen berikutnya = params / id yang memengaruhi hasil query.
- Satu factory per entitas, satu method per jenis query (`list`, `detail`, `count`, …). Gunakan `as const`.
- Setiap `createQuery` di `service/` **wajib** memakai key dari factory — jangan menulis array key inline.
- Factory hanya mengimpor dari `~/features/[fitur]/lib/data/endpoint`, `~/config/prefix`, dan `~/types` (tidak boleh mengimpor `api/` atau `service/`).

### 4.4 Mock Data

Folder `mock/` dipakai untuk **data dummy ketika API backend belum tersedia**, sehingga UI (list, filter, pagination, detail) tetap bisa dikembangkan dan di-review tanpa menunggu backend.

```
features/[fitur]/lib/data/mock/
├── index.ts            ← barrel: export * from "~/features/[fitur]/lib/data/mock/dummy-[fitur]"
└── dummy-[fitur].ts    ← data + helper + hook mock
```

Isi `dummy-[fitur].ts` (contoh: `features/product/lib/data/mock/dummy-product.ts`):

| Export                              | Fungsi                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `DUMMY_[ENTITIES]`                  | Array data dummy bertipe schema asli (`Array<BaseProductType>`) — data realistis  |
| `generateDummy[Entities](count)`    | Generator data dalam jumlah besar (stress-test tabel/pagination)                  |
| `getDummy[Entity]Paginated(params)` | Simulasi respons backend `ArrayData<T>` — mendukung `search`, `page`, `page_size` |
| `useGet[Entity]ListMock(...)`       | Hook pengganti `useGet[Entity]List` — signature & bentuk return **sama persis**   |
| `useGet[Entity]CountMock(...)`      | Hook pengganti `useGet[Entity]Count`                                              |

```typescript
// features/product/lib/data/mock/dummy-product.ts (ringkas)
export const DUMMY_PRODUCTS: Array<BaseProductType> = [
  { id: "prd-001", name: "Wireless Mechanical Keyboard", price: 1250000 /* … */ },
];

export const getDummyProductPaginated = (
  params?: Omit<FilterParams, "limit">,
  sourceData: Array<BaseProductType> = DUMMY_PRODUCTS,
): ArrayData<BaseProductType> => {
  /* filter search → hitung counts/page_count → slice per halaman */
};

export const useGetProductListMock = ({
  params,
  enabled,
  onSuccess,
}: {
  params: Accessor<Omit<FilterParams, "limit">>;
  enabled?: Accessor<boolean>;
  onSuccess?: (data: ArrayData<BaseProductType>) => void;
}) =>
  createQuery(() => ({
    queryKey: ["mock-product-list", params()], // prefix "mock-"
    queryFn: async () => ({ data: getDummyProductPaginated(params()) }), // bentuk respons axios
    select: (response) => {
      onSuccess?.(response.data);
      return response.data;
    },
    get enabled() {
      return enabled ? enabled() : true;
    },
  }));
```

Aturan:

- **Sementara.** Mock hanya untuk fase sebelum endpoint backend siap. Cek [`API.md`](./API.md) — jika endpoint sudah ada, pakai hook asli.
- **Signature sama dengan hook asli** dan `queryFn` mengembalikan `{ data: … }` (bentuk respons axios) agar `select` identik. Dengan begitu pergantian mock → asli cukup mengganti **satu import hook** di komponen; tidak ada perubahan lain.
- **Prefix `mock-`** pada `queryKey` mock agar tidak bentrok dengan cache key asli.
- Mock **tidak boleh** memanggil `http` dan **tidak boleh** diimpor dari luar fiturnya sendiri.
- Data dummy memakai **type schema asli** (`types/schema.ts`) — jika kontrak API berubah, TypeScript langsung menandai mock yang usang.
- Gunakan data yang realistis sesuai domain bisnis fitur (nama produk, kategori, harga, atau profil yang representatif), bukan placeholder acak seperti "foo" atau "test".
- Setelah API siap: ganti import ke hook asli. File `mock/` boleh dipertahankan (mis. untuk unit test) atau dihapus — tapi jangan dibiarkan dipakai di komponen produksi.

### 4.5 Layer 3 — service

Hook TanStack Query. Key diambil dari `query-keys/`; `queryFn` mengembalikan respons axios dan `select` mengambil `.data` (sambil memanggil `onSuccess` opsional).

```typescript
// features/product/lib/data/service/index.ts
import { createMutation, createQuery } from "@tanstack/solid-query";
import type { AxiosError } from "axios";
import type { Accessor } from "solid-js";
import { createProduct, getProductList } from "~/features/product/lib/data/api";
import { productQueryKeys } from "~/features/product/lib/data/query-keys";
import type { ProductType } from "~/features/product/types/schema";
import type { ArrayData, ErrorType, MutationProps } from "~/types/api";
import type { FilterParams } from "~/types/common";

export const useGetProductList = ({
  params,
  enabled,
  onSuccess,
}: {
  params: Accessor<Omit<FilterParams, "limit">>;
  enabled?: Accessor<boolean>;
  onSuccess?: (data: ArrayData<ProductType>) => void;
}) =>
  createQuery(() => ({
    queryKey: productQueryKeys.list(params()),
    queryFn: async () => await getProductList(params()),
    select: (response) => {
      if (onSuccess) onSuccess(response.data);
      return response.data;
    },
    get enabled() {
      return enabled ? enabled() : true;
    },
  }));

export const useCreateProduct = (props: MutationProps) =>
  createMutation(() => ({
    mutationFn: async (data: FormData) => await createProduct(data),
    onSuccess: () => props.onSuccess?.(),
    onError: (error: ErrorType<AxiosError>) => props.onError?.(error),
  }));
```

### 4.6 Naming

| Tipe              | Pattern                                                                                   | Contoh                            |
| ----------------- | ----------------------------------------------------------------------------------------- | --------------------------------- |
| URL constants     | `[ENTITIES]_ENDPOINT`                                                                     | `PRODUCT_ENDPOINT`                |
| Query key factory | `[entity]QueryKeys` (folder `query-keys/`)                                                | `productQueryKeys`                |
| API function      | `get[E]List` `get[E]Detail` `getAll[E]` `get[E]Count` `create[E]` `update[E]` `delete[E]` | `getProductList`                  |
| Query hook        | `useGet[E]List` / `useGet[E]Detail`                                                       | `useGetProductList`               |
| Mutation hook     | `useCreate[E]` / `useUpdate[E]` / `useDelete[E]`                                          | `useCreateProduct`                |
| Mock data         | `DUMMY_[ENTITIES]` (folder `mock/`)                                                       | `DUMMY_PRODUCTS`                  |
| Mock generator    | `generateDummy[Entities]`                                                                 | `generateDummyProducts`           |
| Mock paginate     | `getDummy[Entity]Paginated`                                                               | `getDummyProductPaginated`        |
| Mock hook         | `[hookAsli]Mock`                                                                          | `useGetProductListMock`           |
| Mock query key    | `"mock-[entity]-[jenis]"` (inline di hook mock)                                           | `["mock-product-list", params()]` |

#### 4.6.1 Konvensi Penamaan Tipe Data (Interface & Type)

| Kategori Tipe Data   | Pattern                                                   | Contoh                                                    |
| -------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Global Model         | `Base[Entity]Type`                                        | `BaseUserType`, `BaseRoleType`, `BaseProductType`         |
| Model Tabel/List     | `[Entity]Type`                                            | `UserType`, `RoleType`, `ProductType`, `CustomerType`     |
| Dropdown/Shared Item | `[Entity]ItemType`                                        | `RoleItemType`, `CategoryItemType`, `DepartmentItemType`  |
| Mutation Response    | `[Entity]MutationResponseType`                            | `UserMutationResponseType`, `ProductMutationResponseType` |
| Sub-Feature (Nested) | `[ParentEntity][Entity]Type`                              | `UserManagementRoleType`, `MasterDataCategoryType`        |
| Detail Model         | `Detail[Entity]Type` / `Detail[ParentEntity][Entity]Type` | `DetailUserType`, `DetailMasterDataCategoryType`          |
| Parameters (Query)   | `[Entity]Params` / `[Entity]AllParams`                    | `FilterParams`, `StatusParams`, `UserAllParams`           |
| Form & Valibot       | `[Entity]Schema` & `[Entity]Input`                        | `CreateUserSchema` & `CreateUserInput`, `ProductSchema`   |

> [!IMPORTANT]
> **Penempatan Detail Model, Mutation Response, & Larangan Backward Compatibility Aliases**:
>
> 1. **Detail Model & Mutation Response Wajib di Fitur Lokal**: Seluruh model detail (`Detail[Entity]Type` / `Detail[ParentEntity][Entity]Type`) serta model respon mutasi (`[Entity]MutationResponseType`) **dilarang diletakkan di direktori global `src/types/schema/`**, melainkan wajib ditempatkan di direktori tipe lokal modulnya masing-masing (`features/.../types/schema.ts`). Direktori global `src/types/schema/` hanya menampung model universal (`Base[Entity]Type`) dan item dropdown bersama (`[Entity]ItemType`).
> 2. **Larangan Backward Compatibility Aliases**: Dilarang membuat alias tipe data (`export type OldName = NewName;`) saat melakukan refactoring nama tipe data. Perbarui langsung seluruh file konsumen yang menggunakannya ke nama tipe baru yang baku. Pengecualian hanya diizinkan jika terdapat alasan teknis khusus yang memang mengharuskan dan disetujui eksplisit oleh developer / pemilik proyek.

### 4.7 HTTP Client (`~/config/http.ts`)

- Class `Http` membungkus axios; Bearer token otomatis dari cookie `token`.
- 401 → `axios-auth-refresh` panggil `POST /api/core/auth/refresh-token/` → retry request.
- Refresh gagal → hapus cookie + `localStorage.clear()` → redirect `/auth/request-login`.
- Base URL dari `VITE_API_URL`.
- Prefix: `API_CORE = "/api/core"` (auth, user, permission, menu), `API_APP = "/api/v1"` (entitas bisnis).

---

## 5. State Management

| Jenis state                         | Tool                           | Lokasi         | Contoh                               |
| ----------------------------------- | ------------------------------ | -------------- | ------------------------------------ |
| Server state                        | TanStack Solid Query           | `service/`     | list produk, detail entitas          |
| Global per-sesi                     | Zustand (`solid-zustand`)      | `src/stores/`  | profile, permission, menu, dark mode |
| Event/transaksional lintas komponen | Solid Context                  | `src/context/` | translation, breadcrumb              |
| Lokal                               | `createSignal` / `createStore` | di komponen    | state form, modal buka/tutup         |

- Naming store: `[entity].store.ts`. Storage key: `{APP_NAME}:{storeName}` → `app:auth`, `app:permission`, `app:ui`.
- Dark mode: `ui.store.ts` toggle class `.dark` di `document.documentElement`; default **light-first**.
- Permission di komponen: `parsePermission("Product").includes("create")` — **sembunyikan** (bukan disable) tombol jika tidak berizin.

---

## 6. Forms & Validasi

- Library: `@formisch/solid` + `valibot`. **Urutan alur:** definisikan skema Valibot terlebih dahulu di `*.validation.ts`, baru bangun komponen form di `*.form.tsx`.
- **Aturan Penyatuan vs Pemisahan File**:
  - **Satu File (Standar / Default)**: Form **create dan update dijadikan satu file** karena base field-nya sama. Mode create vs update dibedakan melalui props (misal `props.isUpdate` dan `props.id`), di mana mode update memicu pengambilan detail data via `useGet[Entity]Detail` dan mengisi form dengan `setInput(form, ...)`.
  - **Dipisah File (Pengecualian)**: Form create dan update **hanya dipisah** menjadi file terpisah (`create-[fitur].form.tsx` dan `update-[fitur].form.tsx`) **jika tampilan (UI layout / alur antarmuka) antara create dan update berbeda signifikan** (misalnya create berupa wizard bertahap sedangkan update berupa tab flat, atau struktur field/section-nya jauh berbeda).

### 6.1 Struktur Folder Form

**Pola Standar (Satu File — Base Fields Sama):**

```
features/[fitur]/components/form/
├── index.ts
├── [fitur].form.tsx          ← Menangani create & update sekaligus
└── [fitur].validation.ts    ← Schema validasi Valibot tunggal
```

**Pola Pengecualian (Dipisah File — Tampilan Berbeda):**

```
features/[fitur]/components/form/
├── index.ts
├── create-[fitur].form.tsx
├── create-[fitur].validation.ts
├── update-[fitur].form.tsx
└── update-[fitur].validation.ts
```

### 6.2 Contoh Implementasi Skema Validasi (`*.validation.ts`)

```typescript
// features/product/components/form/product.validation.ts
import * as v from "valibot";

export const ProductVariantSchema = v.object({
  sku: v.pipe(v.string(), v.minLength(1, "SKU is required")),
  name: v.pipe(v.string(), v.minLength(1, "Variant name is required")),
  price: v.pipe(v.number(), v.minValue(0, "Price must be non-negative")),
});

export const ProductSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Product name is required")),
  code: v.pipe(v.string(), v.minLength(1, "Product code is required")),
  category_id: v.pipe(v.string(), v.minLength(1, "Category is required")),
  description: v.optional(v.string()),
  thumbnail: v.optional(v.instance(File)),
  variants: v.array(ProductVariantSchema),
  status: v.optional(v.boolean()),
});

export type ProductInput = v.InferInput<typeof ProductSchema>;
```

### 6.3 Contoh Implementasi Form Terpadu (`*.form.tsx`)

```tsx
// features/product/components/form/product.form.tsx (pola satu file)
import { createForm, Field, Form, setInput } from "@formisch/solid";
import { createEffect, on } from "solid-js";
import { Button } from "~/components/ui/button";
import { appendFormData } from "~/lib/utils";
import {
  ProductSchema,
  type ProductInput,
} from "~/features/product/components/form/product.validation";
import {
  useCreateProduct,
  useGetProductDetail,
  useUpdateProduct,
} from "~/features/product/lib/data/service";

interface FormProps {
  id?: string;
  isUpdate?: boolean;
  onSuccess?: () => void;
}

export const ProductForm = (props: FormProps) => {
  const form = createForm({
    schema: ProductSchema,
    initialInput: {
      status: true,
      variants: [{ sku: "", name: "", price: 0 }],
    },
  });

  // Ambil detail data jika dalam mode edit/update
  const detailQuery = useGetProductDetail({
    id: () => (props.isUpdate ? props.id : ""),
    enabled: () => !!props.isUpdate && !!props.id,
  });

  // Isi data ke form saat detail data siap
  createEffect(
    on(
      () => detailQuery.data,
      (data) => {
        if (props.isUpdate && data) {
          setInput(form, { path: ["name"], input: data.name });
          // setInput field lainnya...
        }
      },
    ),
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = () => createMutation.isPending || updateMutation.isPending;
  const isFormDisabled = () => isPending() || !!(props.isUpdate && detailQuery.isLoading);

  const handleSubmit = async (data: ProductInput) => {
    if (isPending()) return;

    const formData = new FormData();
    appendFormData(formData, data);

    if (props.isUpdate) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
    props.onSuccess?.();
  };

  return (
    <Form of={form} onSubmit={handleSubmit} class="flex flex-col gap-4">
      <fieldset disabled={isFormDisabled()} class="flex flex-col gap-4">
        <Field of={form} path={["name"]}>
          {(field) => (
            <div>
              <input {...field.props} value={field.input ?? ""} />
              {field.error && (
                <span class="text-destructive text-xs">{field.error}</span>
              )}
            </div>
          )}
        </Field>
      </fieldset>
      <div class="flex items-center justify-end gap-2">
        <Button variant="outline" type="button" disabled={isPending()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isFormDisabled()}>
          {isPending() ? "Saving..." : props.isUpdate ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </Form>
  );
};
```

### 6.4 Aturan Esensial Form

1. **Error Validasi Inline**: Selalu tampilkan pesan error tepat di bawah field yang bermasalah. Dilarang menampilkan error validasi form menggunakan Toast.
2. **Pengiriman Multipart / FormData**: Selalu gunakan helper `appendFormData(formData, data)` dari `~/lib/utils` untuk serialisasi payload ke backend.
3. **Standar Lengkap Pending & Submitting State (Proteksi Formulir Terpadu)**:
   Saat proses mutasi/submit sedang berjalan (`isPending()` aktif) atau saat proses pengambilan detail awal (`detailQuery.isLoading` pada mode edit), formulir wajib menerapkan proteksi terpadu pada seluruh elemen interaktif, **tidak hanya pada tombol submit**:
   - **Tombol Submit**: Wajib `disabled={isPending()}` dan menampilkan feedback visual loading (ikon spinner animasi dan/atau label dinamis, misal *"Menyimpan..."* atau *"Updating..."*).
   - **Tombol Aksi Sekunder (Batal / Reset / Kembali)**: Wajib `disabled={isPending()}` untuk mencegah pengguna membatalkan, mereset form, atau bernavigasi keluar saat transmisi data sedang berlangsung di latar belakang.
   - **Seluruh Kontrol Input (Input, Select, Textarea, Checkbox, Switch, File Upload, Date Picker)**: Wajib dinonaktifkan (`disabled`) selama `isPending()` aktif untuk mencegah manipulasi data yang sedang dikirim. Pola terbaik dan paling efisien adalah membungkus blok form dengan elemen `<fieldset disabled={isPending()}>` (standar native HTML).
   - **Proteksi Dialog / Modal (Dismissal Guard)**: Jika form berada di dalam modal dialog atau drawer, interaksi penutupan luar (*click-outside / backdrop dismissal* dan tombol close 'X') wajib dinonaktifkan selama `isPending()` aktif guna mencegah modal tertutup sepihak saat permintaan HTTP masih diproses di server.
   - **Loading State Pengambilan Data Awal (Edit/Hydration Mode)**: Pada mode update saat `detailQuery.isLoading` aktif, seluruh kontrol form wajib dinonaktifkan atau menampilkan skeleton loading hingga data selesai diambil dan terisi ke form via `setInput(...)`, guna mencegah pengguna mengedit input yang belum terhidrasi penuh.
   - **Double-Submit Guard di Level Handler**: Tambahkan guard eksplisit pada fungsi submit: `if (isPending()) return;` sebelum memulai mutasi untuk mencegah duplikasi request akibat *rapid clicking*.
4. **Pola Visual**: Ikuti panduan visual token dan spacing form pada [`DESIGN.md` §10](./DESIGN.md).

---

## 7. i18n

- `@solid-primitives/i18n` via `TranslationContext` (`src/context/translation-context.tsx`). Locale `en` (default) & `id`, disimpan di cookie `lang`.
- Pakai: `const { t } = useTranslation(); t("word.status")`.
- Key: `[category].[key]` — kategori `word`, `sentence`, `button`, `placeholder`.
- Setiap key **wajib** ada di `locales/en/` **dan** `locales/id/`.

---

## 8. Autentikasi & Permission

### 8.1 Alur Autentikasi & Manajemen Sesi

```
Pengguna Login → Token & refresh_token disimpan dalam Cookie HTTP (prefix: {env}_{project}_{name}, mis. dev_app_token)
               → middleware.ts mengintersepsi setiap request di level server (SSR):
                   • Mengakses /app/* tanpa token valid  → Redirect otomatis ke /auth/login
                   • Mengakses /auth/* dengan token valid → Redirect otomatis ke /app/dashboard
```

- **Enkapsulasi Cookie**: Akses pembacaan, penyimpanan, dan penghapusan token cookie wajib melalui modul helper [`~/config/cookies`](./src/config/cookies.ts) (`Cookies.get`, `Cookies.set`, `Cookies.remove`, `Cookies.getAuthToken`) — dilarang mengakses API cookie mentah (`js-cookie` atau `document.cookie`) secara langsung.
- **Auto-Refresh Token (401 Interceptor)**: Instance HTTP Axios (`~/config/http.ts`) dilengkapi interceptor `axios-auth-refresh`. Jika request mengembalikan status 401 (Unauthorized), sistem otomatis memanggil endpoint refresh token (`POST /api/core/auth/refresh-token/`) dan me-retry request awal secara transparan. Jika refresh gagal, seluruh sesi dan token dihapus, lalu pengguna dialihkan ke halaman login.
- **Client Session State**: State sesi aktif (profil pengguna, status otentikasi, dan daftar izin hak akses) dikelola secara reaktif pada client store (`src/stores/auth.store.ts`).

### 8.2 Model Kontrol Akses & Hirarki Permission (RBAC Modular)

Sistem otorisasi dirancang fleksibel untuk mengakomodasi kebutuhan bisnis aplikasi dari skala sederhana hingga granular, dengan model hierarki hingga **3 level (Group → Role → User)**:

1. **Group Level (Organisasi / Departemen / Unit Kerja)**:
   - Menetapkan batas izin dasar (_baseline permissions_) yang berlaku umum untuk seluruh anggota dalam satu kelompok kerja, unit, atau tenant organisasi.
2. **Role Level (Peran Fungsional)**:
   - Menentukan hak akses spesifik berdasarkan tanggung jawab jabatan atau peran pengguna dalam sistem (misal: `Admin`, `Manager`, `Staff`, `Auditor`, `Viewer`).
3. **User Level (Hak Akses Individual / Custom Overrides)**:
   - Memberikan fleksibilitas penambahan hak akses khusus (_grant_) atau pembatasan tertentu (_restriction_) langsung pada akun pengguna individual, tanpa harus membuat role baru di sistem.

**Struktur Atribut & Resolusi Hak Akses:**
- **Atribut Aksi Standar**: `view` (melihat data), `create` (membuat data), `update` (mengubah data), `delete` (menghapus data), serta aksi domain khusus jika dibutuhkan (seperti `export`, `approve`, `download`) atau wildcard `*` (akses penuh ke seluruh aksi modul).
- **Format Normalisasi String Izin**: Izin hak akses dinormalisasi dalam format `[module]:[action]` (contoh: `product:view`, `user:create`, `report:export`).
- **Pengecekan Izin di Komponen**:
  Gunakan fungsi utilitas otorisasi dari `~/lib/utils/permission`:
  ```typescript
  import { hasPermission, parsePermission } from "~/lib/utils/permission";
  import { useAuthStore } from "~/stores/auth.store";

  const auth = useAuthStore();

  // Memeriksa hak aksi spesifik
  const canCreateProduct = hasPermission(auth.permissions, "product", "create");

  // Mendapatkan seluruh daftar aksi yang diizinkan untuk modul tertentu
  const productActions = parsePermission("product", auth.permissions);
  ```
- **Prinsip Tampilan UI**: Elemen kontrol aksi (seperti tombol Create, Edit, Delete, atau menu navigasi) **wajib disembunyikan** (bukan sekadar di-_disable_) jika pengguna tidak memiliki izin akses yang valid, guna menjaga keamanan antarmuka dan kepuasan pengalaman pengguna.

### 8.3 Feature Flags & Aktivasi Modul

- Setiap modul dapat diaktifkan atau dinonaktifkan secara dinamis menggunakan environment variable `VITE_ENABLE_MODULE_[NAME]` yang dibaca melalui objek konfigurasi `MODULE_ACTIVE_CONFIG` pada `src/config/app.ts`.
- Navigasi menu utama dan rute halaman secara otomatis menyaring modul yang statusnya tidak aktif.

---

## 9. Strategi Pengujian (Testing Architecture)

Arsitektur aplikasi mengadopsi model **Testing Pyramid** dengan pemisahan tegas antara pengujian logika murni (Unit Testing), interaksi state/API (Integration Testing), dan pengujian alur pengguna nyata (End-to-End Testing).

### 9.1 Piramida Pengujian & Pembagian Tanggung Jawab

| Level Pengujian      | Target Cakupan                                                                                                                                   | Runner / Framework              | Lokasi File                                          |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ | :--------------------------------------------------- |
| **Unit Test**        | Logika murni: fungsi utilitas (`src/lib/utils/`), skema validasi Valibot (`*.validation.ts`), transformer data, dan state store sederhana.       | Vitest (`vitest`)               | Co-located di samping file sumber (`[name].test.ts`) |
| **Integration Test** | Data layer: HTTP client interceptors (`src/config/http.ts`), error formatter (`formatApiError`), query hooks dengan mock API service.            | Vitest + vi mocks / MSW         | Co-located di samping service/api (`[name].test.ts`) |
| **End-to-End (E2E)** | Pengujian alur browser nyata: Autentikasi (login/logout), proteksi rute (SSR middleware guard), serta alur CRUD kritis form & tabel data entitas. | Playwright (`@playwright/test`) | Direktori khusus di root: `e2e/[flow].spec.ts`       |

### 9.2 Arsitektur Unit & Integration Testing (Vitest)

1. **Isolasi Konfigurasi (`vitest.config.ts`)**:
   - Menghindari penggunaan plugin server SolidStart dan Nitro pada saat unit test dijalankan, karena plugin server tersebut menyalakan worker background yang menyebabkan proses Vitest menggantung (_hanging timeout_).
   - Menggunakan konfigurasi terpisah `vitest.config.ts` yang mendefinisikan alias path `~` ke `./src` dan environment `node` (atau `jsdom` jika menguji interaksi DOM).
2. **Pola Co-location**:
   - File unit test diletakkan berdampingan dengan unit yang diuji:
     - `src/lib/utils/text.ts` → `src/lib/utils/text.test.ts`
     - `src/lib/utils/permission.ts` → `src/lib/utils/permission.test.ts`
     - `src/features/auth/components/form/signin.validation.ts` → `src/features/auth/components/form/signin.validation.test.ts`
3. **Data Layer Mocking**:
   - Pengujian komponen dan hook service memanfaatkan mock yang sudah distandarisasi di direktori `mock/` per fitur (misal `features/product/lib/data/mock/`).
4. **Pengujian Khusus Pola 3 Lapisan Data (`endpoint/`, `api/`, `service/`)**:
   - **Layer 1 (`endpoint/`) & `query-keys/`**: Diuji dengan unit test untuk memverifikasi URL path template (statis maupun dinamis dengan dynamic ID parameter), query params mapping, dan integritas struktur array `queryKey`.
   - **Layer 2 (`api/`)**: Diuji menggunakan `vi.mock("~/config/http")` dari Vitest untuk memastikan pemanggilan method HTTP (GET, POST, PUT, DELETE), endpoint path, parameter filter, header (terutama `multipart/form-data` untuk FormData), dan penanganan error `formatApiError()` dieksekusi dengan tepat tanpa memanggil backend.
   - **Layer 3 (`service/`)**: Diuji menggunakan mocking konfigurasi `@tanstack/solid-query` (`createQuery`, `createMutation`) dan Layer 2 API untuk memastikan `queryKey`, unwrap data via `select`, eksekusi callback `onSuccess`/`onError`, serta guard evaluasi reaktivitas `enabled`. Mutasi juga dapat diuji untuk memastikan eksekusi invalidasi cache (`queryClient.invalidateQueries(...)`) dengan queryKey yang tepat agar data pada tabel ter-refresh secara otomatis.

### 9.3 Arsitektur End-to-End Testing (Playwright)

1. **Struktur Direktori**: Seluruh tes E2E ditempatkan di luar folder aplikasi (`e2e/`), misalnya:
   - `e2e/auth.spec.ts` (uji coba login valid/invalid, redirect dashboard, logout).
   - `e2e/guard.spec.ts` (uji proteksi URL `/app/*` saat cookie token tidak tersedia).
   - `e2e/product-crud.spec.ts` (uji navigasi, form create produk, validasi error inline, hingga dialog konfirmasi hapus).
2. **Web Server Orchestration**:
   - Playwright menjalankan server lokal via `webServer` config (`pnpm preview` atau `pnpm dev`) sebelum suite pengujian dimulai.

### 9.4 Standar Skenario Pengujian: Dual-Scenario Rule (Positive & Negative Testing)

Untuk mencegah _false sense of security_, seluruh pengujian **wajib** mencakup dua jenis skenario pengujian secara berpasangan:

1. **Positive Testing (Happy Path)**:
   - Memvalidasi bahwa alur kerja normal dan data yang valid menghasilkan luaran yang diharapkan.
   - Menguji pemenuhan fitur terhadap requirement fungsional dasar (_"Apakah sistem melakukan apa yang seharusnya dilakukan?"_).
2. **Negative Testing (Unhappy Path & Edge Cases)**:
   - Memvalidasi ketahanan (_robustness_) sistem saat menerima data yang tidak valid, nilai kosong/ekstrem (_boundary values_), otorisasi ditolak, atau kegagalan jaringan/server.
   - Memastikan aplikasi menolak operasi tidak sah secara terkontrol (_graceful failure_), menampilkan pesan error yang ramah dan presisi, serta **dilarang keras crash, freeze, atau menampilkan blank screen**.

#### Matriks Implementasi Skenario Wajib per Level Pengujian

| Level Pengujian                    | Target Cakupan    | Skenario Positif (Happy Path)                                                                                                    | Skenario Negatif (Unhappy Path / Edge Cases)                                                                                                                                         |
| :--------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit Test (Fungsi Utilitas)**    | `src/lib/utils/*` | Input valid mengembalikan hasil pemrosesan/transformasi yang tepat (misal: formatting uang, pemotongan teks, kalkulasi diskon). | Menerima input `null`, `undefined`, string kosong, karakter spesial ekstrem, atau tipe data di luar spesifikasi tanpa melempar unhandled exception.                                  |
| **Unit Test (Skema Valibot)**      | `*.validation.ts` | Objek input lengkap dan sesuai aturan lolos `safeParse(...)` dengan status `success: true`.                                      | Field wajib kosong, format email/regex salah, nilai di bawah min / di atas max menghasilkan `success: false` beserta pesan error validasi yang spesifik.                             |
| **Integration Test (API Layer 2)** | `lib/data/api/*`  | Mock response HTTP 200/201 berhasil di-parse dan me-return typed data sesuai interface response.                                 | Mock response HTTP 400, 401, 404, 500, atau network timeout tertangkap secara benar oleh `formatApiError()` dan melempar error terformat tanpa memutus eksekusi aplikasi.            |
| **End-to-End (E2E Playwright)**    | `e2e/*.spec.ts`   | User login dengan kredensial valid, navigasi antar rute berhasil, submit form sukses dan modal/drawer tertutup otomatis.         | Akses rute terproteksi tanpa token diblokir (redirect ke `/signin`), submit form kosong menampilkan error inline di bawah field, tombol destruktif dibatalkan via dialog konfirmasi. |

#### 9.4.1 Protokol Penyelarasan Skenario AI Agent (Pre-Test Scenario Alignment)

Sebelum menulis atau mengimplementasikan kode pengujian (Unit, Integration, atau E2E), AI Agent diwajibkan untuk:

1. Menyusun dan memaparkan daftar rekomendasi skenario pengujian secara transparan (mencakup rincian skenario Positif/Happy Path dan Negatif/Unhappy/Edge Case).
2. Meminta konfirmasi developer mengenai pendekatan skenario yang akan digunakan melalui 3 opsi pilihan:
   - **Opsi A**: Mengikuti seluruh rekomendasi skenario dari AI Agent.
   - **Opsi B**: Menggunakan daftar skenario spesifik yang telah dirancang sendiri oleh developer.
   - **Opsi C**: Menggabungkan rekomendasi AI Agent dengan skenario tambahan dari developer.
3. Hanya melanjutkan penulisan kode testing setelah developer memberikan arahan atau persetujuan terhadap skenario tersebut.

---

## 10. Keputusan Teknis (ADR Ringkas)

| #   | Keputusan                                                     | Alasan                                                                                                  | Konsekuensi                                                                                      |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1   | SolidJS + SolidStart (SSR)                                    | Reaktivitas fine-grained, performa; SSR dibutuhkan untuk auth guard di middleware                       | Pola React (`useState`/`useEffect`) dilarang                                                     |
| 2   | Struktur feature-based                                        | Satu fitur = satu folder; mudah menambah/menonaktifkan modul                                            | Tidak ada logic API di luar folder fitur                                                         |
| 3   | Pola API 3 lapis                                              | Pemisahan URL / HTTP / cache; queryKey konsisten untuk invalidasi                                       | Boilerplate lebih banyak per fitur — sengaja                                                     |
| 4   | TanStack Query untuk server state                             | Cache, dedupe, invalidation bawaan                                                                      | Server data tidak disalin ke Zustand                                                             |
| 5   | Zustand untuk state sesi, Context untuk event                 | Zustand sederhana & persist; Context cocok untuk i18n/breadcrumb                                        | Dua mekanisme — tentukan sesuai tabel §5                                                         |
| 6   | Formisch + Valibot (bukan modular-forms + Zod)                | Schema-first & type-safe, bundle lebih kecil                                                            | Jangan impor `zod` / `@modular-forms/solid`                                                      |
| 7   | Ark UI (@ark-ui/solid) + Tailwind v4 + CVA                    | Headless, accessible (WAI-ARIA compliant), performa tinggi SolidJS                                      | Komponen UI primitif dibangun di src/components/ui/ berbasis Ark UI + CVA                        |
| 8   | Tailwind v4 + token semantik OKLCH                            | Satu sumber token di CSS; tema dark/light konsisten                                                     | Tidak ada hex literal / pola Tailwind v3                                                         |
| 9   | BiomeJS utama + Prettier terbatas                             | Biome cepat untuk lint + format; Prettier dipertahankan hanya untuk urutan class Tailwind               | Tanpa ESLint/oxlint; Prettier bukan formatter umum                                               |
| 10  | `lucide-solid` tunggal                                        | Konsistensi ikon & ukuran bundle; sudah terpasang dan dipakai di kode                                   | Tanpa `solid-icons` dll                                                                          |
| 11  | Feature flag modul via `.env`                                 | Modul belum siap (misal: Analytics, Reporting) bisa dimatikan tanpa ubah kode                            | Setiap modul baru wajib didaftarkan di config                                                    |
| 12  | Cookie-based JWT + refresh otomatis                           | Dapat dibaca di SSR middleware (localStorage tidak bisa)                                                | Cookie diprefix per environment                                                                  |
| 13  | Commitlint + Commitizen (`cz-conventional-changelog`) + Husky | Menjaga histori Git terstandarisasi, bersih, dan memudahkan tracking perubahan serta changelog otomatis | Commit via CLI `pnpm git:commit`; divalidasi ganda di local hook & GitHub Actions CI             |
| 14  | Vitest untuk Unit Test + Playwright untuk E2E                 | Vitest cepat dan native dengan Vite; Playwright andal untuk browser nyata tanpa flaky timeout           | Config Vitest dipisah dari Nitro/SolidStart server agar tidak hanging; file E2E di folder `e2e/` |

---

## 11. Tata Kelola Perubahan Arsitektur (Living Document Protocol)

Dokumen ini adalah **Approved Baseline** yang dikelola sebagai **Living Document** — menjadi acuan pasti (_single source of truth_) agar pengembangan kode frontend tetap terarah, konsisten, dan bebas dari fragmentasi pola, namun **tetap adaptif dan updatable** terhadap perkembangan teknis, kebutuhan bisnis, serta feedback stakeholder.

### 11.1 Alur Pengajuan Perubahan Arsitektur (Architecture Change Protocol)

```
[ Temuan Lapangan / Feedback Stakeholder / Kebutuhan Integrasi Baru ]
                                 │
                                 ▼
                     [ 1. Inisiasi Perubahan ]
     Diajukan via Technical Discussion / Issue Tracker Proyek
                                 │
                                 ▼
                     [ 2. Analisis Dampak Teknis ]
  Evaluasi reaktivitas SolidJS, SSR safety, bundle size, & breaking changes
                                 │
                                 ▼
                   [ 3. Evaluasi & ADR Sign-Off ]
   Disetujui oleh Developer / Pemilik Proyek (dicatat dalam ADR §10)
                                 │
                                 ▼
              [ 4. Update Dokumen & Sinkronisasi Silang ]
  - Perbarui ARCHITECTURE.md (spesifikasi direktori/layer/data)
   - Catat riwayat pada Document Revision History (§12)
  - Selaraskan AGENTS.md, PRD.md, DESIGN.md, atau API.md
```

### 11.2 Prinsip Pengelolaan Arsitektur

1. **Disiplin Pola Baku (No Ad-Hoc Patterns)**: Dilarang memperkenalkan pola baru (misal state management alternatif, HTTP library lain, atau struktur form ad-hoc) tanpa melalui justifikasi dan pencatatan resmi pada ADR ([§10](#10-keputusan-teknis-adr-ringkas)).
2. **Kepatuhan Reaktivitas SolidJS**: Setiap usulan komponen atau hook baru wajib mematuhi aturan strict reaktivitas SolidJS (tidak mendestrukturisasi props, SSR guard pada akses window/DOM, serta primitif Ark UI).
3. **Penyelarasan Multi-Dokumen**: Perubahan arsitektur teknis yang berdampak pada alur koding wajib langsung diselaraskan ke [`AGENTS.md`](./AGENTS.md), perubahan visual/token ke [`DESIGN.md`](./DESIGN.md), dan perubahan kontrak payload ke [`API.md`](./API.md).
4. **Perubahan Inkremental**: Refaktor atau penyesuaian arsitektur dilakukan secara bertahap per modul/fitur tanpa mengganggu modul produksi yang sedang berjalan.

---

## 12. Document Revision History

| Versi     | Tanggal    | Inisiator / Maintainer   | Ringkasan Perubahan & Catatan                                                                                                                                                                                                                                                                                                                                                                                   |
| :-------- | :--------- | :----------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.0.6** | 6 Nov 2026 | Developer & AI Assistant | **Model Otorisasi 3 Level & Generalisasi Autentikasi (§8 & §9)**:<br>• Memperluas sistem kontrol akses menjadi 3 tingkatan hierarki (`Group` → `Role` → `User-level overrides`) untuk mendukung kebutuhan granularitas otorisasi yang fleksibel pada downstream project<br>• Menstandarisasi penjelasan arsitektur autentikasi, siklus auto-refresh token 401, SSR guard rute, enkapsulasi cookie, serta menghapus istilah-istilah kaku/spesifik template agar dokumen arsitektur siap digunakan oleh proyek produksi nyata. |
| **1.0.5** | 6 Nov 2026 | Developer & AI Assistant | **Perluasan Standar Pending State Formulir (§6.3 & §6.4)**:<br>• Memperluas cakupan proteksi status pending (`isPending()`) pada form handling: tidak hanya me-disable tombol submit, melainkan juga me-disable tombol aksi sekunder (Cancel/Reset), seluruh field input via `<fieldset disabled>`, proteksi penutupan dialog/modal (dismissal guard), guard pengambilan detail awal (`isLoading`), dan double-submit guard pada handler submit. |
| **1.0.4** | 6 Nov 2026 | Developer & AI Assistant | **Standarisasi Path Alias `~` pada Seluruh Contoh Kode (§3 & §4)**:<br>• Menghapus seluruh penggunaan relative import (`../`, `../../`, `./`) pada contoh kode arsitektur (`api/`, `query-keys/`, `service/`, `form/`) dan menggantinya dengan path alias absolut `~` (`~/features/...`)<br>• Menegaskan kembali aturan pelarangan relative import bertingkat pada §3 agar AI Agent atau kontributor tidak mengadopsi pola relative import mentah-mentah dari dokumen acuan. |
| **1.0.3** | 6 Nov 2026 | Developer & AI Assistant | **Generalisasi Seluruh Contoh Kode & Arsitektur (§4, §5, §6, §7, §9, §10)**:<br>• Menggantikan seluruh contoh entitas dan domain lama (seperti `vendor`, hauling/tambang, `DT Availability`, `kalkulasi ritase`) dengan entitas universal (`Product`, `User`, `Category`) yang representatif untuk boilerplate frontend<br>• Menyelaraskan seluruh implementasi contoh 3 lapis data (`endpoint`, `api`, `query-keys`, `mock`, `service`), form terpadu Formisch + Valibot, konvensi penamaan tipe data (§4.6.1), skenario pengujian E2E, dan contoh i18n agar konsisten dengan `AGENTS.md`. |
| **1.0.2** | 6 Nov 2026 | Developer & AI Assistant | **Deskripsi Fungsional & Tanggung Jawab Direktori (§3 & §3.1)**:<br>• Memperbarui diagram pohon struktur direktori agar setiap folder dijelaskan fungsi, tanggung jawab arsitektural, dan peruntukannya (bukan sekadar daftar nama file spesifik)<br>• Menyelaraskan seluruh sub-bagian penjelasan §3.1 (mencakup `config/`, `context/`, `locales/`, `routes/`, `stores/`, `types/`, `lib/`) dan membersihkan remnan contoh modul domain lama. |
| **1.0.1** | 6 Nov 2026 | Developer & AI Assistant | **Ekspansi Direktori `src/assets/` & Penambahan `README.md` (§3 & §3.1)**:<br>• Memperbarui diagram struktur direktori dan penjelasan arsitektur pada §3.1 untuk menegaskan bahwa `src/assets/` tidak hanya menampung styling Tailwind melainkan aset statis ter-bundle lainnya (`images/`, `icons/`, `fonts/`)<br>• Penambahan dokumentasi panduan aset pada [`src/assets/README.md`](./src/assets/README.md). |
| **1.0.0** | 4 Nov 2026 | Developer & AI Assistant | **Baseline Resmi SolidStart Frontend Architecture**:<br>• Rilis inisial arsitektur frontend SolidStart v2, Nitro, TanStack Query, Zustand, dan Formisch + Valibot<br>• Penetapan pola data layer 3-lapis (`endpoint/`, `api/`, `service/`) serta arsitektur dua microservice (`API_CORE` dan `API_APP`)<br>• Adopsi Ark UI + Tailwind CSS v4 dan struktur folder fitur modular                                  |

---

_Dokumen ini berstatus **Active Baseline**. Segala perubahan arsitektural lanjutan wajib mengikuti tata kelola pada §11 dan dicatat pada tabel riwayat revisi di atas._
_Versi: 1.0.6 (Modular 3-Tier Permissions & General Authentication Model) — 6 November 2026_
