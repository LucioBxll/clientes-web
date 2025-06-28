import supabase from './supabase';

// Cache de suscripciones activas
const activeSubscriptions = new Map();

/**
 * Configura y habilita Realtime para mensajes privados
 */
export function setupRealtime() {
    // Habilitar Realtime para la tabla private_messages
    supabase
        .channel('private_messages_realtime')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'private_messages'
            },
            (payload) => {
                console.log('Cambio en mensajes privados:', payload);
                handleMessageChange(payload);
            }
        )
        .subscribe();
}

/**
 * Maneja los cambios en mensajes
 */
function handleMessageChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
        case 'INSERT':
            handleNewMessage(newRecord);
            break;
        case 'UPDATE':
            handleMessageUpdate(newRecord, oldRecord);
            break;
        case 'DELETE':
            handleMessageDelete(oldRecord);
            break;
    }
}

/**
 * Maneja nuevos mensajes
 */
function handleNewMessage(message) {
    // Emitir evento personalizado para que los componentes puedan escuchar
    window.dispatchEvent(new CustomEvent('newPrivateMessage', {
        detail: { message }
    }));
}

/**
 * Maneja actualizaciones de mensajes
 */
function handleMessageUpdate(newMessage, oldMessage) {
    window.dispatchEvent(new CustomEvent('privateMessageUpdated', {
        detail: { newMessage, oldMessage }
    }));
}

/**
 * Maneja eliminación de mensajes
 */
function handleMessageDelete(message) {
    window.dispatchEvent(new CustomEvent('privateMessageDeleted', {
        detail: { message }
    }));
}

/**
 * Suscribe a un chat específico
 */
export function subscribeToChat(chatId, callback) {
    // Limpiar suscripción anterior si existe
    if (activeSubscriptions.has(chatId)) {
        activeSubscriptions.get(chatId).unsubscribe();
    }

    const subscription = supabase
        .channel(`chat_${chatId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'private_messages',
                filter: `chat_id=eq.${chatId}`
            },
            (payload) => {
                callback(payload.new);
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'private_messages',
                filter: `chat_id=eq.${chatId}`
            },
            (payload) => {
                callback(payload.new, 'UPDATE');
            }
        )
        .subscribe();

    activeSubscriptions.set(chatId, subscription);
    return subscription;
}

/**
 * Desuscribe de un chat específico
 */
export function unsubscribeFromChat(chatId) {
    if (activeSubscriptions.has(chatId)) {
        activeSubscriptions.get(chatId).unsubscribe();
        activeSubscriptions.delete(chatId);
    }
}

/**
 * Desuscribe de todos los chats
 */
export function unsubscribeFromAllChats() {
    activeSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
    });
    activeSubscriptions.clear();
}

/**
 * Suscribe a cambios en el estado de usuarios (online/offline)
 */
export function subscribeToUserStatus(callback) {
    const subscription = supabase
        .channel('user_status')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: 'status=eq.online'
            },
            (payload) => {
                callback(payload.new, 'ONLINE');
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'users',
                filter: 'status=eq.offline'
            },
            (payload) => {
                callback(payload.new, 'OFFLINE');
            }
        )
        .subscribe();

    return subscription;
}

/**
 * Suscribe a cambios en chats (nuevos chats creados)
 */
export function subscribeToChats(userId, callback) {
    const subscription = supabase
        .channel(`user_chats_${userId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'private_chats',
                filter: `user1_id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new, 'NEW_CHAT');
            }
        )
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'private_chats',
                filter: `user2_id=eq.${userId}`
            },
            (payload) => {
                callback(payload.new, 'NEW_CHAT');
            }
        )
        .subscribe();

    return subscription;
}

/**
 * Configuración inicial de Realtime
 */
export function initializeRealtime() {
    // Configurar Realtime global
    setupRealtime();
    
    // Configurar listeners para eventos personalizados
    window.addEventListener('newPrivateMessage', (event) => {
        console.log('Nuevo mensaje recibido:', event.detail.message);
    });
    
    window.addEventListener('privateMessageUpdated', (event) => {
        console.log('Mensaje actualizado:', event.detail);
    });
    
    window.addEventListener('privateMessageDeleted', (event) => {
        console.log('Mensaje eliminado:', event.detail.message);
    });
} 