# Directory: `src/config/`

Direktori ini berfungsi sebagai **pusat konfigurasi global tingkat aplikasi (Application-Level Configuration Hub)**. Seluruh pengaturan runtime, integrasi transport jaringan (HTTP/Axios), enkapsulasi penyimpanan klien (cookie/storage), prefix endpoint backend, serta aktivasi fitur modular (_feature flags_) dikelola secara terpusat di sini.

Direktori ini tidak terbatas hanya pada berkas baseline awal, melainkan merupakan rumah bagi konfigurasi eksternal atau konfigurasi sistem baru yang diperlukan oleh aplikasi seiring perkembangannya.

---

## Cakupan & Kategori Konfigurasi

### 1. Transport Jaringan & Klien API (`http.ts`, `prefix.ts`)

- **HTTP Client Singleton (`http.ts`)**: Menginisialisasi instance Axios global dengan interceptor penyisipan Bearer token otomatis dan mekanisme _silent refresh token_ (HTTP 401 via `axios-auth-refresh`).
- **Endpoint Prefix (`prefix.ts`)**: Memetakan basis URL microservice/layanan backend, seperti `API_CORE` (layanan autentikasi, IAM, menu, izin) dan `API_APP` (layanan domain bisnis aplikasi).
- **Pengembangan Lanjutan**: Konfigurasi transport lain seperti WebSocket client, GraphQL client, atau custom fetch instance baru wajib diletakkan di bawah direktori ini.

### 2. Keamanan & Penyimpanan Sesi Klien (`cookies.ts`)

- **Enkapsulasi Cookie (`cookies.ts`)**: Membungkus pustaka `js-cookie` dengan isolasi _namespace_ otomatis berbasis environment (`{env}_{project}_{name}`), path default `/`, serta penegakan flag keamanan (`SameSite`, `Secure`).
- **Pengembangan Lanjutan**: Adapter penyimpanan klien lain (seperti IndexedDB wrapper, persistent localStorage wrapper terisolasi) dapat ditambahkan di folder ini.

### 3. Metadata Aplikasi & Feature Flags (`app.ts`)

- **App Metadata & Flags (`app.ts`)**: Menyediakan konstanta identitas aplikasi (`APP_NAME`, `APP_VERSION`) dan pembaca variabel lingkungan `.env` untuk toggle modul aktif (`MODULE_ACTIVE_CONFIG`).
- **Pengembangan Lanjutan**: Konfigurasi tema default, pagination limits global, batas timeout upload, dan konfigurasi environment multi-tier lainnya.

### 4. Integrasi Layanan & SDK Pihak Ketiga (Opsional / Masa Depan)

- Jika aplikasi mengintegrasikan SDK analitik, pelaporan error (misal: Sentry), atau SDK peta, inisialisasi dan konfigurasinya wajib ditempatkan di dalam direktori `src/config/` ini (misal: `sentry.ts`, `query-client.ts`, `analytics.ts`).

---

## Berkas Baseline Bawaan Proyek

| Berkas           | Kategori          | Tanggung Jawab Utama                                                                  |
| :--------------- | :---------------- | :------------------------------------------------------------------------------------ |
| **`prefix.ts`**  | API Routing       | Konstanta prefix microservice: `API_CORE` (IAM/Auth) dan `API_APP` (Business Domain). |
| **`cookies.ts`** | Client Storage    | Wrapper aman `js-cookie` dengan namespace prefix environment dan flag proteksi.       |
| **`http.ts`**    | Network Transport | Singleton Axios client dengan interceptor Bearer token dan auto-refresh token (401).  |
| **`app.ts`**     | Application State | Metadata aplikasi dan feature flags modular pembaca environment `.env`.               |

---

## Aturan Arsitektur & Guardrails (Zona Hati-hati §1.1)

1. **Zona Sensitif**: File di folder ini mempengaruhi transport data dan autentikasi seluruh aplikasi. Dilarang mengubah alur logika interceptor tanpa pemahaman mendalam dan persetujuan pengembang.
2. **Akses Cookie Wajib via Helper (Guardrail #13)**: Dilarang memanggil `js-cookie` atau `document.cookie` secara langsung dari komponen atau modul fitur; gunakan selalu helper `Cookies` dari `~/config/cookies`.
3. **Komponen Dilarang Mengakses HTTP Langsung (Guardrail #8)**: Dilarang memanggil `http` langsung dari file antarmuka/komponen UI; seluruh pemanggilan request wajib melalui fungsi Layer 2 API (`features/.../lib/data/api/`).
