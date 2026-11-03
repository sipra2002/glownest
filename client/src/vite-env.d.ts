/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SITE_NAME: string;
  readonly VITE_CURRENCY_SYMBOL: string;
  readonly VITE_CURRENCY_CODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

