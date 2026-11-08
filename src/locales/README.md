# Directory: `src/locales/`

Direktori ini berfungsi sebagai **pusat pengelolaan kamus lokalisasi multi-bahasa (Localization & Internationalization Dictionaries Hub)** untuk mendukung antarmuka dua bahasa (_bilingual_) melalui pustaka `@solid-primitives/i18n`.

Direktori ini tidak terbatas hanya pada berkas `common.json`, melainkan dirancang untuk menampung kamus lokalisasi modular tambahan (misal: `auth.json`, `dashboard.json`, `error.json`) seiring bertambahnya modul aplikasi.

---

## Struktur Direktori & Bahasa yang Didukung

Aplikasi mendukung dua bahasa resmi:
1. **`en/`**: Bahasa Inggris (_English_) — Default fallback.
2. **`id/`**: Bahasa Indonesia (_Indonesian_) — Default locale antarmuka.

```
src/locales/
├── en/                         # Kamus Bahasa Inggris
│   ├── common.json             # Kosakata umum, label tombol, placeholder standar
│   └── [modul].json            # (Opsional) Kamus terpisah per modul spesifik
└── id/                         # Kamus Bahasa Indonesia (struktur wajib simetris dengan en/)
    ├── common.json
    └── [modul].json
```

---

## Taksonomi & Konvensi Penamaan Kunci (_Key Taxonomy_)

Gunakan hierarki kunci yang konsisten dan semantik agar mudah dicari:

| Namespace Kunci     | Peruntukan & Tujuan                 | Contoh Kunci                                                                        |
| :------------------ | :---------------------------------- | :---------------------------------------------------------------------------------- |
| **`button.*`**      | Label tombol aksi antarmuka         | `button.create`, `button.edit`, `button.delete`, `button.save`, `button.cancel`     |
| **`placeholder.*`** | Petunjuk pengisian input form       | `placeholder.search`, `placeholder.selectOption`, `placeholder.enterEmail`          |
| **`label.*`**       | Label judul input atau atribut data | `label.username`, `label.email`, `label.status`, `label.createdAt`                  |
| **`message.*`**     | Pesan umpan balik toast atau dialog | `message.successCreate`, `message.confirmDelete`, `message.networkError`            |
| **`common.*`**      | Istilah umum berulang               | `common.all`, `common.active`, `common.inactive`, `common.actions`, `common.filter` |
| **`empty.*`**       | Teks keterangan saat data kosong    | `empty.title`, `empty.description`, `empty.noResults`                               |

---

## Aturan Arsitektur Mutlak (Guardrail #10 & #12)

1. **Dilarang Hardcode Teks UI (Guardrail #10)**:
   Seluruh teks statis, label formulir, tombol, judul tabel, pesan kesalahan, dan notifikasi **wajib** dipanggil menggunakan helper `t("kunci.path")` dari `useTranslation()`. Dilarang menulis teks antarmuka mentah langsung pada JSX.
2. **Wajib Selaraskan Kedua Bahasa Sekaligus (Guardrail #12)**:
   Saat menambahkan, mengubah, atau menghapus kunci translasi, kontributor **wajib memperbarui kedua direktori (`en/` dan `id/`) secara bersamaan**. Dilarang meninggalkan kunci yang hanya ada di satu bahasa karena akan memicu teks kosong atau kunci mentah yang tidak diterjemahkan di sisi pengguna.
3. **Pemberian Parameter Interpolasi**:
   Untuk kalimat dinamis, gunakan kurung kurawal `{nama}` pada berkas JSON:

   ```json
   {
     "message": {
       "welcome": "Selamat datang, {name}!"
     }
   }
   ```

   Dan panggil dengan argumen variabel: `t("message.welcome", { name: user.name })`.
