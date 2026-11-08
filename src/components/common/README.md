# Directory: `src/components/common/`

Direktori ini bertanggung jawab mengelola **komponen fungsional dan presentasional tingkat menengah yang digunakan bersama lintas modul fitur (Shared Mid-Level UI & Functional Components)**. Komponen di dalam direktori ini menggabungkan komponen primitif dasar (`src/components/ui/`) dengan pola antarmuka dan logika presentasi bersama untuk menjaga konsistensi tampilan serta mencegah duplikasi kode antarmuka pada berbagai halaman fitur.

Direktori ini tidak terbatas hanya pada komponen contoh awal, melainkan dirancang untuk menampung komponen bersama baru yang relevan bagi seluruh modul aplikasi.

---

## Kategori Komponen yang Dikelola di `src/components/common/`

### 1. Presentasi Data & Tabel (Data Presentation)

- **`DataTable/`**: Pembungkus tabel data terintegrasi berbasis `@tanstack/solid-table`, menangani paginasi, pengurutan kolom (_sorting_), status _loading_, dan penanganan data kosong.
- **`EmptyData/`**: Komponen visual ilustrasi dan pesan informatif saat tabel atau daftar entitas bernilai kosong.
- **`Pagination/`**: Komponen kendali paginasi terpadu (pilihan jumlah item per halaman, tombol nomor halaman, prev/next).

### 2. Dialog Interaktif & Konfirmasi (Dialogs & Feedback)

- **`AlertDialog/`**: Dialog konfirmasi sebelum mengeksekusi aksi destruktif (seperti hapus data) sesuai Guardrail #15.
- **`Modal/`**: Container pop-up dialog umum untuk preview data atau form ringkas.
- **`DeleteConfirmation/`**: Pembungkus siap pakai untuk konfirmasi hapus data dengan teks dan aksi otomatis.

### 3. Kontrol Formulir Terpadu (Form Controls)

- **`DatePicker/`**: Komponen pemilih tanggal kalender yang terintegrasi dengan state form.
- **`InputForm/` & `SelectForm/`**: Pembungkus kontrol input yang telah menyatukan label teks, indikator wajib diisi (_required indicator_), serta pesan kesalahan validasi _inline_ (Guardrail #34).
- **`InputFile/`**: Kontrol unggah berkas dengan penanganan drag-and-drop, validasi ukuran/format, dan preview nama file.

### 4. Navigasi & Shell Komponen Bersama

- Komponen navigasi yang diinjeksikan ke dalam shell layout, seperti `header-nav/`, `side-nav/`, `breadcrumb/`, dan `user-dropdown/`.

---

## Aturan Arsitektur & Koding Komponen Common

1. **Periksa Interface Props Sumber Terlebih Dahulu (Guardrail #32)**:
   Dilarang keras menebak nama atau tipe properti suatu komponen bersama. Sebelum menggunakan komponen, selalu baca definisi interface props pada file sumbernya (`read_file` pada `*.tsx` atau `*.props.ts`) untuk memastikan kesesuaian atribut.
2. **Gunakan Built-in Error & Label Bawaan (Guardrail #34)**:
   Komponen form common yang sudah menyediakan penanganan label dan error bawaan (seperti `<DatePicker label="..." errors={...} />` atau `<TextInputForm label="..." errors={...} />`) wajib dimanfaatkan. Dilarang membuat wrapper teks manual redundan di luar komponen.
3. **Patuhi Reaktivitas SolidJS (Strict)**:
   - Dilarang mendestrukturisasi props langsung (`function MyComponent({ title })`). Akses selalu via `props.title` atau gunakan `splitProps`.
   - Bungkus child nodes dinamis menggunakan `children(() => props.children)`.
4. **Desain Sistem & Token Semantik**:
   Gunakan selalu utility class semantik Tailwind v4 (`bg-card`, `bg-background`, `border-border`, `text-foreground`). Dilarang keras melakukan hardcode warna HEX.
