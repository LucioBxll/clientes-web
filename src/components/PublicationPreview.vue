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
        <div class="flex-1 bg-gray-100 dark:bg-neutral-800 flex flex-col items-center justify-between">
          <div class="flex-1 flex items-center justify-center w-full">
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
          <!-- Formulario para comentar en la columna izquierda -->
          <div class="w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div v-if="usuario">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Agregar un comentario</h4>
              <form @submit.prevent="enviarComentario" class="flex gap-3">
                <input 
                  v-model="nuevoComentario" 
                  type="text" 
                  placeholder="Escribe un comentario..." 
                  class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" 
                  :disabled="enviandoComentario" 
                />
                <button 
                  type="submit" 
                  class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors" 
                  :disabled="enviandoComentario || !nuevoComentario.trim()"
                >
                  <span v-if="enviandoComentario">Enviando...</span>
                  <span v-else>Comentar</span>
                </button>
              </form>
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
          </div>

          <!-- Sección de comentarios -->
          <div class="flex-1 flex flex-col">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <ChatBubbleLeftRightIcon class="w-5 h-5 text-emerald-600" />
                Comentarios ({{ publicacion.comentarios?.length || 0 }})
              </h3>
            </div>

            <!-- Lista de comentarios -->
            <div class="flex-1 overflow-y-auto p-4">
              <div v-if="!publicacion.comentarios || publicacion.comentarios.length === 0" 
                   class="text-center text-gray-500 dark:text-gray-400 py-8">
                No hay comentarios aún.
              </div>
              <div v-else class="space-y-4">
                <div v-for="comentario in publicacion.comentarios" 
                     :key="comentario.id" 
                     class="flex items-start gap-3 bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
                  <Avatar 
                    :src="comentario.avatar_url" 
                    :alt="'Avatar de ' + comentario.username" 
                    :fallback-initial="comentario.username?.charAt(0)?.toUpperCase() || '?'" 
                    img-class="h-8 w-8 rounded-full object-cover border border-emerald-400" 
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                        {{ comentario.username }}
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ new Date(comentario.created_at).toLocaleString() }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-900 dark:text-white">
                      {{ comentario.body }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline';
import Avatar from './Avatar.vue';
import { agregarComentarioAGlobalChat, obtenerComentariosDeMensaje } from '../services/global-chat';

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
    const nuevoComentario = ref('');
    const enviandoComentario = ref(false);

    const cerrarVistaPrevia = () => {
      emit('cerrar');
    };

    const enviarComentario = async () => {
      if (!props.usuario || !props.publicacion.id) return;

      try {
        enviandoComentario.value = true;
        
        const comentario = nuevoComentario.value;
        if (!comentario || !comentario.trim()) {
          throw new Error('El comentario no puede estar vacío');
        }
        
        // Agregar el comentario usando el servicio
        await agregarComentarioAGlobalChat(props.publicacion.id, comentario, props.usuario);
        
        // Recargar comentarios
        const comentariosActualizados = await obtenerComentariosDeMensaje(props.publicacion.id);
        
        // Limpiar el formulario
        nuevoComentario.value = '';
        
        // Emitir evento para actualizar la publicación
        emit('comentario-enviado', {
          publicacionId: props.publicacion.id,
          comentarios: comentariosActualizados
        });
      } catch (error) {
        console.error('Error al enviar el comentario:', error);
        alert('Error al enviar el comentario. Inténtalo de nuevo.');
      } finally {
        enviandoComentario.value = false;
      }
    };

    // Limpiar formulario cuando se cierra el modal
    watch(() => props.mostrar, (nuevoValor) => {
      if (!nuevoValor) {
        nuevoComentario.value = '';
      }
    });

    return {
      nuevoComentario,
      enviandoComentario,
      cerrarVistaPrevia,
      enviarComentario
    };
  }
};
</script> 