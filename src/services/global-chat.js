import supabase from './supabase';
import { getCurrentUser } from './auth';
import { upsertUser } from './users';

/**
 * Trae los últimos mensajes de la base de datos.
 * 
 * @returns {Promise<{id: number, email: string, body: string|null, created_at: string}[]>}
 */
export async function loadLastGlobalChatMessages() {
    try {
        const { data, error } = await supabase
            .from('global_chat')
            .select('id, username, body, created_at, user_id, image_url')
            .order('created_at', { ascending: false })
            .limit(50);

        if(error) {
            console.error('[global-chat.js loadLastGlobalChatMessage] Error al traer los mensajes: ', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('[global-chat.js loadLastGlobalChatMessage] Error: ', error);
        throw error;
    }
}

/**
 * Graba un nuevo mensaje de chat.
 * 
 * @param {{body: string}} data 
 * @returns {Promise}
 */
export async function saveGlobalChatMessage(data) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            await upsertUser(currentUser);
        } catch (error) {
            console.error('[global-chat.js saveGlobalChatMessage] Error al asegurar usuario en la base de datos:', error);
            throw new Error('Error al verificar el usuario');
        }

        const { data: savedMessage, error } = await supabase
            .from('global_chat')
            .insert({
                email: currentUser.email,
                username: currentUser.username || currentUser.email.split('@')[0],
                body: data.body,
                user_id: currentUser.id,
                image_url: data.image_url || null
            })
            .select('id, username, body, created_at, user_id, image_url')
            .single();

        if(error) {
            console.error('[global-chat.js saveGlobalChatMessage] Error al insertar el registro: ', error);
            throw error;
        }

        return savedMessage;
    } catch (error) {
        console.error('[global-chat.js saveGlobalChatMessage] Error: ', error);
        throw error;
    }
}

/**
 * Se suscribe para recibir los nuevos mensajes de chat.
 * 
 * @param {({}) => void} callback
 * @returns Promise
 */
export async function subscribeToGlobalChatNewMessages(callback) {
    try {
        const chatChannel = supabase.channel('global-chat', {
            config: {
                broadcast: {
                    self: true,
                },
            },
        });
        
        chatChannel.on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'global_chat',
            },
            data => {
                callback(data.new);
            }
        );
        
        chatChannel.subscribe();
    } catch (error) {
        console.error('[global-chat.js subscribeToGlobalChatNewMessages] Error: ', error);
        throw error;
    }
}

export async function updateMessage(messageId, newBody) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser.id) {
            throw new Error('Usuario no autenticado');
        }

        const { data, error } = await supabase
            .from('global_chat')
            .update({ body: newBody })
            .eq('id', messageId)
            .eq('user_id', currentUser.id)
            .select('id, username, body, created_at, user_id')
            .single();

        if(error) {
            console.error('[global-chat.js updateMessage] Error al actualizar el mensaje: ', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('[global-chat.js updateMessage] Error: ', error);
        throw error;
    }
}

export async function deleteMessage(messageId) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser.id) {
            throw new Error('Usuario no autenticado');
        }

        const { error } = await supabase
            .from('global_chat')
            .delete()
            .eq('id', messageId)
            .eq('user_id', currentUser.id);

        if(error) {
            console.error('[global-chat.js deleteMessage] Error al eliminar el mensaje: ', error);
            throw error;
        }

        return true;
    } catch (error) {
        console.error('[global-chat.js deleteMessage] Error: ', error);
        throw error;
    }
}

// Agregar un comentario a una publicación del chat global
export async function agregarComentarioAGlobalChat(mensajeId, comentario, usuario) {
    const { data, error } = await supabase
        .from('global_chat_comments')
        .insert({
            mensaje_id: mensajeId,
            user_id: usuario.id,
            username: usuario.username || usuario.email.split('@')[0],
            body: comentario,
            created_at: new Date().toISOString(),
            avatar_url: usuario.avatar_url || null
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Obtener comentarios de una publicación
export async function obtenerComentariosDeMensaje(mensajeId) {
    const { data, error } = await supabase
        .from('global_chat_comments')
        .select('*')
        .eq('mensaje_id', mensajeId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

// Actualizar el username en todas las publicaciones de un usuario
export async function updateUsernameInMessages(userId, newUsername) {
    const { error } = await supabase
        .from('global_chat')
        .update({ username: newUsername })
        .eq('user_id', userId);
    if (error) throw error;
}

export async function getMessagesByUserId(userId) {
    const { data, error } = await supabase
        .from('global_chat')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

// Nueva función: obtener mensajes con comentarios usando join
export async function getMessagesWithComments() {
    const { data, error } = await supabase
        .from('global_chat')
        .select('*, comentarios(*)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

