# Directory: `src/components/`

Direktori ini berfungsi sebagai **pusat komponen antarmuka pengguna reusable tingkat global (Global UI Components Hub)**. Seluruh komponen tampilan yang bersifat lintas fitur, modular, dan dapat digunakan kembali oleh berbagai modul aplikasi dikelola secara terstruktur di sini.

---

## Pembagian Sub-Direktori & Arsitektur Lapisan UI

Komponen antarmuka dibagi menjadi 3 tingkatan spesialisasi:

```
src/components/
├── ui/         # Lapisan 1: Komponen primitif atomik headless (Ark UI + Tailwind CSS v4 + CVA)
├── common/     # Lapisan 2: Komponen fungsional & antarmuka bersama tingkat menengah (DataTable, AlertDialog, dll.)
└── layouts/    # Lapisan 3: Komponen pembungkus struktur tata letak atomik (Flex, ContentWrapper, CardContainer)
```

---

## Peran & Tanggung Jawab Masing-Masing Sub-Direktori

### 1. `ui/` (Headless UI Primitives)

- Komponen antarmuka atomik level terendah berbasis mesin aksesibilitas **Ark UI (`@ark-ui/solid`)**, utilitas **Tailwind CSS v4**, dan **CVA**.
- Bersifat murni presentasional, aksesibel (WAI-ARIA compliant), dan berstatus _Pure Copy-Paste Primitives Ownership_ (kode sumber dimiliki penuh oleh proyek).
- Contoh: `Button`, `Input`, `Dialog`, `Select`, `Badge`, `Tabs`, `Tooltip`.
- Rujuk dokumentasi lengkap di [`src/components/ui/README.md`](./ui/README.md).

### 2. `common/` (Shared Functional & Presentational Components)

- Komponen tingkat menengah yang mengombinasikan primitif UI dengan token desain dan logika presentasi bersama untuk mencegah duplikasi kode di berbagai halaman fitur.
- Contoh: `DataTable` (pembungkus TanStack Table terintegrasi), `AlertDialog` (dialog konfirmasi aksi destruktif), `EmptyData` (ilustrasi data kosong), `DatePicker`, kontrol form dengan label dan inline error bawaan.
- Rujuk dokumentasi lengkap di [`src/components/common/README.md`](./common/README.md).

### 3. `layouts/` (Atomic Layout Wrappers)

- Komponen pembungkus struktural geometris untuk menjaga konsistensi jarak (_spacing_), penataan flexbox terstandarisasi, dan responsivitas halaman.
- Contoh: `<Flex>` (pengganti raw `<div class="flex">`), `<ContentWrapper>`, `<CardContainer>`, `<Grid>`.
- Rujuk dokumentasi lengkap di [`src/components/layouts/README.md`](./layouts/README.md).

---

## Kapan Membuat Komponen di Sini vs di `features/[fitur]/components/`?

- ✅ **Simpan di `src/components/`**: Jika komponen bersifat generik, tidak memuat istilah atau data model yang terikat pada domain bisnis tunggal, dan berpotensi digunakan oleh lebih dari satu modul fitur.
- ❌ **Simpan di `features/[fitur]/components/`**: Jika komponen memuat logika bisnis spesifik, form domain tertentu (misal `user.form.tsx`), atau tabel entitas tunggal yang hanya ada pada fitur tersebut.

---

## Aturan Koding Komponen SolidJS (Strict)

1. **Dilarang Mendestrukturisasi Props Langsung**:
   `function Component({ title })` -> ❌ **FORBIDDEN** (merusak fine-grained signal tracking).
   Gunakan selalu `props.title` atau `splitProps(props, ["title", "class", ...])`.
2. **SSR Safety Guard (Wajib)**:
   Selalu gunakan guard `typeof window !== "undefined"` dan `typeof document !== "undefined"` saat berinteraksi dengan DOM peramban atau menambahkan event listener.
3. **Children Inspection & Wrapping**:
   Selalu bungkus `props.children` dengan `children(() => props.children)` saat melakukan inspeksi, iterasi, atau rendering child nodes dinamis.
4. **Token Semantik Tailwind v4**:
   Gunakan selalu token semantik (`bg-card`, `bg-background`, `border-border`, `text-foreground`). Dilarang keras melakukan hardcode warna HEX.
