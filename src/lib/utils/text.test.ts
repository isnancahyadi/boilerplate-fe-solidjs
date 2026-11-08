import { describe, expect, it } from "vitest";

import { capitalize, truncateText } from "./text";

describe("text utility", () => {
  it("positif: memotong teks panjang dan mengkapitalisasi huruf pertama dengan benar", () => {
    // Truncate
    expect(truncateText("Hello World", 5)).toBe("Hello...");
    expect(truncateText("Short", 10)).toBe("Short");

    // Capitalize
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("wORLD")).toBe("World");
  });

  it("negatif: menangani string kosong, null, atau undefined dengan aman", () => {
    // Truncate
    expect(truncateText("", 10)).toBe("");
    expect(truncateText(null, 10)).toBe("");
    expect(truncateText(undefined, 10)).toBe("");

    // Capitalize
    expect(capitalize("")).toBe("");
    expect(capitalize(null)).toBe("");
    expect(capitalize(undefined)).toBe("");
  });
});
