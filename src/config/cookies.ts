import CookiesLib from "js-cookie";

export type CookieAttributes = NonNullable<Parameters<typeof CookiesLib.set>[2]>;

/**
 * Cookie Manager Wrapper (Hybrid Synthesis)
 *
 * Mengenkapsulasi akses js-cookie dengan:
 * 1. Prefix otomatis: `{env}_{project}_{name}` dengan default fallback yang aman dan idempotent.
 * 2. Type-safe Generics: Serialisasi & parsing JSON otomatis untuk objek/data kompleks,
 *    namun tetap mempertahankan raw string untuk token auth tanpa tanda kutip ganda.
 * 3. Default keamanan bawaan: `path: "/"`, `sameSite: "Lax"`, dan flag `secure` (HTTPS).
 * 4. Bulk deletion: Menghapus banyak cookie sekaligus dengan passing `Array<string>`.
 * 5. Metode helper autentikasi terisolasi untuk token dan refresh token.
 */

const ENV = import.meta.env.VITE_APP_ENVIRONMENT || "dev";
const PROJECT = import.meta.env.VITE_PROJECT_NAME || "app";

export const getCookieName = (name: string): string => {
  const prefix = `${ENV}_${PROJECT}_`;
  return name.startsWith(prefix) ? name : `${prefix}${name}`;
};

export const TOKEN_KEY = getCookieName("token");
export const REFRESH_TOKEN_KEY = getCookieName("refresh_token");

export const Cookies = {
  getCookieName,

  get<T = string>(name: string): T | undefined {
    const raw = CookiesLib.get(getCookieName(name));
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  set<T = string>(name: string, value: T, options?: CookieAttributes): void {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    CookiesLib.set(getCookieName(name), serialized, {
      path: "/",
      sameSite: "Lax",
      secure: typeof window !== "undefined" && window.location.protocol === "https:",
      ...options,
    });
  },

  remove(name: string | Array<string>, options?: CookieAttributes): void {
    const keys = Array.isArray(name) ? name : [name];
    keys.forEach((key) => {
      CookiesLib.remove(getCookieName(key), {
        path: "/",
        ...options,
      });
    });
  },

  getAuthToken(): string | undefined {
    return this.get<string>("token");
  },

  setAuthToken(token: string, options?: CookieAttributes): void {
    this.set("token", token, options);
  },

  removeAuthToken(): void {
    this.remove("token");
  },

  getRefreshToken(): string | undefined {
    return this.get<string>("refresh_token");
  },

  setRefreshToken(refreshToken: string, options?: CookieAttributes): void {
    this.set("refresh_token", refreshToken, options);
  },

  removeRefreshToken(): void {
    this.remove("refresh_token");
  },

  clearAllAuth(): void {
    this.remove(["token", "refresh_token"]);
  },
};

export default Cookies;
