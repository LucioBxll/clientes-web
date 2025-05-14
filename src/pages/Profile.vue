<script>
import { ref, onMounted } from 'vue';
import { getCurrentUser, logout } from '../services/auth';
import Avatar from '../components/Avatar.vue';
import supabase from '../services/supabase';
import { upsertUser } from '../services/users';
import { loadLastGlobalChatMessages } from '../services/global-chat';
import ProfileForm from '../components/ProfileForm.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseSuccess from '../components/BaseSuccess.vue';
import BaseAlert from '../components/BaseAlert.vue';

export default {
    name: 'Perfil',
    components: { Avatar, ProfileForm, BaseModal, BaseLoader, BaseSuccess, BaseAlert },
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
                const restante = 3000 - duracion;
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
                // Subir imagen
                const archivo = archivoNuevoAvatar.value;
                const extension = archivo.name.split('.').pop();
                const nombreArchivo = `${usuario.value.id}/${Date.now()}.${extension}`;
                const { error: errorSubida } = await supabase.storage
                    .from('avatars')
                    .upload(nombreArchivo, archivo, { upsert: true });
                if (errorSubida) throw errorSubida;
                const { data: datosUrlPublica } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(nombreArchivo);
                const urlAvatar = datosUrlPublica.publicUrl;
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
                // Construir el objeto a guardar
                const datosActualizados = {
                    id: usuario.value.id,
                    email: form.email,
                    username: form.nombreUsuario,
                    descripcion: form.descripcion,
                    avatar_url: usuario.value.avatar_url || null,
                    status: usuario.value.status || 'online'
                };
                // Guardar en la base y actualizar el usuario local con la respuesta
                const usuarioActualizado = await upsertUser(datosActualizados);
                usuario.value = usuarioActualizado;
                mostrarModalEdicion.value = false;
                mensajeSuccess.value = '¡Perfil actualizado correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (err) {
                mensajeError.value = 'Error al actualizar los datos: ' + (err.message || err);
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                const duracion = Date.now() - inicio;
                const restante = 3000 - duracion;
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

<template>
    <div class="w-full py-8 bg-emerald-50 dark:bg-neutral-950">
        <div class="max-w-3xl mx-auto">
            <BaseLoader v-if="cargando" />
            <template v-else>
                <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
                <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
                <div class="bg-emerald-400  shadow rounded-lg overflow-hidden transition-all duration-200 p-6">
                    <!-- Tarjeta superior: foto + datos + acciones -->
                    <div class="bg-emerald-50 dark:bg-neutral-950 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600 mb-6">
                      <div class="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 md:items-start">
                        <!-- Foto -->
                        <div class="flex justify-center items-center pt-2 md:justify-center md:items-center min-h-[220px]">
                            <div class="relative group mb-4 w-48 h-48" @mouseenter="cursorSobreAvatar = true" @mouseleave="cursorSobreAvatar = false">
                                <Avatar
                                    :src="usuario?.avatar_url"
                                    :alt="'Avatar de ' + (usuario?.username || usuario?.email)"
                                    :fallback-initial="usuario?.username?.charAt(0)?.toUpperCase() || usuario?.email?.charAt(0)?.toUpperCase() || '?'"
                                    :claseImagen="'rounded-full w-48 h-48 object-cover border-4 border-emerald-400 dark:border-emerald-700 shadow cursor-pointer'"
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
                                <div v-if="cursorSobreAvatar && !subiendoAvatar" class="absolute top-0 left-0 w-48 h-48 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-pointer"
                                    @click="abrirInputAvatar">
                                    <span class="text-white text-center text-xs font-semibold select-none pointer-events-none">
                                        {{ usuario?.avatar_url ? 'Editar imagen de perfil' : 'Añadir imagen de perfil' }}
                                    </span>
                                </div>
                                <div v-if="subiendoAvatar" class="absolute top-0 left-0 w-48 h-48 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-wait">
                                    <span class="text-white text-center text-xs font-semibold select-none">Subiendo...</span>
                                </div>
                            </div>
                        </div>
                        <!-- Datos usuario y acciones -->
                        <div class="flex flex-col justify-start gap-1 items-start mt-2 w-full md:items-start md:mt-2">
                            <span class="text-lg font-bold text-gray-900 dark:text-white break-all">{{ usuario?.username }}</span>
                            <span class="text-base text-emerald-700 dark:text-emerald-300 break-all underline flex items-center">
                              <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span class="hidden sm:inline">{{ usuario?.email }}</span>
                            </span>
                            <span v-if="usuario?.descripcion" class="text-gray-600 dark:text-gray-300 mb-2 block whitespace-pre-line">{{ usuario.descripcion }}</span>
                            <div class="flex flex-row gap-2 mt-2 w-full">
                              <button @click="abrirModalEdicion" class="flex-1 px-2 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50">Editar</button>
                              <button @click="handleLogout" class="flex-1 px-2 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">Cerrar sesión</button>
                            </div>
                        </div>
                      </div>
                    </div>
                    <!-- Modal de edición de usuario -->
                    <BaseModal v-if="mostrarModalEdicion" @close="cerrarModalEdicion">
                      <ProfileForm :value="datosEdicion" @guardar="guardarCambiosUsuario" @cancelar="cerrarModalEdicion" />
                    </BaseModal>
                    <!-- Publicaciones -->
                    <div class="bg-emerald-50 dark:bg-neutral-950 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600">
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
                </div>
            </template>
        </div>
    </div>
</template> 