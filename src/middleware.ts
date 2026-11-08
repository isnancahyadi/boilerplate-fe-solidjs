import { createMiddleware } from "@solidjs/start/middleware";

/**
 * SolidStart SSR Middleware Guard
 *
 * Mengintersepsi setiap incoming HTTP request di server sebelum rendering dimulai:
 * 1. Jika pengguna belum memiliki token dan mengakses rute `/app/*`, redirect ke `/auth/login`.
 * 2. Jika pengguna sudah memiliki token dan mengakses rute `/auth/*`, redirect ke `/app/dashboard`.
 */

export default createMiddleware({
  onRequest: [
    async (event) => {
      const url = new URL(event.request.url);
      const pathname = url.pathname;

      const isAppRoute = pathname.startsWith("/app");
      const isAuthRoute = pathname.startsWith("/auth");

      const cookieHeader = event.request.headers.get("cookie") || "";
      const hasToken = cookieHeader.includes("_token=");

      if (isAppRoute && !hasToken) {
        return Response.redirect(new URL("/auth/login", event.request.url).toString(), 302);
      }

      if (isAuthRoute && hasToken && pathname !== "/auth/logout") {
        return Response.redirect(new URL("/app/dashboard", event.request.url).toString(), 302);
      }
    },
  ],
});
