# Directory: `src/stores/`

Direktori ini bertanggung jawab mengelola **state sesi klien global (Global Client-Side Session State)** menggunakan pustaka **Zustand (`solid-zustand`)**. Direktori ini ditujukan untuk menyimpan informasi sesi pengguna, otorisasi hak akses, preferensi global, atau konfigurasi navigasi yang perlu diakses secara langsung oleh berbagai bagian aplikasi tanpa melalui pembungkus JSX (_Context Provider_).

Direktori ini tidak terbatas hanya pada `auth.store.ts`, melainkan dapat ditambahkan store baru sesuai kebutuhan state sesi aplikasi (misal: `menu.store.ts`, `permission.store.ts`, `notification-badge.store.ts`).

---

## Karakteristik Store Zustand vs Solusi State Lainnya

Sesuai matriks pengelolaan state pada [`ARCHITECTURE.md` §5](../../ARCHITECTURE.md#5-state-management):

| Kategori State              | Solusi Arsitektural              | Lokasi                               | Kapan Digunakan                                                                                       |
| :-------------------------- | :------------------------------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Server State**            | TanStack Solid Query v5          | `features/[fitur]/lib/data/service/` | Data dari API backend yang membutuhkan caching, invalidasi, dan status loading server.                |
| **Sesi Global**             | Zustand (`solid-zustand`)        | `src/stores/` (Direktori Ini)        | Data sesi pengguna aktif (auth token, profil user, daftar menu, hak akses) yang diakses lintas fitur. |
| **Cross-Component Context** | SolidJS Context API              | `src/context/`                       | State UI transaksional/presentasional yang terikat hierarki komponen (bahasa i18n, breadcrumbs).      |
| **Local State**             | SolidJS Signals (`createSignal`) | Di dalam komponen                    | State internal komponen (toggle modal, expand row, input sementara).                                  |

---

## Konvensi Penamaan & Struktur Berkas

1. **Format Nama Berkas**: `[nama].store.ts` (misal: `auth.store.ts`, `menu.store.ts`, `notification.store.ts`).
2. **Format Interface State**:

   ```typescript
   export interface AuthState {
     user: BaseUserType | null;
     token: string | null;
     isAuthenticated: boolean;
     setUser: (user: BaseUserType | null) => void;
     setToken: (token: string | null) => void;
     logout: () => void;
   }
   ```
3. **Ekspor Hook Store**:
   Ekspor hook bawaan Zustand dengan prefix `use[Nama]Store`:

   ```typescript
   export const useAuthStore = create<AuthState>((set) => ({
     user: null,
     token: null,
     isAuthenticated: false,
     setUser: (user) => set({ user, isAuthenticated: !!user }),
     setToken: (token) => set({ token }),
     logout: () => set({ user: null, token: null, isAuthenticated: false }),
   }));
   ```

---

## Aturan Arsitektur & Keamanan SSR

1. **SSR Safety (Guard Akses Window/Storage)**:
   Saat menginisialisasi nilai awal atau melakukan sinkronisasi dengan Web Storage, **wajib menyertakan guard `typeof window !== "undefined"`**. Dilarang mengakses `localStorage` atau `sessionStorage` langsung pada tingkat modul luar agar tidak merusak proses kompilasi SSR SolidStart.
2. **Pembersihan Sesi Bersih (Clean Teardown)**:
   Setiap store yang mengelola data sesi wajib menyediakan fungsi reset/logout untuk membersihkan seluruh state sesi saat pengguna keluar dari aplikasi.
3. **Wajib Co-located Unit Test**:
   Setiap berkas store baru wajib disertai berkas pengujian unit berdampingan (`*.store.test.ts`) yang memverifikasi perubahan state dan aksi pembersihan sesi.
