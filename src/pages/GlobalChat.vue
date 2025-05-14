<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { loadLastGlobalChatMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { getCurrentUser, subscribeToUserState } from '../services/auth';
import { getUserById, getAllUsers } from '../services/users';
import Avatar from '../components/Avatar.vue';
import MessageItem from '../components/MessageItem.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseModal from '../components/BaseModal.vue';
import supabase from '../services/supabase';
import Footer from '../components/Footer.vue';

export default {
  name: 'ChatGlobal',
  components: { MainH1, Avatar, MessageItem, BaseAlert, BaseLoader, BaseModal, Footer },
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
      cargando: true, // Cambiado a true para que el loader se muestre automáticamente
      publicacionesVisibles: 10, // cantidad de publicaciones a mostrar
      usuariosSugeridos: [], // usuarios para 'A quién seguir'
      mostrarModalPublicar: false
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
        // Validar de nuevo antes de publicar, por si el usuario se deslogueó justo antes
        if (!this.usuarioActual) {
          this.$router.push('/ingresar');
          return;
        }
        const mensajeGuardado = await saveGlobalChatMessage({
          body: this.nuevoMensaje.cuerpo,
          image_url: imageUrl
        });
        this.mensajes.unshift(mensajeGuardado);
        this.nuevoMensaje.cuerpo = "";
        this.nuevoMensaje.imagen = null;
        this.nuevoMensaje.preview = null;
      } catch (error) {
        // Si el error es de autenticación, redirigir sin mostrar error
        if (error.message && error.message.toLowerCase().includes('no autenticado')) {
          this.$router.push('/ingresar');
          return;
        }
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
      this.mensajes.unshift(mensaje);
    }
  },
  async mounted() {
    const inicio = Date.now();
    try {
      // Obtener el usuario actual
      this.usuarioActual = await getCurrentUser();
      // Cargar usuarios sugeridos (excluyendo el actual)
      const todos = await getAllUsers();
      this.usuariosSugeridos = todos
        .filter(u => !this.usuarioActual || u.id !== this.usuarioActual.id)
        .slice(0, 3);
      // Suscribirse a cambios de autenticación
      subscribeToUserState(async (user) => {
        this.usuarioActual = user;
      });
      // Suscribirse a nuevos mensajes
      subscribeToGlobalChatNewMessages(this.manejarNuevoMensaje);
      // Cargar mensajes existentes
      this.mensajes = await loadLastGlobalChatMessages();
      // Precargar los usuarios (y avatares) de los mensajes
      for (const msg of this.mensajes) {
        if (msg.user_id) {
          await this.obtenerUsuario(msg.user_id);
        }
      }
      await nextTick();
    } catch (error) {
      console.error('Error al cargar el chat:', error);
      this.mensajeError = 'Error al cargar el chat: ' + (error.message || 'Error desconocido');
      setTimeout(() => { this.mensajeError = null; }, 4000);
    } finally {
      const duracion = Date.now() - inicio;
      const restante = 2000 - duracion;
      await nextTick();
      setTimeout(() => { this.cargando = false; }, restante > 0 ? restante : 0);
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-white dark:bg-neutral-950">
    <!-- Sidebar izquierdo: Estático -->
    <aside
      class="hidden md:flex flex-col w-1/5 border-r border-gray-800 bg-esmerald-50 dark:bg-neutral-950 p-4 h-screen sticky top-0">
      <nav class="flex flex-col gap-4">
        <router-link to="/"
          class="flex items-center gap-2 font-semibold text-lg hover:text-emerald-400 text-black dark:text-white">
          <span>🏠</span> Inicio
        </router-link>
        <router-link to="/chat-global"
          class="flex items-center gap-2 font-semibold text-lg hover:text-emerald-400 text-black dark:text-white">
          <span>💬</span> Chat Global
        </router-link>
        <router-link to="/perfil"
          class="flex items-center gap-2 font-semibold text-lg hover:text-emerald-400 text-black dark:text-white">
          <span>👤</span> Perfil
        </router-link>
      </nav>
    </aside>

    <!-- Columna central: Feed Global -->
    <main class="flex-1 flex flex-col items-center">
      <div class="w-full max-w-2xl flex flex-col min-h-screen relative">
        <!-- Encabezado -->
        <header class="sticky top-0 bg-white dark:bg-neutral-950 z-10 border-b border-emerald-700 p-4">
          <h1 class="text-xl font-bold text-emerald-800 dark:text-white">Feed Global</h1>
        </header>
        <div v-if="cargando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-950/80">
          <BaseLoader />
        </div>
        <template v-else>
          <!-- Botón flotante para abrir el modal de publicación con tooltip -->
          <div class="group fixed bottom-8 right-8 z-49 flex flex-col items-center">
            <button v-if="usuarioActual" @click="mostrarModalPublicar = true"
              class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none relative">
              +
            </button>
            <span v-if="usuarioActual"
              class="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-3 mt-2 pointer-events-none select-none shadow-lg">
              Publicar
            </span>
          </div>
          <!-- Modal para publicar -->
          <BaseModal v-if="mostrarModalPublicar" @close="mostrarModalPublicar = false">
            <form action="#" @submit.prevent="enviarMensaje"
              class="flex flex-col gap-2 items-end p-6 bg-white dark:bg-neutral-900 rounded-xl shadow border border-emerald-100 dark:border-gray-700">
              <textarea id="cuerpo"
                class="w-full p-3 mb-4 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-black dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 placeholder-gray-400 resize-none transition"
                v-model="nuevoMensaje.cuerpo" :disabled="cargando" placeholder="¿Qué quieres compartir?"
                aria-required="true"></textarea>
              <input type="file" accept="image/*" @change="handleImagenSeleccionada" :disabled="cargando"
                class="block w-full text-sm text-black dark:text-white file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-neutral-900 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-800" />
              <div v-if="nuevoMensaje.preview" class="w-full flex justify-start mb-2">
                <img :src="nuevoMensaje.preview" alt="Preview imagen"
                  class="max-h-40 rounded-lg border border-emerald-200 dark:border-gray-700" />
              </div>
              <button type="submit"
                class="w-full p-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="(!nuevoMensaje.cuerpo.trim() && !nuevoMensaje.imagen) || cargando">
                {{ cargando ? 'Publicando...' : 'Publicar' }}
              </button>
            </form>
          </BaseModal>
          <!-- Feed de mensajes -->
          <section class="flex-1 p-4 space-y-6 ">
            <ul class="flex flex-col gap-6" aria-live="polite" aria-label="Publicaciones del feed">
              <li v-for="mensaje in mensajes.slice(0, publicacionesVisibles)" :key="mensaje.id"
                class="bg-emerald-100 dark:bg-neutral-900 rounded-xl shadow-lg p-4 border border-emerald-700 dark:border-gray-700">
                <MessageItem :mensaje="mensaje">
                  <template #avatar>
                    <Avatar v-if="mensaje.user_id" :src="cacheUsuarios[mensaje.user_id]?.avatar_url"
                      :alt="'Avatar de ' + (cacheUsuarios[mensaje.user_id]?.username || cacheUsuarios[mensaje.user_id]?.email)"
                      :fallback-initial="cacheUsuarios[mensaje.user_id]?.username?.charAt(0)?.toUpperCase() || cacheUsuarios[mensaje.user_id]?.email?.charAt(0)?.toUpperCase() || '?'"
                      img-class="h-10 w-10 rounded-full object-cover border-2 border-emerald-400" />
                  </template>
                </MessageItem>
              </li>
            </ul>
            <div v-if="mensajes.length > publicacionesVisibles" class="flex justify-center mt-4">
              <button @click="publicacionesVisibles += 10"
                class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow transition-all">
                Ver más
              </button>
            </div>
          </section>
        </template>
      </div>
    </main>

    <!-- Sidebar derecho: Estático -->
    <aside
      class="hidden lg:flex flex-col w-1/4 border-l border-gray-800 bg-esmerald-50 dark:bg-neutral-950 p-4 h-screen sticky top-0 space-y-8">
      <!-- Otros widgets aquí si los hay -->
      <div>
        <h2 class="font-bold text-lg mb-2 text-white">Tendencias</h2>
        <ul class="text-gray-300 text-sm space-y-1">
          <li>#Ejemplo1</li>
          <li>#Ejemplo2</li>
          <li>#Ejemplo3</li>
        </ul>
      </div>
      <div>
        <h2 class="font-bold text-lg mb-2 text-white">A quién seguir</h2>
        <ul class="text-gray-300 text-sm space-y-1">
          <li v-for="usuario in usuariosSugeridos" :key="usuario.id" class="flex items-center gap-2 mb-2">
            <Avatar :src="usuario.avatar_url" :alt="'Avatar de ' + (usuario.username || usuario.email)"
              :fallback-initial="usuario.username?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'"
              img-class="h-8 w-8 rounded-full object-cover border-2 border-emerald-400" />
            <router-link :to="'/perfil/' + usuario.id" class="font-semibold hover:underline text-emerald-400">
              {{ usuario.username || usuario.email }}
            </router-link>
            <span class="text-xs text-gray-500">@{{ usuario.username || usuario.email?.split('@')[0] }}</span>
          </li>
        </ul>
      </div>
      <div class="bg-emerald-50 dark:bg-neutral-900 rounded-lg shadow p-4">
        <Footer />
      </div>
    </aside>
  </div>
</template>