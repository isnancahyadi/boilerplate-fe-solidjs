# Directory: `src/hooks/`

Direktori ini berfungsi sebagai wadah bagi **primitif reaktif dan custom hooks SolidJS tingkat global (Global Reusable Reactive Hooks & Primitives)**. Direktori ini bertanggung jawab mengapsulasi logika reaktif yang berulang, integrasi Web API peramban, maupun pengelolaan perilaku antarmuka yang digunakan bersama oleh lebih dari satu domain fitur.

---

## Perbedaan Hook Global vs Hook Lokal Fitur

| Kategori               | Lokasi                        | Cakupan & Batasan                                                                                                              |
| :--------------------- | :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **Global Hook**        | `src/hooks/` (Direktori Ini)  | Digunakan secara universal lintas modul/halaman (misal: deteksi breakpoint layar, integrasi clipboard, event timing).          |
| **Feature-Local Hook** | `src/features/[fitur]/hooks/` | Hanya relevan dan digunakan khusus oleh domain fitur tersebut (misal: sinkronisasi filter tabel tertentu, form stepper lokal). |

---

## Kategori Custom Hook yang Cocok Ditempatkan di Sini

1. **Integrasi Browser & Device Web APIs**:
   - `create-clipboard.ts`: Menyalin teks ke clipboard sistem dengan state status tersalin sementara.
   - `create-media-query.ts`: Memantau kecocokan CSS media query breakpoint secara reaktif.
   - `create-online-status.ts`: Mendeteksi ketersediaan koneksi internet (`navigator.onLine`).
   - `create-local-storage.ts`: Sinyal reaktif yang tersinkronisasi otomatis dengan `localStorage`.

2. **Event & Timing Primitives**:
   - `create-debounce.ts`: Menunda pembaruan sinyal hingga rentang waktu idle tertentu (misal untuk input pencarian).
   - `create-throttle.ts`: Membatasi frekuensi eksekusi fungsi/event scroll.
   - `create-click-outside.ts`: Mendeteksi interaksi klik di luar elemen referensi target.

3. **Behavioral & Interaction Primitives**:
   - `create-disclosure.ts`: Logika open/close/toggle untuk modal, accordion, atau popover sederhana.
   - `create-scroll-lock.ts`: Mengunci scroll body halaman saat dialog atau drawer terbuka.

---

## Konvensi Penamaan & Standar Kode

- **Konvensi Penamaan Berkas**: Gunakan format `kebab-case.ts` (misal: `create-clipboard.ts`, `create-debounce.ts`).
- **Konvensi Nama Fungsi**: Dalam ekosistem SolidJS, primitif reaktif konvensional diawali dengan kata kerja `create[Name]` (misal: `createClipboard`, `createDebounce`) alih-alih `use[Name]`, karena di SolidJS fungsi ini menciptakan sinyal/komputasi independen dan tidak terikat siklus render seperti React Hooks.
- **Ekspor & Impor**: Ekspor fungsi bernama (_named export_) dan impor menggunakan path alias `~`:

  ```typescript
  import { createClipboard } from "~/hooks/create-clipboard";
  ```

---

## Aturan Reaktivitas SolidJS (Strict)

1. **Dilarang Mendestrukturisasi Props Langsung**:
   Jika hook menerima parameter berbentuk objek/props yang bersifat reaktif, dilarang melakukan `const { value, delay } = props`. Akses selalu nilai via `props.value` atau manfaatkan `splitProps`.
2. **Akses Nilai Sinyal via Pemanggilan Fungsi**:
   Ingat bahwa signal SolidJS adalah fungsi accessor: panggil `state()` untuk membaca nilai, bukan `state`.
3. **SSR Safety Guard (Wajib)**:
   Seluruh hook yang mengakses objek `window`, `document`, atau Web API peramban wajib dibungkus dengan guard:

   ```typescript
   if (typeof window !== "undefined") {
     // akses Web API
   }
   ```
4. **Wajib Co-located Unit Test**:
   Setiap custom hook baru wajib disertai berkas pengujian unit berdampingan (`*.test.ts`) yang menguji skenario positif dan penanganan boundary condition.
