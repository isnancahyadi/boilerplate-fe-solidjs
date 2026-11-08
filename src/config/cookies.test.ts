import CookiesLib from "js-cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Cookies, getCookieName, REFRESH_TOKEN_KEY, TOKEN_KEY } from "./cookies";

describe("Cookies Config (Hybrid Synthesis)", () => {
  beforeEach(() => {
    // Bersihkan storage mock js-cookie sebelum setiap pengujian
    const allCookies = CookiesLib.get();
    for (const key of Object.keys(allCookies)) {
      CookiesLib.remove(key);
    }
    vi.restoreAllMocks();
  });

  describe("getCookieName & Key Generation", () => {
    it("(Positif) harus menghasilkan key ber-prefix secara konsisten", () => {
      const name = getCookieName("theme");
      expect(name).toContain("_theme");
      expect(TOKEN_KEY).toContain("_token");
      expect(REFRESH_TOKEN_KEY).toContain("_refresh_token");
    });

    it("(Positif) harus bersifat idempotent dan tidak melakukan double-prefixing", () => {
      const singlePrefixed = getCookieName("token");
      const doublePrefixed = getCookieName(singlePrefixed);
      expect(doublePrefixed).toBe(singlePrefixed);
    });
  });

  describe("String & Complex Data Storage (Generic <T>)", () => {
    it("(Positif) harus menyimpan dan membaca raw string tanpa tanda kutip ganda", () => {
      const rawToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      Cookies.set("auth_token", rawToken);

      // Verifikasi pembacaan lewat Cookies.get
      expect(Cookies.get("auth_token")).toBe(rawToken);

      // Verifikasi di level storage langsung js-cookie (tanpa serialized quotes)
      const directValue = CookiesLib.get(getCookieName("auth_token"));
      expect(directValue).toBe(rawToken);
    });

    it("(Positif) harus menyimpan dan mem-parse objek kompleks secara otomatis", () => {
      interface UserProfile {
        id: number;
        name: string;
        roles: Array<string>;
      }

      const profile: UserProfile = {
        id: 101,
        name: "Admin User",
        roles: ["ADMIN", "MANAGER"],
      };

      Cookies.set<UserProfile>("user_profile", profile);

      const retrieved = Cookies.get<UserProfile>("user_profile");
      expect(retrieved).toEqual(profile);
      expect(retrieved?.roles).toEqual(["ADMIN", "MANAGER"]);
    });

    it("(Negatif) harus mengembalikan undefined jika cookie tidak ditemukan", () => {
      const result = Cookies.get("non_existent_key");
      expect(result).toBeUndefined();
    });

    it("(Negatif / Boundary) harus fallback ke raw string jika nilai bukan format JSON yang valid", () => {
      // Simpan string non-JSON secara langsung via CookiesLib
      const malformedJson = "{not-a-valid-json";
      CookiesLib.set(getCookieName("malformed"), malformedJson);

      const result = Cookies.get("malformed");
      expect(result).toBe(malformedJson);
    });
  });

  describe("Bulk Deletion & Removal", () => {
    it("(Positif) harus menghapus single cookie menggunakan nama kunci", () => {
      Cookies.set("single_key", "value");
      expect(Cookies.get("single_key")).toBe("value");

      Cookies.remove("single_key");
      expect(Cookies.get("single_key")).toBeUndefined();
    });

    it("(Positif) harus menghapus beberapa cookie sekaligus dengan passing Array<string>", () => {
      Cookies.set("key_1", "val_1");
      Cookies.set("key_2", "val_2");
      Cookies.set("key_3", "val_3");

      Cookies.remove(["key_1", "key_2"]);

      expect(Cookies.get("key_1")).toBeUndefined();
      expect(Cookies.get("key_2")).toBeUndefined();
      expect(Cookies.get("key_3")).toBe("val_3");
    });

    it("(Negatif) menghapus key yang tidak ada tidak boleh melempar error", () => {
      expect(() => {
        Cookies.remove("non_existing");
        Cookies.remove(["non_existing_1", "non_existing_2"]);
      }).not.toThrow();
    });
  });

  describe("Authentication Domain Helpers", () => {
    it("(Positif) harus mengatur, mengambil, dan menghapus auth token & refresh token", () => {
      const accessToken = "access-token-123";
      const refreshToken = "refresh-token-456";

      Cookies.setAuthToken(accessToken);
      Cookies.setRefreshToken(refreshToken);

      expect(Cookies.getAuthToken()).toBe(accessToken);
      expect(Cookies.getRefreshToken()).toBe(refreshToken);

      Cookies.removeAuthToken();
      expect(Cookies.getAuthToken()).toBeUndefined();
      expect(Cookies.getRefreshToken()).toBe(refreshToken);

      Cookies.removeRefreshToken();
      expect(Cookies.getRefreshToken()).toBeUndefined();
    });

    it("(Positif) clearAllAuth harus membersihkan kedua token autentikasi sekaligus", () => {
      Cookies.setAuthToken("acc-tok");
      Cookies.setRefreshToken("ref-tok");

      Cookies.clearAllAuth();

      expect(Cookies.getAuthToken()).toBeUndefined();
      expect(Cookies.getRefreshToken()).toBeUndefined();
    });
  });
});
