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
                            
                            <!-- Botones de acción -->
                            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                    @click="editarPublicacion(pub)"
                                    class="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                                >
                                    <PencilSquareIcon class="w-4 h-4" />
                                    Editar
                                </button>
                                <button 
                                    @click="eliminarPublicacion(pub.id)"
                                    class="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                >
                                    <TrashIcon class="w-4 h-4" />
                                    Eliminar
                                </button>
                                <button 
                                    @click="toggleComentarios(pub.id)"
                                    class="ml-auto p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-1"
                                    :aria-label="publicacionesConComentarios[pub.id] ? 'Ocultar comentarios' : 'Ver comentarios'"
                                >
                                    <ChatBubbleLeftRightIcon class="w-5 h-5" />
                                    <span class="text-xs text-gray-600 dark:text-gray-300 min-w-[1.5em] text-center">{{ pub.comentarios?.length || 0 }}</span>
                                </button>
                            </div>

                            <!-- Sección de comentarios -->
                            <div v-if="publicacionesConComentarios[pub.id]" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div v-if="cargandoComentarios[pub.id]" class="text-sm text-gray-500 dark:text-gray-400">
                                    Cargando comentarios...
                                </div>
                                <div v-else>
                                    <div v-if="!pub.comentarios || pub.comentarios.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                                        No hay comentarios aún.
                                    </div>
                                    <ul v-else class="space-y-2 mb-2">
                                        <li v-for="comentario in pub.comentarios" :key="comentario.id" class="flex items-start gap-2 bg-white dark:bg-neutral-800 rounded-lg p-2">
                                            <Avatar 
                                                :src="comentario.avatar_url" 
                                                :alt="'Avatar de ' + comentario.username" 
                                                :fallback-initial="comentario.username?.charAt(0)?.toUpperCase() || '?'" 
                                                img-class="h-6 w-6 rounded-full object-cover border border-emerald-400" 
                                            />
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-semibold text-xs text-emerald-700 dark:text-emerald-400">{{ comentario.username }}</span>
                                                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(comentario.created_at).toLocaleString() }}</span>
                                                </div>
                                                <div class="text-sm text-gray-900 dark:text-white">{{ comentario.body }}</div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                
                                <!-- Formulario para comentar -->
                                <form v-if="usuario" @submit.prevent="enviarComentario(pub.id)" class="flex items-end gap-2 mt-2">
                                    <input 
                                        v-model="nuevosComentarios[pub.id]" 
                                        type="text" 
                                        placeholder="Escribe un comentario..." 
                                        class="flex-1 p-2 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                                        :disabled="enviandoComentarios[pub.id]" 
                                    />
                                    <button 
                                        type="submit" 
                                        class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors" 
                                        :disabled="enviandoComentarios[pub.id] || !nuevosComentarios[pub.id]?.trim()"
                                    >
                                        Comentar
                                    </button>
                                </form>
                                <div v-if="erroresComentarios[pub.id]" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ erroresComentarios[pub.id] }}</div>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Modal de edición de publicación -->
                <BaseModal v-if="mostrarModalEdicionPublicacion" @close="cerrarModalEdicionPublicacion">
                    <EditPublicationForm 
                        :publicacion="publicacionSeleccionada" 
                        @guardar="guardarCambiosPublicacion" 
                        @cancelar="cerrarModalEdicionPublicacion" 
                    />
                </BaseModal>
            </template>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { getCurrentUser, logout } from '../services/auth';
import Avatar from '../components/Avatar.vue';
import supabase from '../services/supabase';
import { upsertUser } from '../services/users';
import { loadLastGlobalChatMessages, updateUsernameInMessages, updateMessage, deleteMessage, obtenerComentariosDeMensaje, agregarComentarioAGlobalChat, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import ProfileForm from '../components/ProfileForm.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseSuccess from '../components/BaseSuccess.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { EnvelopeIcon, PencilSquareIcon, ArrowRightOnRectangleIcon, TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
import { uploadUserAvatar } from '../services/storage';
import EditPublicationForm from '../components/EditPublicationForm.vue';

export default {
    name: 'Perfil',
    components: { Avatar, ProfileForm, BaseModal, BaseLoader, BaseSuccess, BaseAlert, EnvelopeIcon, PencilSquareIcon, ArrowRightOnRectangleIcon, TrashIcon, EditPublicationForm, ChatBubbleLeftRightIcon },
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
        const mostrarModalEdicionPublicacion = ref(false);
        const publicacionSeleccionada = ref(null);
        const publicacionesConComentarios = ref({});
        const cargandoComentarios = ref({});
        const nuevosComentarios = ref({});
        const enviandoComentarios = ref({});
        const erroresComentarios = ref({});

        onMounted(async () => {
            const inicio = Date.now();
            try {
                usuario.value = await getCurrentUser();
                // Traer mensajes del chat global de este usuario
                const todosMensajes = await loadLastGlobalChatMessages();
                listaPublicaciones.value = todosMensajes.filter(msg => msg.user_id === usuario.value.id);
                
                // Cargar el conteo de comentarios para cada publicación
                for (const pub of listaPublicaciones.value) {
                    try {
                        const comentarios = await obtenerComentariosDeMensaje(pub.id);
                        pub.comentarios = comentarios;
                    } catch (error) {
                        console.error('Error al cargar comentarios para publicación:', pub.id, error);
                        pub.comentarios = [];
                    }
                }
                
                // Configurar suscripciones en tiempo real
                limpiarSuscripciones = configurarSuscripcionesTiempoReal();
                
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

        const editarPublicacion = (pub) => {
            publicacionSeleccionada.value = pub;
            mostrarModalEdicionPublicacion.value = true;
        };

        const cerrarModalEdicionPublicacion = () => {
            mostrarModalEdicionPublicacion.value = false;
        };

        const guardarCambiosPublicacion = async (datos) => {
            try {
                mensajeError.value = '';
                mensajeSuccess.value = '';
                
                // Actualizar la publicación usando el servicio
                await updateMessage(datos.id, datos.body, datos.image_url);
                
                // Actualizar la lista de publicaciones
                const publicacionIndex = listaPublicaciones.value.findIndex(pub => pub.id === datos.id);
                if (publicacionIndex !== -1) {
                    listaPublicaciones.value[publicacionIndex] = {
                        ...listaPublicaciones.value[publicacionIndex],
                        body: datos.body,
                        image_url: datos.image_url
                    };
                }
                
                cerrarModalEdicionPublicacion();
                mensajeSuccess.value = '¡Publicación actualizada correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (error) {
                console.error('Error al actualizar la publicación:', error);
                mensajeError.value = 'Error al actualizar la publicación';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            }
        };

        const eliminarPublicacion = async (id) => {
            if (!confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
                return;
            }
            
            try {
                mensajeError.value = '';
                mensajeSuccess.value = '';
                
                // Eliminar la publicación usando el servicio
                await deleteMessage(id);
                
                // Remover de la lista local
                listaPublicaciones.value = listaPublicaciones.value.filter(pub => pub.id !== id);
                
                mensajeSuccess.value = '¡Publicación eliminada correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (error) {
                console.error('Error al eliminar la publicación:', error);
                mensajeError.value = 'Error al eliminar la publicación';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            }
        };

        const toggleComentarios = async (pubId) => {
            // Si ya están visibles, ocultarlos
            if (publicacionesConComentarios.value[pubId]) {
                publicacionesConComentarios.value[pubId] = false;
                return;
            }

            // Los comentarios ya están cargados, solo mostrarlos
            publicacionesConComentarios.value[pubId] = true;
        };

        const enviarComentario = async (pubId) => {
            if (!usuario.value || !pubId) return;

            try {
                enviandoComentarios.value[pubId] = true;
                mensajeError.value = '';
                mensajeSuccess.value = '';
                
                const comentario = nuevosComentarios.value[pubId];
                if (!comentario || !comentario.trim()) {
                    throw new Error('El comentario no puede estar vacío');
                }
                
                // Agregar el comentario usando el servicio
                await agregarComentarioAGlobalChat(pubId, comentario, usuario.value);
                
                // Limpiar el formulario
                nuevosComentarios.value[pubId] = '';
                
                mensajeSuccess.value = '¡Comentario enviado correctamente!';
                setTimeout(() => { mensajeSuccess.value = ''; }, 4000);
            } catch (error) {
                console.error('Error al enviar el comentario:', error);
                mensajeError.value = 'Error al enviar el comentario';
                setTimeout(() => { mensajeError.value = ''; }, 4000);
            } finally {
                enviandoComentarios.value[pubId] = false;
            }
        };

        // Configurar suscripciones en tiempo real
        const configurarSuscripcionesTiempoReal = () => {
            // Suscripción a nuevas publicaciones
            const publicacionesChannel = supabase.channel('publicaciones-perfil', {
                config: {
                    broadcast: { self: true },
                },
            });

            // Escuchar cambios en publicaciones (INSERT, UPDATE, DELETE)
            publicacionesChannel.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'global_chat',
                    filter: `user_id=eq.${usuario.value?.id}`
                },
                async (payload) => {
                    console.log('Cambio en publicación detectado:', payload);
                    
                    if (payload.eventType === 'INSERT') {
                        // Nueva publicación del usuario
                        const nuevaPublicacion = payload.new;
                        nuevaPublicacion.comentarios = [];
                        listaPublicaciones.value.unshift(nuevaPublicacion);
                    } else if (payload.eventType === 'UPDATE') {
                        // Publicación actualizada
                        const publicacionIndex = listaPublicaciones.value.findIndex(pub => pub.id === payload.new.id);
                        if (publicacionIndex !== -1) {
                            listaPublicaciones.value[publicacionIndex] = {
                                ...listaPublicaciones.value[publicacionIndex],
                                ...payload.new
                            };
                        }
                    } else if (payload.eventType === 'DELETE') {
                        // Publicación eliminada
                        listaPublicaciones.value = listaPublicaciones.value.filter(pub => pub.id !== payload.old.id);
                    }
                }
            );

            // Suscripción a comentarios
            const comentariosChannel = supabase.channel('comentarios-perfil', {
                config: {
                    broadcast: { self: true },
                },
            });

            // Escuchar cambios en comentarios
            comentariosChannel.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'global_chat_comments'
                },
                async (payload) => {
                    console.log('Cambio en comentario detectado:', payload);
                    
                    // Encontrar la publicación afectada
                    const publicacionIndex = listaPublicaciones.value.findIndex(pub => pub.id === payload.new?.mensaje_id || payload.old?.mensaje_id);
                    
                    if (publicacionIndex !== -1) {
                        if (payload.eventType === 'INSERT') {
                            // Nuevo comentario
                            const nuevoComentario = payload.new;
                            if (!listaPublicaciones.value[publicacionIndex].comentarios) {
                                listaPublicaciones.value[publicacionIndex].comentarios = [];
                            }
                            listaPublicaciones.value[publicacionIndex].comentarios.push(nuevoComentario);
                        } else if (payload.eventType === 'UPDATE') {
                            // Comentario actualizado
                            const comentarioIndex = listaPublicaciones.value[publicacionIndex].comentarios?.findIndex(com => com.id === payload.new.id);
                            if (comentarioIndex !== -1) {
                                listaPublicaciones.value[publicacionIndex].comentarios[comentarioIndex] = payload.new;
                            }
                        } else if (payload.eventType === 'DELETE') {
                            // Comentario eliminado
                            listaPublicaciones.value[publicacionIndex].comentarios = listaPublicaciones.value[publicacionIndex].comentarios?.filter(com => com.id !== payload.old.id) || [];
                        }
                    }
                }
            );

            // Suscribirse a los canales
            publicacionesChannel.subscribe();
            comentariosChannel.subscribe();

            // Retornar función para limpiar suscripciones
            return () => {
                publicacionesChannel.unsubscribe();
                comentariosChannel.unsubscribe();
            };
        };

        let limpiarSuscripciones = null;

        // Limpiar suscripciones cuando el componente se desmonte
        onUnmounted(() => {
            if (limpiarSuscripciones) {
                limpiarSuscripciones();
            }
        });

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
            handleLogout,
            mostrarModalEdicionPublicacion,
            publicacionSeleccionada,
            editarPublicacion,
            cerrarModalEdicionPublicacion,
            guardarCambiosPublicacion,
            eliminarPublicacion,
            publicacionesConComentarios,
            cargandoComentarios,
            toggleComentarios,
            nuevosComentarios,
            enviandoComentarios,
            erroresComentarios,
            enviarComentario
        };
    }
};
</script> 