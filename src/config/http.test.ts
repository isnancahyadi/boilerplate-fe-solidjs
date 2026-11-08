import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Cookies } from "~/config/cookies";
import { API_CORE } from "~/config/prefix";

import { Http, parseExpiryDate, type RefreshTokenResponse } from "./http";

// Mock axios-auth-refresh untuk memverifikasi pendaftaran interceptor dan menguji auth refresh logic secara terisolasi
vi.mock("axios-auth-refresh", () => {
  return {
    default: vi.fn(),
  };
});

describe("HTTP Client Config & Interceptors (Hybrid Synthesis)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("parseExpiryDate Helper", () => {
    it("(Positif) harus mem-parse string tanggal ISO valid ke objek Date yang sesuai", () => {
      const isoString = "2026-12-31T23:59:59.000Z";
      const result = parseExpiryDate(isoString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe(isoString);
    });

    it("(Positif) harus mem-parse tanggal dengan timezone offset", () => {
      const dateWithTz = "2026-11-04 12:00:00+07:00";
      const result = parseExpiryDate(dateWithTz);

      expect(result).toBeInstanceOf(Date);
      expect(result && !Number.isNaN(result.getTime())).toBe(true);
    });

    it("(Negatif) harus mengembalikan undefined jika parameter kosong atau undefined", () => {
      expect(parseExpiryDate(undefined)).toBeUndefined();
      expect(parseExpiryDate("")).toBeUndefined();
    });

    it("(Negatif / Boundary) harus mengembalikan undefined jika format tanggal invalid tanpa melempar error", () => {
      expect(parseExpiryDate("invalid-date-string")).toBeUndefined();
      expect(parseExpiryDate("2026-99-99 99:99:99")).toBeUndefined();
    });
  });

  describe("HTTP Wrapper Methods & Request Execution", () => {
    it("(Positif) get, post, put, patch, delete, dan request harus memanggil client instance", async () => {
      const customHttp = new Http();

      const mockResponse = { data: { success: true }, status: 200 };
      const getSpy = vi.spyOn(customHttp.client, "get").mockResolvedValue(mockResponse as never);
      const postSpy = vi.spyOn(customHttp.client, "post").mockResolvedValue(mockResponse as never);
      const putSpy = vi.spyOn(customHttp.client, "put").mockResolvedValue(mockResponse as never);
      const patchSpy = vi.spyOn(customHttp.client, "patch").mockResolvedValue(mockResponse as never);
      const deleteSpy = vi.spyOn(customHttp.client, "delete").mockResolvedValue(mockResponse as never);
      const requestSpy = vi.spyOn(customHttp.client, "request").mockResolvedValue(mockResponse as never);

      await customHttp.get("/test-get", { params: { q: 1 } });
      expect(getSpy).toHaveBeenCalledWith("/test-get", { params: { q: 1 } });

      await customHttp.post("/test-post", { name: "test" });
      expect(postSpy).toHaveBeenCalledWith("/test-post", { name: "test" }, undefined);

      await customHttp.put("/test-put", { name: "update" });
      expect(putSpy).toHaveBeenCalledWith("/test-put", { name: "update" }, undefined);

      await customHttp.patch("/test-patch", { active: true });
      expect(patchSpy).toHaveBeenCalledWith("/test-patch", { active: true }, undefined);

      await customHttp.delete("/test-delete");
      expect(deleteSpy).toHaveBeenCalledWith("/test-delete", undefined);

      await customHttp.request({ url: "/test-request", method: "OPTIONS" });
      expect(requestSpy).toHaveBeenCalledWith({ url: "/test-request", method: "OPTIONS" });
    });
  });

  describe("Token Injection Interceptor", () => {
    it("(Positif) harus menyertakan header Authorization Bearer ketika token aktif tersedia", async () => {
      const customHttp = new Http();
      vi.spyOn(Cookies, "getAuthToken").mockReturnValue("active-jwt-token");

      // Cari handler interceptor request
      const requestInterceptorHandlers = (
        customHttp.client.interceptors.request as unknown as {
          handlers: Array<{ fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }>;
        }
      ).handlers;

      expect(requestInterceptorHandlers.length).toBeGreaterThan(0);
      const requestInterceptor = requestInterceptorHandlers[0].fulfilled;

      const mockConfig = {
        headers: {
          Accept: "application/json",
        },
      } as unknown as InternalAxiosRequestConfig;

      const modifiedConfig = await requestInterceptor(mockConfig);
      expect(modifiedConfig.headers.Authorization).toBe("Bearer active-jwt-token");
    });

    it("(Negatif) tidak boleh menambahkan header Authorization jika Cookies.getAuthToken mengembalikan undefined", async () => {
      const customHttp = new Http();
      vi.spyOn(Cookies, "getAuthToken").mockReturnValue(undefined);

      const requestInterceptorHandlers = (
        customHttp.client.interceptors.request as unknown as {
          handlers: Array<{ fulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }>;
        }
      ).handlers;

      const requestInterceptor = requestInterceptorHandlers[0].fulfilled;

      const mockConfig = {
        headers: {},
      } as unknown as InternalAxiosRequestConfig;

      const modifiedConfig = await requestInterceptor(mockConfig);
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });

    it("(Negatif) harus meneruskan rejection error jika terjadi kesalahan request", async () => {
      const customHttp = new Http();
      const requestInterceptorHandlers = (
        customHttp.client.interceptors.request as unknown as {
          handlers: Array<{ rejected: (error: AxiosError) => Promise<never> }>;
        }
      ).handlers;

      const errorHandler = requestInterceptorHandlers[0].rejected;
      const dummyError = new Error("Request error") as AxiosError;

      await expect(errorHandler(dummyError)).rejects.toThrow("Request error");
    });
  });

  describe("Auto-Refresh Token Interceptor (401 Handling & Deduplication)", () => {
    it("(Positif) deduplicateRefresh: true dan statusCodes [401] harus dikonfigurasi pada createAuthRefreshInterceptor", () => {
      new Http();

      expect(createAuthRefreshInterceptor).toHaveBeenCalledWith(
        expect.anything(),
        expect.any(Function),
        expect.objectContaining({
          statusCodes: [401],
          deduplicateRefresh: true,
        }),
      );
    });

    it("(Positif) alur sukses: harus memperbarui token & refresh token di cookie beserta expires date dan menginjeksi token baru ke request", async () => {
      new Http();

      const lastCall = vi.mocked(createAuthRefreshInterceptor).mock.calls.at(-1);
      const refreshAuthLogic = lastCall?.[1] as (failedRequest: AxiosError) => Promise<void>;
      expect(refreshAuthLogic).toBeDefined();

      vi.spyOn(Cookies, "getRefreshToken").mockReturnValue("current-refresh-token");
      const setAuthTokenSpy = vi.spyOn(Cookies, "setAuthToken").mockImplementation(() => {});
      const setRefreshTokenSpy = vi.spyOn(Cookies, "setRefreshToken").mockImplementation(() => {});

      const refreshResponseData: RefreshTokenResponse = {
        token: "new-access-token-999",
        refresh_token: "new-refresh-token-888",
        exp: "2026-11-04T15:00:00.000Z",
        exp_refresh_token: "2026-11-05T15:00:00.000Z",
      };

      const axiosPostSpy = vi.spyOn(axios, "post").mockResolvedValue({
        data: refreshResponseData,
        status: 200,
      });

      const failedRequest = {
        config: { headers: {} },
        response: { config: { headers: {} } },
      } as unknown as AxiosError;

      await refreshAuthLogic(failedRequest);

      // Verifikasi axios mentah dipanggil dengan endpoint API_CORE
      expect(axiosPostSpy).toHaveBeenCalledWith(
        expect.stringContaining(`${API_CORE}/auth/refresh-token`),
        { refresh_token: "current-refresh-token" },
        { headers: { "Content-Type": "application/json" } },
      );

      // Verifikasi cookie diperbarui dengan tanggal kedaluwarsa
      expect(setAuthTokenSpy).toHaveBeenCalledWith(
        "new-access-token-999",
        expect.objectContaining({
          expires: new Date("2026-11-04T15:00:00.000Z"),
        }),
      );

      expect(setRefreshTokenSpy).toHaveBeenCalledWith(
        "new-refresh-token-888",
        expect.objectContaining({
          expires: new Date("2026-11-05T15:00:00.000Z"),
        }),
      );

      // Verifikasi header failedRequest diperbarui untuk retry
      expect(failedRequest.response?.config.headers.Authorization).toBe("Bearer new-access-token-999");
      expect(failedRequest.config?.headers.Authorization).toBe("Bearer new-access-token-999");
    });

    it("(Negatif) jika tidak ada refresh_token di Cookies, harus memanggil handleAuthFailure dan me-reject failedRequest", async () => {
      const _customHttp = new Http();
      const lastCall = vi.mocked(createAuthRefreshInterceptor).mock.calls.at(-1);
      const refreshAuthLogic = lastCall?.[1] as (failedRequest: AxiosError) => Promise<void>;

      vi.spyOn(Cookies, "getRefreshToken").mockReturnValue(undefined);
      const handleAuthFailureSpy = vi.spyOn(Http.prototype, "handleAuthFailure").mockImplementation(() => {});
      const axiosPostSpy = vi.spyOn(axios, "post");

      const failedRequest = new Error("Unauthorized 401") as AxiosError;

      await expect(refreshAuthLogic(failedRequest)).rejects.toThrow("Unauthorized 401");
      expect(handleAuthFailureSpy).toHaveBeenCalled();
      expect(axiosPostSpy).not.toHaveBeenCalled();
    });

    it("(Negatif) jika API refresh gagal (misal 401 / 500), harus memanggil handleAuthFailure dan me-reject error", async () => {
      new Http();
      const lastCall = vi.mocked(createAuthRefreshInterceptor).mock.calls.at(-1);
      const refreshAuthLogic = lastCall?.[1] as (failedRequest: AxiosError) => Promise<void>;

      vi.spyOn(Cookies, "getRefreshToken").mockReturnValue("current-refresh-token");
      const handleAuthFailureSpy = vi.spyOn(Http.prototype, "handleAuthFailure").mockImplementation(() => {});

      vi.spyOn(axios, "post").mockRejectedValue(new Error("Refresh Token Expired 401"));

      const failedRequest = new Error("Initial 401") as AxiosError;

      await expect(refreshAuthLogic(failedRequest)).rejects.toThrow("Refresh Token Expired 401");
      expect(handleAuthFailureSpy).toHaveBeenCalled();
    });

    it("(Negatif) jika respon refresh 200 tetapi data tidak memuat token baru, harus memanggil handleAuthFailure", async () => {
      new Http();
      const lastCall = vi.mocked(createAuthRefreshInterceptor).mock.calls.at(-1);
      const refreshAuthLogic = lastCall?.[1] as (failedRequest: AxiosError) => Promise<void>;

      vi.spyOn(Cookies, "getRefreshToken").mockReturnValue("current-refresh-token");
      const handleAuthFailureSpy = vi.spyOn(Http.prototype, "handleAuthFailure").mockImplementation(() => {});

      vi.spyOn(axios, "post").mockResolvedValue({
        data: {}, // Tanpa token
        status: 200,
      });

      const failedRequest = new Error("Initial 401") as AxiosError;

      await expect(refreshAuthLogic(failedRequest)).rejects.toThrow("Initial 401");
      expect(handleAuthFailureSpy).toHaveBeenCalled();
    });

    it("(Negatif / Boundary) jika respon exp invalid/hilang, token tetap disimpan dengan expires: undefined", async () => {
      new Http();
      const lastCall = vi.mocked(createAuthRefreshInterceptor).mock.calls.at(-1);
      const refreshAuthLogic = lastCall?.[1] as (failedRequest: AxiosError) => Promise<void>;

      vi.spyOn(Cookies, "getRefreshToken").mockReturnValue("current-refresh-token");
      const setAuthTokenSpy = vi.spyOn(Cookies, "setAuthToken").mockImplementation(() => {});

      vi.spyOn(axios, "post").mockResolvedValue({
        data: {
          token: "valid-token",
          exp: "not-a-valid-date",
        },
        status: 200,
      });

      const failedRequest = {
        config: { headers: {} },
        response: { config: { headers: {} } },
      } as unknown as AxiosError;

      await refreshAuthLogic(failedRequest);

      expect(setAuthTokenSpy).toHaveBeenCalledWith("valid-token", undefined);
    });
  });

  describe("handleAuthFailure & SSR / Route Safety", () => {
    it("(Positif) harus membersihkan Cookies.clearAllAuth dan localStorage.clear", () => {
      const customHttp = new Http();
      const clearAllAuthSpy = vi.spyOn(Cookies, "clearAllAuth").mockImplementation(() => {});
      const localStorageClearSpy = vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});

      customHttp.handleAuthFailure();

      expect(clearAllAuthSpy).toHaveBeenCalled();
      expect(localStorageClearSpy).toHaveBeenCalled();
    });

    it("(Positif) harus me-redirect ke /auth/login jika pathname bukan rute auth", () => {
      const customHttp = new Http();
      vi.spyOn(Cookies, "clearAllAuth").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});

      // Simulasikan berada di rute app privat
      window.location.pathname = "/app/dashboard";

      customHttp.handleAuthFailure();

      expect(window.location.pathname).toBe("/auth/login");
    });

    it("(Negatif / Boundary) tidak boleh me-redirect jika pengguna sudah berada di rute /auth/* (mencegah loop)", () => {
      const customHttp = new Http();
      vi.spyOn(Cookies, "clearAllAuth").mockImplementation(() => {});
      vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {});

      // Simulasikan pengguna sudah di halaman login
      window.location.pathname = "/auth/login";
      window.location.href = "http://localhost/auth/login";

      customHttp.handleAuthFailure();

      // window.location.href tidak boleh diubah ke rute lain
      expect(window.location.href).toBe("http://localhost/auth/login");
    });
  });
});
