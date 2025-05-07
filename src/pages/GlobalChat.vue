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
import BaseModal from '../components/BaseModal.vue';
import supabase from '../services/supabase';

export default {
    name: 'ChatGlobal',
    components: { MainH1, Avatar, MessageItem, BaseAlert, BaseLoader, BaseModal },
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
                imagen: null,
                preview: null
            },
            mensajeError: null,
            usuarioActual: null,
            cargando: false,
            mostrarModalPublicacion: false
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
        async subirImagenASupabase(file) {
            // Subir imagen a Supabase Storage y devolver la URL pública
            if (!file) return null;
            const nombreArchivo = `publicaciones/${Date.now()}_${file.name}`;
            const { data, error } = await supabase.storage.from('publicaciones').upload(nombreArchivo, file, { upsert: true });
            if (error) {
                this.mensajeError = 'Error al subir la imagen';
                setTimeout(() => { this.mensajeError = null; }, 4000);
                return null;
            }
            const { data: urlData } = supabase.storage.from('publicaciones').getPublicUrl(nombreArchivo);
            return urlData.publicUrl;
        },
        abrirModalPublicacion() {
            if (!this.usuarioActual) {
                this.$router.push('/ingresar');
                return;
            }
            this.mostrarModalPublicacion = true;
        },
        cerrarModalPublicacion() {
            this.mostrarModalPublicacion = false;
            this.nuevoMensaje.cuerpo = '';
            this.nuevoMensaje.imagen = null;
            this.nuevoMensaje.preview = null;
        },
        async enviarMensaje() {
            if (!this.usuarioActual) {
                this.$router.push('/ingresar');
                return;
            }
            if (!this.nuevoMensaje.cuerpo.trim() && !this.nuevoMensaje.imagen) {
                this.mensajeError = 'La publicación no puede estar vacía';
                setTimeout(() => { this.mensajeError = null; }, 4000);
                return;
            }
            try {
                this.mensajeError = null;
                this.cargando = true;
                let imageUrl = null;
                if (this.nuevoMensaje.imagen) {
                    imageUrl = await this.subirImagenASupabase(this.nuevoMensaje.imagen);
                }
                const mensajeGuardado = await saveGlobalChatMessage({
                    body: this.nuevoMensaje.cuerpo,
                    image_url: imageUrl
                });
                this.mensajes.push(mensajeGuardado);
                this.nuevoMensaje.cuerpo = "";
                this.nuevoMensaje.imagen = null;
                this.nuevoMensaje.preview = null;
                this.mostrarModalPublicacion = false;
                await nextTick();
                const feed = document.querySelector('.feed-scroll');
                if (feed) feed.scrollTop = feed.scrollHeight;
            } catch (error) {
                console.error('Error al enviar la publicación:', error);
                this.mensajeError = 'Error al enviar la publicación: ' + (error.message || 'Error desconocido');
                setTimeout(() => { this.mensajeError = null; }, 4000);
            } finally {
                this.cargando = false;
            }
        },
        handleImagenSeleccionada(e) {
            const file = e.target.files[0];
            if (file) {
                this.nuevoMensaje.imagen = file;
                this.nuevoMensaje.preview = URL.createObjectURL(file);
            } else {
                this.nuevoMensaje.imagen = null;
                this.nuevoMensaje.preview = null;
            }
        },
        async manejarNuevoMensaje(mensaje) {
            this.mensajes.push(mensaje);
            await nextTick();
            const feed = document.querySelector('.feed-scroll');
            if (feed) feed.scrollTop = feed.scrollHeight;
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
            const feed = document.querySelector('.feed-scroll');
            if (feed) feed.scrollTop = feed.scrollHeight;

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
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 flex">
    <!-- Columna izquierda: Menú -->
    <aside class="hidden md:flex flex-col w-1/5 border-r border-gray-200 dark:border-gray-800 p-4">
      <nav class="flex flex-col gap-4">
        <router-link to="/" class="flex items-center gap-2 font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400">
          <span>🏠</span> Inicio
        </router-link>
        <router-link to="/chat-global" class="flex items-center gap-2 font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400">
          <span>💬</span> Chat Global
        </router-link>
        <router-link to="/blog" class="flex items-center gap-2 font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400">
          <span>📝</span> Blog
        </router-link>
        <router-link to="/calendario" class="flex items-center gap-2 font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400">
          <span>📅</span> Calendario
        </router-link>
        <router-link to="/perfil" class="flex items-center gap-2 font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400">
          <span>👤</span> Perfil
        </router-link>
      </nav>
    </aside>

    <!-- Columna central: Chat Global -->
    <main class="flex-1 flex flex-col items-center">
      <div class="w-full max-w-2xl flex flex-col h-screen relative">
        <!-- Encabezado -->
        <header class="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-800 p-4">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Chat Global</h1>
        </header>
        <BaseLoader v-if="cargando" />
        <template v-else>
          <!-- Mensaje de error -->
          <BaseAlert v-if="mensajeError" type="error" class="mb-2">{{ mensajeError }}</BaseAlert>
          <!-- Feed de mensajes -->
          <section class="flex-1 overflow-y-auto p-4 space-y-4 bg-blue-50 dark:bg-gray-900 feed-scroll">
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
          <!-- Botón flotante para crear publicación -->
          <button @click="abrirModalPublicacion" class="fixed bottom-8 right-8 z-20 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487c-.078-.444-.36-.82-.746-1.032a2.25 2.25 0 0 0-2.357.073c-.383.25-.637.66-.637 1.122v2.25c0 .414.336.75.75.75h2.25c.462 0 .872-.254 1.122-.637a2.25 2.25 0 0 0 .073-2.357c-.212-.386-.588-.668-1.032-.746zM12 21.75c-4.556 0-8.25-3.694-8.25-8.25S7.444 5.25 12 5.25s8.25 3.694 8.25 8.25-3.694 8.25-8.25 8.25z" />
            </svg>
          </button>
          <!-- Modal de publicación -->
          <BaseModal v-if="mostrarModalPublicacion" @close="cerrarModalPublicacion">
            <form action="#" @submit.prevent="enviarMensaje" class="flex flex-col gap-2 items-end p-2">
              <textarea id="cuerpo"
                class="w-full p-2 rounded-lg border border-primary-200 dark:border-gray-600 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-500/20 outline-none min-h-[48px] max-h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none transition-all"
                v-model="nuevoMensaje.cuerpo" :disabled="cargando"
                placeholder="¿Qué quieres decir?" aria-required="true"></textarea>
              <input type="file" accept="image/*" @change="handleImagenSeleccionada" :disabled="cargando" class="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <div v-if="nuevoMensaje.preview" class="w-full flex justify-start mb-2">
                <img :src="nuevoMensaje.preview" alt="Preview imagen" class="max-h-40 rounded-lg border border-gray-300 dark:border-gray-600" />
              </div>
              <button type="submit"
                class="bg-blue-600 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="(!nuevoMensaje.cuerpo.trim() && !nuevoMensaje.imagen) || cargando">
                {{ cargando ? 'Publicando...' : 'Publicar' }}
              </button>
            </form>
          </BaseModal>
        </template>
      </div>
    </main>

    <!-- Columna derecha: Widgets -->
    <aside class="hidden lg:flex flex-col w-1/4 border-l border-gray-200 dark:border-gray-800 p-4 space-y-8">
      <div>
        <h2 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">Tendencias</h2>
        <ul class="text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li>#Ejemplo1</li>
          <li>#Ejemplo2</li>
          <li>#Ejemplo3</li>
        </ul>
      </div>
      <div>
        <h2 class="font-bold text-lg mb-2 text-gray-900 dark:text-white">A quién seguir</h2>
        <ul class="text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li>@usuario1</li>
          <li>@usuario2</li>
        </ul>
      </div>
    </aside>
  </div>
</template>