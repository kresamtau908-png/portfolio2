import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 他アプリで開いていたりクラウド同期中だとファイルロックでウォッチャーが
    // クラッシュすることがあるため、ソースに関係ないPDFは監視対象から外す
    watch: {
      ignored: ['**/*.pdf'],
    },
  },
})
