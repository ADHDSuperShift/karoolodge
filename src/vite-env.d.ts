/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COGNITO_USER_POOL_ID: string
  readonly VITE_COGNITO_CLIENT_ID: string
  readonly VITE_AUTH_ENDPOINT: string
  readonly VITE_UPLOAD_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
