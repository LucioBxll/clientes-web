import supabase from './supabase';

// Obtener un usuario por su ID
export const getUserById = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Crear o actualizar un usuario
export const upsertUser = async (userData) => {
    const { data, error } = await supabase
        .from('users')
        .upsert({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            avatar_url: userData.avatar_url,
            descripcion: userData.descripcion,
            last_login: new Date().toISOString(),
            status: 'online'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Actualizar el estado del usuario
export const updateUserStatus = async (userId, status) => {
    const { error } = await supabase
        .from('users')
        .update({ status, last_login: new Date().toISOString() })
        .eq('id', userId);

    if (error) throw error;
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('username');

    if (error) throw error;
    return data;
}; 