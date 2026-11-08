# Directory: `src/assets/`

Direktori ini menampung seluruh berkas aset statis yang diproses, dioptimasi, dan di-bundle oleh Vite saat proses build, mencakup styling global aplikasi, design tokens, gambar, ilustrasi, ikon khusus, dan web fonts lokal.

---

## Perbedaan `src/assets/` vs `/public`

| Aspek                  | `src/assets/` (Direktori Ini)                                                       | `/public` (Root Public)                                         |
| :--------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| **Pemrosesan Bundler** | Diproses & dioptimasi langsung oleh Vite.                                           | Disajikan mentah (_raw_) tanpa proses build/bundling.           |
| **Cara Penggunaan**    | Diimpor langsung via TypeScript/TSX/CSS (`import logo from "~/assets/..."`).        | Direferensikan via URL absolut (`/favicon.ico`, `/robots.txt`). |
| **Cache Busting**      | Otomatis memiliki hash konten pada nama file di build produksi (`logo.[hash].png`). | Nama file tetap statis, rentan terkena cache browser usang.     |
| **Optimasi Asset**     | Vite dapat melakukan inlining (base64) untuk file kecil dan kompresi otomatis.      | Tidak ada optimasi ukuran atau inlining otomatis.               |
| **Penggunaan Ideal**   | Logo aplikasi, ilustrasi antarmuka, custom SVG, font lokal, CSS & design tokens.    | `favicon.ico`, `robots.txt`, `sitemap.xml`, manifest PWA.       |

---

## Struktur Sub-Direktori

```
src/assets/
├── styles/                  # Konfigurasi Tailwind CSS v4 & OKLCH Design Tokens
│   ├── index.css            # Entry point CSS utama
│   ├── variables.css        # ⭐ Single source of truth design tokens OKLCH
│   └── global.css           # Base reset & font antialiasing
├── images/                  # Berkas gambar statis (.png, .jpg, .webp, .svg)
│   ├── logo.svg             # Logo aplikasi (brand identity)
│   └── illustrations/       # Ilustrasi status, empty state, error 404/500
├── icons/                   # Custom SVG icons khusus (non-lucide)
└── fonts/                   # Berkas font lokal (.woff2, .woff, .ttf) bila diperlukan
```

---

## Peran & Tanggung Jawab Masing-Masing Sub-Direktori

### 1. `styles/` (Design Tokens & CSS Layers)

Menampung konfigurasi styling modern berbasis **Tailwind CSS v4** dengan arsitektur **OKLCH 3-Layer Tokens**:

- `variables.css`: Sumber kebenaran tunggal (_Single Source of Truth_) nilai warna semantik (`--primary`, `--background`, `--foreground`, `--card`, dll.) untuk Light Mode dan Dark Mode.
- `global.css`: Konfigurasi base HTML, antialiasing font, dan reset layout.
- `index.css`: Entry point utama yang diimpor pada root aplikasi.
- Rujuk dokumentasi lengkap di [`src/assets/styles/README.md`](./styles/README.md) dan [`DESIGN.md`](../../DESIGN.md).

### 2. `images/` (Gambar & Ilustrasi Statis)

Menampung gambar raster dan vektor yang digunakan secara konstan dalam antarmuka aplikasi:

- Logo brand, ikon produk, watermark.
- Ilustrasi interaktif (empty state, panduan onboarding, hero image).
- Banner atau gambar latar belakang statis.

### 3. `icons/` (Ikon Khusus / Non-Lucide)

- Secara default, seluruh kebutuhan ikon antarmuka wajib mengutamakan library **`lucide-solid`** (lihat `AGENTS.md` Guardrail #9).
- Sub-folder `icons/` ini disediakan **hanya untuk ikon custom** yang tidak disediakan oleh `lucide-solid`, seperti logo mitra, logo metode pembayaran, atau ikon grafis berkarakter khusus.

### 4. `fonts/` (Web Fonts Lokal)

Menampung font web dalam format modern (`.woff2` atau `.woff`) jika aplikasi dirancang berjalan di lingkungan intranet / _on-premise offline_ tanpa akses ke Google Fonts CDN.

---

## Panduan Penggunaan & Import

Gunakan selalu path alias `~/assets/...` untuk mengimpor aset ke dalam komponen SolidJS:

```tsx
import logoUrl from "~/assets/images/logo.svg";
import emptyIllustration from "~/assets/images/illustrations/empty-state.svg";

export function BrandHeader() {
  return (
    <div class="flex items-center gap-3">
      <img src={logoUrl} alt="App Logo" class="h-8 w-auto" />
      <span class="text-foreground font-bold">My Application</span>
    </div>
  );
}
```

---

## Panduan & Best Practices

1. **Format Modern & Kompresi**: Utamakan format vektor SVG untuk ikon/logo dan WebP untuk foto/gambar raster guna meminimalkan ukuran bundle.
2. **Utamakan `lucide-solid`**: Jangan menambahkan file SVG ikon generik jika ikon yang serupa sudah tersedia di `lucide-solid`.
3. **Patuhi Design Tokens**: Jangan menggunakan warna hex langsung di dalam SVG yang terpasang inline bila memungkinkan; gunakan token Tailwind atau `currentColor` agar dapat beradaptasi otomatis dengan Dark Mode.
4. **Gunakan Path Alias**: Selalu gunakan path alias `~/assets/...` (bukan relative path bertingkat `../../assets/...`).
