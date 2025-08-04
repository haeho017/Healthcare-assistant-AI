/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // 다른 환경변수도 여기에 추가 가능
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
