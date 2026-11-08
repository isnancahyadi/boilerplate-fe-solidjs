# Directory: `src/components/layouts/`

Direktori ini bertanggung jawab mengelola **komponen pembungkus struktur tata letak atomik (Atomic Layout UI Wrappers)**. Komponen di dalam direktori ini dirancang untuk menjaga konsistensi jarak antar-elemen (_spacing_), penataan flexbox terstandarisasi (_layout hygiene_), serta kontainer responsif di seluruh antarmuka aplikasi.

Komponen di direktori ini berfokus murni pada geometri layout dan tata letak struktur, tanpa memuat logika bisnis aplikasi.

---

## Perbedaan `src/components/layouts/` vs `src/layouts/`

| Direktori                                     | Level Arsitektur                | Cakupan & Karakteristik                                                                                                                            |
| :-------------------------------------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/components/layouts/`** (Direktori Ini) | **Atomic UI Wrappers (Mikro)**  | Komponen pembungkus tata letak kecil yang digunakan di dalam berbagai komponen antarmuka (misal: `<Flex>`, `<ContentWrapper>`, `<CardContainer>`). |
| **`src/layouts/`**                            | **Page / Route Shells (Makro)** | Template kerangka viewport seluruh halaman pada perutean tertentu (misal: `app-layout.tsx` dashboard ber-sidebar, `auth-layout.tsx` form login).   |

---

## Komponen Layout Atomik Standar yang Dikelola

### 1. `<Flex>` (Abstraksi Flexbox Terstruktur — Guardrail #33)

Komponen penata flexbox deklaratif SolidJS untuk menggantikan raw `<div class="flex ...">`. Menerima properti terstruktur bertipe ketat:
- **`flexDirection`**: `"row" | "column" | "row-reverse" | "column-reverse"` (default: `"row"`).
- **`alignItems`**: `"start" | "center" | "end" | "stretch" | "baseline"`.
- **`justifyContent`**: `"start" | "center" | "end" | "between" | "around" | "evenly"`.
- **`gap`**: Token jarak terstandarisasi (`"1" | "2" | "3" | "4" | "6" | "8"`).
- **`wrap`**: `"wrap" | "nowrap" | "wrap-reverse"`.

> [!IMPORTANT]
> **Aturan Wajib `<Flex>` (Guardrail #33)**:
> Saat komponen `<Flex>` tersedia, seluruh penataan flexbox **wajib** menggunakannya alih-alih raw `<div class="flex ...">`. Penggunaan tag `<div>` biasa hanya diizinkan untuk struktur non-flex (seperti CSS Grid `<div class="grid ...">`, wrapper col-span, atau elemen pembungkus murni tanpa flex).

### 2. `<ContentWrapper>`

Kontainer pembungkus area halaman utama yang menangani:
- Padding responsif seragam (`p-4 md:p-6 lg:p-8`).
- Batasan lebar maksimal kontainer (_max-width_ viewport).
- Penanganan alur _overflow scroll_.

### 3. `<CardContainer>`

Panel permukaan berbasis surface semantik (`bg-surface-primary` atau `bg-surface-secondary`):
- Border halus terstandarisasi (`border border-border`).
- Sudut membulat seragam (`rounded-lg` atau `rounded-xl`).
- Opsi slot header (judul & tombol aksi) serta slot footer.

### 4. `<Grid>` (Tata Letak Kolom Grid Deklaratif)

Abstraksi CSS Grid deklaratif untuk menampilkan kartu atau item berulang dengan jumlah kolom responsif (misal: 1 kolom di mobile, 2 di tablet, 3-4 di desktop).

---

## Aturan Koding Komponen Layout SolidJS

1. **Gunakan `splitProps` untuk Ekstraksi Atribut HTML**:
   Pisahkan properti layout kustom dari properti elemen HTML standar (`class`, `children`, `style`, event handlers):

   ```tsx
   const [local, others] = splitProps(props, [
     "flexDirection",
     "alignItems",
     "justifyContent",
     "gap",
     "class",
     "children",
   ]);
   ```
2. **Kompabilitas dengan Utilitas `cn()`**:
   Selalu gabungkan kelas CSS turunan properti dengan `props.class` menggunakan helper `cn()` agar konsumen dapat menambahkan utility class spesifik bila diperlukan.
