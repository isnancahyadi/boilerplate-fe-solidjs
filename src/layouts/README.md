# Directory: `src/layouts/`

Direktori ini bertanggung jawab mengelola **template kerangka halaman tingkat aplikasi (Application-Level Page & Route Shells)**. Komponen di dalam direktori ini bertindak sebagai pembungkus struktural makro yang mendefinisikan layout visual, hierarki navigasi, sidebar, header, dan footer untuk sekelompok rute tertentu.

Direktori ini tidak terbatas hanya pada `app-layout.tsx` dan `auth-layout.tsx`, melainkan dapat ditambahkan shell layout baru sesuai segmentasi rute aplikasi (misal: layout publik/marketing, layout pengaturan, layout kanvas layar penuh).

---

## Perbedaan `src/layouts/` vs `src/components/layouts/`

| Direktori                          | Cakupan / Level Arsitektur     | Tanggung Jawab & Contoh                                                                                                                                   |
| :--------------------------------- | :----------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/layouts/`** (Direktori Ini) | **Page / Route Shell (Makro)** | Mengatur struktur seluruh viewport halaman aplikasi (misal: layout dashboard bersidebar di `app-layout.tsx`, layout auth minimalis di `auth-layout.tsx`). |
| **`src/components/layouts/`**      | **Atomic UI Wrappers (Mikro)** | Komponen utilitas pembungkus geometris kecil untuk menata flexbox dan container (misal: `<Flex>`, `<ContentWrapper>`, `<CardContainer>`).                 |

---

## Berkas Shell Bawaan Proyek

| Berkas Shell          | Rute Target        | Fitur & Komposisi yang Disediakan                                                                                                                                                             |
| :-------------------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`app-layout.tsx`**  | `/app/*` (Privat)  | Shell aplikasi utama. Menyediakan header atas sticky, sidebar navigasi collapsible, container viewport konten utama yang dapat di-scroll, serta slot komposisi (`headerSlot`, `sidebarSlot`). |
| **`auth-layout.tsx`** | `/auth/*` (Publik) | Shell alur autentikasi. Mengintegrasikan meta title dokumen (`@solidjs/meta`), branding visual aplikasi, ilustrasi, dan kontainer form login di tengah viewport.                              |

---

## Panduan Menambahkan Shell Layout Baru

Jika aplikasi membutuhkan segmentasi tampilan rute baru (misalnya `settings-layout.tsx` dengan sidebar sub-menu vertikal atau `fullscreen-layout.tsx` untuk tampilan peta/kanvas analitik penuh):

1. **Buat Berkas dengan Format Kebab-Case**:
   Namai file sesuai peruntukan perutean: `[nama]-layout.tsx` (misal: `settings-layout.tsx`, `public-layout.tsx`).
2. **Gunakan Slot Komposisi**:
   Sediakan properti slot opsional (`headerSlot`, `footerSlot`, `sidebarSlot`) agar rute spesifik dapat menginjeksikan tombol aksi atau navigasi kontekstual tanpa perlu memodifikasi kode inti layout.
3. **Patuhi Reaktivitas SolidJS (`splitProps`)**:
   Dilarang mendestrukturisasi props secara langsung. Gunakan selalu `splitProps(props, ["children", "class", ...])` untuk memisahkan properti lokal layout dari atribut kontainer.
4. **Terapkan Token Semantik Tailwind v4**:
   Gunakan token warna semantik (`bg-background`, `bg-surface-primary`, `bg-surface-secondary`, `border-border`, `text-foreground`). Dilarang keras melakukan hardcode nilai warna HEX.

---

## Contoh Integrasi Shell pada Rute

```tsx
// src/routes/app/dashboard/index.tsx
import AppLayout from "~/layouts/app-layout";
import { DashboardOverview } from "~/features/dashboard";

export default function DashboardRoute() {
  return (
    <AppLayout title="Dashboard Overview">
      <DashboardOverview />
    </AppLayout>
  );
}
```
