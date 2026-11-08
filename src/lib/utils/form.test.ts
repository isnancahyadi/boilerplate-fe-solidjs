import { describe, expect, it } from "vitest";

import { appendFormData } from "./form";

describe("form utility - appendFormData", () => {
  it("positif: mengonversi objek primitif, array, dan Blob ke instance FormData dengan benar", () => {
    const payload = {
      name: "Product A",
      count: 42,
      tags: ["alpha", "beta"],
      isActive: true,
    };

    const formData = appendFormData(payload);

    expect(formData.get("name")).toBe("Product A");
    expect(formData.get("count")).toBe("42");
    expect(formData.get("isActive")).toBe("true");
    expect(formData.getAll("tags[]")).toEqual(["alpha", "beta"]);
  });

  it("negatif: menangani nilai null, undefined, atau objek kosong tanpa crash", () => {
    const payload = {
      name: "Valid",
      emptyField: undefined,
      nullField: null,
    };

    const formData = appendFormData(payload);

    expect(formData.get("name")).toBe("Valid");
    expect(formData.has("emptyField")).toBe(false);
    expect(formData.has("nullField")).toBe(false);
  });
});
