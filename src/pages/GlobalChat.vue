<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { loadLastGlobalChatMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { getCurrentUser } from '../services/auth';
import { getUserById } from '../services/users';
import Avatar from '../components/Avatar.vue';
import MessageItem from '../components/MessageItem.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseLoader from '../components/BaseLoader.vue';

export default {
    name: 'ChatGlobal',
    components: { MainH1, Avatar, MessageItem, BaseAlert, BaseLoader },
    // La propiedad "data" nos permite definir cuáles son los valores del "state" del componente.
    // Entiéndase por "state" los datos propios del componente que pueden variar duranta la vida del mismo.
    // Esta propiedad debe tener una función que retorne un objeto con los datos.
    // data: function() {
    //     return {}
    // },
    // data: () => {
    //     return {}
    // },
    data() {
        return {
            mensajes: [],
            cacheUsuarios: {}, // cache de usuarios por id
            nuevoMensaje: {
                cuerpo: '',
            },
            mensajeError: null,
            usuarioActual: null,
            cargando: false,
        }
    },
    // La propiedad "methods" permite definir las funciones que queremos que el componente tenga.
    methods: {
        async obtenerUsuario(idUsuario) {
            if (!idUsuario) return null;
            if (this.cacheUsuarios[idUsuario]) return this.cacheUsuarios[idUsuario];
            try {
                const usuario = await getUserById(idUsuario);
                this.cacheUsuarios[idUsuario] = usuario;
                return usuario;
            } catch {
                return null;
            }
        },
        async enviarMensaje() {
            if (!this.usuarioActual) {
                this.mensajeError = 'Debes iniciar sesión para enviar mensajes';
                setTimeout(() => { this.mensajeError = null; }, 4000);
                return;
            }

            if (!this.nuevoMensaje.cuerpo.trim()) {
                this.mensajeError = 'El mensaje no puede estar vacío';
                setTimeout(() => { this.mensajeError = null; }, 4000);
                return;
            }

            try {
                this.mensajeError = null;
                this.cargando = true;
                const mensajeGuardado = await saveGlobalChatMessage({
                    body: this.nuevoMensaje.cuerpo,
                });

                this.mensajes.push(mensajeGuardado);
                this.nuevoMensaje.cuerpo = "";

                await nextTick();
                if (this.$refs.contenedorChat) {
                  this.$refs.contenedorChat.scrollTop = this.$refs.contenedorChat.scrollHeight;
                }
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                this.mensajeError = 'Error al enviar el mensaje: ' + (error.message || 'Error desconocido');
                setTimeout(() => { this.mensajeError = null; }, 4000);
            } finally {
                this.cargando = false;
            }
        },
        async manejarNuevoMensaje(mensaje) {
            this.mensajes.push(mensaje);
            await nextTick();
            if (this.$refs.contenedorChat) {
              this.$refs.contenedorChat.scrollTop = this.$refs.contenedorChat.scrollHeight;
            }
        }
    },
    async mounted() {
        try {
            // Obtener el usuario actual
            this.usuarioActual = await getCurrentUser();

            // Suscribirse a nuevos mensajes
            subscribeToGlobalChatNewMessages(this.manejarNuevoMensaje);

            // Cargar mensajes existentes
            this.mensajes = await loadLastGlobalChatMessages();
            await nextTick();
            this.$refs.contenedorChat.scrollTop = this.$refs.contenedorChat.scrollHeight;

            // Al cargar los mensajes, precargar los usuarios
            for (const msg of this.mensajes) {
                if (msg.user_id) {
                    await this.obtenerUsuario(msg.user_id);
                }
            }
        } catch (error) {
            console.error('Error al cargar el chat:', error);
            this.mensajeError = 'Error al cargar el chat: ' + (error.message || 'Error desconocido');
            setTimeout(() => { this.mensajeError = null; }, 4000);
        }
    }
}
</script>

<template>
    <main role="main" class="bg-blue-50 dark:bg-gray-900 min-h-screen p-4">
        <div class="container mx-auto">
            <MainH1 id="chat-title" class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chat global</MainH1>
            <BaseLoader v-if="cargando" />
            <template v-else>
                <div class="flex flex-col md:flex-row gap-4">
                    <section ref="contenedorChat"
                        class="overflow-y-auto w-full md:w-9/12 h-[400px] md:h-[600px] p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-primary-100 dark:border-gray-700"
                        aria-labelledby="chat-title">
                        <h2 class="sr-only">Lista de mensajes</h2>

                        <ul class="flex flex-col gap-4" aria-live="polite" aria-label="Mensajes del chat">
                            <MessageItem
                              v-for="mensaje in mensajes"
                              :key="mensaje.id"
                              :mensaje="mensaje"
                            >
                              <template #avatar>
                                <Avatar
                                  v-if="mensaje.user_id"
                                  :src="cacheUsuarios[mensaje.user_id]?.avatar_url"
                                  :alt="'Avatar de ' + (cacheUsuarios[mensaje.user_id]?.username || cacheUsuarios[mensaje.user_id]?.email)"
                                  :fallback-initial="cacheUsuarios[mensaje.user_id]?.username?.charAt(0)?.toUpperCase() || cacheUsuarios[mensaje.user_id]?.email?.charAt(0)?.toUpperCase() || '?'"
                                  img-class="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
                                />
                              </template>
                            </MessageItem>
                        </ul>
                    </section>
                    <aside class="w-full md:w-3/12" aria-label="Enviar mensaje">
                        <h2 class="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Enviar un mensaje</h2>

                        <BaseAlert v-if="mensajeError" type="error">
                            {{ mensajeError }}
                        </BaseAlert>

                        <form action="#" @submit.prevent="enviarMensaje"
                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md" aria-label="Formulario para enviar mensaje">
                            <div class="mb-4">
                                <label for="cuerpo"
                                    class="block mb-2 text-secondary-600 dark:text-gray-300 font-medium">Mensaje</label>
                                <textarea id="cuerpo"
                                    class="w-full p-2 rounded-lg border border-primary-200 dark:border-gray-600 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-500/20 outline-none transition-all min-h-[80px] md:min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    v-model="nuevoMensaje.cuerpo" :disabled="!usuarioActual || cargando"
                                    placeholder="Escribe tu mensaje aquí..." aria-required="true"></textarea>
                            </div>
                            <button type="submit"
                                class="w-full bg-primary-600 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                :disabled="!usuarioActual || !nuevoMensaje.cuerpo.trim() || cargando">
                                {{ cargando ? 'Enviando...' : usuarioActual ? 'Enviar mensaje' : 'Inicia sesión para enviar mensajes' }}
                            </button>
                        </form>
                    </aside>
                </div>
            </template>
        </div>
    </main>
</template>