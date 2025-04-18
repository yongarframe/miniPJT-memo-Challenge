import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["some-broken-dep"],
  },
  server: {
    watch: {
      // 설정 파일 변경 시 전체 리로드 방지
      ignored: ["**/db.json"], // json-server의 db 파일 무시
    },
  },
});
