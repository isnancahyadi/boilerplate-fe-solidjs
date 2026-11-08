# SolidStart Frontend Boilerplate — Design System

> **Versi Dokumen**: 1.1.0 (Boilerplate Baseline + Ark UI LLMs.txt Integration)
> **Tanggal Efektif**: 4 November 2026
> **Status**: Active Baseline — Living Document (Adaptif & Updatable via Protokol §14)
> **Dokumen Terkait**: [`PRD.md`](./PRD.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`AGENTS.md`](./AGENTS.md) · [`API.md`](./API.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)
> **Pemilik / Maintainer**: Developer (Personal / Team Project)
> **Audience**: Developer, UI/UX Designer, & AI Coding Assistant
>
> **Dokumen ini = sumber kebenaran visual & interaksi.** Menjawab pertanyaan: _"Bagaimana tampilan, estetika, interaksi, dan tata letak UI aplikasi dibangun secara konsisten?"_

**Stack:**

| Layer              | Library                 |
| ------------------ | ----------------------- |
| UI Framework       | SolidJS + SolidStart v2 |
| Styling            | Tailwind CSS v4         |
| Component Library  | Ark UI (`@ark-ui/solid`) + CVA |
| Form Management    | Formisch                |
| Validation         | Valibot                 |
| Icon Library       | `lucide-solid`          |
| Linter / Formatter | BiomeJS                 |
| i18n               | EN / ID                 |

---

## Daftar Isi

1. [Token Desain: Warna](#1-token-desain-warna)
2. [Token Desain: Tipografi](#2-token-desain-tipografi)
3. [Token Desain: Spasi & Radius](#3-token-desain-spasi--radius)
4. [Token Desain: Animasi](#4-token-desain-animasi)
5. [Mode Gelap & Terang](#5-mode-gelap--terang)
6. [Implementasi CSS — src/assets/styles/](#6-implementasi-css--srcassetsstyles)
7. [Sistem Ikon — lucide-solid](#7-sistem-ikon--lucide-solid)
8. [Komponen UI Primitif — Ark UI + CVA](#8-komponen-ui-primitif--ark-ui--cva)
9. [Komponen Common & Layouts](#9-komponen-common--layouts)
10. [Standar Visual & State Input Form](#10-standar-visual--state-input-form)
11. [Aksesibilitas](#11-aksesibilitas)
12. [Aturan Penulisan Kelas Tailwind](#12-aturan-penulisan-kelas-tailwind)
13. [UI/UX Flow & Keputusan Desain](#13-uiux-flow--keputusan-desain)
14. [Tata Kelola Perubahan Desain Sistem (Living Document Protocol)](#14-tata-kelola-perubahan-desain-sistem-living-document-protocol)
15. [Document Revision History](#15-document-revision-history)
16. [Ringkasan Cepat — Quick Reference](#16-ringkasan-cepat--quick-reference)

---

## 1. Token Desain: Warna

### 1.1 Arsitektur 3-Layer

Boilerplate menggunakan **3-layer architecture** untuk token warna yang bersumber langsung dari [`src/assets/styles/variables.css`](./src/assets/styles/variables.css):

```
Layer 1 — Primitive / Base Variables di :root (mis. --primary, --surface-primary, --background)
  └─ Layer 2 — Tailwind v4 Theme Mapping di @theme inline (mis. --color-primary: var(--primary), ...)
       └─ Layer 3 — Component Utility Classes (Tailwind v4: bg-primary, bg-surface-primary, text-foreground, border-border, ...)
```

> **Mengapa OKLCH?**
> OKLCH (Oklch Lightness Chroma Hue) memberikan perceptual uniformity yang lebih baik dibanding HEX/RGB. Perubahan nilai `L` (lightness) selalu terasa konsisten di mata, sehingga hover/active state dapat diprediksi tanpa trial-and-error.

---

### 1.2 Pendekatan Light-First Default

Boilerplate ini mengadopsi standar desain **Light-First** yang bersih, modern, dan profesional — seluruh token warna dasar di selector `:root` disetel untuk tampilan mode terang (*Light Mode*), sementara token mode gelap (*Dark Mode*) dikelola melalui selector `.dark` atau atribut `[data-theme="dark"]`.

---

### 1.3 Palet Semantik — Light Mode (Default)

#### Primary Brand Color

Warna primer bawaan boilerplate menggunakan aksen yang bersih dan mudah diganti sesuai identitas proyek baru:

| CSS Variable (`:root`) | Tailwind Token (`@theme inline`) | Nilai OKLCH                  | Deskripsi                     |
| :--------------------- | :------------------------------- | :--------------------------- | :---------------------------- |
| `--primary`            | `--color-primary`                | `oklch(55% 0.18 250)`        | Warna utama brand, CTA button |
| `--primary-hover`      | `--color-primary-hover`          | `oklch(48% 0.18 250)`        | State hover primary           |
| `--primary-foreground` | `--color-primary-foreground`     | `oklch(98% 0 0)`             | Teks di atas primary (putih)  |

#### Surfaces — Clean Light Tiered Surfaces

Sistem antarmuka menggunakan hirarki permukaan berlapis (*tiered surfaces*) untuk memisahkan kedalaman visual (shell, panel, input, popover):

| CSS Variable (`:root`) | Tailwind Token (`@theme inline`) | Nilai OKLCH                  | Penggunaan / Deskripsi                                                            |
| :--------------------- | :------------------------------- | :--------------------------- | :-------------------------------------------------------------------------------- |
| `--background`         | `--color-background`             | `oklch(99% 0 0)`             | Background halaman dasar / root layout                                            |
| `--surface-primary`    | `--color-surface-primary`        | `oklch(97% 0.003 247)`       | Layout shell, header navigasi atas, background tabel                              |
| `--surface-secondary`  | `--color-surface-secondary`      | `oklch(95% 0.004 247)`       | Sidebar navigasi, modal wrapper, panel card container                             |
| `--surface-tertiary`   | `--color-surface-tertiary`       | `oklch(92% 0.006 247)`       | Input form background, baris striping tabel                                       |
| `--surface-elevated`   | `--color-surface-elevated`       | `oklch(100% 0 0)`            | Elemen melayang: popover, dropdown menu, tooltip                                   |
| `--foreground`         | `--color-foreground`             | `oklch(20% 0.02 260)`        | Teks utama (dark charcoal)                                                        |
| `--muted-foreground`   | `--color-muted-foreground`       | `oklch(50% 0.02 260)`        | Teks sekunder, label pembantu, placeholder                                        |
| `--border`             | `--color-border`                 | `oklch(88% 0.005 250)`       | Garis batas pemisah, separator, border tabel                                      |
| `--input-border`       | `--color-input`                  | `oklch(84% 0.006 250)`       | Border input form default                                                         |

#### Status Colors

| CSS Variable (`:root`)     | Tailwind Token (`@theme inline`) | Nilai OKLCH           | Nama Visual  | Use Case                            |
| :------------------------- | :------------------------------- | :-------------------- | :----------- | :---------------------------------- |
| `--success`                | `--color-success`                | `oklch(62% 0.17 145)` | Hijau        | Berhasil, aktif, siap digunakan     |
| `--success-foreground`     | `--color-success-foreground`     | `oklch(98% 0 0)`      | Putih        | Teks di atas success                |
| `--warning`                | `--color-warning`                | `oklch(75% 0.16 75)`  | Amber/Kuning | Peringatan, standby, menunggu       |
| `--warning-foreground`     | `--color-warning-foreground`     | `oklch(20% 0.02 75)`  | Gelap        | Teks di atas warning                |
| `--info`                   | `--color-info`                   | `oklch(60% 0.16 240)` | Biru         | Informasi, catatan, detail tambahan |
| `--info-foreground`        | `--color-info-foreground`        | `oklch(98% 0 0)`      | Putih        | Teks di atas info                   |
| `--destructive`            | `--color-destructive`            | `oklch(58% 0.22 27)`  | Merah        | Error, aksi hapus, bahaya           |
| `--destructive-foreground` | `--color-destructive-foreground` | `oklch(98% 0 0)`      | Putih        | Teks di atas destructive            |

---

### 1.4 Palet Semantik — Dark Mode

Token berikut meng-override nilai Light Mode saat selector `.dark` atau `[data-theme="dark"]` aktif:

| CSS Variable (Dark Mode)     | Tailwind Token (`@theme inline`) | Nilai OKLCH           | Nama Visual  | Use Case                            |
| :--------------------------- | :------------------------------- | :-------------------- | :----------- | :---------------------------------- |
| `--primary`                  | `--color-primary`                | `oklch(65% 0.18 250)` | Biru         | Warna utama brand, CTA button       |
| `--primary-hover`            | `--color-primary-hover`          | `oklch(72% 0.18 250)` | Biru terang  | State hover primary                 |
| `--primary-foreground`       | `--color-primary-foreground`     | `oklch(15% 0.02 250)` | Gelap        | Teks di atas primary                |
| `--background`               | `--color-background`             | `oklch(18% 0.01 260)` | Charcoal     | Background halaman dasar            |
| `--surface-primary`          | `--color-surface-primary`        | `oklch(22% 0.01 260)` | Charcoal     | Layout shell dan tabel              |
| `--surface-secondary`        | `--color-surface-secondary`      | `oklch(26% 0.01 260)` | Charcoal     | Sidebar dan panel card              |
| `--surface-tertiary`         | `--color-surface-tertiary`       | `oklch(30% 0.01 260)` | Charcoal     | Input form dan striping tabel       |
| `--surface-elevated`         | `--color-surface-elevated`       | `oklch(24% 0.01 260)` | Charcoal     | Popover, dropdown, dan tooltip      |
| `--foreground`               | `--color-foreground`             | `oklch(96% 0 0)`      | Putih        | Teks utama                          |
| `--muted-foreground`         | `--color-muted-foreground`       | `oklch(65% 0.01 260)` | Abu-abu      | Teks sekunder dan placeholder       |
| `--border`                   | `--color-border`                 | `oklch(32% 0.01 260)` | Abu-abu      | Garis batas dan separator           |
| `--input-border`             | `--color-input`                  | `oklch(36% 0.01 260)` | Abu-abu      | Border input form                  |
| `--info`                     | `--color-info`                   | `oklch(68% 0.16 240)` | Biru terang  | Informasi dan catatan               |
| `--info-foreground`          | `--color-info-foreground`        | `oklch(15% 0.02 240)` | Gelap        | Teks di atas info                   |
| `--destructive`              | `--color-destructive`            | `oklch(62% 0.2 27)`  | Merah        | Error, aksi hapus, bahaya           |

---

### 1.5 Tabel Kontras Minimal (WCAG AA)

| Kombinasi                                   | Kontras | Level  |
| ------------------------------------------- | ------- | ------ |
| `foreground` atas `background`              | ≥ 7:1   | AAA ✅ |
| `primary-foreground` atas `primary`         | ≥ 4.5:1 | AA ✅  |
| `muted-foreground` atas `background`        | ≥ 4.5:1 | AA ✅  |
| `destructive-foreground` atas `destructive` | ≥ 4.5:1 | AA ✅  |
| `warning-foreground` atas `warning`         | ≥ 4.5:1 | AA ✅  |

> **Catatan:** Selalu verifikasi kontras menggunakan [APCA Contrast Checker](https://www.myndex.com/APCA/) atau browser DevTools sebelum merilis komponen baru.

---

### 1.6 Standar Pemetaan Status Entitas (Entity Status Colors)

Pemetaan status operasional / entitas bisnis ke token warna semantik:

| Status                | Token Warna                | Class Tailwind           | Deskripsi                               |
| --------------------- | -------------------------- | ------------------------ | --------------------------------------- |
| `active` / `ready`    | `--color-success`          | `text-success`           | Entitas aktif, siap digunakan, sukses   |
| `pending` / `standby` | `--color-warning`          | `text-warning`           | Menunggu verifikasi, standby, antrean   |
| `inactive` / `error`  | `--color-destructive`      | `text-destructive`       | Non-aktif, ditolak, error, dibatalkan   |
| `draft` / `archived`  | `--color-muted-foreground` | `text-muted-foreground` | Draf awal, diarsipkan, status netral    |

---

## 2. Token Desain: Tipografi

### 2.1 Font Family

Boilerplate menggunakan font **Inter** sebagai satu-satunya jenis huruf utama (_primary font family_). Inter dipilih karena:

- Memiliki keterbacaan (_legibility_) yang sangat tinggi pada antarmuka dashboard data padat.
- Mendukung fitur angka tabel (_numeric tabular figures_), krusial untuk kestabilan visual kolom data angka (finansial, kuantitas, durasi, timestamp).
- Memiliki variasi bobot lengkap yang teroptimasi (Regular 400, Medium 500, SemiBold 600, Bold 700).

#### 1. Konfigurasi Font Token

Dikonfigurasikan di dalam `@theme inline` pada [`src/assets/styles/variables.css`](./src/assets/styles/variables.css):

```css
@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
}
```

#### 2. Mekanisme Import Aktual

Font Inter diimpor secara terpusat pada baris paling awal stylesheet [`src/assets/styles/index.css`](./src/assets/styles/index.css):

```css
/* src/assets/styles/index.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import "tailwindcss";
@import "./variables.css";
@import "./global.css";
```

File `index.css` diimpor langsung pada root layout aplikasi [`src/app.tsx`](./src/app.tsx), sehingga font Inter aktif secara universal di seluruh elemen aplikasi tanpa memerlukan dependensi npm terpisah (`@fontsource`) atau tag link manual di HTML.

---

### 2.2 Skala Tipografi

| Class Tailwind | Size            | Line Height | Penggunaan                   |
| -------------- | --------------- | ----------- | ---------------------------- |
| `text-xs`      | 12px / 0.75rem  | 1rem        | Label form, badge, caption   |
| `text-sm`      | 14px / 0.875rem | 1.25rem     | Body teks, cell tabel, input |
| `text-base`    | 16px / 1rem     | 1.5rem      | Paragraf, konten utama       |
| `text-lg`      | 18px / 1.125rem | 1.75rem     | Subjudul section             |
| `text-xl`      | 20px / 1.25rem  | 1.75rem     | Judul card, page title kecil |
| `text-2xl`     | 24px / 1.5rem   | 2rem        | Page title                   |
| `text-3xl`     | 30px / 1.875rem | 2.25rem     | Dashboard headline           |

---

### 2.3 Font Weight

| Token    | Nilai | Class Tailwind  | Penggunaan                  |
| -------- | ----- | --------------- | --------------------------- |
| Regular  | 400   | `font-normal`   | Body teks, cell tabel       |
| Medium   | 500   | `font-medium`   | Label, tombol sekunder      |
| Semibold | 600   | `font-semibold` | Judul section, heading card |
| Bold     | 700   | `font-bold`     | Page title, nilai KPI utama |

---

### 2.4 Panduan Penggunaan Tipografi

```tsx
// ✅ Page Title
<h1 class="text-2xl font-bold text-foreground">Daftar Pengguna</h1>

// ✅ Section Heading
<h2 class="text-lg font-semibold text-foreground">Filter Data</h2>

// ✅ Card label (secondary info)
<span class="text-sm font-medium text-muted-foreground">Total Pengguna Aktif</span>

// ✅ KPI Value
<p class="text-3xl font-bold text-primary">142</p>

// ✅ Table cell
<td class="text-sm text-foreground">USR-001</td>

// ✅ Badge / label kecil
<span class="text-xs font-medium">active</span>
```

---

## 3. Token Desain: Spasi & Radius

### 3.1 Radius Tokens

| Token CSS     | Nilai            | Class Tailwind | Penggunaan            |
| ------------- | ---------------- | -------------- | --------------------- |
| `--radius-sm` | `0.25rem` (4px)  | `rounded-sm`   | Badge, tag kecil      |
| `--radius-md` | `0.5rem` (8px)   | `rounded-md`   | Button, input, select |
| `--radius-lg` | `0.75rem` (12px) | `rounded-lg`   | Card, dialog panel    |
| `--radius-xl` | `1rem` (16px)    | `rounded-xl`   | Modal besar, drawer   |

---

### 3.2 Spacing Convention

Boilerplate mengikuti skala spacing Tailwind default (4px base unit):

| Nilai      | px   | Penggunaan Umum               |
| ---------- | ---- | ----------------------------- |
| `space-1`  | 4px  | Gap antar inline elemen kecil |
| `space-2`  | 8px  | Padding badge, gap icon-teks  |
| `space-3`  | 12px | Padding button kecil          |
| `space-4`  | 16px | Padding card, gap standar     |
| `space-5`  | 20px | Padding section kecil         |
| `space-6`  | 24px | Padding page container        |
| `space-8`  | 32px | Gap antar section besar       |
| `space-10` | 40px | Margin top halaman            |
| `space-12` | 48px | Tinggi header navbar          |
| `space-16` | 64px | Tinggi sidebar collapsed      |

---

### 3.3 Layout Grid

```
Sidebar width   : 240px (expanded) / 64px (collapsed)
Content padding : px-6 py-4 (24px horizontal, 16px vertical)
Max content     : max-w-screen-xl mx-auto
Card gap        : gap-4 (16px) default, gap-6 (24px) untuk dashboard grid
```

---

## 4. Token Desain: Animasi

### 4.1 Token Animasi

| Token                | Nilai                    | Penggunaan                    |
| -------------------- | ------------------------ | ----------------------------- |
| `--animate-fade-in`  | `fade-in 0.15s ease-out` | Modal, dropdown, toast muncul |
| `--animate-slide-in` | `slide-in 0.2s ease-out` | Drawer, sidebar, panel slide  |

### 4.2 Keyframe Definitions

Keyframe ini didefinisikan di `variables.css`:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 4.3 Panduan Penggunaan Animasi

```tsx
// ✅ Modal / Dialog dengan fade-in
<div class="animate-[fade-in_0.15s_ease-out]">
  <DialogContent />
</div>

// ✅ Drawer dengan slide-in
<div class="animate-[slide-in_0.2s_ease-out]">
  <DrawerContent />
</div>

// ✅ Gunakan prefers-reduced-motion untuk aksesibilitas
// Tailwind class: motion-safe:animate-[fade-in_0.15s_ease-out]
<div class="motion-safe:animate-[fade-in_0.15s_ease-out]">
  ...
</div>
```

> **Prinsip Animasi:**
>
> - Durasi pendek (< 250ms) untuk elemen kecil (badge, tooltip)
> - Durasi sedang (200-300ms) untuk overlay (modal, drawer)
> - Selalu pertimbangkan `prefers-reduced-motion` untuk aksesibilitas

---

## 5. Mode Gelap & Terang

### 5.1 Prinsip Light-First & Dukungan Dark Mode

Boilerplate ini dirancang **Light-First**:
- Seluruh token warna di `:root` default mengarah ke palet terang netral beresolusi tinggi.
- Dark mode didukung secara native via class `.dark` atau atribut `[data-theme="dark"]` yang meng-override token permukaan dan teks.
- Pengguna dapat beralih tema melalui tombol toggle atau mengikuti preferensi sistem peramban (*prefers-color-scheme*).

### 5.2 Strategi Toggle

Toggle tema dikelola via **state management** (store SolidJS atau Zustand-like signal) yang menulis atribut `data-theme` ke elemen `<html>`:

```tsx
// src/stores/theme.store.ts
import { createSignal } from "solid-js";

type Theme = "dark" | "light" | "system";

const [theme, setTheme] = createSignal<Theme>("light");

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.setAttribute("data-theme", "dark");
  } else if (t === "light") {
    root.removeAttribute("data-theme");
  } else {
    // "system" — hapus atribut, biarkan media query yang mengontrol
    root.removeAttribute("data-theme");
  }
  localStorage.setItem("app-theme", t);
}

export { theme, setTheme, applyTheme };
```

```tsx
// src/components/ThemeToggle.tsx
import { Moon, Sun } from "lucide-solid";

import { applyTheme, setTheme, theme } from "~/stores/theme.store";

export function ThemeToggle() {
  function toggle() {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle tema"
      class="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-2 transition-colors"
    >
      {theme() === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
```

### 5.3 Inisialisasi Theme (Mencegah Flash)

Tambahkan script inline di `<head>` untuk mencegah flash of unstyled content (FOUC):

```html
<!-- src/entry-server.tsx di dalam <head> -->
<script>
  (function () {
    const saved = localStorage.getItem("app-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  })();
</script>
```

### 5.4 CSS Override Logic

```
Priority (tertinggi ke terendah):
  1. [data-theme="dark"]   → selalu dark
  2. [data-theme="light"]  → selalu light
  3. @media (prefers-color-scheme: dark) → dark jika preferensi OS dark
  4. Default :root {}      → light (default Boilerplate)
```

---

## 6. Implementasi CSS — src/assets/styles/

Styling aplikasi dikelola secara modular pada folder `src/assets/styles/`:

- **`index.css`**: Entry point utama yang mengimpor font Google Inter, Tailwind CSS v4 (`@import "tailwindcss";`), `variables.css`, dan `global.css`.
- **`variables.css`**: Sumber kebenaran tunggal (_single source of truth_) untuk seluruh variabel warna `:root` dan konfigurasi `@theme inline` Tailwind v4.
- **`global.css`**: Reset base layer dan HTML default styles (menggunakan scrollbar native browser).

### 6.1 Implementasi Token & Theme (`variables.css`)

```css
:root {
  /* =====================================================================
   * BRAND & PRIMARY (LIGHT MODE DEFAULT)
   * Kustomisasi warna utama brand proyek dengan mengubah nilai OKLCH ini
   * ===================================================================== */
  --primary: oklch(55% 0.18 250);
  --primary-hover: oklch(48% 0.18 250);
  --primary-foreground: oklch(98% 0 0);

  /* Tiered Surfaces (Light Mode) */
  --background: oklch(99% 0 0);
  --surface-primary: oklch(97% 0.003 247);
  --surface-secondary: oklch(95% 0.004 247);
  --surface-tertiary: oklch(92% 0.006 247);
  --surface-elevated: oklch(100% 0 0);

  /* Text & Contrast (Light Mode) */
  --foreground: oklch(20% 0.02 260);
  --muted-foreground: oklch(50% 0.02 260);

  /* Borders & Dividers */
  --border: oklch(88% 0.005 250);
  --input-border: oklch(84% 0.006 250);

  /* Status Tokens */
  --success: oklch(62% 0.17 145);
  --success-foreground: oklch(98% 0 0);
   --warning: oklch(75% 0.16 75);
   --warning-foreground: oklch(20% 0.02 75);
   --info: oklch(60% 0.16 240);
   --info-foreground: oklch(98% 0 0);
   --destructive: oklch(58% 0.22 27);
  --destructive-foreground: oklch(98% 0 0);

  /* Radius */
  --radius: 0.5rem;
}

/* =====================================================================
 * DARK MODE TOKENS OVERRIDE
 * Aktif saat selector .dark atau [data-theme="dark"] terpasang
 * ===================================================================== */
.dark,
[data-theme="dark"] {
  --primary: oklch(65% 0.18 250);
  --primary-hover: oklch(72% 0.18 250);
  --primary-foreground: oklch(15% 0.02 250);

  --background: oklch(18% 0.01 260);
  --surface-primary: oklch(22% 0.01 260);
  --surface-secondary: oklch(26% 0.01 260);
  --surface-tertiary: oklch(30% 0.01 260);
  --surface-elevated: oklch(24% 0.01 260);

  --foreground: oklch(96% 0 0);
  --muted-foreground: oklch(65% 0.01 260);

   --border: oklch(32% 0.01 260);
   --input-border: oklch(36% 0.01 260);

   --info: oklch(68% 0.16 240);
   --info-foreground: oklch(15% 0.02 240);
   --destructive: oklch(62% 0.2 27);
}

/* =====================================================================
 * TAILWIND CSS V4 THEME MAPPING (LAYER 2)
 * ===================================================================== */
@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;

  /* ─── Primary Brand ─── */
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);

  /* ─── Tiered Surfaces ─── */
  --color-background: var(--background);
  --color-surface-primary: var(--surface-primary);
  --color-surface-secondary: var(--surface-secondary);
  --color-surface-tertiary: var(--surface-tertiary);
  --color-surface-elevated: var(--surface-elevated);

  /* ─── Typography & Borders ─── */
  --color-foreground: var(--foreground);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input-border);

  /* ─── Status ─── */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
   --color-warning: var(--warning);
   --color-warning-foreground: var(--warning-foreground);
   --color-info: var(--info);
   --color-info-foreground: var(--info-foreground);
   --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --radius-md: var(--radius);

  /* ─── Animation ─── */
  --animate-fade-in: fade-in 0.15s ease-out;
  --animate-slide-in: slide-in 0.2s ease-out;

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
```

### 6.2 Global Base Styles (`global.css`)

File `src/assets/styles/global.css` mendefinisikan style dasar HTML, box-sizing, antialiasing font, dan reset CSS bawaan peramban (menggunakan scrollbar default native browser tanpa kustomisasi styling):

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: light;
}

html.dark,
html[data-theme="dark"] {
  color-scheme: dark;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background);
  color: var(--foreground);
  font-family:
    Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Reset number input spin buttons */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
```

### 6.3 Style Entry Point (`index.css`)

File `src/assets/styles/index.css` bertindak sebagai entry point utama:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

@import "tailwindcss";

@import "./variables.css";
@import "./global.css";
```

---

## 7. Sistem Ikon — lucide-solid

> **PENTING:** Boilerplate menggunakan `lucide-solid` sebagai **satu-satunya** icon library. Dilarang mengimpor dari `solid-icons`, `lucide-react`, atau library ikon lainnya.

### 7.1 Aturan Import & Pemilihan Ikon

1. **Import Named Export Langsung**:
   Import komponen ikon secara spesifik (PascalCase) langsung dari `lucide-solid`:
   ```tsx
   import {
     CirclePlus,
     Funnel,
     Inbox,
     Package,
     Pencil,
     Search,
     Trash2,
   } from "lucide-solid";
   ```
2. **Katalog & Pemilihan Ikon**:
   - Selalu cari dan verifikasi nama ikon di katalog resmi [lucide.dev/icons](https://lucide.dev/icons).
   - Gunakan nama alias terbaru standar Lucide v0.4x+ (misal gunakan `Funnel` bukan `Filter`, `CirclePlus` bukan `PlusCircle`, `ChartColumn` bukan `BarChart2`).
   - Pilih ikon yang secara konsisten merepresentasikan entitas atau aksi:
     - **Aksi CRUD**: `CirclePlus` (Create/Add), `Pencil` (Edit), `Trash2` (Delete), `Eye` (Detail/View).
     - **Operasi Data**: `Funnel` (Filter), `Search` (Search), `Download` (Export), `Upload` (Import), `RefreshCw` (Sync/Reload).
     - **Navigasi & Kontrol**: `ArrowLeft` (Back), `ChevronDown` / `ChevronRight` (Accordion/Dropdown), `X` (Close/Dismiss).
     - **Entitas Bisnis**: `Package` / `Box` (Produk / Barang), `Users` / `User` (Pengguna / Akun), `Layers` / `Tag` (Kategori / Tipe), `Calendar` / `Clock` (Jadwal / Waktu).

### 7.2 Skala Ukuran Standar

Gunakan prop `size` numerik sesuai hierarki layout berikut:

| Konteks              | `size` | Penggunaan                                                        |
| :------------------- | :----- | :---------------------------------------------------------------- |
| **Small / Inline**   | `14`   | Label badge, status inline, caption, validation hints             |
| **Button / Form**    | `16`   | Ikon di dalam tombol aksi bersama teks, prefix/suffix input field |
| **Navigation**       | `18`   | Item navigasi sidebar menu, sub-navigation tabs                   |
| **Header / Toolbar** | `20`   | Standalone header action buttons, quick toolbar triggers          |
| **Empty State**      | `40`   | Ilustrasi placeholder pada container data kosong                  |

### 7.3 Pewarnaan & Aksesibilitas (A11y)

- **Warna Dinamis via `currentColor`**:
  Semua ikon Lucide mewarisi warna teks CSS (`currentColor`). Atur warna ikon menggunakan utility class semantik Tailwind v4 (misal `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`). **Dilarang keras memakai hex color literal.**
- **Aksesibilitas Tombol Icon-Only**:
  Jika ikon digunakan pada tombol tanpa teks pendamping, **wajib** menyertakan atribut `aria-label` yang dilokalisasi via `t()` agar terbaca oleh screen reader.

```tsx
// ✅ Ikon dalam tombol dengan teks
<Button variant="default" class="gap-2">
  <CirclePlus size={16} />
  <span>{t("button.addItem")}</span>
</Button>

// ✅ Tombol icon-only (wajib aria-label)
<button
  type="button"
  aria-label={t("button.filter")}
  class="rounded-md p-2 hover:bg-surface-secondary text-muted-foreground hover:text-foreground transition-colors"
>
  <Funnel size={18} />
</button>

// ✅ Ikon status pada empty state
<div class="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <Inbox size={40} class="text-muted-foreground" />
  <p class="text-sm text-muted-foreground">{t("sentence.noData")}</p>
</div>

// ❌ DILARANG: Library lain atau hardcode warna hex
import { FiBox } from "solid-icons/fi"; // SALAH — library selain lucide-solid
<Package size={16} color="#F59E0B" />   // SALAH — jangan hardcode hex color!
```

---

## 8. Komponen UI Primitif — Ark UI + CVA

Komponen UI primitif reaktif pada boilerplate ini dibangun di atas **Ark UI (`@ark-ui/solid`)** dipadukan dengan **Tailwind CSS v4** dan **Class Variance Authority (CVA)**.

Seluruh kode komponen primitif ditempatkan langsung di direktori `src/components/ui/` dengan kepemilikan kode penuh (*code ownership*), sehingga developer dapat menyesuaikan styling dan perilakunya secara fleksibel.

### 8.1 Prinsip & Keunggulan Ark UI
1. **Headless & Accessible**: Menyediakan state machine dan atribut WAI-ARIA bawaan (keyboard navigation, focus management, screen reader compliance) tanpa memaksakan CSS bawaan.
2. **Native SolidJS Fine-Grained Reactivity**: Mendukung reactivity primitives SolidJS secara native tanpa resiko hilangnya reaktivitas saat props diparsing.
3. **Styling Fleksibel via CVA**: Setiap varian komponen (warna, ukuran, state) didefinisikan secara deklaratif menggunakan `class-variance-authority`.

### 8.2 Konvensi Impor
Semua komponen primitif diimpor menggunakan path alias `~` sesuai nama file (kebab-case):

```tsx
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
```

### 8.3 Kategori Primitif UI
Komponen yang ditempatkan di `src/components/ui/` mencakup:
- **Actions & Controls**: `button`, `icon-button`.
- **Forms & Inputs**: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `label`.
- **Overlays**: `dialog`, `popover`, `tooltip`, `dropdown-menu`.
- **Feedback**: `badge`, `spinner`, `toast`.

### 8.4 Integrasi Dokumentasi AI & LLMs.txt
Ark UI menyediakan dukungan native untuk AI agents dan Large Language Models melalui standar `llms.txt`:
- **SolidJS Full Docs**: [`https://ark-ui.com/llms-solid.txt`](https://ark-ui.com/llms-solid.txt) (seluruh dokumentasi & contoh kode SolidJS dalam satu file).
- **Per-Component Markdown**: `https://ark-ui.com/llms.txt/components/{component}?framework=solid` (dokumentasi anatomi dan state machine per komponen).
- **Index Global**: [`https://ark-ui.com/llms.txt`](https://ark-ui.com/llms.txt).
- **Skill Lokal**: `.agents/skills/ark-ui/SKILL.md` (terhubung ke Cursor, Windsurf, Claude, Copilot, Grok, Hermes, Qwen).
- **Quick Index Lokal**: `.agents/skills/ark-ui/references/components-index.md` (daftar tautan endpoint on-demand per-komponen).

---

## 9. Komponen Common & Layouts

Komponen tingkat menengah dan reusable berada di `src/components/common/` (komponen fungsional dan presentasional bersama) dan `src/components/layouts/` (layout wrappers atomik). Seluruhnya dibangun di atas primitif Ark UI (`src/components/ui/`) dan token desain semantik aplikasi.

> **Catatan Dokumentasi Komponen:**
> Dokumentasi interaktif dan contoh penggunaan spesifik untuk tiap komponen _common_ & _layout_ (seperti `DataTable`, `Modal`, `AlertDialog`, `EmptyData`, `ContentWrapper`, dll.) dikelola pada dokumentasi terpisah tersendiri. Bagian ini berfokus pada prinsip arsitektur, pembagian direktori, dan standar konsistensi visual.

### 9.1 Pembagian Direktori & Peran

1. **`src/components/common/` (Komponen Fungsional & Presentasional Bersama)**:
   - Menyediakan komponen siap pakai lintas fitur bisnis dengan integrasi state atau logika operasional tingkat menengah.
   - Contoh cakupan: tabel data terintegrasi (`DataTable`, `PaginationTable`), modal interaktif (`Modal`, `AlertDialog`, `DeleteConfirmation`), tampilan placeholder (`EmptyData`), form fields (`input-form/`, `select-form/`, `InputFile`, `date-picker/`), navigasi (`header-nav/`, `side-nav/`), dan tipografi (`typography/`, `Logo`).
   - Diimpor melalui barrel file:
     ```tsx
     import {
       DataTable,
       EmptyData,
       Modal,
       DeleteConfirmation,
     } from "~/components/common";
     ```

2. **`src/components/layouts/` (Layout Wrappers Atomik)**:
   - Menyediakan pembungkus tata letak struktural untuk menjaga konsistensi padding, margin halaman, kontainer kartu, dan flow responsif.
   - Contoh cakupan: `ContentWrapper`, `CardContainer`, dan `Flex`.
   - Diimpor melalui barrel file:
     ```tsx
     import { ContentWrapper, CardContainer, Flex } from "~/components/layouts";
     ```

### 9.2 Prinsip Pengembangan Komponen Common & Layouts

1. **Berbasis Primitif Ark UI**:
   Komponen common tidak membangun elemen HTML dasar dari nol bila sudah tersedia di `src/components/ui/`. Gunakan primitif yang ada (misal `Dialog`, `Button`, `Table`, `Badge`, `Card`) sebagai fondasi markup.
2. **Kepatuhan Token Desain Semantik Murni**:
   Seluruh styling wajib memetakan ke token CSS variabel di `src/assets/styles/variables.css` (`bg-card`, `bg-surface-primary`, `border-border`, `text-foreground`, `text-muted-foreground`, dll.). Dilarang meng-hardcode warna hex literal.
3. **Disiplin Reaktivitas SolidJS**:
   Tetap patuhi aturan reaktivitas SolidJS: hindari destrukturisasi props langsung (`props.*` atau `splitProps`), gunakan `children(() => props.children)` untuk dynamic children, dan pasang guard SSR (`typeof window !== "undefined"`).
4. **Single Source of Truth Filesystem**:
   Sama seperti komponen primitif, daftar komponen aktif yang tersedia murni mengacu pada sistem file direktori `src/components/common/` dan `src/components/layouts/`. Pengembang dapat langsung memeriksa file terpasang melalui terminal (`ls src/components/common` dan `ls src/components/layouts`).

---

## 10. Standar Visual & State Input Form

> **Pemisahan Tanggung Jawab:**
> Arsitektur form handling (`@formisch/solid`), pendefinisian skema validasi (`Valibot`), penanganan mutasi `FormData`, dan pola penyatuan form Create & Update dispesifikasikan secara lengkap di [**`ARCHITECTURE.md` §6 (Forms & Validasi)**](./ARCHITECTURE.md#6-forms--validasi). Bagian ini murni mengatur **hierarki visual, status interaktif (_states_), token styling, dan tata letak layout form**.

### 10.1 Anatomi Visual Form Field

Setiap field form dalam Boilerplate disusun menggunakan struktur vertikal konsisten:

1. **Label**:
   - Teks label: `text-sm font-medium text-foreground`.
   - Indikator Wajib (_Required_): Asterisk merah menggunakan token warna destruktif: `<span class="text-destructive ml-1">*</span>`.
2. **Input / Form Control**:
   - Menggunakan komponen primitif Ark UI (`Input`, `Select`, `Textarea`, `RadioGroup`) atau komponen field terpadu di `src/components/common/input-form/`.
   - Spasi antara label dan input: `space-y-1.5`.
3. **Helper / Caption Text**:
   - Teks petunjuk pengisian opsional di bawah input: `text-xs text-muted-foreground mt-1`.
4. **Pesan Error Inline**:
   - Teks validasi gagal: `text-xs text-destructive mt-1`.

### 10.2 Standar Visual States (Input, Select, Textarea)

Semua kontrol form wajib mengekspresikan status interaktif secara visual melalui Tailwind CSS v4 design tokens:

| Status (_State_)    | Utility Class / Styling                                                        | Penjelasan Visual                                          |
| :------------------ | :----------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Normal / Idle**   | `bg-input border border-border text-foreground rounded-md`                     | Tampilan default input field                               |
| **Hover**           | `hover:border-border/80`                                                       | Umpan balik halus saat pointer berada di atas field        |
| **Focus Visible**   | `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`      | Focus ring kontras untuk navigasi keyboard & aksesibilitas |
| **Invalid / Error** | `border-destructive text-destructive focus-visible:ring-destructive`           | Border dan teks merah saat validasi schema Valibot gagal   |
| **Disabled**        | `disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed` | Field non-aktif (misal saat form sedang proses submitting) |

```tsx
// Contoh status visual input field:
// ✅ Normal State
<Input class="bg-input border-border text-foreground" placeholder="USR-001" />

// ✅ Invalid / Error State (wajib aria-invalid)
<Input
  aria-invalid={true}
  class="bg-input border-destructive text-destructive focus-visible:ring-destructive"
/>
```

### 10.3 Aturan Tampilan Pesan Error (Inline vs Toast)

- **Validasi Input WAJIB Inline**:
  Setiap pesan kegagalan validasi input form **harus selalu** ditampilkan secara _inline_ tepat di bawah field yang bersangkutan (`text-xs text-destructive mt-1`).
- **DILARANG Menggunakan Toast untuk Error Validasi Field**:
  Toast notification tidak boleh digunakan untuk menampilkan pesan error input form (misal: "Nama item wajib diisi").
- **Penggunaan Toast yang Benar**:
  Toast hanya digunakan untuk notifikasi aksi global / tingkat sistem:
  - Sukses menyimpan/memperbarui data: `toast.success(t("sentence.dataSavedSuccess"))`.
  - Kesalahan server / network failure: `toast.error(t("sentence.serverErrorOccurred"))`.

### 10.4 Layout & Spacing Form

1. **Jarak Antar Field**:
   Form dengan baris bertumpuk menggunakan jarak vertikal terstandarisasi: `space-y-4` (atau `gap-4` dalam grid container).
2. **Form Multi-kolom**:
   Untuk form data master atau transaksi dengan banyak input, gunakan grid responsif:
   ```tsx
   <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
     {/* Field kolom 1 */}
     {/* Field kolom 2 */}
   </div>
   ```
3. **Footer Tombol Aksi**:
   Tombol aksi form selalu diletakkan di sudut kanan bawah dengan garis pembatas halus:
   ```tsx
   <div class="border-border mt-6 flex items-center justify-end gap-2 border-t pt-4">
     <Button type="button" variant="outline">
       {t("button.cancel")}
     </Button>
     <Button type="submit" variant="default" loading={isSubmitting()}>
       {t("button.save")}
     </Button>
   </div>
   ```

---

## 11. Aksesibilitas

### 11.1 ARIA Patterns

| Pattern          | Implementasi                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| Dialog/Modal     | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby` |
| Alert konfirmasi | `role="alertdialog"`, focus terjebak di dalam dialog                        |
| Tabel            | `role="table"`, `aria-sort` pada kolom sortable                             |
| Nav sidebar      | `role="navigation"`, `aria-label="Main navigation"`                         |
| Icon-only button | Selalu tambahkan `aria-label` deskriptif (terlokalisasi via `t()`)          |
| Status badge     | `aria-label` jika warna adalah satu-satunya indikator                       |
| Loading state    | `aria-busy="true"`, `aria-live="polite"`                                    |
| Error form       | `aria-invalid="true"`, `aria-describedby` ke elemen error                   |

### 11.2 Focus Management

```tsx
// ✅ Focus ring — sudah diatur di base styles, tapi pastikan tidak di-override
// Jangan gunakan outline-none tanpa pengganti focus indicator

// ✅ Benar
class="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

// ❌ Salah (menghilangkan focus tanpa pengganti)
class="focus:outline-none"

// ✅ Untuk komponen interaktif custom, gunakan focus-visible (keyboard-only)
class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
```

### 11.3 Keyboard Navigation

| Aksi                     | Keyboard                                      |
| ------------------------ | --------------------------------------------- |
| Navigasi antar elemen    | `Tab` / `Shift+Tab`                           |
| Aktifkan button/link     | `Enter` / `Space`                             |
| Tutup dialog/drawer      | `Escape`                                      |
| Navigasi dropdown/select | Arrow keys `↑` `↓`                            |
| Pilih item dropdown      | `Enter`                                       |
| Navigasi tabel           | `Tab` per cell atau arrow keys jika grid role |

### 11.4 Kontras Minimum

- **Teks normal** (< 18px): kontras ≥ 4.5:1 (WCAG AA)
- **Teks besar** (≥ 18px atau ≥ 14px bold): kontras ≥ 3:1 (WCAG AA)
- **Komponen UI** (border, ikon): kontras ≥ 3:1 terhadap background

### 11.5 Reduced Motion

```tsx
// ✅ Gunakan motion-safe: prefix Tailwind
<div class="motion-safe:animate-[fade-in_0.15s_ease-out]">
  {/* konten */}
</div>

// ✅ Atau di CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Aturan Penulisan Kelas Tailwind

### 12.1 Urutan Penulisan Kelas (Class Ordering)

Gunakan BiomeJS (`pnpm check:write`) untuk enforce ordering otomatis.
Urutan manual yang diikuti:

```
1. Layout       → display, position, inset, z-index, float
2. Box Model    → width, height, padding, margin, overflow
3. Flexbox/Grid → flex, grid, gap, align, justify
4. Typography   → font, text, line, tracking, truncate
5. Visual       → bg, border, rounded, shadow, ring, opacity
6. Interactive  → hover:, focus:, active:, disabled:
7. Responsive   → sm:, md:, lg:, xl:
8. Dark/Theme   → dark:, data-*:
9. Motion       → motion-safe:, animate-
10. Arbitrary   → [...] values terakhir
```

### 12.2 Contoh Urutan Benar

```tsx
// ✅ Urutan yang benar
<div class="relative flex w-full max-w-sm flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm text-foreground shadow-sm hover:bg-card/80 focus-visible:ring-2">

// ❌ Urutan tidak konsisten (akan di-flag BiomeJS)
<div class="hover:bg-card/80 text-sm border-border flex gap-2 bg-card rounded-lg p-4 w-full relative max-w-sm flex-col border text-foreground shadow-sm focus-visible:ring-2">
```

### 12.3 Do's dan Don'ts

| ✅ DO                                                                    | ❌ DON'T                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------- |
| Gunakan token semantik: `bg-card`, `text-foreground`                     | Hardcode warna: `bg-[#1a1a1a]`, `text-white`      |
| `gap-2` untuk jarak antar children                                       | `space-x-2` jika menggunakan flex (gunakan gap)   |
| `rounded-md` dari token radius                                           | `rounded-[8px]` (gunakan token)                   |
| `text-muted-foreground` untuk teks sekunder                              | `text-gray-500` (tidak mengikuti token)           |
| `border-border` untuk garis                                              | `border-zinc-700` (hardcode)                      |
| `hover:bg-accent` untuk hover state                                      | `hover:bg-[#333]`                                 |
| `focus-visible:ring-2 focus-visible:ring-ring`                           | `focus:outline-none` (tanpa pengganti)            |
| Gunakan `size={16}` pada ikon di button                                  | Ikon tanpa size (fallback ukuran tidak konsisten) |
| Komponen baru di `src/components/common/` atau `src/components/layouts/` | Logic UI di route component langsung              |
| `aria-label` pada semua icon-only button                                 | Icon button tanpa label aksesibilitas             |

### 12.4 Arbitrary Values — Kapan Boleh

Arbitrary values `[...]` hanya diperbolehkan untuk kasus yang tidak ter-cover token:

```tsx
// ✅ Boleh — lebar spesifik yang tidak ada di skala default
<div class="w-60">  {/* sidebar width */}
<div class="h-px">    {/* separator tipis */}

// ✅ Boleh — animasi custom yang tidak bisa via token
<div class="animate-[spin_2s_linear_infinite]">

// ❌ JANGAN — gunakan token warna yang sudah ada
<div class="bg-[oklch(35%_0.01_67)]">  {/* gunakan bg-card */}
<div class="text-[oklch(94%_0_0)]">    {/* gunakan text-foreground */}
```

### 12.5 Konfigurasi BiomeJS untuk Class Ordering

```json
// biome.json
{
  "formatter": {
    "enabled": true
  },
  "linter": {
    "rules": {
      "nursery": {
        "useSortedClasses": "warn"
      }
    }
  }
}
```

---

## 13. UI/UX Flow & Keputusan Desain

> Bagian ini mengunci **alur interaksi** agar konsisten di semua modul. Alur bisnis per modul ada di [`PRD.md`](./PRD.md) §2.2.

### 13.1 Alur Global

```
/auth/sign-in ──(berhasil)──▶ /app/dashboard
      ▲                           │
      │ token invalid / refresh gagal
      └──── /auth/request-login ◀─┘

Sidebar (menu difilter permission) ▶ Halaman modul ▶ [List] ▶ [Create/Update] ▶ [Detail] ▶ [Delete]
```

- Menu & halaman yang tidak berizin **tidak ditampilkan** (bukan disabled).
- Modul yang dimatikan feature flag tidak muncul di sidebar.
- Breadcrumb selalu tampil di `PageHeader`; bahasa mengikuti cookie `lang`.

### 13.2 Alur CRUD Standar (berlaku untuk semua master data)

| Langkah         | Pola UI                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **List**        | `PageHeader` (judul + aksi) → toolbar search/filter → `DataTable` dalam `Card` → pagination         |
| **Create**      | Tombol "Tambah" (hanya jika `create` berizin) → `Dialog`/`Drawer` berisi form                       |
| **Update**      | Aksi baris "Edit" (hanya jika `update` berizin) → form terpadu satu file (mode update), terisi data |
| **Detail**      | Klik baris / aksi "Lihat" → halaman atau drawer detail                                              |
| **Delete**      | Aksi baris "Hapus" (hanya jika `delete` berizin) → **AlertDialog wajib** → Toast hasil              |
| **Export**      | Tombol Export di `PageHeader` → unduh file via `downloadFile()` → Toast hasil                       |
| **Bulk upload** | Unduh template → upload → **preview** → konfirmasi → import → ringkasan hasil                       |

### 13.3 State Halaman (wajib ada di setiap list/detail)

| State      | Tampilan                                                         |
| ---------- | ---------------------------------------------------------------- |
| Loading    | Skeleton/`Spinner`, `aria-busy="true"`                           |
| Empty      | Komponen `Empty` + (jika berizin) CTA untuk membuat data pertama |
| Error      | Pesan dari `formatApiError()` + tombol coba lagi                 |
| Tanpa izin | Redirect / halaman 403; elemen aksi disembunyikan                |

### 13.4 Feedback ke Pengguna

| Kejadian                   | Cara                                    |
| -------------------------- | --------------------------------------- |
| Validasi form gagal        | **Inline di bawah field** (bukan Toast) |
| Sukses/gagal aksi (mutasi) | Toast (`success` / `destructive`)       |
| Aksi destruktif            | AlertDialog konfirmasi sebelum eksekusi |
| Submit sedang diproses     | Tombol submit disabled + label progres  |

### 13.5 Keputusan Desain (Design Decision Records)

> Keputusan D1–D10 diturunkan dari konvensi yang sudah ada di dokumen ini; kolom _Alasan_ bersifat **usulan** dan perlu dikonfirmasi tim desain/produk.

| #   | Keputusan                                                               | Alasan                                                                                                            |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| D1  | **Light-First Default** dengan toggle Dark Mode                         | Antarmuka bersih, fleksibel, dan universal untuk berbagai jenis aplikasi modern (B2B, SaaS, internal tools)      |
| D2  | Token warna OKLCH 3-layer, hanya via class semantik                     | Perubahan tema terpusat di satu file (`variables.css`); hover/active dapat diprediksi                             |
| D3  | Brand (`primary`) hanya untuk CTA & highlight                           | Menjaga hierarki visual; status memakai warna semantik (`success/warning/destructive/info`)                      |
| D4  | Status Entitas dikodekan **warna + label teks**                         | Tidak mengandalkan warna saja guna menjamin aksesibilitas penuh (WCAG AA)                                         |
| D5  | Sembunyikan, bukan disable, aksi tanpa izin                             | Mengurangi kebingungan user & mencegah kebocoran informasi fitur                                                  |
| D6  | Create dan update form disatukan satu file (default)                    | Base fields sama; dipisah hanya jika tampilan/layout berbeda signifikan                                           |
| D7  | Komponen dasar dari Ark UI; komponen bersama di `common/ & layouts/`    | Konsistensi arsitektur UI headless; tidak membuat varian UI baru di route                                          |
| D8  | Satu icon library (`lucide-solid`), ukuran eksplisit                    | Konsistensi visual & efisiensi ukuran bundle JavaScript                                                           |
| D9  | Bilingual EN/ID untuk semua teks termasuk `aria-label`                  | Menjamin fleksibilitas multi-bahasa untuk pengguna lokal maupun internasional                                     |
| D10 | Mengikuti template layout resmi di `src/layouts/`                       | Mencegah pembuatan layout shell ad-hoc di tengah pengembangan                                                     |

> [!IMPORTANT]
> Sebelum membuat pola UI baru (komponen, warna, layout), cek dulu §8–§10. Jika benar-benar perlu pola baru, **tambahkan ke dokumen ini terlebih dahulu**.

---

## 14. Tata Kelola Perubahan Desain Sistem (Living Document Protocol)

Dokumen ini adalah **Approved Baseline** yang dikelola sebagai **Living Document** — menjadi sumber kebenaran tunggal (_single source of truth_) visual dan interaksi agar seluruh antarmuka pengguna Boilerplate terbangun secara konsisten, profesional, dan berstandar industri, namun **tetap adaptif dan updatable** terhadap kebutuhan bisnis, perkembangan teknis, serta feedback stakeholder.

### 14.1 Alur Pengajuan Perubahan Desain (Design Change Protocol)

```
[ Temuan Desain / Feedback Stakeholder / Kebutuhan Varian Komponen Baru ]
                                 │
                                 ▼
                     [ 1. Inisiasi Perubahan ]
     Diajukan via UI/UX Review / Issue Tracker Proyek
                                 │
                                 ▼
                   [ 2. Evaluasi Dampak Desain ]
  Cek token variables.css, kontras WCAG AA, dark mode OKLCH, & Ark UI CVA
                                 │
                                 ▼
                  [ 3. Evaluasi & Approval Developer ]
   Disetujui oleh Developer / Pemilik Proyek (dicatat dalam DDR §13.5)
                                 │
                                 ▼
             [ 4. Update Dokumen & Sinkronisasi Repositori ]
  - Update token di variables.css & dokumentasi DESIGN.md
  - Catat riwayat pada Document Revision History (§15)
  - Selaraskan komponen terkait di src/components/ui/ atau common/
```

### 14.2 Prinsip Pengelolaan Desain Sistem

1. **Zero-Hardcode Hex Values**: Semua pewarnaan elemen antarmuka wajib memanfaatkan utility class semantik yang bersumber dari `src/assets/styles/variables.css`. Dilarang meng-inject warna hex literal secara ad-hoc.
2. **Single Source of Truth Token**: Token warna dan tipografi di `variables.css` adalah satu-satunya sumber kebenaran visual. Penyesuaian tema dilakukan terpusat pada file tersebut.
3. **Pure Copy-Paste Primitives Ownership**: Komponen primitif dibangun di `src/components/ui/` menggunakan `@ark-ui/solid` dan CVA, dimiliki penuh oleh repositori.
4. **Penyelarasan Multi-Dokumen**: Setiap perubahan pola form/validasi wajib selaras dengan [**`ARCHITECTURE.md` §6**](./ARCHITECTURE.md#6-forms--validasi), scope fitur selaras dengan [**`PRD.md`**](./PRD.md), dan aturan koding kontributor selaras dengan [**`AGENTS.md`**](./AGENTS.md).
5. **Aksesibilitas Tanpa Kompromi**: Setiap komponen atau interaksi baru wajib memenuhi standar kontras minimum WCAG AA dan menyertakan `aria-label` yang dilokalisasi via `t()` untuk tombol icon-only.

---

## 15. Document Revision History

| Versi     | Tanggal     | Inisiator / Maintainer         | Ringkasan Perubahan & Catatan                                                                                                                                                                                                                                                                                                                                   |
| :-------- | :---------- | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1.0** | 4 Nov 2026  | Developer & AI Assistant       | **Integrasi Standar Ark UI LLMs.txt**:<br>• Dokumentasi resmi endpoint AI `https://ark-ui.com/llms-solid.txt` dan per-component SolidJS markdown (§8.4)<br>• Integrasi skill agent `ark-ui` dan salinan offline untuk pembuatan komponen UI primitif |
| **1.0.0** | 4 Nov 2026  | Developer & AI Assistant       | **Baseline Resmi SolidStart Boilerplate Design System**:<br>• Rilis inisial arsitektur token OKLCH 3-layer dengan default Light-First di `:root` dan dark mode support via `.dark`<br>• Pedoman implementasi komponen UI primitif Ark UI (`@ark-ui/solid`) + Tailwind CSS v4 + CVA<br>• Panduan kustomisasi brand token, tipografi Inter, dan status visual generik |

---

## 16. Ringkasan Cepat — Quick Reference

### Struktur Direktori Desain & Komponen

```
src/
  assets/styles/
    index.css         ← Entry Tailwind v4 & font imports
    variables.css     ← Single source of truth design tokens (OKLCH)
    global.css        ← Base CSS & HTML resets
  components/
    ui/               ← Ark UI primitives (Button, Input, Dialog, dll.)
    common/           ← Shared functional & presentational components (DataTable, Modal, dll.)
    layouts/          ← Atomic layout wrappers (ContentWrapper, CardContainer, Flex)
  layouts/            ← Application layout shells (app-layout.tsx, auth-layout.tsx)
```

---

_Dokumen ini berstatus **Active Baseline**. Segala perubahan desain lanjutan wajib mengikuti tata kelola pada §14 dan dicatat pada tabel riwayat revisi di atas._
_Versi: 1.0.0 (Boilerplate Baseline) — 4 November 2026_
