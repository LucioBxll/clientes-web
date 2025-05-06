<script>
import MainH1 from '../components/MainH1.vue';
import { register } from '../services/auth';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Registro',
    components: { MainH1 },
    setup() {
        const enrutador = useRouter();
        const correo = ref('');
        const contrasena = ref('');
        const nombreUsuario = ref('');
        const archivoAvatar = ref(null);
        const mensajeError = ref('');
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
                return;
            }

            mensajeError.value = '';
            cargando.value = true;

            try {
                await register(correo.value, contrasena.value, nombreUsuario.value, archivoAvatar.value);
                exito.value = true;
                correo.value = '';
                contrasena.value = '';
                nombreUsuario.value = '';
                archivoAvatar.value = null;
                setTimeout(() => {
                    enrutador.push('/ingresar');
                }, 2000);
            } catch (err) {
                mensajeError.value = err.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.';
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
    <div class="w-full bg-blue-50 dark:bg-gray-900 py-8">
        <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white text-center">Crear una nueva cuenta</MainH1>

        <form 
            action="#"
            @submit.prevent="enviarFormulario"
            class="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200"
        >
            <div class="mb-6">
                <input
                    type="text"
                    id="nombreUsuario"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="nombreUsuario"
                    required
                    placeholder="Nombre de usuario"
                    :disabled="cargando"
                >
            </div>
            <div class="mb-6">
                <input
                    type="email"
                    id="correo"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="correo"
                    required
                    placeholder="Correo electrónico"
                    :disabled="cargando"
                >
            </div>
            <div class="mb-6">
                <input
                    type="password"
                    id="contrasena"
                    class="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-200"
                    v-model="contrasena"
                    required
                    minlength="6"
                    placeholder="Contraseña"
                    :disabled="cargando"
                >
            </div>
            <div class="mb-6">
                <label for="avatar" class="block mb-2 text-gray-700 dark:text-gray-200 font-medium">Imagen de perfil (opcional)</label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    @change="cambiarAvatar"
                    :disabled="cargando"
                    class="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
            </div>
            <div v-if="mensajeError" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-red-600 dark:text-red-400 text-sm">{{ mensajeError }}</p>
            </div>
            <div v-if="exito" class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
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
                :disabled="!formularioValido || cargando"
            >
                {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
        </form>
    </div>
</template>