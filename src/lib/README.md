# Directory: `src/lib/`

Direktori ini berfungsi sebagai **pusat data bersama dan fungsi utilitas tingkat global (Global Shared Data & Utilities Hub)**. Bertanggung jawab menyediakan lapisan data bersama lintas domain serta fungsi-fungsi pembantu murni yang dapat digunakan kembali secara universal di seluruh bagian aplikasi.

---

## Pembagian Sub-Direktori & Arsitektur

Direktori `src/lib/` dibagi menjadi dua spesialisasi utama:

```
src/lib/
├── data/       # Global Shared Data Layer (Endpoint, API, Query Keys, TanStack Query Services)
└── utils/      # Global Pure Utility Functions (Styling, Form, File, Text, Permissions)
```

---

## Peran & Tanggung Jawab Masing-Masing Sub-Direktori

### 1. `data/` (Global Shared Data Layer)

- Bertanggung jawab mengelola seluruh operasi data API yang melayani kebutuhan referensi bersama lintas modul (terutama endpoint opsi dropdown `/all/` yang mengembalikan `Array<T>`).
- Menerapkan arsitektur data 3-lapisan (`endpoint/`, `api/`, `service/`) ditambah `query-keys/` dan `mock/`.
- Mencegah _tight coupling_ dan _circular dependency_ yang terjadi jika suatu modul fitur mengimpor service API dari modul fitur lainnya.
- Rujuk dokumentasi lengkap di [`src/lib/data/README.md`](./data/README.md).

### 2. `utils/` (Global Pure Utility Functions)

- Menampung fungsi-fungsi pembantu murni (_pure helper functions_) yang bersifat _stateless_, bebas dari manipulasi UI langsung, dan aman digunakan di lingkungan SSR maupun peramban.
- Mencakup berbagai kategori: penggabungan class styling (`cn.ts`), otorisasi izin pengguna (`permission.ts`), serialisasi multipart form (`form.ts`), pengunduhan berkas (`file.ts`), pemformat teks (`text.ts`), serta helper waktu atau angka.
- Menerapkan **Protokol Verifikasi Utilitas Bertujuan Sama (Same-Purpose Protocol)** untuk mencegah duplikasi logika.
- Rujuk dokumentasi lengkap di [`src/lib/utils/README.md`](./utils/README.md).

---

## Hubungan `src/lib/` Global vs `features/[fitur]/lib/` Lokal

Arsitektur aplikasi menganut pola yang **simetris**:
- **`src/lib/` (Tingkat Global)**: Hanya menampung data bersama lintas fitur (dropdown `/all/`, helper umum).
- **`features/[fitur]/lib/` (Tingkat Lokal Fitur)**: Memiliki sub-struktur serupa (`constant.ts`, `utils.ts`, `data/`), namun isinya khusus diperuntukkan bagi entitas dan siklus hidup domain fitur tersebut (misal: query list paginasi tabel, query detail by ID, mutasi CUD fitur).
