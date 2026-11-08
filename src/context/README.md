# Directory: `src/context/`

Direktori ini berfungsi sebagai **penyedia context reaktif lintas komponen (Cross-Component Reactive Context Hub)** menggunakan **SolidJS Context API**. Direktori ini ditujukan untuk memfasilitasi komunikasi data, _event broadcasting_, dan berbagi _state_ antar hierarki komponen tanpa melalui _prop-drilling_.

Direktori ini tidak terbatas hanya pada berkas bawaan (_translation_ dan _breadcrumb_), melainkan dapat menampung _context provider_ baru yang relevan untuk kebutuhan antarmuka aplikasi.

---

## Karakteristik & Peruntukan Solid Context

Gunakan Solid Context di direktori ini jika memenuhi kriteria berikut:
1. **State Presentasional / UI Transaksional**: State yang hanya relevan selama sesi tampilan aktif dan tidak membutuhkan persistensi jangka panjang (misal: bahasa aktif, breadcrumb dinamis, state collapsed sidebar/drawer, context modal/dialog global, active step form).
2. **Event Broadcast**: Kebutuhan memicu event atau mendistribusikan pembaruan secara instan dari komponen anak ke komponen induk atau sebaliknya.
3. **Fine-Grained Propagation**: Memanfaatkan reaktivitas granular SolidJS di mana hanya komponen pelanggan sinyal tertentu yang me-_render_ ulang.

---

## Kapan Menggunakan Context vs Zustand vs TanStack Query?

Sesuai panduan arsitektur pada [`ARCHITECTURE.md` §5](../../ARCHITECTURE.md#5-state-management):

| Kategori Data               | Solusi State                     | Lokasi                               | Contoh Penggunaan                                      |
| :-------------------------- | :------------------------------- | :----------------------------------- | :----------------------------------------------------- |
| **Server State**            | TanStack Solid Query v5          | `features/[fitur]/lib/data/service/` | List entitas, query detail, caching HTTP, mutasi API   |
| **Sesi Klien Global**       | Zustand (`solid-zustand`)        | `src/stores/`                        | Profil pengguna login, token auth, matriks izin akses  |
| **Cross-Component Context** | SolidJS Context API              | `src/context/`                       | Bahasa aktif (i18n), breadcrumb navigasi, drawer state |
| **Local Component State**   | SolidJS Signals (`createSignal`) | Di dalam komponen itu sendiri        | Toggle popover, expand baris tabel, input lokal        |

---

## Berkas Baseline Bawaan Proyek

| Berkas                            | Tanggung Jawab & Peran                                                                                                                | Hook Ekspor                  |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :--------------------------- |
| **`translation-context.tsx`**     | Mengelola bahasa antarmuka aktif berbasis `@solid-primitives/i18n`, sinkronisasi cookie `lang`, dan penyedia fungsi penerjemah `t()`. | `useTranslation()`           |
| **`breadcrumb-page-context.tsx`** | Mengelola daftar reaktif navigasi breadcrumb halaman aktif via `createStore` SolidJS.                                                 | `useBreadcrumbPageContext()` |

---

## Panduan Menambahkan Context Provider Baru

Saat menambahkan Context Provider baru (misalnya `notification-context.tsx`, `modal-context.tsx`, atau `drawer-context.tsx`), ikuti pola baku berikut:

1. **Definisikan Interface Nilai Context Secara Eksplisit**:

   ```typescript
   export interface MyContextType {
     isOpen: Accessor<boolean>;
     toggle: () => void;
     openWithData: (data: ItemData) => void;
   }
   ```
2. **Sediakan Provider Guard**:
   Selalu validasi ketersediaan context pada custom hook pembaca dan lempar pesan error yang deskriptif jika hook dipanggil di luar cakupan `<Provider>`:

   ```typescript
   export function useMyContext(): MyContextType {
     const context = useContext(MyContext);
     if (!context) {
       throw new Error("useMyContext must be used within a <MyContextProvider>");
     }
     return context;
   }
   ```
3. **Jaga Fine-Grained Reactivity**:
   Gunakan fungsi getter / accessor (`isOpen: () => state()`) agar sinyal reaktif tidak terputus saat nilai diakses oleh konsumen.
4. **Wajib Sertakan Dual-Scenario Unit Test**:
   Setiap berkas context baru wajib memiliki file pengujian unit berdampingan (`*.test.ts`) yang memvalidasi skenario Positif (_Happy Path_) dan skenario Negatif (_Throws error when called outside provider_).
