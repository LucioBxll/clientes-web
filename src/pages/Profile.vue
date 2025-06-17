<template>
    <div class="w-full min-h-screen bg-white dark:bg-neutral-950">
        <div class="max-w-2xl mx-auto">
            <BaseLoader v-if="cargando" />
            <template v-else>
                <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
                <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
                <!-- Cabecera compacta con fondo verde -->
                <div class="relative flex items-end bg-emerald-600 dark:bg-emerald-700 h-32 rounded-b-xl px-4 pt-4 pb-1">
                    <!-- Foto de perfil grande y superpuesta -->
                    <div class="relative group w-28 h-28 -mb-12 z-10">
                        <Avatar
                            :src="usuario?.avatar_url"
                            :alt="'Avatar de ' + (usuario?.username || usuario?.email)"
                            :fallback-initial="usuario?.username?.charAt(0)?.toUpperCase() || usuario?.email?.charAt(0)?.toUpperCase() || '?'"
                            :claseImagen="'rounded-full w-28 h-28 object-cover border-4 border-white dark:border-neutral-900 shadow-xl'"
                            @click="abrirInputAvatar"
                        />
                        <input
                            ref="inputAvatar"
                            type="file"
                            id="nuevo-avatar"
                            accept="image/*"
                            @change="cambiarAvatar"
                            class="hidden"
                            :disabled="subiendoAvatar"
                        />
                        <div v-if="cursorSobreAvatar && !subiendoAvatar" class="absolute top-0 left-0 w-28 h-28 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-pointer"
                            @click="abrirInputAvatar">
                            <span class="text-white text-center text-xs font-semibold select-none pointer-events-none">
                                {{ usuario?.avatar_url ? 'Editar imagen de perfil' : 'Añadir imagen de perfil' }}
                            </span>
                        </div>
                        <div v-if="subiendoAvatar" class="absolute top-0 left-0 w-28 h-28 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-wait">
                            <span class="text-white text-center text-xs font-semibold select-none">Subiendo...</span>
                        </div>
                    </div>
                    <!-- Botones -->
                    <div class="ml-auto flex gap-2 mb-6 mr-2">
                        <button @click="abrirModalEdicion" class="flex items-center gap-1 px-3 py-1.5 border border-white dark:border-gray-300 rounded-full bg-emerald-700 dark:bg-emerald-800 text-white font-semibold hover:bg-emerald-800 dark:hover:bg-emerald-900 transition-all shadow text-sm">
                            <PencilSquareIcon class="w-5 h-5" />
                            Editar
                        </button>
                        <button @click="handleLogout" class="flex items-center gap-1 px-3 py-1.5 border border-white dark:border-gray-300 rounded-full bg-emerald-700 dark:bg-emerald-800 text-white font-semibold hover:bg-red-600 dark:hover:bg-red-700 transition-all shadow text-sm">
                            <ArrowRightOnRectangleIcon class="w-5 h-5" />
                            Salir
                        </button>
                    </div>
                </div>
                <!-- Datos usuario -->
                <div class="flex flex-col mt-14 px-4">
                    <span class="text-2xl font-bold text-gray-900 dark:text-white break-all">{{ usuario?.username }}</span>
                    <span class="text-base text-gray-600 dark:text-gray-300 break-all flex items-center gap-1">
                        <EnvelopeIcon class="w-5 h-5" />
                        {{ usuario?.email }}
                    </span>
                    <span v-if="usuario?.descripcion" class="text-gray-700 dark:text-gray-300 mt-1 block whitespace-pre-line">{{ usuario.descripcion }}</span>
                    <div class="flex items-center gap-4 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                        <span>Miembro desde {{ usuario?.created_at ? new Date(usuario.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }) : '' }}</span>
                    </div>
                </div>
                <!-- Modal de edición de usuario -->
                <BaseModal v-if="mostrarModalEdicion" @close="cerrarModalEdicion">
                  <ProfileForm :value="datosEdicion" @guardar="guardarCambiosUsuario" @cancelar="cerrarModalEdicion" />
                </BaseModal>
                <!-- Publicaciones -->
                <div class="bg-emerald-50 dark:bg-neutral-950 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600 mt-5">
                    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Publicaciones</h3>
                    <div v-if="listaPublicaciones.length === 0" class="text-center text-gray-500 dark:text-gray-400">No hay publicaciones aún.</div>
                    <ul v-else class="flex flex-col gap-4">
                        <li v-for="pub in listaPublicaciones" :key="pub.id" class="bg-emerald-50 dark:bg-neutral-900 rounded-lg p-4 shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <Avatar
                                  :src="usuario?.avatar_url"
                                  :alt="'Avatar de ' + (usuario?.username || usuario?.email)"
                                  :fallback-initial="usuario?.username?.charAt(0)?.toUpperCase() || usuario?.email?.charAt(0)?.toUpperCase() || '?'"
                                  img-class="h-8 w-8 rounded-full object-cover border-2 border-emerald-400"
                                />
                                <span class="font-semibold text-emerald-700 dark:text-emerald-400">{{ usuario?.username }}</span>
                                <span class="text-xs text-gray-500 ml-auto">{{ new Date(pub.created_at).toLocaleString() }}</span>
                            </div>
                            <div class="text-gray-900 dark:text-white">{{ pub.body }}</div>
                            <img v-if="pub.image_url" :src="pub.image_url" alt="Imagen de la publicación" class="my-2 rounded-lg max-h-64 w-auto object-cover border border-gray-200 dark:border-gray-600" />
                        </li>
                    </ul>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getCurrentUser, logout } from '../services/auth';
import Avatar from '../components/Avatar.vue';
import supabase from '../services/supabase';
import { upsertUser } from '../services/users';
import { loadLastGlobalChatMessages, updateUsernameInMessages } from '../services/global-chat';
import ProfileForm from '../components/ProfileForm.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseSuccess from '../components/BaseSuccess.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { EnvelopeIcon, PencilSquareIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { uploadUserAvatar } from '../services/storage';

export default {
    name: 'Perfil',
    components: { Avatar, ProfileForm, BaseModal, BaseLoader, BaseSuccess, BaseAlert, EnvelopeIcon, PencilSquareIcon, ArrowRightOnRectangleIcon },
    setup() {
        const usuario = ref(null);
        const cargando = ref(true);
        const subiendoAvatar = ref(false);
        const mensajeError = ref('');
        const mensajeSuccess = ref('');
        const archivoNuevoAvatar = ref(null);
        const inputAvatar = ref(null);
        const cursorSobreAvatar = ref(false);
        const listaPublicaciones = ref([]);
        const mostrarModalEdicion = ref(false);
        const datosEdicion = ref({ nombreUsuario: '', descripcion: '', email: '' });

        onMounted(async () => {
            const inicio = Date.now();
            try {
                usuario.value = await getCurrentUser();
                // Traer mensajes del chat global de este usuario
                const todosMensajes = await loadLastGlobalChatMessages();
                listaPublicaciones.value = todosMensajes.filter(msg => msg.user_id === usuario.value.id);
                // Inicializar descripción si existe
                if (usuario.value) {
                    datosEdicion.value = {
                        nombreUsuario: usuario.value.username,
                        descripcion: usuario.value.descripcion || '',
                        email: usuario.value.email
                    };
                }
            } catch (err) {
                mensajeError.value = 'Error al cargar el perfil';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                const duracion = Date.now() - inicio;
                const restante = 1500 - duracion;
                setTimeout(() => { cargando.value = false; }, restante > 0 ? restante : 0);
            }
        });

        const cambiarAvatar = (e) => {
            archivoNuevoAvatar.value = e.target.files[0];
            if (archivoNuevoAvatar.value) {
                subirNuevoAvatar();
            }
        };

        const abrirInputAvatar = () => {
            if (inputAvatar.value) inputAvatar.value.click();
        };

        const subirNuevoAvatar = async () => {
            if (!archivoNuevoAvatar.value || !usuario.value?.id) return;
            subiendoAvatar.value = true;
            mensajeError.value = '';
            mensajeSuccess.value = '';
            try {
                // Subir imagen y obtener URL pública usando el servicio
                const urlAvatar = await uploadUserAvatar(usuario.value.id, archivoNuevoAvatar.value);
                // Actualizar usuario en la base
                await upsertUser({ ...usuario.value, avatar_url: urlAvatar });
                usuario.value.avatar_url = urlAvatar;
                archivoNuevoAvatar.value = null;
                mensajeSuccess.value = '¡Avatar actualizado correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (err) {
                mensajeError.value = 'Error al subir la imagen de perfil';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                subiendoAvatar.value = false;
            }
        };

        const abrirModalEdicion = () => {
            if (usuario.value) {
                datosEdicion.value = {
                  nombreUsuario: usuario.value.username,
                  descripcion: usuario.value.descripcion || '',
                  email: usuario.value.email
                };
                mostrarModalEdicion.value = true;
            }
        };
        const cerrarModalEdicion = () => {
            mostrarModalEdicion.value = false;
        };
        const guardarCambiosUsuario = async (form) => {
            const inicio = Date.now();
            try {
                cargando.value = true;
                mensajeError.value = '';
                mensajeSuccess.value = '';
                let avatarUrl = usuario.value.avatar_url || null;
                // Si se seleccionó una nueva imagen, subirla
                if (form.avatar) {
                    try {
                        avatarUrl = await uploadUserAvatar(usuario.value.id, form.avatar);
                    } catch (error) {
                        throw new Error('Error al subir el avatar');
                    }
                }
                // Construir el objeto a guardar
                const datosActualizados = {
                    id: usuario.value.id,
                    email: form.email,
                    username: form.nombreUsuario,
                    descripcion: form.descripcion,
                    avatar_url: avatarUrl,
                    status: usuario.value.status || 'online'
                };
                // Guardar en la base y actualizar el usuario local con la respuesta
                const usuarioActualizado = await upsertUser(datosActualizados);
                // Actualizar el username en todas las publicaciones
                await updateUsernameInMessages(usuarioActualizado.id, usuarioActualizado.username);
                // Refrescar usuario desde la base
                usuario.value = await getCurrentUser();
                mostrarModalEdicion.value = false;
                mensajeSuccess.value = '¡Perfil actualizado correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (err) {
                mensajeError.value = 'Error al actualizar los datos: ' + (err.message || err);
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                const duracion = Date.now() - inicio;
                const restante = 1500 - duracion;
                setTimeout(() => { cargando.value = false; }, restante > 0 ? restante : 0);
            }
        };

        const handleLogout = async () => {
            try {
                await logout();
                window.location.href = '/ingresar';
            } catch (error) {
                mensajeError.value = 'Error al cerrar sesión';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            }
        };

        return {
            usuario,
            cargando,
            mensajeError,
            mensajeSuccess,
            archivoNuevoAvatar,
            subiendoAvatar,
            cambiarAvatar,
            subirNuevoAvatar,
            inputAvatar,
            abrirInputAvatar,
            cursorSobreAvatar,
            listaPublicaciones,
            mostrarModalEdicion,
            datosEdicion,
            abrirModalEdicion,
            cerrarModalEdicion,
            guardarCambiosUsuario,
            handleLogout
        };
    }
};
</script> 