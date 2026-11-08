# Directory: `src/lib/utils/`

Direktori ini berfungsi sebagai **koleksi fungsi utilitas murni tingkat global (Global Pure Utility Functions Hub)**. Seluruh fungsi pembantu yang bersifat _stateless_, bebas efek samping yang tidak diinginkan, serta tidak terikat secara kaku pada komponen antarmuka tertentu dikelola secara terpusat di sini.

Direktori ini **tidak terbatas hanya pada berkas bawaan awal**, melainkan dirancang secara modular dan dapat terus ditambahkan berkas utilitas baru sesuai kebutuhan aplikasi (seperti manipulasi tanggal, format mata uang, kalkulasi matematika, atau sanitasi data).

---

## Pembagian Kategori Utilitas yang Didukung

Direktori ini mengorganisasikan helper ke dalam beberapa kelompok fungsional:

### 1. Styling & Class Manipulation (`cn.ts`)

- Menggabungkan class name secara kondisional (`clsx`) dan menyelesaikan konflik utility classes Tailwind CSS v4 secara deterministik (`tailwind-merge`).

### 2. Otorisasi & Hak Akses (`permission.ts`)

- Mengurai string permission format `module:action` via `parsePermission()` dan mengevaluasi izin pengguna untuk visibilitas tombol atau aksi UI via `hasPermission()`.

### 3. Serialisasi Form & Unggah Berkas (`form.ts`)

- Mengonversi payload form bertingkat (termasuk file binary `v.instance(File)`) menjadi instance `FormData` via `appendFormData()`, serta memformat respon error backend via `formatApiError()`.

### 4. Operasi & Format Berkas (`file.ts`)

- Memicu pengunduhan berkas binary/blob di browser secara aman (`downloadFile()`) dan memformat ukuran byte ke satuan yang mudah dibaca (`formatFileSize()`).

### 5. Manipulasi String & Teks (`text.ts`)

- Pemotongan string panjang dengan elipsis (`truncateText()`) dan kapitalisasi huruf awal (`capitalize()`).

### 6. Kategori Tambahan yang Dapat Ditambahkan:

- **Date & Time (`date.ts`)**: Pemformatan tanggal lokal, kalkulasi selisih waktu (_relative time_), konversi timezone.
- **Currency & Numbers (`currency.ts`, `number.ts`)**: Format mata uang IDR/USD, pemisah ribuan (_thousand separators_), persentase.
- **Validation & Sanitization (`sanitizer.ts`)**: Pembersihan string input dari karakter berbahaya atau normalisasi nomor telepon.

---

## Protokol Verifikasi Utilitas Bertujuan Sama (Same-Purpose Protocol — AGENTS.md §6)

Untuk mencegah pemborosan kode dan duplikasi logika (_logic duplication / code drift_):

1. **Pemeriksaan Fungsi Bertujuan Sama Wajib Dilakukan**:
   - Sebelum membuat fungsi utilitas baru, pengembang atau AI Agent **tidak boleh hanya mengecek nama file**, melainkan **wajib meneliti apakah sudah ada fungsi yang memiliki tujuan atau fungsionalitas serupa (_same intent/purpose_)** di dalam folder `src/lib/utils/`.
2. **Reuse atau Extend (Utamakan Memakai atau Memperluas)**:
   - Jika fungsi dengan tujuan serupa sudah ada, **wajib gunakan fungsi tersebut**.
   - Jika diperlukan variasi baru, **perluas fungsi yang sudah ada secara _backward-compatible_** (misal: menambahkan parameter konfigurasi opsional) alih-alih membuat fungsi baru dengan nama berbeda yang mengerjakan hal yang sama.
3. **Larangan Duplikasi Logika Lokal**:
   - Dilarang keras membuat fungsi helper inline atau utilitas lokal privat di dalam modul fitur jika fungsinya sudah tercakup oleh shared utilities di sini.

---

## Standar Kode & Pengujian (Guardrail #26 & #27)

1. **Wajib Co-located Unit Test**: Setiap berkas utilitas baru (`[nama].ts`) **wajib** memiliki berkas pengujian berdampingan (`[nama].test.ts`).
2. **Dual-Scenario Testing (Positif & Negatif)**:
   - Pengujian wajib memuat minimal 1 skenario positif (input valid menghasilkan keluaran tepat).
   - Pengujian wajib memuat minimal 1 skenario negatif/boundary (input falsy, null, undefined, string kosong, atau tipe data ekstrem ditangani dengan aman tanpa _unhandled runtime exception_).
3. **Ekspor Terpusat**: Seluruh fungsi utilitas baru wajib diekspor kembali pada berkas `src/lib/utils/index.ts` agar dapat diimpor langsung via path alias `~/lib/utils`.
