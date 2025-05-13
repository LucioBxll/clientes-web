<script>
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseSuccess from '../components/BaseSuccess.vue';

export default {
    name: 'Registro',
    components: { MainH1, BaseInput, BaseButton, BaseAlert, BaseSuccess },
    setup() {
        const enrutador = useRouter();
        const correo = ref('');
        const contrasena = ref('');
        const nombreUsuario = ref('');
        const archivoAvatar = ref(null);
        const mensajeError = ref('');
        const mensajeSuccess = ref('');
        const cargando = ref(false);
        const exito = ref(false);

        const formularioValido = computed(() => {
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regexCorreo.test(correo.value) && 
                   contrasena.value.length >= 6 && 
                   nombreUsuario.value.length >= 3;
        });

        const cambiarAvatar = (e) => {
            archivoAvatar.value = e.target.files[0];
        };

        const enviarFormulario = async () => {
            if (!formularioValido.value) {
                mensajeError.value = 'Por favor, completa todos los campos correctamente';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
                return;
            }

            mensajeError.value = '';
            cargando.value = true;

            try {
                await register(correo.value, contrasena.value, nombreUsuario.value, archivoAvatar.value);
                exito.value = true;
                mensajeSuccess.value = '¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...';
                correo.value = '';
                contrasena.value = '';
                nombreUsuario.value = '';
                archivoAvatar.value = null;
                setTimeout(() => {
                    mensajeSuccess.value = '';
                    enrutador.push('/ingresar');
                }, 4000);
            } catch (err) {
                mensajeError.value = err.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                cargando.value = false;
            }
        };

        return {
            correo,
            contrasena,
            nombreUsuario,
            archivoAvatar,
            mensajeError,
            mensajeSuccess,
            cargando,
            exito,
            formularioValido,
            enviarFormulario,
            cambiarAvatar
        }
    }
}
</script>

<template>
    <div class="w-full bg-esmerald-50 dark:bg-neutral-950 py-8">
        <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Crear una nueva cuenta</MainH1>

        <form 
            action="#"
            @submit.prevent="enviarFormulario"
            class="max-w-md mx-auto p-6 bg-emerald-200 dark:bg-emerald-400 rounded-lg shadow-sm transition-all duration-200"
        >
            <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
            <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
            <div class="mb-6">
                <BaseInput
                    type="text"
                    :placeholder="'Nombre de usuario'"
                    v-model="nombreUsuario"
                    :disabled="cargando"
                    inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
            </div>
            <div class="mb-6">
                <BaseInput
                    type="email"
                    :placeholder="'Correo electrónico'"
                    v-model="correo"
                    :disabled="cargando"
                    inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
            </div>
            <div class="mb-6">
                <BaseInput
                    type="password"
                    :placeholder="'Contraseña'"
                    v-model="contrasena"
                    :disabled="cargando"
                    inputClass="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
            </div>
            <div class="mb-6">
                <label for="avatar" class="block mb-2 text-gray-700 dark:text-gray-200 font-medium">Imagen de perfil (opcional)</label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    @change="cambiarAvatar"
                    :disabled="cargando"
                    class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-emerald-200 dark:bg-neutral-900 text-gray-900 dark:text-white"
                >
            </div>
            <BaseButton 
                type="submit"
                :disabled="!formularioValido || cargando"
                buttonClass="w-full p-3 rounded-lg bg-gray-900 dark:bg-neutral-950 hover:bg-gray-900 dark:hover:bg-emerald-800 focus:bg-gray-900 dark:focus:bg-gray-900 active:bg-blue-700 dark:active:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </BaseButton>
        </form>
    </div>
</template>