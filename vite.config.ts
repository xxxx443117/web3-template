import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VantResolver } from "@vant/auto-import-resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

/// <reference types="vitest" />
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envs = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      vue(),
      tailwindcss(),
      Components({
        dts: true,
        resolvers: [VantResolver()],
      }),
      // SVG 图标插件配置
      createSvgIconsPlugin({
        // 指定 SVG 图标文件夹路径
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定 symbolId 格式
        symbolId: "icon-[name]",
      }),
      AutoImport({
        resolvers: [VantResolver()],
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // tofix: https://github.com/reown-com/appkit/issues/3926
    define: {
      "process.env": {}, // Prevents errors related to `process.env`
    },

    server: {
      host: "0.0.0.0",
      port: 5234,
      proxy: {
        "/api": {
          target: envs.VITE_BASE_API_URL,
          changeOrigin: true,
          // rewrite: (p: string) => p.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: envs.VITE_BASE_MODE === "PROD",
          drop_debugger: envs.VITE_BASE_MODE === "PROD",
        },
      },
    },

    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
