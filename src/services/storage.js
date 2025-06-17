import supabase from './supabase';

// Sube un archivo a un bucket y retorna la URL pública
export async function uploadFileToBucket(bucket, file, pathPrefix = '') {
  if (!file) throw new Error('No se proporcionó archivo');
  const extension = file.name.split('.').pop();
  const nombreArchivo = `${pathPrefix}${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(nombreArchivo, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo);
  return data.publicUrl;
}

// Sube un avatar de usuario y retorna la URL pública
export async function uploadUserAvatar(userId, file) {
  return uploadFileToBucket('avatars', file, `${userId}/`);
}

// Sube una imagen de publicación y retorna la URL pública
export async function uploadPublicationImage(file) {
  return uploadFileToBucket('publicaciones', file);
} 