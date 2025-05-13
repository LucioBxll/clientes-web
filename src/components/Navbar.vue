<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { subscribeToUserState, logout } from '../services/auth';
import Avatar from './Avatar.vue';

export default {
  name: 'BarraNavegacion',
  components: { Avatar },
  props: {
    isDark: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const ruta = useRoute();
    const menuAbierto = ref(false);
    const menuPerfilAbierto = ref(false);
    const refMenuPerfil = ref(null);
    const usuario = ref({ id: null, email: null, username: null });
    
    // Suscribirse a los cambios en el estado del usuario
    onMounted(() => {
      subscribeToUserState(nuevoEstadoUsuario => {
        usuario.value = nuevoEstadoUsuario;
      });

      // Agregar event listener para cerrar el menú al hacer clic fuera
      document.addEventListener('click', (event) => {
        if (refMenuPerfil.value && !refMenuPerfil.value.contains(event.target)) {
          menuPerfilAbierto.value = false;
        }
      });
    });

    // Limpiar event listener al desmontar el componente
    onUnmounted(() => {
      document.removeEventListener('click', (event) => {
        if (refMenuPerfil.value && !refMenuPerfil.value.contains(event.target)) {
          menuPerfilAbierto.value = false;
        }
      });
    });

    const enlacesNavegacion = ref([
      { nombre: 'Inicio', ruta: '/' },
      { nombre: 'Novedades', ruta: '/novedades' },
      { nombre: 'Chat Global', ruta: '/chat-global', requiereAuth: true },
      { nombre: 'Iniciar Sesión', ruta: '/ingresar', requiereAuth: false },
      { nombre: 'Registrarse', ruta: '/registro', requiereAuth: false }
    ]);

    const alternarMenu = () => {
      menuAbierto.value = !menuAbierto.value;
    };

    const alternarMenuPerfil = () => {
      menuPerfilAbierto.value = !menuPerfilAbierto.value;
    };

    // Filtrar los enlaces basados en el estado de autenticación
    const enlacesFiltrados = () => {
      return enlacesNavegacion.value.filter(enlace => {
        if (enlace.requiereAuth === undefined) return true;
        return enlace.requiereAuth === (usuario.value.id !== null);
      });
    };

    const cerrarSesion = async () => {
      try {
        await logout();
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/ingresar';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };

    return {
      ruta,
      menuAbierto,
      menuPerfilAbierto,
      refMenuPerfil,
      usuario,
      enlacesFiltrados,
      alternarMenu,
      alternarMenuPerfil,
      cerrarSesion
    };
  }
};
</script>

<template>
  <nav class="bg-primary-50 dark:bg-gray-800 shadow-sm border-b border-primary-100 dark:border-gray-700 transition-colors duration-200" :style="{'background-color': 'var(--color-primary)'}">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="../public/logo.svg" alt="Logo" class="h-8 w-8 mr-2" />
            <span class="text-xl font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-lovelo-line-bold">minima</span>
          </router-link>
        </div>

        <!-- Enlaces de navegación para desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            v-for="(enlace, index) in enlacesFiltrados()" 
            :key="index"
            :to="enlace.ruta"
            :class="[
              'px-3 py-2 relative transition-all duration-200 font-medium',
              isDark ? 'text-white' : 'text-emerald-600',
              'group',
            ]"
          >
            <span>{{ enlace.nombre }}</span>
            <span
              class="absolute left-0 right-0 -bottom-1 h-0.5 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
              :class="ruta.path === enlace.ruta ? 'scale-x-100' : ''"
            ></span>
          </router-link>
          
          <!-- Menú de perfil -->
          <div class="relative" v-if="usuario.id" ref="refMenuPerfil">
            <button
              @click="alternarMenuPerfil"
              class="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <span class="sr-only">Abrir menú de usuario</span>
              <Avatar
                :src="usuario.avatar_url"
                :alt="'Avatar de ' + (usuario.username || usuario.email)"
                :fallback-initial="usuario.username?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'"
                img-class="h-8 w-8 rounded-full object-cover border-2 border-emerald-400"
              />
            </button>
            <!-- Menú desplegable -->
            <div
              v-show="menuPerfilAbierto"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <router-link
                to="/perfil"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Mi Perfil
              </router-link>
              <button
                @click="cerrarSesion"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
          
          <!-- Botón de tema -->
          <button
            @click="$emit('toggle-dark')"
            class="p-2 rounded-lg text-emerald-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200"
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <span v-if="isDark" class="text-lg">🌞</span>
            <span v-else class="text-lg">🌙</span>
          </button>
        </div>

        <!-- Botón de menú móvil -->
        <div class="md:hidden flex items-center space-x-2">

          <button
            @click="alternarMenu"
            class="p-2 rounded-lg text-emerald-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!menuAbierto"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Offcanvas móvil -->
    <transition name="slide-x">
      <div v-if="menuAbierto" class="fixed inset-0 z-50 flex">
        <!-- Fondo oscuro -->
        <div class="fixed inset-0 bg-black bg-opacity-40" @click="alternarMenu"></div>
        <!-- Panel lateral -->
        <div class="ml-auto w-72 max-w-full h-full bg-primary-50 dark:bg-gray-800 shadow-lg flex flex-col relative animate-slide-in-right" :style="{'background-color': 'var(--color-primary)'}">
          <!-- Logo -->
          <div class="flex items-center justify-between px-4 py-4 border-b border-primary-100 dark:border-gray-700">
            <router-link to="/" class="text-xl font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-lovelo-line-bold">
              minima
            </router-link>
            <button @click="alternarMenu" class="text-2xl text-emerald-600 dark:text-gray-300 focus:outline-none ml-2">&times;</button>
          </div>
          <!-- Foto y perfil -->
          <div v-if="usuario.id" class="px-4 py-4 flex flex-row items-center gap-4 border-b border-primary-100 dark:border-gray-700">
            <Avatar
              :src="usuario.avatar_url"
              :alt="'Avatar de ' + (usuario.username || usuario.email)"
              :fallback-initial="usuario.username?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'"
              img-class="h-12 w-12 rounded-full object-cover border-2 border-emerald-400"
            />
            <router-link
              to="/perfil"
              class="block text-emerald-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
              @click="alternarMenu"
            >
              Mi Perfil
            </router-link>
          </div>
          <!-- Navegación -->
          <div class="flex-1 overflow-y-auto px-2 pt-2 pb-3 space-y-1 flex flex-col border-b border-primary-100 dark:border-gray-700">
            <router-link 
              v-for="(enlace, index) in enlacesFiltrados()" 
              :key="index"
              :to="enlace.ruta"
              :class="[
                'block px-3 py-2 relative transition-all duration-200 font-medium',
                isDark ? 'text-white' : 'text-emerald-600',
                'group',
              ]"
              @click="alternarMenu"
            >
              <span>{{ enlace.nombre }}</span>
              <span
                class="absolute left-0 right-0 -bottom-1 h-0.5 bg-emerald-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                :class="ruta.path === enlace.ruta ? 'scale-x-100' : ''"
              ></span>
            </router-link>
          </div>
          <!-- Modo oscuro/claro -->
          <div class="px-4 py-4 border-b border-primary-100 dark:border-gray-700 flex items-center">
            <button
              @click="$emit('toggle-dark')"
              class="p-2 rounded-lg text-emerald-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200 w-full text-center"
            >
              <span v-if="isDark">🌞 Modo claro</span>
              <span v-else>🌙 Modo oscuro</span>
            </button>
          </div>
          <!-- Cerrar sesión -->
          <div v-if="usuario.id" class="px-4 py-4">
            <button
              @click="cerrarSesion"
              class="block w-full text-left text-red-600 hover:bg-emerald-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.slide-x-enter-active, .slide-x-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-x-enter-from, .slide-x-leave-to {
  transform: translateX(100%);
}
.slide-x-enter-to, .slide-x-leave-from {
  transform: translateX(0);
}
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.router-link-active span,
.router-link-exact-active span {
  font-weight: bold;
}
</style> 