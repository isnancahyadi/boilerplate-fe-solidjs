---
name: ark-ui
description: Headless, accessible UI primitives for SolidJS using @ark-ui/solid with Tailwind CSS v4 and CVA. Use when creating, modifying, or styling UI components (Button, Dialog, Select, Accordion, Tooltip, etc.), looking up Ark UI component anatomy, or referencing Ark UI's LLMs.txt documentation.
license: MIT
metadata:
  author: boilerplate-solidstart
  version: "1.0.0"
---

# Ark UI for SolidJS (LLMs.txt & Primitives Guide)

Headless, fully accessible component library built on [Ark UI (`@ark-ui/solid`)](https://ark-ui.com) and Zag.js state machines, tailored for SolidJS, Tailwind CSS v4 (OKLCH semantic design tokens), and Class Variance Authority (CVA).

---

## 1. LLMs.txt Documentation Endpoints

Ark UI provides first-class support for LLMs through dedicated endpoints:

| Sumber / Endpoint | Deskripsi & Format | Kapan Digunakan |
| :--- | :--- | :--- |
| **`https://ark-ui.com/llms.txt`** | Index terstruktur seluruh komponen & link dokumentasi | Mengetahui daftar lengkap komponen & rute |
| **`https://ark-ui.com/llms-solid.txt`** | Seluruh dokumentasi SolidJS dalam satu file teks (~1.7 MB) | Pencarian API, hooks, props, dan contoh kode SolidJS lengkap |
| **`https://ark-ui.com/llms.txt/{slug}?framework=solid`** | Dokumentasi markdown per komponen khusus SolidJS (misal `components/dialog?framework=solid`) | Menarik spesifikasi spesifik satu komponen |
| **`https://ark-ui.com/solid/docs/components/{slug}`** | Halaman web dokumentasi interaktif resmi SolidJS | Verifikasi visual dan state machine |

### Referensi Lokal & Index Cepat
Proyek ini menyimpan tabel index cepat seluruh komponen SolidJS:
- **Quick Index**: `.agents/skills/ark-ui/references/components-index.md`
- **On-Demand Fetch**: AI Agent diwajibkan menarik dokumentasi per-komponen langsung secara on-demand via URL `https://ark-ui.com/llms.txt/components/{slug}?framework=solid` untuk menghemat token context dan memastikan referensi selalu mutakhir tanpa menyimpan file fisik monolitik berukuran besar di repositori.

---

## 2. Pola Arsitektur Boilerplate

Seluruh komponen primitif UI di proyek ini mengikuti 4 pilar arsitektur:

### 2.1 Pure Copy-Paste Ownership (`src/components/ui/`)
- Komponen primitif diletakkan di `src/components/ui/<nama-komponen>.tsx` (kebab-case).
- Komponen diekspor dengan PascalCase (`Button`, `Dialog`, `Select`).
- Kode dimiliki penuh oleh repository (bukan dependensi monolitik black-box).

### 2.2 SolidJS Strict Reactivity Rules
SolidJS melacak sinyal reaktivitas berdasarkan akses properti objek.
1. **DILARANG Destrukturisasi Props**:
   ```tsx
   // ❌ SALAH — Merusak fine-grained signal tracking
   export function Button({ variant, class: className, ...props }: ButtonProps) { ... }

   // ✅ BENAR — Gunakan splitProps untuk memisahkan properti
   export function Button(props: ButtonProps) {
     const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);
     return <ark.button class={buttonVariants({ variant: local.variant, size: local.size, class: local.class })} {...others}>{local.children}</ark.button>;
   }
   ```
2. **Akses Langsung**: Bila tidak dipisahkan oleh `splitProps`, akses langsung melalui `props.someProp`.
3. **Children Wrapping**: Saat melakukan inspeksi child dinamis, gunakan `children(() => props.children)`.

### 2.3 Tailwind CSS v4 Semantic Tokens (Anti-Hardcode)
Gunakan token semantik dari `src/assets/styles/variables.css` (hindari hex literal / arbitrary values):
- Background: `bg-background`, `bg-card`, `bg-popover`, `bg-primary`, `bg-muted`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
- Border: `border-border`, `border-input`, `border-primary`
- Status: `bg-destructive`, `bg-success`, `bg-warning`, `bg-info`

### 2.4 Class Variance Authority (CVA) & Data Attributes
- Tentukan varian visual menggunakan `cva` dengan default values.
- Ark UI mengekspos atribut data state otomatis: `data-state="open|closed"`, `data-disabled`, `data-focus`, `data-highlighted`, `data-invalid`, `data-expanded`.
- Gunakan selector Tailwind: `data-[state=open]:...`, `data-[disabled]:opacity-50`, dll.

---

## 3. Template Pembuatan Komponen Primitif

### Contoh: `Dialog` (`src/components/ui/dialog.tsx`)

```tsx
import { Dialog as ArkDialog } from "@ark-ui/solid/dialog";
import type { ComponentProps } from "solid-js";
import { Portal } from "solid-js/web";
import { splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const dialogContentVariants = cva(
  "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-lg border border-border duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        full: "max-w-[calc(100vw-2rem)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const Dialog = ArkDialog.Root;
export const DialogTrigger = ArkDialog.Trigger;

export interface DialogContentProps
  extends ComponentProps<typeof ArkDialog.Content>,
    VariantProps<typeof dialogContentVariants> {}

export function DialogContent(props: DialogContentProps) {
  const [local, others] = splitProps(props, ["class", "size", "children"]);

  return (
    <Portal>
      <ArkDialog.Backdrop class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <ArkDialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <ArkDialog.Content
          class={cn(dialogContentVariants({ size: local.size }), local.class)}
          {...others}
        >
          {local.children}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  );
}

export const DialogTitle = (props: ComponentProps<typeof ArkDialog.Title>) => {
  const [local, others] = splitProps(props, ["class"]);
  return <ArkDialog.Title class={cn("text-lg font-semibold text-foreground", local.class)} {...others} />;
};

export const DialogDescription = (props: ComponentProps<typeof ArkDialog.Description>) => {
  const [local, others] = splitProps(props, ["class"]);
  return <ArkDialog.Description class={cn("text-sm text-muted-foreground mt-1.5", local.class)} {...others} />;
};

export const DialogCloseTrigger = ArkDialog.CloseTrigger;
```

---

## 4. Daftar Komponen Ark UI Solid & Anatominya

Berikut daftar komponen Ark UI yang siap digunakan di `@ark-ui/solid`:

### Actions & Navigation
- **Accordion**: `@ark-ui/solid/accordion` (`Root`, `Item`, `ItemTrigger`, `ItemContent`, `ItemIndicator`)
- **Menu**: `@ark-ui/solid/menu` (`Root`, `Trigger`, `Positioner`, `Content`, `Item`, `ItemGroup`, `Separator`)
- **Navigation Menu**: `@ark-ui/solid/navigation-menu` (`Root`, `List`, `Item`, `Trigger`, `Content`, `Link`, `Indicator`)
- **Tabs**: `@ark-ui/solid/tabs` (`Root`, `List`, `Trigger`, `Content`, `Indicator`)
- **Steps**: `@ark-ui/solid/steps` (`Root`, `List`, `Item`, `Trigger`, `Indicator`, `Separator`, `Content`, `CompletedContent`)
- **Pagination**: `@ark-ui/solid/pagination` (`Root`, `PrevTrigger`, `NextTrigger`, `Item`, `Ellipsis`)

### Forms & Input
- **Checkbox**: `@ark-ui/solid/checkbox` (`Root`, `Label`, `Control`, `Indicator`, `HiddenInput`)
- **Radio Group**: `@ark-ui/solid/radio-group` (`Root`, `Label`, `Item`, `ItemText`, `ItemControl`, `ItemHiddenInput`, `Indicator`)
- **Select**: `@ark-ui/solid/select` + `createListCollection` (`Root`, `Label`, `Control`, `Trigger`, `ValueText`, `Indicator`, `ClearTrigger`, `Positioner`, `Content`, `ItemGroup`, `Item`, `ItemText`, `ItemIndicator`, `HiddenSelect`)
- **Combobox**: `@ark-ui/solid/combobox` + `createListCollection` (`Root`, `Control`, `Input`, `Trigger`, `ClearTrigger`, `Positioner`, `Content`, `Item`)
- **Switch**: `@ark-ui/solid/switch` (`Root`, `Label`, `Control`, `Thumb`, `HiddenInput`)
- **Slider**: `@ark-ui/solid/slider` (`Root`, `Label`, `ValueText`, `Control`, `Track`, `Range`, `Thumb`, `HiddenInput`)
- **Number Input**: `@ark-ui/solid/number-input` (`Root`, `Label`, `Input`, `Control`, `IncrementTrigger`, `DecrementTrigger`)
- **Pin Input**: `@ark-ui/solid/pin-input` (`Root`, `Label`, `Control`, `Input`, `HiddenInput`)
- **Tags Input**: `@ark-ui/solid/tags-input` (`Root`, `Label`, `Control`, `Input`, `ClearTrigger`, `Item`, `ItemInput`, `ItemText`, `ItemDeleteTrigger`)
- **Field & Fieldset**: `@ark-ui/solid/field`, `@ark-ui/solid/fieldset` (`Root`, `Label`, `Input`, `HelperText`, `ErrorText`)
- **File Upload**: `@ark-ui/solid/file-upload` (`Root`, `Dropzone`, `Trigger`, `Label`, `ItemGroup`, `Item`, `ItemName`, `ItemSizeText`, `ItemDeleteTrigger`, `HiddenInput`)

### Overlays & Popups
- **Dialog**: `@ark-ui/solid/dialog` (`Root`, `Trigger`, `Backdrop`, `Positioner`, `Content`, `Title`, `Description`, `CloseTrigger`)
- **Drawer**: `@ark-ui/solid/drawer` (atau menggunakan varian slide-over dari Dialog)
- **Popover**: `@ark-ui/solid/popover` (`Root`, `Trigger`, `Anchor`, `Positioner`, `Arrow`, `Content`, `Title`, `Description`, `CloseTrigger`)
- **Tooltip**: `@ark-ui/solid/tooltip` (`Root`, `Trigger`, `Positioner`, `Arrow`, `Content`)
- **Hover Card**: `@ark-ui/solid/hover-card` (`Root`, `Trigger`, `Positioner`, `Arrow`, `Content`)

### Feedback & Display
- **Avatar**: `@ark-ui/solid/avatar` (`Root`, `Image`, `Fallback`)
- **Progress**: `@ark-ui/solid/progress` (`Root`, `Label`, `Track`, `Range`, `ValueText`, `Circle`, `CircleTrack`, `CircleRange`)
- **Toast**: `@ark-ui/solid/toast` (`createToaster`, `Toaster`, `Root`, `Title`, `Description`, `CloseTrigger`, `ActionTrigger`)
- **Collapsible**: `@ark-ui/solid/collapsible` (`Root`, `Trigger`, `Content`)

---

## 5. Instruksi AI Agent Saat Diminta Membuat Komponen UI

Bila pengguna meminta membuat atau memodifikasi komponen UI primitif:
1. **Cek Dokumen Komponen**:
   - Tarik spesifikasi markdown komponen via `https://ark-ui.com/llms.txt/components/<nama>?framework=solid` (lihat tabel index di `.agents/skills/ark-ui/references/components-index.md`).
2. **Gunakan Anatomi Resmi**:
   - Selalu gunakan part anatomi resmi dari `@ark-ui/solid/<nama>` sesuai dokumentasi Ark UI.
3. **Patuhi Reaktivitas SolidJS**:
   - Selalu gunakan `splitProps(props, [...])`, jangan pernah destrukturisasi props langsung di parameter fungsi.
4. **Padukan Tailwind CSS v4 & CVA**:
   - Impor `cva` dari `class-variance-authority` dan `cn` dari `~/lib/utils`.
   - Gunakan token semantik CSS (`bg-background`, `border-border`, `text-foreground`, dll.).
5. **Simpan di `src/components/ui/`**:
   - Berikan nama file kebab-case, ekspor PascalCase.
