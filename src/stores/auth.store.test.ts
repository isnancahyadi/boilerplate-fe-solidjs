import { beforeEach, describe, expect, it } from "vitest";

import { type UserProfile, useAuthStore } from "./auth.store";

describe("useAuthStore (Dual-Scenario)", () => {
  const dummyUser: UserProfile = {
    id: "usr-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    avatar: "https://example.com/avatar.png",
  };

  beforeEach(() => {
    // Reset state store sebelum setiap skenario pengujian
    useAuthStore.getState().clearAuth();
  });

  describe("Positive Scenarios (Happy Path)", () => {
    it("[POS-01] kondisi awal store harus memiliki user null, permissions kosong, dan isAuthenticated false", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.permissions).toEqual([]);
      expect(state.isAuthenticated).toBe(false);
    });

    it("[POS-02] setUser dengan profil valid harus memperbarui user dan mengaktifkan isAuthenticated", () => {
      useAuthStore.getState().setUser(dummyUser);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(dummyUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it("[POS-03] setPermissions harus menyimpan daftar hak akses dengan benar", () => {
      const permissions: Array<string> = ["dashboard.view", "user.create", "user.update"];
      useAuthStore.getState().setPermissions(permissions);

      const state = useAuthStore.getState();
      expect(state.permissions).toEqual(permissions);
      expect(state.permissions).toHaveLength(3);
    });

    it("[POS-04] clearAuth harus mereset seluruh state sesi ke nilai default", () => {
      useAuthStore.getState().setUser(dummyUser);
      useAuthStore.getState().setPermissions(["admin.all"]);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.permissions).toEqual([]);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("Negative Scenarios (Unhappy Path & Boundary)", () => {
    it("[NEG-01] setUser(null) secara eksplisit harus menonaktifkan isAuthenticated", () => {
      useAuthStore.getState().setUser(dummyUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("[NEG-02] setPermissions dengan array kosong harus berjalan stabil tanpa merusak state lain", () => {
      useAuthStore.getState().setUser(dummyUser);
      useAuthStore.getState().setPermissions([]);

      const state = useAuthStore.getState();
      expect(state.permissions).toEqual([]);
      expect(state.user).toEqual(dummyUser);
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
