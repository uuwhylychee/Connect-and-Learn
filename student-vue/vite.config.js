import { defineConfig } from "vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL)
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  server: {
    //本地服务
    port: 8888, //端口号
    open: true, //启动时是否自动打开
    proxy: {
      '/api': {
        target: "http://2804r793q9.zicp.vip", //目标域名
        changeOrigin: true, //需要代理跨域
        rewrite: (path) => path.replace(/^\/api/, ''), //路径重写，把'/api'替换为''
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
