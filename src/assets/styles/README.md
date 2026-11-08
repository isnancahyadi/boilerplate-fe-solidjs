# Directory: `src/assets/styles/`

Direktori ini bertanggung jawab mengelola seluruh konfigurasi gaya (_styling_), layer CSS global aplikasi, serta sistem token desain warna semantik berbasis **Tailwind CSS v4** dengan arsitektur **OKLCH 3-Layer Design Tokens**.

---

## Struktur Berkas & Tanggung Jawab

- **`variables.css`**: **Sumber kebenaran tunggal (_Single Source of Truth_)** untuk seluruh design tokens aplikasi. Didefinisikan dalam format warna modern OKLCH pada selector `:root` (Light-First default) dan `.dark` / `[data-theme="dark"]` (Dark Mode), yang dipetakan secara deklaratif ke `@theme inline` untuk menghasilkan kelas utilitas Tailwind v4 otomatis (`bg-primary`, `bg-background`, `text-foreground`, `border-border`, dll.).
- **`global.css`**: Konfigurasi reset base HTML, box-sizing, antialiasing font, dan tata letak scrollbar bawaan peramban.
- **`index.css`**: Titik masuk (_entry point_) utama CSS aplikasi yang mengimpor pustaka Tailwind v4 (`@import "tailwindcss";`), `variables.css`, dan `global.css`. Berkas ini diimpor secara global pada root entry aplikasi (`app.tsx`).

---

## Arsitektur OKLCH 3-Layer Tokens

Sesuai panduan visual pada [`DESIGN.md`](../../../DESIGN.md), token warna disusun dalam 3 tingkatan abstraksi:
1. **Layer 1: Primitive Tokens**: Nilai OKLCH mentah dengan lightness (L), chroma (C), dan hue (H) terstandarisasi.
2. **Layer 2: Semantic Tokens**: Variabel bermakna kontekstual (`--background`, `--foreground`, `--primary`, `--card`, `--border`, `--muted`, `--destructive`) yang beradaptasi otomatis antara tema terang (_Light Mode_) dan gelap (_Dark Mode_).
3. **Layer 3: Component Tokens**: Kelas utilitas Tailwind yang dikonsumsi langsung oleh komponen antarmuka (`bg-card`, `text-card-foreground`).

---

## Panduan Kustomisasi Brand Color (Warna Utama Aplikasi)

Saat memulai proyek baru dari boilerplate ini, pengembang dapat dengan mudah menyesuaikan warna utama brand dengan mengganti nilai OKLCH pada variabel `--primary` di `variables.css`:

```css
:root {
  /* Contoh: Mengubah ke Emerald Green */
  --primary: oklch(60% 0.18 150);
  --primary-hover: oklch(52% 0.18 150);
  --primary-foreground: oklch(98% 0.01 150);
}

.dark,
[data-theme="dark"] {
  --primary: oklch(65% 0.18 150);
  --primary-hover: oklch(72% 0.18 150);
  --primary-foreground: oklch(15% 0.02 150);
}
```

---

## Aturan Arsitektur & Styling (Zona Hati-hati §1.1)

1. **Dilarang Hardcode Warna HEX/RGB**: Seluruh warna antarmuka wajib merujuk pada token semantik Tailwind (`bg-primary`, `text-foreground`, `border-border`, dll.). Dilarang keras menuliskan kode warna heksadesimal mentah di file komponen atau berkas CSS luar.
2. **Gunakan Sintaks Native Tailwind CSS v4**: Hindari pola usang Tailwind v3 (seperti `@layer utilities`, `@layer base`, atau deklarasi `@apply` berlebihan di luar styling reset dasar).
