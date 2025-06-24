<template>
  <div v-if="mostrar" 
       class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-0 sm:p-4 overflow-hidden"
       @click="cerrarVistaPrevia">
    <div class="relative bg-white dark:bg-neutral-900 rounded-lg w-full h-[100dvh] min-h-0 sm:max-w-6xl sm:max-h-[90vh] sm:w-auto sm:h-auto overflow-hidden shadow-2xl flex flex-col sm:flex-row" @click.stop>
      <!-- Botón de cerrar -->
      <button 
        @click="cerrarVistaPrevia"
        class="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2.5 sm:p-2 transition-colors shadow-lg"
        aria-label="Cerrar vista previa"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>

      <!-- MOBILE: Layout tipo Instagram -->
      <div class="flex-1 flex flex-col min-h-0 sm:hidden">
        <!-- Imagen arriba -->
        <div class="w-full flex-shrink-0 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center" style="max-height:40vh; min-height:120px;">
          <img 
            v-if="publicacion.image_url" 
            :src="publicacion.image_url" 
            alt="Imagen de la publicación" 
            class="max-h-[40vh] w-auto max-w-full object-contain rounded-b-none rounded-t-lg"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-gray-500 dark:text-gray-400 text-lg">Sin imagen</span>
          </div>
        </div>
        <!-- Usuario y texto -->
        <div class="px-4 pt-3 pb-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 flex-shrink-0">
          <div class="flex items-center gap-3 mb-2">
            <Avatar 
              :src="publicacion.avatar_url || usuario?.avatar_url" 
              :alt="'Avatar de ' + (publicacion.username || usuario?.username)" 
              :fallback-initial="(publicacion.username || usuario?.username)?.charAt(0)?.toUpperCase() || '?'" 
              img-class="h-9 w-9 rounded-full object-cover border-2 border-emerald-400" 
            />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-emerald-700 dark:text-emerald-400 text-base truncate">
                {{ publicacion.username || usuario?.username }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(publicacion.created_at).toLocaleString() }}
              </div>
            </div>
          </div>
          <p class="text-gray-900 dark:text-white text-sm leading-relaxed whitespace-pre-line">
            {{ publicacion.body }}
          </p>
        </div>
        <!-- Comentarios y formulario -->
        <div class="flex-1 min-h-0 flex flex-col bg-white dark:bg-neutral-900">
          <!-- Lista de comentarios con scroll -->
          <div class="flex-1 min-h-0 overflow-y-auto px-2 py-2">
            <ul class="space-y-3">
              <li v-for="comentario in comentarios" :key="comentario.id" class="flex items-start gap-2">
                <Avatar :src="comentario.avatar_url" :alt="'Avatar de ' + comentario.username" :fallback-initial="comentario.username?.charAt(0)?.toUpperCase() || '?'" img-class="h-7 w-7 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="font-semibold text-xs text-emerald-700 dark:text-emerald-400">{{ comentario.username }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(comentario.created_at).toLocaleString() }}</span>
                  </div>
                  <div class="text-xs text-gray-900 dark:text-white break-words">{{ comentario.body }}</div>
                </div>
              </li>
            </ul>
            <div v-if="cargandoComentarios" class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Cargando comentarios...</div>
          </div>
          <!-- Formulario fijo abajo -->
          <div class="p-3 border-t border-gray-300 dark:border-gray-800 bg-white/95 dark:bg-neutral-900/95 flex-shrink-0 backdrop-blur-md">
            <form v-if="usuarioActual" @submit.prevent="enviarComentario" class="flex items-end gap-2">
              <input 
                v-model="nuevoComentario" 
                type="text" 
                placeholder="Escribe un comentario..." 
                class="flex-1 p-2 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                :disabled="enviandoComentario" 
              />
              <button 
                type="submit" 
                class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap" 
                :disabled="enviandoComentario || !nuevoComentario.trim()"
              >
                {{ enviandoComentario ? 'Enviando...' : 'Comentar' }}
              </button>
            </form>
            <div v-if="errorComentario" class="text-xs text-red-600 dark:text-red-400 mt-1">{{ errorComentario }}</div>
          </div>
        </div>
      </div>

      <!-- DESKTOP: Mantener dos columnas -->
      <div class="hidden sm:flex flex-1 h-full">
        <!-- Columna izquierda: Imagen -->
        <div class="flex-1 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center min-h-[200px] sm:min-h-0 flex-shrink-0">
          <div class="flex-1 flex items-center justify-center w-full h-full p-4">
            <img 
              v-if="publicacion.image_url" 
              :src="publicacion.image_url" 
              alt="Imagen de la publicación" 
              class="max-w-full max-h-full object-contain rounded-lg"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500 dark:text-gray-400 text-lg">Sin imagen</span>
            </div>
          </div>
        </div>
        <!-- Columna derecha: Información y comentarios -->
        <div class="w-96 bg-white dark:bg-neutral-900 flex flex-col flex-shrink-0 min-h-0">
          <!-- Header con información del usuario -->
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div class="flex items-center gap-3 mb-4">
              <Avatar 
                :src="publicacion.avatar_url || usuario?.avatar_url" 
                :alt="'Avatar de ' + (publicacion.username || usuario?.username)" 
                :fallback-initial="(publicacion.username || usuario?.username)?.charAt(0)?.toUpperCase() || '?'" 
                img-class="h-12 w-12 rounded-full object-cover border-2 border-emerald-400" 
              />
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-emerald-700 dark:text-emerald-400 text-lg truncate">
                  {{ publicacion.username || usuario?.username }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(publicacion.created_at).toLocaleString() }}
                </div>
              </div>
            </div>
            <div class="mb-4">
              <p class="text-gray-900 dark:text-white text-base leading-relaxed whitespace-pre-line">
                {{ publicacion.body }}
              </p>
            </div>
            <footer class="flex items-center gap-4 mt-4">
              <time class="text-xs text-gray-500 dark:text-gray-400" :datetime="publicacion.created_at">
                {{ new Date(publicacion.created_at).toLocaleString() }}
              </time>
              <button @click="toggleComments" class="ml-auto p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-1" :aria-label="showComments ? 'Ocultar comentarios' : 'Comentar'">
                <ChatBubbleLeftRightIcon class="w-5 h-5" />
                <span class="text-xs text-gray-600 dark:text-gray-300 min-w-[1.5em] text-center">{{ comentarios.length }}</span>
              </button>
            </footer>
          </div>
          <!-- Comentarios y formulario -->
          <div v-if="showComments" class="flex-1 flex flex-col border-t border-gray-200 dark:border-gray-700 min-h-0">
            <div class="flex-1 overflow-y-auto p-4">
              <ul class="space-y-3">
                <li v-for="comentario in comentarios" :key="comentario.id" class="flex items-start gap-2">
                  <Avatar :src="comentario.avatar_url" :alt="'Avatar de ' + comentario.username" :fallback-initial="comentario.username?.charAt(0)?.toUpperCase() || '?'" img-class="h-7 w-7 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <span class="font-semibold text-xs text-emerald-700 dark:text-emerald-400">{{ comentario.username }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ new Date(comentario.created_at).toLocaleString() }}</span>
                    </div>
                    <div class="text-xs text-gray-900 dark:text-white break-words">{{ comentario.body }}</div>
                  </div>
                </li>
              </ul>
              <div v-if="cargandoComentarios" class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">Cargando comentarios...</div>
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 flex-shrink-0">
              <form v-if="usuarioActual" @submit.prevent="enviarComentario" class="flex items-end gap-2">
                <input 
                  v-model="nuevoComentario" 
                  type="text" 
                  placeholder="Escribe un comentario..." 
                  class="flex-1 p-2 rounded-lg border border-emerald-200 dark:border-gray-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                  :disabled="enviandoComentario" 
                />
                <button 
                  type="submit" 
                  class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap" 
                  :disabled="enviandoComentario || !nuevoComentario.trim()"
                >
                  {{ enviandoComentario ? 'Enviando...' : 'Comentar' }}
                </button>
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