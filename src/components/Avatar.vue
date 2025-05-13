<template>
  <div class="inline-block align-middle">
    <img v-if="src" :src="src" :alt="alt" :class="claseImagen" @error="alError" />
    <div v-else :class="[claseImagen, 'flex items-center justify-center bg-primary-600 text-white font-bold']">
      <span>{{ inicialFallback }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: { type: String, default: null },
    alt: { type: String, default: 'Avatar' },
    inicialFallback: { type: String, default: '?' },
    claseImagen: { type: String, default: 'rounded-full w-10 h-10 object-cover object-center border-2 border-emerald-200 dark:border-emerald-600' }
  },
  methods: {
    alError(e) {
      e.target.style.display = 'none';
      // fallback a las iniciales
      this.$emit('error');
    }
  }
}
</script> 