# Product Requirements Document (PRD) — [Nama Produk / Aplikasi]

> **Versi Dokumen**: 1.0.0 (Draft / Template Baseline)  
> **Tanggal Efektif**: [YYYY-MM-DD]  
> **Tanggal Awal**: [YYYY-MM-DD]  
> **Status**: [Draft / In Review / Approved Baseline / Archived]  
> **Dokumen Terkait**: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`DESIGN.md`](./DESIGN.md) · [`API.md`](./API.md) · [`AGENTS.md`](./AGENTS.md) · [`DEPLOYMENT.md`](./DEPLOYMENT.md)  
> **Pemilik Produk**: [Nama organisasi / individu]  
> **Klien / Sponsor**: [Nama klien / sponsor / N/A]  
> **Stakeholder Utama**: [Daftar stakeholder]  
> **Audience**: [Tim pengembang / stakeholder bisnis / publik / lainnya]

> **Petunjuk penggunaan**: Ganti seluruh nilai dalam tanda kurung siku, hapus contoh yang tidak relevan, dan gunakan `N/A` jika sebuah bagian tidak berlaku. PRD harus menjelaskan kebutuhan produk, bukan mengunci implementasi yang belum disepakati. Detail teknis diletakkan di dokumen terkait dan dirujuk dari PRD ini.

Dokumen ini adalah sumber kebenaran tunggal (*single source of truth*) untuk tujuan produk, masalah yang diselesaikan, ruang lingkup, kebutuhan pengguna, kriteria penerimaan, risiko, dan aturan perubahan scope.

---

## Peta Dokumen

| Pertanyaan / Kebutuhan | Rujukan Dokumen Utama |
| :--- | :--- |
| Apa yang dibangun, mengapa dibangun, dan apa yang tidak boleh ditambah? | **`PRD.md` (Dokumen ini)** |
| Bagaimana sistem dirancang dan teknologi apa yang digunakan? | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Bagaimana pengalaman pengguna dan tampilan dirancang? | [`DESIGN.md`](./DESIGN.md) |
| Bagaimana kontrak endpoint dan data ditentukan? | [`API.md`](./API.md) |
| Apa aturan kontribusi, kualitas, dan guardrail implementasi? | [`AGENTS.md`](./AGENTS.md) |
| Bagaimana aplikasi dibangun dan dirilis? | [`DEPLOYMENT.md`](./DEPLOYMENT.md) |

Jika dokumen terkait belum tersedia, tuliskan `N/A` dan jangan mengarang kontrak teknis di PRD.

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
   - 1.1 [Pernyataan Masalah](#11-pernyataan-masalah)
   - 1.2 [Solusi yang Diusulkan](#12-solusi-yang-diusulkan)
   - 1.3 [Sasaran dan Kriteria Keberhasilan](#13-sasaran-dan-kriteria-keberhasilan)
   - 1.4 [Asumsi dan Batasan](#14-asumsi-dan-batasan)
2. [Pengguna dan Kebutuhan](#2-pengguna-dan-kebutuhan)
   - 2.1 [Persona Pengguna](#21-persona-pengguna)
   - 2.2 [Matriks Akses](#22-matriks-akses)
   - 2.3 [User Stories dan Acceptance Criteria](#23-user-stories-dan-acceptance-criteria)
   - 2.4 [Aturan Bisnis](#24-aturan-bisnis)
3. [Ruang Lingkup dan Roadmap](#3-ruang-lingkup-dan-roadmap)
   - 3.1 [MVP / Fase 1](#31-mvp--fase-1)
   - 3.2 [Non-Goals / Di Luar Scope](#32-non-goals--di-luar-scope)
   - 3.3 [Fase Mendatang](#33-fase-mendatang)
4. [Spesifikasi Produk](#4-spesifikasi-produk)
   - 4.1 [Modul dan Alur Utama](#41-modul-dan-alur-utama)
   - 4.2 [Kebutuhan Platform](#42-kebutuhan-platform)
   - 4.3 [Integrasi dan Data](#43-integrasi-dan-data)
   - 4.4 [Keamanan dan Privasi](#44-keamanan-dan-privasi)
   - 4.5 [Performa, Aksesibilitas, dan Kompatibilitas](#45-performa-aksesibilitas-dan-kompatibilitas)
   - 4.6 [Lokalisasi dan Konfigurasi](#46-lokalisasi-dan-konfigurasi)
5. [Risiko, Dependensi, dan Pertanyaan Terbuka](#5-risiko-dependensi-dan-pertanyaan-terbuka)
6. [Kriteria Penerimaan dan Definition of Done](#6-kriteria-penerimaan-dan-definition-of-done)
7. [Tata Kelola Perubahan PRD](#7-tata-kelola-perubahan-prd)
8. [Glosarium](#8-glosarium)
9. [Riwayat Revisi Dokumen](#9-riwayat-revisi-dokumen)

---

## 1. Ringkasan Eksekutif

### 1.1 Pernyataan Masalah

[Jelaskan siapa yang mengalami masalah, proses saat ini, dampaknya, dan bukti atau konteks yang mendasarinya. Hindari langsung menjelaskan solusi sebelum masalahnya jelas.]

**Masalah utama:** [Satu kalimat ringkas]  
**Dampak bisnis / pengguna:** [Waktu, biaya, risiko, kualitas, akses, atau metrik lain]  
**Bukti / sumber informasi:** [Riset, wawancara, data operasional, issue tracker, atau N/A]

### 1.2 Solusi yang Diusulkan

[Deskripsikan produk dan cara produk menyelesaikan masalah. Jelaskan batasan pendekatan, misalnya manual vs otomatis, online vs offline, atau internal vs publik.]

**Nama produk:** [Nama]  
**Tipe produk:** [Web / Mobile / Desktop / API / Internal tool / Lainnya]  
**Nilai utama:** [Manfaat utama yang diterima pengguna atau organisasi]

### 1.3 Sasaran dan Kriteria Keberhasilan

#### Sasaran Produk

1. [Sasaran yang ingin dicapai]
2. [Sasaran yang ingin dicapai]
3. [Sasaran yang ingin dicapai]

#### KPI / Kriteria Keberhasilan

| # | Indikator | Target | Cara Ukur | Periode Evaluasi |
| :--- | :--- | :--- | :--- | :--- |
| 1 | [Indikator keberhasilan] | [Target terukur] | [Metode pengukuran] | [Periode / N/A] |
| 2 | [Indikator keberhasilan] | [Target terukur] | [Metode pengukuran] | [Periode / N/A] |
| 3 | [Indikator keberhasilan] | [Target terukur] | [Metode pengukuran] | [Periode / N/A] |

Jika KPI belum disepakati, tuliskan pemilik keputusan dan batas waktu penetapannya pada [Pertanyaan Terbuka](#53-pertanyaan-terbuka).

### 1.4 Asumsi dan Batasan

| Area | Asumsi / Batasan | Dampak jika tidak terpenuhi |
| :--- | :--- | :--- |
| Waktu / jadwal | [Contoh: MVP harus tersedia pada tanggal tertentu] | [Dampak] |
| Anggaran / sumber daya | [Tim, biaya, atau kapasitas] | [Dampak] |
| Data / proses bisnis | [Ketersediaan data atau proses yang diasumsikan] | [Dampak] |
| Platform / lingkungan | [Perangkat, browser, jaringan, atau sistem yang didukung] | [Dampak] |
| Regulasi / kebijakan | [Kebijakan internal atau aturan eksternal / N/A] | [Dampak] |

---

## 2. Pengguna dan Kebutuhan

### 2.1 Persona Pengguna

| Persona | Peran / Konteks | Tujuan Utama | Hambatan Saat Ini |
| :--- | :--- | :--- | :--- |
| [Nama persona] | [Siapa dan dalam konteks apa] | [Yang ingin dicapai] | [Masalah yang dialami] |
| [Nama persona] | [Siapa dan dalam konteks apa] | [Yang ingin dicapai] | [Masalah yang dialami] |

### 2.2 Matriks Akses

Gunakan bagian ini hanya jika produk memiliki login, role, permission, atau pembatasan data.

| Persona / Role | Area yang Dapat Diakses | Aksi yang Diizinkan | Batasan Data |
| :--- | :--- | :--- | :--- |
| [Role] | [Modul / halaman / resource] | [View / create / update / delete / export / lainnya] | [Batasan] |
| [Role] | [Modul / halaman / resource] | [Aksi] | [Batasan] |

**Aturan akses penting:** [Contoh: aksi tanpa izin disembunyikan; data antar organisasi tidak boleh saling terlihat; atau N/A].

### 2.3 User Stories dan Acceptance Criteria

Tuliskan kebutuhan sebagai hasil yang dapat diverifikasi. Satu story sebaiknya memiliki satu tujuan pengguna yang jelas.

#### [Modul / Alur 1]

- **Story:** Sebagai [persona], saya ingin [aksi / kemampuan], agar [manfaat].
  - **Acceptance Criteria:**
    - [ ] [Kondisi berhasil yang dapat diuji]
    - [ ] [Kondisi validasi atau batasan]
    - [ ] [Kondisi error atau alternatif]
- **Story:** Sebagai [persona], saya ingin [aksi / kemampuan], agar [manfaat].
  - **Acceptance Criteria:**
    - [ ] [Kondisi berhasil yang dapat diuji]
    - [ ] [Kondisi error atau alternatif]

#### [Modul / Alur 2]

- **Story:** Sebagai [persona], saya ingin [aksi / kemampuan], agar [manfaat].
  - **Acceptance Criteria:**
    - [ ] [Kondisi berhasil yang dapat diuji]
    - [ ] [Kondisi boundary / error]

Tambahkan subbagian untuk setiap modul. Jangan mengisi acceptance criteria dengan detail implementasi yang seharusnya berada di `ARCHITECTURE.md` atau `API.md`.

### 2.4 Aturan Bisnis

| ID | Aturan | Kondisi / Pengecualian | Sumber / Pemilik Keputusan |
| :--- | :--- | :--- | :--- |
| BR-001 | [Aturan bisnis] | [Pengecualian / N/A] | [Stakeholder] |
| BR-002 | [Aturan bisnis] | [Pengecualian / N/A] | [Stakeholder] |

---

## 3. Ruang Lingkup dan Roadmap

> [!CAUTION]
> Fitur di luar MVP atau yang tercantum sebagai non-goal tidak boleh diimplementasikan tanpa perubahan PRD yang disetujui.

### 3.1 MVP / Fase 1

| Modul / Kapabilitas | Prioritas | Status | Termasuk MVP | Catatan |
| :--- | :--- | :--- | :---: | :--- |
| [Modul / kapabilitas] | Must / Should / Could | Planned / In Progress / Active | Ya / Tidak | [Catatan] |
| [Modul / kapabilitas] | Must / Should / Could | Planned / In Progress / Active | Ya / Tidak | [Catatan] |

**Batas MVP:** [Definisi ringkas tentang apa yang harus tersedia agar produk dapat dirilis pertama kali].

### 3.2 Non-Goals / Di Luar Scope

Fitur berikut secara eksplisit tidak termasuk dalam fase ini:

- [Fitur yang ditunda atau ditolak]
- [Integrasi yang belum disepakati]
- [Platform, persona, atau skenario yang belum didukung]

**Alasan utama:** [Keterbatasan waktu, risiko, dependensi, validasi pasar, atau alasan lain].

### 3.3 Fase Mendatang

| Fase | Kapabilitas | Prasyarat | Target / Status |
| :--- | :--- | :--- | :--- |
| Fase 2 | [Kapabilitas lanjutan] | [Prasyarat] | [Target / TBD] |
| Fase 3 | [Kapabilitas lanjutan] | [Prasyarat] | [Target / TBD] |

---

## 4. Spesifikasi Produk

### 4.1 Modul dan Alur Utama

Gunakan satu subbagian per modul yang termasuk MVP.

#### [Nama Modul]

- **Tujuan:** [Masalah pengguna yang diselesaikan]
- **Persona terkait:** [Persona]
- **Rute / entry point:** [URL, layar, command, atau N/A]
- **Alur utama:**
  1. [Langkah pertama]
  2. [Langkah berikutnya]
  3. [Hasil yang diharapkan]
- **Data yang ditampilkan / diubah:** [Entitas atau informasi]
- **Kondisi kosong:** [Perilaku ketika belum ada data]
- **Kondisi error:** [Perilaku ketika validasi, jaringan, atau dependensi gagal]
- **Audit / histori:** [Kebutuhan pencatatan perubahan / N/A]

### 4.2 Kebutuhan Platform

| Area | Persyaratan |
| :--- | :--- |
| Platform | [Web / mobile / desktop / API / lainnya] |
| Perangkat minimum | [Spesifikasi atau `N/A`] |
| Browser / OS | [Browser dan versi yang didukung / `N/A`] |
| Mode koneksi | [Online / offline / koneksi terbatas / N/A] |
| Rendering / delivery | [SSR / CSR / native / server-to-server / N/A] |
| Teknologi | [Rujuk `ARCHITECTURE.md` atau tuliskan stack yang disepakati] |

### 4.3 Integrasi dan Data

| Integrasi / Sumber Data | Tujuan | Arah Data | Kontrak / Format | Status |
| :--- | :--- | :--- | :--- | :--- |
| [Sistem / layanan] | [Tujuan integrasi] | Inbound / Outbound / Dua arah | [API / file / event / N/A] | Planned / Active / Future |

- **Sumber data utama:** [Database, API, file, user input, atau N/A]
- **Kebutuhan sinkronisasi:** [Real-time, terjadwal, manual, atau N/A]
- **Retensi data:** [Lama penyimpanan dan kebijakan penghapusan / N/A]
- **Kontrak resmi:** [Tautkan ke `API.md`, schema, atau dokumen lain]

### 4.4 Keamanan dan Privasi

- **Autentikasi:** [Metode / N/A]
- **Otorisasi:** [Role, permission, ownership, atau N/A]
- **Perlindungan data:** [Enkripsi, masking, isolasi tenant, atau N/A]
- **Data sensitif:** [Jenis data dan aturan penanganannya / N/A]
- **Audit log:** [Aksi yang wajib dicatat / N/A]
- **Kepatuhan:** [Regulasi atau kebijakan yang berlaku / N/A]
- **Batasan keamanan:** [Hal yang secara eksplisit tidak boleh dilakukan]

### 4.5 Performa, Aksesibilitas, dan Kompatibilitas

| Area | Target / Persyaratan | Cara Verifikasi |
| :--- | :--- | :--- |
| Performa | [Contoh: halaman utama dapat digunakan < X detik] | [Pengujian / monitoring] |
| Skalabilitas | [Jumlah user, request, atau data yang ditargetkan] | [Load test / estimasi / N/A] |
| Availability | [Target uptime / N/A] | [Monitoring] |
| Aksesibilitas | [WCAG level atau standar lain / N/A] | [Audit manual / automated test] |
| Kompatibilitas | [Perangkat, browser, atau versi OS] | [Uji kompatibilitas] |
| Observability | [Logging, metrics, tracing, alert / N/A] | [Checklist operasional] |

### 4.6 Lokalisasi dan Konfigurasi

- **Bahasa yang didukung:** [Bahasa / N/A]
- **Format lokal:** [Tanggal, waktu, angka, mata uang / N/A]
- **Konfigurasi per lingkungan:** [Environment variable, feature flag, atau N/A]
- **Tema / branding:** [Kebutuhan tema, logo, atau branding / N/A]
- **Default dan fallback:** [Perilaku jika konfigurasi tidak tersedia]

---

## 5. Risiko, Dependensi, dan Pertanyaan Terbuka

### 5.1 Risiko

| Risiko | Dampak | Kemungkinan | Mitigasi | Pemilik |
| :--- | :--- | :--- | :--- | :--- |
| [Risiko] | Rendah / Sedang / Tinggi | Rendah / Sedang / Tinggi | [Rencana mitigasi] | [Nama / tim] |

### 5.2 Dependensi dan Constraint

- [Backend, API, vendor, data, perangkat, approval, atau infrastruktur yang diperlukan]
- [Dependensi eksternal yang dapat memengaruhi jadwal]
- [Constraint legal, anggaran, resource, atau platform]

### 5.3 Pertanyaan Terbuka

| ID | Pertanyaan / Keputusan yang Dibutuhkan | Pemilik | Deadline | Status |
| :--- | :--- | :--- | :--- | :--- |
| Q-001 | [Pertanyaan yang belum terjawab] | [Nama / tim] | [YYYY-MM-DD / TBD] | Open / Resolved |

---

## 6. Kriteria Penerimaan dan Definition of Done

### 6.1 Kriteria Penerimaan Produk

Produk atau fase dianggap dapat diterima jika:

- [ ] Semua user story MVP memiliki acceptance criteria yang terpenuhi.
- [ ] Skenario sukses, validasi, boundary, dan error untuk alur kritis telah diverifikasi.
- [ ] KPI yang disepakati memiliki baseline atau cara pengukuran yang siap digunakan.
- [ ] Risiko kritis memiliki mitigasi atau persetujuan penerimaan risiko.
- [ ] Dokumentasi teknis, operasional, dan kontrak data yang relevan telah diperbarui.

### 6.2 Definition of Done Implementasi

Sesuaikan checklist ini dengan stack proyek. Item yang tidak relevan dapat dihapus.

- [ ] Kode mengikuti arsitektur dan konvensi proyek.
- [ ] Validasi input, error handling, keamanan, dan aksesibilitas telah diterapkan.
- [ ] Unit / integration / E2E test yang relevan mencakup skenario positif dan negatif.
- [ ] Lint, type-check, test, dan build lulus.
- [ ] Tidak ada teks, endpoint, permission, atau konfigurasi yang hanya tersimpan di satu locale atau environment jika proyek memerlukannya.
- [ ] Perubahan dokumen terkait telah disinkronkan.
- [ ] Review stakeholder atau Product Owner selesai.

---

## 7. Tata Kelola Perubahan PRD

PRD ini adalah *Living Document*, tetapi perubahan scope harus tetap terkendali.

1. Perubahan kebutuhan, acceptance criteria, fase, atau non-goal diajukan sebagai change request.
2. Change request harus menjelaskan alasan, dampak terhadap scope, jadwal, biaya, arsitektur, API, desain, dan risiko.
3. Developer / Product Owner / stakeholder yang berwenang harus menyetujui perubahan sebelum implementasi dimulai.
4. Setelah disetujui, sinkronkan dokumen terkait (`ARCHITECTURE.md`, `DESIGN.md`, `API.md`, `AGENTS.md`, atau `DEPLOYMENT.md`) bila terdampak.
5. Naikkan versi dokumen dan catat perubahan pada [Riwayat Revisi](#9-riwayat-revisi-dokumen).
6. Fitur yang belum tercatat dan disetujui di PRD dianggap di luar scope.

### Definition of Ready

Sebuah fitur siap diimplementasikan jika memiliki:

- Tujuan dan persona pengguna yang jelas.
- Scope dan non-goal yang jelas.
- Acceptance criteria yang dapat diuji.
- Pemilik keputusan untuk pertanyaan terbuka.
- Kontrak data dan desain yang tersedia atau secara eksplisit ditandai sebagai pekerjaan fitur.

---

## 8. Glosarium

| Istilah | Definisi |
| :--- | :--- |
| [Istilah] | [Definisi yang berlaku untuk proyek ini] |
| [Istilah] | [Definisi yang berlaku untuk proyek ini] |

---

## 9. Riwayat Revisi Dokumen

| Versi | Tanggal | Inisiator / Reviewer | Ringkasan Perubahan |
| :--- | :--- | :--- | :--- |
| **1.0.0** | [YYYY-MM-DD] | [Nama / tim] | Inisialisasi PRD menggunakan template universal. |

---

_Dokumen ini adalah template PRD. Pastikan semua placeholder telah diisi atau dihapus sebelum status dokumen diubah menjadi **Approved Baseline**._
