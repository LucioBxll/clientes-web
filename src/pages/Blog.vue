<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary-600 dark:text-primary-400">Blog</h1>
        <button 
          v-if="user"
          @click="showCreatePost = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
        >
          Nueva Publicación
        </button>
      </div>

      <!-- Modal para crear publicación -->
      <div v-if="showCreatePost" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Crear Nueva Publicación</h3>
            <button 
              @click="showCreatePost = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createPost" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input 
                v-model="newPost.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
              <textarea 
                v-model="newPost.content"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen (URL)</label>
              <input 
                v-model="newPost.image"
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="showCreatePost = false"
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
      <div v-if="showEditPost" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Editar Publicación</h3>
            <button 
              @click="showEditPost = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="updatePost" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input 
                v-model="editingPost.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
              <textarea 
                v-model="editingPost.content"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen (URL)</label>
              <input 
                v-model="editingPost.image"
                type="url" 
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>

            <div class="flex justify-end space-x-3">
              <button 
                type="button"
                @click="showEditPost = false"
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
        <div v-for="post in posts" :key="post.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ post.title }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Publicado por {{ post.author }} el {{ formatDate(post.createdAt) }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button 
                v-if="user && user.id === post.userId"
                @click="editPost(post)"
                class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                v-if="user && user.id === post.userId"
                @click="deletePost(post.id)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="post.image" class="mb-4">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-48 object-cover rounded-lg"
            >
          </div>

          <div class="mb-4">
            <p v-if="!post.showFullContent" class="text-gray-600 dark:text-gray-300">
              {{ post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content }}
            </p>
            <p v-else class="text-gray-600 dark:text-gray-300 whitespace-pre-line">{{ post.content }}</p>
            <button 
              v-if="post.content.length > 150"
              @click="post.showFullContent = !post.showFullContent"
              class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {{ post.showFullContent ? 'Ver menos' : 'Ver más' }}
            </button>
          </div>

          <!-- Comentarios -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentarios</h4>
            <div class="space-y-3">
              <div v-for="comment in post.comments" :key="comment.id" 
                class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div class="flex items-start space-x-3">
                  <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {{ comment.author.charAt(0) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comment.author }}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ comment.text }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario de comentario -->
            <div class="mt-4">
              <textarea
                v-model="post.newComment"
                placeholder="Escribe un comentario..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
                rows="2"
              ></textarea>
              <button
                @click="addComment(post)"
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
      user: null,
      showCreatePost: false,
      showEditPost: false,
      newPost: {
        title: '',
        content: '',
        image: ''
      },
      editingPost: null,
      posts: []
    }
  },
  methods: {
    async createPost() {
      if (!this.user) return;

      const post = {
        id: Date.now(),
        title: this.newPost.title,
        content: this.newPost.content,
        image: this.newPost.image,
        author: this.user.username || this.user.email,
        userId: this.user.id,
        createdAt: new Date(),
        comments: [],
        newComment: '',
        showFullContent: false
      };

      this.posts.unshift(post);
      this.savePosts();
      
      this.newPost = {
        title: '',
        content: '',
        image: ''
      };
      this.showCreatePost = false;
    },
    deletePost(postId) {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.savePosts();
    },
    async addComment(post) {
      if (!this.user) {
        alert('Debes iniciar sesión para comentar');
        return;
      }

      if (post.newComment.trim()) {
        post.comments.push({
          id: Date.now(),
          author: this.user.username || this.user.email,
          text: post.newComment
        });
        post.newComment = '';
        this.savePosts();
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    savePosts() {
      localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    },
    loadPosts() {
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        this.posts = JSON.parse(savedPosts);
      }
    },
    editPost(post) {
      this.editingPost = { ...post };
      this.showEditPost = true;
    },
    updatePost() {
      if (!this.editingPost) return;

      const index = this.posts.findIndex(p => p.id === this.editingPost.id);
      if (index !== -1) {
        this.posts[index] = { ...this.editingPost };
        this.savePosts();
      }

      this.showEditPost = false;
      this.editingPost = null;
    }
  },
  async mounted() {
    this.user = await getCurrentUser();
    this.loadPosts();
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 