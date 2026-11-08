# Directory: `src/lib/data/`

Direktori ini berfungsi sebagai **Global Shared Data Layer (Lapisan Data Bersama Tingkat Global)**. Bertanggung jawab mengelola seluruh operasi data API, parameter query, dan hooks TanStack Query yang melayani kebutuhan bersama lintas domain fitur aplikasi (terutama opsi dropdown, lookup tables, dan endpoint utilitas bersama).

Direktori ini bukan sekadar penampung beberapa file contoh, melainkan sebuah arsitektur data global terpadu yang dapat terus dikembangkan seiring bertambahnya kebutuhan data referensi bersama di berbagai modul antarmuka.

---

## Urgensi Arsitektur & Pencegahan Circular Dependencies (Guardrail #38)

Dalam aplikasi modular berbasis fitur, suatu modul (misalnya `UserManagement` atau `Product`) sering kali membutuhkan data referensi dari entitas lain (misalnya daftar `Role`, `Category`, atau `Department`) untuk mengisi pilihan dropdown atau filter form.

- ❌ **Pola Salah (Cross-Feature Tight Coupling)**: Mengimpor langsung fungsi data dari `features/role/lib/data/service` ke dalam `features/user/components/form` menciptakan ketergantungan silang (_tight coupling_) yang dapat memicu **circular dependency** dan merusak prinsip isolasi domain fitur.
- ✅ **Pola Baku (Global Shared Data Layer)**: Seluruh endpoint data referensi bersama (terutama endpoint berakhiran `/all/` yang mengembalikan `Array<T>`) **wajib ditempatkan di `src/lib/data/`**. Dengan demikian, modul fitur manapun dapat mengonsumsinya secara independen dan bersih.

---

## Kategori Data yang Dikelola di `src/lib/data/`

1. **Shared Options / Dropdown Queries**: Endpoint yang mengembalikan data ringkas `{ id, name }` atau item referensi untuk pemilihan opsi form (misal: `useGetSharedRoleOptions`, `useGetSharedCategoryOptions`).
2. **Master Lookup References**: Data master referensi bersama berskala global yang tidak terikat siklus CRUD fitur lokal tertentu.
3. **Universal API Utilities**: Layanan pemanggilan API lintas modul (seperti endpoint unggah berkas bersama, download file laporan umum, atau verifikasi sesi).

---

## Struktur Sub-Layer di `src/lib/data/`

Mengadopsi pola arsitektur **3 Lapisan Data** yang identik dengan fitur lokal:

```
src/lib/data/
├── endpoint/        # Layer 1: Definisi konstanta URL endpoint bersama & path generator
├── api/             # Layer 2: Fungsi pemanggilan HTTP (Axios) murni dengan strict return types
├── query-keys/      # QueryKey factories untuk TanStack Query cache invalidation
├── service/         # Layer 3: TanStack Query hooks (createQuery & createMutation) reusable
└── mock/            # Generator data dummy & hook mock sementara selama API backend belum siap
```

---

## Panduan Penambahan Data Bersama Baru

Saat menambahkan data bersama baru (misalnya opsi dropdown baru `department`):

1. **Layer 1 (`endpoint/`)**: Daftarkan konstanta URL pada `src/lib/data/endpoint/index.ts`:

   ```typescript
   export const SHARED_DEPARTMENT_ENDPOINT = `${API_APP}/department/all/`;
   ```
2. **Layer 2 (`api/`)**: Buat fungsi pemanggil Axios di `src/lib/data/api/index.ts`:

   ```typescript
   export const getSharedDepartmentOptions = async (): Promise<Array<ItemOptionType>> => {
     const response = await http.get<Array<ItemOptionType>>(SHARED_DEPARTMENT_ENDPOINT);
     return response.data;
   };
   ```
3. **Query Keys (`query-keys/`)**: Daftarkan cache key di `src/lib/data/query-keys/index.ts`:

   ```typescript
   export const sharedQueryKeys = {
     departmentOptions: () => ["shared", "department-options"] as const,
   };
   ```
4. **Layer 3 (`service/`)**: Buat hook TanStack Query di `src/lib/data/service/index.ts`:

   ```typescript
   export const useGetSharedDepartmentOptions = () =>
     createQuery(() => ({
       queryKey: sharedQueryKeys.departmentOptions(),
       queryFn: getSharedDepartmentOptions,
     }));
   ```
5. **Wajib Co-located Test**: Sertakan berkas pengujian ganda (`*.test.ts`) pada setiap layer yang ditambahkan.
