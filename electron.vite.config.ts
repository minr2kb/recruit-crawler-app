import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    server: {
      port: 3003
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    server: {
      port: 3003
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    server: {
      port: 3003
    }
  }
})
