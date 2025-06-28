import { ref, onMounted, onUnmounted } from 'vue';
import { 
  subscribeToChat, 
  unsubscribeFromChat, 
  subscribeToUserStatus,
  subscribeToChats,
  initializeRealtime
} from '../services/realtime';

/**
 * Composable para manejar Realtime en componentes Vue
 */
export function useRealtime() {
  const isConnected = ref(false);
  const activeSubscriptions = ref(new Set());

  /**
   * Suscribe a un chat específico
   */
  const subscribeToChatMessages = (chatId, callback) => {
    if (activeSubscriptions.value.has(chatId)) {
      return; // Ya está suscrito
    }

    const subscription = subscribeToChat(chatId, callback);
    activeSubscriptions.value.add(chatId);
    isConnected.value = true;

    return subscription;
  };

  /**
   * Desuscribe de un chat específico
   */
  const unsubscribeFromChatMessages = (chatId) => {
    if (activeSubscriptions.value.has(chatId)) {
      unsubscribeFromChat(chatId);
      activeSubscriptions.value.delete(chatId);
    }
  };

  /**
   * Suscribe a cambios de estado de usuarios
   */
  const subscribeToUserStatusChanges = (callback) => {
    const subscription = subscribeToUserStatus(callback);
    activeSubscriptions.value.add('user_status');
    return subscription;
  };

  /**
   * Suscribe a nuevos chats
   */
  const subscribeToNewChats = (userId, callback) => {
    const subscription = subscribeToChats(userId, callback);
    activeSubscriptions.value.add('user_chats');
    return subscription;
  };

  /**
   * Limpia todas las suscripciones
   */
  const cleanup = () => {
    activeSubscriptions.value.forEach((chatId) => {
      if (chatId === 'user_status' || chatId === 'user_chats') {
        // Estas suscripciones se manejan de forma diferente
        return;
      }
      unsubscribeFromChat(chatId);
    });
    activeSubscriptions.value.clear();
    isConnected.value = false;
  };

  // Inicializar Realtime al montar el composable
  onMounted(() => {
    initializeRealtime();
  });

  // Limpiar al desmontar
  onUnmounted(() => {
    cleanup();
  });

  return {
    isConnected,
    subscribeToChatMessages,
    unsubscribeFromChatMessages,
    subscribeToUserStatusChanges,
    subscribeToNewChats,
    cleanup
  };
}

/**
 * Composable específico para chat privado
 */
export function usePrivateChatRealtime() {
  const { subscribeToChatMessages, unsubscribeFromChatMessages } = useRealtime();
  const currentChatId = ref(null);

  const subscribeToPrivateChat = (chatId, callback) => {
    // Desuscribirse del chat anterior si existe
    if (currentChatId.value) {
      unsubscribeFromChatMessages(currentChatId.value);
    }

    // Suscribirse al nuevo chat
    currentChatId.value = chatId;
    return subscribeToChatMessages(chatId, callback);
  };

  const unsubscribeFromPrivateChat = () => {
    if (currentChatId.value) {
      unsubscribeFromChatMessages(currentChatId.value);
      currentChatId.value = null;
    }
  };

  return {
    subscribeToPrivateChat,
    unsubscribeFromPrivateChat,
    currentChatId
  };
} 