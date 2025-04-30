<script>
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../services/auth';

export default {
    name: 'Profile',
    setup() {
        const user = ref(null);
        const loading = ref(true);

        onMounted(async () => {
            try {
                user.value = await getCurrentUser();
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            } finally {
                loading.value = false;
            }
        });

        return {
            user,
            loading
        };
    }
};
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900 py-8">
        <div class="max-w-3xl mx-auto">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-200">
                <div class="px-4 py-5 sm:px-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user?.email }}</dd>
                        </div>
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre de usuario</dt>
                            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user?.username }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template> 