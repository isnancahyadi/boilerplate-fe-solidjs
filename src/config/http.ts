import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { Cookies } from "~/config/cookies";
import { API_CORE } from "~/config/prefix";

/**
 * Respon kontrak refresh token sesuai API.md §2.1
 */
export interface RefreshTokenResponse {
  token: string;
  refresh_token?: string;
  exp?: string;
  exp_in?: number;
  exp_refresh_token?: string;
  token_type?: string;
}

/**
 * Mengonversi string tanggal dari respon API menjadi objek Date yang valid.
 * Mengembalikan undefined jika string kosong atau tidak dapat di-parse (mencegah NaN/crash).
 */
export const parseExpiryDate = (dateStr?: string): Date | undefined => {
  if (!dateStr) return undefined;
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

/**
 * HTTP Client Singleton
 *
 * Mengenkapsulasi instance Axios dengan interceptor:
 * 1. Request: Otomatis menyertakan `Authorization: Bearer <token>` dari cookie aktif.
 * 2. Response: Auto-refresh token saat HTTP 401 via `axios-auth-refresh` dengan deduplikasi.
 */
export class Http {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "/",
      timeout: 30000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // 1. Request Interceptor: Inject Token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    // 2. Response Interceptor: Refresh Token on 401
    const refreshAuthLogic = async (failedRequest: AxiosError) => {
      const refreshToken = Cookies.getRefreshToken();
      if (!refreshToken) {
        this.handleAuthFailure();
        return Promise.reject(failedRequest);
      }

      try {
        // Menggunakan instance axios polos untuk mencegah infinite loop jika endpoint refresh merespons 401
        const response = await axios.post<RefreshTokenResponse>(
          `${import.meta.env.VITE_API_URL || ""}${API_CORE}/auth/refresh-token`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const newAccessToken = response.data?.token;
        const newRefreshToken = response.data?.refresh_token;

        if (newAccessToken) {
          const accessExpires = parseExpiryDate(response.data?.exp);
          const refreshExpires = parseExpiryDate(response.data?.exp_refresh_token);

          Cookies.setAuthToken(newAccessToken, accessExpires ? { expires: accessExpires } : undefined);

          if (newRefreshToken) {
            Cookies.setRefreshToken(newRefreshToken, refreshExpires ? { expires: refreshExpires } : undefined);
          }

          if (failedRequest.response?.config.headers) {
            failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          if (failedRequest.config?.headers) {
            failedRequest.config.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          return Promise.resolve();
        }

        this.handleAuthFailure();
        return Promise.reject(failedRequest);
      } catch (err) {
        this.handleAuthFailure();
        return Promise.reject(err);
      }
    };

    createAuthRefreshInterceptor(this.client, refreshAuthLogic, {
      statusCodes: [401],
      deduplicateRefresh: true,
    });
  }

  public handleAuthFailure(): void {
    Cookies.clearAllAuth();
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
      } catch {
        // Mengabaikan error jika localStorage dibatasi browser policy
      }

      if (!window.location.pathname.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
    }
  }

  public request<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const http = new Http();
