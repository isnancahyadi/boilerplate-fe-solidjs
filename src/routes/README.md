# Directory: `src/routes/`

Direktori ini mengelola sistem perutean berbasis berkas (**File-Based Routing**) bawaan **SolidStart v2** (didukung oleh Nitro server engine). Struktur berkas dan folder di dalam direktori ini secara otomatis dipetakan menjadi rute URL yang dapat diakses oleh pengguna.

---

## Pembagian Area Perutean Aplikasi

Perutean aplikasi dibagi menjadi beberapa segmen fungsional:

```
src/routes/
├── index.tsx              # Rute root: / (biasanya me-redirect ke /app/dashboard atau /auth/login)
├── [...404].tsx           # Catch-all route untuk menampilkan halaman 404 Not Found
├── app/                   # ⭐ Area internal aplikasi terproteksi (Auth Guarded)
│   ├── dashboard/         # Halaman ringkasan metrik
│   │   └── index.tsx      # Rute: /app/dashboard
│   └── [fitur]/           # Halaman modul fitur domain bisnis
│       ├── index.tsx      # Rute tabel list: /app/[fitur]
│       └── [id].tsx       # Rute detail dinamis: /app/[fitur]/:id
└── auth/                  # Area autentikasi publik (bebas akses)
    ├── login.tsx          # Rute: /auth/login
    └── [flow].tsx         # Rute alur otentikasi lainnya (forgot-password, reset-password, dsb.)
```

---

## Prinsip Komposisi Halaman (Thin Composition Layer)

Untuk menjaga modularitas dan keterujian kode:

1. **Rute Hanya Berperan Sebagai Lembaran Komposisi**:
   File di dalam `src/routes/` **dilarang menampung logika bisnis kompleks, fungsi manipulasi data, atau state form panjang**.
2. **Delegasikan ke Modul Fitur (`src/features/[fitur]/`)**:
   File route cukup bertugas mengomposisikan _page shell layout_ dengan komponen utama fitur yang diimpor dari folder fitur:

   ```tsx
   // src/routes/app/user/index.tsx
   import AppLayout from "~/layouts/app-layout";
   import { UserList } from "~/features/user";

   export default function UserRoute() {
     return (
       <AppLayout title="Manajemen Pengguna">
         <UserList />
       </AppLayout>
     );
   }
   ```

---

## Mekanisme Proteksi Rute (SSR Auth Guard)

Seluruh rute yang berada di bawah prefix `/app/*` secara otomatis diproteksi oleh **`src/middleware.ts`** pada siklus Server-Side Rendering (SSR):
- Jika cookie token otentikasi tidak ditemukan atau tidak valid saat request masuk ke server, `middleware.ts` langsung mencegat request dan mengembalikan HTTP redirect `302` ke halaman login publik (`/auth/login`).
- Hal ini menjamin bahwa halaman privat tidak akan pernah ter-_render_ atau membocorkan data sensitif ke klien yang belum terautentikasi.
