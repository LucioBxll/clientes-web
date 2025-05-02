<script>
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Register',
    components: { MainH1 },
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');
        const username = ref('');
        const avatarFile = ref(null);
        const error = ref('');
        const loading = ref(false);
        const success = ref(false);

        const isFormValid = computed(() => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.value) && 
                   password.value.length >= 6 && 
                   username.value.length >= 3;
        });

        const handleAvatarChange = (e) => {
            avatarFile.value = e.target.files[0];
        };

        const handleSubmit = async () => {
            if (!isFormValid.value) {
                error.value = 'Por favor, completa todos los campos correctamente';
                return;
            }

            error.value = '';
            loading.value = true;

            try {
                await register(email.value, password.value, username.value, avatarFile.value);
                success.value = true;
                email.value = '';
                password.value = '';
                username.value = '';
                avatarFile.value = null;
                setTimeout(() => {
                    router.push('/ingresar');
                }, 2000);
            } catch (err) {
                error.value = err.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.';
            } finally {
                loading.value = false;
            }
        };

        return {
            email,
            password,
            username,
            avatarFile,
            error,
            loading,
            success,
            isFormValid,
            handleSubmit,
            handleAvatarChange
        }
    }
}
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900 py-8">
        <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Crear una nueva cuenta</MainH1>

        <form 
            action="#"
            @submit.prevent="handleSubmit"
            class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200"
        >
            <div class="mb-6">
                <input
                    type="text"
                    id="username"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="username"
                    required
                    placeholder="Nombre de usuario"
                    :disabled="loading"
                >
            </div>
            <div class="mb-6">
                <input
                    type="email"
                    id="email"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="email"
                    required
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
                    v-model="password"
                    required
                    minlength="6"
                    placeholder="Contraseña"
                    :disabled="loading"
                >
            </div>
            <div class="mb-6">
                <label for="avatar" class="block mb-2 text-gray-700 dark:text-gray-200 font-medium">Imagen de perfil (opcional)</label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    @change="handleAvatarChange"
                    :disabled="loading"
                    class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
            </div>
            <div v-if="success" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-green-600 dark:text-green-400 text-sm">
                    ¡Cuenta creada exitosamente! Por favor, verifica tu correo electrónico para activar tu cuenta.
                </p>
            </div>
            <button 
                type="submit" 
                class="w-full p-3 rounded-lg bg-blue-600 dark:bg-blue-500 
                       hover:bg-blue-500 dark:hover:bg-blue-400 
                       focus:bg-blue-500 dark:focus:bg-blue-400 
                       active:bg-blue-700 dark:active:bg-blue-600 
                       text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isFormValid || loading"
            >
                {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
        </form>
    </div>
</template>