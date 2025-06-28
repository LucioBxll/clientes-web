<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div v-if="targetUser" class="flex items-center space-x-3">
              <img 
                :src="targetUser.avatar_url || '/default-avatar.png'" 
                :alt="targetUser.username"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 class="text-lg font-semibold text-gray-900">{{ targetUser.username }}</h1>
                <p class="text-sm text-gray-500">Chat privado</p>
              </div>
            </div>
            <div v-else class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div class="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Container -->
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
        
        <!-- Messages Area -->
        <div 
          ref="containerRef"
          class="flex-1 overflow-y-auto p-4 space-y-4"
          :class="{ 'opacity-50': loading }"
        >
          <!-- Loading State -->
          <div v-if="loading && messages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p class="text-gray-500 mt-2">Cargando mensajes...</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && messages.length === 0" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay mensajes aún</h3>
              <p class="text-gray-500">¡Inicia la conversación enviando un mensaje!</p>
            </div>
          </div>

          <!-- Messages -->
          <div v-else class="space-y-4">
            <div 
              v-for="message in messages" 
              :key="message.id"
              class="flex"
              :class="message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'"
            >
              <div 
                class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                :class="message.sender_id === currentUser?.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-900'"
              >
                <div class="flex items-start space-x-2">
                  <img 
                    v-if="message.sender_id !== currentUser?.id && message.sender?.avatar_url"
                    :src="message.sender.avatar_url" 
                    :alt="message.sender.username"
                    class="w-6 h-6 rounded-full object-cover flex-shrink-0"
                  />
                  <div class="flex-1">
                    <p class="text-sm break-words">{{ message.body }}</p>
                    <p 
                      class="text-xs mt-1"
                      :class="message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'"
                    >
                      {{ formatTime(message.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="border-t p-4">
          <form @submit.prevent="sendMessage" class="flex space-x-3">
            <div class="flex-1">
              <input
                v-model="messageText"
                type="text"
                placeholder="Escribe un mensaje..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="sending || !targetUser"
                @keydown.enter.prevent="sendMessage"
              />
            </div>
            <button
              type="submit"
              :disabled="!messageText.trim() || sending || !targetUser"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  subscribeToPrivateChatNewMessages 
} from '../services/private-chats';
import { useScrollToBottom } from '../composables/useScrollToBottom';

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
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  } finally {
    loading.value = false;
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

    // Agregar el mensaje a la lista localmente
    messages.value.push({
      ...message,
      sender: {
        id: currentUser.value.id,
        username: currentUser.value.username,
        avatar_url: currentUser.value.avatar_url
      }
    });

    messageText.value = '';
    
    // Scroll al final
    await forceScrollToBottom();
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
      // Solo agregar si no es nuestro propio mensaje (ya se agregó localmente)
      if (newMessage.sender_id !== currentUser.value.id) {
        // Obtener datos del remitente
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
          
          // Scroll automático si está cerca del final
          await autoScrollIfNearBottom();
        } catch (error) {
          console.error('Error al obtener datos del remitente:', error);
        }
      }
    }
  );
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
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
});

// Watchers
watch(messages, async () => {
  await nextTick();
  await autoScrollIfNearBottom();
}, { deep: true });
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 