<template>
  <div>
    <img v-if="src" :src="src" :alt="alt" :class="imgClass" @error="onError" />
    <div v-else :class="[imgClass, 'flex items-center justify-center bg-primary-600 text-white font-bold']">
      <span>{{ fallbackInitial }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: { type: String, default: null },
    alt: { type: String, default: 'Avatar' },
    fallbackInitial: { type: String, default: '?' },
    imgClass: { type: String, default: 'rounded-full w-16 h-16 object-cover' }
  },
  methods: {
    onError(e) {
      e.target.style.display = 'none';
      // fallback a las iniciales
      this.$emit('error');
    }
  }
}
</script> 