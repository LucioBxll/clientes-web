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
            <div v-if="targetUser" class="flex items-center space-x-3">
              <Avatar 
                :src="targetUser.avatar_url" 
                :alt="targetUser.username"
                :inicial-fallback="targetUser.username?.charAt(0)?.toUpperCase() || '?'"
                clase-imagen="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
              <div>
                <h1 class="text-lg font-semibold text-emerald-800 dark:text-white">{{ targetUser.username }}</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Chat privado</p>
              </div>
            </div>
            <div v-else class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div>
                <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="max-w-4xl min-h-screen  mx-auto px-4 py-6">
      <div class="bg-white dark:bg-neutral-950 rounded-lg shadow-sm border border-emerald-200 dark:border-gray-700 h-[80vh] flex flex-col">
        
        <!-- Messages Area -->
        <div 
          ref="containerRef"
          class="flex-1 min-h-[70vh] overflow-y-auto p-4 space-y-4"
          :class="{ 'opacity-50': loading }"
        >
          <!-- Loading State -->
          <div v-if="loading && messages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p class="text-gray-500 dark:text-gray-400 mt-2">Cargando mensajes...</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && messages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-emerald-800 dark:text-white mb-2">No hay mensajes aún</h3>
              <p class="text-gray-500 dark:text-gray-400">¡Inicia la conversación enviando un mensaje!</p>
            </div>
          </div>

          <!-- Messages -->
          <div v-else class="space-y-4">
            <PrivateMessageItem
              v-for="message in messages" 
              :key="message.id"
              :message="message"
              :current-user-id="currentUser?.id"
            />
          </div>
        </div>

        <!-- Message Input -->
        <div class="border-t border-emerald-200 dark:border-gray-700 p-4">
          <form @submit.prevent="sendMessage" class="flex space-x-3">
            <div class="flex-1">
              <input
                v-model="messageText"
                type="text"
                placeholder="Escribe un mensaje..."
                class="w-full px-4 py-2 border border-emerald-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-neutral-900 text-emerald-800 dark:text-white placeholder-gray-400"
                :disabled="sending || !targetUser"
                @keydown.enter.prevent="sendMessage"
              />
            </div>
            <button
              type="submit"
              :disabled="!messageText.trim() || sending || !targetUser"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              <div v-if="sending" class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </div>
              <span v-else>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentUser } from '../services/auth';
import { getUserById } from '../services/users';
import { 
  fetchLastPrivateChatMessages, 
  sendPrivateChatMessage, 
  subscribeToPrivateChatNewMessages,
  unsubscribeFromPrivateChatMessages,
  markChatAsRead,
  fetchPrivateChat
} from '../services/private-chats';
import { useScrollToBottom } from '../composables/useScrollToBottom';
import Avatar from '../components/Avatar.vue';
import PrivateMessageItem from '../components/PrivateMessageItem.vue';

// Props y composables
const route = useRoute();
const router = useRouter();

// Estado reactivo
const currentUser = ref(null);
const targetUser = ref(null);
const messages = ref([]);
const messageText = ref('');
const loading = ref(true);
const sending = ref(false);
const subscription = ref(null);

// Scroll automático
const { containerRef, forceScrollToBottom, autoScrollIfNearBottom } = useScrollToBottom();

// Computed
const targetUserId = computed(() => route.params.userId);

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

const loadTargetUser = async () => {
  try {
    if (!targetUserId.value) {
      router.push('/');
      return;
    }

    targetUser.value = await getUserById(targetUserId.value);
    if (!targetUser.value) {
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al cargar usuario objetivo:', error);
    router.push('/');
  }
};

const loadMessages = async () => {
  try {
    loading.value = true;
    const fetchedMessages = await fetchLastPrivateChatMessages(
      currentUser.value.id, 
      targetUserId.value
    );
    messages.value = fetchedMessages;
    
    // Marcar mensajes como leídos
    await markMessagesAsRead();
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  } finally {
    loading.value = false;
  }
};

const markMessagesAsRead = async () => {
  try {
    // Obtener el chat ID para marcar como leído
    const chat = await fetchPrivateChat(currentUser.value.id, targetUserId.value);
    if (chat) {
      await markChatAsRead(chat.id, currentUser.value.id);
    }
  } catch (error) {
    console.error('Error al marcar mensajes como leídos:', error);
  }
};

const sendMessage = async () => {
  if (!messageText.value.trim() || sending.value || !targetUser.value) return;

  try {
    sending.value = true;
    const message = await sendPrivateChatMessage(
      currentUser.value.id,
      targetUserId.value,
      messageText.value
    );

    // NO agregar el mensaje localmente - llegará a través de Realtime
    // messages.value.push({
    //   ...message,
    //   sender: {
    //     id: currentUser.value.id,
    //     username: currentUser.value.username,
    //     avatar_url: currentUser.value.avatar_url
    //   }
    // });

    messageText.value = '';
    
    // Scroll al final después de un breve delay para que llegue el mensaje por Realtime
    setTimeout(async () => {
      await forceScrollToBottom();
    }, 100);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    alert('Error al enviar el mensaje. Por favor, intenta nuevamente.');
  } finally {
    sending.value = false;
  }
};

const setupRealtimeSubscription = () => {
  if (!currentUser.value || !targetUserId.value) return;

  subscription.value = subscribeToPrivateChatNewMessages(
    currentUser.value.id,
    targetUserId.value,
    async (newMessage) => {
      // Evitar duplicados por id
      if (messages.value.some(m => m.id === newMessage.id)) return;
      try {
        const sender = await getUserById(newMessage.sender_id);
        messages.value.push({
          ...newMessage,
          sender: {
            id: sender.id,
            username: sender.username,
            avatar_url: sender.avatar_url
          }
        });
        // Marcar como leído si no es nuestro mensaje
        if (newMessage.sender_id !== currentUser.value.id) {
          await markMessagesAsRead();
        }
        await autoScrollIfNearBottom();
      } catch (error) {
        console.error('Error al procesar mensaje recibido:', error);
      }
    }
  );
};

// Lifecycle
onMounted(async () => {
  await loadCurrentUser();
  await loadTargetUser();
  await loadMessages();
  setupRealtimeSubscription();
  
  // Scroll inicial al final
  await forceScrollToBottom();
});

onUnmounted(() => {
  if (subscription.value) {
    subscription.value.unsubscribe();
  }
  // También desuscribirse usando el nuevo sistema
  if (currentUser.value && targetUserId.value) {
    fetchPrivateChat(currentUser.value.id, targetUserId.value).then(chat => {
      if (chat) {
        unsubscribeFromPrivateChatMessages(chat.id);
      }
    }).catch(error => {
      console.error('Error al desuscribirse:', error);
    });
  }
});

// Watchers
watch(messages, async () => {
  await nextTick();
  await autoScrollIfNearBottom();
}, { deep: true });
</script>

<style scoped>
/* Estilos para la barra de scroll personalizada */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f0fdf4; /* emerald-50 */
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #10b981; /* emerald-500 */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #059669; /* emerald-600 */
}

/* Estilos para modo oscuro */
.dark .overflow-y-auto::-webkit-scrollbar-track {
  background: #064e3b; /* emerald-950 */
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #34d399; /* emerald-400 */
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #10b981; /* emerald-500 */
}

/* Estilos para Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #10b981 #f0fdf4; /* thumb track */
}

.dark .overflow-y-auto {
  scrollbar-color: #34d399 #064e3b; /* thumb track */
}
</style> 