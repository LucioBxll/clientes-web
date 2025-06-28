<template>
  <button
    @click="openPrivateChat"
    :disabled="loading || isCurrentUser"
    class="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
  >
    <svg 
      v-if="!loading" 
      class="w-4 h-4 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      ></path>
    </svg>
    <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  targetUserId: {
    type: String,
    required: true
  },
  currentUserId: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Composables
const router = useRouter();

// Computed
const isCurrentUser = computed(() => {
  return props.currentUserId === props.targetUserId;
});

const buttonText = computed(() => {
  if (props.loading) return 'Cargando...';
  if (isCurrentUser.value) return 'Este eres tú';
  return 'Chat privado';
});

// Métodos
const openPrivateChat = async () => {
  try {
    if (!props.currentUserId) {
      router.push('/ingresar');
      return;
    }

    if (isCurrentUser.value) {
      return; // No permitir chat consigo mismo
    }

    router.push(`/chat-privado/${props.targetUserId}`);
  } catch (error) {
    console.error('Error al abrir chat privado:', error);
  }
};
</script> 