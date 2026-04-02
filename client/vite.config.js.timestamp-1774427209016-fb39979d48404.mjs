// vite.config.js
import { defineConfig } from "file:///C:/Users/abash/Desktop/_/PROJECTS/Tailor/client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/abash/Desktop/_/PROJECTS/Tailor/client/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/abash/Desktop/_/PROJECTS/Tailor/client/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons.svg", "logo.png"],
      manifest: {
        name: "TailleurPro",
        short_name: "TailleurPro",
        description: "Gestion professionnelle de tailleurs",
        theme_color: "#1a1a2e",
        background_color: "#0f0f1a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "logo.png", sizes: "192x192", type: "image/png" },
          { src: "logo.png", sizes: "512x512", type: "image/png" },
          { src: "logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      injectManifest: {
        injectionPoint: null
        // Ignore precaching warnings for now, focus on push
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  resolve: {
    alias: { "@": "/src" }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhYmFzaFxcXFxEZXNrdG9wXFxcXF9cXFxcUFJPSkVDVFNcXFxcVGFpbG9yXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYWJhc2hcXFxcRGVza3RvcFxcXFxfXFxcXFBST0pFQ1RTXFxcXFRhaWxvclxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FiYXNoL0Rlc2t0b3AvXy9QUk9KRUNUUy9UYWlsb3IvY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQSh7XHJcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uc3ZnJywgJ2ljb25zLnN2ZycsICdsb2dvLnBuZyddLFxyXG4gICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgIG5hbWU6ICdUYWlsbGV1clBybycsXHJcbiAgICAgICAgc2hvcnRfbmFtZTogJ1RhaWxsZXVyUHJvJyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ0dlc3Rpb24gcHJvZmVzc2lvbm5lbGxlIGRlIHRhaWxsZXVycycsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMWExYTJlJyxcclxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnIzBmMGYxYScsXHJcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxyXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7IHNyYzogJ2xvZ28ucG5nJywgc2l6ZXM6ICcxOTJ4MTkyJywgdHlwZTogJ2ltYWdlL3BuZycgfSxcclxuICAgICAgICAgIHsgc3JjOiAnbG9nby5wbmcnLCBzaXplczogJzUxMng1MTInLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxyXG4gICAgICAgICAgeyBzcmM6ICdsb2dvLnBuZycsIHNpemVzOiAnNTEyeDUxMicsIHR5cGU6ICdpbWFnZS9wbmcnLCBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICBzdHJhdGVnaWVzOiAnaW5qZWN0TWFuaWZlc3QnLFxyXG4gICAgICBzcmNEaXI6ICdwdWJsaWMnLFxyXG4gICAgICBmaWxlbmFtZTogJ3N3LmpzJyxcclxuICAgICAgaW5qZWN0TWFuaWZlc3Q6IHtcclxuICAgICAgICBpbmplY3Rpb25Qb2ludDogbnVsbCwgLy8gSWdub3JlIHByZWNhY2hpbmcgd2FybmluZ3MgZm9yIG5vdywgZm9jdXMgb24gcHVzaFxyXG4gICAgICB9LFxyXG4gICAgICBkZXZPcHRpb25zOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICB0eXBlOiAnbW9kdWxlJyxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHsgJ0AnOiAnL3NyYycgfSxcclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStVLFNBQVMsb0JBQW9CO0FBQzVXLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsYUFBYSxVQUFVO0FBQUEsTUFDdEQsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ0wsRUFBRSxLQUFLLFlBQVksT0FBTyxXQUFXLE1BQU0sWUFBWTtBQUFBLFVBQ3ZELEVBQUUsS0FBSyxZQUFZLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUN2RCxFQUFFLEtBQUssWUFBWSxPQUFPLFdBQVcsTUFBTSxhQUFhLFNBQVMsZUFBZTtBQUFBLFFBQ2xGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsWUFBWTtBQUFBLE1BQ1osUUFBUTtBQUFBLE1BQ1IsVUFBVTtBQUFBLE1BQ1YsZ0JBQWdCO0FBQUEsUUFDZCxnQkFBZ0I7QUFBQTtBQUFBLE1BQ2xCO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsUUFDVCxNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
