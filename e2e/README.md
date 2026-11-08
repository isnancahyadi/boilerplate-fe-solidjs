# Directory: `e2e/`

Direktori ini menampung seluruh suite **pengujian End-to-End (E2E)** aplikasi berbasis browser nyata menggunakan **Playwright** (`@playwright/test`).

## Daftar Berkas & Peran

| Berkas / Direktori | Peran & Deskripsi                                                                                                                                 |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`app.spec.ts`**  | Baseline test suite yang menguji navigasi halaman utama, interaktivitas komponen reaktif, navigasi sub-rute, serta penanganan error graceful 404. |
| **`README.md`**    | Dokumen panduan, konvensi penulisan, dan perintah eksekusi suite pengujian E2E.                                                                   |

---

## Aturan Arsitektur & Guardrails

1. **Isolasi Folder (Guardrail #25)**: Seluruh file pengujian E2E wajib ditempatkan di dalam folder `e2e/` di luar `src/` dengan ekstensi `*.spec.ts`. Dilarang mencampur file E2E ke dalam `src/`.
2. **Isolasi Runner dari Vitest (Guardrail #24)**: Pengujian unit dan integrasi dijalankan menggunakan Vitest (`src/**/*.test.{ts,tsx}`), sedangkan E2E murni dikelola oleh Playwright (`playwright.config.ts`). Keduanya tidak saling bergantung.
3. **Dual-Scenario Testing Rule (Guardrail #27)**:
   - Setiap berkas spesifikasi pengujian **wajib memuat skenario Positif (_Happy Path_) dan Negatif (_Unhappy Path / Boundary / Error Handling_) secara berpasangan**.
   - Contoh: Selain menguji submit form berhasil, wajib menguji respon saat field wajib kosong atau format input salah.
4. **Penyelarasan Skenario (Guardrail #28)**: Sebelum menulis spec E2E baru untuk modul fitur, AI Agent/kontributor wajib menyelaraskan daftar skenario Positif & Negatif dengan developer.

---

## Perintah Eksekusi (CLI Commands)

Jalankan perintah berikut dari root workspace:

```bash
# Menjalankan seluruh pengujian E2E secara headless (otomatis menyalakan webServer lokal)
pnpm test:e2e

# Menjalankan pengujian E2E dengan Playwright Interactive UI Mode
pnpm test:e2e:ui

# Menjalankan file spec tertentu
pnpm exec playwright test e2e/app.spec.ts

# Menjalankan dalam mode debug (langkah per langkah di browser)
pnpm exec playwright test --debug

# Membuka laporan HTML hasil pengujian terakhir
pnpm exec playwright show-report
```

> [!NOTE]
> Server lokal SolidStart akan secara otomatis dinyalakan oleh Playwright melalui hook `webServer` pada `http://localhost:3000` sebelum suite pengujian dimulai.
