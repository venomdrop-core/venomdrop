import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), react()],
  // optimizeDeps: {
  //   exclude: ['nekoton-wasm']
  // }
})
