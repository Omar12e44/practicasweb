// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  server: {
    // Elimina 'historyApiFallback', ya que no es necesario en Vite
  },
  base: "/", // Si está en la raíz de tu dominio, usa '/'
  // Si tu app está en un subdirectorio, usa: base: '/mi-app/'
});
