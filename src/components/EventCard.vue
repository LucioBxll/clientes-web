<template>
  <div class="p-3 rounded-lg bg-emerald-50 dark:bg-gray-700 border border-emerald-200 dark:border-gray-600">
    <div class="flex items-center justify-between">
      <span class="font-medium text-gray-700 dark:text-gray-300">{{ evento.titulo }}</span>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ evento.hora }}</span>
        <button 
          @click="$emit('eliminar', evento.id)"
          class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ evento.descripcion }}</p>
  </div>
</template>

<script>
export default {
  name: 'EventCard',
  props: {
    evento: Object
  }
}
</script> 