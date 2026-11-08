# Directory: `src/types/`

Direktori ini berfungsi sebagai **pusat kontrak tipe data global (Global TypeScript Types & Contracts Hub)**. Seluruh antarmuka (_interfaces_), tipe data (_type aliases_), standar amplop API, dan model universal yang digunakan secara lintas domain dikelola secara terpusat di sini.

Direktori ini tidak terbatas hanya pada berkas bawaan (`api.ts` dan `common.ts`), melainkan dapat menampung definisi tipe data global baru atau folder skema universal (`src/types/schema/`) seiring pertumbuhan aplikasi.

---

## Pembagian Berkas & Cakupan Tanggung Jawab

### 1. `api.ts` (Standar Kontrak Amplop REST API)

Mendefinisikan bentuk standar komunikasi antara frontend dan backend:
- **`ArrayData<T>`**: Amplop respons untuk data list terpaginasi:

  ```typescript
  export interface ArrayData<T> {
    counts: number;
    page: number;
    page_count: number;
    page_size: number;
    results: Array<T>;
  }
  ```
- **`CountType`**: Standar respons jumlah data: `{ count: number }`.
- **`ApiErrorBody`**: Standar respon error backend: `{ message: string; errors?: Record<string, Array<string>> }`.
- **`MutationProps<TData, TVariables>`**: Generic callback bertipe ketat untuk mutasi TanStack Query (`onSuccess`, `onError`).

### 2. `common.ts` (Tipe Data Bersama Lintas Domain)

Mendefinisikan tipe data pembantu yang sering digunakan lintas form, tabel, dan navigasi:
- **`FilterParams`**: Parameter query URL standar (halaman, batas item, kata kunci pencarian, pengurutan):

  ```typescript
  export interface FilterParams {
    page?: number;
    page_size?: number;
    search?: string;
    sort_by?: string;
    order?: "asc" | "desc";
    [key: string]: unknown;
  }
  ```
- **`ItemOptionType`**: Struktur ringkas untuk elemen pilihan dropdown / select: `{ id: string; name: string }`.
- **`CommonStatusType`**: Union status umum entitas: `"active" | "inactive" | "pending" | "archived"`.
- **`PaginationMeta`**: Informasi metadata paginasi tabel data.
- **`BreadcrumbType`**: Objek informasi jejak navigasi halaman (`title`, `path`).

### 3. `schema/` (Model Universal Bersama — Opsional)

Jika aplikasi memiliki model entitas yang digunakan secara universal oleh banyak modul independen, model tersebut dapat didefinisikan di sub-folder ini:
- **`Base[Entity]Type`**: Model dasar entitas dengan atribut esensial (misal: `BaseUserType`, `BaseRoleType`).
- **`[Entity]ItemType`**: Tipe data opsi dropdown bersama (misal: `RoleItemType`, `CategoryItemType`).

---

## Aturan Arsitektur & Batasan Lokasi Tipe Data (Guardrail #40)

1. **Model Detail Wajib di Fitur Lokal (Bukan di Sini)**:
   Model data detail lengkap (`Detail[Entity]Type`) dan tipe respon mutasi (`[Entity]MutationResponseType`) **dilarang keras ditempatkan di direktori global `src/types/`**. Keduanya wajib ditempatkan di direktori tipe lokal modulnya masing-masing (`features/[fitur]/types/schema.ts`) untuk menjaga isolasi domain.
2. **Generic Array Type Wajib (`Array<T>`) — Guardrail #35**:
   Selalu gunakan notasi generic `Array<T>` alih-alih shorthand kurung siku `T[]` (contoh: `Array<string>`, `Array<ItemOptionType>`). Aturan ini ditegakkan otomatis oleh Biome.
3. **Larangan Backward Compatibility Aliases**:
   Dilarang membuat alias semata-mata untuk backward compatibility (`export type OldName = NewName;`) saat melakukan refactoring tipe data. Perbarui seluruh berkas konsumen langsung ke nama tipe baru yang baku.
