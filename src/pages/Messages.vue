<template>
  <div class="min-h-screen bg-white dark:bg-neutral-950">
    <!-- Header -->
    <div class="bg-white dark:bg-neutral-950 shadow-sm border-b border-emerald-200 dark:border-gray-700">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-emerald-700 dark:text-emerald-400"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold text-emerald-800 dark:text-white">Mensajes</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Tus conversaciones privadas</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Cargando conversaciones...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && chats.length === 0" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-emerald-800 dark:text-white mb-2">No tienes conversaciones</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">Inicia una conversación visitando el perfil de otro usuario</p>
          <router-link 
            to="/" 
            class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Ir al inicio
          </router-link>
        </div>
      </div>

      <!-- Chat List -->
      <div v-else class="space-y-2">
        <div 
          v-for="chat in chats" 
          :key="chat.id"
          @click="openChat(chat)"
          class="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-200 dark:border-gray-700"
        >
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <Avatar 
              :src="chat.otherUser?.avatar_url" 
              :username="chat.otherUser?.username"
              class="w-12 h-12"
            />
            
            <!-- Online Status -->
            <div 
              v-if="chat.otherUser?.status === 'online'"
              class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"
              title="En línea"
            ></div>
          </div>

          <!-- Chat Info -->
          <div class="flex-1 min-w-0">
            <!-- Username and Time -->
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                {{ chat.otherUser?.username || 'Usuario desconocido' }}
              </h3>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTime(chat.lastMessage?.created_at || chat.updatedAt) }}
                </span>
                
                <!-- Unread Badge -->
                <div 
                  v-if="chat.unreadCount > 0"
                  class="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center"
                >
                  {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
                </div>
              </div>
            </div>

            <!-- Last Message -->
            <div class="flex items-center space-x-2">
              <p 
                class="text-sm text-gray-600 dark:text-gray-300 truncate flex-1"
                :class="{ 'font-semibold text-emerald-800 dark:text-emerald-400': chat.unreadCount > 0 }"
              >
                <span v-if="chat.lastMessage?.sender_id === currentUser?.id" class="text-emerald-600 dark:text-emerald-400 mr-1">
                  Tú:
                </span>
                <span v-else-if="chat.lastMessage" class="text-emerald-600 dark:text-emerald-400 mr-1">
                  {{ chat.otherUser?.username }}:
                </span>
                {{ chat.lastMessage?.body || 'No hay mensajes aún' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from '../services/auth';
import { getUserPrivateChats, getUnreadMessageCount } from '../services/private-chats';
import Avatar from '../components/Avatar.vue';

// Composables
const router = useRouter();

// Estado reactivo
const currentUser = ref(null);
const chats = ref([]);
const loading = ref(true);
const error = ref(null);

// Métodos
const loadCurrentUser = async () => {
  try {
    currentUser.value = await getCurrentUser();
    if (!currentUser.value) {
      router.push('/ingresar');
    }
  } catch (error) {
    console.error('Error al cargar usuario actual:', error);
    router.push('/ingresar');
  }
};

const loadChats = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const userChats = await getUserPrivateChats(currentUser.value.id);
    
    // Obtener conteo de mensajes no leídos para cada chat
    const chatsWithUnreadCount = await Promise.all(
      userChats.map(async (chat) => {
        const unreadCount = await getUnreadMessageCount(chat.id, currentUser.value.id);
        return {
          ...chat,
          unreadCount
        };
      })
    );
    
    chats.value = chatsWithUnreadCount;
  } catch (err) {
    console.error('Error al cargar chats:', err);
    error.value = 'Error al cargar las conversaciones. Por favor, intenta nuevamente.';
  } finally {
    loading.value = false;
  }
};

const openChat = (chat) => {
  router.push(`/chat-privado/${chat.otherUser.id}`);
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffInHours < 48) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
};

// Lifecycle
onMounted(async () => {
  await loadCurrentUser();
  await loadChats();
});

const navigateToChat = (chatId) => {
  router.push(`/chat-privado/${chatId}`);
};
</script> 