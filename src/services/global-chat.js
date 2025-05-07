import supabase from './supabase';
import { getCurrentUser } from './auth';
import { upsertUser } from './users';
/*
    # Broadcast vs Postgres Changes
    -------------------------------
    Para hacer un chat como el que estamos buscando crear, con Supabase tenemos dos APIs que podemos usar, ambas del servicio
    Realtime:
    1. Broadcast
    2. Postgres Changes

    Broadcast tiene algunas ventajas importantes:
    - Mayor performance, especialmente a mayor volumen de usuarios suscritos.
    - Muy simple de usar. Ni siquiera necesitamos configurar nada especial en el backend.

    Dicho esto, tiene una gran contra:
    - No incluye ningún tipo de persistencia de los datos.

    Como en un chat es probable que queramos mantener un historial de los mensajes enviados, Broadcast no es la mejor 
    alternativa.
    Por esta razón, vamos a migrar a usar Postgres.

    Lo primero que vamos a necesitar, es crear una tabla en nuestra base de datos de Supabase.
    La tabla que vamos a crear va a llamarse "global_chat" y va a estar en el schema "public".
*/
// Versión con "Postgres Changes".
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

        return data.reverse(); // Invertimos el orden para mostrar los más antiguos primero
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
        // Verificar que el usuario esté autenticado
        const currentUser = await getCurrentUser();
        if (!currentUser.id) {
            throw new Error('Usuario no autenticado');
        }

        // Asegurarnos de que el usuario existe en la tabla users
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

        console.log('[global-chat.js saveGlobalChatMessage] Mensaje guardado: ', savedMessage);
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
                console.log('[global-chat.js subscribeToGlobalChatNewMessages] Nuevo mensaje recibido: ', data.new);
                callback(data.new);
            }
        );
        
        chatChannel.subscribe();
        console.log('[global-chat.js subscribeToGlobalChatNewMessages] Suscrito a nuevos mensajes');
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

// Versión con "Broadcast".
// Seteamos un "listener" para recibir los mensajes emitidos en tiempo real por el "canal" "global-chat" 
// (nombre arbitrario).
// const globalChatChannel = supabase.channel('global-chat', {
//     config: {
//         broadcast: { self: true },
//     }
// });

// /**
//  * Graba un nuevo mensaje de chat.
//  * 
//  * @param {{id: string|number, email: string, body: string, created_at: string}} data 
//  * @returns Promise
//  */
// export async function saveGlobalChatMessage(data) {
//     const res = await globalChatChannel.send({
//         type: 'broadcast',
//         event: 'new-message', // El mismo que estén escuchando abajo.
//         payload: {
//             ...data,
//         }
//     });
// }

// /**
//  * Se suscribe para recibir los nuevos mensajes de chat.
//  * 
//  * @param {({}) => void} callback
//  * @returns Promise
//  */
// export async function subscribeToGlobalChatNewMessages(callback) {
//     // Definimos que se escuche el evento de emisión "new-message" (nombre arbitrario).
//     globalChatChannel.on(
//         'broadcast', // Esto es fijo para nuestro caso.
//         {
//             event: 'new-message', // Acá es lo que quieran.
//         },
//         data => {
//             console.log("Data recibida en tiempo real: ", data);
//             // Invocamos el callback que recibimos como argumento de la función.
//             callback(data.payload);
//         } // El callback para cada mensaje recibido.
//     );
//     // Nos suscribimos al canal.
//     globalChatChannel.subscribe();
// }