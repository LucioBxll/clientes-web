<template>
  <transition name="fade-slide-left">
    <div v-if="visible" :class="[alertClass, 'fixed top-6 left-6 z-50 shadow-lg flex items-center gap-4 min-w-[260px] max-w-xs']" role="alert">
      <slot />
      <button @click="closeAlert" class="ml-auto text-lg font-bold text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none">&times;</button>
    </div>
  </transition>
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
  data() {
    return {
      visible: true
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
  },
  methods: {
    closeAlert() {
      this.visible = false;
    }
  }
}
</script>

<style scoped>
.fade-slide-left-enter-active, .fade-slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-left-enter-from, .fade-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.fade-slide-left-enter-to, .fade-slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style> 