<script>
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import { ref, computed } from 'vue';

export default {
    name: 'Register',
    components: { MainH1 },
    setup() {
        const email = ref('');
        const password = ref('');
        const username = ref('');
        const error = ref('');
        const loading = ref(false);
        const success = ref(false);

        const isFormValid = computed(() => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email.value) && 
                   password.value.length >= 6 && 
                   username.value.length >= 3;
        });

        const handleSubmit = async () => {
            if (!isFormValid.value) {
                error.value = 'Por favor, completa todos los campos correctamente';
                return;
            }

            error.value = '';
            loading.value = true;

            try {
                await register(email.value, password.value, username.value);
                success.value = true;
                email.value = '';
                password.value = '';
                username.value = '';
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
            error,
            loading,
            success,
            isFormValid,
            handleSubmit
        }
    }
}
</script>

<template>
    <MainH1>Crear una nueva cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
        class="max-w-md mx-auto"
    >
        <div class="mb-4">
            <label for="username" class="block mb-2 text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
                type="text"
                id="username"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="username"
                required
                placeholder="Nombre de usuario"
                :disabled="loading"
            >
        </div>
        <div class="mb-4">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="email"
                required
                placeholder="ejemplo@correo.com"
                :disabled="loading"
            >
        </div>
        <div class="mb-4">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                v-model="password"
                required
                minlength="6"
                placeholder="Mínimo 6 caracteres"
                :disabled="loading"
            >
        </div>
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-green-600 text-sm">
                ¡Cuenta creada exitosamente! Por favor, verifica tu correo electrónico para activar tu cuenta.
            </p>
        </div>
        <button 
            type="submit" 
            class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="!isFormValid || loading"
        >
            {{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}
        </button>
    </form>
</template>