<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ publicacion.titulo }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Publicado por {{ publicacion.autor }} el {{ formatearFecha(publicacion.fechaCreacion) }}
        </p>
      </div>
      <div class="flex space-x-2">
        <button 
          v-if="usuario && usuario.id === publicacion.idUsuario"
          @click="$emit('editar', publicacion)"
          class="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          v-if="usuario && usuario.id === publicacion.idUsuario"
          @click="$emit('eliminar', publicacion.id)"
          class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <div v-if="publicacion.imagen" class="mb-4">
      <img 
        :src="publicacion.imagen" 
        :alt="publicacion.titulo"
        class="w-full h-48 object-cover rounded-lg"
      >
    </div>
    <div class="mb-4">
      <p v-if="!publicacion.mostrarContenidoCompleto" class="text-gray-600 dark:text-gray-300">
        {{ publicacion.contenido.length > 150 ? publicacion.contenido.substring(0, 150) + '...' : publicacion.contenido }}
      </p>
      <p v-else class="text-gray-600 dark:text-gray-300 whitespace-pre-line">{{ publicacion.contenido }}</p>
      <button 
        v-if="publicacion.contenido.length > 150"
        @click="$emit('toggle-contenido', publicacion)"
        class="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
      >
        {{ publicacion.mostrarContenidoCompleto ? 'Ver menos' : 'Ver más' }}
      </button>
    </div>
    <!-- Comentarios -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentarios</h4>
      <div class="space-y-3">
        <div v-for="comentario in publicacion.comentarios" :key="comentario.id" 
          class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span class="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {{ comentario.autor.charAt(0) }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comentario.autor }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ comentario.texto }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Formulario de comentario -->
      <div class="mt-4">
        <textarea
          v-model="publicacion.nuevoComentario"
          placeholder="Escribe un comentario..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
          rows="2"
        ></textarea>
        <button
          @click="$emit('comentar', publicacion)"
          class="mt-2 px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Comentar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogCard',
  props: {
    publicacion: Object,
    usuario: Object
  },
  methods: {
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script> 