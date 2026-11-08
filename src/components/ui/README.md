# Directory: `src/components/ui/`

Direktori ini diperuntukkan bagi **komponen antarmuka primitif tingkat dasar (Headless & Accessible Primitive UI Components)** yang digunakan di seluruh aplikasi. Komponen di dalam direktori ini dibangun dengan memadukan mesin perilaku _headless_ **Ark UI (`@ark-ui/solid`)**, tata gaya semantik **Tailwind CSS v4**, serta deklarasi varian **Class Variance Authority (CVA)**.

Komponen di folder ini berstatus **Pure Copy-Paste Primitives Ownership** (kode sumber dimiliki sepenuhnya oleh proyek), sehingga bebas dikustomisasi, diperluas, dan disesuaikan perilakunya tanpa batasan pustaka UI monolitik eksternal.

---

## Tiga Pilar Fondasi Primitif UI

1. **Ark UI (`@ark-ui/solid`)**:
   Menyediakan mesin _state machine_ dan part anatomi _headless_ yang mematuhi standar aksesibilitas WAI-ARIA, navigasi keyboard lengkap, manajemen fokus otomatis, dan reaktivitas murni (_fine-grained_) SolidJS.
2. **Tailwind CSS v4**:
   Styling ditulis menggunakan utility classes Tailwind v4 yang merujuk pada token semantik OKLCH di `src/assets/styles/variables.css` (`bg-primary`, `bg-card`, `text-foreground`, `border-border`, dll.).
3. **Class Variance Authority (CVA)**:
   Seluruh variasi visual komponen (varian gaya seperti `default`, `outline`, `ghost`, `destructive`, serta ukuran `sm`, `md`, `lg`) didefinisikan secara deklaratif dan bertipe ketat (_type-safe_).

---

## Ragam Komponen Primitif yang Didukung Ark UI

Direktori ini dapat menampung seluruh koleksi primitif antarmuka yang disediakan oleh Ark UI Solid:

| Kategori                | Ragam Komponen Primitif                                                                                                                                                        |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Form & Input**        | `button.tsx`, `input.tsx`, `select.tsx`, `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `combobox.tsx`, `slider.tsx`, `number-input.tsx`, `file-upload.tsx`, `pin-input.tsx` |
| **Overlays & Dialogs**  | `dialog.tsx` (modal), `alert-dialog.tsx`, `popover.tsx`, `tooltip.tsx`, `menu.tsx`, `hover-card.tsx`                                                                           |
| **Navigasi & Struktur** | `tabs.tsx`, `accordion.tsx`, `collapsible.tsx`, `pagination.tsx`, `segment-group.tsx`                                                                                          |
| **Feedback & Status**   | `badge.tsx`, `progress.tsx`, `avatar.tsx`, `rating-group.tsx`                                                                                                                  |

---

## Dokumentasi Resmi Ark UI untuk Pengembang & AI Agent (LLMs.txt)

Ark UI menyediakan dokumentasi terstruktur khusus peramban dan AI agent:
- **Full SolidJS Docs**: [`https://ark-ui.com/llms-solid.txt`](https://ark-ui.com/llms-solid.txt) (Dokumentasi lengkap SolidJS dalam satu berkas).
- **Per-Component Docs**: `https://ark-ui.com/llms.txt/components/{nama}?framework=solid` (Contoh: [dialog](https://ark-ui.com/llms.txt/components/dialog?framework=solid), [select](https://ark-ui.com/llms.txt/components/select?framework=solid), [tabs](https://ark-ui.com/llms.txt/components/tabs?framework=solid), [accordion](https://ark-ui.com/llms.txt/components/accordion?framework=solid)).
- **Index Seluruh Komponen**: [`https://ark-ui.com/llms.txt`](https://ark-ui.com/llms.txt).
- **Referensi Lokal / Quick Index**: `.agents/skills/ark-ui/references/components-index.md` (Daftar slug komponen untuk penarikan dokumentasi markdown on-demand).
- **Skill AI Agent**: `.agents/skills/ark-ui/SKILL.md` (tersedia otomatis untuk Cursor, Windsurf, Claude, Copilot, Hermes, Grok, Qwen).

---

## Konvensi Penamaan & Contoh Implementasi

- **Nama Berkas**: Gunakan huruf kecil kebab-case (`button.tsx`, `dialog.tsx`, `input.tsx`).
- **Ekspor Komponen**: Ekspor komponen PascalCase (`Button`, `Dialog`, `Input`).
- **Pola Koding Reaktivitas SolidJS**:
  Selalu gunakan `splitProps` untuk memisahkan varian CVA dan properti lokal dari properti part Ark UI:

```tsx
// src/components/ui/button.tsx
import { splitProps, type JSX } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-transparent hover:bg-muted text-foreground",
        ghost: "hover:bg-muted text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-9 px-4 text-sm rounded-md",
        lg: "h-10 px-6 text-base rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);

  return (
    <button class={cn(buttonVariants({ variant: local.variant, size: local.size }), local.class)} {...others}>
      {local.children}
    </button>
  );
}
```
