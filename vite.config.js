// Importamos nuestro plugin de Vite para Vue.
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Cargar variables de entorno basadas en el modo
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [vue()],
        // Configuración para variables de entorno
        envDir: '.',
        envPrefix: 'VITE_'
    }
});