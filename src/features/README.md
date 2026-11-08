# Directory: `src/features/`

Direktori ini adalah **jantung dari logika domain aplikasi** (_feature-based modular architecture_). Setiap domain bisnis mandiri dibungkus dalam direktori fitur tersendiri.

## Struktur Standar Sebuah Fitur

Setiap fitur memiliki struktur folder yang **simetris dan terisolasi**:

```
src/features/[nama-fitur]/
├── components/          # Komponen antarmuka spesifik fitur ini
│   ├── [Fitur]List.tsx  # Tampilan tabel / grid data
│   ├── [Fitur]Detail.tsx# Tampilan detail data
│   └── form/            # Formulir CUD ([fitur].form.tsx & [fitur].validation.ts)
├── hooks/               # Custom SolidJS hooks lokal KHUSUS untuk fitur ini saja
├── lib/                 # Utilitas lokal & pola data API 3 lapis
│   ├── constant.ts      # Konstanta lokal fitur (opsi status, tab, dll.)
│   ├── utils.ts         # Transformer data lokal fitur
│   └── data/            # ⭐ Pola Data API 3 Lapisan
│       ├── endpoint/    # Layer 1: Konstanta URL endpoint & path generator (disertai *.test.ts)
│       ├── api/         # Layer 2: Fungsi pemanggil HTTP Axios (disertai *.test.ts)
│       ├── query-keys/  # QueryKey factories TanStack Query
│       ├── mock/        # Data dummy + hook mock (opsional bila backend belum siap)
│       └── service/     # Layer 3: TanStack Query hooks (createQuery / createMutation) (disertai *.test.ts)
├── types/               # Tipe data lokal fitur (schema.ts, common.ts)
├── sub-feature/         # (Opsional) Sub-fitur bersarang jika domain memiliki entitas anak
└── index.tsx            # Entry point export publik fitur
```

## Aturan Arsitektur Fitur

1. **Pola Data 3-Lapis Wajib (Guardrail #16 & #8)**:
   - Komponen UI hanya boleh mengimpor dari `service/` (Layer 3).
   - Dilarang memanggil `http` atau URL langsung dari komponen.
2. **Penempatan Dropdown Bersama (Guardrail #38)**:
   - Endpoint `/all` yang mengembalikan opsi dropdown bersama wajib disimpan di `src/lib/data/` (global data layer), bukan di folder fitur lokal, guna mencegah _circular dependency_.
3. **Lokasi Tipe Detail & Mutation Response (Guardrail #40)**:
   - Tipe data model detail (`Detail[Entity]Type`) dan respon mutasi (`[Entity]MutationResponseType`) wajib berada di `types/schema.ts` lokal fitur/sub-fitur, dilarang diletakkan di global schema `src/types/schema/`.
4. **Test-as-you-go & Dual-Scenario (Guardrail #26 & #27)**:
   - Setiap endpoint generator, fungsi API, service hook, dan skema validasi wajib memiliki unit test pendamping berpasangan (_Happy Path_ & _Unhappy/Edge Case_).
