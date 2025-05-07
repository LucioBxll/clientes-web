<template>
  <div class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span><slot /></span>
  </div>
</template>

<script>
export default {
  name: 'BaseSuccess'
}
</script> 