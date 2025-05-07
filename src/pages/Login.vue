<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseSuccess from '../components/BaseSuccess.vue';

export default {
    name: 'IniciarSesion',
    components: { MainH1, BaseInput, BaseButton, BaseAlert, BaseSuccess },
    setup() {
        const enrutador = useRouter();
        return { enrutador };
    },
    data() {
        return {
            credenciales: {
                correo: '',
                contrasena: '',
            },
            cargando: false,
            mensajeError: null,
            mensajeSuccess: null
        }
    },
    methods: {
        async enviarFormulario() {
            try {
                this.cargando = true;
                this.mensajeError = null;
                this.mensajeSuccess = null;
                await login(this.credenciales.correo, this.credenciales.contrasena);
                this.cargando = false;
                this.mensajeSuccess = '¡Inicio de sesión exitoso! Redirigiendo...';
                setTimeout(() => {
                  this.mensajeSuccess = null;
                  this.enrutador.push('/perfil');
                }, 4000);
            } catch (error) {
                this.mensajeError = error.message || 'Error al iniciar sesión';
                setTimeout(() => { this.mensajeError = null; }, 4000);
                this.cargando = false;
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
            @submit.prevent="enviarFormulario"
            class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200"
        >
            <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
            <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
            <div class="mb-6">
                <BaseInput
                    type="email"
                    :placeholder="'Correo electrónico'"
                    v-model="credenciales.correo"
                    :disabled="cargando"
                    inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
            </div>
            <div class="mb-6">
                <BaseInput
                    type="password"
                    :placeholder="'Contraseña'"
                    v-model="credenciales.contrasena"
                    :disabled="cargando"
                    inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
            </div>
            <BaseButton 
                type="submit"
                :disabled="cargando"
                buttonClass="w-full p-3 rounded-lg bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 focus:bg-blue-500 dark:focus:bg-blue-400 active:bg-blue-700 dark:active:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ cargando ? 'Iniciando sesión...' : 'Ingresar' }}
            </BaseButton>
        </form>
    </div>
</template>