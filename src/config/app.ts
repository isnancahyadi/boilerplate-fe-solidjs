/**
 * App Configuration & Feature Flags
 *
 * Mengelola metadata aplikasi dan status aktifasi modul berbasis environment variables.
 */

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "SolidStart App",
  PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME || "boilerplate",
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || "dev",
  API_URL: import.meta.env.VITE_API_URL || "/",
} as const;

export const MODULE_ACTIVE_CONFIG = {
  DASHBOARD: {
    IS_ACTIVE: import.meta.env.VITE_ENABLE_MODULE_DASHBOARD !== "false",
    ROUTE: "/app/dashboard",
  },
  USER_MANAGEMENT: {
    IS_ACTIVE: import.meta.env.VITE_ENABLE_MODULE_USER_MANAGEMENT !== "false",
    ROUTE: "/app/user-management",
  },
  SAMPLE: {
    IS_ACTIVE: import.meta.env.VITE_ENABLE_MODULE_SAMPLE !== "false",
    ROUTE: "/app/sample",
  },
} as const;
