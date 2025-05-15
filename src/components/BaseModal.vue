<template>
  <div class="fixed inset-0 bg-neutral-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-emerald-200 dark:bg-neutral-950 rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl">
        <XMarkIcon class="w-6 h-6" />
      </button>
      <slot />
    </div>
  </div>
</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/outline';
export default {
  name: 'BaseModal',
  components: { XMarkIcon },
}
</script> 