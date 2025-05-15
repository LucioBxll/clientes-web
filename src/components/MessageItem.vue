<template>
  <li class="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-neutral-900 hover:bg-emerald-100 dark:hover:bg-neutral-800 transition-colors">
    <slot name="avatar" />
    <article class="flex-1">
      <header class="font-semibold text-emerald-700 dark:text-emerald-400">
        <router-link
          :to="'/perfil/' + mensaje.user_id"
          :title="mensaje.username ? mensaje.username + ' ( @' + (mensaje.username || mensaje.email?.split('@')[0]) + ' )' : mensaje.email"
          class="cursor-pointer hover:underline text-emerald-700 dark:text-emerald-400"
        >
          {{ mensaje.username }}
        </router-link>
      </header>
      <p class="text-gray-900 dark:text-white break-words">{{ mensaje.body }}</p>
      <img v-if="mensaje.image_url" :src="mensaje.image_url" alt="Imagen de la publicación" class="my-2 rounded-lg max-h-64 w-auto object-cover border border-emerald-200 dark:border-gray-700" />
      <footer class="flex items-center gap-4 mt-2">
        <time class="text-xs md:text-sm text-gray-500 dark:text-gray-400" :datetime="mensaje.created_at">
          {{ new Date(mensaje.created_at).toLocaleString() }}
        </time>
        <button @click="toggleComments" class="ml-auto p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-1" :aria-label="showComments ? 'Ocultar comentarios' : 'Comentar'">
          <ChatBubbleLeftRightIcon class="w-5 h-5" />
          <span class="text-xs text-gray-600 dark:text-gray-300 min-w-[1.5em] text-center">{{ comentarios.length }}</span>
        </button>
      </footer>
      <div v-if="showComments" class="mt-3">
        <div v-if="cargandoComentarios" class="text-xs text-gray-500 dark:text-gray-400">Cargando comentarios...</div>
        <ul v-else class="space-y-2 mb-2">
          <li v-for="comentario in comentarios" :key="comentario.id" class="flex items-start gap-2">
            <Avatar :src="comentario.avatar_url" :alt="'Avatar de ' + comentario.username" :fallback-initial="comentario.username?.charAt(0)?.toUpperCase() || '?'" img-class="h-7 w-7 rounded-full object-cover border-2 border-emerald-400" />
            <div>
              <span class="font-semibold text-xs text-emerald-700 dark:text-emerald-400">{{ comentario.username }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ new Date(comentario.created_at).toLocaleString() }}</span>
              <div class="text-xs text-gray-900 dark:text-white">{{ comentario.body }}</div>
            </div>
          </li>
        </ul>
        <form v-if="usuarioActual" @submit.prevent="enviarComentario" class="flex items-end gap-2 mt-2">
          <input v-model="nuevoComentario" type="text" placeholder="Escribe un comentario..." class="flex-1 p-2 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" :disabled="enviandoComentario" />
          <button type="submit" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors" :disabled="enviandoComentario || !nuevoComentario.trim()">Comentar</button>
        </form>
        <div v-if="errorComentario" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ errorComentario }}</div>
      </div>
    </article>
  </li>
</template>

<script>
import { ref, onMounted } from 'vue';
import Avatar from './Avatar.vue';
import { agregarComentarioAGlobalChat, obtenerComentariosDeMensaje } from '../services/global-chat';
import { getCurrentUser } from '../services/auth';
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'MessageItem',
  components: { Avatar, ChatBubbleLeftRightIcon },
  props: {
    mensaje: Object
  },
  setup(props) {
    const showComments = ref(false);
    const comentarios = ref([]);
    const nuevoComentario = ref('');
    const cargandoComentarios = ref(false);
    const enviandoComentario = ref(false);
    const usuarioActual = ref(null);
    const errorComentario = ref(null);

    const cargarComentarios = async () => {
      cargandoComentarios.value = true;
      try {
        comentarios.value = await obtenerComentariosDeMensaje(props.mensaje.id);
      } catch (e) {
        comentarios.value = [];
      } finally {
        cargandoComentarios.value = false;
      }
    };

    onMounted(async () => {
      await cargarComentarios();
      if (!usuarioActual.value) {
        usuarioActual.value = await getCurrentUser();
      }
    });

    const toggleComments = async () => {
      showComments.value = !showComments.value;
    };

    const enviarComentario = async () => {
      if (!usuarioActual.value) {
        errorComentario.value = 'Debes iniciar sesión para comentar.';
        return;
      }
      if (!nuevoComentario.value.trim()) return;
      enviandoComentario.value = true;
      errorComentario.value = null;
      try {
        await agregarComentarioAGlobalChat(props.mensaje.id, nuevoComentario.value, usuarioActual.value);
        nuevoComentario.value = '';
        await cargarComentarios();
      } catch (e) {
        errorComentario.value = 'Error al comentar.';
      } finally {
        enviandoComentario.value = false;
      }
    };

    return {
      showComments,
      comentarios,
      nuevoComentario,
      cargandoComentarios,
      enviandoComentario,
      usuarioActual,
      errorComentario,
      toggleComments,
      enviarComentario
    };
  }
};
</script> 