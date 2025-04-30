<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';

export default {
    name: 'Login',
    components: { MainH1 },
    setup() {
        const router = useRouter();
        return { router };
    },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
            error: null
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = true;
                this.error = null;
                const user = await login(this.user.email, this.user.password);
                this.loading = false;
                
                // Redirigir al perfil después del login exitoso
                this.router.push('/perfil');
            } catch (error) {
                this.error = error.message || 'Error al iniciar sesión';
                this.loading = false;
            }
        }
    }
}
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900 py-8">
        <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Ingresar a mi cuenta</MainH1>

        <form 
            action="#"
            @submit.prevent="handleSubmit"
            class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200"
        >
            <div class="mb-6">
                <input
                    type="email"
                    id="email"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="user.email"
                    placeholder="Email"
                    :disabled="loading"
                >
            </div>
            <div class="mb-6">
                <input
                    type="password"
                    id="password"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="user.password"
                    placeholder="Contraseña"
                    :disabled="loading"
                >
            </div>
            
            <!-- Mensaje de error -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
            </div>

            <button 
                type="submit" 
                class="w-full p-3 rounded-lg bg-blue-600 dark:bg-blue-500 
                       hover:bg-blue-500 dark:hover:bg-blue-400 
                       focus:bg-blue-500 dark:focus:bg-blue-400 
                       active:bg-blue-700 dark:active:bg-blue-600 
                       text-white transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="loading"
            >
                {{ loading ? 'Iniciando sesión...' : 'Ingresar' }}
            </button>
        </form>
    </div>
</template>