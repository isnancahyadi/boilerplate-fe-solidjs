import { describe, expect, it } from "vitest";

import { hasPermission, parsePermission } from "./permission";

describe("permission utility", () => {
  const samplePermissions = ["user:create", "user:read", "user:update", "item:*", "report:export"];

  it("positif: mengurai aksi permission modul dan memverifikasi izin dengan benar", () => {
    // Skenario positif parsePermission
    const userActions = parsePermission("user", samplePermissions);
    expect(userActions).toEqual(["create", "read", "update"]);

    // Skenario positif hasPermission
    expect(hasPermission(samplePermissions, "user", "create")).toBe(true);
    expect(hasPermission(samplePermissions, "user", "update")).toBe(true);

    // Skenario wildcard permission
    expect(hasPermission(samplePermissions, "item", "delete")).toBe(true);
  });

  it("negatif: mengembalikan array kosong atau false saat input null, modul tidak ada, atau aksi ditolak", () => {
    // Input null / undefined / array kosong
    expect(parsePermission("user", null)).toEqual([]);
    expect(parsePermission("user", undefined)).toEqual([]);
    expect(parsePermission("user", [])).toEqual([]);

    // Modul tidak ditemukan
    expect(parsePermission("unknown_module", samplePermissions)).toEqual([]);
    expect(hasPermission(samplePermissions, "unknown_module", "read")).toBe(false);

    // Aksi tidak diizinkan pada modul yang ada
    expect(hasPermission(samplePermissions, "user", "delete")).toBe(false);
  });
});
