<script>
import MainH1 from '../components/MainH1.vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseSuccess from '../components/BaseSuccess.vue';
import BaseLoader from '../components/BaseLoader.vue';

export default {
    name: 'IniciarSesion',
    components: { MainH1, BaseInput, BaseButton, BaseAlert, BaseSuccess, BaseLoader },
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
                const inicio = Date.now();
                await login(this.credenciales.correo, this.credenciales.contrasena);
                this.mensajeSuccess = '¡Inicio de sesión exitoso! Redirigiendo...';
                const duracion = Date.now() - inicio;
                const restante = 3000 - duracion;
                setTimeout(() => {
                  this.mensajeSuccess = null;
                  this.cargando = false;
                  this.enrutador.push('/perfil');
                }, restante > 0 ? restante : 0);
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
    <div class="w-full bg-esmerald-50 dark:bg-neutral-950 py-8">
        <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Ingresar a mi cuenta</MainH1>

        <div class="relative max-w-md mx-auto">
            <form 
                action="#"
                @submit.prevent="enviarFormulario"
                class="p-6 bg-emerald-200 dark:bg-emerald-400 rounded-lg shadow-sm transition-all duration-200"
            >
                <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
                <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
                <div class="mb-6">
                    <BaseInput
                        type="email"
                        :placeholder="'Correo electrónico'"
                        v-model="credenciales.correo"
                        :disabled="cargando"
                        inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                </div>
                <div class="mb-6">
                    <BaseInput
                        type="password"
                        :placeholder="'Contraseña'"
                        v-model="credenciales.contrasena"
                        :disabled="cargando"
                        inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                </div>
                <BaseButton 
                    type="submit"
                    :disabled="cargando"
                    buttonClass="w-full p-3 rounded-lg bg-gray-900 dark:bg-neutral-950 hover:bg-gray-900 dark:hover:bg-emerald-800 focus:bg-gray-900 dark:focus:bg-gray-900 active:bg-blue-700 dark:active:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {{ cargando ? 'Iniciando sesión...' : 'Ingresar' }}
                </BaseButton>
            </form>
            <div v-if="cargando" class="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-neutral-950/70 rounded-lg z-10">
                <BaseLoader />
            </div>
        </div>
    </div>
</template>