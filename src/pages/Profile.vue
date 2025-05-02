<script>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../services/auth';
import Avatar from '../components/Avatar.vue';
import supabase from '../services/supabase';
import { upsertUser } from '../services/users';
import { loadLastGlobalChatMessages } from '../services/global-chat';

export default {
    name: 'Profile',
    components: { Avatar },
    setup() {
        const user = ref(null);
        const loading = ref(true);
        const uploading = ref(false);
        const error = ref('');
        const newAvatarFile = ref(null);
        const avatarInput = ref(null);
        const hovering = ref(false);
        const publicaciones = ref([]);

        onMounted(async () => {
            try {
                user.value = await getCurrentUser();
                // Traer mensajes del chat global de este usuario
                const allMessages = await loadLastGlobalChatMessages();
                publicaciones.value = allMessages.filter(msg => msg.user_id === user.value.id);
            } catch (err) {
                error.value = 'Error al cargar el perfil';
            } finally {
                loading.value = false;
            }
        });

        const handleAvatarChange = (e) => {
            newAvatarFile.value = e.target.files[0];
            if (newAvatarFile.value) {
                uploadNewAvatar();
            }
        };

        const triggerAvatarInput = () => {
            if (avatarInput.value) avatarInput.value.click();
        };

        const uploadNewAvatar = async () => {
            if (!newAvatarFile.value || !user.value?.id) return;
            uploading.value = true;
            error.value = '';
            try {
                // Subir imagen
                const file = newAvatarFile.value;
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.value.id}/${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, file, { upsert: true });
                if (uploadError) throw uploadError;
                const { data: publicUrlData } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(fileName);
                const avatarUrl = publicUrlData.publicUrl;
                // Actualizar usuario en la base
                await upsertUser({ ...user.value, avatar_url: avatarUrl });
                user.value.avatar_url = avatarUrl;
                newAvatarFile.value = null;
            } catch (err) {
                error.value = 'Error al subir la imagen de perfil';
            } finally {
                uploading.value = false;
            }
        };

        return {
            user,
            loading,
            error,
            newAvatarFile,
            uploading,
            handleAvatarChange,
            uploadNewAvatar,
            avatarInput,
            triggerAvatarInput,
            hovering,
            publicaciones
        };
    }
};
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900 py-8">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-200 p-6">
                <!-- Tarjeta superior: foto + datos + acciones -->
                <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600 mb-6">
                  <div class="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 md:items-start">
                    <!-- Foto -->
                    <div class="flex justify-center items-center pt-2 md:justify-start md:items-start">
                        <div class="relative group" @mouseenter="hovering = true" @mouseleave="hovering = false">
                            <Avatar
                                :src="user?.avatar_url"
                                :alt="'Avatar de ' + (user?.username || user?.email)"
                                :fallback-initial="user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'"
                                img-class="rounded-full w-24 h-24 object-cover border-4 border-blue-300 dark:border-blue-700 shadow cursor-pointer"
                                @click="triggerAvatarInput"
                            />
                            <input
                                ref="avatarInput"
                                type="file"
                                id="new-avatar"
                                accept="image/*"
                                @change="handleAvatarChange"
                                class="hidden"
                                :disabled="uploading"
                            />
                            <div v-if="hovering && !uploading" class="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-pointer"
                                @click="triggerAvatarInput">
                                <span class="text-white text-center text-xs font-semibold select-none pointer-events-none">
                                    {{ user?.avatar_url ? 'Editar imagen de perfil' : 'Añadir imagen de perfil' }}
                                </span>
                            </div>
                            <div v-if="uploading" class="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full transition-opacity cursor-wait">
                                <span class="text-white text-center text-xs font-semibold select-none">Subiendo...</span>
                            </div>
                        </div>
                    </div>
                    <!-- Datos usuario y acciones -->
                    <div class="flex flex-col justify-start gap-1 items-start mt-2 w-full md:items-start md:mt-2">
                        <span class="text-lg font-bold text-gray-900 dark:text-white break-all">{{ user?.username }}</span>
                        <span class="text-base text-blue-700 dark:text-blue-300 break-all underline flex items-center">
                          <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span class="hidden sm:inline">{{ user?.email }}</span>
                        </span>
                        <div class="flex flex-row gap-2 mt-2 w-full">
                          <button @click="triggerAvatarInput" class="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Editar</button>
                          <button @click="handleLogout" class="flex-1 px-2 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">Cerrar sesión</button>
                        </div>
                    </div>
                  </div>
                </div>
                <!-- Publicaciones -->
                <div class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-600">
                    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Publicaciones</h3>
                    <div v-if="publicaciones.length === 0" class="text-center text-gray-500 dark:text-gray-400">No hay publicaciones aún.</div>
                    <ul v-else class="flex flex-col gap-4">
                        <li v-for="pub in publicaciones" :key="pub.id" class="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <Avatar
                                  :src="user?.avatar_url"
                                  :alt="'Avatar de ' + (user?.username || user?.email)"
                                  :fallback-initial="user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'"
                                  img-class="h-8 w-8 rounded-full object-cover border-2 border-blue-400"
                                />
                                <span class="font-semibold text-primary-700 dark:text-primary-400">{{ user?.username }}</span>
                                <span class="text-xs text-gray-500 ml-auto">{{ new Date(pub.created_at).toLocaleString() }}</span>
                            </div>
                            <div class="text-gray-900 dark:text-white">{{ pub.body }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template> 