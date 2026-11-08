saya memiliki referensi lain untuk config http axios seperti dibawah ini.

import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import dayjs from "dayjs";
import { type InferInput, object, required, string } from "valibot";

import type { AuthType } from "~/features/auth/types";

import cookie from "./cookies";
import { API_CORE } from "./prefix";

const RefreshTokenSchema = required(
object({
refresh_token: string(),
}),
["refresh_token"],
);

export type RefreshTokenInput = InferInput<typeof RefreshTokenSchema>;

const headers: Readonly<Record<string, string | boolean>> = {
Accept: "application/json",
"Content-Type": "application/json; charset=utf-8",
};

const injectToken = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
try {
const token = cookie.getCookie("token") ?? null;

    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

} catch (error) {
throw new Error(String(error));
}
};

class Http {
private instance: AxiosInstance | null = null;

initHttp() {
const http = axios.create({
baseURL: import.meta.env.VITE_API_URL,
headers,
// timeout: 20000,
});

    async function refreshAuthLogic(failedRefresh: AxiosResponse) {
      if (failedRefresh.status === 401) {
        const refreshToken = cookie.getCookie("refresh_token");

        return http
          .post<RefreshTokenInput, AxiosResponse<AuthType>>(`${API_CORE}/auth/refresh-token`, {
            refresh_token: refreshToken,
          })
          .then((response) => {
            const newAccessToken = response.data?.token;
            const newRefreshToken = response?.data?.refresh_token;

            cookie.setCookie("token", newAccessToken, {
              expires: dayjs(response?.data?.exp, "YYYY-MM-DD HH:mm:ssZZ").tz(dayjs.tz.guess()).local().toDate(),
              secure: import.meta.env.PROD ?? false,
            });

            cookie.setCookie("refresh_token", newRefreshToken, {
              expires: dayjs(response?.data?.exp_refresh_token, "YYYY-MM-DD HH:mm:ssZZ")
                .tz(dayjs.tz.guess())
                .local()
                .toDate(),
              secure: import.meta.env.PROD ?? false,
            });

            return Promise.resolve();
          })
          .catch(() => {
            cookie.deleteCookie(["token", "refresh_token"]);
            if (typeof window !== "undefined") {
              localStorage.clear();
              window.location.href = "/auth/request-login";
            }
          });
      }
    }

    http.interceptors.request.use(injectToken, (error) => Promise.reject(error));

    createAuthRefreshInterceptor(http, refreshAuthLogic);

    http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error),
    );

    this.instance = http;
    return http;

}

private get http(): AxiosInstance {
return this.instance != null ? this.instance : this.initHttp();
}

request<T, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
return this.http.request(config) as Promise<R>;
}

get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
return this.http.get<T, R>(url, config) as Promise<R>;
}

post<T, D, R = AxiosResponse<D>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
return this.http.post<T, R>(url, data, config) as Promise<R>;
}

put<T, D, R = AxiosResponse<D>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
return this.http.put<T, R>(url, data, config) as Promise<R>;
}

patch<T, R = AxiosResponse<T>>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
return this.http.patch<T, R>(url, data, config) as Promise<R>;
}

delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
return this.http.delete<T, R>(url, config) as Promise<R>;
}
}

export const http = new Http();

export interface ErrorType<Error> extends AxiosError<Error> {}

bandingkan dengan config http axios yang digunakan pada boilerplate ini @[src/config/http.ts]
