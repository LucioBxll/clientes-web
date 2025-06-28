<template>
  <div 
    class="flex"
    :class="isOwnMessage ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm"
      :class="isOwnMessage 
        ? 'bg-emerald-600 text-white' 
        : 'bg-emerald-100 dark:bg-neutral-800 text-emerald-800 dark:text-white border border-emerald-200 dark:border-gray-700'"
    >
      <div class="flex items-start space-x-3">
        <Avatar 
          v-if="!isOwnMessage && message.sender?.avatar_url"
          :src="message.sender.avatar_url" 
          :alt="message.sender.username"
          :inicial-fallback="message.sender.username?.charAt(0)?.toUpperCase() || '?'"
          clase-imagen="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-emerald-400"
        />
        <div class="flex-1 min-w-0">
          <!-- Nombre del remitente (solo para mensajes ajenos) -->
          <div v-if="!isOwnMessage" class="mb-1">
            <span class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {{ message.sender?.username || 'Usuario' }}
            </span>
          </div>
          
          <!-- Contenido del mensaje -->
          <div class="mb-2">
            <p class="text-sm break-words leading-relaxed">{{ message.body }}</p>
          </div>
          
          <!-- Timestamp -->
          <div class="flex items-center justify-between">
            <time 
              class="text-xs"
              :class="isOwnMessage ? 'text-emerald-100' : 'text-gray-500 dark:text-gray-400'"
              :datetime="message.created_at"
            >
              {{ formatTime(message.created_at) }}
            </time>
            
            <!-- Indicador de estado (solo para mensajes propios) -->
            <div v-if="isOwnMessage" class="flex items-center space-x-1">
              <svg 
                v-if="message.status === 'sent'" 
                class="w-3 h-3 text-emerald-100" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <svg 
                v-else-if="message.status === 'delivered'" 
                class="w-3 h-3 text-emerald-100" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg 
                v-else 
                class="w-3 h-3 text-emerald-100" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Avatar from './Avatar.vue';

// Props
const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  }
});

// Computed
const isOwnMessage = computed(() => {
  return props.message.sender_id === props.currentUserId;
});

// Métodos
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};
</script> 