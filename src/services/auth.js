import supabase from "./supabase";
import { upsertUser, updateUserStatus } from './users';

/*
    Para manejar la comunicación del estado de autenticación entre todos los elementos del sistema (componentes, módulos,
    funciones, etc), vamos a usar el maravilloso patrón Observer.

    # Patrón de diseño Observer
    El patrón Observer define una relación de uno a muchos entre un Subject (sujeto) y múltiples Observers (observadores).
    Los observadores son elementos del sistema (clases, componentes, módulos, funciones, etc) que están interesados en
    los cambios ocurridos en el sujeto, que es otro elemento del sistema (clases, componentes, variables, etc).

    En la práctica, se necesita que el sujeto lleve una lista de los "observers". Dicho de otra forma, el observer tiene
    que pedirle al sujeto que se le notifique de los cambios que ocurre.
    Este proceso de pedir ser notificado se suele llamar "subscription" (suscripción), aunque también lo pueden ver 
    con el nombre de "listening" (escuchar) o "watch" (observar).
*/
// Definimos una variable que contenga los datos del usuario (esta sería el "subject").
let user = {
    id: null,
    email: null,
    username: null,
}

// Definimos un array para guardar la lista de observers que quieren ser notificados de los cambios en "user".
let observers = [];

/**
 * Obtiene el usuario actualmente autenticado.
 * @returns {Promise<{id: string|null, email: string|null, username: string|null}>}
 */
export async function getCurrentUser() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser) {
        user = {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0],
        };
        
        // Actualizar o crear el usuario en la tabla users
        try {
            const dbUser = await upsertUser(user);
            user = { ...user, ...dbUser };
        } catch (error) {
            console.error('Error al actualizar usuario en la base de datos:', error);
        }
        
        notifyAll();
    }
    
    return user;
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
export async function register(email, password, username) {
    try {
        // Validación básica del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Por favor, ingresa un correo electrónico válido');
        }

        // Validación de la contraseña
        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        // Validación del nombre de usuario
        if (!username || username.length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
        }

        // Creamos una cuenta usando el método signUp() de auth de supabase
        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password.trim(),
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    username: username.trim(),
                    full_name: username.trim(),
                }
            }
        });

        if (error) {
            console.error('[auth.js register] Error al crear una cuenta: ', error);
            // Mejorar los mensajes de error
            if (error.message.includes('email')) {
                throw new Error('El correo electrónico no es válido o ya está en uso');
            } else if (error.message.includes('password')) {
                throw new Error('La contraseña no cumple con los requisitos mínimos');
            } else {
                throw new Error('Error al crear la cuenta. Por favor, intenta nuevamente.');
            }
        }

        if (data?.user) {
            user = {
                id: data.user.id,
                email: data.user.email,
                username: username.trim(),
            }
            
            // Crear el usuario en la tabla users
            try {
                const dbUser = await upsertUser(user);
                user = { ...user, ...dbUser };
            } catch (error) {
                console.error('Error al crear usuario en la base de datos:', error);
            }
            
            notifyAll();
        }
        
        return data?.user;
    } catch (error) {
        console.error('[auth.js register] Error: ', error);
        throw error;
    }
}

export async function login(email, password) {
    // Creamos una cuenta usamos el método signUp() de auth de supabase.
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) {
        console.error('[auth.js login] Error al iniciar sesión: ', error);
        throw error;
    }

    user = {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
    }
    
    // Actualizar el usuario en la tabla users
    try {
        const dbUser = await upsertUser(user);
        user = { ...user, ...dbUser };
    } catch (error) {
        console.error('Error al actualizar usuario en la base de datos:', error);
    }
    
    notifyAll();
    return data.user;
}

export async function logout() {
    try {
        // Actualizar estado a offline antes de cerrar sesión
        if (user.id) {
            await updateUserStatus(user.id, 'offline');
        }
        
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Limpiar datos del usuario
        user = {
            id: null,
            email: null,
            username: null,
        };
        notifyAll();
        
        return true;
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
        throw error;
    }
}

/*----------------------------------------------------------------------
| Métodos para el observer
+-----------------------------------------------------------------------*/
/**
 * Suscribe un observer que se va a ejecutar cada vez que los datos del usuario autenticado cambien.
 * El observer debe ser una función ("callback") que va a recibir como argumento el objeto con los datos del usuario.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
export function subscribeToUserState(callback) {
    // Agregamos el callback al stack de observers.
    observers.push(callback);

    // Ejecutamos el callback para pasarle los datos actuales.
    notify(callback);
}

/**
 * Invoca un observer y le pasa los datos del usuario.
 * 
 * @param {({id: string|null, email: string|null}) => void} callback 
 */
function notify(callback) {
    callback({...user});
}

/**
 * Notifica a todos los observers.
 * Esta función debería ejecutarse cada vez que el valor de la variable "user" (nuestro subject) cambie.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
    // observers.forEach(notify);
}