<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl">&times;</button>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
}
</script> 