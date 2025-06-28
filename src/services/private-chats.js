import supabase from './supabase';
import { subscribeToChat, unsubscribeFromChat } from './realtime';

// Cache para IDs de chat en localStorage
const CHAT_CACHE_KEY = 'private_chat_cache';

/**
 * Obtiene el cache de chats desde localStorage
 */
function getChatCache() {
    try {
        const cached = localStorage.getItem(CHAT_CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (error) {
        console.error('Error al obtener cache de chats:', error);
        return {};
    }
}

/**
 * Guarda el cache de chats en localStorage
 */
function setChatCache(cache) {
    try {
        localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error al guardar cache de chats:', error);
    }
}

/**
 * Genera una clave única para el chat entre dos usuarios
 * Ordena los IDs para consistencia
 */
function getChatKey(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

/**
 * Obtiene o crea un chat privado entre dos usuarios
 */
export async function getPrivateChat(sender_id, receiver_id) {
    try {
        const chatKey = getChatKey(sender_id, receiver_id);
        const cache = getChatCache();
        
        // Verificar cache primero
        if (cache[chatKey]) {
            // Si tenemos el ID en cache, buscar el chat completo
            const { data, error } = await supabase
                .from('private_chats')
                .select('*')
                .eq('id', cache[chatKey])
                .single();
            
            if (error) {
                // Si hay error, limpiar cache y continuar
                delete cache[chatKey];
                setChatCache(cache);
            } else {
                return data;
            }
        }

        // Buscar chat existente
        let chat = await fetchPrivateChat(sender_id, receiver_id);
        
        if (!chat) {
            // Crear nuevo chat si no existe
            chat = await createPrivateChat(sender_id, receiver_id);
        }

        // Actualizar cache
        if (chat) {
            cache[chatKey] = chat.id;
            setChatCache(cache);
        }

        return chat;
    } catch (error) {
        console.error('Error al obtener chat privado:', error);
        throw error;
    }
}

/**
 * Busca un chat privado existente entre dos usuarios
 */
export async function fetchPrivateChat(sender_id, receiver_id) {
    try {
        const sortedIds = [sender_id, receiver_id].sort();
        
        const { data, error } = await supabase
            .from('private_chats')
            .select('*')
            .or(`user1_id.eq.${sortedIds[0]},user1_id.eq.${sortedIds[1]}`)
            .or(`user2_id.eq.${sortedIds[0]},user2_id.eq.${sortedIds[1]}`)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error al buscar chat privado:', error);
        return null;
    }
}

/**
 * Crea un nuevo chat privado entre dos usuarios
 */
export async function createPrivateChat(sender_id, receiver_id) {
    try {
        const sortedIds = [sender_id, receiver_id].sort();
        
        const { data, error } = await supabase
            .from('private_chats')
            .insert({
                user1_id: sortedIds[0],
                user2_id: sortedIds[1],
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error al crear chat privado:', error);
        throw error;
    }
}

/**
 * Envía un mensaje en un chat privado
 */
export async function sendPrivateChatMessage(sender_id, receiver_id, body) {
    try {
        // Obtener o crear el chat
        const chat = await getPrivateChat(sender_id, receiver_id);
        
        if (!chat) {
            throw new Error('No se pudo obtener el chat privado');
        }

        // Enviar el mensaje
        const { data, error } = await supabase
            .from('private_messages')
            .insert({
                chat_id: chat.id,
                sender_id: sender_id,
                receiver_id: receiver_id,
                body: body.trim(),
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error al enviar mensaje privado:', error);
        throw error;
    }
}

/**
 * Obtiene los últimos mensajes de un chat privado
 */
export async function fetchLastPrivateChatMessages(sender_id, receiver_id, limit = 50) {
    try {
        const chat = await getPrivateChat(sender_id, receiver_id);
        
        if (!chat) {
            return [];
        }

        const { data, error } = await supabase
            .from('private_messages')
            .select(`
                *,
                sender:users!private_messages_sender_id_fkey(
                    id,
                    username,
                    avatar_url
                )
            `)
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        // Ordenar por fecha ascendente para mostrar cronológicamente
        return data.reverse();
    } catch (error) {
        console.error('Error al obtener mensajes privados:', error);
        return [];
    }
}

/**
 * Suscribe a nuevos mensajes en tiempo real
 */
export function subscribeToPrivateChatNewMessages(sender_id, receiver_id, callback) {
    try {
        const chatKey = getChatKey(sender_id, receiver_id);
        const cache = getChatCache();
        const chatId = cache[chatKey];

        if (!chatId) {
            console.warn('No se encontró ID de chat en cache para suscripción');
            return null;
        }

        // Usar el nuevo servicio de Realtime
        return subscribeToChat(chatId, callback);
    } catch (error) {
        console.error('Error al suscribirse a mensajes privados:', error);
        return null;
    }
}

/**
 * Desuscribe de mensajes en tiempo real
 */
export function unsubscribeFromPrivateChatMessages(chatId) {
    try {
        unsubscribeFromChat(chatId);
    } catch (error) {
        console.error('Error al desuscribirse de mensajes privados:', error);
    }
}

/**
 * Limpia el cache de chats
 */
export function clearChatCache() {
    try {
        localStorage.removeItem(CHAT_CACHE_KEY);
    } catch (error) {
        console.error('Error al limpiar cache de chats:', error);
    }
}

/**
 * Obtiene todos los chats privados de un usuario
 */
export async function getUserPrivateChats(userId) {
    try {
        const { data, error } = await supabase
            .from('private_chats')
            .select(`
                *,
                user1:users!private_chats_user1_id_fkey(
                    id,
                    username,
                    avatar_url,
                    status
                ),
                user2:users!private_chats_user2_id_fkey(
                    id,
                    username,
                    avatar_url,
                    status
                )
            `)
            .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Procesar los datos para obtener el otro usuario y el último mensaje recibido
        const chatsWithLastMessage = await Promise.all(
            data.map(async (chat) => {
                const otherUser = chat.user1_id === userId ? chat.user2 : chat.user1;
                
                // Obtener el último mensaje del chat (enviado o recibido)
                const { data: lastMessageData, error: lastMessageError } = await supabase
                    .from('private_messages')
                    .select(`
                        id,
                        body,
                        created_at,
                        sender_id,
                        receiver_id
                    `)
                    .eq('chat_id', chat.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                let lastMessage = null;
                if (!lastMessageError && lastMessageData) {
                    lastMessage = lastMessageData;
                }

                // Obtener el conteo de mensajes no leídos
                const { count: unreadCount, error: unreadError } = await supabase
                    .from('private_messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', chat.id)
                    .eq('receiver_id', userId)
                    .is('read_at', null);

                return {
                    id: chat.id,
                    otherUser: otherUser,
                    lastMessage: lastMessage,
                    unreadCount: unreadCount || 0,
                    updatedAt: chat.updated_at,
                    createdAt: chat.created_at
                };
            })
        );

        return chatsWithLastMessage;
    } catch (error) {
        console.error('Error al obtener chats del usuario:', error);
        return [];
    }
}

/**
 * Obtiene el número de mensajes no leídos en un chat
 */
export async function getUnreadMessageCount(chatId, userId) {
    try {
        const { count, error } = await supabase
            .from('private_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chatId)
            .eq('receiver_id', userId)
            .is('read_at', null);

        if (error) {
            throw error;
        }

        return count || 0;
    } catch (error) {
        console.error('Error al obtener mensajes no leídos:', error);
        return 0;
    }
}

/**
 * Marca mensajes como leídos
 */
export async function markMessagesAsRead(chatId, userId) {
    try {
        const { error } = await supabase
            .from('private_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('chat_id', chatId)
            .eq('receiver_id', userId)
            .is('read_at', null);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        return false;
    }
}

/**
 * Marca todos los mensajes de un chat como leídos
 */
export async function markChatAsRead(chatId, userId) {
    try {
        const { error } = await supabase
            .from('private_messages')
            .update({ read_at: new Date().toISOString() })
            .eq('chat_id', chatId)
            .eq('receiver_id', userId)
            .is('read_at', null);

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        return false;
    }
} 