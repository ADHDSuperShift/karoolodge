/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Environment variables will be added when new backend is implemented
  readonly VITE_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
