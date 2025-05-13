<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getUserById } from '../services/users';
import supabase from '../services/supabase';
import Avatar from '../components/Avatar.vue';
import MessageItem from '../components/MessageItem.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseAlert from '../components/BaseAlert.vue';

export default {
  name: 'ProfileFeed',
  components: { Avatar, MessageItem, BaseLoader, BaseAlert },
  setup() {
    const route = useRoute();
    const userId = route.params.id;
    const usuario = ref(null);
    const mensajes = ref([]);
    const cargando = ref(true);
    const mensajeError = ref(null);

    const cargarDatos = async () => {
      const inicio = Date.now();
      try {
        cargando.value = true;
        usuario.value = await getUserById(userId);
        // Cargar publicaciones de este usuario
        const { data, error } = await supabase
          .from('global_chat')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        mensajes.value = data;
      } catch (error) {
        mensajeError.value = 'Error al cargar el perfil: ' + (error.message || 'Error desconocido');
      } finally {
        const duracion = Date.now() - inicio;
        const restante = 3000 - duracion;
        setTimeout(() => { cargando.value = false; }, restante > 0 ? restante : 0);
      }
    };

    onMounted(cargarDatos);

    return { usuario, mensajes, cargando, mensajeError };
  }
};
</script>

<template>
  <div class="min-h-screen bg-blue-50 dark:bg-neutral-950 flex flex-col items-center">
    <div class="w-full max-w-2xl flex flex-col min-h-screen relative">
      <header class="sticky top-0 bg-white dark:bg-neutral-950 z-10 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4">
        <Avatar
          v-if="usuario"
          :src="usuario.avatar_url"
          :alt="'Avatar de ' + (usuario.username || usuario.email)"
          :fallback-initial="usuario.username?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'"
          img-class="h-14 w-14 rounded-full object-cover border-2 border-blue-400"
        />
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ usuario?.username || usuario?.email }}</h1>
          <div class="text-gray-500 dark:text-gray-300">@{{ usuario?.username || usuario?.email?.split('@')[0] }}</div>
        </div>
      </header>
      <BaseLoader v-if="cargando" />
      <BaseAlert v-if="mensajeError" type="error" class="mb-2">{{ mensajeError }}</BaseAlert>
      <section v-if="!cargando && mensajes.length" class="flex-1 p-4 space-y-6 bg-emerald-50 dark:bg-neutral-950">
        <ul class="flex flex-col gap-6" aria-live="polite" aria-label="Publicaciones del usuario">
          <MessageItem
            v-for="mensaje in mensajes"
            :key="mensaje.id"
            :mensaje="mensaje"
          >
            <template #avatar>
              <Avatar
                v-if="mensaje.user_id"
                :src="usuario.avatar_url"
                :alt="'Avatar de ' + (usuario.username || usuario.email)"
                :fallback-initial="usuario.username?.charAt(0)?.toUpperCase() || usuario.email?.charAt(0)?.toUpperCase() || '?'"
                img-class="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
              />
            </template>
          </MessageItem>
        </ul>
      </section>
      <div v-if="!cargando && mensajes.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-300">
        Este usuario aún no tiene publicaciones.
      </div>
    </div>
  </div>
</template> 