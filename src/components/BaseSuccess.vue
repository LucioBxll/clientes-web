<template>
  <div class="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
    <CheckCircleIcon class="w-5 h-5 flex-shrink-0" />
    <span><slot /></span>
  </div>
</template>

<script>
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
export default {
  name: 'BaseSuccess',
  components: { CheckCircleIcon }
}
</script> 