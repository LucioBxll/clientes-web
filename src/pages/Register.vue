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
        const aceptarTerminos = ref(false);

        const formularioValido = computed(() => {
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regexCorreo.test(correo.value) && 
                   contrasena.value.length >= 6 && 
                   nombreUsuario.value.length >= 3 &&
                   aceptarTerminos.value;
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
            cambiarAvatar,
            aceptarTerminos
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
            class="max-w-md mx-auto p-8 bg-white dark:bg-neutral-900 rounded-xl shadow border border-emerald-100 dark:border-gray-700"
        >
            <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
            <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
            <div class="mb-6">
                <BaseInput
                    type="text"
                    :placeholder="'Nombre de usuario'"
                    v-model="nombreUsuario"
                    :disabled="cargando"
                    inputClass="w-full p-3 mb-4 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 placeholder-gray-400 transition"
                />
            </div>
            <div class="mb-6">
                <BaseInput
                    type="email"
                    :placeholder="'Correo electrónico'"
                    v-model="correo"
                    :disabled="cargando"
                    inputClass="w-full p-3 mb-4 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 placeholder-gray-400 transition"
                />
            </div>
            <div class="mb-6">
                <BaseInput
                    type="password"
                    :placeholder="'Contraseña'"
                    v-model="contrasena"
                    :disabled="cargando"
                    inputClass="w-full p-3 mb-4 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 placeholder-gray-400 transition"
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
                    class="block w-full text-sm text-black dark:text-white file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-neutral-900 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-800"
                >
            </div>
            <div class="mb-6">
                <label class="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm select-none">
                  <input type="checkbox" v-model="aceptarTerminos" :disabled="cargando" required class="accent-emerald-600 w-4 h-4 rounded" />
                  Acepto los <router-link to="/terminos" class="text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors" target="_blank">Términos y Condiciones</router-link>
                </label>
            </div>
            <BaseButton 
                type="submit"
                :disabled="!formularioValido || cargando"
                buttonClass="w-full p-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </BaseButton>
        </form>
    </div>
</template>