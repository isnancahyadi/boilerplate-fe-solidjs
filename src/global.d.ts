/// <reference types="@solidjs/start/env" />

interface ImportMetaEnv {
  readonly VITE_APP_ENVIRONMENT?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_PROJECT_NAME?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_ENABLE_MODULE_DASHBOARD?: string;
  readonly VITE_ENABLE_MODULE_USER_MANAGEMENT?: string;
  readonly VITE_ENABLE_MODULE_SAMPLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly dirname: string;
}
