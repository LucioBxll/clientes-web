<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 dark:text-primary-400">Blog</h1>
        <button 
          v-if="usuario"
          @click="mostrarCrearPublicacion = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
        >
          Nueva Publicación
        </button>
      </div>

      <!-- Modal para crear publicación -->
      <div v-if="mostrarCrearPublicacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Crear Nueva Publicación</h3>
            <button 
              @click="mostrarCrearPublicacion = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="crearPublicacion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input 
                v-model="nuevaPublicacion.titulo"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
              <textarea 
                v-model="nuevaPublicacion.contenido"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen (URL)</label>
              <input 
                v-model="nuevaPublicacion.imagen"
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="mostrarCrearPublicacion = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
              >
                Publicar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para editar publicación -->
      <div v-if="mostrarEditarPublicacion" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Editar Publicación</h3>
            <button 
              @click="mostrarEditarPublicacion = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="actualizarPublicacion" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input 
                v-model="publicacionEditando.titulo"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
              <textarea 
                v-model="publicacionEditando.contenido"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen (URL)</label>
              <input 
                v-model="publicacionEditando.imagen"
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="mostrarEditarPublicacion = false"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de publicaciones -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="publicacion in publicaciones" :key="publicacion.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
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
                @click="editarPublicacion(publicacion)"
                class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                v-if="usuario && usuario.id === publicacion.idUsuario"
                @click="eliminarPublicacion(publicacion.id)"
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
              @click="publicacion.mostrarContenidoCompleto = !publicacion.mostrarContenidoCompleto"
              class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
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
                  <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
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
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
                rows="2"
              ></textarea>
              <button
                @click="agregarComentario(publicacion)"
                class="mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser } from '../services/auth';

export default {
  name: 'Blog',
  data() {
    return {
      usuario: null,
      mostrarCrearPublicacion: false,
      mostrarEditarPublicacion: false,
      nuevaPublicacion: {
        titulo: '',
        contenido: '',
        imagen: ''
      },
      publicacionEditando: null,
      publicaciones: []
    }
  },
  methods: {
    async crearPublicacion() {
      if (!this.usuario) return;

      const publicacion = {
        id: Date.now(),
        titulo: this.nuevaPublicacion.titulo,
        contenido: this.nuevaPublicacion.contenido,
        imagen: this.nuevaPublicacion.imagen,
        autor: this.usuario.username || this.usuario.email,
        idUsuario: this.usuario.id,
        fechaCreacion: new Date(),
        comentarios: [],
        nuevoComentario: '',
        mostrarContenidoCompleto: false
      };

      this.publicaciones.unshift(publicacion);
      this.guardarPublicaciones();
      
      this.nuevaPublicacion = {
        titulo: '',
        contenido: '',
        imagen: ''
      };
      this.mostrarCrearPublicacion = false;
    },
    eliminarPublicacion(idPublicacion) {
      this.publicaciones = this.publicaciones.filter(pub => pub.id !== idPublicacion);
      this.guardarPublicaciones();
    },
    async agregarComentario(publicacion) {
      if (!this.usuario) {
        alert('Debes iniciar sesión para comentar');
        return;
      }

      if (publicacion.nuevoComentario.trim()) {
        publicacion.comentarios.push({
          id: Date.now(),
          autor: this.usuario.username || this.usuario.email,
          texto: publicacion.nuevoComentario
        });
        publicacion.nuevoComentario = '';
        this.guardarPublicaciones();
      }
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    guardarPublicaciones() {
      localStorage.setItem('blogPublicaciones', JSON.stringify(this.publicaciones));
    },
    cargarPublicaciones() {
      const guardadas = localStorage.getItem('blogPublicaciones');
      if (guardadas) {
        this.publicaciones = JSON.parse(guardadas);
      }
    },
    editarPublicacion(publicacion) {
      this.publicacionEditando = { ...publicacion };
      this.mostrarEditarPublicacion = true;
    },
    actualizarPublicacion() {
      if (!this.publicacionEditando) return;

      const index = this.publicaciones.findIndex(p => p.id === this.publicacionEditando.id);
      if (index !== -1) {
        this.publicaciones[index] = { ...this.publicacionEditando };
        this.guardarPublicaciones();
      }

      this.mostrarEditarPublicacion = false;
      this.publicacionEditando = null;
    }
  },
  async mounted() {
    this.usuario = await getCurrentUser();
    this.cargarPublicaciones();
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 