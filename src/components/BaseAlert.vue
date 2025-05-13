<template>
  <div :class="alertClass" role="alert">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    type: {
      type: String,
      default: 'error' // 'error', 'success', 'info', etc.
    }
  },
  computed: {
    alertClass() {
      switch (this.type) {
        case 'success':
          return 'mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm';
        case 'info':
          return 'mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm';
        default:
          return 'mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm';
      }
    }
  }
}
</script> 