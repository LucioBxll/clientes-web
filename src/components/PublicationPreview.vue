<template>
  <div v-if="mostrar" 
       class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
       @click="cerrarVistaPrevia">
    <div class="relative bg-white dark:bg-neutral-900 rounded-lg max-w-6xl max-h-[90vh] w-full overflow-hidden shadow-2xl" @click.stop>
      <!-- Botón de cerrar -->
      <button 
        @click="cerrarVistaPrevia"
        class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-colors"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>

      <!-- Contenido de la publicación -->
      <div class="flex h-full">
        <!-- Columna izquierda: Imagen -->
        <div class="flex-1 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
          <div class="flex-1 flex items-center justify-center w-full h-full">
            <img 
              v-if="publicacion.image_url" 
              :src="publicacion.image_url" 
              alt="Imagen de la publicación" 
              class="max-w-full max-h-full object-contain p-4"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400 text-lg">Sin imagen</span>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Información y comentarios -->
        <div class="w-96 bg-white dark:bg-neutral-900 flex flex-col">
          <!-- Header con información del usuario -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-3 mb-4">
              <Avatar 
                :src="publicacion.avatar_url || usuario?.avatar_url" 
                :alt="'Avatar de ' + (publicacion.username || usuario?.username)" 
                :fallback-initial="(publicacion.username || usuario?.username)?.charAt(0)?.toUpperCase() || '?'" 
                img-class="h-12 w-12 rounded-full object-cover border-2 border-emerald-400" 
              />
              <div class="flex-1">
                <div class="font-semibold text-emerald-700 dark:text-emerald-400 text-lg">
                  {{ publicacion.username || usuario?.username }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(publicacion.created_at).toLocaleString() }}
                </div>
              </div>
            </div>

            <!-- Contenido de la publicación -->
            <div class="mb-4">
              <p class="text-gray-900 dark:text-white text-base leading-relaxed whitespace-pre-line">
                {{ publicacion.body }}
              </p>
            </div>

            <!-- Footer con botón de comentarios -->
            <footer class="flex items-center gap-4 mt-4">
              <time class="text-xs md:text-sm text-gray-500 dark:text-gray-400" :datetime="publicacion.created_at">
                {{ new Date(publicacion.created_at).toLocaleString() }}
              </time>
              <button @click="toggleComments" class="ml-auto p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-1" :aria-label="showComments ? 'Ocultar comentarios' : 'Comentar'">
                <ChatBubbleLeftRightIcon class="w-5 h-5" />
                <span class="text-xs text-gray-600 dark:text-gray-300 min-w-[1.5em] text-center">{{ comentarios.length }}</span>
              </button>
            </footer>
          </div>

          <!-- Sección de comentarios expandible -->
          <div v-if="showComments" class="flex-1 flex flex-col border-t border-gray-200 dark:border-gray-700">
            <div class="p-4">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
import Avatar from './Avatar.vue';
import { agregarComentarioAGlobalChat, obtenerComentariosDeMensaje } from '../services/global-chat';
import { getCurrentUser } from '../services/auth';

export default {
  name: 'PublicationPreview',
  components: { XMarkIcon, ChatBubbleLeftRightIcon, Avatar },
  props: {
    mostrar: {
      type: Boolean,
      default: false
    },
    publicacion: {
      type: Object,
      required: true
    },
    usuario: {
      type: Object,
      default: null
    }
  },
  emits: ['cerrar', 'comentario-enviado'],
  setup(props, { emit }) {
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
        comentarios.value = await obtenerComentariosDeMensaje(props.publicacion.id);
      } catch (e) {
        comentarios.value = [];
      } finally {
        cargandoComentarios.value = false;
      }
    };

    const cerrarVistaPrevia = () => {
      emit('cerrar');
    };

    const toggleComments = async () => {
      showComments.value = !showComments.value;
      if (showComments.value && comentarios.value.length === 0) {
        await cargarComentarios();
      }
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
        await agregarComentarioAGlobalChat(props.publicacion.id, nuevoComentario.value, usuarioActual.value);
        nuevoComentario.value = '';
        await cargarComentarios();
        
        // Emitir evento para actualizar la publicación en el feed
        emit('comentario-enviado', {
          publicacionId: props.publicacion.id,
          comentarios: comentarios.value
        });
      } catch (e) {
        errorComentario.value = 'Error al comentar.';
      } finally {
        enviandoComentario.value = false;
      }
    };

    // Cargar comentarios cuando se abre el modal
    watch(() => props.mostrar, async (nuevoValor) => {
      if (nuevoValor) {
        showComments.value = true; // Mostrar comentarios automáticamente
        
        // Si ya hay comentarios cargados en la publicación, usarlos
        if (props.publicacion.comentarios && props.publicacion.comentarios.length > 0) {
          comentarios.value = props.publicacion.comentarios;
        } else {
          // Si no hay comentarios cargados, cargarlos
          await cargarComentarios();
        }
      } else {
        // Limpiar estado cuando se cierra
        showComments.value = false;
        nuevoComentario.value = '';
        errorComentario.value = null;
      }
    });

    // Observar cambios en los comentarios de la publicación (cuando vienen del feed)
    watch(() => props.publicacion.comentarios, (nuevosComentarios) => {
      if (nuevosComentarios && Array.isArray(nuevosComentarios)) {
        comentarios.value = nuevosComentarios;
      }
    }, { immediate: true });

    // Obtener usuario actual al montar
    onMounted(async () => {
      if (!usuarioActual.value) {
        usuarioActual.value = await getCurrentUser();
      }
    });

    return {
      showComments,
      comentarios,
      nuevoComentario,
      cargandoComentarios,
      enviandoComentario,
      usuarioActual,
      errorComentario,
      cerrarVistaPrevia,
      toggleComments,
      enviarComentario
    };
  }
};
</script> 