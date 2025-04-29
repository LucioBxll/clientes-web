<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { subscribeToUserState, logout } from '../services/auth';

export default {
  name: 'Navbar',
  props: {
    isDark: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    const route = useRoute();
    const menuOpen = ref(false);
    const profileMenuOpen = ref(false);
    const user = ref({ id: null, email: null, username: null });
    
    // Suscribirse a los cambios en el estado del usuario
    onMounted(() => {
      subscribeToUserState(newUserState => {
        user.value = newUserState;
      });
    });

    const navLinks = ref([
      { name: 'Home', path: '/' },
      { name: 'Chat Global', path: '/chat-global', requiresAuth: true },
      { name: 'Iniciar Sesión', path: '/ingresar', requiresAuth: false },
      { name: 'Registrarse', path: '/registro', requiresAuth: false }
    ]);

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value;
    };

    // Filtrar los enlaces basados en el estado de autenticación
    const filteredNavLinks = () => {
      return navLinks.value.filter(link => {
        if (link.requiresAuth === undefined) return true;
        return link.requiresAuth === (user.value.id !== null);
      });
    };

    const handleLogout = async () => {
      try {
        await logout();
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/login';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };

    return {
      route,
      menuOpen,
      profileMenuOpen,
      user,
      filteredNavLinks,
      toggleMenu,
      toggleProfileMenu,
      handleLogout
    };
  }
};
</script>

<template>
  <nav class="bg-primary-50 dark:bg-gray-800 shadow-sm border-b border-primary-100 dark:border-gray-700 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            DV Social
          </router-link>
        </div>

        <!-- Enlaces de navegación para desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            v-for="(link, index) in filteredNavLinks()" 
            :key="index"
            :to="link.path"
            :class="[
              'px-3 py-2 rounded-lg transition-all duration-200',
              'text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700',
              route.path === link.path ? 'bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-bold' : ''
            ]"
          >
            {{ link.name }}
          </router-link>
          
          <!-- Menú de perfil -->
          <div class="relative" v-if="user.id">
            <button
              @click="toggleProfileMenu"
              class="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span class="sr-only">Abrir menú de usuario</span>
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                {{ user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() }}
              </div>
            </button>
            <!-- Menú desplegable -->
            <div
              v-show="profileMenuOpen"
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
                @click="handleLogout"
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
            class="p-2 rounded-lg text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 transition-all duration-200"
            :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            <span v-if="isDark" class="text-lg">🌞</span>
            <span v-else class="text-lg">🌙</span>
          </button>
        </div>

        <!-- Botón de menú móvil -->
        <div class="md:hidden flex items-center space-x-2">
          <!-- Botón de tema para móvil -->
          <button
            @click="$emit('toggle-dark')"
            class="p-2 rounded-lg text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <span v-if="isDark" class="text-lg">🌞</span>
            <span v-else class="text-lg">🌙</span>
          </button>

          <button
            @click="toggleMenu"
            class="p-2 rounded-lg text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!menuOpen"
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

    <!-- Menú móvil -->
    <div
      v-show="menuOpen"
      class="md:hidden bg-primary-50 dark:bg-gray-800 border-t border-primary-100 dark:border-gray-700 shadow-md transition-colors duration-200"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <router-link 
          v-for="(link, index) in filteredNavLinks()" 
          :key="index"
          :to="link.path"
          :class="[
            'block px-3 py-2 rounded-lg transition-all duration-200',
            'text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700',
            route.path === link.path ? 'bg-primary-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-bold' : ''
          ]"
        >
          {{ link.name }}
        </router-link>
        
        <!-- Menú de perfil móvil -->
        <div v-if="user.id" class="px-3 py-2">
          <router-link
            to="/perfil"
            class="block text-secondary-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
          >
            Mi Perfil
          </router-link>
          <button
            @click="handleLogout"
            class="block w-full text-left text-red-600 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template> 