// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />
interface Window {
  api: {
    getAppVersion: () => Promise<string>
  }
}
