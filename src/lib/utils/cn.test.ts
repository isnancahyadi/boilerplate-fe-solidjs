import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn utility", () => {
  it("positif: menggabungkan class string biasa dan menyelesaikan konflik class Tailwind", () => {
    // Skenario positif dasar
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toBe("px-4 py-2 text-sm");

    // Skenario resolusi konflik Tailwind (class terakhir menang)
    const resolved = cn("bg-red-500", "bg-blue-500");
    expect(resolved).toBe("bg-blue-500");
  });

  it("negatif: menangani input falsy, undefined, null, dan array kosong tanpa error", () => {
    // Skenario falsy & conditional
    const condition = false;
    const result = cn("btn", condition && "active", undefined, null, false);
    expect(result).toBe("btn");

    // Skenario input kosong
    expect(cn()).toBe("");
  });
});
