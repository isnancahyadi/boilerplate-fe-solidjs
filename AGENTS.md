<!-- intent-skills:start -->

## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:

- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

# AI Agent & Contributor Rules — SolidStart Frontend Boilerplate

> **Versi Dokumen**: 1.2.5 (Boilerplate Baseline + On-Demand Ark UI Docs Fetching)
> **Tanggal Efektif**: 6 November 2026
> **Status**: Active Baseline — Living Document (Adaptif & Updatable via Protokol §7)
> **Dokumen Terkait**: [`PRD.md`](./PRD.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DESIGN.md`](./DESIGN.md) · [`API.md`](./API.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
> **Pemilik / Maintainer**: Developer (Personal / Team Project)
> **Audience**: Developer & AI Coding Assistant
>
> Dokumen ini adalah pedoman tata tertib resmi, standar penulisan kode, konvensi Git Conventional Commits, guardrails teknis, serta alur kerja kontributor dan AI Assistant untuk pengembangan frontend berbasis SolidStart Boilerplate.

---

## Peta Dokumen (baca sesuai kebutuhan)

| Butuh tahu…                                                         | Baca                                   |
| ------------------------------------------------------------------- | -------------------------------------- |
| Apa yang dibangun, scope MVP, **apa yang TIDAK boleh ditambah**     | [`PRD.md`](./PRD.md)                   |
| Tech stack, struktur folder, alur data, pola kode, alasan keputusan | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Token warna, komponen UI, ikon, layout, UX flow                     | [`DESIGN.md`](./DESIGN.md)             |
| Daftar endpoint API & contract tipe data                            | [`API.md`](./API.md)                   |
| Deployment, CI/CD, Docker, environment config                       | [`DEPLOYMENT.md`](./DEPLOYMENT.md)     |
| Aturan koding & batasan (dokumen ini)                               | `AGENTS.md`                            |

Jika dokumen bertentangan: **PRD** menang untuk scope, **ARCHITECTURE** untuk pola teknis, **DESIGN** untuk visual, **AGENTS** untuk perilaku kontributor.

---

---

## Daftar Isi

1. [Protokol Kerja (Wajib)](#1-protokol-kerja-wajib)
   - 1.1 [Zona Hati-hati](#11-zona-hati-hati-jangan-diubah-tanpa-izin-eksplisit)
2. [Gaya Kode & Konvensi](#2-gaya-kode--konvensi)
   - 2.1 [Linting & Formatting](#21-linting--formatting)
   - 2.2 [Konvensi Penamaan](#22-konvensi-penamaan)
   - 2.3 [TypeScript Disiplin Strict](#23-typescript)
   - 2.4 [Path Alias](#24-path-alias)
   - 2.5 [SolidJS — Aturan Reaktivitas (Strict)](#25-solidjs--aturan-reaktivitas-strict)
   - 2.6 [Tailwind CSS v4 — Native Design Tokens](#26-tailwind-css-v4--native-design-tokens)
   - 2.7 [Pure Copy-Paste Primitives Ownership](#27-pure-copy-paste-primitives-ownership)
   - 2.8 [Standardisasi Commit & Git Workflow](#28-standardisasi-commit--git-workflow)
3. [Pola Wajib (Ringkasan)](#3-pola-wajib-ringkasan)
4. [Guardrails & Larangan](#4-guardrails--larangan)
5. [Langkah Eksekusi Fitur Baru](#5-langkah-eksekusi-fitur-baru)
   - 5.1 [Standar Struktur & Template Dokumen PLAN.md](#51-standar-struktur--template-dokumen-planmd)
6. [Referensi Lokasi File Sumber & Shared Utilities](#6-referensi-lokasi-file-sumber--shared-utilities)
7. [Tata Kelola Dokumen (Living Document Protocol)](#7-tata-kelola-dokumen-living-document-protocol)
   - 7.1 [Alur Perubahan Tata Tertib & Aturan Koding](#71-alur-perubahan-tata-tertib--aturan-koding)
   - 7.2 [Prinsip Pengelolaan Tata Tertib](#72-prinsip-pengelolaan-tata-tertib)
8. [Document Revision History](#8-document-revision-history)

---

## 1. Protokol Kerja (Wajib)

1. **Patuhi scope.** Kerjakan hanya yang diminta. Jangan menambah fitur, halaman, dependency, atau abstraksi yang tidak ada di [`PRD.md`](./PRD.md) / permintaan. Fitur Fase 2 ([PRD §3.2](./PRD.md)) **tidak boleh** dikerjakan.
2. **Baca sebelum ubah.** Buka file terkait dan cari pola yang sudah ada; ikuti, jangan menciptakan pola baru. Jika ada perbedaan pola antar file, konfirmasikan terlebih dahulu pola mana yang ingin digunakan dan apakah pola yang ada harus diubah atau tidak. Tetapi utamakan aturan terlebih dahulu.
3. **Perubahan minimal.** Jangan refactor, rename, atau reformat kode di luar scope tugas. Jangan hapus komentar/docstring yang tidak terkait perubahanmu.
4. **Tanya jika ragu.** Persyaratan ambigu, konflik antar dokumen, atau perlu dependency baru → tanyakan dulu, jangan berasumsi.
5. **Verifikasi.** Setelah mengubah kode jalankan `pnpm check` dan `pnpm test` (serta build/E2E bila relevan) lalu laporkan hasilnya jujur. _Gunakan `pnpm exec biome check src` untuk verifikasi read-only, atau `pnpm check` untuk auto-fix aman._
6. **Laporkan dokumen basi.** Jika kode & dokumen tidak sinkron, laporkan — jangan diam-diam memilih salah satu.
7. **Wajib `PLAN.md` Sebelum Implementasi Fitur Baru (Pre-Implementation Plan & Explicit Approval Checkpoint).** Sebelum menulis atau mengubah kode untuk fitur baru, AI Agent atau Junior Programmer **wajib** menyusun dokumen perencanaan di root workspace (`./PLAN.md`) terlebih dahulu. Dokumen ini memuat arsitektur modul, daftar file yang akan dibuat/diubah, rancangan form/validasi, skenario pengujian Positif & Negatif (_Dual-Scenario_), serta checklist eksekusi bertahap.
   - **Pemisahan Konfirmasi Pertanyaan Teknis & Approval Dokumen**: AI Agent dilarang mengasumsikan persetujuan eksekusi kode hanya dari jawaban developer atas pertanyaan teknis pendamping (seperti pemilihan opsi pendekatan pengujian Opsi A/B/C). Jika developer menjawab opsi teknis tersebut, AI Agent **wajib mengonfirmasi secara terpisah**: _"Apakah dokumen `PLAN.md` sudah dibaca dan disetujui untuk mulai dieksekusi?"_.
   - **Explicit Approval Wajib**: AI Agent / Junior Programmer **dilarang keras memulai penulisan kode sebelum developer memberikan persetujuan eksplisit** bahwa mereka telah selesai membaca dan menyetujui dokumen `PLAN.md`.
   - **Retensi File Selama Masa Review**: File `./PLAN.md` **dilarang dihapus sepihak** segera setelah kode selesai. File `./PLAN.md` wajib dipertahankan agar developer dapat memeriksa kesesuaian hasil implementasi dengan rencana awal, dan baru dihapus setelah developer mengonfirmasi review hasil akhir (lihat Guardrail #29 & #31).
8. **Wajib sertakan test (Test-as-you-go & Dual-Scenario).** Setiap penambahan fungsi utilitas baru (`src/lib/utils/`), skema validasi Valibot (`*.validation.ts`), atau data layer API (`lib/data/{endpoint,api,query-keys,service}/`) wajib disertai file unit test pendamping (`*.test.ts`). Setiap penambahan alur fitur/modul utama baru wajib disertai skenario pengujian E2E (`e2e/*.spec.ts`). **Setiap file pengujian wajib memuat skenario Positif (Happy Path) dan Negatif (Unhappy Path / Error / Boundary) secara berpasangan** (lihat Guardrail #27).
9. **Penyelarasan Skenario Pengujian (Pre-Test Alignment Checkpoint).** Sebelum menulis atau mengubah kode pengujian (Unit, Integration, atau E2E), AI Agent **wajib** memaparkan daftar rekomendasi skenario (Positif & Negatif) kepada developer dan mengonfirmasi pilihan pendekatan:
   - **Opsi A**: Mengikuti seluruh rekomendasi skenario dari AI Agent.
   - **Opsi B**: Menggunakan daftar skenario spesifik yang sudah dirancang sendiri oleh developer.
   - **Opsi C**: Kombinasi (menggabungkan rekomendasi AI Agent dengan skenario tambahan dari developer).
     AI Agent dilarang langsung membuat kode test tanpa menyajikan list rekomendasi dan menunggu persetujuan developer (lihat Guardrail #28).
10. **Penyelarasan Kontrak Data & Service API (Pre-Service Alignment Checkpoint).** Saat diminta membuat atau memodifikasi fungsi service / data layer (`features/.../lib/data/{endpoint,api,service}/`), AI Agent **wajib menanyakan atau mengonfirmasi rincian kontrak data terlebih dahulu kepada developer sebelum menulis kode**, meliputi:
    - **Endpoint & Method**: Path URL endpoint, konstanta penamaan endpoint (`UPPER_SNAKE_CASE_ENDPOINT`), method HTTP (`GET`, `POST`, `PUT`, `DELETE`), serta prefix URL (`API_APP` vs `API_CORE`).
    - **Parameter (Params)**: Apakah endpoint menggunakan parameter atau tidak? Jika menggunakan params, bagaimana rinciannya (path parameter ID seperti `(id) => /user/detail/?id=${id}`, query string filter seperti `FilterParams`, pagination, search, status, dsb.)?
    - **Request Payload (Create / Update)**: Apakah payload diambil dari hasil infer skema validasi Valibot (`InferInput<typeof Schema>`)? Apakah format pengiriman berupa JSON murni atau `FormData` (multipart upload via `appendFormData()`)?
    - **Response Type (Bentuk Data Balikan)**: Apakah endpoint mengembalikan data respon atau tidak? Jika ada data balikan, bagaimana bentuk/tipe datanya (`ArrayData<T>`, `DetailType`, `BaseType`, atau `void` / `{ message: string }`)? Serta bagaimana penanganan typed callback pada generic `MutationProps<ResponseType>`?
      Jika rincian kontrak data tersebut telah tercantum dalam `PLAN.md` yang telah disetujui atau kontrak paten di [`API.md`](./API.md), AI Agent **wajib memaparkan ringkasan konfirmasi kontrak tersebut kepada developer sebelum mengeksekusi penulisan kode** (lihat Guardrail #30).
11. **Mandatori Audit Statis Mandiri Sebelum Lapor (Pre-Delivery Static Self-Audit Checkpoint).** Sebelum AI Agent atau kontributor menyatakan pekerjaan selesai atau meminta review kepada developer, **wajib** mengeksekusi serangkaian audit statis mandiri via terminal terhadap seluruh file yang baru dibuat atau dimodifikasi guna mendeteksi pelanggaran arsitektur yang tidak ditangkap oleh linter/compiler (meliputi: larangan relative import `../`, larangan komponen mengimpor `api/` secara langsung, serta teks UI hardcoded tanpa `t()`). Hasil audit statis ini wajib dilaporkan secara jujur dalam balasan akhir (lihat Guardrail #36 & #37).
12. **Prinsip Ponytail — Lazy Senior Dev Mode (The Smallest Complete Change & Anti-Overengineering Wajib).** Kode terbaik adalah kode yang tidak pernah ditulis (_the best code is the code never written_). Setiap penyelesaian masalah wajib mengambil opsi solusi perubahan paling minimal yang berfungsi penuh (_shortest working diff wins_):
    - **Hirarki Solusi Minimal**:
      1. Apakah perlu ada? Lewati fitur, opsi fleksibilitas ekstra, atau abstraksi yang tidak diminta siapapun.
      2. Sudah ada di codebase (helper, komponen, pola, tipe)? Gunakan seperti pola sekitarnya.
      3. Standar platform atau library bawaan? Gunakan itu sebelum menambahkan kode custom.
      4. Dependensi terpasang? Manfaatkan library yang sudah ada di `package.json`. Jangan tambah dependensi baru hanya untuk beberapa baris kode.
      5. Kode sesedikit mungkin: Penghapusan kode lebih baik daripada penambahan (_deletion beats addition_). Jangan buat wrapper, type conversion berlebih, config cadangan, atau boilerplate "untuk nanti".
    - **Malas pada Solusi, Teliti pada Eksekusi**: Jangan pernah malas menyelesaikan seluruh bagian yang disentuh oleh perubahan (callers, tests, fixtures, config, exports). Bug fix wajib memeriksa seluruh caller fungsi sebelum diedit dan memperbaiki akar masalah pada kode bersama.
    - **Batasan Tidak Boleh Dipotong (Never Cut)**: Dilarang memotong validasi batas sistem (trust boundaries), error handling pencegah data loss, keamanan, aksesibilitas, serta segala hal yang diminta eksplisit oleh developer.
    - **Anotasi Shortcut**: Jika terpaksa mengambil jalan pintas dengan batas limitasi tertentu, wajib menyertakan komentar kode berformat: `// shortcut: <limitasi/alasan>, <kapan harus di-upgrade>`.
    - **Catatan Wajib di Akhir Respon**: Akhiri setiap balasan/laporan dengan 1-2 baris jujur: apa yang dilewati/tidak diperiksa, serta risiko teknis yang harus diketahui oleh developer. (lihat Guardrail #41).

### 1.1 Zona Hati-hati (jangan diubah tanpa izin eksplisit)

| Path                                                    | Alasan                                                                                          |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/components/ui/*`                                   | Dipakai lintas fitur; perubahan berdampak global. Tambah varian, jangan ubah perilaku existing. |
| `src/assets/styles/variables.css`                       | Sumber design tokens. Perubahan token = perubahan tampilan seluruh app.                         |
| `src/config/http.ts`, `cookies.ts`, `prefix.ts`         | Inti auth/refresh token; salah ubah = user ter-logout/ gagal API.                               |
| `src/middleware.ts`                                     | Auth guard SSR.                                                                                 |
| `src/locales/en/*` & `id/*`                             | Selalu ubah **keduanya** sekaligus; jangan ubah/hapus key existing.                             |
| `package.json`, `pnpm-lock.yaml`, `biome.json`, `.env*` | Dependency/config. Minta izin sebelum menambah/mengganti paket.                                 |

---

---

## 2. Gaya Kode & Konvensi

### 2.1 Linting & Formatting

- **BiomeJS** adalah tool lint & format utama (`biome.json`). Jangan tambahkan ESLint atau oxlint.
- **Prettier tetap terpasang hanya untuk urutan class Tailwind** (`prettier-plugin-tailwindcss`, config di `.prettierrc`) dan sort JSON. Jangan jadikan Prettier formatter umum.
- Perintah tersedia di `package.json`: `pnpm check` (`biome check --write --unsafe .`), `pnpm lint`, `pnpm format`, serta perintah verifikasi read-only via `pnpm exec biome check src`.

### 2.2 Konvensi Penamaan

| Konteks                 | Konvensi                               | Contoh                                                    |
| ----------------------- | -------------------------------------- | --------------------------------------------------------- |
| Variabel & fungsi       | `camelCase`                            | `getUserList`, `isLoading`, `handleSubmit`                |
| Komponen SolidJS        | `PascalCase`                           | `UserList`, `DataTable`, `BadgeStatus`                    |
| Interface & Type (Umum) | `PascalCase`                           | `UserType`, `FilterParams`, `MutationProps`               |
| Global Model            | `Base[Entity]Type`                     | `BaseUserType`, `BaseRoleType`, `BaseProductType`         |
| Model Tabel/List        | `[Entity]Type`                         | `UserType`, `RoleType`, `ProductType`, `CustomerType`     |
| Dropdown/Shared Item    | `[Entity]ItemType`                     | `RoleItemType`, `CategoryItemType`, `DepartmentItemType`  |
| Mutation Response       | `[Entity]MutationResponseType`         | `UserMutationResponseType`, `ProductMutationResponseType` |
| Sub-Feature (Nested)    | `[ParentEntity][Entity]Type`           | `UserManagementRoleType`, `MasterDataCategoryType`        |
| Detail Model            | `Detail[Entity]Type`                   | `DetailUserType`, `DetailMasterDataCategoryType`          |
| Parameter (Query)       | `[Entity]Params` / `[Entity]AllParams` | `FilterParams`, `StatusParams`, `UserAllParams`           |
| File komponen           | `PascalCase` atau `kebab-case`         | `UserList.tsx`, `create-user.form.tsx`                    |
| File non-komponen       | `kebab-case`                           | `http.ts`, `cookies.ts`, `utils.ts`                       |
| Folder fitur            | `kebab-case`                           | `user/`, `user-management/`, `product/`                   |
| Folder komponen         | `kebab-case`                           | `data-table/`, `badge-status/`                            |
| Konstanta global        | `UPPER_SNAKE_CASE`                     | `API_CORE`, `APP_NAME`                                    |
| Valibot schema          | `PascalCase + Schema`                  | `CreateUserSchema`, `LoginSchema`                         |
| Valibot inferred type   | `PascalCase + Input`                   | `CreateUserInput`, `LoginInput`                           |
| Endpoint constants      | `UPPER_SNAKE_CASE + ENDPOINT`          | `USER_ENDPOINT`, `AUTH_ENDPOINT`                          |
| Query key factories     | `camelCase + QueryKeys`                | `userQueryKeys`, `productQueryKeys`                       |
| Query hooks             | `useGet` prefix                        | `useGetUserList`, `useGetUserDetail`                      |
| Mutation hooks          | `use[Action][Entity]`                  | `useCreateUser`, `useDeleteProduct`                       |
| File unit test          | `kebab-case.test.ts`                   | `text.test.ts`, `signin.validation.test.ts`               |
| File E2E test           | `kebab-case.spec.ts` (di `e2e/`)       | `auth.spec.ts`, `user-crud.spec.ts`                       |

Pola penamaan lengkap fungsi API/service: [`ARCHITECTURE.md` §4.6](./ARCHITECTURE.md#46-naming).

### 2.3 TypeScript

- **Selalu** definisikan interface/type secara eksplisit. Hindari `any` dalam kondisi apapun.
- `type` untuk union/intersection, `interface` untuk bentuk objek.
- Patuhi semua aturan strict mode. Selalu annotate return type fungsi API layer.
- **Generic Array Type Wajib (`Array<T>`)**: Selalu gunakan sintaks generic `Array<T>` (atau `ReadonlyArray<T>`) untuk tipe data berbentuk array, hindari shorthand kurung siku `T[]` (contoh: `Array<BaseUserType>`, `Array<string>`, `Array<MyMenuType>`). Aturan ini ditegakkan otomatis oleh Biome (`style.useConsistentArrayType`).
- **Larangan Backward Compatibility Aliases**: Dilarang membuat type alias semata-mata untuk tujuan backward compatibility (`export type OldName = NewName;`) saat melakukan refactoring atau penyesuaian nama tipe data. Perbarui langsung seluruh file konsumen ke nama tipe baru yang baku (§2.2). Pengecualian hanya diizinkan bila terdapat alasan teknis khusus yang memang mengharuskan dan telah disetujui secara eksplisit oleh developer / pemilik proyek.
- **Penempatan Tipe Detail & Mutation Response (Feature Local Types)**: Tipe data model detail (`Detail[Entity]Type` / `Detail[ParentEntity][Entity]Type`) serta tipe respon mutasi (`[Entity]MutationResponseType`) **dilarang** ditempatkan di direktori tipe global (`src/types/schema/`). Seluruh tipe detail dan respon mutasi wajib ditempatkan di direktori tipe lokal fitur/sub-fiturnya masing-masing (`features/.../types/schema.ts`). Direktori global `src/types/schema/` hanya menampung model universal/global (`Base[Entity]Type`), item opsi dropdown bersama (`[Entity]ItemType`), dan parameter query bersama.

### 2.4 Path Alias

Semua import internal **wajib** pakai alias `~` (= `src/`, lihat `tsconfig.json`).

```typescript
// ✅ BENAR
import { http } from "~/config/http";
import { cn } from "~/lib/utils";

// ❌ SALAH — path relatif panjang
import { http } from "../../../config/http";
```

### 2.5 SolidJS — Aturan Reaktivitas (Strict)

SolidJS **berbeda fundamental** dari React. Pelanggaran menyebabkan bug reaktivitas yang sulit di-debug.

1. **NEVER Destructure Props Directly**:
   - `const { variant, class: className } = props;` -> ❌ **FORBIDDEN** (merusak fine-grained signal tracking).
   - `const [local, others] = splitProps(props, ["variant", "class"]);` -> ✅ **REQUIRED** saat perlu memisahkan props.
   - Selain itu, akses langsung via `props.*`.

2. **Children Inspection & Tab Hydration**:
   - ALWAYS wrap `props.children` dengan `children(() => props.children)` saat inspeksi/iterasi/render child nodes dinamis.

3. **SSR Safety Guards**:
   - Selalu pakai guard `typeof window !== "undefined"` dan `typeof document !== "undefined"` di event listener atau akses DOM.

4. **Anti-FOUC Theme Script**:
   - Saat memakai `ThemeProvider`, ALWAYS letakkan `<ThemeScript storageKey="app-theme" />` sinkron di `<head>`/root HTML sebelum `<ThemeProvider>`.

```tsx
// ❌ SALAH — destrukturisasi props
function MyComponent({ name, value }: Props) {
  return (
    <div>
      {name}: {value}
    </div>
  );
}

// ✅ BENAR
function MyComponent(props: Props) {
  return (
    <div>
      {props.name}: {props.value}
    </div>
  );
}

// ❌ SALAH — pola React: useState / useEffect
// ✅ BENAR — pola SolidJS
const [state, setState] = createSignal("");
createEffect(() => {
  /* reactive */
});
const derived = createMemo(() => state().toUpperCase());
```

### 2.6 Tailwind CSS v4 — Native Design Tokens

- Gunakan token semantik (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, dst.).
- Jangan hardcode warna (tanpa hex literal). Detail: [`DESIGN.md`](./DESIGN.md).

### 2.7 Komponen Primitif & Hooks Reaktif

- Komponen UI primitif berada di `src/components/ui/` (dibangun menggunakan Ark UI `@ark-ui/solid` + Tailwind CSS v4 + CVA). Hooks reaktif global berada di `src/hooks/`, diimpor via alias:
  `import { createClipboard } from "~/hooks/create-clipboard";`
- **Integrasi Ark UI LLMs.txt untuk AI Agent**:
  - Full SolidJS Docs: [`https://ark-ui.com/llms-solid.txt`](https://ark-ui.com/llms-solid.txt) (API, anatomi part, props, & implementasi SolidJS lengkap).
  - Per-Component Markdown: `https://ark-ui.com/llms.txt/components/{component}?framework=solid` (contoh: [dialog](https://ark-ui.com/llms.txt/components/dialog?framework=solid), [select](https://ark-ui.com/llms.txt/components/select?framework=solid), [tabs](https://ark-ui.com/llms.txt/components/tabs?framework=solid)).
  - Global Index: [`https://ark-ui.com/llms.txt`](https://ark-ui.com/llms.txt).
  - Agent Skill: `.agents/skills/ark-ui/SKILL.md` (disinkronkan ke `.claude/skills/`, `.windsurf/skills/`, `.cursor/rules/`, dll.).
  - On-Demand Fetching: Tidak menyimpan salinan berkas fisik monolitik (`llms-solid.txt` 1.7 MB) di repositori demi mencegah token bloat. AI Agent diwajibkan menarik dokumen spesifikasi per-komponen via endpoint URL resmi (`https://ark-ui.com/llms.txt/components/{component}?framework=solid`) atau merujuk index cepat di `.agents/skills/ark-ui/references/components-index.md`.
    Setiap AI Agent yang membuat atau memodifikasi komponen di `src/components/ui/` **wajib** merujuk pada dokumentasi Ark UI Solid tersebut guna memastikan part anatomi, state machine, dan reaktivitas SolidJS (`splitProps`) diimplementasikan dengan benar.

### 2.8 Standardisasi Commit & Git Workflow

Repo ini menerapkan standar **Conventional Commits** menggunakan kombinasi **Commitizen**, **cz-conventional-changelog**, **Commitlint**, dan **Husky**.

Setiap commit wajib mengikuti struktur:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

#### 1. Cara Melakukan Commit (Wajib via Commitizen)

Commit manual via `git commit` biasa atau Git GUI editor diblokir oleh hook `.husky/commit-msg`. Buat commit selalu via:

```bash
pnpm git:commit
```

Perintah ini mengeksekusi `cross-env CZ_COMMIT=1 cz` yang memandu pengisian commit secara interaktif di terminal melalui prompt standar `cz-conventional-changelog`.

#### 2. Tipe Commit yang Didukung (`type`)

| Tipe       | Deskripsi            | Kapan Digunakan                                                              |
| :--------- | :------------------- | :--------------------------------------------------------------------------- |
| `feat`     | Fitur baru           | Penambahan fungsionalitas/halaman baru untuk pengguna                        |
| `fix`      | Perbaikan bug        | Perbaikan error/bug pada fitur yang sudah ada                                |
| `docs`     | Dokumentasi          | Perubahan file dokumentasi (`.md`, pedoman arsitektur, docstring)            |
| `style`    | Formatting           | Perapian whitespace, semicolon, format Biome tanpa ubah logika               |
| `refactor` | Refactoring          | Restrukturisasi kode tanpa menambah fitur atau membetulkan bug               |
| `perf`     | Performa             | Optimasi reaktivitas SolidJS, query caching, atau bundle size                |
| `test`     | Pengujian            | Penambahan atau perbaikan unit test Vitest maupun E2E Playwright             |
| `build`    | Build / Dependencies | Perubahan Vite, Nitro, Tailwind config, atau dependency `package.json`       |
| `ci`       | CI/CD                | Perubahan konfigurasi GitHub Actions (`.github/workflows/*`) atau hook Husky |
| `chore`    | Pemeliharaan         | Skrip developer, update konfigurasi internal non-build                       |
| `revert`   | Revert commit        | Membatalkan perubahan commit sebelumnya                                      |

#### 3. Scope Rekomendasi (`scope`)

Scope ditulis dalam huruf kecil (`kebab-case`), merefleksikan domain atau modul yang disentuh:

- **Modul Fitur Utama**: `auth`, `dashboard`, `user`, `settings`, `sample-feature`, dll.
- **Cross-cutting / Shared**: `ui` (Komponen Ark UI di `components/ui/`), `common` (komponen bersama di `components/common/`), `layouts` (wrapper layout di `components/layouts/`), `api` (Layer HTTP/endpoint), `config`, `i18n`, `store`, `deps`.

_Contoh commit valid:_

- `feat(user): add user list table with TanStack query`
- `fix(auth): prevent infinite loop on expired refresh token`
- `docs(agents): add commit convention and github actions guideline`
- `style(ui): format button component with biome`

#### 4. Validasi Ganda (Dual Enforcement: Lokal & CI/CD)

1. **Lokal (Husky Hooks)**:
   - `pre-commit`: Menjalankan `lint-staged` (Biome check & format otomatis pada staged files).
   - `commit-msg`: Memastikan flag `CZ_COMMIT=1` terpasang (mencegah bypass commit manual) dan memvalidasi pesan commit via `pnpm exec commitlint --edit "$1"`.
2. **CI/CD (GitHub Actions)**:
   - Pipeline CI (`.github/workflows/ci.yml`) otomatis mengeksekusi validasi mutu kode (`lint` Biome, `typecheck-and-build`, `test-unit`, serta `test-e2e`) dan memverifikasi kepatuhan commit range pada setiap Pull Request (PR) maupun push ke branch target (`main`, `dev`, `staging`).

---

---

## 3. Pola Wajib (Ringkasan)

- **API 3 lapis:** `endpoint/` → `api/` → `service/` per fitur di `features/[fitur]/lib/data/`, ditambah `query-keys/` (key TanStack Query) dan `mock/` (data dummy selama API belum ada). Seluruh endpoint data bersama untuk opsi dropdown (seperti endpoint `/all/` yang mengembalikan `Array<T>`) wajib ditempatkan di `src/lib/data/` (global data layer). Payload mutation create/update wajib di-infer dari skema Valibot (`InferInput`); return types di-unwrap strictly-typed via `MutationProps<ResponseType>`. Komponen hanya import dari `service/` (atau hook `*Mock` dari `mock/` sementara API belum siap).
- **State:** server state → TanStack Query; sesi → Zustand (`src/stores/`); event lintas komponen → Context.
- **Form:** Valibot schema dulu → Formisch form; create & update disatukan satu file (kecuali tampilan berbeda); error validasi inline (bukan Toast); `appendFormData()` untuk FormData; proteksi pending state menyeluruh (submit, tombol aksi sekunder, dan field input via `<fieldset disabled>`).
- **i18n:** semua teks UI via `t()`; tambah key di `en/` **dan** `id/`.
- **Permission:** `parsePermission(module).includes(action)`; **sembunyikan** (bukan disable) tombol aksi tanpa izin.
- **Cookie:** hanya via `~/config/cookies`.

---

---

## 4. Guardrails & Larangan

| #   | Aturan                                                                                               | Penjelasan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Jangan gunakan Zod**                                                                               | Proyek menggunakan Valibot. Jangan import dari `"zod"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2   | **Jangan gunakan @modular-forms/solid**                                                              | Form menggunakan `@formisch/solid`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 3   | **Jangan gunakan ESLint**                                                                            | Lint & format via BiomeJS. Prettier hanya untuk sorting class Tailwind (lihat §2.1).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 4   | **Gunakan Ark UI untuk Komponen Primitif & Rujuk LLMs.txt**                                          | Komponen headless di `src/components/ui/` dibangun menggunakan `@ark-ui/solid` dipadukan dengan Tailwind CSS v4 & CVA. AI Agent wajib merujuk spesifikasi anatomi dan props pada `https://ark-ui.com/llms-solid.txt` atau skill `ark-ui`. Hindari dependensi UI monolitik eksternal lainnya.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 5   | **Jangan gunakan pola React**                                                                        | `useState`, `useEffect` tidak ada di SolidJS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 6   | **Jangan destrukturisasi props**                                                                     | Merusak reaktivitas SolidJS. Gunakan `props.x` atau `splitProps`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 7   | **Jangan hardcode warna**                                                                            | Gunakan Tailwind class semantik dari `DESIGN.md`. Tidak ada hex literal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 8   | **Jangan panggil `http` dari komponen**                                                              | Hanya dari Layer 2 API functions. Komponen hanya import dari `service/`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 9   | **Jangan gunakan icon library lain**                                                                 | Hanya `lucide-solid` (`import { User } from "lucide-solid"`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 10  | **Jangan hardcode teks UI**                                                                          | Semua teks via `t()` dari `useTranslation()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 11  | **Jangan skip permission check**                                                                     | Cek `parsePermission(module).includes(action)` sebelum tampil tombol.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 12  | **Jangan skip i18n untuk kedua locale**                                                              | Tambah key di `en/` **dan** `id/` sekaligus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 13  | **Jangan akses js-cookie langsung**                                                                  | Gunakan `Cookies` dari `~/config/cookies`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 14  | **Jangan gunakan Tailwind v3 patterns**                                                              | `@layer utilities`, `@apply` di luar base — gunakan sintaks v4.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 15  | **Jangan delete tanpa AlertDialog**                                                                  | Selalu tampilkan AlertDialog sebelum aksi destruktif.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 16  | **Jangan taruh logic API di luar feature folder**                                                    | Setiap feature punya `lib/data/{endpoint,api,service}` sendiri.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 17  | **Jangan inspeksi `props.children` mentah**                                                          | Bungkus dengan `children(() => props.children)` saat inspeksi/iterasi child nodes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 18  | **Jangan akses DOM tanpa SSR guard**                                                                 | Guard `typeof window !== "undefined"` / `typeof document !== "undefined"` di event listener & akses DOM.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 19  | **Jangan lupa `ThemeScript`**                                                                        | Pakai `<ThemeProvider>` → letakkan `<ThemeScript storageKey="app-theme" />` di `<head>` sebelum provider.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 20  | **Jangan tambah fitur di luar PRD**                                                                  | Termasuk fitur Fase 2 (misal: real-time WebSocket/SSE, batch import/export latar belakang, multi-tenancy dinamis). Konfirmasi dulu.                                                                                                                                                                                                                                                                                                                                                                                                                |
| 21  | **Jangan tambah dependency tanpa izin**                                                              | Cek dulu apakah sudah ada solusi di stack ([`ARCHITECTURE.md` §2](./ARCHITECTURE.md#2-tech-stack)).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 22  | **Jangan ubah Zona Hati-hati tanpa izin**                                                            | Lihat §1.1.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 23  | **Jangan bypass commit convention**                                                                  | Gunakan `pnpm git:commit`. Dilarang commit manual yang melanggar Conventional Commits atau bypass hook (`--no-verify`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 24  | **Jangan campur config Vitest dengan server SolidStart/Nitro**                                       | Gunakan `vitest.config.ts` terpisah untuk unit test tanpa memuat plugin server Nitro/SolidStart agar proses test tidak menggantung (_hanging_).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 25  | **Jangan campur file E2E ke dalam `src/`**                                                           | Letakkan pengujian E2E berbasis Playwright di direktori khusus `e2e/` di luar `src/` dengan ekstensi `*.spec.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 26  | **Jangan buat utilitas, skema validasi, atau data API tanpa unit test**                              | Setiap fungsi utilitas baru, skema Valibot, dan seluruh sub-layer data API (meliputi endpoint constants/path generator, layer 2 HTTP API, query-keys, dan service hooks TanStack Query) wajib memiliki file pengujian unit/integration berdampingan (_co-located_ `*.test.ts`).                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 27  | **Wajib sertakan skenario Positif & Negatif (_Dual-Scenario Testing_)**                              | Dilarang membuat suite pengujian yang hanya menguji _happy path_. Setiap file unit test, integration test, dan E2E test wajib menguji minimal 1 skenario keberhasilan (data/tindakan valid) dan minimal 1 skenario kegagalan (input tidak valid, penolakan akses/guard, boundary edge cases, atau penanganan error network/API).                                                                                                                                                                                                                                                                                                                                                                                  |
| 28  | **Wajib ajukan rekomendasi & konfirmasi skenario pengujian ke developer**                            | AI Agent dilarang langsung membuat file testing tanpa memaparkan daftar rekomendasi skenario (Positif & Negatif) dan mengonfirmasi pilihan pendekatan (rekomendasi AI, skenario developer, atau gabungan keduanya).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 29  | **Wajib buat & minta persetujuan eksplisit `PLAN.md` sebelum implementasi fitur**                    | Dilarang langsung menulis kode fitur baru sebelum dokumen perencanaan `./PLAN.md` disusun secara rinci dan disetujui secara eksplisit oleh developer / pemilik proyek. Menjawab pertanyaan teknis pendamping (seperti opsi skenario uji) TIDAK otomatis menjadi lampu hijau eksekusi. AI Agent wajib memastikan developer telah selesai membaca dan menyetujui dokumen perencanaan.                                                                                                                                                                                                                                                                                                                               |
| 30  | **Wajib konfirmasi kontrak data & API sebelum membuat service**                                      | Dilarang langsung membuat fungsi service, API layer 2, atau endpoint baru tanpa mengonfirmasi atau menanyakan rincian kontrak data terlebih dahulu kepada developer (meliputi URL endpoint, method, struktur params, payload create/update dari infer Valibot, serta bentuk response type).                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 31  | **Dilarang mengasumsikan approval `PLAN.md` dari jawaban opsi & dilarang hapus prematur**            | AI Agent dilarang menganggap jawaban pemilihan opsi teknis/testing (misal "pilih opsi A") sebagai izin eksekusi otomatis. Wajib minta konfirmasi eksplisit apakah `PLAN.md` sudah dibaca dan disetujui. File `./PLAN.md` dilarang dihapus sebelum developer selesai memeriksa hasil akhir implementasi.                                                                                                                                                                                                                                                                                                                                                                                                           |
| 32  | **Wajib cek interface & props komponen sumber terlebih dahulu (_Component Props Inspection First_)** | Dilarang keras berasumsi atau menebak nama/tipe properti suatu komponen bersama (`src/components/common/*`, `src/components/ui/*`, `src/components/layouts/*`). Sebelum menggunakan komponen, AI Agent atau developer wajib membaca definisi tipe/props file sumbernya (`read_file` pada `*.tsx` atau `*.props.ts`). Pelanggaran seperti memberikan properti yang tidak ada (contoh: memberi properti `title` pada `<EmptyData>` yang hanya menerima `size?: Size`) dilarang keras.                                                                                                                                                                                                                               |
| 33  | **Wajib utamakan komponen layout proyek (`<Flex>` vs `<div class="flex">`)**                         | Dilarang menggunakan raw `<div class="flex ...">` ketika komponen abstraksi layout `<Flex>` telah tersedia di `~/components/layouts`. Seluruh penataan flexbox wajib menggunakan `<Flex flexDirection="..." alignItems="..." justifyContent="..." class="...">`. Penggunaan `<div>` hanya diperkenankan untuk struktur non-flex (seperti CSS Grid `<div class="grid ...">`, wrapper col-span, atau elemen murni non-flex).                                                                                                                                                                                                                                                                                        |
| 34  | **Gunakan built-in label & error pada komponen form (No redundant manual wrappers)**                 | Komponen input form yang sudah menyediakan penanganan label dan error bawaan (seperti `<DatePicker label="..." errors={...} />` dan `<TextInputForm label="..." errors={...} />`) wajib memanfaatkan properti bawaan tersebut. Dilarang membuat wrapper label teks manual di luar komponen (`<Text>` atau `<FieldLabel>`) kecuali komponen memang tidak menyediakannya secara internal.                                                                                                                                                                                                                                                                                                                           |
| 35  | **Gunakan Generic Array Type (`Array<T>`)**                                                          | Dilarang menggunakan shorthand kurung siku `T[]` untuk tipe data berbentuk array (contoh: gunakan `Array<BaseUserType>` alih-alih `BaseUserType[]`, `Array<string>` alih-alih `string[]`). Seluruh array wajib menggunakan generic notation `Array<T>`. Aturan ini ditegakkan otomatis oleh Biome (`style.useConsistentArrayType`).                                                                                                                                                                                                                                                                                                                                                                               |
| 36  | **Wajib gunakan path alias `~` (Strict No Relative Parent Imports `../`)**                           | Dilarang menggunakan path relatif berjenjang (`../` atau `../../`) yang melintasi direktori folder/layer. Seluruh import internal antar-layer, fitur, utilitas, tipe data, dan komponen wajib menggunakan path alias `~` (= `src/`). Import relatif (`./`) hanya diizinkan untuk file _co-located_ dalam satu folder yang sama persis (misal `*.test.ts` mengimpor `*.ts` pendampingnya).                                                                                                                                                                                                                                                                                                                         |
| 37  | **Prinsip "Dokumen Mengalahkan Kode Acuan" (_Document Over Legacy Code_) & Mandatori Self-Audit**    | Dilarang meniru kebiasaan/pola usang (_legacy drift_) dari file acuan atau modul eksisting yang melanggar aturan arsitektur. Jika kode eksisting bertentangan dengan `AGENTS.md`, aturan di `AGENTS.md` mutlak dimenangkan. Sebelum AI Agent atau developer menyatakan pekerjaan selesai, wajib menjalankan verifikasi audit statis mandiri (path alias `~`, raw `<div class="flex">`, isolasi `service/`, dan teks `t()`).                                                                                                                                                                                                                                                                                       |
| 38  | **Simpan Shared Option / Dropdown Queries di Global Data Layer (`src/lib/data/`)**                   | Seluruh endpoint API yang diperuntukkan bagi opsi dropdown atau data master referensi bersama (terutama endpoint `/all/` yang mengembalikan `Array<T>`) **wajib ditempatkan di `src/lib/data/` (global data layer)**, bukan di dalam sub-folder fitur lokal. Hal ini untuk menjamin reusabilitas lintas domain tanpa menimbulkan _circular dependency_ atau impor silang antar modul fitur.                                                                                                                                                                                                                                                                                                                       |
| 39  | **Standardisasi Konvensi Penamaan Tipe Data (Interface & Type)**                                     | Seluruh interface dan tipe data wajib mengikuti konvensi penamaan baku (§2.2): Global Model menggunakan `Base[Entity]Type`, Model data tabel/list/lainnya menggunakan `[Entity]Type`, Dropdown/shared item menggunakan `[Entity]ItemType`, Mutation response menggunakan `[Entity]MutationResponseType`, Sub-feature nested menggunakan `[ParentEntity][Entity]Type`, dan Detail model menggunakan `Detail[Entity]Type` / `Detail[ParentEntity][Entity]Type`. Dilarang menggunakan pola campur/redundan seperti `BaseType[Entity]Type` atau prefix terbalik `UserBaseType`.                                                                                                                                       |
| 40  | **Larangan Backward Compatibility Aliases & Penegasan Lokasi Detail / Mutation Response Type**       | Dilarang membuat tipe data alias untuk alasan backward compatibility (`export type OldName = NewName;`) saat refactoring/standardisasi nama tipe karena menimbulkan pemborosan (_bloat_) dan kebingungan arsitektur. Seluruh kode pemanggil wajib disesuaikan langsung ke nama tipe baru yang baku. Pengecualian hanya diizinkan jika ada alasan khusus yang memang mengharuskan dan disetujui eksplisit oleh developer / pemilik proyek. Selain itu, dilarang meletakkan tipe detail (`Detail[Entity]Type`) maupun mutation response type (`[Entity]MutationResponseType`) di global schema `src/types/schema/`; keduanya wajib ditempatkan di folder fitur/sub-fitur lokalnya (`features/.../types/schema.ts`). |
| 41  | **Prinsip Ponytail (The Smallest Complete Change & Anti-Overengineering Wajib)**                     | Dilarang keras melakukan over-engineering, menambah boilerplate/abstraksi/wrapper tidak perlu, atau menambahkan fitur "untuk nanti" di luar scope. Selalu pilih solusi dengan _shortest working diff_ yang memanfaatkan kode yang sudah ada, dependensi terpasang, dan standar platform. Dilarang memotong validasi batas sistem (_trust boundaries_), error handling pencegah data loss, keamanan, aksesibilitas, atau hal yang diminta eksplisit oleh developer. Wajib menyertakan catatan 1-2 baris di akhir respon mengenai apa yang di-skip dan risikonya (lihat Protokol §1 poin 12).                                                                                                                       |

---

---

## 5. Langkah Eksekusi Fitur Baru

Urutan wajib saat menambah entitas/fitur baru (contoh: "Item" atau "User"):

```
STEP 0 — PLAN        ./PLAN.md                                                        (Susun dokumen perencanaan di root workspace -> paparkan ke developer -> pastikan developer membaca & memberi explicit approval sebelum coding dimulai)
STEP 1 — TYPE        features/[fitur]/types/schema.ts                                 ([Entity]Type, Detail[Entity]Type, …)
STEP 2 — ENDPOINT    features/[fitur]/lib/data/endpoint/index.ts                      ([entity]Endpoint — URL constants, pastikan endpoint & params sudah dikonfirmasi)
STEP 2a — ENDPOINT TEST features/[fitur]/lib/data/endpoint/index.test.ts              (Pre-test alignment skenario valid/UUID/boundary dengan developer -> uji generator endpoint & contract)
STEP 3 — API         features/[fitur]/lib/data/api/index.ts                           (fungsi HTTP, return type eksplisit, payload & response strictly-typed)
STEP 3a — QUERY KEYS features/[fitur]/lib/data/query-keys/index.ts                   ([entity]Keys — list/detail/count)
STEP 3b — MOCK       features/[fitur]/lib/data/mock/                                  (opsional, hanya jika API belum siap: DUMMY_[ENTITIES] + useGet[Entity]ListMock)
STEP 3c — DATA TEST  features/[fitur]/lib/data/api/index.test.ts                     (Pre-test alignment skenario 200/400 dengan developer -> uji fungsi HTTP & headers FormData)
STEP 4 — SERVICE     features/[fitur]/lib/data/service/index.ts                       (Pre-service contract alignment dengan developer -> useGet[Entity]List/Detail, useCreate/Update/Delete[Entity]; payload create/update di-infer dari skema Valibot; MutationProps<ResponseType>; key dari query-keys/; formatApiError())
STEP 4a — SERVICE TEST features/[fitur]/lib/data/service/index.test.ts               (Pre-test alignment skenario dengan developer -> uji hook TanStack Query, select, enabled, onSuccess & onError)
STEP 5 — VALIDATION  features/[fitur]/components/form/[entity].validation.ts         (Valibot + InferInput)
STEP 5a — UNIT TEST features/[fitur]/components/form/[entity].validation.test.ts     (Pre-test alignment skenario valid/invalid dengan developer -> uji skema Valibot)
STEP 6 — FORM        features/[fitur]/components/form/[entity].form.tsx               (error inline)
STEP 7 — LIST/DETAIL [entity]-list.tsx, [entity]-detail.tsx                           (hooks dari Step 4, cek permission sebelum tombol aksi)
STEP 8 — ROUTE       routes/app/[fitur]/index.tsx                                     (integrasikan komponen fitur Step 7)
STEP 9 — i18n        tambah teks ke en/ DAN id/
STEP 10 — CONFIG     (modul baru) src/config/app.ts → MODULE_ACTIVE_CONFIG; .env → VITE_ENABLE_MODULE_[NAME]
STEP 10a — SELF-AUDIT Eksekusi checklist audit statis terminal mandiri (verifikasi 0 pelanggaran ../ relative import, 0 bypass service, dan 0 hardcoded UI string)
STEP 11 — CLEANUP    Hapus ./PLAN.md HANYA setelah developer selesai mereview dan menyetujui hasil akhir implementasi
```

Sebelum Step 1: pastikan fitur ada di [`PRD.md`](./PRD.md) dan endpoint-nya ada di [`API.md`](./API.md), serta draf `./PLAN.md` (Step 0) telah dipaparkan, dibaca, dan disetujui secara eksplisit oleh developer / pemilik proyek.

### 5.1 Standar Struktur & Template Dokumen `PLAN.md`

Dokumen `./PLAN.md` adalah dokumen rencana kerja operasional yang disusun sebelum pengerjaan fitur baru. Dokumen ini dirancang agar siap dieksekusi secara mandiri dan terstruktur oleh AI Agent atau Junior Programmer tanpa kehilangan konteks maupun melanggar arsitektur.

#### Alur Kerja Dokumen `PLAN.md`:

1. **Penyusunan Draf**: AI Agent atau Junior Programmer membuat file `./PLAN.md` di root workspace berdasarkan template standar di bawah.
2. **Explicit Approval Checkpoint**: Paparkan ringkasan cakupan, daftar file yang akan disentuh, dan rencana pengujian kepada developer / pemilik proyek. Jika memaparkan pilihan opsi pengujian (Opsi A/B/C), jawaban pemilihan opsi **TIDAK BOLEH** langsung memicu eksekusi kode. AI Agent wajib memastikan developer telah membaca dokumen `./PLAN.md` dan memberikan persetujuan eksplisit ("PLAN.md disetujui", "sudah dibaca, silakan lanjut") sebelum menulis satu baris kode pun.
3. **Eksekusi Bertahap**: Eksekusi checklist pekerjaan dari Step 1 sampai Step 10, tandai checklist `[x]` saat masing-masing langkah selesai.
4. **Verifikasi Kualitas**: Jalankan `pnpm check` (Biome) dan `pnpm test` (Vitest unit test) hingga 100% lulus.
5. **Pembersihan (Cleanup)**: Jangan menghapus `./PLAN.md` secara terburu-buru begitu coding selesai. Biarkan file tetap berada di root workspace agar developer dapat memeriksa kesesuaian hasil implementasi dengan dokumen rencana. Hapus file `./PLAN.md` hanya setelah developer mengonfirmasi review hasil akhir pekerjaan.

#### Template Standar `./PLAN.md`:

````markdown
# IMPLEMENTATION PLAN — [Nama Fitur / Sub-fitur]

> **Target Modul**: `features/[modul]/[sub-fitur]`
> **Tanggal Pembuatan**: YYYY-MM-DD
> **Pelaksana**: AI Agent / Junior Programmer
> **Status**: [Draft / Menunggu Approval / Disetujui / Sedang Dikerjakan / Selesai]
> **Dokumen Terkait**: [`PRD.md` §...](./PRD.md) · [`API.md` §...](./API.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DESIGN.md`](./DESIGN.md)

---

## 1. Konteks & Cakupan (Scope)

- **Deskripsi Fitur**: Ringkasan fungsionalitas yang akan dibangun.
- **Batasan Ruang Lingkup**:
  - ✅ **In-Scope**: Fitur/komponen yang wajib dibangun sesuai PRD Fase 1.
  - ❌ **Out-of-Scope**: Hal-hal yang TIDAK boleh dibuat (fitur Fase 2, endpoint tambahan di luar kontrak).

## 2. Kontrak Data & Endpoint API (Service Layer)

### 2.1 Pemetaan Endpoint & Operasi API

_Rujuk kontrak resmi dari [`API.md`](./API.md) dan tetapkan konstanta URL di `features/.../lib/data/endpoint/index.ts`:_

| Operasi    | Endpoint Constant & Path URL                                            | HTTP Method | Parameter (Path / Query)                                       | Request Payload (Body)                 | Response Type                    | Keterangan                              |
| :--------- | :---------------------------------------------------------------------- | :---------- | :------------------------------------------------------------- | :------------------------------------- | :------------------------------- | :-------------------------------------- |
| **List**   | `[FEATURE]_ENDPOINT.LIST`<br>`${API_APP}/[path]`                        | `GET`       | `params?: FilterParams & { status?: CommonStatusType }`        | `void`                                 | `ArrayData<Base[Entity]Type>`    | Query list data paginasi & filter tabel |
| **Detail** | `[FEATURE]_ENDPOINT.DETAIL(id)`<br>`${API_APP}/[path]/detail/?id=${id}` | `GET`       | Path/Query `id: Base[Entity]Type["id"]`                        | `void`                                 | `Detail[Entity]Type`             | Query detail entitas lengkap            |
| **Count**  | `[FEATURE]_ENDPOINT.COUNT`<br>`${API_APP}/[path]/count/`                | `GET`       | `params?: CountParams`                                         | `void`                                 | `CountType`                      | Counter data untuk badge tab            |
| **Create** | `[FEATURE]_ENDPOINT.CREATE`<br>`${API_APP}/[path]/`                     | `POST`      | `void`                                                         | `[Entity]Input` (JSON) atau `FormData` | `Base[Entity]Type` (atau `void`) | Payload di-infer dari skema Valibot     |
| **Update** | `[FEATURE]_ENDPOINT.UPDATE(id)`<br>`${API_APP}/[path]/?id=${id}`        | `PUT`       | Path/Query `id: Base[Entity]Type["id"]`                        | `[Entity]Input` (JSON) atau `FormData` | `Base[Entity]Type` (atau `void`) | Payload di-infer dari skema Valibot     |
| **Delete** | `[FEATURE]_ENDPOINT.DELETE(id)`<br>`${API_APP}/[path]/?id=${id}`        | `DELETE`    | Path/Query `id: Base[Entity]Type["id"]`                        | `void`                                 | `void` (atau status message)     | Soft delete / hapus entitas by ID       |

### 2.2 Rincian Parameter (Params Specification)

- **Path & Query ID Parameter**:
  - Tipe ID: `id: Base[Entity]Type["id"]` (atau `string` / `number` spesifik).
  - Format Endpoint: `(id: Base[Entity]Type["id"]) => '/[path]/?id=${id}'`.
  - Guard service: `enabled: () => !!id()` agar query tidak dijalankan saat ID belum tersedia.
- **Query Filter Parameters**:
  - Filter list: `FilterParams` (`page`, `page_size`, `search`, `order`, `sort_by`) ditambah filter opsional modul (misal `status?: CommonStatusType`, `category_id?: string`).
  - Count params: `CountParams` (misal `status?: CommonStatusType`).
  - Export params: FilterParams tanpa limit paginasi, dengan `responseType: "blob"` untuk pengunduhan berkas.

### 2.3 Rincian Payload Create & Update (Inferred dari Skema Valibot)

- **Sumber Skema Validasi**: Didefinisikan di `features/.../components/form/[feature].validation.ts`.
- **Tipe Payload (Inferred Type)**: Wajib diturunkan langsung dari skema Valibot menggunakan `InferInput` (atau `InferOutput` jika ada transformasi data):
  ```typescript
  // features/.../components/form/[feature].validation.ts
  export const [Feature]Schema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name is required")),
    code: v.pipe(v.string(), v.minLength(1, "Code is required")),
    attachment_file: v.optional(v.instance(File)),
    // ...
  });

  export type [Feature]Input = v.InferInput<typeof [Feature]Schema>;
  ```
- **Bentuk Serialisasi Data**:
  - **Plain JSON**: Jika form tidak memuat unggahan berkas, fungsi API & service langsung menerima payload bertipe `[Feature]Input`.
  - **Multipart / FormData**: Jika form memuat berkas (`v.instance(File)`), gunakan helper `appendFormData(payload)` dari `~/lib/utils` untuk mengubah `[Feature]Input` menjadi instance `FormData` sebelum dikirim via `http.post`/`http.put` dengan header `'Content-Type': 'multipart/form-data'`.

### 2.4 Rincian Response Type (Bentuk Data Balikan)

- **Query List Response**: `ArrayData<Base[Entity]Type>` yang memuat struktur standar `{ data: Array<Base[Entity]Type>, meta: PaginationMeta }`.
- **Query Detail Response**: `Detail[Entity]Type` yang mengekstensi base type dengan relasi detail (misal detail profil, riwayat aktivitas, dokumen pendukung).
- **Mutation Create & Update Response**:
  - Jika backend mengembalikan entitas baru/terupdate: tetapkan tipe data balikan eksplisit (misal `Base[Entity]Type` atau `{ id: string; message: string }`).
  - Jika backend tidak mengembalikan payload (204 No Content atau string sederhana): tetapkan `void` atau `{ message: string }`.
  - **Strict Typing pada Service**: Masukkan response type ke parameter generic `MutationProps<T>` pada hook service:
    ```typescript
    export const useCreate[Feature] = (props: MutationProps<Base[Entity]Type>) =>
      createMutation(() => ({
        mutationFn: async (data: FormData | [Feature]Input) => await create[Feature](data),
        onSuccess: (response) => props.onSuccess?.(response.data),
        onError: (error: ErrorType<AxiosError>) => props.onError?.(error),
      }));
    ```
- **Mutation Delete Response**: Mengembalikan `void` atau `{ message: string }`.

## 3. Desain Komponen & UI Primitif

- **Komponen Primitif UI yang Digunakan**: `Button`, `Dialog`, `Input`, `Table`, `Badge`, dll. (berbasis Ark UI `@ark-ui/solid` + Tailwind v4 + CVA).
- **Shared Components**: `DataTable`, `AlertDialog`, `ContentWrapper`, `DatePicker`, dll.
- **Token Warna & Layout**: Semantik Tailwind v4 (`bg-card`, `border-border`, dsb.).

## 4. Perencanaan Pengujian Ganda (Dual-Scenario Alignment)

_Wajib memuat skenario Positif & Negatif berpasangan sesuai Guardrail #27 & #28:_

- **Unit Test (Data Layer & Skema Valibot)**:
  - _Positif_: Input valid, parsing response 200 OK, form data mapping.
  - _Negatif_: Input kosong/invalid format (Valibot error), response error 400/500, parsing failure.
- **E2E Test (Playwright)**:
  - _Positif_: Alur pengisian form, simpan data, dan tampilan data pada tabel berhasil.
  - _Negatif_: Validasi form gagal memblokir submit, penanganan boundary atau error backend.

## 5. Checklist Eksekusi Step-by-Step

_Mengikuti urutan eksekusi §5 AGENTS.md:_

- [ ] **Step 1: Types** (`features/.../types/schema.ts`)
- [ ] **Step 2: Endpoint** (`features/.../lib/data/endpoint/index.ts`)
- [ ] **Step 2a: Endpoint Test** (`features/.../lib/data/endpoint/index.test.ts` - Dual-scenario)
- [ ] **Step 3: API Layer** (`features/.../lib/data/api/index.ts`)
- [ ] **Step 3a: Query Keys** (`features/.../lib/data/query-keys/index.ts`)
- [ ] **Step 3b: Mock (Opsional)** (`features/.../lib/data/mock/index.ts` jika API backend belum siap)
- [ ] **Step 3c: Data Test** (`features/.../lib/data/api/index.test.ts` - Dual-scenario)
- [ ] **Step 4: Service** (`features/.../lib/data/service/index.ts`)
- [ ] **Step 4a: Service Test** (`features/.../lib/data/service/index.test.ts` - Dual-scenario)
- [ ] **Step 5: Validation Schema** (`features/.../components/form/*.validation.ts`)
- [ ] **Step 5a: Validation Test** (`features/.../components/form/*.validation.test.ts` - Dual-scenario)
- [ ] **Step 6: Form Component** (`features/.../components/form/*.form.tsx` - Formisch + inline errors)
- [ ] **Step 7: View Components** (`*-list.tsx`, `*-detail.tsx` - Permission check & AlertDialog)
- [ ] **Step 8: Route Integration** (`routes/app/...\`)
- [ ] **Step 9: i18n Localization** (`src/locales/en/*` DAN `src/locales/id/*`)
- [ ] **Step 10: App/Module Config** (`src/config/app.ts` bila modul baru)

## 6. Definition of Done (DoD) & Verifikasi Akhir

- [ ] `pnpm check` lolos tanpa error formatting/linter (Biome).
- [ ] `pnpm test` seluruh unit test lulus (skenario positif & negatif tervalidasi).
- [ ] Audit statis mandiri lolos 100% (0 pelanggaran relative import `../`, 0 raw `<div class="flex">`, 0 komponen bypass `service/`, 0 hardcoded UI string).
- [ ] Commit dibuat via `pnpm git:commit` mengikuti format Conventional Commits.
- [ ] File `./PLAN.md` dihapus setelah diverifikasi dan disetujui.
````

---

---

## 6. Referensi Lokasi File Sumber & Shared Utilities

Untuk menjaga prinsip _Single Source of Truth_ (SSOT) dan mencegah duplikasi kode atau dokumentasi basi (_stale docs_):

1. **Pemeriksaan Fungsi Bertujuan Sama (Same-Purpose & Semantic Redundancy Check)**:
   - **Jangan hanya memeriksa keberadaan file sumber aslinya saja**, melainkan **wajib meneliti secara aktif apakah sudah ada fungsi, helper, hook, tipe data, atau utilitas yang memiliki tujuan atau fungsionalitas yang sama (*same intent/purpose*)** di dalam codebase sebelum memutuskan menulis kode baru.
   - Lakukan penelusuran kata kunci di `src/lib/utils/`, `src/hooks/`, `src/types/`, dan `src/components/common/` untuk menemukan utilitas yang relevan.
2. **Reuse atau Extend (Gunakan atau Perluas yang Ada)**:
   - Jika sudah ada fungsi atau utilitas dengan tujuan serupa, **wajib gunakan fungsi yang sudah ada** alih-alih membuat fungsi baru dengan nama berbeda (*logic duplication/drift*).
   - Jika fungsi yang ada membutuhkan variasi atau kemampuan tambahan, **perluas fungsi tersebut secara aman dan *backward-compatible*** (misalnya dengan menambah opsi parameter opsional atau overload) daripada membuat utilitas baru yang redundan.
3. **Larangan Duplikasi Logika Lokal**:
   - Dilarang keras membuat helper lokal inline atau fungsi privat di dalam modul fitur jika tujuannya sudah dicakup oleh shared utilities (seperti penanganan manipulasi teks, formatting berkas, manipulasi `FormData`, konversi waktu, atau manajemen cookie).

Rujuk langsung file acuan berikut sesuai kebutuhan:

| Kebutuhan                               | Lokasi Sumber Utama (_Source of Truth_)                                                                                         | Keterangan & Panduan Penggunaan                                                                                                                              |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fungsi Utilitas & Helper Global**     | [`src/lib/utils/`](./src/lib/utils/) (`~/lib/utils`)                                                                            | Utilitas bersama seperti `cn()`, `parsePermission()`, `downloadFile()`, `appendFormData()`, konversi string/waktu, truncate teks, dll. Selalu cek fungsi bertarget serupa sebelum membuat fungsi baru. |
| **Tipe Data Bersama & Enums**           | [`src/types/common.ts`](./src/types/common.ts) & [`api.ts`](./src/types/api.ts)                                                 | Generic interface seperti `ArrayData<T>`, `CountType`, `FilterParams`, `CommonStatusType`, `MutationProps`, dll.                                             |
| **Kontrak Endpoint & Skema Data API**   | [`API.md`](./API.md)                                                                                                            | Definisi lengkap endpoint `API_CORE` (Auth & IAM) dan `API_APP` (Business Domain), parameter models, request body, dan response.                             |
| **Design Tokens & Variabel Warna**      | [`src/assets/styles/variables.css`](./src/assets/styles/variables.css)                                                          | Sumber tunggal (_single source of truth_) nilai warna OKLCH (3-layer tokens). Panduan kelas utilitas semantik Tailwind v4 ada di [`DESIGN.md`](./DESIGN.md). |
| **Komponen Primitives UI**              | [`src/components/ui/`](./src/components/ui/)                                                                                    | Primitif UI berbasis Ark UI + Tailwind CSS v4 + CVA (`Button`, `Dialog`, `Input`, `Table`, `Badge`, dll.).                                                   |
| **Ark UI Primitives & LLMs.txt Docs**   | [`https://ark-ui.com/llms-solid.txt`](https://ark-ui.com/llms-solid.txt) & [`.agents/skills/ark-ui/`](./.agents/skills/ark-ui/) | Dokumentasi resmi Ark UI SolidJS via endpoint LLMs.txt on-demand, anatomi part, contoh kode Solid, dan quick index (`components-index.md`).                                                         |
| **Shared Functional/Layout Components** | [`src/components/common/`](./src/components/common/) & [`src/components/layouts/`](./src/components/layouts/)                   | Komponen bersama lintas fitur (`DataTable`, `AlertDialog`, `EmptyData`, `DatePicker`, `ContentWrapper`, dll.).                                               |
| **Konfigurasi State Modul (Flags)**     | [`src/config/app.ts`](./src/config/app.ts)                                                                                      | Objek `MODULE_ACTIVE_CONFIG` pembaca feature flags modular `.env`.                                                                                           |
| **Konfigurasi HTTP & Auth Cookie**      | [`src/config/http.ts`](./src/config/http.ts), [`cookies.ts`](./src/config/cookies.ts)                                           | Pengaturan Axios instance, interceptor refresh token, dan enkapsulasi akses cookie.                                                                          |

---

## 7. Tata Kelola Dokumen (Living Document Protocol)

Dokumen `AGENTS.md` berstatus **Approved Baseline — Living Document**. Dokumen ini bersifat adaptif dan dapat diperbarui mengikuti penambahan dependensi baru, perubahan arsitektur SolidJS/Tailwind, atau kesepakatan konvensi tim developer.

### 7.1 Alur Perubahan Tata Tertib & Aturan Koding

```
                    [ 1. Usulan Perubahan Tata Tertib ]
      (Penambahan dependensi baru, perubahan linter/formatter, atau konvensi kode)
                                    │
                                    ▼
                    [ 2. Analisis & Uji Kompatibilitas ]
   - Evaluasi dampak terhadap guardrails (§4) dan zona hati-hati (§1.1)
   - Uji kompatibilitas dengan ekosistem SolidJS v1.9, Biome, dan Tailwind v4
   - Pastikan tidak melanggar batasan arsitektur (ARCHITECTURE.md §2)
                                    │
                                    ▼
                 [ 3. Evaluasi & Persetujuan Developer ]
   Divalidasi dan disetujui langsung oleh Developer / Pemilik Proyek
                                    │
                                    ▼
               [ 4. Pembaruan AGENTS.md & Tooling Enforcement ]
   - Perbarui AGENTS.md dan catat riwayat pada §8
   - Selaraskan biome.json, package.json, atau hook Husky jika ada perubahan tooling
   - Sosialisasikan perubahan aturan kepada AI prompt dan lingkungan pengembangan
```

### 7.2 Prinsip Pengelolaan Tata Tertib

1. **Konsistensi Lintas Dokumen**: Perubahan pada aturan koding wajib diselaraskan dengan [`PRD.md`](./PRD.md) (scope), [`ARCHITECTURE.md`](./ARCHITECTURE.md) (pola teknis), [`DESIGN.md`](./DESIGN.md) (visual), [`API.md`](./API.md) (kontrak data), dan [`DEPLOYMENT.md`](./DEPLOYMENT.md) (CI/CD & environment).
2. **Tooling Enforcement**: Setiap aturan baru sebisa mungkin ditegakkan secara otomatis via tooling (Biome linter, Commitlint, TypeScript strict, atau lint-staged) dan tidak hanya mengandalkan ingatan manual.
3. **Pencegahan Over-Engineering**: Hindari menambahkan layer abstraksi, state global, atau aturan baru yang tidak diperlukan oleh scope MVP Fase 1.

---

## 8. Document Revision History

| Versi     | Tanggal    | Inisiator / Maintainer   | Ringkasan Perubahan & Catatan                                                                                                                                                                                                                                                                                                                                                                                                            |
| :-------- | :--------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.2.5** | 6 Nov 2026 | Developer & AI Assistant | **Eliminasi Berkas Fisik `llms-solid.txt` & Transisi On-Demand Fetching (§2.7 & §6)**:<br>• Menghapus berkas fisik monolitik `llms-solid.txt` (1.7 MB) dari repositori untuk mencegah pemborosan context window (token bloat) dan git bloat<br>• Menstandarisasi penarikan dokumentasi per-komponen secara on-demand langsung via URL endpoint Ark UI (`https://ark-ui.com/llms.txt/components/{component}?framework=solid`) serta quick index lokal (`components-index.md`). |
| **1.2.4** | 6 Nov 2026 | Developer & AI Assistant | **Protokol Verifikasi Utilitas Bertujuan Sama (§6)**:<br>• Memperluas aturan SSOT (§6): tidak hanya mengecek file sumber aslinya, melainkan wajib memeriksa secara aktif apakah sudah ada fungsi atau utilitas yang memiliki tujuan/kegunaan yang sama (*same intent/purpose*) sebelum membuat fungsi baru<br>• Menegaskan prinsip *reuse* atau *extend* secara *backward-compatible* dan larangan duplikasi logika lokal<br>• Menyelaraskan referensi path ke direktori modular [`src/lib/utils/`](./src/lib/utils/) dan [`src/types/api.ts`](./src/types/api.ts). |
| **1.2.3** | 5 Nov 2026 | Developer & AI Assistant | **Pembersihan Remnan Domain & Generalisasi Boilerplate (§1, §4, §5.1, §6)**:<br>• Menyelaraskan referensi Fase 2 ke PRD §3.2 (menghapus remnan fitur logistik/tambang seperti weighbridge, GPS, check-in/out dan menggantinya dengan fitur PRD resmi)<br>• Menghapus tipe data domain lama (`DTStatus`) dan filter `vendor_id` pada template `PLAN.md` dan tabel SSOT (§6) menjadi `CommonStatusType` dan `category_id`<br>• Menggeneralisasi contoh field dan relasi response detail pada template `PLAN.md`. |
| **1.2.2** | 5 Nov 2026 | Developer & AI Assistant | **Penyelarasan CI/CD ke GitHub Actions (§2.8)**:<br>• Memperbarui referensi GitLab CI pada deskripsi tipe commit `ci`, contoh commit, dan mekanisme Validasi Ganda (Dual Enforcement §2.8 poin 4) ke GitHub Actions (`.github/workflows/ci.yml` & Pull Request).                                                                                                                                                                         |
| **1.2.1** | 4 Nov 2026 | Developer & AI Assistant | **Generalisasi Contoh Konvensi Penamaan (§2.2)**:<br>• Memperbarui seluruh contoh penamaan pada tabel §2.2 agar menggunakan entitas umum (seperti `User`, `Role`, `Product`, `Category`) yang representatif untuk boilerplate frontend universal, menggantikan contoh berbasis domain spesifik sebelumnya.                                                                                                                               |
| **1.2.0** | 4 Nov 2026 | Developer & AI Assistant | **Integrasi Standar Ark UI LLMs.txt untuk Seluruh AI Agent**:<br>• Penyediaan skill universal `ark-ui` (`.agents/skills/ark-ui/`) yang disinkronkan ke Cursor, Windsurf, Claude, Copilot, Hermes, Grok, Qwen<br>• Integrasi endpoint resmi `https://ark-ui.com/llms-solid.txt` dan per-component markdown SolidJS<br>• Penyimpanan referensi lokal offline (`references/llms-solid.txt`) dan konfigurasi MCP server (`.vscode/mcp.json`) |
| **1.1.0** | 4 Nov 2026 | Developer & AI Assistant | **Integrasi Prinsip Ponytail (Lazy Senior Dev Mode)**:<br>• Adopsi otomatis prinsip _The Smallest Complete Change_ dan anti-overengineering ke Protokol Kerja (§1 poin 12) dan Guardrail #41<br>• Standarisasi hirarki solusi minimal (reuse code > standard platform > installed deps > shortest diff)<br>• Kewajiban anotasi shortcut (`// shortcut: ...`) dan 1-2 line skip/risk report pada setiap respon                            |
| **1.0.0** | 4 Nov 2026 | Developer & AI Assistant | **Baseline Resmi SolidStart Frontend Boilerplate**:<br>• Rilis inisial aturan kerja, tata tertib, dan guardrails koding universal untuk proyek pribadi maupun tim<br>• Standarisasi reaktivitas SolidJS strict, path alias `~`, generic array `Array<T>`, dan Ark UI (`@ark-ui/solid`) + Tailwind CSS v4<br>• Integrasi protokol perencanaan `PLAN.md`, testing ganda, dan mandatori self-audit                                          |

---

_Dokumen ini berstatus **Active Baseline**. Segala perubahan tata kelola kontributor dan aturan koding lanjutan wajib mengikuti tata kelola pada §7 dan dicatat pada tabel riwayat revisi di atas._
_Versi: 1.2.5 (Boilerplate Baseline + On-Demand Ark UI Docs Fetching) — 6 November 2026_
